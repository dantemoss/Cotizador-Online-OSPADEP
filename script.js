// Variables globales
let selectedOption = null;
let formData = {};
let validationErrors = {};

// Datos de planes (simulación de base de datos)
const planesData = {
    individual: [
        {
            name: "Plan Básico Individual",
            price: 15000,
            ageRange: "18-35",
            features: [
                "Consultas médicas generales",
                "Emergencias 24hs",
                "Laboratorio básico",
                "Radiografías simples",
                "Descuentos en farmacias"
            ],
            recommended: false
        },
        {
            name: "Plan Completo Individual",
            price: 25000,
            ageRange: "18-50",
            features: [
                "Todas las prestaciones del Plan Básico",
                "Especialistas sin orden",
                "Estudios de alta complejidad",
                "Internación en habitación privada",
                "Cobertura odontológica",
                "Medicina preventiva"
            ],
            recommended: true
        },
        {
            name: "Plan Senior Individual",
            price: 35000,
            ageRange: "51+",
            features: [
                "Todas las prestaciones del Plan Completo",
                "Cobertura geriátrica especializada",
                "Enfermería domiciliaria",
                "Estudios cardiológicos avanzados",
                "Rehabilitación kinesiológica",
                "Medicina domiciliaria"
            ],
            recommended: false
        }
    ],
    familiar: [
        {
            name: "Plan Familiar Básico",
            price: 28000,
            ageRange: "familiar",
            features: [
                "Cobertura para toda la familia",
                "Consultas médicas generales",
                "Emergencias 24hs",
                "Pediatría especializada",
                "Laboratorio básico",
                "Vacunación completa"
            ],
            recommended: false
        },
        {
            name: "Plan Familiar Completo",
            price: 45000,
            ageRange: "familiar",
            features: [
                "Todas las prestaciones del Plan Básico",
                "Especialistas para toda la familia",
                "Maternidad integral",
                "Odontología familiar",
                "Internación habitación privada",
                "Medicina preventiva familiar"
            ],
            recommended: true
        },
        {
            name: "Plan Familiar Premium",
            price: 65000,
            ageRange: "familiar",
            features: [
                "Todas las prestaciones del Plan Completo",
                "Medicina domiciliaria",
                "Enfermería a domicilio",
                "Estudios de alta complejidad",
                "Cirugías ambulatorias",
                "Rehabilitación integral"
            ],
            recommended: false
        }
    ]
};

// Función para agregar planes personalizados
function addCustomPlan(category, planData) {
    if (!planesData[category]) {
        planesData[category] = [];
    }
    
    // Validar estructura del plan
    const requiredFields = ['name', 'price', 'ageRange', 'features'];
    for (let field of requiredFields) {
        if (!planData[field]) {
            console.error(`Campo requerido faltante: ${field}`);
            return false;
        }
    }
    
    // Agregar valores por defecto
    const newPlan = {
        name: planData.name,
        price: planData.price,
        ageRange: planData.ageRange,
        features: planData.features,
        recommended: planData.recommended || false
    };
    
    planesData[category].push(newPlan);
    console.log(`Plan "${newPlan.name}" agregado a la categoría "${category}"`);
    return true;
}

// Función para crear categorías personalizadas
function createPlanCategory(categoryName, plans = []) {
    planesData[categoryName] = plans;
    console.log(`Categoría "${categoryName}" creada con ${plans.length} planes`);
}

// Variables globales para autenticación
let currentAdminMode = false;
let editingUserId = null;

// Función de debug para verificar estado del botón
function debugAdminButton() {
    const loginSection = document.getElementById('login-section');
    const userInfoSection = document.getElementById('user-info-section');
    const isLoggedIn = window.AuthSystem ? window.AuthSystem.isLoggedIn() : false;
    const currentUser = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    
    console.log('🔍 Debug User Header:', {
        loginSectionVisible: loginSection ? loginSection.style.display !== 'none' : 'not found',
        userInfoSectionVisible: userInfoSection ? userInfoSection.style.display === 'flex' : 'not found',
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
        authSystemReady: !!window.AuthSystem
    });
}

// Función de debug para probar el modal
function testAdminModal() {
    console.log('🧪 Testing admin modal...');
    
    const modal = document.getElementById('admin-modal');
    if (modal) {
        // Forzar estilos correctos
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.zIndex = '10000';
        modal.style.display = 'block';
        
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.position = 'absolute';
            modalContent.style.top = '50%';
            modalContent.style.left = '50%';
            modalContent.style.transform = 'translate(-50%, -50%)';
            modalContent.style.zIndex = '10001';
            modalContent.style.width = '90%';
            modalContent.style.maxWidth = '450px';
        }
        
        console.log('✅ Modal abierto con estilos forzados');
        
        setTimeout(() => {
            const rect = modalContent?.getBoundingClientRect();
            console.log('📏 Modal Status:', {
                modalExists: !!modal,
                modalVisible: modal.style.display,
                modalContentExists: !!modalContent,
                modalRect: rect,
                viewportHeight: window.innerHeight,
                viewportWidth: window.innerWidth,
                modalStyles: {
                    position: modalContent?.style.position,
                    top: modalContent?.style.top,
                    left: modalContent?.style.left,
                    transform: modalContent?.style.transform,
                    zIndex: modalContent?.style.zIndex
                }
            });
        }, 100);
    } else {
        console.error('❌ Modal no encontrado');
    }
}

// Función de fix rápido para el modal
function fixModal() {
    console.log('🔧 Aplicando fix al modal...');
    
    const modal = document.getElementById('admin-modal');
    if (modal) {
        // Aplicar estilos CSS correctos via JavaScript
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.zIndex = '10000';
        
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.position = 'absolute';
            modalContent.style.top = '50%';
            modalContent.style.left = '50%';
            modalContent.style.transform = 'translate(-50%, -50%)';
            modalContent.style.zIndex = '10001';
            modalContent.style.width = '90%';
            modalContent.style.maxWidth = '450px';
            modalContent.style.maxHeight = '90vh';
        }
        
        console.log('✅ Fix aplicado al modal');
        return true;
    } else {
        console.error('❌ Modal no encontrado');
        return false;
    }
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Cargar planes personalizados si existen
    loadCustomPlans();
    initializeApp();
    
    // Verificar sesión activa cuando el AuthSystem esté listo
    setTimeout(() => {
        if (window.AuthSystem && window.AuthSystem.isLoggedIn()) {
            currentAdminMode = true;
            updateUIForLoggedInUser();
            console.log('🔄 Sesión restaurada automáticamente');
        } else {
            // Asegurar que el botón esté configurado correctamente para usuarios no logueados
            updateUIForLoggedInUser(); // Esto manejará el caso de no usuario correctamente
        }
    }, 100);
});

function initializeApp() {
    // Agregar event listeners a las opciones del formulario
    const optionItems = document.querySelectorAll('.option-item');
    optionItems.forEach(item => {
        item.addEventListener('click', function() {
            selectOption(this.dataset.option);
        });
    });

    // Event listener para el botón continuar
    const continueBtn = document.getElementById('continue-btn');
    continueBtn.addEventListener('click', function() {
        if (selectedOption) {
            showDetailsForm(selectedOption);
        }
    });

    // Event listener para el formulario de cotización
    const cotizationForm = document.getElementById('cotization-form');
    cotizationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            processForm();
        }
    });

    // Event listeners para botones de contacto
    setupContactButtons();
}

function selectOption(option) {
    selectedOption = option;
    
    // Actualizar visualización de opciones seleccionadas
    const optionItems = document.querySelectorAll('.option-item');
    optionItems.forEach(item => {
        item.classList.remove('selected');
    });
    
    const selectedItem = document.querySelector('[data-option="' + option + '"]');
    selectedItem.classList.add('selected');
    
    // Habilitar botón continuar
    const continueBtn = document.getElementById('continue-btn');
    continueBtn.disabled = false;
}

