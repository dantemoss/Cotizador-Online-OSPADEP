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

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
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
    if (!agesString || !agesString.trim()) {
        return false;
    }
    
    const ages = agesString.split(',').map(age => age.trim()).filter(age => age);
    
    if (ages.length === 0) {
        return false;
    }
    
    return ages.every(ageStr => {
        const age = parseInt(ageStr);
        return !isNaN(age) && age >= 0 && age <= 25;
    });
} 