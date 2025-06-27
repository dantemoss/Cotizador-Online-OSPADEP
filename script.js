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

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Cargar planes personalizados si existen
    loadCustomPlans();
    initializeApp();
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
function showAdminLogin() {
    const modal = document.getElementById('admin-modal');
    modal.style.display = 'flex';
    
    // Focus en el campo de contraseña
    setTimeout(() => {
        document.getElementById('admin-password').focus();
    }, 100);
    
    // Event listener para Enter en el campo de contraseña
    document.getElementById('admin-password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            validateAdminAccess();
        }
    });
}

// Ocultar modal de login
function hideAdminLogin() {
    const modal = document.getElementById('admin-modal');
    modal.style.display = 'none';
    
    // Limpiar campos
    document.getElementById('admin-password').value = '';
    document.getElementById('admin-error').textContent = '';
}

// Validar acceso administrativo
function validateAdminAccess() {
    const password = document.getElementById('admin-password').value;
    const errorElement = document.getElementById('admin-error');
    
    // Verificar que SecurityManager esté disponible
    if (!window.SecurityManager) {
        errorElement.textContent = 'Error del sistema. Recarga la página.';
        return;
    }
    
    // Usar el nuevo sistema de seguridad
    window.SecurityManager.attemptLogin(password)
        .then(isValid => {
            if (isValid) {
                hideAdminLogin();
                showAdminPanel();
            } else {
                const remainingAttempts = APP_CONFIG.MAX_LOGIN_ATTEMPTS - window.SecurityManager.loginAttempts;
                errorElement.textContent = `Contraseña incorrecta. Intentos restantes: ${remainingAttempts}`;
                document.getElementById('admin-password').style.borderColor = '#ef4444';
                
                // Limpiar error después de 3 segundos
                setTimeout(() => {
                    errorElement.textContent = '';
                    document.getElementById('admin-password').style.borderColor = '#e2e8f0';
                }, 3000);
            }
        })
        .catch(error => {
            errorElement.textContent = error.message;
            document.getElementById('admin-password').style.borderColor = '#ef4444';
        });
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

// Mostrar sección de actualización masiva
function showBulkUpdate() {
    hideAllUpdateSections();
    document.getElementById('bulk-update-section').style.display = 'block';
    
    // Focus en el campo de porcentaje
    setTimeout(() => {
        document.getElementById('bulk-percentage').focus();
    }, 100);
}

// Ocultar sección de actualización masiva
function hideBulkUpdate() {
    document.getElementById('bulk-update-section').style.display = 'none';
    
    // Limpiar campos
    document.getElementById('bulk-percentage').value = '';
    document.getElementById('plan-category').value = 'all';
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
    document.getElementById('bulk-update-section').style.display = 'none';
    document.getElementById('individual-update-section').style.display = 'none';
}

// Aplicar actualización masiva por porcentaje
function applyBulkUpdate() {
    const percentage = parseFloat(document.getElementById('bulk-percentage').value);
    const category = document.getElementById('plan-category').value;
    
    if (isNaN(percentage)) {
        alert('Por favor, ingresa un porcentaje válido');
        return;
    }
    
    // Confirmar cambios
    const action = percentage > 0 ? 'aumento' : 'descuento';
    const confirm = window.confirm(
        `¿Estás seguro de aplicar un ${action} del ${Math.abs(percentage)}% a ${category === 'all' ? 'todos los planes' : 'los planes ' + category}?`
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
        type: 'bulk_update',
        description: `Actualización masiva: ${action} del ${Math.abs(percentage)}% en ${category === 'all' ? 'todos los planes' : 'planes ' + category}`,
        plansAffected: updatedPlans,
        changes: changes
    });
    
    // Actualizar vistas
    loadCurrentPrices();
    loadPriceHistory();
    hideBulkUpdate();
    
    alert(`Se actualizaron ${updatedPlans} planes correctamente`);
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