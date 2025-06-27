// ================================
// SISTEMA DE USUARIOS Y AUDITORÍA
// ================================

class UserManager {
    constructor() {
        this.currentUser = null;
        this.syncInterval = null;
        this.initializeSystem();
    }

    initializeSystem() {
        // Cargar usuario actual si existe
        this.loadCurrentUser();
        
        // Iniciar sincronización automática
        if (APP_CONFIG.AUTO_SYNC) {
            this.startAutoSync();
        }
        
        // Registrar actividad de página
        this.logActivity('PAGE_LOAD', { url: window.location.href });
    }

    // ================================
    // GESTIÓN DE USUARIOS
    // ================================

    async login(password, username = null) {
        try {
            let userRole = null;
            let userId = null;

            // Verificar tipo de usuario
            if (password === APP_CONFIG.SUPER_ADMIN_PASSWORD) {
                userRole = APP_CONFIG.USER_ROLES.SUPER_ADMIN;
                userId = 'superadmin';
            } else if (password === 'ospadep2024') {
                userRole = APP_CONFIG.USER_ROLES.ADMIN;
                userId = username || `admin_${Date.now()}`;
            } else {
                throw new Error('Credenciales inválidas');
            }

            // Crear sesión de usuario
            this.currentUser = {
                id: userId,
                role: userRole,
                loginTime: new Date().toISOString(),
                lastActivity: new Date().toISOString(),
                sessionId: this.generateSessionId()
            };

            // Guardar sesión
            this.saveUserSession();

            // Registrar login en auditoría
            this.logActivity('USER_LOGIN', {
                userId: userId,
                role: userRole,
                timestamp: new Date().toISOString()
            });

            return {
                success: true,
                user: this.currentUser
            };

        } catch (error) {
            this.logActivity('LOGIN_FAILED', {
                error: error.message,
                timestamp: new Date().toISOString()
            });
            throw error;
        }
    }

    logout() {
        if (this.currentUser) {
            this.logActivity('USER_LOGOUT', {
                userId: this.currentUser.id,
                sessionDuration: this.getSessionDuration()
            });
        }

        this.currentUser = null;
        localStorage.removeItem('ospadep_user_session');
        this.stopAutoSync();
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null && this.isSessionValid();
    }

    isSuperAdmin() {
        return this.currentUser && this.currentUser.role === APP_CONFIG.USER_ROLES.SUPER_ADMIN;
    }

    isAdmin() {
        return this.currentUser && (
            this.currentUser.role === APP_CONFIG.USER_ROLES.ADMIN ||
            this.currentUser.role === APP_CONFIG.USER_ROLES.SUPER_ADMIN
        );
    }

    // ================================
    // GESTIÓN DE SESIONES
    // ================================

    saveUserSession() {
        if (this.currentUser) {
            localStorage.setItem('ospadep_user_session', JSON.stringify(this.currentUser));
        }
    }

    loadCurrentUser() {
        const saved = localStorage.getItem('ospadep_user_session');
        if (saved) {
            try {
                const user = JSON.parse(saved);
                if (this.isSessionValid(user)) {
                    this.currentUser = user;
                    this.updateLastActivity();
                } else {
                    localStorage.removeItem('ospadep_user_session');
                }
            } catch (error) {
                localStorage.removeItem('ospadep_user_session');
            }
        }
    }

    isSessionValid(user = this.currentUser) {
        if (!user || !user.loginTime) return false;
        
        const loginTime = new Date(user.loginTime);
        const now = new Date();
        const sessionAge = (now - loginTime) / 1000 / 60; // minutos
        
        return sessionAge < APP_CONFIG.SESSION_TIMEOUT;
    }

    updateLastActivity() {
        if (this.currentUser) {
            this.currentUser.lastActivity = new Date().toISOString();
            this.saveUserSession();
        }
    }

    getSessionDuration() {
        if (!this.currentUser || !this.currentUser.loginTime) return 0;
        
        const start = new Date(this.currentUser.loginTime);
        const end = new Date();
        return Math.round((end - start) / 1000 / 60); // minutos
    }

    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // ================================
    // SISTEMA DE AUDITORÍA
    // ================================

    logActivity(action, details = {}) {
        const logEntry = {
            id: Date.now(),
            action: action,
            userId: this.currentUser ? this.currentUser.id : 'anonymous',
            userRole: this.currentUser ? this.currentUser.role : 'none',
            timestamp: new Date().toISOString(),
            details: details,
            sessionId: this.currentUser ? this.currentUser.sessionId : null,
            url: window.location.href,
            userAgent: navigator.userAgent.substr(0, 100) // Limitar longitud
        };

        // Guardar en localStorage
        this.saveToAuditLog(logEntry);

        // En modo desarrollo, mostrar en consola
        if (APP_CONFIG.ENVIRONMENT === 'development') {
            console.log('🔍 Auditoría:', logEntry);
        }
    }