function showDetailsForm(option) {
    const formSection = document.getElementById('form-section');
    const detailsSection = document.getElementById('details-section');
    const detailsTitle = document.getElementById('details-title');
    const formFields = document.getElementById('form-fields');
    
    // Ocultar sección principal y mostrar detalles
    formSection.style.display = 'none';
    detailsSection.style.display = 'block';
    
    // Configurar título según la opción
    const titles = {
        'solo': 'Información Personal',
        'pareja': 'Información de la Pareja',
        'hijos': 'Información Familiar',
        'familia': 'Información Familiar Completa'
    };
    
    detailsTitle.textContent = titles[option];
    
    // Generar campos del formulario
    formFields.innerHTML = generateFormFields(option);
}

function generateFormFields(option) {
    let sections = '';
    
    // Sección de información personal (siempre presente)
    sections += '<div class="form-section-group">' +
        '<div class="section-title">' +
        '<i class="fas fa-user"></i> Tu información personal' +
        '</div>' +
        '<div class="form-row">' +
        '<div class="form-group">' +
        '<label for="edad-titular">Tu edad *</label>' +
        '<input type="number" id="edad-titular" name="edad-titular" min="18" max="100" placeholder="Ej: 30" required>' +
        '<div class="error-message" id="error-edad-titular"></div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="situacion-laboral">Situación laboral *</label>' +
        '<select id="situacion-laboral" name="situacion-laboral" required>' +
        '<option value="">Selecciona una opción</option>' +
        '<option value="dependencia">Relación de dependencia</option>' +
        '<option value="monotributista">Monotributista</option>' +
        '<option value="particular">Particular</option>' +
        '</select>' +
        '<div class="error-message" id="error-situacion-laboral"></div>' +
        '</div>' +
        '</div>' +
        '</div>';
    
    // Secciones adicionales según la opción
    switch (option) {
        case 'pareja':
            sections += '<div class="form-section-group">' +
                '<div class="section-title">' +
                '<i class="fas fa-heart"></i> Información de tu pareja' +
                '</div>' +
                '<div class="form-row">' +
                '<div class="form-group">' +
                '<label for="edad-pareja">Edad de tu pareja *</label>' +
                '<input type="number" id="edad-pareja" name="edad-pareja" min="18" max="100" placeholder="Ej: 28" required>' +
                '<div class="error-message" id="error-edad-pareja"></div>' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="situacion-pareja">Situación laboral de tu pareja *</label>' +
                '<select id="situacion-pareja" name="situacion-pareja" required>' +
                '<option value="">Selecciona una opción</option>' +
                '<option value="dependencia">Relación de dependencia</option>' +
                '<option value="monotributista">Monotributista</option>' +
                '<option value="particular">Particular</option>' +
                '</select>' +
                '<div class="error-message" id="error-situacion-pareja"></div>' +
                '</div>' +
                '</div>' +
                '</div>';
            break;
            
        case 'hijos':
            sections += '<div class="form-section-group">' +
                '<div class="section-title">' +
                '<i class="fas fa-baby"></i> Información de tus hijos' +
                '</div>' +
                '<div class="form-row">' +
                '<div class="form-group">' +
                '<label for="cantidad-hijos">Cantidad de hijos *</label>' +
                '<input type="number" id="cantidad-hijos" name="cantidad-hijos" min="1" max="10" placeholder="Ej: 2" required>' +
                '<div class="error-message" id="error-cantidad-hijos"></div>' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="edades-hijos">Edades de los hijos *</label>' +
                '<input type="text" id="edades-hijos" name="edades-hijos" placeholder="Ej: 5, 8, 12" required>' +
                '<small class="field-help">Separa las edades con comas</small>' +
                '<div class="error-message" id="error-edades-hijos"></div>' +
                '</div>' +
                '</div>' +
                '</div>';
            break;
            
        case 'familia':
            sections += '<div class="form-section-group">' +
                '<div class="section-title">' +
                '<i class="fas fa-heart"></i> Información de tu pareja' +
                '</div>' +
                '<div class="form-row">' +
                '<div class="form-group">' +
                '<label for="edad-pareja">Edad de tu pareja *</label>' +
                '<input type="number" id="edad-pareja" name="edad-pareja" min="18" max="100" placeholder="Ej: 28" required>' +
                '<div class="error-message" id="error-edad-pareja"></div>' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="situacion-pareja">Situación laboral de tu pareja *</label>' +
                '<select id="situacion-pareja" name="situacion-pareja" required>' +
                '<option value="">Selecciona una opción</option>' +
                '<option value="dependencia">Relación de dependencia</option>' +
                '<option value="monotributista">Monotributista</option>' +
                '<option value="particular">Particular</option>' +
                '</select>' +
                '<div class="error-message" id="error-situacion-pareja"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="form-section-group">' +
                '<div class="section-title">' +
                '<i class="fas fa-baby"></i> Información de tus hijos' +
                '</div>' +
                '<div class="form-row">' +
                '<div class="form-group">' +
                '<label for="cantidad-hijos">Cantidad de hijos *</label>' +
                '<input type="number" id="cantidad-hijos" name="cantidad-hijos" min="1" max="10" placeholder="Ej: 2" required>' +
                '<div class="error-message" id="error-cantidad-hijos"></div>' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="edades-hijos">Edades de los hijos *</label>' +
                '<input type="text" id="edades-hijos" name="edades-hijos" placeholder="Ej: 5, 8, 12" required>' +
                '<small class="field-help">Separa las edades con comas</small>' +
                '<div class="error-message" id="error-edades-hijos"></div>' +
                '</div>' +
                '</div>' +
                '</div>';
            break;
    }
    
    // Después de generar los campos, configurar validaciones en tiempo real
    setTimeout(() => {
        setupFieldValidations();
    }, 100);
    
    return sections;
}

// Configurar validaciones en tiempo real
function setupFieldValidations() {
    const fields = document.querySelectorAll('input, select');
    
    fields.forEach(field => {
        // Validación al perder el foco
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Validación en tiempo real para números
        if (field.type === 'number') {
            field.addEventListener('input', function() {
                clearFieldError(this);
                if (this.value) {
                    validateField(this);
                }
            });
        }
        
        // Validación en tiempo real para texto (edades de hijos)
        if (field.name === 'edades-hijos') {
            field.addEventListener('input', function() {
                clearFieldError(this);
                if (this.value) {
                    validateField(this);
                }
            });
        }
        
        // Validación para selects
        if (field.tagName === 'SELECT') {
            field.addEventListener('change', function() {
                validateField(this);
            });
        }
    });
}

// Validar un campo individual
function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Limpiar error previo
    clearFieldError(field);
    
    // Validaciones según el tipo de campo
    switch (fieldName) {
        case 'edad-titular':
        case 'edad-pareja':
            if (!value) {
                isValid = false;
                errorMessage = 'Este campo es obligatorio';
            } else if (!validateAge(parseInt(value))) {
                isValid = false;
                errorMessage = 'La edad debe estar entre 18 y 100 años';
            }
            break;
            
        case 'situacion-laboral':
        case 'situacion-pareja':
            if (!value) {
                isValid = false;
                errorMessage = 'Debes seleccionar una opción';
            }
            break;
            
        case 'cantidad-hijos':
            if (!value) {
                isValid = false;
                errorMessage = 'Este campo es obligatorio';
            } else {
                const cantidad = parseInt(value);
                if (cantidad < 1 || cantidad > 10) {
                    isValid = false;
                    errorMessage = 'La cantidad debe estar entre 1 y 10';
                }
            }
            break;
            
        case 'edades-hijos':
            if (!value) {
                isValid = false;
                errorMessage = 'Este campo es obligatorio';
            } else if (!validateChildrenAges(value)) {
                isValid = false;
                errorMessage = 'Las edades deben ser números entre 0 y 25 años, separados por comas';
            } else {
                // Validar que coincida con la cantidad de hijos
                const cantidadInput = document.querySelector('[name="cantidad-hijos"]');
                if (cantidadInput && cantidadInput.value) {
                    const expectedCount = parseInt(cantidadInput.value);
                    const actualCount = value.split(',').length;
                    if (actualCount !== expectedCount) {
                        isValid = false;
                        errorMessage = `Debes ingresar exactamente ${expectedCount} edad${expectedCount > 1 ? 'es' : ''}`;
                    }
                }
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
        validationErrors[fieldName] = errorMessage;
    } else {
        delete validationErrors[fieldName];
    }
    
    return isValid;
}

