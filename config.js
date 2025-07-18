// Configuración para entorno de producción
const CONFIG = {
    // Configuración de entorno
    ENVIRONMENT: 'development', // 'development' o 'production'
    
    // Configuración de seguridad y roles
    ADMIN_PASSWORD_HASH: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', // SHA-256 de 'hello'
    SUPER_ADMIN_PASSWORD: 'superadmin2024', // Contraseña para super administrador
    SESSION_TIMEOUT: 30, // minutos
    MAX_LOGIN_ATTEMPTS: 3,
    
    // Configuración de usuarios
    USER_ROLES: {
        SUPER_ADMIN: 'super_admin',
        ADMIN: 'admin',
        USER: 'user'
    },
    
    // Configuración de sincronización
    SYNC_INTERVAL: 5000, // 5 segundos
    AUTO_SYNC: true,
    
    // Configuración de auditoría
    LOG_ALL_ACTIONS: true,
    MAX_AUDIT_RECORDS: 1000,
    
    // Configuración de datos
    BACKUP_INTERVAL: 24, // horas
    MAX_HISTORY_RECORDS: 100,
    
    // URLs y endpoints (para futuro backend)
    API_BASE_URL: '', // Deshabilitar por ahora
    BACKUP_ENDPOINT: '/api/backup',
    PRICES_ENDPOINT: '/api/prices',
    SYNC_ENDPOINT: '/api/sync',
    AUDIT_ENDPOINT: '/api/audit',
    
    // Configuración de notificaciones
    ADMIN_EMAIL: '', // Deshabilitar por ahora
    SLACK_WEBHOOK: '', // Para notificaciones
    
    // Configuración de planes
    DEFAULT_CURRENCY: 'ARS',
    PRICE_PRECISION: 0, // decimales
    MIN_PRICE: 1000,
    MAX_PRICE: 500000,
    
    // Configuración de UI
    COMPANY_NAME: 'OSPADEP',
    LOGO_URL: 'https://i.postimg.cc/qBhxQhRv/482cc3df-6285-4fa0-93ea-8d1f008f9dbf.png',
    THEME_COLOR: '#1053F3'
};

// Función para obtener configuración según entorno
function getConfig() {
    if (CONFIG.ENVIRONMENT === 'development') {
        return {
            ...CONFIG,
            ADMIN_PASSWORD_HASH: null, // En desarrollo usar contraseña simple
            SESSION_TIMEOUT: 120, // Más tiempo en desarrollo
            MAX_LOGIN_ATTEMPTS: 10
        };
    }
    return CONFIG;
}

// Exportar configuración
window.APP_CONFIG = getConfig(); 