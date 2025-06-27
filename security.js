// Módulo de seguridad para producción
class SecurityManager {
    constructor() {
        this.loginAttempts = 0;
        this.sessionStart = null;
        this.isBlocked = false;
        this.blockUntil = null;
        
        // Cargar estado de seguridad
        this.loadSecurityState();
    }
    
    // Hash SHA-256
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    // Validar contraseña con hash
    async validatePassword(password) {
        if (APP_CONFIG.ENVIRONMENT === 'development') {
            // En desarrollo, usar contraseña simple
            return password === 'ospadep2024';
        }
        
        const hashedInput = await this.hashPassword(password);
        return hashedInput === APP_CONFIG.ADMIN_PASSWORD_HASH;
    }
    
    // Verificar si está bloqueado
    isCurrentlyBlocked() {
        if (this.blockUntil && new Date() < this.blockUntil) {
            return true;
        }
        
        if (this.blockUntil && new Date() >= this.blockUntil) {
            this.unblock();
        }
        
        return false;
    }
    
    // Intentar login
    async attemptLogin(password) {
        if (this.isCurrentlyBlocked()) {
            const remainingTime = Math.ceil((this.blockUntil - new Date()) / 1000 / 60);
            throw new Error(`Acceso bloqueado. Intenta en ${remainingTime} minutos.`);
        }
        
        const isValid = await this.validatePassword(password);
        
        if (isValid) {
            this.loginSuccess();
            return true;
        } else {
            this.loginFailure();
            return false;
        }
    }
    
    // Login exitoso
    loginSuccess() {
        this.loginAttempts = 0;
        this.sessionStart = new Date();
        this.isBlocked = false;
        this.blockUntil = null;
        this.saveSecurityState();
        
        // Log de seguridad
        this.logSecurityEvent('LOGIN_SUCCESS', {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ip: 'client-side' // En producción obtener IP real
        });
    }
    
    // Login fallido
    loginFailure() {
        this.loginAttempts++;
        
        if (this.loginAttempts >= APP_CONFIG.MAX_LOGIN_ATTEMPTS) {
            this.blockAccess();
        }
        
        this.saveSecurityState();
        
        // Log de seguridad
        this.logSecurityEvent('LOGIN_FAILURE', {
            attempts: this.loginAttempts,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
    }
    
    // Bloquear acceso
    blockAccess() {
        this.isBlocked = true;
        this.blockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
        
        // Notificar administrador
        this.notifySecurityIncident('MULTIPLE_LOGIN_FAILURES', {
            attempts: this.loginAttempts,
            blockedUntil: this.blockUntil.toISOString()
        });
    }
    
    // Desbloquear
    unblock() {
        this.isBlocked = false;
        this.blockUntil = null;
        this.loginAttempts = 0;
        this.saveSecurityState();
    }
    
    // Verificar sesión activa
    isSessionValid() {
        if (!this.sessionStart) return false;
        
        const sessionAge = (new Date() - this.sessionStart) / 1000 / 60; // minutos
        return sessionAge < APP_CONFIG.SESSION_TIMEOUT;
    }
    
    // Cerrar sesión
    logout() {
        this.sessionStart = null;
        this.saveSecurityState();
        
        this.logSecurityEvent('LOGOUT', {
            timestamp: new Date().toISOString()
        });
    }
    
    // Guardar estado de seguridad
    saveSecurityState() {
        const state = {
            loginAttempts: this.loginAttempts,
            sessionStart: this.sessionStart,
            isBlocked: this.isBlocked,
            blockUntil: this.blockUntil
        };
        
        localStorage.setItem('ospadep_security_state', JSON.stringify(state));
    }
    
    // Cargar estado de seguridad
    loadSecurityState() {
        const saved = localStorage.getItem('ospadep_security_state');
        if (saved) {
            const state = JSON.parse(saved);
            this.loginAttempts = state.loginAttempts || 0;
            this.sessionStart = state.sessionStart ? new Date(state.sessionStart) : null;
            this.isBlocked = state.isBlocked || false;
            this.blockUntil = state.blockUntil ? new Date(state.blockUntil) : null;
        }
    }
    
    // Log de eventos de seguridad
    logSecurityEvent(eventType, data) {
        const securityLog = JSON.parse(localStorage.getItem('ospadep_security_log') || '[]');
        
        const event = {
            id: Date.now(),
            type: eventType,
            timestamp: new Date().toISOString(),
            data: data
        };
        
        securityLog.push(event);
        
        // Mantener solo últimos 100 eventos
        if (securityLog.length > 100) {
            securityLog.splice(0, securityLog.length - 100);
        }
        
        localStorage.setItem('ospadep_security_log', JSON.stringify(securityLog));
        
        // En producción, enviar al servidor (deshabilitado por ahora)
        if (APP_CONFIG.ENVIRONMENT === 'production' && APP_CONFIG.API_BASE_URL && APP_CONFIG.API_BASE_URL !== 'https://api.ospadep.com') {
            this.sendToServer('/api/security-log', event);
        }
    }
    
    // Notificar incidente de seguridad
    notifySecurityIncident(type, data) {
        console.warn(`INCIDENTE DE SEGURIDAD: ${type}`, data);
        
        // En producción, enviar notificación
        if (APP_CONFIG.ENVIRONMENT === 'production') {
            this.sendSecurityAlert(type, data);
        }
    }
    
    // Enviar alerta de seguridad (implementar según necesidades)
    sendSecurityAlert(type, data) {
        // Solo en producción y si hay configuración válida
        if (APP_CONFIG.ENVIRONMENT === 'production') {
            // Ejemplo: Webhook a Slack
            if (APP_CONFIG.SLACK_WEBHOOK && APP_CONFIG.SLACK_WEBHOOK.startsWith('https://hooks.slack.com')) {
                fetch(APP_CONFIG.SLACK_WEBHOOK, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: `🚨 Alerta de Seguridad OSPADEP: ${type}`,
                        attachments: [{
                            color: 'danger',
                            fields: Object.entries(data).map(([key, value]) => ({
                                title: key,
                                value: value,
                                short: true
                            }))
                        }]
                    })
                }).catch(console.error);
            }
            
            // Ejemplo: Email al administrador
            if (APP_CONFIG.ADMIN_EMAIL && APP_CONFIG.ADMIN_EMAIL.includes('@')) {
                // Implementar envío de email
                console.log(`Email de alerta enviado a: ${APP_CONFIG.ADMIN_EMAIL}`);
            }
        } else {
            // En desarrollo, solo mostrar en consola
            console.log(`Alerta de seguridad (DEV): ${type}`, data);
        }
    }
    
    // Enviar datos al servidor (para futuro backend)
    async sendToServer(endpoint, data) {
        try {
            await fetch(APP_CONFIG.API_BASE_URL + endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getApiToken()}`
                },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Error enviando al servidor:', error);
        }
    }
    
    // Obtener token API (implementar según backend)
    getApiToken() {
        return localStorage.getItem('ospadep_api_token') || '';
    }
    
    // Generar reporte de seguridad
    getSecurityReport() {
        const log = JSON.parse(localStorage.getItem('ospadep_security_log') || '[]');
        const state = {
            currentSession: this.isSessionValid(),
            loginAttempts: this.loginAttempts,
            isBlocked: this.isCurrentlyBlocked(),
            lastEvents: log.slice(-10)
        };
        
        return state;
    }
}

// Instancia global del manager de seguridad
window.SecurityManager = new SecurityManager(); 