// Mostrar error en un campo
function showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = document.getElementById(`error-${field.name}`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Limpiar error de un campo
function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = document.getElementById(`error-${field.name}`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Validar todo el formulario
function validateForm() {
    const fields = document.querySelectorAll('input[required], select[required]');
    let isFormValid = true;
    validationErrors = {};
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    // Validaciones cruzadas adicionales
    if (isFormValid) {
        isFormValid = validateCrossFields();
    }
    
    // Mostrar mensaje general si hay errores
    if (!isFormValid) {
        showFormError('Por favor, corrige los errores antes de continuar');
        // Hacer scroll al primer error
        const firstError = document.querySelector('.form-group input.error, .form-group select.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    } else {
        hideFormError();
    }
    
    return isFormValid;
}

// Validaciones cruzadas entre campos
function validateCrossFields() {
    let isValid = true;
    
    // Validar coherencia entre cantidad de hijos y edades
    const cantidadInput = document.querySelector('[name="cantidad-hijos"]');
    const edadesInput = document.querySelector('[name="edades-hijos"]');
    
    if (cantidadInput && edadesInput && cantidadInput.value && edadesInput.value) {
        const expectedCount = parseInt(cantidadInput.value);
        const actualCount = edadesInput.value.split(',').filter(age => age.trim()).length;
        
        if (actualCount !== expectedCount) {
            showFieldError(edadesInput, `Debes ingresar exactamente ${expectedCount} edad${expectedCount > 1 ? 'es' : ''}`);
            isValid = false;
        }
    }
    
    return isValid;
}

// Mostrar error general del formulario
function showFormError(message) {
    let errorContainer = document.querySelector('.form-error-general');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.className = 'form-error-general';
        const formContent = document.querySelector('.form-content');
        formContent.insertBefore(errorContainer, formContent.querySelector('.form-sections'));
    }
    errorContainer.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    errorContainer.style.display = 'block';
}

// Ocultar error general del formulario
function hideFormError() {
    const errorContainer = document.querySelector('.form-error-general');
    if (errorContainer) {
        errorContainer.style.display = 'none';
    }
}

function processForm() {
    // Recopilar datos del formulario
    const form = document.getElementById('cotization-form');
    const formDataElements = new FormData(form);
    
    formData = {};
    for (let pair of formDataElements.entries()) {
        formData[pair[0]] = pair[1];
    }
    
    formData.option = selectedOption;
    
    // Mostrar indicador de carga
    const submitButton = form.querySelector('.continue-button');
    if (submitButton) {
        submitButton.classList.add('loading');
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculando...';
        submitButton.disabled = true;
        
        // Simular procesamiento
        setTimeout(() => {
            submitButton.classList.remove('loading');
            submitButton.innerHTML = '<i class="fas fa-calculator"></i> Cotizar Plan';
            submitButton.disabled = false;
            showPlans();
        }, 1500);
    }
}

function showPlans() {
    const detailsSection = document.getElementById('details-section');
    const plansSection = document.getElementById('plans-section');
    const plansGrid = document.getElementById('plans-grid');
    
    // Ocultar formulario y mostrar planes
    detailsSection.style.display = 'none';
    plansSection.style.display = 'block';
    
    // Determinar qué planes mostrar
    let planesAMostrar = [];
    const edadTitular = parseInt(formData['edad-titular']);
    
    if (selectedOption === 'solo') {
        planesAMostrar = planesData.individual.filter(plan => {
            if (plan.ageRange === '18-35') return edadTitular >= 18 && edadTitular <= 35;
            if (plan.ageRange === '18-50') return edadTitular >= 18 && edadTitular <= 50;
            if (plan.ageRange === '51+') return edadTitular >= 51;
            return true;
        });
    } else {
        planesAMostrar = planesData.familiar;
    }
    
    // Generar HTML de los planes
    plansGrid.innerHTML = planesAMostrar.map(plan => generatePlanCard(plan)).join('');
    
    // Agregar event listeners a botones de selección
    const selectButtons = document.querySelectorAll('.select-plan-btn');
    selectButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => selectPlan(planesAMostrar[index]));
    });
}

function generatePlanCard(plan) {
    const recommendedClass = plan.recommended ? 'recommended' : '';
    const features = plan.features.map(feature => '<li>' + feature + '</li>').join('');
    
    return '<div class="plan-card ' + recommendedClass + '">' +
        '<div class="plan-name">' + plan.name + '</div>' +
        '<div class="plan-price">' +
        '<span class="currency">$</span>' + plan.price.toLocaleString() +
        '<div style="font-size: 0.6em; color: #718096; font-weight: 400;">por mes</div>' +
        '</div>' +
        '<ul class="plan-features">' + features + '</ul>' +
        '<button class="select-plan-btn">Seleccionar Plan</button>' +
        '</div>';
}

function selectPlan(plan) {
    alert('¡Excelente elección! Has seleccionado el ' + plan.name + '.\n\nUn miembro de nuestro equipo de ventas se contactará contigo en las próximas horas para finalizar la afiliación.\n\n¡Gracias por elegir OSPADEP!');
}

function goBack() {
    const formSection = document.getElementById('form-section');
    const detailsSection = document.getElementById('details-section');
    
    detailsSection.style.display = 'none';
    formSection.style.display = 'block';
}

function goToDetails() {
    const detailsSection = document.getElementById('details-section');
    const plansSection = document.getElementById('plans-section');
    
    plansSection.style.display = 'none';
    detailsSection.style.display = 'block';
}

function setupContactButtons() {
    setTimeout(() => {
        const whatsappBtn = document.querySelector('.contact-btn.whatsapp');
        const phoneBtn = document.querySelector('.contact-btn.phone');
        const emailBtn = document.querySelector('.contact-btn.email');
        
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => {
                window.open('https://wa.me/541234567890?text=Hola,%20necesito%20información%20sobre%20los%20planes%20de%20OSPADEP', '_blank');
            });
        }
        
        if (phoneBtn) {
            phoneBtn.addEventListener('click', () => {
                window.open('tel:+541234567890');
            });
        }
        
        if (emailBtn) {
            emailBtn.addEventListener('click', () => {
                window.open('mailto:comercial@ospadep.com.ar?subject=Consulta%20sobre%20planes%20de%20salud');
            });
        }
    }, 100);
}

// Funciones de utilidad mejoradas
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(amount);
}

function validateAge(age) {
    return age >= 18 && age <= 100;
}

function validateChildrenAges(agesString) {
    const ages = agesString.split(',').map(age => age.trim());
    
    for (let age of ages) {
        if (isNaN(age) || age === '' || parseInt(age) < 0 || parseInt(age) > 25) {
            return false;
        }
    }
    
    return true;
}

// ===== PANEL ADMINISTRATIVO =====

// Contraseña del administrador (en un entorno real, esto debería estar en el backend)
const ADMIN_PASSWORD = 'ospadep2024';

// Precios originales para poder restaurar
const originalPrices = JSON.parse(JSON.stringify(planesData));

// Inicializar datos administrativos
function initializeAdminData() {
    // Cargar precios personalizados si existen
    const savedPrices = localStorage.getItem('ospadep_custom_prices');
    if (savedPrices) {
        const customPrices = JSON.parse(savedPrices);
        applyCustomPrices(customPrices);
    }
    
    // Cargar histórico de cambios
    const savedHistory = localStorage.getItem('ospadep_price_history');
    if (!savedHistory) {
        localStorage.setItem('ospadep_price_history', JSON.stringify([]));
    }
}

// Mostrar modal de login administrativo
// ================================
// FUNCIONES DE AUTENTICACIÓN
// ================================

// Actualizar UI cuando el usuario está logueado
function updateUIForLoggedInUser() {
    const currentUser = window.AuthSystem.getCurrentUser();
    const loginSection = document.getElementById('login-section');
    const userInfoSection = document.getElementById('user-info-section');
    const headerUserName = document.getElementById('header-user-name');
    const headerUserRole = document.getElementById('header-user-role');
    
    if (currentUser) {
        // Mostrar información del usuario
        if (loginSection) loginSection.style.display = 'none';
        if (userInfoSection) userInfoSection.style.display = 'flex';
        
        if (headerUserName) headerUserName.textContent = currentUser.name;
        if (headerUserRole) {
            const roleDisplay = currentUser.role.replace('_', ' ');
            headerUserRole.textContent = roleDisplay;
        }
    } else {
        // Mostrar botón de login
        if (loginSection) loginSection.style.display = 'block';
        if (userInfoSection) userInfoSection.style.display = 'none';
    }
}

