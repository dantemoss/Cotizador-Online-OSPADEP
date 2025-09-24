// ================================
// SISTEMA DE AUTENTICACIÓN AVANZADO
// ================================

class AuthenticationSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentSession = null;
        this.sessionTimeout = 8 * 60 * 60 * 1000; // 8 horas en milisegundos
        this.initializeSystem();
    }

    initializeSystem() {
        // Cargar sesión activa si existe
        this.loadActiveSession();
        
        // Configurar auto-logout por inactividad
        this.setupInactivityLogout();
        
        // Registrar actividad de inicio
        if (this.currentSession) {
            this.logActivity('SESSION_RESTORED', {
                sessionAge: this.getSessionAge()
            });
        }
    }

    // ================================
    // GESTIÓN DE USUARIOS
    // ================================

    // Cargar usuarios desde localStorage
    loadUsers() {
        const defaultUsers = {
            'ospadep_admin_2024': {
                id: 'ospadep_admin_2024',
                username: 'ospadep_admin_2024',
                password: 'OSPADEP_SecureAdmin_2024!',
                role: 'super_admin',
                name: 'Administrador OSPADEP',
                email: 'admin@ospadep.com',
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isActive: true,
                permissions: ['all']
            }
        };

        const saved = localStorage.getItem('ospadep_users');
        if (saved) {
            try {
                const users = JSON.parse(saved);
                // Asegurar que el superadmin siempre exista
                return { ...defaultUsers, ...users };
            } catch (error) {
                console.error('Error loading users:', error);
                return defaultUsers;
            }
        }
        
        // Guardar usuarios por defecto
        this.saveUsers(defaultUsers);
        return defaultUsers;
    }

    // Guardar usuarios en localStorage
    saveUsers(users = this.users) {
        localStorage.setItem('ospadep_users', JSON.stringify(users));
        this.users = users;
    }

    // Crear nuevo usuario
    createUser(userData) {
        const { username, password, role, name, email } = userData;
        
        // Validaciones
        if (!username || !password || !role || !name) {
            throw new Error('Todos los campos son obligatorios');
        }

        if (this.users[username]) {
            throw new Error('El nombre de usuario ya existe');
        }

        if (password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        const newUser = {
            id: username,
            username: username,
            password: password, // En producción, esto debería estar hasheado
            role: role,
            name: name,
            email: email || '',
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true,
            permissions: this.getDefaultPermissions(role),
            createdBy: this.currentSession ? this.currentSession.userId : 'system'
        };

        this.users[username] = newUser;
        this.saveUsers();

        // Registrar en auditoría
        this.logActivity('USER_CREATED', {
            newUser: username,
            role: role,
            createdBy: this.currentSession ? this.currentSession.userId : 'system'
        });

        return newUser;
    }

    // Obtener permisos por defecto según rol
    getDefaultPermissions(role) {
        switch (role) {
            case 'super_admin':
                return ['all'];
            case 'admin':
                return ['price_update', 'plan_management', 'view_reports'];
            case 'user':
                return ['view_plans', 'generate_quotes'];
            default:
                return ['view_plans'];
        }
    }

    // Actualizar usuario
    updateUser(username, updates) {
        if (!this.users[username]) {
            throw new Error('Usuario no encontrado');
        }

        if (!this.canManageUser(username)) {
            throw new Error('No tienes permisos para modificar este usuario');
        }

        const oldData = { ...this.users[username] };
        this.users[username] = { ...this.users[username], ...updates };
        this.saveUsers();

        this.logActivity('USER_UPDATED', {
            updatedUser: username,
            changes: Object.keys(updates),
            updatedBy: this.currentSession.userId
        });

        return this.users[username];
    }

    // Eliminar usuario
    deleteUser(username) {
        if (!this.users[username]) {
            throw new Error('Usuario no encontrado');
        }

        if (username === 'superadmin') {
            throw new Error('No se puede eliminar el superadministrador');
        }

        if (!this.canManageUser(username)) {
            throw new Error('No tienes permisos para eliminar este usuario');
        }

        delete this.users[username];
        this.saveUsers();

        this.logActivity('USER_DELETED', {
            deletedUser: username,
            deletedBy: this.currentSession.userId
        });
    }

    // Verificar si el usuario actual puede gestionar otro usuario
    canManageUser(targetUsername) {
        if (!this.currentSession) return false;
        
        const currentUser = this.users[this.currentSession.userId];
        const targetUser = this.users[targetUsername];
        
        if (!currentUser || !targetUser) return false;
        
        // SuperAdmin puede gestionar a todos
        if (currentUser.role === 'super_admin') return true;
        
        // Admin puede gestionar usuarios normales pero no otros admins o superadmin
        if (currentUser.role === 'admin' && targetUser.role === 'user') return true;
        
        return false;
    }

    // ================================
    // AUTENTICACIÓN
    // ================================

    // Iniciar sesión
    async login(username, password) {
        try {
            // Verificar si el usuario existe
            const user = this.users[username];
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            // Verificar si el usuario está activo
            if (!user.isActive) {
                throw new Error('Usuario desactivado. Contacta al administrador');
            }

            // Verificar contraseña
            if (user.password !== password) {
                this.logActivity('LOGIN_FAILED', {
                    username: username,
                    reason: 'invalid_password',
                    ip: this.getClientIP()
                });
                throw new Error('Contraseña incorrecta');
            }

            // Crear sesión
            const sessionData = {
                sessionId: this.generateSessionId(),
                userId: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
                permissions: user.permissions,
                loginTime: new Date().toISOString(),
                lastActivity: new Date().toISOString(),
                expiresAt: new Date(Date.now() + this.sessionTimeout).toISOString()
            };

            // Guardar sesión actual
            this.currentSession = sessionData;
            this.saveSession();

            // Actualizar último login del usuario
            this.users[username].lastLogin = new Date().toISOString();
            this.saveUsers();

            // Registrar login exitoso
            this.logActivity('LOGIN_SUCCESS', {
                username: username,
                role: user.role,
                sessionId: sessionData.sessionId
            });

            return {
                success: true,
                session: sessionData,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    role: user.role,
                    permissions: user.permissions
                }
            };

        } catch (error) {
            throw error;
        }
    }

    // Cerrar sesión
    logout() {
        if (this.currentSession) {
            this.logActivity('LOGOUT', {
                username: this.currentSession.username,
                sessionDuration: this.getSessionDuration()
            });

            // Limpiar sesión
            this.currentSession = null;
            localStorage.removeItem('ospadep_active_session');
        }
    }

    // ================================
    // GESTIÓN DE SESIONES
    // ================================

    // Guardar sesión activa
    saveSession() {
        if (this.currentSession) {
            localStorage.setItem('ospadep_active_session', JSON.stringify(this.currentSession));
        }
    }

    // Cargar sesión activa
    loadActiveSession() {
        const saved = localStorage.getItem('ospadep_active_session');
        if (saved) {
            try {
                const session = JSON.parse(saved);
                
                // Verificar si la sesión no ha expirado
                if (this.isSessionValid(session)) {
                    this.currentSession = session;
                    this.updateActivity();
                } else {
                    localStorage.removeItem('ospadep_active_session');
                    this.logActivity('SESSION_EXPIRED', {
                        username: session.username,
                        expiredAt: new Date().toISOString()
                    });
                }
            } catch (error) {
                localStorage.removeItem('ospadep_active_session');
            }
        }
    }

    // Verificar si la sesión es válida
    isSessionValid(session = this.currentSession) {
        if (!session) return false;
        
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        
        return now < expiresAt;
    }

    // Actualizar actividad de la sesión
    updateActivity() {
        if (this.currentSession && this.isSessionValid()) {
            this.currentSession.lastActivity = new Date().toISOString();
            // Extender sesión si está activo
            this.currentSession.expiresAt = new Date(Date.now() + this.sessionTimeout).toISOString();
            this.saveSession();
        }
    }

    // Configurar logout automático por inactividad
    setupInactivityLogout() {
        let inactivityTimer;
        const inactivityTime = 30 * 60 * 1000; // 30 minutos

        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            
            if (this.currentSession) {
                inactivityTimer = setTimeout(() => {
                    this.logActivity('INACTIVITY_LOGOUT', {
                        username: this.currentSession.username,
                        inactiveTime: inactivityTime / 1000 / 60 // minutos
                    });
                    this.logout();
                    this.showInactivityMessage();
                }, inactivityTime);
                
                this.updateActivity();
            }
        };

        // Eventos que resetean el timer
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });

        // Iniciar timer
        resetTimer();
    }

    // Mostrar mensaje de inactividad
    showInactivityMessage() {
        alert('Tu sesión ha expirado por inactividad. Serás redirigido al login.');
        window.location.reload();
    }

    // ================================
    // UTILIDADES
    // ================================

    // Generar ID de sesión único
    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    // Obtener duración de sesión en minutos
    getSessionDuration() {
        if (!this.currentSession) return 0;
        
        const start = new Date(this.currentSession.loginTime);
        const end = new Date();
        return Math.round((end - start) / 1000 / 60);
    }

    // Obtener edad de sesión en minutos
    getSessionAge() {
        if (!this.currentSession) return 0;
        
        const start = new Date(this.currentSession.loginTime);
        const now = new Date();
        return Math.round((now - start) / 1000 / 60);
    }

    // Obtener IP del cliente (placeholder)
    getClientIP() {
        return 'client-side'; // En producción, obtener del servidor
    }

    // ================================
    // MÉTODOS PÚBLICOS
    // ================================

    // Verificar si está logueado
    isLoggedIn() {
        return this.currentSession && this.isSessionValid();
    }

    // Obtener usuario actual
    getCurrentUser() {
        if (!this.currentSession) return null;
        return this.users[this.currentSession.userId];
    }

    // Verificar rol
    hasRole(role) {
        if (!this.currentSession) return false;
        return this.currentSession.role === role;
    }

    // Verificar permisos
    hasPermission(permission) {
        if (!this.currentSession) return false;
        return this.currentSession.permissions.includes('all') || 
               this.currentSession.permissions.includes(permission);
    }

    // Es SuperAdmin
    isSuperAdmin() {
        return this.hasRole('super_admin');
    }

    // Es Admin
    isAdmin() {
        return this.hasRole('admin') || this.hasRole('super_admin');
    }

    // Obtener todos los usuarios (solo para admins)
    getAllUsers() {
        if (!this.isAdmin()) {
            throw new Error('No tienes permisos para ver usuarios');
        }
        
        return Object.values(this.users).map(user => ({
            ...user,
            password: undefined // No enviar contraseñas
        }));
    }

    // Registrar actividad
    logActivity(action, details = {}) {
        const logEntry = {
            id: Date.now(),
            action: action,
            userId: this.currentSession ? this.currentSession.userId : 'anonymous',
            username: this.currentSession ? this.currentSession.username : 'anonymous',
            userRole: this.currentSession ? this.currentSession.role : 'none',
            timestamp: new Date().toISOString(),
            details: details,
            sessionId: this.currentSession ? this.currentSession.sessionId : null,
            url: window.location.href,
            userAgent: navigator.userAgent.substr(0, 100)
        };

        // Guardar en localStorage
        this.saveToAuditLog(logEntry);

        // En modo desarrollo, mostrar en consola
        if (window.APP_CONFIG && window.APP_CONFIG.ENVIRONMENT === 'development') {
            console.log('🔐 Auth Activity:', logEntry);
        }
    }

    // Guardar en log de auditoría
    saveToAuditLog(entry) {
        let auditLog = JSON.parse(localStorage.getItem('ospadep_audit_log') || '[]');
        
        auditLog.push(entry);
        
        // Mantener solo los últimos registros
        const maxRecords = window.APP_CONFIG ? window.APP_CONFIG.MAX_AUDIT_RECORDS : 1000;
        if (auditLog.length > maxRecords) {
            auditLog = auditLog.slice(-maxRecords);
        }
        
        localStorage.setItem('ospadep_audit_log', JSON.stringify(auditLog));
    }

    // Obtener log de auditoría
    getAuditLog() {
        if (!this.isAdmin()) {
            throw new Error('No tienes permisos para ver el log de auditoría');
        }
        
        return JSON.parse(localStorage.getItem('ospadep_audit_log') || '[]');
    }

    // Obtener estadísticas de usuarios
    getUserStats() {
        if (!this.isAdmin()) {
            throw new Error('No tienes permisos para ver estadísticas');
        }
        
        const auditLog = this.getAuditLog();
        const stats = {
            totalSessions: 0,
            totalActions: auditLog.length,
            todayActivity: 0,
            userActivity: {}
        };

        const today = new Date().toDateString();
        
        auditLog.forEach(entry => {
            // Contar actividad de hoy
            if (new Date(entry.timestamp).toDateString() === today) {
                stats.todayActivity++;
            }
            
            // Contar por usuario
            if (!stats.userActivity[entry.userId]) {
                stats.userActivity[entry.userId] = {
                    totalActions: 0,
                    lastActivity: entry.timestamp,
                    role: entry.userRole
                };
            }
            
            stats.userActivity[entry.userId].totalActions++;
            
            // Contar sesiones
            if (entry.action === 'LOGIN_SUCCESS') {
                stats.totalSessions++;
            }
        });

        return stats;
    }
}

// Instancia global del sistema de autenticación
window.AuthSystem = new AuthenticationSystem(); 