    saveToAuditLog(entry) {
        let auditLog = JSON.parse(localStorage.getItem('ospadep_audit_log') || '[]');
        
        auditLog.push(entry);
        
        // Mantener solo los últimos registros según configuración
        if (auditLog.length > APP_CONFIG.MAX_AUDIT_RECORDS) {
            auditLog = auditLog.slice(-APP_CONFIG.MAX_AUDIT_RECORDS);
        }
        
        localStorage.setItem('ospadep_audit_log', JSON.stringify(auditLog));
    }

    getAuditLog(filters = {}) {
        const auditLog = JSON.parse(localStorage.getItem('ospadep_audit_log') || '[]');
        
        let filteredLog = auditLog;
        
        // Aplicar filtros
        if (filters.userId) {
            filteredLog = filteredLog.filter(entry => entry.userId === filters.userId);
        }
        
        if (filters.action) {
            filteredLog = filteredLog.filter(entry => entry.action === filters.action);
        }
        
        if (filters.dateFrom) {
            filteredLog = filteredLog.filter(entry => new Date(entry.timestamp) >= new Date(filters.dateFrom));
        }
        
        if (filters.dateTo) {
            filteredLog = filteredLog.filter(entry => new Date(entry.timestamp) <= new Date(filters.dateTo));
        }
        
        // Ordenar por fecha descendente
        return filteredLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    exportAuditLog() {
        const auditLog = this.getAuditLog();
        const exportData = {
            exportDate: new Date().toISOString(),
            totalRecords: auditLog.length,
            records: auditLog
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `ospadep_auditoria_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        
        this.logActivity('AUDIT_EXPORT', { recordCount: auditLog.length });
    }

    // ================================
    // SINCRONIZACIÓN
    // ================================

    startAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        this.syncInterval = setInterval(() => {
            this.syncData();
        }, APP_CONFIG.SYNC_INTERVAL);
    }

    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    async syncData() {
        try {
            // Por ahora, sincronización local usando timestamp
            const lastSync = localStorage.getItem('ospadep_last_sync');
            const currentData = {
                prices: JSON.parse(localStorage.getItem('ospadep_custom_prices') || '{}'),
                plans: JSON.parse(localStorage.getItem('ospadep_custom_plans') || '{}'),
                timestamp: Date.now()
            };
            
            // En el futuro, aquí iría la llamada al servidor
            // await this.syncWithServer(currentData);
            
            localStorage.setItem('ospadep_last_sync', currentData.timestamp.toString());
            
        } catch (error) {
            console.error('Error en sincronización:', error);
        }
    }

    // Para implementación futura con servidor
    async syncWithServer(data) {
        // Esta función se implementará cuando tengamos backend
        if (APP_CONFIG.API_BASE_URL && APP_CONFIG.SYNC_ENDPOINT) {
            try {
                const response = await fetch(APP_CONFIG.API_BASE_URL + APP_CONFIG.SYNC_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.getApiToken()}`
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    const serverData = await response.json();
                    return serverData;
                }
            } catch (error) {
                console.error('Error sincronizando con servidor:', error);
            }
        }
        return null;
    }

    getApiToken() {
        return this.currentUser ? this.currentUser.sessionId : null;
    }

    // ================================
    // ESTADÍSTICAS PARA SUPERADMIN
    // ================================

    getUserStats() {
        const auditLog = this.getAuditLog();
        const stats = {
            totalSessions: new Set(auditLog.map(entry => entry.sessionId)).size,
            totalActions: auditLog.length,
            userActivity: {},
            actionTypes: {},
            dailyActivity: {},
            averageSessionDuration: 0
        };

        // Análisis por usuario
        auditLog.forEach(entry => {
            // Actividad por usuario
            if (!stats.userActivity[entry.userId]) {
                stats.userActivity[entry.userId] = {
                    totalActions: 0,
                    lastActivity: entry.timestamp,
                    role: entry.userRole
                };
            }
            stats.userActivity[entry.userId].totalActions++;

            // Tipos de acción
            if (!stats.actionTypes[entry.action]) {
                stats.actionTypes[entry.action] = 0;
            }
            stats.actionTypes[entry.action]++;

            // Actividad diaria
            const date = entry.timestamp.split('T')[0];
            if (!stats.dailyActivity[date]) {
                stats.dailyActivity[date] = 0;
            }
            stats.dailyActivity[date]++;
        });

        return stats;
    }
}

// Instancia global del manager de usuarios
window.UserManager = new UserManager(); 