// Mostrar menú de usuario
function showUserMenu() {
    const currentUser = window.AuthSystem.getCurrentUser();
    if (!currentUser) return;

    const menu = document.createElement('div');
    menu.className = 'user-menu-dropdown';
    menu.innerHTML = `
        <div class="user-info">
            <strong>${currentUser.name}</strong>
            <small>${currentUser.role.replace('_', ' ')}</small>
        </div>
        <div class="menu-options">
            ${window.AuthSystem.isSuperAdmin() ? '<button onclick="goToSuperAdminPanel()"><i class="fas fa-crown"></i> Panel SuperAdmin</button>' : ''}
            ${window.AuthSystem.isAdmin() ? '<button onclick="showAdminPanel()"><i class="fas fa-cogs"></i> Panel Admin</button>' : ''}
            <button onclick="handleLogout()"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</button>
        </div>
    `;

    // Remover menú anterior si existe
    const existingMenu = document.querySelector('.user-menu-dropdown');
    if (existingMenu) {
        existingMenu.remove();
    }

    // Agregar el menú
    document.body.appendChild(menu);

    // Posicionar el menú
    const userSection = document.getElementById('user-info-section');
    const rect = userSection.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = (rect.bottom + 10) + 'px';
    menu.style.right = '20px';

    // Cerrar menú al hacer clic fuera
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

function showAdminLogin() {
    const modal = document.getElementById('admin-modal');
    modal.style.display = 'block';
    
    // Limpiar campos al abrir
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('login-error').textContent = '';
    
    // Focus en el campo de usuario
    setTimeout(() => {
        document.getElementById('login-username').focus();
    }, 100);
    
    // Remover event listeners existentes para evitar duplicados
    const usernameField = document.getElementById('login-username');
    const passwordField = document.getElementById('login-password');
    
    // Clonar elementos para remover todos los event listeners
    const newUsernameField = usernameField.cloneNode(true);
    const newPasswordField = passwordField.cloneNode(true);
    
    usernameField.parentNode.replaceChild(newUsernameField, usernameField);
    passwordField.parentNode.replaceChild(newPasswordField, passwordField);
    
    // Agregar nuevos event listeners
    newUsernameField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            newPasswordField.focus();
        }
    });
    
    newPasswordField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
}

// Ocultar modal de login
function hideAdminLogin() {
    const modal = document.getElementById('admin-modal');
    modal.style.display = 'none';
    
    // Limpiar campos
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('login-error').textContent = '';
}

// Manejar login
async function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');
    
    // Validaciones básicas
    if (!username || !password) {
        errorElement.textContent = 'Por favor, completa todos los campos';
        return;
    }
    
    try {
        // Usar el nuevo sistema de autenticación
        const result = await window.AuthSystem.login(username, password);
        
        if (result.success) {
            currentAdminMode = true;
            hideAdminLogin();
            updateUIForLoggedInUser();
            
            // Dirigir al panel apropiado según el rol
            if (window.AuthSystem.isSuperAdmin()) {
                showSuperAdminPanel();
            } else if (window.AuthSystem.isAdmin()) {
                showAdminPanel();
            } else {
                goToMainPage();
            }
            
            // Mostrar bienvenida
            console.log(`✅ Sesión iniciada: ${result.user.name} (${result.user.role})`);
        }
    } catch (error) {
        errorElement.textContent = error.message;
        document.getElementById('login-username').style.borderColor = '#ef4444';
        document.getElementById('login-password').style.borderColor = '#ef4444';
        
        // Limpiar error después de 3 segundos
        setTimeout(() => {
            errorElement.textContent = '';
            document.getElementById('login-username').style.borderColor = '#e2e8f0';
            document.getElementById('login-password').style.borderColor = '#e2e8f0';
        }, 3000);
    }
}

// Manejar logout
function handleLogout() {
    window.AuthSystem.logout();
    currentAdminMode = false;
    
    // Actualizar UI usando la función existente
    updateUIForLoggedInUser();
    
    // Remover menú de usuario si existe
    const existingMenu = document.querySelector('.user-menu-dropdown');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Volver a la página principal
    goToMainPage();
    
    console.log('🔓 Sesión cerrada');
}

// Mostrar panel administrativo
function showAdminPanel() {
    // Ocultar todas las secciones
    document.getElementById('form-section').style.display = 'none';
    document.getElementById('details-section').style.display = 'none';
    document.getElementById('plans-section').style.display = 'none';
    
    // Mostrar panel administrativo
    document.getElementById('admin-section').style.display = 'block';
    
    // Inicializar vista del panel
    initializeAdminView();
}

// Volver a la página principal
function goToMainPage() {
    document.getElementById('admin-section').style.display = 'none';
    document.getElementById('form-section').style.display = 'block';
    
    // Reiniciar formulario
    selectedOption = null;
    const continueBtn = document.getElementById('continue-btn');
    continueBtn.disabled = true;
    
    // Limpiar selecciones
    const optionItems = document.querySelectorAll('.option-item');
    optionItems.forEach(item => {
        item.classList.remove('selected');
    });
}

// Inicializar vista del panel administrativo
function initializeAdminView() {
    // Cargar precios actuales
    loadCurrentPrices();
    
    // Cargar histórico
    loadPriceHistory();
    
    // Ocultar secciones de edición
    document.getElementById('bulk-update-section').style.display = 'none';
    document.getElementById('individual-update-section').style.display = 'none';
}

// Mostrar sección de aumento masivo
function showBulkIncrease() {
    hideAllUpdateSections();
    document.getElementById('bulk-increase-section').style.display = 'block';
    
    // Focus en el campo de porcentaje
    setTimeout(() => {
        document.getElementById('increase-percentage').focus();
    }, 100);
}

// Ocultar sección de aumento masivo
function hideBulkIncrease() {
    document.getElementById('bulk-increase-section').style.display = 'none';
    
    // Limpiar campos
    document.getElementById('increase-percentage').value = '';
    document.getElementById('increase-category').value = 'all';
}

// Mostrar sección de descuento masivo
function showBulkDecrease() {
    hideAllUpdateSections();
    document.getElementById('bulk-decrease-section').style.display = 'block';
    
    // Focus en el campo de porcentaje
    setTimeout(() => {
        document.getElementById('decrease-percentage').focus();
    }, 100);
}

// Ocultar sección de descuento masivo
function hideBulkDecrease() {
    document.getElementById('bulk-decrease-section').style.display = 'none';
    
    // Limpiar campos
    document.getElementById('decrease-percentage').value = '';
    document.getElementById('decrease-category').value = 'all';
}

// Mostrar sección de edición individual
function showIndividualUpdate() {
    hideAllUpdateSections();
    document.getElementById('individual-update-section').style.display = 'block';
    
    // Cargar lista de planes para editar
    loadPlansForEditing();
}

// Ocultar sección de edición individual
function hideIndividualUpdate() {
    document.getElementById('individual-update-section').style.display = 'none';
}

// Ocultar todas las secciones de actualización
function hideAllUpdateSections() {
    document.getElementById('bulk-increase-section').style.display = 'none';
    document.getElementById('bulk-decrease-section').style.display = 'none';
    document.getElementById('individual-update-section').style.display = 'none';
}

// Aplicar aumento masivo
function applyBulkIncrease() {
    const percentage = parseFloat(document.getElementById('increase-percentage').value);
    const category = document.getElementById('increase-category').value;
    
    if (isNaN(percentage) || percentage <= 0) {
        alert('Por favor, ingresa un porcentaje de aumento válido (mayor a 0)');
        return;
    }
    
    // Confirmar cambios
    const confirm = window.confirm(
        `¿Estás seguro de aplicar un aumento del ${percentage}% a ${category === 'all' ? 'todos los planes' : 'los planes ' + category}?`
    );
    
    if (!confirm) return;
    
    let updatedPlans = 0;
    const changes = [];
    
    // Aplicar cambios según la categoría
    Object.keys(planesData).forEach(categoryKey => {
        if (category === 'all' || 
            (category === 'individual' && categoryKey === 'individual') ||
            (category === 'familiar' && categoryKey === 'familiar')) {
            
            planesData[categoryKey].forEach(plan => {
                const oldPrice = plan.price;
                const newPrice = Math.round(oldPrice * (1 + percentage / 100));
                plan.price = newPrice;
                updatedPlans++;
                
                changes.push({
                    plan: plan.name,
                    category: categoryKey,
                    oldPrice: oldPrice,
                    newPrice: newPrice,
                    change: newPrice - oldPrice
                });
            });
        }
    });
    
    // Guardar cambios
    saveCustomPrices();
    
    // Registrar en histórico
    addToHistory({
        type: 'bulk_increase',
        description: `Aumento masivo del ${percentage}% aplicado a ${category === 'all' ? 'todos los planes' : 'planes ' + category}`,
        plansAffected: updatedPlans,
        changes: changes
    });
    
    // Registrar en auditoría
            if (window.AuthSystem) {
            window.AuthSystem.logActivity('BULK_INCREASE', {
            percentage: percentage,
            category: category,
            plansAffected: updatedPlans,
            timestamp: new Date().toISOString()
        });
    }
    
    // Actualizar vistas
    loadCurrentPrices();
    loadPriceHistory();
    hideBulkIncrease();
    
    alert(`✅ Se aplicó un aumento del ${percentage}% a ${updatedPlans} planes`);
}

// Aplicar descuento masivo
function applyBulkDecrease() {
    const percentage = parseFloat(document.getElementById('decrease-percentage').value);
    const category = document.getElementById('decrease-category').value;
    
    if (isNaN(percentage) || percentage <= 0 || percentage >= 100) {
        alert('Por favor, ingresa un porcentaje de descuento válido (entre 0.1 y 99)');
        return;
    }
    
    // Confirmar cambios
    const confirm = window.confirm(
        `¿Estás seguro de aplicar un descuento del ${percentage}% a ${category === 'all' ? 'todos los planes' : 'los planes ' + category}?`
    );
    
    if (!confirm) return;
    
    let updatedPlans = 0;
    const changes = [];
    
    // Aplicar cambios según la categoría
    Object.keys(planesData).forEach(categoryKey => {
        if (category === 'all' || 
            (category === 'individual' && categoryKey === 'individual') ||
            (category === 'familiar' && categoryKey === 'familiar')) {
            
            planesData[categoryKey].forEach(plan => {
                const oldPrice = plan.price;
                const newPrice = Math.round(oldPrice * (1 - percentage / 100));
                plan.price = newPrice;
                updatedPlans++;
                
                changes.push({
                    plan: plan.name,
                    category: categoryKey,
                    oldPrice: oldPrice,
                    newPrice: newPrice,
                    change: newPrice - oldPrice
                });
            });
        }
    });
    
    // Guardar cambios
    saveCustomPrices();
    
    // Registrar en histórico
    addToHistory({
        type: 'bulk_decrease',
        description: `Descuento masivo del ${percentage}% aplicado a ${category === 'all' ? 'todos los planes' : 'planes ' + category}`,
        plansAffected: updatedPlans,
        changes: changes
    });
    
    // Registrar en auditoría
            if (window.AuthSystem) {
            window.AuthSystem.logActivity('BULK_DECREASE', {
            percentage: percentage,
            category: category,
            plansAffected: updatedPlans,
            timestamp: new Date().toISOString()
        });
    }
    
    // Actualizar vistas
    loadCurrentPrices();
    loadPriceHistory();
    hideBulkDecrease();
    
    alert(`💰 Se aplicó un descuento del ${percentage}% a ${updatedPlans} planes`);
}

// Cargar planes para edición individual
function loadPlansForEditing() {
    const container = document.getElementById('admin-plans-list');
    let html = '';
    
    Object.keys(planesData).forEach(categoryKey => {
        planesData[categoryKey].forEach((plan, index) => {
            const originalPrice = getOriginalPrice(categoryKey, index);
            const priceChange = plan.price - originalPrice;
            const changeClass = priceChange > 0 ? 'increase' : priceChange < 0 ? 'decrease' : 'no-change';
            const changeText = priceChange === 0 ? 'Sin cambios' : 
                              priceChange > 0 ? `+$${priceChange.toLocaleString()}` : 
                              `-$${Math.abs(priceChange).toLocaleString()}`;
            
            html += `
                <div class="admin-plan-item">
                    <div class="plan-info">
                        <h4>${plan.name}</h4>
                        <div class="plan-category">${categoryKey}</div>
                    </div>
                    <input type="number" 
                           class="price-input" 
                           value="${plan.price}" 
                           data-category="${categoryKey}" 
                           data-index="${index}"
                           min="0">
                    <div class="price-change ${changeClass}">
                        ${changeText}
                    </div>
                </div>
            `;
        });
    });
    
    container.innerHTML = html;
    
    // Agregar event listeners para cambios en tiempo real
    container.querySelectorAll('.price-input').forEach(input => {
        input.addEventListener('input', function() {
            updatePriceChange(this);
        });
    });
}

// Actualizar indicador de cambio de precio en tiempo real
function updatePriceChange(input) {
    const category = input.dataset.category;
    const index = parseInt(input.dataset.index);
    const newPrice = parseInt(input.value) || 0;
    const originalPrice = getOriginalPrice(category, index);
    const change = newPrice - originalPrice;
    
    const changeElement = input.nextElementSibling;
    
    if (change === 0) {
        changeElement.className = 'price-change no-change';
        changeElement.textContent = 'Sin cambios';
    } else if (change > 0) {
        changeElement.className = 'price-change increase';
        changeElement.textContent = `+$${change.toLocaleString()}`;
    } else {
        changeElement.className = 'price-change decrease';
        changeElement.textContent = `-$${Math.abs(change).toLocaleString()}`;
    }
}

// Guardar cambios individuales
function saveIndividualChanges() {
    const inputs = document.querySelectorAll('.price-input');
    const changes = [];
    let hasChanges = false;
    
    inputs.forEach(input => {
        const category = input.dataset.category;
        const index = parseInt(input.dataset.index);
        const newPrice = parseInt(input.value) || 0;
        const oldPrice = planesData[category][index].price;
        
        if (newPrice !== oldPrice && newPrice > 0) {
            planesData[category][index].price = newPrice;
            hasChanges = true;
            
            changes.push({
                plan: planesData[category][index].name,
                category: category,
                oldPrice: oldPrice,
                newPrice: newPrice,
                change: newPrice - oldPrice
            });
        }
    });
    
    if (!hasChanges) {
        alert('No se detectaron cambios en los precios');
        return;
    }
    
    // Confirmar cambios
    const confirm = window.confirm(`¿Confirmas los cambios en ${changes.length} planes?`);
    if (!confirm) return;
    
    // Guardar cambios
    saveCustomPrices();
    
    // Registrar en histórico
    addToHistory({
        type: 'individual_update',
        description: `Actualización individual de ${changes.length} planes`,
        plansAffected: changes.length,
        changes: changes
    });
    
    // Actualizar vistas
    loadCurrentPrices();
    loadPriceHistory();
    hideIndividualUpdate();
    
    alert(`Se actualizaron ${changes.length} planes correctamente`);
}

// Obtener precio original de un plan
function getOriginalPrice(category, index) {
    return originalPrices[category][index].price;
}

// Guardar precios personalizados
function saveCustomPrices() {
    localStorage.setItem('ospadep_custom_prices', JSON.stringify(planesData));
}

// Aplicar precios personalizados
function applyCustomPrices(customPrices) {
    Object.keys(customPrices).forEach(category => {
        customPrices[category].forEach((customPlan, index) => {
            if (planesData[category] && planesData[category][index]) {
                planesData[category][index].price = customPlan.price;
            }
        });
    });
}

// Restaurar precios originales
function resetPrices() {
    const confirm = window.confirm('¿Estás seguro de que deseas restaurar todos los precios a sus valores originales? Esta acción no se puede deshacer.');
    
    if (!confirm) return;
    
    // Contar planes que cambiarán
    let affectedPlans = 0;
    Object.keys(planesData).forEach(category => {
        planesData[category].forEach((plan, index) => {
            if (plan.price !== originalPrices[category][index].price) {
                affectedPlans++;
            }
        });
    });
    
    // Restaurar precios
    Object.keys(originalPrices).forEach(category => {
        originalPrices[category].forEach((originalPlan, index) => {
            if (planesData[category] && planesData[category][index]) {
                planesData[category][index].price = originalPlan.price;
            }
        });
    });
    
    // Limpiar localStorage
    localStorage.removeItem('ospadep_custom_prices');
    
    // Registrar en histórico
    addToHistory({
        type: 'reset',
        description: 'Restauración de precios originales',
        plansAffected: affectedPlans,
        changes: []
    });
    
    // Actualizar vistas
    loadCurrentPrices();
    loadPriceHistory();
    hideAllUpdateSections();
    
    alert(`Se restauraron los precios originales de ${affectedPlans} planes`);
}
function exportPrices() {
    const exportData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        originalPrices: originalPrices,
        currentPrices: planesData,
        history: JSON.parse(localStorage.getItem('ospadep_price_history') || '[]')
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `ospadep_precios_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    
    alert('Configuración exportada correctamente');
}

// Cargar precios actuales en la vista
function loadCurrentPrices() {
    const container = document.getElementById('current-prices-grid');
    let html = '';
    
    Object.keys(planesData).forEach(categoryKey => {
        planesData[categoryKey].forEach((plan, index) => {
            const originalPrice = getOriginalPrice(categoryKey, index);
            const hasChanged = plan.price !== originalPrice;
            
            html += `
                <div class="current-price-item">
                    <h4>${plan.name}</h4>
                    <div class="price-display">
                        $${plan.price.toLocaleString()}
                        ${hasChanged ? `<span class="original-price">$${originalPrice.toLocaleString()}</span>` : ''}
                    </div>
                    <div class="price-status">
                        ${hasChanged ? 'Precio modificado' : 'Precio original'}
                    </div>
                </div>
            `;
        });
    });
    
    container.innerHTML = html;
}

// Cargar histórico de cambios
function loadPriceHistory() {
    const container = document.getElementById('price-history-list');
    const history = JSON.parse(localStorage.getItem('ospadep_price_history') || '[]');
    
    if (history.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #64748b; padding: 20px;">No hay cambios registrados</p>';
        return;
    }
    
    let html = '';
    history.slice(-10).reverse().forEach(record => { // Mostrar últimos 10 cambios
        html += `
            <div class="history-item">
                <div class="history-date">
                    ${new Date(record.timestamp).toLocaleDateString('es-ES')} 
                    ${new Date(record.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div class="history-description">
                    ${record.description}
                </div>
                <div class="history-impact">
                    ${record.plansAffected} planes afectados
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Agregar registro al histórico
function addToHistory(record) {
    const history = JSON.parse(localStorage.getItem('ospadep_price_history') || '[]');
    
    record.timestamp = new Date().toISOString();
    record.id = Date.now();
    
    history.push(record);
    
    // Mantener solo los últimos 50 registros
    if (history.length > 50) {
        history.splice(0, history.length - 50);
    }
    
    localStorage.setItem('ospadep_price_history', JSON.stringify(history));
}

// Inicializar datos administrativos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminData();
}); 

// ================================
// FUNCIONES PARA PLANES PERSONALIZADOS
// ================================

// Guardar planes personalizados
function saveCustomPlans() {
    localStorage.setItem('ospadep_custom_plans', JSON.stringify(planesData));
    console.log('Planes personalizados guardados');
}

// Cargar planes personalizados
function loadCustomPlans() {
    const saved = localStorage.getItem('ospadep_custom_plans');
    if (saved) {
        try {
            const customPlans = JSON.parse(saved);
            // Mergear con planes existentes, dando prioridad a los personalizados
            Object.keys(customPlans).forEach(category => {
                if (customPlans[category] && Array.isArray(customPlans[category])) {
                    planesData[category] = customPlans[category];
                }
            });
            console.log('Planes personalizados cargados');
        } catch (error) {
            console.error('Error cargando planes personalizados:', error);
        }
    }
}

// Eliminar un plan específico
function removePlan(category, planIndex) {
    if (planesData[category] && planesData[category][planIndex]) {
        const removedPlan = planesData[category].splice(planIndex, 1)[0];
        saveCustomPlans();
        console.log(`Plan "${removedPlan.name}" eliminado de la categoría "${category}"`);
        
        // Actualizar vista si estamos en el panel admin
        if (document.getElementById('admin-section').style.display === 'block') {
            loadCurrentPrices();
        }
        return true;
    }
    return false;
}

// Resetear a planes originales
function resetToOriginalPlans() {
    const confirm = window.confirm('¿Estás seguro de resetear todos los planes a los originales? Se perderán todos los planes personalizados.');
    if (confirm) {
        localStorage.removeItem('ospadep_custom_plans');
        localStorage.removeItem('ospadep_custom_prices');
        alert('Planes reseteados. La página se recargará.');
        location.reload();
    }
}

// Función para agregar planes desde la consola del navegador
window.agregarPlan = function(categoria, planData) {
    const resultado = addCustomPlan(categoria, planData);
    if (resultado) {
        saveCustomPlans();
        
        // Actualizar vista si estamos en el panel admin
        if (document.getElementById('admin-section').style.display === 'block') {
            loadCurrentPrices();
        }
        
        alert(`Plan "${planData.name}" agregado exitosamente!`);
    }
    return resultado;
};

// Función para eliminar planes desde la consola
window.eliminarPlan = function(categoria, indice) {
    const resultado = removePlan(categoria, indice);
    if (resultado) {
        alert('Plan eliminado exitosamente!');
    } else {
        alert('No se pudo eliminar el plan. Verifica la categoría e índice.');
    }
    return resultado;
};

// Función para ver todos los planes actuales
window.verPlanes = function() {
    console.log('Planes actuales:', planesData);
    return planesData;
};

// Función para crear categoría personalizada
window.crearCategoria = function(nombre, planes = []) {
    createPlanCategory(nombre, planes);
    saveCustomPlans();
    console.log(`Categoría "${nombre}" creada`);
};

// ================================
// FUNCIONES DEL PANEL SUPERADMIN
// ================================

// Mostrar panel de SuperAdmin
function showSuperAdminPanel() {
    // Verificar que sea SuperAdmin
    if (!window.AuthSystem.isSuperAdmin()) {
        alert('Acceso denegado. Se requieren permisos de SuperAdministrador.');
        return;
    }
    
    // Ocultar todas las secciones
    document.getElementById('form-section').style.display = 'none';
    document.getElementById('details-section').style.display = 'none';
    document.getElementById('plans-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'none';
    
    // Mostrar panel de SuperAdmin
    document.getElementById('super-admin-section').style.display = 'block';
    
    // Registrar acceso
    window.AuthSystem.logActivity('SUPER_ADMIN_ACCESS', {
        timestamp: new Date().toISOString()
    });
    
    // Cargar datos del panel
    loadSuperAdminData();
}

// Volver al panel administrativo normal
function goToAdminPanel() {
    document.getElementById('super-admin-section').style.display = 'none';
    showAdminPanel();
}

// Ir al panel de SuperAdmin desde Admin
function goToSuperAdminPanel() {
    if (!window.AuthSystem.isSuperAdmin()) {
        alert('No tienes permisos para acceder al panel de SuperAdmin');
        return;
    }
    
    document.getElementById('admin-section').style.display = 'none';
    showSuperAdminPanel();
}

// Cargar datos del SuperAdmin
function loadSuperAdminData() {
    loadStatsOverview();
    hideAllSuperAdminSections();
}

// Cargar estadísticas generales
function loadStatsOverview() {
    const stats = window.AuthSystem.getUserStats();
    
    // Actualizar estadísticas en el DOM
    document.getElementById('total-sessions').textContent = stats.totalSessions;
    document.getElementById('total-actions').textContent = stats.totalActions;
    
    // Calcular actividad de hoy (usando el campo existente)
    document.getElementById('today-activity').textContent = stats.todayActivity;
    
    // Calcular duración promedio (placeholder)
    document.getElementById('avg-session').textContent = '25m';
}

// Mostrar registro de auditoría
function showAuditLog() {
    hideAllSuperAdminSections();
    document.getElementById('audit-log-section').style.display = 'block';
    
    // Cargar filtros
    loadAuditFilters();
    
    // Cargar registros
    loadAuditRecords();
    
    window.AuthSystem.logActivity('VIEW_AUDIT_LOG', {
        timestamp: new Date().toISOString()
    });
}

// Cargar filtros de auditoría
function loadAuditFilters() {
    const auditLog = window.AuthSystem.getAuditLog();
    
    // Obtener usuarios únicos
    const users = [...new Set(auditLog.map(entry => entry.userId))];
    const userFilter = document.getElementById('audit-user-filter');
    userFilter.innerHTML = '<option value="">Todos los usuarios</option>';
    users.forEach(user => {
        userFilter.innerHTML += `<option value="${user}">${user}</option>`;
    });
    
    // Obtener acciones únicas
    const actions = [...new Set(auditLog.map(entry => entry.action))];
    const actionFilter = document.getElementById('audit-action-filter');
    actionFilter.innerHTML = '<option value="">Todas las acciones</option>';
    actions.forEach(action => {
        actionFilter.innerHTML += `<option value="${action}">${action.replace(/_/g, ' ')}</option>`;
    });
}

// Cargar registros de auditoría
function loadAuditRecords(filters = {}) {
    const auditLog = window.AuthSystem.getAuditLog(filters);
    const container = document.getElementById('audit-log-list');
    
    if (auditLog.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #64748b;">No hay registros que mostrar</div>';
        return;
    }
    
    let html = '';
    auditLog.slice(0, 100).forEach(entry => { // Mostrar últimos 100
        const date = new Date(entry.timestamp);
        const actionBadgeClass = getActionBadgeClass(entry.action);
        
        html += `
            <div class="audit-item">
                <div class="audit-timestamp">
                    ${date.toLocaleDateString('es-ES')}<br>
                    ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div class="audit-action">
                    <span class="action-badge ${actionBadgeClass}">
                        ${entry.action.replace(/_/g, ' ')}
                    </span>
                    ${getActionDescription(entry)}
                </div>
                <div class="audit-user">
                    ${entry.userId}
                    <div style="font-size: 0.8rem; color: #64748b;">${entry.userRole}</div>
                </div>
                <div class="audit-details">
                    ${getAuditDetails(entry)}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Obtener clase CSS para badge de acción
function getActionBadgeClass(action) {
    if (action.includes('LOGIN')) return 'login';
    if (action.includes('LOGOUT')) return 'logout';
    if (action.includes('PRICE') || action.includes('BULK')) return 'price-change';
    if (action.includes('DELETE') || action.includes('RESET')) return 'critical';
    return '';
}

// Obtener descripción de acción
function getActionDescription(entry) {
    const descriptions = {
        'USER_LOGIN': 'Inicio de sesión',
        'USER_LOGOUT': 'Cierre de sesión',
        'BULK_INCREASE': 'Aumento masivo de precios',
        'BULK_DECREASE': 'Descuento masivo de precios',
        'INDIVIDUAL_UPDATE': 'Actualización individual',
        'PRICE_RESET': 'Restauración de precios',
        'PLAN_ADDED': 'Plan agregado',
        'PLAN_REMOVED': 'Plan eliminado',
        'SUPER_ADMIN_ACCESS': 'Acceso a SuperAdmin',
        'VIEW_AUDIT_LOG': 'Consulta de auditoría',
        'PAGE_LOAD': 'Carga de página'
    };
    
    return descriptions[entry.action] || entry.action.replace(/_/g, ' ').toLowerCase();
}

// Obtener detalles de auditoría
function getAuditDetails(entry) {
    if (entry.details.plansAffected) {
        return `${entry.details.plansAffected} planes`;
    }
    if (entry.details.sessionDuration) {
        return `${entry.details.sessionDuration}min`;
    }
    if (entry.details.recordCount) {
        return `${entry.details.recordCount} registros`;
    }
    return '';
}

// Aplicar filtros de auditoría
function applyAuditFilters() {
    const filters = {
        userId: document.getElementById('audit-user-filter').value,
        action: document.getElementById('audit-action-filter').value,
        dateFrom: document.getElementById('audit-date-from').value,
        dateTo: document.getElementById('audit-date-to').value
    };
    
    // Limpiar filtros vacíos
    Object.keys(filters).forEach(key => {
        if (!filters[key]) delete filters[key];
    });
    
    loadAuditRecords(filters);
    
    window.AuthSystem.logActivity('AUDIT_FILTER_APPLIED', { filters });
}

// Mostrar actividad de usuarios
function showUserActivity() {
    hideAllSuperAdminSections();
    document.getElementById('user-activity-section').style.display = 'block';
    
    loadUserActivityData();
    
    window.AuthSystem.logActivity('VIEW_USER_ACTIVITY', {
        timestamp: new Date().toISOString()
    });
}

// Cargar datos de actividad de usuarios
function loadUserActivityData() {
    const stats = window.AuthSystem.getUserStats();
    const container = document.getElementById('user-activity-list');
    
    let html = '';
    Object.entries(stats.userActivity).forEach(([userId, userData]) => {
        const initials = userId.slice(0, 2).toUpperCase();
        const lastActivity = new Date(userData.lastActivity).toLocaleDateString('es-ES');
        
        html += `
            <div class="user-activity-item">
                <div class="user-info">
                    <div class="user-avatar">${initials}</div>
                    <div class="user-details">
                        <h4>${userId}</h4>
                        <div class="user-role">${userData.role}</div>
                    </div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 0.9rem; color: #64748b;">Última actividad</div>
                    <div style="font-weight: 600;">${lastActivity}</div>
                </div>
                <div class="user-stats">
                    <div class="stat-number">${userData.totalActions}</div>
                    <div class="stat-label">acciones</div>
                </div>
            </div>
        `;
    });
    
    if (html === '') {
        html = '<div style="text-align: center; padding: 40px; color: #64748b;">No hay actividad de usuarios registrada</div>';
    }
    
    container.innerHTML = html;
}

// Exportar todos los datos
function exportFullData() {
    const exportData = {
        exportDate: new Date().toISOString(),
        exportedBy: window.AuthSystem.getCurrentUser().id,
        data: {
            auditLog: window.AuthSystem.getAuditLog(),
            userStats: window.AuthSystem.getUserStats(),
            currentPrices: planesData,
            originalPrices: originalPrices,
            priceHistory: JSON.parse(localStorage.getItem('ospadep_price_history') || '[]'),
            customPlans: JSON.parse(localStorage.getItem('ospadep_custom_plans') || '{}')
        }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `ospadep_datos_completos_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    
    window.AuthSystem.logActivity('FULL_DATA_EXPORT', {
        recordCount: exportData.data.auditLog.length,
        timestamp: new Date().toISOString()
    });
    
    alert('✅ Exportación completa realizada');
}

// Limpiar registro de auditoría
function clearAuditLog() {
    const confirm = window.confirm(
        '⚠️ ¿Estás seguro de que quieres limpiar todo el registro de auditoría?\n\nEsta acción no se puede deshacer.'
    );
    
    if (!confirm) return;
    
    const auditLog = window.AuthSystem.getAuditLog();
    const recordCount = auditLog.length;
    
    // Guardar último registro antes de limpiar
    window.AuthSystem.logActivity('AUDIT_LOG_CLEARED', {
        clearedRecords: recordCount,
        clearedBy: window.AuthSystem.getCurrentUser().id,
        timestamp: new Date().toISOString()
    });
    
    // Limpiar auditoría (excepto el último registro)
    localStorage.setItem('ospadep_audit_log', JSON.stringify([
        JSON.parse(localStorage.getItem('ospadep_audit_log') || '[]').slice(-1)
    ]));
    
    // Recargar vista
    if (document.getElementById('audit-log-section').style.display === 'block') {
        loadAuditRecords();
    }
    
    loadStatsOverview();
    
    alert(`🗑️ Se eliminaron ${recordCount - 1} registros de auditoría`);
}

// Ocultar todas las secciones de SuperAdmin
function hideAllSuperAdminSections() {
    document.getElementById('audit-log-section').style.display = 'none';
    document.getElementById('user-activity-section').style.display = 'none';
    document.getElementById('user-management-section').style.display = 'none';
}

// ================================
// GESTIÓN DE USUARIOS
// ================================

// Mostrar sección de gestión de usuarios
function showUserManagement() {
    if (!window.AuthSystem.isSuperAdmin()) {
        alert('No tienes permisos para gestionar usuarios');
        return;
    }
    
    hideAllSuperAdminSections();
    document.getElementById('user-management-section').style.display = 'block';
    
    loadUsersGrid();
    
    window.AuthSystem.logActivity('VIEW_USER_MANAGEMENT', {
        timestamp: new Date().toISOString()
    });
}

// Cargar grid de usuarios
function loadUsersGrid() {
    const users = window.AuthSystem.getAllUsers();
    const container = document.getElementById('users-grid');
    
    let html = '';
    users.forEach(user => {
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const roleClass = user.role.replace('_', '-');
        const statusClass = user.isActive ? 'active' : 'inactive';
        const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('es-ES') : 'Nunca';
        
        html += `
            <div class="user-card ${statusClass}">
                <div class="user-card-header">
                    <div class="user-avatar ${roleClass}">${initials}</div>
                    <div class="user-status">
                        <span class="status-indicator ${statusClass}"></span>
                        <span class="status-text">${user.isActive ? 'Activo' : 'Inactivo'}</span>
                    </div>
                </div>
                
                <div class="user-card-body">
                    <h4 class="user-name">${user.name}</h4>
                    <div class="user-username">@${user.username}</div>
                    <div class="user-role badge ${roleClass}">${user.role.replace('_', ' ')}</div>
                    
                    ${user.email ? `<div class="user-email"><i class="fas fa-envelope"></i> ${user.email}</div>` : ''}
                    
                    <div class="user-meta">
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>Creado: ${new Date(user.createdAt).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>Último acceso: ${lastLogin}</span>
                        </div>
                    </div>
                </div>
                
                <div class="user-card-actions">
                    <button class="action-btn edit" onclick="editUser('${user.username}')" title="Editar usuario">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn toggle" onclick="toggleUserStatus('${user.username}')" 
                            title="${user.isActive ? 'Desactivar' : 'Activar'} usuario">
                        <i class="fas fa-${user.isActive ? 'ban' : 'check'}"></i>
                    </button>
                    ${user.username !== 'superadmin' ? `
                        <button class="action-btn delete" onclick="deleteUser('${user.username}')" title="Eliminar usuario">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    if (html === '') {
        html = '<div style="text-align: center; padding: 40px; color: #64748b;">No hay usuarios registrados</div>';
    }
    
    container.innerHTML = html;
}

// Mostrar modal para crear usuario
function showCreateUserModal() {
    editingUserId = null;
    
    // Resetear formulario
    document.getElementById('user-form').reset();
    document.getElementById('user-modal-title').innerHTML = '<i class="fas fa-user-plus"></i> Crear Usuario';
    document.getElementById('user-username').disabled = false;
    document.getElementById('user-form-error').textContent = '';
    
    // Mostrar modal
    document.getElementById('user-modal').style.display = 'flex';
    
    // Focus en primer campo
    setTimeout(() => {
        document.getElementById('user-username').focus();
    }, 100);
}

// Editar usuario
function editUser(username) {
    const users = window.AuthSystem.getAllUsers();
    const user = users.find(u => u.username === username);
    
    if (!user) {
        alert('Usuario no encontrado');
        return;
    }
    
    editingUserId = username;
    
    // Llenar formulario
    document.getElementById('user-username').value = user.username;
    document.getElementById('user-username').disabled = true; // No permitir cambiar username
    document.getElementById('user-name').value = user.name;
    document.getElementById('user-email').value = user.email || '';
    document.getElementById('user-role').value = user.role;
    document.getElementById('user-active').checked = user.isActive;
    document.getElementById('user-password').value = '';
    document.getElementById('user-password-confirm').value = '';
    document.getElementById('user-form-error').textContent = '';
    
    // Cambiar título del modal
    document.getElementById('user-modal-title').innerHTML = '<i class="fas fa-user-edit"></i> Editar Usuario';
    
    // Mostrar modal
    document.getElementById('user-modal').style.display = 'flex';
    
    // Focus en nombre
    setTimeout(() => {
        document.getElementById('user-name').focus();
    }, 100);
}

// Alternar estado del usuario
function toggleUserStatus(username) {
    if (username === 'superadmin') {
        alert('No se puede desactivar el superadministrador');
        return;
    }
    
    try {
        const users = window.AuthSystem.getAllUsers();
        const user = users.find(u => u.username === username);
        
        if (!user) {
            alert('Usuario no encontrado');
            return;
        }
        
        const newStatus = !user.isActive;
        const action = newStatus ? 'activar' : 'desactivar';
        
        const confirm = window.confirm(`¿Estás seguro de ${action} al usuario "${user.name}"?`);
        if (!confirm) return;
        
        window.AuthSystem.updateUser(username, { isActive: newStatus });
        loadUsersGrid();
        
        console.log(`✅ Usuario ${username} ${newStatus ? 'activado' : 'desactivado'}`);
        
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Eliminar usuario
function deleteUser(username) {
    if (username === 'superadmin') {
        alert('No se puede eliminar el superadministrador');
        return;
    }
    
    const users = window.AuthSystem.getAllUsers();
    const user = users.find(u => u.username === username);
    
    if (!user) {
        alert('Usuario no encontrado');
        return;
    }
    
    const confirm = window.confirm(
        `⚠️ ¿Estás seguro de eliminar al usuario "${user.name}" (@${username})?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirm) return;
    
    try {
        window.AuthSystem.deleteUser(username);
        loadUsersGrid();
        
        console.log(`🗑️ Usuario ${username} eliminado`);
        
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Ocultar modal de usuario
function hideUserModal() {
    document.getElementById('user-modal').style.display = 'none';
    editingUserId = null;
}

// Event listener para el formulario de usuario
document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('user-form');
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveUser();
        });
    }
});

// Guardar usuario (crear o editar)
function saveUser() {
    const formData = {
        username: document.getElementById('user-username').value.trim(),
        name: document.getElementById('user-name').value.trim(),
        email: document.getElementById('user-email').value.trim(),
        role: document.getElementById('user-role').value,
        password: document.getElementById('user-password').value,
        passwordConfirm: document.getElementById('user-password-confirm').value,
        isActive: document.getElementById('user-active').checked
    };
    
    const errorElement = document.getElementById('user-form-error');
    
    // Validaciones
    try {
        if (!formData.username || !formData.name || !formData.role) {
            throw new Error('Por favor, completa todos los campos obligatorios');
        }
        
        if (formData.username.length < 3) {
            throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            throw new Error('El nombre de usuario solo puede contener letras, números y guiones bajos');
        }
        
        // Validar contraseña solo si se está creando un usuario nuevo o se quiere cambiar
        if (!editingUserId || formData.password) {
            if (!formData.password) {
                throw new Error('La contraseña es obligatoria');
            }
            
            if (formData.password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }
            
            if (formData.password !== formData.passwordConfirm) {
                throw new Error('Las contraseñas no coinciden');
            }
        }
        
        // Crear o actualizar usuario
        if (editingUserId) {
            // Editar usuario existente
            const updates = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                isActive: formData.isActive
            };
            
            // Solo actualizar contraseña si se proporcionó una nueva
            if (formData.password) {
                updates.password = formData.password;
            }
            
            window.AuthSystem.updateUser(editingUserId, updates);
            console.log(`✅ Usuario ${editingUserId} actualizado`);
            
        } else {
            // Crear nuevo usuario
            window.AuthSystem.createUser(formData);
            console.log(`✅ Usuario ${formData.username} creado`);
        }
        
        // Cerrar modal y recargar grid
        hideUserModal();
        loadUsersGrid();
        
    } catch (error) {
        errorElement.textContent = error.message;
    }
} 
