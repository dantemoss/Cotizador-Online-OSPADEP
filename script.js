let selectedOption = null;
let formData = {};
let validationErrors = {};

// ===== SISTEMA DE PRECIOS EXTERNOS =====
// Los precios se cargan desde precios-data.json para facilitar actualizaciones
let prestadoresData = {};
let preciosExternosDisponibles = false;

// Función para cargar precios desde JSON externo
async function cargarPreciosExternos() {
    try {
        const response = await fetch('precios-data.json');
        if (response.ok) {
            const data = await response.json();
            prestadoresData = data.prestadores;
            preciosExternosDisponibles = true;
            console.log('✅ Precios cargados desde archivo externo:', data.version);
            return true;
        } else {
            console.warn('⚠️ No se pudo cargar precios externos, usando precios internos');
            return false;
        }
    } catch (error) {
        console.warn('⚠️ Error cargando precios externos:', error.message);
        return false;
    }
}

// ===== DATOS INTERNOS DE RESPALDO (SEPTIEMBRE 2025) =====
// Estos precios se usan solo si no se puede cargar el archivo externo
const prestadoresDataRespaldo = {
    omint: {
        name: "OMINT",
        tipoEstructura: "estructura_compleja", // Precios específicos por rol
        planes: {
            plan2500: {
                name: "PLAN 2500",
                type: "omint",
                preciosPorEdad: {
                    "0-25": {
                        adultoConyugue: 82599,
                        hijo1Menor: 71940,
                        hijo2MasMenores: 62204
                    },
                    "26-35": {
                        adultoConyugue: 118358,
                        hijo1Menor: 71940,
                        hijo2MasMenores: 62204
                    },
                    "36-54": {
                        adultoConyugue: 139718,
                        hijo1Menor: 71940,
                        hijo2MasMenores: 62204
                    },
                    "55-59": {
                        adultoConyugue: 237996,
                        hijo1Menor: 71940,
                        hijo2MasMenores: 62204
                    },
                    "60+": {
                        adultoConyugue: 367987,
                        hijo1Menor: 71940,
                        hijo2MasMenores: 62204
                    }
                },
                features: [
                    "Plan económico OMINT",
                    "Red de prestadores nivel 2500",
                    "Consultas médicas",
                    "Emergencias 24hs",
                    "Estudios básicos",
                    "Ideal para presupuestos ajustados"
                ],
                recommended: false
            },
            plan4500: {
                name: "PLAN 4500",
                type: "omint",
                preciosPorEdad: {
                    "0-25": {
                        adultoConyugue: 111223,
                        hijo1Menor: 96834,
                        hijo2MasMenores: 83574
                    },
                    "26-35": {
                        adultoConyugue: 161234,
                        hijo1Menor: 96834,
                        hijo2MasMenores: 83574
                    },
                    "36-54": {
                        adultoConyugue: 189278,
                        hijo1Menor: 96834,
                        hijo2MasMenores: 83574
                    },
                    "55-59": {
                        adultoConyugue: 326310,
                        hijo1Menor: 96834,
                        hijo2MasMenores: 83574
                    },
                    "60+": {
                        adultoConyugue: 495226,
                        hijo1Menor: 96834,
                        hijo2MasMenores: 83574
                    }
                },
                features: [
                    "Plan intermedio OMINT",
                    "Red de prestadores nivel 4500",
                    "Consultas médicas",
                    "Emergencias 24hs",
                    "Estudios de mediana complejidad",
                    "Ideal para familias"
                ],
                recommended: false
            },
            // PLAN TEMPORALMENTE OCULTO - SEPTIEMBRE 2025
            // Para reactivar: descomenta el siguiente código
            /*
            plan4500Mega: {
                name: "PLAN 4500 MEGA",
                type: "omint",
                preciosPorEdad: {
                    "0-25": {
                        adultoConyugue: 98234,
                        hijo1Menor: 85526,
                        hijo2MasMenores: 73814
                    },
                    "26-35": {
                        adultoConyugue: 126582,
                        hijo1Menor: 85526,
                        hijo2MasMenores: 73814
                    },
                    "36-54": {
                        adultoConyugue: 167175,
                        hijo1Menor: 85526,
                        hijo2MasMenores: 73814
                    },
                    "55-59": {
                        adultoConyugue: 288203,
                        hijo1Menor: 85526,
                        hijo2MasMenores: 73814
                    },
                    "60+": {
                        adultoConyugue: 495226,
                        hijo1Menor: 85526,
                        hijo2MasMenores: 73814
                    }
                },
                features: [
                    "Plan OMINT 4500 MEGA",
                    "Red de prestadores nivel 4500 MEGA",
                    "Consultas médicas sin límite",
                    "Emergencias 24hs prioritarias",
                    "Estudios de alta complejidad",
                    "Cobertura odontológica completa",
                    "Medicina preventiva premium",
                    "Plan empresarial especial"
                ],
                recommended: false
            },
            */
            plan6500: {
                name: "PLAN 6500",
                type: "omint",
                preciosPorEdad: {
                    "0-25": {
                        adultoConyugue: 141217,
                        hijo1Menor: 123450,
                        hijo2MasMenores: 107197
                    },
                    "26-35": {
                        adultoConyugue: 202079,
                        hijo1Menor: 123450,
                        hijo2MasMenores: 107197
                    },
                    "36-54": {
                        adultoConyugue: 236654,
                        hijo1Menor: 123450,
                        hijo2MasMenores: 107197
                    },
                    "55-59": {
                        adultoConyugue: 396666,
                        hijo1Menor: 123450,
                        hijo2MasMenores: 107197
                    },
                    "60+": {
                        adultoConyugue: 590718,
                        hijo1Menor: 123450,
                        hijo2MasMenores: 107197
                    }
                },
                features: [
                    "Cobertura integral OMINT",
                    "Red de prestadores nivel 6500",
                    "Internación en habitación privada",
                    "Consultas médicas sin límite",
                    "Estudios de alta complejidad",
                    "Emergencias 24hs",
                    "Cobertura odontológica completa",
                    "Medicina preventiva"
                ],
                recommended: true
            },
            plan8500: {
                name: "PLAN 8500",
                type: "omint",
                preciosPorEdad: {
                    "0-25": {
                        adultoConyugue: 242831,
                        hijo1Menor: 212918,
                        hijo2MasMenores: 185716
                    },
                    "26-35": {
                        adultoConyugue: 323686,
                        hijo1Menor: 212918,
                        hijo2MasMenores: 185716
                    },
                    "36-54": {
                        adultoConyugue: 426082,
                        hijo1Menor: 212918,
                        hijo2MasMenores: 185716
                    },
                    "55-59": {
                        adultoConyugue: 593755,
                        hijo1Menor: 212918,
                        hijo2MasMenores: 185716
                    },
                    "60+": {
                        adultoConyugue: 809360,
                        hijo1Menor: 212918,
                        hijo2MasMenores: 185716
                    }
                },
                features: [
                    "Plan premium OMINT",
                    "Red de prestadores nivel 8500",
                    "Internación en habitación privada",
                    "Consultas médicas sin límite",
                    "Estudios de alta complejidad",
                    "Emergencias 24hs",
                    "Cobertura odontológica completa",
                    "Medicina preventiva premium"
                ],
                recommended: false
            },
            planComunidad: {
                name: "PLAN COMUNIDAD SIN COPAGO",
                type: "omint",
                preciosPorEdad: {
                    "0-25": {
                        adultoConyugue: 83810,
                        hijo1Menor: 72869,
                        hijo2MasMenores: 62919
                    },
                    "26-35": {
                        adultoConyugue: 119797,
                        hijo1Menor: 72869,
                        hijo2MasMenores: 62919
                    },
                    "36-54": {
                        adultoConyugue: 141571,
                        hijo1Menor: 72869,
                        hijo2MasMenores: 62919
                    },
                    "55-59": {
                        adultoConyugue: 239851,
                        hijo1Menor: 72869,
                        hijo2MasMenores: 62919
                    },
                    "60+": {
                        adultoConyugue: 372647,
                        hijo1Menor: 72869,
                        hijo2MasMenores: 62919
                    }
                },
                features: [
                    "Plan comunitario OMINT",
                    "Sin copagos en consultas",
                    "Red de prestadores comunitarios",
                    "Cobertura básica integral",
                    "Emergencias 24hs",
                    "Estudios básicos incluidos",
                    "Ideal para familias jóvenes"
                ],
                recommended: false
            }
        }
    },
    
    swissMedical: {
        name: "SWISS MEDICAL",
        tipoEstructura: "plantilla_adultos_solo", // Sin descuentos: todos como adultos
        planes: {
            po62: {
                name: "PLAN PO62",
                type: "swiss_medical",
                preciosPorEdad: {
                    "≤65": 247403,  // Capita menor o igual a 65 años - SEPTIEMBRE 2025 (+1.9%)
                    ">65": 718896   // Capita mayor a 65 años - SEPTIEMBRE 2025 (+1.9%)
                },
                features: [
                    "Cobertura integral SWISS MEDICAL",
                    "Red de prestadores PO62",
                    "Consultas médicas sin límite",
                    "Internación en habitación privada",
                    "Emergencias 24hs",
                    "Estudios de diagnóstico",
                    "Cobertura odontológica"
                ],
                recommended: false
            },
            po64: {
                name: "PLAN PO64",
                type: "swiss_medical",
                preciosPorEdad: {
                    "≤65": 296665,  // SEPTIEMBRE 2025 (+1.9%)
                    ">65": 860833   // SEPTIEMBRE 2025 (+1.9%)
                },
                features: [
                    "Cobertura premium SWISS MEDICAL",
                    "Red de prestadores PO64",
                    "Consultas médicas sin límite",
                    "Internación en habitación privada",
                    "Emergencias 24hs prioritarias",
                    "Estudios de alta complejidad",
                    "Cobertura odontológica completa",
                    "Medicina preventiva"
                ],
                recommended: true
            },
            sb04: {
                name: "PLAN SB04",
                type: "swiss_medical",
                preciosPorEdad: {
                    "≤65": 195110,  // SEPTIEMBRE 2025 (+1.9%)
                    ">65": 533550   // SEPTIEMBRE 2025 (+1.9%)
                },
                features: [
                    "Cobertura básica SWISS MEDICAL",
                    "Red de prestadores SB04",
                    "Consultas médicas",
                    "Emergencias 24hs",
                    "Estudios básicos",
                    "Ideal para familias jóvenes"
                ],
                recommended: false
            }
        }
    },
    
    swNubial: {
        name: "SW NUBIAL",
        tipoEstructura: "plantilla_adultos_simple", // Solo 2 grupos etarios, todos como adultos
        planes: {
            ms: {
                name: "PLAN MS",
                type: "sw_nubial",
                preciosPorEdad: {
                    "≤65": 163772,   // Menor de 66 años - SEPTIEMBRE 2025 (+1.9%)
                    ">65": 465259    // Mayor de 65 años - SEPTIEMBRE 2025 (+1.9%)
                },
                features: [
                    "Plan SW NUBIAL exclusivo",
                    "Solo Capital Federal y GBA",
                    "Cobertura básica integral",
                    "Emergencias 24hs",
                    "Consultas médicas",
                    "Red específica SW NUBIAL",
                    "Plan económico para CABA/GBA"
                ],
                recommended: false
            }
        }
    },
    
    swiss: {
        name: "SWISS",
        tipoEstructura: "plantilla_adultos_simple", // Solo 2 grupos etarios, todos como adultos
        planes: {
            sb02: {
                name: "PLAN SB02",
                type: "swiss",
                preciosPorEdad: {
                    "≤65": 190363,   // Por Cápita - SEPTIEMBRE 2025 (+1.9%)
                    ">65": 645910    // Mayor de 65 años - SEPTIEMBRE 2025 (+1.9%)
                },
                features: [
                    "Plan SWISS básico",
                    "Cobertura nacional",
                    "Emergencias 24hs",
                    "Consultas médicas",
                    "Estudios diagnósticos",
                    "Red SWISS",
                    "Plan económico"
                ],
                recommended: false
            }
        }
    },
    
    activaSalud: {
        name: "ACTIVA SALUD",
        tipoEstructura: "estructura_compleja", // Precio único por plan
        planes: {
            plan2500: {
                name: "PLAN 2500",
                type: "omint",
                preciosPorEdad: {
                    "0-25": {
                        adultoConyugue: 81059,
                        hijo1Menor: 70599,
                        hijo2MasMenores: 61044
                    },
                    "26-35": {
                        adultoConyugue: 116151,
                        hijo1Menor: 70599,
                        hijo2MasMenores: 61044
                    },
                    "36-54": {
                        adultoConyugue: 137113,
                        hijo1Menor: 70599,
                        hijo2MasMenores: 61044
                    },
                    "55-59": {
                        adultoConyugue: 233558,
                        hijo1Menor: 70599,
                        hijo2MasMenores: 61044
                    },
                    "60+": {
                        adultoConyugue: 361126,
                        hijo1Menor: 70599,
                        hijo2MasMenores: 61044
                    }
                },
                features: [
                    "Plan económico OMINT",
                    "Red de prestadores nivel 2500",
                    "Consultas médicas",
                    "Emergencias 24hs",
                    "Estudios básicos",
                    "Ideal para presupuestos ajustados"
                ],
                recommended: false
            },
            plan4500: {
                name: "PLAN 4500",
                type: "omint",
                preciosPorEdad: {
                    "0-25": {
                        adultoConyugue: 111223,
                        hijo1Menor: 96834,
                        hijo2MasMenores: 83574
                    },
                    "26-35": {
                        adultoConyugue: 161234,
                        hijo1Menor: 96834,
                        hijo2MasMenores: 83574
                    },
                    "36-54": {
                        adultoConyugue: 189278,
                        hijo1Menor: 96834,
                        hijo2MasMenores: 83574
                    },
                    "55-59": {
                        adultoConyugue: 326310,
                        hijo1Menor: 96834,
                        hijo2MasMenores: 83574
                    },
                    "60+": {
                        adultoConyugue: 495226,
                        hijo1Menor: 96834,
                        hijo2MasMenores: 83574
                    }
                },
                features: [
                    "Plan intermedio OMINT",
                    "Red de prestadores nivel 4500",
                    "Consultas médicas",
                    "Emergencias 24hs",
                    "Estudios de mediana complejidad",
                    "Ideal para familias"
                ],
                recommended: false
            },
            plan6500: {
                name: "PLAN 6500",
                type: "omint",
                preciosPorEdad: {
                    "0-25": {
                        adultoConyugue: 141217,
                        hijo1Menor: 123450,
                        hijo2MasMenores: 107197
                    },
                    "26-35": {
                        adultoConyugue: 202079,
                        hijo1Menor: 123450,
                        hijo2MasMenores: 107197
                    },
                    "36-54": {
                        adultoConyugue: 236654,
                        hijo1Menor: 123450,
                        hijo2MasMenores: 107197
                    },
                    "55-59": {
                        adultoConyugue: 396666,
                        hijo1Menor: 123450,
                        hijo2MasMenores: 107197
                    },
                    "60+": {
                        adultoConyugue: 590718,
                        hijo1Menor: 123450,
                        hijo2MasMenores: 107197
                    }
                },
                features: [
                    "Cobertura integral OMINT",
                    "Red de prestadores nivel 6500",
                    "Internación en habitación privada",
                    "Consultas médicas sin límite",
                    "Estudios de alta complejidad",
                    "Emergencias 24hs",
                    "Cobertura odontológica completa",
                    "Medicina preventiva"
                ],
                recommended: true
            },
            plan8500: {
                name: "PLAN 8500",
                type: "omint",
                preciosPorEdad: {
                    "0-25": {
                        adultoConyugue: 242831,
                        hijo1Menor: 212918,
                        hijo2MasMenores: 185716
                    },
                    "26-35": {
                        adultoConyugue: 323686,
                        hijo1Menor: 212918,
                        hijo2MasMenores: 185716
                    },
                    "36-54": {
                        adultoConyugue: 426082,
                        hijo1Menor: 212918,
                        hijo2MasMenores: 185716
                    },
                    "55-59": {
                        adultoConyugue: 593755,
                        hijo1Menor: 212918,
                        hijo2MasMenores: 185716
                    },
                    "60+": {
                        adultoConyugue: 809360,
                        hijo1Menor: 212918,
                        hijo2MasMenores: 185716
                    }
                },
                features: [
                    "Plan premium OMINT",
                    "Red de prestadores nivel 8500",
                    "Internación en habitación privada",
                    "Consultas médicas sin límite",
                    "Estudios de alta complejidad",
                    "Emergencias 24hs",
                    "Cobertura odontológica completa",
                    "Medicina preventiva premium"
                ],
                recommended: false
            },
            planComunidad: {
                name: "PLAN COMUNIDAD SIN COPAGO",
                type: "omint",
                preciosPorEdad: {
                    "0-25": {
                        adultoConyugue: 83810,
                        hijo1Menor: 72869,
                        hijo2MasMenores: 62919
                    },
                    "26-35": {
                        adultoConyugue: 119797,
                        hijo1Menor: 72869,
                        hijo2MasMenores: 62919
                    },
                    "36-54": {
                        adultoConyugue: 141571,
                        hijo1Menor: 72869,
                        hijo2MasMenores: 62919
                    },
                    "55-59": {
                        adultoConyugue: 239851,
                        hijo1Menor: 72869,
                        hijo2MasMenores: 62919
                    },
                    "60+": {
                        adultoConyugue: 372647,
                        hijo1Menor: 72869,
                        hijo2MasMenores: 62919
                    }
                },
                features: [
                    "Plan comunitario OMINT",
                    "Sin copagos en consultas",
                    "Red de prestadores comunitarios",
                    "Cobertura básica integral",
                    "Emergencias 24hs",
                    "Estudios básicos incluidos",
                    "Ideal para familias jóvenes"
                ],
                recommended: false
            }
        }
    },
    
    swissMedical: {
        name: "SWISS MEDICAL",
        tipoEstructura: "plantilla_adultos_solo", // Sin descuentos: todos como adultos
        planes: {
            po62: {
                name: "PLAN PO62",
                type: "swiss_medical",
                preciosPorEdad: {
                    "≤65": 247403,  // Capita menor o igual a 65 años - SEPTIEMBRE 2025 (+1.9%)
                    ">65": 718896   // Capita mayor a 65 años - SEPTIEMBRE 2025 (+1.9%)
                },
                features: [
                    "Cobertura integral SWISS MEDICAL",
                    "Red de prestadores PO62",
                    "Consultas médicas sin límite",
                    "Internación en habitación privada",
                    "Emergencias 24hs",
                    "Estudios de diagnóstico",
                    "Cobertura odontológica"
                ],
                recommended: false
            },
            po64: {
                name: "PLAN PO64",
                type: "swiss_medical",
                preciosPorEdad: {
                    "≤65": 296665,  // SEPTIEMBRE 2025 (+1.9%)
                    ">65": 860833   // SEPTIEMBRE 2025 (+1.9%)
                },
                features: [
                    "Cobertura premium SWISS MEDICAL",
                    "Red de prestadores PO64",
                    "Consultas médicas sin límite",
                    "Internación en habitación privada",
                    "Emergencias 24hs prioritarias",
                    "Estudios de alta complejidad",
                    "Cobertura odontológica completa",
                    "Medicina preventiva"
                ],
                recommended: true
            },
            sb04: {
                name: "PLAN SB04",
                type: "swiss_medical",
                preciosPorEdad: {
                    "≤65": 195110,  // SEPTIEMBRE 2025 (+1.9%)
                    ">65": 533550   // SEPTIEMBRE 2025 (+1.9%)
                },
                features: [
                    "Cobertura básica SWISS MEDICAL",
                    "Red de prestadores SB04",
                    "Consultas médicas",
                    "Emergencias 24hs",
                    "Estudios básicos",
                    "Ideal para familias jóvenes"
                ],
                recommended: false
            }
        }
    },
    
    swNubial: {
        name: "SW NUBIAL",
        tipoEstructura: "plantilla_adultos_simple", // Solo 2 grupos etarios, todos como adultos
        planes: {
            ms: {
                name: "PLAN MS",
                type: "sw_nubial",
                preciosPorEdad: {
                    "≤65": 163772,   // Menor de 66 años - SEPTIEMBRE 2025 (+1.9%)
                    ">65": 465259    // Mayor de 65 años - SEPTIEMBRE 2025 (+1.9%)
                },
                features: [
                    "Plan SW NUBIAL exclusivo",
                    "Solo Capital Federal y GBA",
                    "Cobertura básica integral",
                    "Emergencias 24hs",
                    "Consultas médicas",
                    "Red específica SW NUBIAL",
                    "Plan económico para CABA/GBA"
                ],
                recommended: false
            }
        }
    },
    
    swiss: {
        name: "SWISS",
        tipoEstructura: "plantilla_adultos_simple", // Solo 2 grupos etarios, todos como adultos
        planes: {
            sb02: {
                name: "PLAN SB02",
                type: "swiss",
                preciosPorEdad: {
                    "≤65": 190363,   // Por Cápita - SEPTIEMBRE 2025 (+1.9%)
                    ">65": 645910    // Mayor de 65 años - SEPTIEMBRE 2025 (+1.9%)
                },
                features: [
                    "Plan SWISS básico",
                    "Cobertura nacional",
                    "Emergencias 24hs",
                    "Consultas médicas",
                    "Estudios diagnósticos",
                    "Red SWISS",
                    "Plan económico"
                ],
                recommended: false
            }
        }
    },
    
    activaSalud: {
        name: "ACTIVA SALUD",
        tipoEstructura: "estructura_compleja", // Precio único por plan
        planes: {
            as25: {
                name: "PLAN AS 25",
                type: "activa_salud",
                preciosPorEdad: { "≤100": 67493 },  // SEPTIEMBRE 2025 (+1.9%)
                features: [
                    "Plan básico ACTIVA SALUD",
                    "Consultas médicas básicas",
                    "Emergencias 24hs",
                    "Estudios de laboratorio",
                    "Red de prestadores ACTIVA",
                    "Ideal para jóvenes"
                ],
                recommended: false
            },
            as300: {
                name: "PLAN AS 300",
                type: "activa_salud",
                preciosPorEdad: { 
                    "≤65": 79357,   // OCTUBRE 2025 - Hasta 65 años
                    ">65": 119223   // OCTUBRE 2025 - Desde 66 años en adelante
                },
                features: [
                    "Plan AS 300 ACTIVA SALUD",
                    "Cobertura integral",
                    "Emergencias 24hs",
                    "Consultas ilimitadas",
                    "Estudios diagnósticos",
                    "Internación completa"
                ],
                recommended: false
            },
            as700: {
                name: "PLAN AS 700",
                type: "activa_salud",
                preciosPorEdad: { "≤100": 88261 },  // SEPTIEMBRE 2025 (+1.9%)
                features: [
                    "Plan AS 700 ACTIVA SALUD",
                    "Cobertura superior",
                    "Todas las especialidades",
                    "Cirugías complejas",
                    "Medicina de alta complejidad",
                    "Red premium"
                ],
                recommended: false
            },
            as800: {
                name: "PLAN AS 800",
                type: "activa_salud",
                preciosPorEdad: { "≤100": 109028 },  // SEPTIEMBRE 2025 (+1.9%)
                features: [
                    "Plan AS 800 ACTIVA SALUD",
                    "Máxima cobertura",
                    "Sin límites",
                    "Medicina especializada",
                    "Tratamientos avanzados",
                    "VIP access"
                ],
                recommended: false
            },
            as900: {
                name: "PLAN AS 900",
                type: "activa_salud",
                preciosPorEdad: { "≤100": 115692 },  // SEPTIEMBRE 2025 (+1.9%)
                features: [
                    "Plan AS 900 ACTIVA SALUD",
                    "Cobertura total",
                    "Medicina de vanguardia",
                    "Acceso preferencial",
                    "Todas las prestaciones",
                    "Máximo nivel"
                ],
                recommended: false
            }
        }
    },
    
    medife: {
        name: "MEDIFE",
        tipoEstructura: "estructura_matrimonio_hijos", // Estructura específica con categorías MAT/IND y hijos diferenciados
        planes: {
            bronce: {
                name: "PLAN BRONCE",
                type: "medife",
                precios: {
                    individual: {
                        "0-29": 101195,  // 97678 * 1.036 - SEPTIEMBRE 2025 (+3.6%)
                        "30-39": 127200,  // 122780 * 1.036
                        "40-49": 165412,  // 159664 * 1.036
                        "50-59": 239944,  // 231606 * 1.036
                        "60+": 261383     // 252301 * 1.036
                    },
                    conyuge: {
                        "0-29": 87771,   // 84721 * 1.036 - SEPTIEMBRE 2025 (+3.6%)
                        "30-39": 102308,  // 98753 * 1.036
                        "40-49": 121212,  // 117000 * 1.036
                        "50-59": 128240,  // 123784 * 1.036
                        "60+": 127625     // 123190 * 1.036
                    },
                    matrimonio: {
                        "0-29": 188966,  // 101195 + 87771 - SEPTIEMBRE 2025 (+3.6%)
                        "30-39": 229508,  // 127200 + 102308
                        "40-49": 286624,  // 165412 + 121212
                        "50-59": 368184,  // 239944 + 128240
                        "60+": 389008    // 261383 + 127625
                    },
                    hijos: {
                        "primerHijo": 82440,     // 79576 * 1.036 - 1er H (< a 21) - SEPTIEMBRE 2025 (+3.6%)
                        "segundoHijo": 68110,    // 65743 * 1.036 - 2do H (< a 21)
                        "hijoAdulto": 101497,    // 97970 * 1.036 - H AD (21 a 29)
                        "familiarCargo": 261383  // 252301 * 1.036 - FAMILIAR A CARGO
                    }
                },
                features: [
                    "Plan básico MEDIFE",
                    "Cobertura integral",
                    "Red de prestadores MEDIFE",
                    "Emergencias 24hs",
                    "Consultas médicas",
                    "Estudios básicos",
                    "Plan económico"
                ],
                recommended: false
            },
            plata: {
                name: "PLAN PLATA",
                type: "medife",
                precios: {
                    individual: {
                        "0-29": 121979,  // 117740 * 1.036 - SEPTIEMBRE 2025 (+3.6%)
                        "30-39": 154415,  // 149049 * 1.036
                        "40-49": 194781,  // 188013 * 1.036
                        "50-59": 305110,  // 294508 * 1.036
                        "60+": 331738     // 320211 * 1.036
                    },
                    conyuge: {
                        "0-29": 106543,  // 102841 * 1.036 - SEPTIEMBRE 2025 (+3.6%)
                        "30-39": 127560,  // 123127 * 1.036
                        "40-49": 172461,  // 166469 * 1.036
                        "50-59": 177026,  // 170874 * 1.036
                        "60+": 193715    // 186983 * 1.036
                    },
                    matrimonio: {
                        "0-29": 228522,  // 121979 + 106543 - SEPTIEMBRE 2025 (+3.6%)
                        "30-39": 281975,  // 154415 + 127560
                        "40-49": 367242,  // 194781 + 172461
                        "50-59": 482136,  // 305110 + 177026
                        "60+": 525453    // 331738 + 193715
                    },
                    hijos: {
                        "primerHijo": 103672,   // 100070 * 1.036 - SEPTIEMBRE 2025 (+3.6%)
                        "segundoHijo": 75775,    // 73141 * 1.036 - 2do H (< a 21)
                        "hijoAdulto": 122305,    // 118055 * 1.036
                        "familiarCargo": 331738  // 320211 * 1.036
                    }
                },
                features: [
                    "Plan estándar MEDIFE",
                    "Cobertura ampliada",
                    "Red de prestadores completa",
                    "Emergencias 24hs prioritarias",
                    "Consultas médicas sin límite",
                    "Estudios de mediana complejidad",
                    "Cobertura odontológica básica"
                ],
                recommended: true
            },
            oro: {
                name: "PLAN ORO",
                type: "medife",
                precios: {
                    individual: {
                        "0-29": 138621,  // 133804 * 1.036 - SEPTIEMBRE 2025 (+3.6%)
                        "30-39": 178432,  // 172232 * 1.036
                        "40-49": 225227,  // 217401 * 1.036
                        "50-59": 350078,  // 337913 * 1.036
                        "60+": 381209    // 367962 * 1.036
                    },
                    conyuge: {
                        "0-29": 124071,  // 119760 * 1.036 - SEPTIEMBRE 2025 (+3.6%)
                        "30-39": 153063,  // 147744 * 1.036
                        "40-49": 199457,  // 192526 * 1.036
                        "50-59": 165240,  // 159498 * 1.036
                        "60+": 178279    // 172084 * 1.036
                    },
                    matrimonio: {
                        "0-29": 262692,  // 138621 + 124071 - SEPTIEMBRE 2025 (+3.6%)
                        "30-39": 331495,  // 178432 + 153063
                        "40-49": 424684,  // 225227 + 199457
                        "50-59": 515318,  // 350078 + 165240
                        "60+": 559488    // 381209 + 178279
                    },
                    hijos: {
                        "primerHijo": 119797,   // 115634 * 1.036 - SEPTIEMBRE 2025 (+3.6%)
                        "segundoHijo": 96862,    // 93496 * 1.036
                        "hijoAdulto": 138621,    // 133804 * 1.036
                        "familiarCargo": 381209  // 367962 * 1.036
                    }
                },
                features: [
                    "Plan premium MEDIFE",
                    "Cobertura máxima",
                    "Red de prestadores premium",
                    "Emergencias 24hs VIP",
                    "Consultas médicas ilimitadas",
                    "Estudios de alta complejidad",
                    "Cobertura odontológica completa",
                    "Medicina preventiva premium",
                    "Cobertura internacional"
                ],
                recommended: false
            }
        }
    }
};

// ===== SISTEMA UNIFICADO DE CÁLCULO DE PRECIOS =====

/**
 * Determina el grupo etario según la edad para los precios de OMINT
 * @param {number} edad - Edad de la persona
 * @returns {string} - Grupo etario correspondiente
 */
function determinarGrupoEtario(edad) {
    if (edad <= 25) return "0-25";
    if (edad <= 35) return "26-35";
    if (edad <= 54) return "36-54";
    if (edad <= 59) return "55-59";
    return "60+";
}

/**
 * Determina el grupo etario para SWISS MEDICAL (estructura simple)
 * @param {number} edad - Edad de la persona
 * @returns {string} - Grupo etario correspondiente
 */
function determinarGrupoEtarioSwiss(edad) {
    return edad <= 65 ? "≤65" : ">65";
}

/**
 * Determina el grupo etario para ACTIVA SALUD 
 * @param {number} edad - Edad de la persona
 * @param {object} plan - Plan específico para determinar estructura de grupos
 * @returns {string} - Grupo etario correspondiente
 */
function determinarGrupoEtarioActiva(edad, plan = null) {
    // Lógica para grupos etarios diferenciados
    if (plan && plan.name === "PLAN AS 300") {
        return edad < 66 ? "≤65" : ">65";
    }
    
    // Para el resto de planes de ActivaSalud, usar grupo etario universal
    return '≤100';
}

/**
 * Determina el grupo etario para SW NUBIAL (igual que SWISS MEDICAL)
 * @param {number} edad - Edad de la persona
 * @returns {string} - Grupo etario correspondiente
 */
function determinarGrupoEtarioSwNubial(edad) {
    return edad <= 65 ? "≤65" : ">65";
}

/**
 * Determina el grupo etario para SWISS básico (igual que SWISS MEDICAL)
 * @param {number} edad - Edad de la persona
 * @returns {string} - Grupo etario correspondiente
 */
function determinarGrupoEtarioSwissBasico(edad) {
    return edad <= 65 ? "≤65" : ">65";
}

/**
 * Determina el grupo etario para MEDIFE (rangos específicos)
 * @param {number} edad - Edad de la persona
 * @returns {string} - Grupo etario correspondiente
 */
function determinarGrupoEtarioMedife(edad) {
    if (edad <= 29) return "0-29";
    if (edad <= 39) return "30-39";
    if (edad <= 49) return "40-49";
    if (edad <= 59) return "50-59";
    return "60+";
}

/**
 * Determina el grupo etario para OSPADEP SALUD (rangos específicos)
 * @param {number} edad - Edad de la persona
 * @returns {string} - Grupo etario correspondiente
 */
function determinarGrupoEtarioOspadep(edad) {
    if (edad <= 27) return "18-27";
    if (edad <= 35) return "28-35";
    if (edad <= 40) return "36-40";
    if (edad <= 45) return "41-45";
    if (edad <= 50) return "46-50";
    if (edad <= 55) return "51-55";
    if (edad <= 64) return "56-64";
    return "65+";
}

// ===== PLANTILLA DE PRECIOS SIN DESCUENTOS =====
const plantillaSinDescuentos = {
    capitaTitular: 1.00,    // 100% - Precio base
    segundaCapita: 1.00,    // 100% - Pareja/cónyuge SIN descuento (OMINT y SWISS MEDICAL)
    menor: 0.50             // 50% - Solo OMINT tiene descuento para menores (SWISS MEDICAL: 100%)
};

// ===== PLANTILLA TRADICIONAL (para futuros prestadores) =====
const plantillaPorcentual = {
    capitaTitular: 1.00,    // 100% - Precio base
    segundaCapita: 0.75,    // 75% - Pareja/cónyuge CON descuento
    menor: 0.50             // 50% - Hijos menores de 21 años
};

/**
 * Calcula el precio final de un plan OMINT según la composición familiar
 * @param {object} planOMINT - Plan OMINT con precios por edad
 * @param {object} composicionFamiliar - Objeto con la composición familiar
 * @param {number} edadTitular - Edad del titular
 * @param {number} edadPareja - Edad de la pareja (opcional)
 * @returns {number} - Precio total calculado
 */
function calcularPrecioFinalOMINT(planOMINT, composicionFamiliar, edadTitular, edadPareja = null) {
    if (!planOMINT || !planOMINT.preciosPorEdad) {
        console.warn('Plan OMINT sin preciosPorEdad:', planOMINT);
        return 0;
    }
    let precioTotal = 0;
    
    // Determinar grupo etario del titular
    const grupoEtarioTitular = determinarGrupoEtario(edadTitular);
    const preciosGrupoTitular = planOMINT.preciosPorEdad[grupoEtarioTitular];
    
    // 1. Capita titular (siempre presente)
    precioTotal += preciosGrupoTitular.adultoConyugue;
    
    // 2. Segunda capita (pareja/cónyuge)
    if (composicionFamiliar.tienePareja && edadPareja) {
        const grupoEtarioPareja = determinarGrupoEtario(edadPareja);
        const preciosGrupoPareja = planOMINT.preciosPorEdad[grupoEtarioPareja];
        precioTotal += preciosGrupoPareja.adultoConyugue;
    }
    
    // 3. Hijos menores de 25 años (según estructura OMINT)
    // Combinar menores (<21) y mayores (21-24) para OMINT
    const todosLosHijos = [
        ...(composicionFamiliar.menores || []),
        ...(composicionFamiliar.mayores || []).filter(edad => edad < 25)
    ];
    
    if (todosLosHijos.length > 0) {
        const menoresDe25 = todosLosHijos.filter(edad => edad < 25);
        
        if (menoresDe25.length > 0) {
            // Primer hijo menor
            precioTotal += preciosGrupoTitular.hijo1Menor;
            
            // Segundo hijo en adelante
            if (menoresDe25.length > 1) {
                const hijosAdicionales = menoresDe25.length - 1;
                precioTotal += preciosGrupoTitular.hijo2MasMenores * hijosAdicionales;
            }
        }
    }
    
    // 4. Hijos mayores de 25 años (se cobran como adultos/cónyuges)
    if (composicionFamiliar.mayores && composicionFamiliar.mayores.length > 0) {
        composicionFamiliar.mayores.forEach(edadHijo => {
            if (edadHijo >= 25) {
                const grupoEtarioHijo = determinarGrupoEtario(edadHijo);
                const preciosGrupoHijo = planOMINT.preciosPorEdad[grupoEtarioHijo];
                precioTotal += preciosGrupoHijo.adultoConyugue;
            }
        });
    }
    
    return Math.round(precioTotal);
}

/**
 * Calcula el precio final para SWISS MEDICAL - TODOS como adultos (sin descuentos específicos para menores)
 * @param {object} planSwiss - Plan SWISS MEDICAL con precios por edad
 * @param {object} composicionFamiliar - Objeto con la composición familiar
 * @param {number} edadTitular - Edad del titular
 * @param {number} edadPareja - Edad de la pareja (opcional)
 * @returns {number} - Precio total calculado
 */
function calcularPrecioFinalSwiss(planSwiss, composicionFamiliar, edadTitular, edadPareja = null) {
    if (!planSwiss.preciosPorEdad) {
        console.warn('Plan sin preciosPorEdad:', planSwiss);
        return 0;
    }
    let precioTotal = 0;
    
    // Determinar grupo etario del titular
    const grupoEtarioTitular = determinarGrupoEtarioSwiss(edadTitular);
    const precioBaseTitular = planSwiss.preciosPorEdad[grupoEtarioTitular];
    
    // 1. Capita titular (siempre presente)
    precioTotal += precioBaseTitular * plantillaSinDescuentos.capitaTitular;
    
    // 2. Segunda capita (pareja/cónyuge) - SIN descuento, precio completo
    if (composicionFamiliar.tienePareja && edadPareja) {
        const grupoEtarioPareja = determinarGrupoEtarioSwiss(edadPareja);
        const precioBasePareja = planSwiss.preciosPorEdad[grupoEtarioPareja];
        precioTotal += precioBasePareja * plantillaSinDescuentos.segundaCapita; // 100% - SIN descuento
    }
    
    // 3. TODOS LOS HIJOS (menores y mayores) se cobran como ADULTOS - precio completo
    // SWISS MEDICAL no tiene precios específicos para menores, solo ≤65 y >65
    if (composicionFamiliar.menores && composicionFamiliar.menores.length > 0) {
        composicionFamiliar.menores.forEach(edadMenor => {
            const grupoEtarioMenor = determinarGrupoEtarioSwiss(edadMenor);
            const precioBaseMenor = planSwiss.preciosPorEdad[grupoEtarioMenor];
            precioTotal += precioBaseMenor * plantillaSinDescuentos.segundaCapita; // 100% como adulto - NO 50%
        });
    }
    
    // 4. Hijos mayores de 21 años (se cobran como adultos - precio completo)
    if (composicionFamiliar.mayores && composicionFamiliar.mayores.length > 0) {
        composicionFamiliar.mayores.forEach(edadHijo => {
            if (edadHijo >= 21) {
                const grupoEtarioHijo = determinarGrupoEtarioSwiss(edadHijo);
                const precioBaseHijo = planSwiss.preciosPorEdad[grupoEtarioHijo];
                precioTotal += precioBaseHijo * plantillaSinDescuentos.segundaCapita; // 100% - SIN descuento
            }
        });
    }
    
    return Math.round(precioTotal);
}

/**
 * Calcula el precio final para ACTIVA SALUD - TODOS como adultos (similar a SWISS MEDICAL)
 * @param {object} planActiva - Plan ACTIVA SALUD con precios por edad
 * @param {object} composicionFamiliar - Objeto con la composición familiar
 * @param {number} edadTitular - Edad del titular
 * @param {number} edadPareja - Edad de la pareja (opcional)
 * @returns {number} - Precio total calculado
 */
function calcularPrecioFinalActiva(planActiva, composicionFamiliar, edadTitular, edadPareja = null) {
    if (!planActiva || !planActiva.preciosPorEdad) {
        console.warn('Plan Activa sin preciosPorEdad:', planActiva);
        return 0;
    }
    let precioTotal = 0;
    
    // Determinar grupo etario del titular
    const grupoEtarioTitular = determinarGrupoEtarioActiva(edadTitular, planActiva);
    const precioBaseTitular = planActiva.preciosPorEdad[grupoEtarioTitular];
    
    // 1. Capita titular (siempre presente)
    precioTotal += precioBaseTitular * plantillaSinDescuentos.capitaTitular;
    
    // 2. Segunda capita (pareja/cónyuge) - SIN descuento, precio completo
    if (composicionFamiliar.tienePareja && edadPareja) {
        const grupoEtarioPareja = determinarGrupoEtarioActiva(edadPareja, planActiva);
        const precioBasePareja = planActiva.preciosPorEdad[grupoEtarioPareja];
        precioTotal += precioBasePareja * plantillaSinDescuentos.segundaCapita; // 100% - SIN descuento
    }
    
    // 3. TODOS LOS HIJOS (menores y mayores) se cobran como ADULTOS - precio completo
    // ACTIVA SALUD: Todos los planes usan precio único (≤100) por el momento
    if (composicionFamiliar.menores && composicionFamiliar.menores.length > 0) {
        composicionFamiliar.menores.forEach(edadMenor => {
            const grupoEtarioMenor = determinarGrupoEtarioActiva(edadMenor, planActiva);
            const precioBaseMenor = planActiva.preciosPorEdad[grupoEtarioMenor];
            precioTotal += precioBaseMenor * plantillaSinDescuentos.segundaCapita; // 100% como adulto - NO 50%
        });
    }
    
    // 4. Hijos mayores de 21 años (se cobran como adultos - precio completo)
    if (composicionFamiliar.mayores && composicionFamiliar.mayores.length > 0) {
        composicionFamiliar.mayores.forEach((edadHijo, index) => {
            if (edadHijo >= 21) {
                const grupoEtarioHijo = determinarGrupoEtarioActiva(edadHijo, planActiva);
                const precioBaseHijo = planActiva.preciosPorEdad[grupoEtarioHijo];
                precioTotal += precioBaseHijo * plantillaSinDescuentos.segundaCapita; // 100% - SIN descuento
            }
        });
    }
    
    return Math.round(precioTotal);
}

/**
 * Calcula el precio final para SW NUBIAL - TODOS como adultos (similar a SWISS MEDICAL)
 * @param {object} planSwNubial - Plan SW NUBIAL con precios por edad
 * @param {object} composicionFamiliar - Composición familiar
 * @param {number} edadTitular - Edad del titular
 * @param {number} edadPareja - Edad de la pareja (opcional)
 * @returns {number} - Precio total calculado
 */
function calcularPrecioFinalSwNubial(planSwNubial, composicionFamiliar, edadTitular, edadPareja = null) {
    if (!planSwNubial || !planSwNubial.preciosPorEdad) {
        console.warn('Plan SwNubial sin preciosPorEdad:', planSwNubial);
        return 0;
    }
    let precioTotal = 0;
    
    // Determinar grupo etario del titular
    const grupoEtarioTitular = determinarGrupoEtarioSwNubial(edadTitular);
    const precioBaseTitular = planSwNubial.preciosPorEdad[grupoEtarioTitular];
    
    // 1. Capita titular (siempre presente)
    precioTotal += precioBaseTitular * plantillaSinDescuentos.capitaTitular;
    
    // 2. Segunda capita (pareja/cónyuge) - SIN descuento, precio completo
    if (composicionFamiliar.tienePareja && edadPareja) {
        const grupoEtarioPareja = determinarGrupoEtarioSwNubial(edadPareja);
        const precioBasePareja = planSwNubial.preciosPorEdad[grupoEtarioPareja];
        precioTotal += precioBasePareja * plantillaSinDescuentos.segundaCapita; // 100% - SIN descuento
    }
    
    // 3. TODOS LOS HIJOS (menores y mayores) se cobran como ADULTOS - precio completo
    if (composicionFamiliar.menores && composicionFamiliar.menores.length > 0) {
        composicionFamiliar.menores.forEach((edadMenor, index) => {
            const grupoEtarioMenor = determinarGrupoEtarioSwNubial(edadMenor);
            const precioBaseMenor = planSwNubial.preciosPorEdad[grupoEtarioMenor];
            precioTotal += precioBaseMenor * plantillaSinDescuentos.segundaCapita; // 100% como adulto - NO 50%
        });
    }
    
    // 4. Hijos mayores de 21 años (se cobran como adultos - precio completo)
    if (composicionFamiliar.mayores && composicionFamiliar.mayores.length > 0) {
        composicionFamiliar.mayores.forEach((edadHijo, index) => {
            if (edadHijo >= 21) {
                const grupoEtarioHijo = determinarGrupoEtarioSwNubial(edadHijo);
                const precioBaseHijo = planSwNubial.preciosPorEdad[grupoEtarioHijo];
                precioTotal += precioBaseHijo * plantillaSinDescuentos.segundaCapita; // 100% - SIN descuento
            }
        });
    }
    
    return Math.round(precioTotal);
}

/**
 * Calcula el precio final para SWISS básico - TODOS como adultos (similar a SWISS MEDICAL)
 * @param {object} planSwissBasico - Plan SWISS básico con precios por edad
 * @param {object} composicionFamiliar - Composición familiar
 * @param {number} edadTitular - Edad del titular
 * @param {number} edadPareja - Edad de la pareja (opcional)
 * @returns {object} - Desglose detallado
 */
function calcularPrecioFinalSwissBasico(planSwissBasico, composicionFamiliar, edadTitular, edadPareja = null) {
    if (!planSwissBasico || !planSwissBasico.preciosPorEdad) {
        console.warn('Plan SwissBasico sin preciosPorEdad:', planSwissBasico);
        return 0;
    }
    let precioTotal = 0;
    
    // Determinar grupo etario del titular
    const grupoEtarioTitular = determinarGrupoEtarioSwissBasico(edadTitular);
    const precioBaseTitular = planSwissBasico.preciosPorEdad[grupoEtarioTitular];
    
    // 1. Capita titular (siempre presente)
    precioTotal += precioBaseTitular * plantillaSinDescuentos.capitaTitular;
    
    // 2. Segunda capita (pareja/cónyuge) - SIN descuento, precio completo
    if (composicionFamiliar.tienePareja && edadPareja) {
        const grupoEtarioPareja = determinarGrupoEtarioSwissBasico(edadPareja);
        const precioBasePareja = planSwissBasico.preciosPorEdad[grupoEtarioPareja];
        precioTotal += precioBasePareja * plantillaSinDescuentos.segundaCapita; // 100% - SIN descuento
    }
    
    // 3. TODOS LOS HIJOS (menores y mayores) se cobran como ADULTOS - precio completo
    if (composicionFamiliar.menores && composicionFamiliar.menores.length > 0) {
        composicionFamiliar.menores.forEach((edadMenor, index) => {
            const grupoEtarioMenor = determinarGrupoEtarioSwissBasico(edadMenor);
            const precioBaseMenor = planSwissBasico.preciosPorEdad[grupoEtarioMenor];
            precioTotal += precioBaseMenor * plantillaSinDescuentos.segundaCapita; // 100% como adulto - NO 50%
        });
    }
    
    // 4. Hijos mayores de 21 años (se cobran como adultos - precio completo)
    if (composicionFamiliar.mayores && composicionFamiliar.mayores.length > 0) {
        composicionFamiliar.mayores.forEach((edadHijo, index) => {
            if (edadHijo >= 21) {
                const grupoEtarioHijo = determinarGrupoEtarioSwissBasico(edadHijo);
                const precioBaseHijo = planSwissBasico.preciosPorEdad[grupoEtarioHijo];
                precioTotal += precioBaseHijo * plantillaSinDescuentos.segundaCapita; // 100% - SIN descuento
            }
        });
    }
    
    return Math.round(precioTotal);
}

/**
 * Calcula el precio final para MEDIFE - Estructura específica con Individual/Matrimonio e hijos diferenciados
 * @param {object} planMedife - Plan MEDIFE con estructura específica
 * @param {object} composicionFamiliar - Composición familiar
 * @param {number} edadTitular - Edad del titular
 * @param {number} edadPareja - Edad de la pareja (opcional)
 * @returns {number} - Precio total calculado
 */
function calcularPrecioFinalMedife(planMedife, composicionFamiliar, edadTitular, edadPareja = null) {
    if (!planMedife || !planMedife.precios) {
        console.warn('Plan Medife sin precios:', planMedife);
        return 0;
    }
    let precioTotal = 0;
    
    // NUEVA LÓGICA: Si es matrimonio, se toma la edad MAYOR y se usa el precio MATRIMONIO de ese rango
    const esMatrimonio = composicionFamiliar.tienePareja;
    
    if (esMatrimonio && edadPareja) {
        // Determinar la edad más alta entre titular y cónyuge
        const edadMaxima = Math.max(edadTitular, edadPareja);
        const grupoEtarioMatrimonio = determinarGrupoEtarioMedife(edadMaxima);
        
        // Usar precio MATRIMONIO del rango etario de la persona mayor
        const precioMatrimonio = planMedife.precios.matrimonio[grupoEtarioMatrimonio];
        precioTotal += precioMatrimonio;
    } else {
        // Si es individual, usar precio individual del titular
        const grupoEtarioTitular = determinarGrupoEtarioMedife(edadTitular);
        const precioIndividual = planMedife.precios.individual[grupoEtarioTitular];
        precioTotal += precioIndividual;
    }
    
    // Procesar hijos menores de 21 años
    if (composicionFamiliar.menores && composicionFamiliar.menores.length > 0) {
        const menoresDe21 = composicionFamiliar.menores.filter(edad => edad < 21);
        
        menoresDe21.forEach((edadMenor, index) => {
            if (index === 0) {
                // Primer hijo
                precioTotal += planMedife.precios.hijos.primerHijo;
            } else if (index === 1) {
                // Segundo hijo
                precioTotal += planMedife.precios.hijos.segundoHijo;
            } else {
                // Tercer hijo en adelante - usar precio segundo hijo
                precioTotal += planMedife.precios.hijos.segundoHijo;
            }
        });
    }
    
    // Procesar hijos adultos (21-29 años) y familiares a cargo (>29)
    if (composicionFamiliar.mayores && composicionFamiliar.mayores.length > 0) {
        composicionFamiliar.mayores.forEach((edadHijo, index) => {
            if (edadHijo >= 21 && edadHijo <= 29) {
                // Hijo adulto (21-29)
                precioTotal += planMedife.precios.hijos.hijoAdulto;
            } else if (edadHijo > 29) {
                // Familiar a cargo (mayor de 29)
                precioTotal += planMedife.precios.hijos.familiarCargo;
            }
        });
    }
    
    return Math.round(precioTotal);
}

/**
 * Calcula el precio final de un plan OSPADEP SALUD según la composición familiar
 * @param {object} planOspadep - Plan OSPADEP SALUD con precios por edad
 * @param {object} composicionFamiliar - Objeto con la composición familiar
 * @param {number} edadTitular - Edad del titular
 * @param {number} edadPareja - Edad de la pareja (opcional)
 * @returns {number} - Precio total calculado
 */
function calcularPrecioFinalOspadep(planOspadep, composicionFamiliar, edadTitular, edadPareja = null) {
    if (!planOspadep || !planOspadep.preciosPorEdad) {
        console.warn('Plan OSPADEP SALUD sin preciosPorEdad:', planOspadep);
        return 0;
    }
    let precioTotal = 0;
    
    // Determinar grupo etario del titular
    const grupoEtarioTitular = determinarGrupoEtarioOspadep(edadTitular);
    const preciosGrupoTitular = planOspadep.preciosPorEdad[grupoEtarioTitular];
    
    // 1. Capita titular (siempre presente)
    precioTotal += preciosGrupoTitular.adultoConyugue;
    
    // 2. Segunda capita (pareja/cónyuge)
    if (composicionFamiliar.tienePareja && edadPareja) {
        const grupoEtarioPareja = determinarGrupoEtarioOspadep(edadPareja);
        const preciosGrupoPareja = planOspadep.preciosPorEdad[grupoEtarioPareja];
        precioTotal += preciosGrupoPareja.adultoConyugue;
    }
    
    // 3. Hijos menores de 21 años (todos al mismo precio)
    const todosLosMenores = composicionFamiliar.menores || [];
    if (todosLosMenores.length > 0) {
        // Todos los hijos menores tienen el mismo precio
        precioTotal += preciosGrupoTitular.hijoMenor * todosLosMenores.length;
    }
    
    // 4. Hijos mayores de 21 años (se cobran como adultos)
    if (composicionFamiliar.mayores && composicionFamiliar.mayores.length > 0) {
        composicionFamiliar.mayores.forEach(edadHijo => {
            const grupoEtarioHijo = determinarGrupoEtarioOspadep(edadHijo);
            const preciosGrupoHijo = planOspadep.preciosPorEdad[grupoEtarioHijo];
            precioTotal += preciosGrupoHijo.adultoConyugue;
        });
    }
    
    return Math.round(precioTotal);
}

/**
 * FUNCIÓN UNIFICADA - Determina automáticamente qué tipo de cálculo usar
 * @param {string} prestadorKey - Clave del prestador (omint, swissMedical, etc.)
 * @param {object} plan - Plan específico del prestador
 * @param {object} composicionFamiliar - Composición familiar
 * @param {number} edadTitular - Edad del titular
 * @param {number} edadPareja - Edad de la pareja (opcional)
 * @returns {number} - Precio total calculado
 */
function calcularPrecioUnificado(prestadorKey, plan, composicionFamiliar, edadTitular, edadPareja = null) {
    const prestador = prestadoresData[prestadorKey];
    if (!prestador) {
        throw new Error(`Prestador no encontrado: ${prestadorKey}`);
    }
    // Calcular precio base según lógica original
    let precioBase;
    if (prestadorKey === 'activaSalud') {
        precioBase = calcularPrecioFinalActiva(plan, composicionFamiliar, edadTitular, edadPareja);
    } else if (prestadorKey === 'ospadepSalud') {
        precioBase = calcularPrecioFinalOspadep(plan, composicionFamiliar, edadTitular, edadPareja);
    } else {
        switch (prestador.tipoEstructura) {
            case "plantilla_adultos_solo":
                precioBase = calcularPrecioFinalSwiss(plan, composicionFamiliar, edadTitular, edadPareja);
                break;
            case "plantilla_adultos_simple":
                if (prestadorKey === 'swNubial') {
                    precioBase = calcularPrecioFinalSwNubial(plan, composicionFamiliar, edadTitular, edadPareja);
                } else if (prestadorKey === 'swiss') {
                    precioBase = calcularPrecioFinalSwissBasico(plan, composicionFamiliar, edadTitular, edadPareja);
                } else {
                    precioBase = calcularPrecioFinalActiva(plan, composicionFamiliar, edadTitular, edadPareja);
                }
                break;
            case "estructura_matrimonio_hijos":
                precioBase = calcularPrecioFinalMedife(plan, composicionFamiliar, edadTitular, edadPareja);
                break;
            case "plantilla_sin_descuentos":
                precioBase = calcularPrecioFinalSwiss(plan, composicionFamiliar, edadTitular, edadPareja);
                break;
            case "plantilla_porcentual":
                console.warn('Plantilla con descuentos detectada - implementar cuando sea necesario');
                precioBase = calcularPrecioFinalSwiss(plan, composicionFamiliar, edadTitular, edadPareja);
                break;
            case "estructura_compleja":
            default:
                precioBase = calcularPrecioFinalOMINT(plan, composicionFamiliar, edadTitular, edadPareja);
        }
    }
    // === ORDEN CORRECTO: 1) Descuento especial, 2) Descuento Plan Joven (25%), 3) Aportes ===
    
    // PASO 1: Aplicar descuento especial al precio base
    let descuentoEspecial = 0;
    let precioConDescuento = precioBase;
    if (formData['aplicar-descuento'] === 'on' && formData['porcentaje-descuento']) {
        const porcentaje = parseFloat(formData['porcentaje-descuento']);
        if (!isNaN(porcentaje) && porcentaje > 0 && porcentaje < 100) {
            descuentoEspecial = Math.round(precioBase * (porcentaje / 100));
            precioConDescuento = Math.max(0, precioBase - descuentoEspecial);
        }
    }
    
    // PASO 2: Aplicar descuento Plan Joven 25% (solo OSPADEP SALUD, menores de 35 años)
    let descuento35 = 0;
    if (prestadorKey === 'ospadepSalud') {
        console.log('🔍 Verificando descuento Plan Joven:', {
            prestadorKey,
            checkboxValue: formData['aplicar-descuento-35'],
            edadTitular,
            edadPareja
        });
        
        if (formData['aplicar-descuento-35'] === 'on') {
            const edadTit = parseInt(edadTitular) || 0;
            const edadPar = parseInt(edadPareja) || 0;
            
            // Verificar que al menos uno sea menor de 35 años
            if ((edadTit > 0 && edadTit < 35) || (edadPar > 0 && edadPar < 35)) {
                descuento35 = Math.round(precioConDescuento * 0.25);
                precioConDescuento = Math.max(0, precioConDescuento - descuento35);
                console.log('✅ Descuento Plan Joven aplicado:', descuento35);
            }
        }
    }
    
    // PASO 3: Calcular aportes a descontar
    let aporteTitular = 0;
    let aportePareja = 0;
    // Titular
    if (formData['aporte-titular']) {
        aporteTitular = parseFloat(formData['aporte-titular']); // Usar el valor ingresado directamente
    } else if (formData['sueldo-titular']) {
        aporteTitular = parseFloat(formData['sueldo-titular']) * 0.0765;
    }
    // Pareja (si corresponde)
    if (formData['aporte-pareja']) {
        aportePareja = parseFloat(formData['aporte-pareja']); // Usar el valor ingresado directamente
    } else if (formData['sueldo-pareja']) {
        aportePareja = parseFloat(formData['sueldo-pareja']) * 0.0765;
    }
    // Sumar ambos aportes
    let totalAportes = 0;
    if (!isNaN(aporteTitular)) totalAportes += aporteTitular;
    if (!isNaN(aportePareja)) totalAportes += aportePareja;
    
    // PASO 4: Aplicar descuento de aportes al precio ya con descuentos (especial + Plan Joven)
    let precioFinal = Math.max(0, Math.round(precioConDescuento - totalAportes));
    // Guardar info para visualización (precio base, descuento especial, Plan Joven y aportes)
    plan._precioBase = precioBase;
    plan._totalAportes = totalAportes;
    plan._descuentoEspecial = descuentoEspecial;
    plan._descuento35 = descuento35;
    plan._porcentajeDescuento = formData['porcentaje-descuento'] || 0;
    plan._precioFinal = precioFinal;
    return precioFinal;
}

/**
 * Función de compatibilidad para mantener la interfaz anterior
 * @param {number} basePriceCapitaTitular - Precio base (no usado en nuevas estructuras)
 * @param {object} composicionFamiliar - Composición familiar
 * @returns {number} - Precio calculado (retorna 0 como placeholder)
 */
function calcularPrecioFinal(basePriceCapitaTitular, composicionFamiliar) {
    // Esta función se mantiene para compatibilidad pero no se usa con prestadores reales
    console.warn('Función calcularPrecioFinal() obsoleta. Usar calcularPrecioUnificado()');
    return 0;
}

/**
 * Analiza los datos del formulario y determina la composición familiar 
 * Nota: Mantiene todas las edades de hijos para que cada prestador aplique su propia lógica
 * @param {object} formData - Datos del formulario
 * @returns {object} - Composición familiar estructurada
 */
function analizarComposicionFamiliar(formData) {
    const composicion = {
        tienePareja: false,
        menores: [], // Todas las edades de hijos - cada prestador decide qué es "menor"
        mayores: [], // Hijos que algunos prestadores consideran adultos
        resumen: ''
    };
    
    const edadTitular = parseInt(formData['edad-titular']);
    
    // Analizar según la opción seleccionada
    switch (selectedOption) {
        case 'solo':
            composicion.resumen = 'Plan individual';
            break;
            
        case 'pareja':
            composicion.tienePareja = true;
            composicion.resumen = 'Plan para pareja';
            break;
            
        case 'hijos':
            if (formData['edades-hijos']) {
                const edadesHijos = formData['edades-hijos'].split(',').map(edad => parseInt(edad.trim()));
                
                // Separar por criterio más general (21 años como referencia para MEDIFE)
                // Cada prestador luego aplicará su propia lógica:
                // - OMINT: menores de 25 años (se procesará en la función específica)
                // - MEDIFE: menores de 21 años, adultos 21-29 años
                // - SWISS MEDICAL: todos como adultos
                composicion.menores = edadesHijos.filter(edad => edad < 21);
                composicion.mayores = edadesHijos.filter(edad => edad >= 21);
                
                const totalHijos = edadesHijos.length;
                const menoresDe25 = composicion.menores.length;
                const mayoresDe25 = composicion.mayores.length;
                
                if (mayoresDe25 > 0) {
                    composicion.resumen = `Plan con ${menoresDe25} menor(es) y ${mayoresDe25} hijo(s) mayor(es)`;
                } else {
                    composicion.resumen = `Plan con ${menoresDe25} menor(es)`;
                }
            }
            break;
            
        case 'familia':
            composicion.tienePareja = true;
            if (formData['edades-hijos']) {
                const edadesHijos = formData['edades-hijos'].split(',').map(edad => parseInt(edad.trim()));
                composicion.menores = edadesHijos.filter(edad => edad < 21);
                composicion.mayores = edadesHijos.filter(edad => edad >= 21);
                
                const menoresDe25 = composicion.menores.length;
                const mayoresDe25 = composicion.mayores.length;
                
                if (mayoresDe25 > 0) {
                    composicion.resumen = `Plan familiar con pareja, ${menoresDe25} menor(es) y ${mayoresDe25} hijo(s) mayor(es)`;
                } else {
                    composicion.resumen = `Plan familiar con pareja y ${menoresDe25} menor(es)`;
                }
            }
            break;
    }
    
    return composicion;
}

/**
 * Genera un desglose detallado del precio para planes OMINT
 * @param {object} planOMINT - Plan OMINT con precios por edad
 * @param {object} composicionFamiliar - Composición familiar
 * @param {number} edadTitular - Edad del titular
 * @param {number} edadPareja - Edad de la pareja (opcional)
 * @returns {object} - Desglose detallado
 */
function generarDesglosePrecioOMINT(planOMINT, composicionFamiliar, edadTitular, edadPareja = null) {
    const desglose = {
        items: [],
        total: 0
    };
    
    // Determinar grupo etario del titular
    const grupoEtarioTitular = determinarGrupoEtario(edadTitular);
    const preciosGrupoTitular = planOMINT.preciosPorEdad[grupoEtarioTitular];
    
    // 1. Capita titular
    const precioTitular = preciosGrupoTitular.adultoConyugue;
    desglose.items.push({
        concepto: `Titular (${edadTitular} años - ${grupoEtarioTitular})`,
        cantidad: 1,
        precioUnitario: precioTitular,
        subtotal: precioTitular
    });
    desglose.total += precioTitular;
    
    // 2. Segunda capita (pareja/cónyuge)
    if (composicionFamiliar.tienePareja && edadPareja) {
        const grupoEtarioPareja = determinarGrupoEtario(edadPareja);
        const preciosGrupoPareja = planOMINT.preciosPorEdad[grupoEtarioPareja];
        const precioPareja = preciosGrupoPareja.adultoConyugue;
        
        desglose.items.push({
            concepto: `Cónyuge (${edadPareja} años - ${grupoEtarioPareja})`,
            cantidad: 1,
            precioUnitario: precioPareja,
            subtotal: precioPareja
        });
        desglose.total += precioPareja;
    }
    
    // 3. Hijos menores de 25 años
    // Combinar menores (<21) y mayores (21-24) para OMINT
    const todosLosHijos = [
        ...(composicionFamiliar.menores || []),
        ...(composicionFamiliar.mayores || []).filter(edad => edad < 25)
    ];
    
    if (todosLosHijos.length > 0) {
        const menoresDe25 = todosLosHijos.filter(edad => edad < 25);
        
        if (menoresDe25.length > 0) {
            // Primer hijo menor
            const precioHijo1 = preciosGrupoTitular.hijo1Menor;
            desglose.items.push({
                concepto: 'Primer hijo menor de 25 años',
                cantidad: 1,
                precioUnitario: precioHijo1,
                subtotal: precioHijo1
            });
            desglose.total += precioHijo1;
            
            // Segundo hijo en adelante
            if (menoresDe25.length > 1) {
                const hijosAdicionales = menoresDe25.length - 1;
                const precioHijo2Mas = preciosGrupoTitular.hijo2MasMenores;
                const subtotalHijos2Mas = precioHijo2Mas * hijosAdicionales;
                
                desglose.items.push({
                    concepto: 'Hijos adicionales menores de 25 años',
                    cantidad: hijosAdicionales,
                    precioUnitario: precioHijo2Mas,
                    subtotal: subtotalHijos2Mas
                });
                desglose.total += subtotalHijos2Mas;
            }
        }
    }
    
    // 4. Hijos mayores de 25 años (se cobran como adultos)
    if (composicionFamiliar.mayores && composicionFamiliar.mayores.length > 0) {
        composicionFamiliar.mayores.forEach((edadHijo, index) => {
            if (edadHijo >= 25) {
                const grupoEtarioHijo = determinarGrupoEtario(edadHijo);
                const preciosGrupoHijo = planOMINT.preciosPorEdad[grupoEtarioHijo];
                const precioHijoMayor = preciosGrupoHijo.adultoConyugue;
                
                desglose.items.push({
                    concepto: `Hijo mayor (${edadHijo} años - ${grupoEtarioHijo})`,
                    cantidad: 1,
                    precioUnitario: precioHijoMayor,
                    subtotal: precioHijoMayor
                });
                desglose.total += precioHijoMayor;
            }
        });
    }
    

    
    desglose.total = Math.round(desglose.total);
    return desglose;
}

/**
 * Genera un desglose detallado del precio para planes OSPADEP SALUD
 * @param {object} planOspadep - Plan OSPADEP SALUD con precios por edad
 * @param {object} composicionFamiliar - Composición familiar
 * @param {number} edadTitular - Edad del titular
 * @param {number} edadPareja - Edad de la pareja (opcional)
 * @returns {object} - Desglose detallado
 */
function generarDesglosePrecioOspadep(planOspadep, composicionFamiliar, edadTitular, edadPareja = null) {
    const desglose = {
        items: [],
        total: 0
    };
    
    // Determinar grupo etario del titular
    const grupoEtarioTitular = determinarGrupoEtarioOspadep(edadTitular);
    const preciosGrupoTitular = planOspadep.preciosPorEdad[grupoEtarioTitular];
    
    // 1. Capita titular
    const precioTitular = preciosGrupoTitular.adultoConyugue;
    desglose.items.push({
        concepto: `Titular (${edadTitular} años - ${grupoEtarioTitular})`,
        cantidad: 1,
        precioUnitario: precioTitular,
        subtotal: precioTitular
    });
    desglose.total += precioTitular;
    
    // 2. Segunda capita (pareja/cónyuge)
    if (composicionFamiliar.tienePareja && edadPareja) {
        const grupoEtarioPareja = determinarGrupoEtarioOspadep(edadPareja);
        const preciosGrupoPareja = planOspadep.preciosPorEdad[grupoEtarioPareja];
        const precioPareja = preciosGrupoPareja.adultoConyugue;
        
        desglose.items.push({
            concepto: `Cónyuge (${edadPareja} años - ${grupoEtarioPareja})`,
            cantidad: 1,
            precioUnitario: precioPareja,
            subtotal: precioPareja
        });
        desglose.total += precioPareja;
    }
    
    // 3. Hijos menores de 21 años (todos al mismo precio)
    const todosLosMenores = composicionFamiliar.menores || [];
    if (todosLosMenores.length > 0) {
        const precioHijo = preciosGrupoTitular.hijoMenor;
        const totalHijos = todosLosMenores.length;
        
        desglose.items.push({
            concepto: `${totalHijos} hijo${totalHijos > 1 ? 's' : ''} menor${totalHijos > 1 ? 'es' : ''} (< 21 años)`,
            cantidad: totalHijos,
            precioUnitario: precioHijo,
            subtotal: precioHijo * totalHijos
        });
        desglose.total += precioHijo * totalHijos;
    }
    
    // 4. Hijos mayores de 21 años (se cobran como adultos)
    if (composicionFamiliar.mayores && composicionFamiliar.mayores.length > 0) {
        composicionFamiliar.mayores.forEach((edadHijo, index) => {
            const grupoEtarioHijo = determinarGrupoEtarioOspadep(edadHijo);
            const preciosGrupoHijo = planOspadep.preciosPorEdad[grupoEtarioHijo];
            const precioHijoMayor = preciosGrupoHijo.adultoConyugue;
            
            desglose.items.push({
                concepto: `Hijo mayor (${edadHijo} años - ${grupoEtarioHijo})`,
                cantidad: 1,
                precioUnitario: precioHijoMayor,
                subtotal: precioHijoMayor
            });
            desglose.total += precioHijoMayor;
        });
    }
    
    desglose.total = Math.round(desglose.total);
    return desglose;
}

/**
 * Genera un desglose detallado del precio para planes SWISS MEDICAL (TODOS como adultos)
 * @param {object} planSwiss - Plan SWISS MEDICAL con precios por edad
 * @param {object} composicionFamiliar - Composición familiar
 * @param {number} edadTitular - Edad del titular
 * @param {number} edadPareja - Edad de la pareja (opcional)
 * @returns {object} - Desglose detallado
 */
function generarDesglosePrecioSwiss(planSwiss, composicionFamiliar, edadTitular, edadPareja = null) {
    const desglose = {
        items: [],
        total: 0
    };
    
    // Determinar grupo etario del titular
    const grupoEtarioTitular = determinarGrupoEtarioSwiss(edadTitular);
    const precioBaseTitular = planSwiss.preciosPorEdad[grupoEtarioTitular];
    
    // 1. Capita titular
    const precioTitular = precioBaseTitular * plantillaSinDescuentos.capitaTitular;
    desglose.items.push({
        concepto: `Titular (${edadTitular} años - ${grupoEtarioTitular})`,
        cantidad: 1,
        precioUnitario: precioTitular,
        subtotal: precioTitular,
        porcentaje: "100%"
    });
    desglose.total += precioTitular;
    
    // 2. Segunda capita (pareja/cónyuge) - SIN descuento
    if (composicionFamiliar.tienePareja && edadPareja) {
        const grupoEtarioPareja = determinarGrupoEtarioSwiss(edadPareja);
        const precioBasePareja = planSwiss.preciosPorEdad[grupoEtarioPareja];
        const precioPareja = precioBasePareja * plantillaSinDescuentos.segundaCapita;
        
        desglose.items.push({
            concepto: `Cónyuge (${edadPareja} años - ${grupoEtarioPareja})`,
            cantidad: 1,
            precioUnitario: precioPareja,
            subtotal: precioPareja,
            porcentaje: "100%" // SIN descuento
        });
        desglose.total += precioPareja;
    }
    
    // 3. TODOS LOS HIJOS se cobran como ADULTOS (100% - no hay precios específicos para menores)
    if (composicionFamiliar.menores && composicionFamiliar.menores.length > 0) {
        composicionFamiliar.menores.forEach((edadMenor, index) => {
            const grupoEtarioMenor = determinarGrupoEtarioSwiss(edadMenor);
            const precioBaseMenor = planSwiss.preciosPorEdad[grupoEtarioMenor];
            const precioMenor = precioBaseMenor * plantillaSinDescuentos.segundaCapita; // 100% como adulto
            
            desglose.items.push({
                concepto: `Hijo ${index + 1} (${edadMenor} años - ${grupoEtarioMenor})`,
                cantidad: 1,
                precioUnitario: precioMenor,
                subtotal: precioMenor,
                porcentaje: "100%" // SWISS MEDICAL: hijos como adultos
            });
            desglose.total += precioMenor;
        });
    }
    
    // 4. Hijos mayores de 21 años (precio completo, sin descuento)
    if (composicionFamiliar.mayores && composicionFamiliar.mayores.length > 0) {
        composicionFamiliar.mayores.forEach((edadHijo, index) => {
            if (edadHijo >= 21) {
                const grupoEtarioHijo = determinarGrupoEtarioSwiss(edadHijo);
                const precioBaseHijo = planSwiss.preciosPorEdad[grupoEtarioHijo];
                const precioHijoMayor = precioBaseHijo * plantillaSinDescuentos.segundaCapita;
                
                desglose.items.push({
                    concepto: `Hijo mayor (${edadHijo} años - ${grupoEtarioHijo})`,
                    cantidad: 1,
                    precioUnitario: precioHijoMayor,
                    subtotal: precioHijoMayor,
                    porcentaje: "100%" // SIN descuento
                });
                desglose.total += precioHijoMayor;
            }
        });
    }
    
    desglose.total = Math.round(desglose.total);
    return desglose;
}

/**
 * Genera un desglose detallado del precio para planes ACTIVA SALUD (TODOS como adultos)
 * @param {object} planActiva - Plan ACTIVA SALUD con precios por edad
 * @param {object} composicionFamiliar - Composición familiar
 * @param {number} edadTitular - Edad del titular
 * @param {number} edadPareja - Edad de la pareja (opcional)
 * @returns {object} - Desglose detallado
 */
function generarDesglosePrecioActiva(planActiva, composicionFamiliar, edadTitular, edadPareja = null) {
    const desglose = {
        items: [],
        total: 0
    };
    
    // Determinar grupo etario del titular
    const grupoEtarioTitular = determinarGrupoEtarioActiva(edadTitular, planActiva);
    const precioBaseTitular = planActiva.preciosPorEdad[grupoEtarioTitular];
    
    // 1. Capita titular
    const precioTitular = precioBaseTitular * plantillaSinDescuentos.capitaTitular;
    desglose.items.push({
        concepto: `Titular (${edadTitular} años - ${grupoEtarioTitular})`,
        cantidad: 1,
        precioUnitario: precioTitular,
        subtotal: precioTitular,
        porcentaje: "100%"
    });
    desglose.total += precioTitular;
    
    // 2. Segunda capita (pareja/cónyuge) - SIN descuento
    if (composicionFamiliar.tienePareja && edadPareja) {
        const grupoEtarioPareja = determinarGrupoEtarioActiva(edadPareja, planActiva);
        const precioBasePareja = planActiva.preciosPorEdad[grupoEtarioPareja];
        const precioPareja = precioBasePareja * plantillaSinDescuentos.segundaCapita;
        
        desglose.items.push({
            concepto: `Cónyuge (${edadPareja} años - ${grupoEtarioPareja})`,
            cantidad: 1,
            precioUnitario: precioPareja,
            subtotal: precioPareja,
            porcentaje: "100%" // SIN descuento
        });
        desglose.total += precioPareja;
    }
    
    // 3. TODOS LOS HIJOS se cobran como ADULTOS (100%)
    if (composicionFamiliar.menores && composicionFamiliar.menores.length > 0) {
        composicionFamiliar.menores.forEach((edadMenor, index) => {
            const grupoEtarioMenor = determinarGrupoEtarioActiva(edadMenor, planActiva);
            const precioBaseMenor = planActiva.preciosPorEdad[grupoEtarioMenor];
            const precioMenor = precioBaseMenor * plantillaSinDescuentos.segundaCapita; // 100% como adulto
            
            desglose.items.push({
                concepto: `Hijo ${index + 1} (${edadMenor} años - ${grupoEtarioMenor})`,
                cantidad: 1,
                precioUnitario: precioMenor,
                subtotal: precioMenor,
                porcentaje: "100%" // ACTIVA SALUD: hijos como adultos
            });
            desglose.total += precioMenor;
        });
    }
    
    // 4. Hijos mayores de 21 años (precio completo, sin descuento)
    if (composicionFamiliar.mayores && composicionFamiliar.mayores.length > 0) {
        composicionFamiliar.mayores.forEach((edadHijo, index) => {
            if (edadHijo >= 21) {
                const grupoEtarioHijo = determinarGrupoEtarioActiva(edadHijo, planActiva);
                const precioBaseHijo = planActiva.preciosPorEdad[grupoEtarioHijo];
                const precioHijoMayor = precioBaseHijo * plantillaSinDescuentos.segundaCapita;
                
                desglose.items.push({
                    concepto: `Hijo mayor (${edadHijo} años - ${grupoEtarioHijo})`,
                    cantidad: 1,
                    precioUnitario: precioHijoMayor,
                    subtotal: precioHijoMayor,
                    porcentaje: "100%" // SIN descuento
                });
                desglose.total += precioHijoMayor;
            }
        });
    }
    
    desglose.total = Math.round(desglose.total);
    return desglose;
}

/**
 * Genera un desglose detallado del precio para planes SW NUBIAL (TODOS como adultos)
 * @param {object} planSwNubial - Plan SW NUBIAL con precios por edad
 * @param {object} composicionFamiliar - Composición familiar
 * @param {number} edadTitular - Edad del titular
 * @param {number} edadPareja - Edad de la pareja (opcional)
 * @returns {object} - Desglose detallado
 */
function generarDesglosePrecioSwNubial(planSwNubial, composicionFamiliar, edadTitular, edadPareja = null) {
    const desglose = {
        items: [],
        total: 0
    };
    
    // Determinar grupo etario del titular
    const grupoEtarioTitular = determinarGrupoEtarioSwNubial(edadTitular);
    const precioBaseTitular = planSwNubial.preciosPorEdad[grupoEtarioTitular];
    
    // 1. Capita titular (siempre presente)
    const precioTitular = precioBaseTitular * plantillaSinDescuentos.capitaTitular;
    desglose.items.push({
        concepto: `Titular (${edadTitular} años - ${grupoEtarioTitular})`,
        cantidad: 1,
        precioUnitario: precioTitular,
        subtotal: precioTitular,
        porcentaje: "100%"
    });
    desglose.total += precioTitular;
    
    // 2. Segunda capita (pareja/cónyuge) - SIN descuento
    if (composicionFamiliar.tienePareja && edadPareja) {
        const grupoEtarioPareja = determinarGrupoEtarioSwNubial(edadPareja);
        const precioBasePareja = planSwNubial.preciosPorEdad[grupoEtarioPareja];
        const precioPareja = precioBasePareja * plantillaSinDescuentos.segundaCapita;
        
        desglose.items.push({
            concepto: `Cónyuge (${edadPareja} años - ${grupoEtarioPareja})`,
            cantidad: 1,
            precioUnitario: precioPareja,
            subtotal: precioPareja,
            porcentaje: "100%" // SIN descuento
        });
        desglose.total += precioPareja;
    }
    
    // 3. TODOS LOS HIJOS se cobran como ADULTOS (100%)
    if (composicionFamiliar.menores && composicionFamiliar.menores.length > 0) {
        composicionFamiliar.menores.forEach((edadMenor, index) => {
            const grupoEtarioMenor = determinarGrupoEtarioSwNubial(edadMenor);
            const precioBaseMenor = planSwNubial.preciosPorEdad[grupoEtarioMenor];
            const precioMenor = precioBaseMenor * plantillaSinDescuentos.segundaCapita; // 100% como adulto
            
            desglose.items.push({
                concepto: `Hijo ${index + 1} (${edadMenor} años - ${grupoEtarioMenor})`,
                cantidad: 1,
                precioUnitario: precioMenor,
                subtotal: precioMenor,
                porcentaje: "100%" // SW NUBIAL: hijos como adultos
            });
            desglose.total += precioMenor;
        });
    }
    
    // 4. Hijos mayores de 21 años (precio completo, sin descuento)
    if (composicionFamiliar.mayores && composicionFamiliar.mayores.length > 0) {
        composicionFamiliar.mayores.forEach((edadHijo, index) => {
            if (edadHijo >= 21) {
                const grupoEtarioHijo = determinarGrupoEtarioSwNubial(edadHijo);
                const precioBaseHijo = planSwNubial.preciosPorEdad[grupoEtarioHijo];
                const precioHijoMayor = precioBaseHijo * plantillaSinDescuentos.segundaCapita;
                
                desglose.items.push({
                    concepto: `Hijo mayor (${edadHijo} años - ${grupoEtarioHijo})`,
                    cantidad: 1,
                    precioUnitario: precioHijoMayor,
                    subtotal: precioHijoMayor,
                    porcentaje: "100%" // SIN descuento
                });
                desglose.total += precioHijoMayor;
            }
        });
    }
    
    desglose.total = Math.round(desglose.total);
    return desglose;
}

/**
 * Genera un desglose detallado del precio para planes SWISS básico (TODOS como adultos)
 * @param {object} planSwissBasico - Plan SWISS básico con precios por edad
 * @param {object} composicionFamiliar - Composición familiar
 * @param {number} edadTitular - Edad del titular
 * @param {number} edadPareja - Edad de la pareja (opcional)
 * @returns {object} - Desglose detallado
 */
function generarDesglosePrecioSwissBasico(planSwissBasico, composicionFamiliar, edadTitular, edadPareja = null) {
    const desglose = {
        items: [],
        total: 0
    };
    
    // Determinar grupo etario del titular
    const grupoEtarioTitular = determinarGrupoEtarioSwissBasico(edadTitular);
    const precioBaseTitular = planSwissBasico.preciosPorEdad[grupoEtarioTitular];
    
    // 1. Capita titular
    const precioTitular = precioBaseTitular * plantillaSinDescuentos.capitaTitular;
    desglose.items.push({
        concepto: `Titular (${edadTitular} años - ${grupoEtarioTitular})`,
        cantidad: 1,
        precioUnitario: precioTitular,
        subtotal: precioTitular,
        porcentaje: "100%"
    });
    desglose.total += precioTitular;
    
    // 2. Segunda capita (pareja/cónyuge) - SIN descuento
    if (composicionFamiliar.tienePareja && edadPareja) {
        const grupoEtarioPareja = determinarGrupoEtarioSwissBasico(edadPareja);
        const precioBasePareja = planSwissBasico.preciosPorEdad[grupoEtarioPareja];
        const precioPareja = precioBasePareja * plantillaSinDescuentos.segundaCapita;
        
        desglose.items.push({
            concepto: `Cónyuge (${edadPareja} años - ${grupoEtarioPareja})`,
            cantidad: 1,
            precioUnitario: precioPareja,
            subtotal: precioPareja,
            porcentaje: "100%" // SIN descuento
        });
        desglose.total += precioPareja;
    }
    
    // 3. TODOS LOS HIJOS se cobran como ADULTOS (100%)
    if (composicionFamiliar.menores && composicionFamiliar.menores.length > 0) {
        composicionFamiliar.menores.forEach((edadMenor, index) => {
            const grupoEtarioMenor = determinarGrupoEtarioSwissBasico(edadMenor);
            const precioBaseMenor = planSwissBasico.preciosPorEdad[grupoEtarioMenor];
            const precioMenor = precioBaseMenor * plantillaSinDescuentos.segundaCapita; // 100% como adulto
            
            desglose.items.push({
                concepto: `Hijo ${index + 1} (${edadMenor} años - ${grupoEtarioMenor})`,
                cantidad: 1,
                precioUnitario: precioMenor,
                subtotal: precioMenor,
                porcentaje: "100%" // SWISS: hijos como adultos
            });
            desglose.total += precioMenor;
        });
    }
    
    // 4. Hijos mayores de 21 años (precio completo, sin descuento)
    if (composicionFamiliar.mayores && composicionFamiliar.mayores.length > 0) {
        composicionFamiliar.mayores.forEach((edadHijo, index) => {
            if (edadHijo >= 21) {
                const grupoEtarioHijo = determinarGrupoEtarioSwissBasico(edadHijo);
                const precioBaseHijo = planSwissBasico.preciosPorEdad[grupoEtarioHijo];
                const precioHijoMayor = precioBaseHijo * plantillaSinDescuentos.segundaCapita;
                
                desglose.items.push({
                    concepto: `Hijo mayor (${edadHijo} años - ${grupoEtarioHijo})`,
                    cantidad: 1,
                    precioUnitario: precioHijoMayor,
                    subtotal: precioHijoMayor,
                    porcentaje: "100%" // SIN descuento
                });
                desglose.total += precioHijoMayor;
            }
        });
    }
    
    desglose.total = Math.round(desglose.total);
    return desglose;
}

/**
 * Genera un desglose detallado del precio para planes MEDIFE (Individual/Matrimonio + hijos específicos)
 * @param {object} planMedife - Plan MEDIFE con estructura específica
 * @param {object} composicionFamiliar - Composición familiar
 * @param {number} edadTitular - Edad del titular
 * @param {number} edadPareja - Edad de la pareja (opcional)
 * @returns {object} - Desglose detallado
 */
function generarDesglosePrecioMedife(planMedife, composicionFamiliar, edadTitular, edadPareja = null) {
    const desglose = {
        items: [],
        total: 0
    };
    
    // NUEVA LÓGICA: Si es matrimonio, se toma la edad MAYOR y se usa el precio MATRIMONIO de ese rango
    const esMatrimonio = composicionFamiliar.tienePareja;
    
    if (esMatrimonio && edadPareja) {
        // Determinar la edad más alta entre titular y cónyuge
        const edadMaxima = Math.max(edadTitular, edadPareja);
        const grupoEtarioMatrimonio = determinarGrupoEtarioMedife(edadMaxima);
        const precioMatrimonio = planMedife.precios.matrimonio[grupoEtarioMatrimonio];
        
        desglose.items.push({
            concepto: `Matrimonio (Titular: ${edadTitular} años, Cónyuge: ${edadPareja} años - Rango: ${grupoEtarioMatrimonio})`,
            cantidad: 1,
            precioUnitario: precioMatrimonio,
            subtotal: precioMatrimonio,
            porcentaje: "Precio matrimonio según edad mayor"
        });
        desglose.total += precioMatrimonio;
    } else {
        // Precio INDIVIDUAL
        const grupoEtarioTitular = determinarGrupoEtarioMedife(edadTitular);
        const precioIndividual = planMedife.precios.individual[grupoEtarioTitular];
        desglose.items.push({
            concepto: `Individual (${edadTitular} años - ${grupoEtarioTitular})`,
            cantidad: 1,
            precioUnitario: precioIndividual,
            subtotal: precioIndividual,
            porcentaje: "Precio individual"
        });
        desglose.total += precioIndividual;
    }
    
    // Procesar hijos menores de 21 años
    if (composicionFamiliar.menores && composicionFamiliar.menores.length > 0) {
        const menoresDe21 = composicionFamiliar.menores.filter(edad => edad < 21);
        
        menoresDe21.forEach((edadMenor, index) => {
            let precioHijo, conceptoHijo;
            
            if (index === 0) {
                // Primer hijo
                precioHijo = planMedife.precios.hijos.primerHijo;
                conceptoHijo = `1er hijo menor (${edadMenor} años)`;
            } else if (index === 1) {
                // Segundo hijo
                precioHijo = planMedife.precios.hijos.segundoHijo;
                conceptoHijo = `2do hijo menor (${edadMenor} años)`;
            } else {
                // Tercer hijo en adelante - usar precio segundo hijo
                precioHijo = planMedife.precios.hijos.segundoHijo;
                conceptoHijo = `Hijo ${index + 1} menor (${edadMenor} años)`;
            }
            
            desglose.items.push({
                concepto: conceptoHijo,
                cantidad: 1,
                precioUnitario: precioHijo,
                subtotal: precioHijo,
                porcentaje: "Precio específico MEDIFE"
            });
            desglose.total += precioHijo;
        });
    }
    
    // Procesar hijos adultos (21-29 años) y familiares a cargo (>29)
    if (composicionFamiliar.mayores && composicionFamiliar.mayores.length > 0) {
        composicionFamiliar.mayores.forEach((edadHijo, index) => {
            let precioHijo, conceptoHijo;
            
            if (edadHijo >= 21 && edadHijo <= 29) {
                // Hijo adulto (21-29)
                precioHijo = planMedife.precios.hijos.hijoAdulto;
                conceptoHijo = `Hijo adulto (${edadHijo} años, 21-29)`;
            } else if (edadHijo > 29) {
                // Familiar a cargo (mayor de 29)
                precioHijo = planMedife.precios.hijos.familiarCargo;
                conceptoHijo = `Familiar a cargo (${edadHijo} años, >29)`;
            }
            
            if (precioHijo) {
                desglose.items.push({
                    concepto: conceptoHijo,
                    cantidad: 1,
                    precioUnitario: precioHijo,
                    subtotal: precioHijo,
                    porcentaje: "Precio específico MEDIFE"
                });
                desglose.total += precioHijo;
            }
        });
    }
    
    desglose.total = Math.round(desglose.total);
    return desglose;
}

/**
 * FUNCIÓN UNIFICADA DE DESGLOSE - Determina automáticamente qué tipo usar
 * @param {string} prestadorKey - Clave del prestador
 * @param {object} plan - Plan específico del prestador
 * @param {object} composicionFamiliar - Composición familiar
 * @param {number} edadTitular - Edad del titular
 * @param {number} edadPareja - Edad de la pareja (opcional)
 * @returns {object} - Desglose detallado
 */
function generarDesgloseUnificado(prestadorKey, plan, composicionFamiliar, edadTitular, edadPareja = null) {
    const prestador = prestadoresData[prestadorKey];
    
    if (!prestador) {
        throw new Error(`Prestador no encontrado: ${prestadorKey}`);
    }
    
    // Obtener el desglose base del prestador específico
    let desglose;
    if (prestadorKey === 'activaSalud') {
        desglose = generarDesglosePrecioActiva(plan, composicionFamiliar, edadTitular, edadPareja);
    } else if (prestadorKey === 'ospadepSalud') {
        desglose = generarDesglosePrecioOspadep(plan, composicionFamiliar, edadTitular, edadPareja);
    } else {
        switch (prestador.tipoEstructura) {
            case "plantilla_adultos_solo":
                desglose = generarDesglosePrecioSwiss(plan, composicionFamiliar, edadTitular, edadPareja);
                break;
            case "plantilla_adultos_simple":
                if (prestadorKey === 'swNubial') {
                    desglose = generarDesglosePrecioSwNubial(plan, composicionFamiliar, edadTitular, edadPareja);
                } else if (prestadorKey === 'swiss') {
                    desglose = generarDesglosePrecioSwissBasico(plan, composicionFamiliar, edadTitular, edadPareja);
                } else {
                    desglose = generarDesglosePrecioActiva(plan, composicionFamiliar, edadTitular, edadPareja);
                }
                break;
            case "estructura_matrimonio_hijos":
                desglose = generarDesglosePrecioMedife(plan, composicionFamiliar, edadTitular, edadPareja);
                break;
            case "plantilla_sin_descuentos":
                desglose = generarDesglosePrecioSwiss(plan, composicionFamiliar, edadTitular, edadPareja);
                break;
            case "plantilla_porcentual":
                console.warn('Desglose con descuentos detectado - implementar cuando sea necesario');
                desglose = generarDesglosePrecioSwiss(plan, composicionFamiliar, edadTitular, edadPareja);
                break;
            case "estructura_compleja":
            default:
                desglose = generarDesglosePrecioOMINT(plan, composicionFamiliar, edadTitular, edadPareja);
        }
    }

    // Agregar descuento especial si existe (pero NO aportes, para evitar duplicación)
    if (plan._descuentoEspecial && plan._descuentoEspecial > 0) {
        desglose.items.push({
            concepto: `Descuento especial (${plan._porcentajeDescuento}%)`,
            cantidad: 1,
            precioUnitario: -plan._descuentoEspecial,
            subtotal: -plan._descuentoEspecial,
            porcentaje: 'Descuento especial'
        });
    }
    
    // NOTA: NO agregamos "Aportes descontados" aquí porque se maneja en la visualización (en verde)

    // Actualizar el total final solo si no hay items específicos del prestador
    if (desglose.items.length === 0) {
        desglose.total = plan._precioFinal || desglose.total;
    } else {
        // Recalcular el total basado en los items del desglose
        desglose.total = desglose.items.reduce((sum, item) => sum + item.subtotal, 0);
    }
    
    return desglose;
}

/**
 * Función de compatibilidad para el desglose anterior
 * @param {number} basePriceCapitaTitular - Precio base (no usado en nuevas estructuras)
 * @param {object} composicionFamiliar - Composición familiar
 * @returns {object} - Desglose vacío para compatibilidad
 */
function generarDesglosePrecio(basePriceCapitaTitular, composicionFamiliar) {
    // Esta función se mantiene para compatibilidad pero no se usa con prestadores reales
    console.warn('Función generarDesglosePrecio() obsoleta. Usar generarDesgloseUnificado()');
    return { items: [], total: 0 };
}

// ===== DATOS DE PLANES LEGACY (mantener compatibilidad) =====
// Nota: Esta estructura se mantiene para compatibilidad con el panel admin
// Los nuevos cálculos usarán prestadoresData
const planesData = {
    individual: [
        {
            name: "Plan Básico Individual",
            price: 18000,
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
            price: 28000,
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
            name: "Plan Premium Individual",
            price: 42000,
            ageRange: "51+",
            features: [
                "Todas las prestaciones del Plan Completo",
                "Cobertura internacional",
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

// ===== FUNCIONES DE TESTING PARA SISTEMA MULTI-PRESTADOR =====
function testNuevaLogicaCotizacion() {
    console.log('🧪 === TESTING SISTEMA MULTI-PRESTADOR (4 PRESTADORES) ===');
    
    // Ejemplo 1: OMINT vs SWISS MEDICAL - Plan individual (30 años)
    const composicionSolo = {
        tienePareja: false,
        menores: [],
        mayores: [],
        resumen: 'Plan individual'
    };
    
    const edadTitular = 30;
    
    // OMINT - Plan Comunidad
    const planOMINT = prestadoresData.omint.planes.planComunidad;
    const precioOMINT = calcularPrecioUnificado('omint', planOMINT, composicionSolo, edadTitular);
    const desgloseOMINT = generarDesgloseUnificado('omint', planOMINT, composicionSolo, edadTitular);
    
    console.log('📋 OMINT - Plan individual (30 años):', {
        prestador: 'OMINT',
        plan: planOMINT.name,
        precioFinal: precioOMINT,
        grupoEtario: determinarGrupoEtario(edadTitular),
        tipoEstructura: 'precios_especificos_por_rol',
        desglose: desgloseOMINT
    });
    
    // SWISS MEDICAL - Plan MS
    const planSwiss = prestadoresData.swissMedical.planes.ms;
    const precioSwiss = calcularPrecioUnificado('swissMedical', planSwiss, composicionSolo, edadTitular);
    const desgloseSwiss = generarDesgloseUnificado('swissMedical', planSwiss, composicionSolo, edadTitular);
    
    console.log('📋 SWISS MEDICAL - Plan individual (30 años):', {
        prestador: 'SWISS MEDICAL',
        plan: planSwiss.name,
        precioFinal: precioSwiss,
        grupoEtario: determinarGrupoEtarioSwiss(edadTitular),
        tipoEstructura: 'plantilla_adultos_solo',
        nota: 'TODOS cobrados como adultos - hijos NO tienen descuento',
        desglose: desgloseSwiss
    });
    
    // Ejemplo 2: Solo pareja - VERIFICAR SIN DESCUENTOS para segunda capita
    console.log('\n--- Verificación: Pareja SIN descuentos en segunda capita ---');
    
    const composicionPareja = {
        tienePareja: true,
        menores: [],
        mayores: [],
        resumen: 'Solo pareja sin hijos'
    };
    
    const edadParejaTest = 32;
    
    // OMINT - usa precios específicos por rol
    const precioOMINTPareja = calcularPrecioUnificado('omint', planOMINT, composicionPareja, 35, edadParejaTest);
    const desgloseOMINTPareja = generarDesgloseUnificado('omint', planOMINT, composicionPareja, 35, edadParejaTest);
    
    console.log('📋 OMINT - Pareja (35+32 años):', {
        precioFinal: precioOMINTPareja,
        diferencia: `+$${precioOMINTPareja - precioOMINT} vs individual`,
        nota: 'Usa precios específicos por rol - NO plantilla porcentual',
        desglose: desgloseOMINTPareja
    });
    
    // SWISS MEDICAL - NO debe aplicar descuento a segunda capita
    const precioSwissPareja = calcularPrecioUnificado('swissMedical', planSwiss, composicionPareja, 35, edadParejaTest);
    const desgloseSwissPareja = generarDesgloseUnificado('swissMedical', planSwiss, composicionPareja, 35, edadParejaTest);
    
    console.log('📋 SWISS MEDICAL - Pareja (35+32 años):', {
        precioFinal: precioSwissPareja,
        diferencia: `+$${precioSwissPareja - precioSwiss} vs individual`,
        nota: '⚠️  Segunda capita = 100% (SIN descuento del 75%)',
        verificacion: desgloseSwissPareja.items.find(item => item.concepto.includes('Cónyuge'))?.porcentaje === '100%' ? '✅ Correcto' : '❌ Error',
        desglose: desgloseSwissPareja
    });
    
    // Ejemplo 2.5: VERIFICAR HIJOS MENORES - SWISS vs OMINT
    console.log('\n--- VERIFICACIÓN CRÍTICA: Hijos menores SWISS vs OMINT ---');
    
    const composicionConHijos = {
        tienePareja: false,
        menores: [8, 15], // 2 hijos menores
        mayores: [],
        resumen: 'Titular con 2 hijos menores'
    };
    
    // OMINT - hijos menores SÍ tienen descuento específico
    const precioOMINTConHijos = calcularPrecioUnificado('omint', planOMINT, composicionConHijos, 35);
    const desgloseOMINTConHijos = generarDesgloseUnificado('omint', planOMINT, composicionConHijos, 35);
    
    console.log('📋 OMINT - Con hijos menores:', {
        precioFinal: precioOMINTConHijos,
        nota: 'Usa precios específicos para hijos (hijo1Menor, hijo2MasMenores)',
        hijosDetalle: desgloseOMINTConHijos.items.filter(item => item.concepto.includes('Hijo')),
        desglose: desgloseOMINTConHijos
    });
    
    // SWISS MEDICAL - hijos menores se cobran como ADULTOS
    const precioSwissConHijos = calcularPrecioUnificado('swissMedical', planSwiss, composicionConHijos, 35);
    const desgloseSwissConHijos = generarDesgloseUnificado('swissMedical', planSwiss, composicionConHijos, 35);
    
    console.log('📋 SWISS MEDICAL - Con hijos menores:', {
        precioFinal: precioSwissConHijos,
        nota: '🚨 HIJOS COBRADOS COMO ADULTOS (100% - NO 50%)',
        verificacionHijos: desgloseSwissConHijos.items.filter(item => item.concepto.includes('Hijo')).every(item => item.porcentaje === '100%') ? '✅ Correcto' : '❌ Error',
        hijosDetalle: desgloseSwissConHijos.items.filter(item => item.concepto.includes('Hijo')),
        desglose: desgloseSwissConHijos
    });
    
    // Ejemplo 3: Familia completa - comparación entre prestadores
    console.log('\n--- Familia completa - comparación entre prestadores ---');
    
    const composicionFamilia = {
        tienePareja: true,
        menores: [8, 15], // 2 hijos menores
        mayores: [],
        resumen: 'Plan familiar con pareja y 2 menor(es)'
    };
    
    const edadPareja = 32;
    
    // OMINT
    const precioFamiliaOMINT = calcularPrecioUnificado('omint', planOMINT, composicionFamilia, edadTitular, edadPareja);
    const desgloseFamiliaOMINT = generarDesgloseUnificado('omint', planOMINT, composicionFamilia, edadTitular, edadPareja);
    
    console.log('👨‍👩‍👧‍👦 OMINT - Familia completa:', {
        prestador: 'OMINT',
        plan: planOMINT.name,
        precioFinal: precioFamiliaOMINT,
        desglose: desgloseFamiliaOMINT
    });
    
    // SWISS MEDICAL
    const precioFamiliaSwiss = calcularPrecioUnificado('swissMedical', planSwiss, composicionFamilia, edadTitular, edadPareja);
    const desgloseFamiliaSwiss = generarDesgloseUnificado('swissMedical', planSwiss, composicionFamilia, edadTitular, edadPareja);
    
    console.log('👨‍👩‍👧‍👦 SWISS MEDICAL - Familia completa:', {
        prestador: 'SWISS MEDICAL',
        plan: planSwiss.name,
        precioFinal: precioFamiliaSwiss,
        desglose: desgloseFamiliaSwiss
    });
    
    // NUEVOS PRESTADORES - ACTIVA SALUD y MEDIFE
    console.log('\n=== TESTING NUEVOS PRESTADORES ===');
    
    // ACTIVA SALUD - Plan individual (30 años)
    const planActiva = prestadoresData.activaSalud.planes.as300;
    const precioActiva = calcularPrecioUnificado('activaSalud', planActiva, composicionSolo, edadTitular);
    const desgloseActiva = generarDesgloseUnificado('activaSalud', planActiva, composicionSolo, edadTitular);
    
    console.log('📋 ACTIVA SALUD - Plan individual (30 años):', {
        prestador: 'ACTIVA SALUD',
        plan: planActiva.name,
        precioFinal: precioActiva,
        grupoEtario: determinarGrupoEtarioActiva(edadTitular, planActiva),
        tipoEstructura: 'plantilla_adultos_simple',
        nota: 'Simple: todos como adultos con 2 grupos etarios',
        desglose: desgloseActiva
    });
    
    // MEDIFE - Plan PLATA individual (30 años)
    const planMedife = prestadoresData.medife.planes.plata;
    const precioMedife = calcularPrecioUnificado('medife', planMedife, composicionSolo, edadTitular);
    const desgloseMedife = generarDesgloseUnificado('medife', planMedife, composicionSolo, edadTitular);
    
    console.log('📋 MEDIFE - Plan PLATA individual (30 años):', {
        prestador: 'MEDIFE',
        plan: planMedife.name,
        precioFinal: precioMedife,
        grupoEtario: determinarGrupoEtarioMedife(edadTitular),
        tipoEstructura: 'estructura_matrimonio_hijos',
        nota: 'Complejo: Individual vs Matrimonio + hijos específicos',
        desglose: desgloseMedife
    });
    
    // COMPARACIÓN MEDIFE: Individual vs Matrimonio
    console.log('\n--- MEDIFE: Individual vs Matrimonio (35+32 años) ---');
    
    const precioMedifeMatrimonio = calcularPrecioUnificado('medife', planMedife, composicionPareja, 35, edadParejaTest);
    const desgloseMedifeMatrimonio = generarDesgloseUnificado('medife', planMedife, composicionPareja, 35, edadParejaTest);
    
    console.log('📋 MEDIFE - Matrimonio vs Individual:', {
        individual35: calcularPrecioUnificado('medife', planMedife, composicionSolo, 35),
        matrimonio: precioMedifeMatrimonio,
        diferencia: `+$${precioMedifeMatrimonio - calcularPrecioUnificado('medife', planMedife, composicionSolo, 35)}`,
        nota: 'MEDIFE: precio matrimonio ≠ 2x individual',
        desglose: desgloseMedifeMatrimonio
    });
    
    // COMPARACIÓN HIJOS: MEDIFE vs otros prestadores
    console.log('\n--- HIJOS MENORES: Comparación entre 4 prestadores ---');
    
    // ACTIVA SALUD con hijos
    const precioActivaConHijos = calcularPrecioUnificado('activaSalud', planActiva, composicionConHijos, 35);
    const desgloseActivaConHijos = generarDesgloseUnificado('activaSalud', planActiva, composicionConHijos, 35);
    
    // MEDIFE con hijos
    const precioMedifeConHijos = calcularPrecioUnificado('medife', planMedife, composicionConHijos, 35);
    const desgloseMedifeConHijos = generarDesgloseUnificado('medife', planMedife, composicionConHijos, 35);
    
    console.log('👶 COMPARACIÓN HIJOS MENORES (8 y 15 años):');
    console.log('- OMINT:', {
        precio: precioOMINTConHijos,
        nota: 'Usa precios específicos: hijo1Menor + hijo2MasMenores'
    });
    console.log('- SWISS MEDICAL:', {
        precio: precioSwissConHijos,
        nota: 'Hijos como adultos 100% (≤65 años)'
    });
    console.log('- ACTIVA SALUD:', {
        precio: precioActivaConHijos,
        nota: 'Hijos como adultos 100% (≤65 años)',
        desglose: desgloseActivaConHijos
    });
    console.log('- MEDIFE:', {
        precio: precioMedifeConHijos,
        nota: 'Precios específicos: 1er hijo + 2do hijo',
        desglose: desgloseMedifeConHijos
    });
    
    // PRUEBA ESPECÍFICA MEDIFE - Caso del usuario
    console.log('\n--- PRUEBA ESPECÍFICA MEDIFE - Caso del usuario ---');
    const composicionUsuario = {
        tienePareja: false,
        menores: [24], // 1 hijo de 24 años
        mayores: []
    };
    
    const precioMedifeUsuario = calcularPrecioUnificado('medife', planMedife, composicionUsuario, 52);
    const desgloseMedifeUsuario = generarDesgloseUnificado('medife', planMedife, composicionUsuario, 52);
    
    console.log('📋 MEDIFE - Caso usuario (52 años + 1 hijo 24 años):', {
        prestador: 'MEDIFE',
        plan: planMedife.name,
        precioFinal: precioMedifeUsuario,
        composicion: composicionUsuario,
        desglose: desgloseMedifeUsuario,
        items: desgloseMedifeUsuario.items.map(item => ({
            concepto: item.concepto,
            precio: item.precioUnitario,
            subtotal: item.subtotal
        }))
    });
    
    // Comparación de precios entre los 4 prestadores
    console.log('\n💰 === COMPARACIÓN DE PRECIOS (4 PRESTADORES) ===');
    
    const preciosIndividuales = [
        { prestador: 'OMINT', precio: precioOMINT },
        { prestador: 'SWISS MEDICAL', precio: precioSwiss },
        { prestador: 'ACTIVA SALUD', precio: precioActiva },
        { prestador: 'MEDIFE', precio: precioMedife }
    ].sort((a, b) => a.precio - b.precio);
    
    const preciosFamiliares = [
        { prestador: 'OMINT', precio: precioFamiliaOMINT },
        { prestador: 'SWISS MEDICAL', precio: precioFamiliaSwiss },
        { prestador: 'ACTIVA SALUD', 
          precio: calcularPrecioUnificado('activaSalud', planActiva, composicionFamilia, edadTitular, edadPareja) },
        { prestador: 'MEDIFE', 
          precio: calcularPrecioUnificado('medife', planMedife, composicionFamilia, edadTitular, edadPareja) }
    ].sort((a, b) => a.precio - b.precio);
    
    console.log('🏆 RANKING INDIVIDUAL (30 años):');
    preciosIndividuales.forEach((item, index) => {
        const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '4️⃣';
        console.log(`${emoji} ${item.prestador}: $${item.precio.toLocaleString()}`);
    });
    
    console.log('\n🏆 RANKING FAMILIAR (pareja + 2 hijos):');
    preciosFamiliares.forEach((item, index) => {
        const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '4️⃣';
        console.log(`${emoji} ${item.prestador}: $${item.precio.toLocaleString()}`);
    });
    
    // Mostrar estructura de prestadores
    console.log('\n🏥 === PRESTADORES DISPONIBLES ===');
    Object.keys(prestadoresData).forEach(key => {
        const prestador = prestadoresData[key];
        console.log(`📋 ${prestador.name}:`, {
            key: key,
            tipoEstructura: prestador.tipoEstructura || 'estructura_compleja',
            cantidadPlanes: Object.keys(prestador.planes).length,
            planes: Object.keys(prestador.planes).map(planKey => prestador.planes[planKey].name)
        });
    });
    
    console.log('\n✅ === FIN DEL TESTING MULTI-PRESTADOR ===');
}

// Función para cargar datos de ejemplo en el formulario
function cargarEjemploFormulario(tipo = 'familia') {
    console.log(`🎯 Cargando ejemplo: ${tipo}`);
    
    // Seleccionar la opción
    selectedOption = tipo;
    selectOption(tipo);
    
    // Simular llenar el formulario después de un breve delay
    setTimeout(() => {
        const edadTitular = document.getElementById('edad-titular');
        if (edadTitular) edadTitular.value = '35';
        
        if (tipo === 'pareja' || tipo === 'familia') {
            const edadPareja = document.getElementById('edad-pareja');
            if (edadPareja) edadPareja.value = '32';
        }
        
        if (tipo === 'hijos' || tipo === 'familia') {
            const cantidadHijos = document.getElementById('cantidad-hijos');
            const edadesHijos = document.getElementById('edades-hijos');
            if (cantidadHijos) cantidadHijos.value = '2';
            if (edadesHijos) edadesHijos.value = '8, 15';
        }
        
        // Seleccionar situación laboral
        const situacionLaboral = document.getElementById('situacion-laboral');
        if (situacionLaboral) situacionLaboral.value = 'dependencia';
        
        console.log('✅ Datos de ejemplo cargados. Puedes hacer clic en "Cotizar Plan"');
    }, 1000);
}



// Inicialización de la aplicación
// ================================
// SISTEMA DE ACCESO SECRETO AL PANEL DE ADMINISTRACIÓN
// ================================

// Sistema de acceso secreto al panel de administración
let secretKeySequence = [];
const SECRET_CODE = ['a', 'd', 'm', 'i', 'n'];
const SECRET_URL_PARAM = 'admin_access_2024';

function initSecretAccess() {
    // Método 1: Combinación de teclas secreta (escribir "admin")
    document.addEventListener('keydown', function(event) {
        secretKeySequence.push(event.key.toLowerCase());
        
        // Mantener solo los últimos 5 caracteres
        if (secretKeySequence.length > SECRET_CODE.length) {
            secretKeySequence.shift();
        }
        
        // Verificar si coincide con el código secreto
        if (secretKeySequence.join('') === SECRET_CODE.join('')) {
            console.log('🔓 Acceso secreto activado por teclado');
            showSecretAdminAccess();
            secretKeySequence = []; // Limpiar secuencia
        }
    });
    
    // Método 2: URL con parámetro secreto
    // Ejemplo: https://tu-sitio.com/?access=admin_access_2024
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('access') === SECRET_URL_PARAM) {
        console.log('🔓 Acceso por URL secreto activado');
        showSecretAdminAccess();
    }
    
    // Método 3: Comando de consola (para desarrollador)
    window.enableAdminAccess = function() {
        console.log('🔓 Acceso de administrador habilitado desde consola');
        showSecretAdminAccess();
    };
    
    // Método 4: Combinación de teclas Ctrl+Shift+A
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'A') {
            console.log('🔓 Acceso secreto por combinación de teclas');
            showSecretAdminAccess();
        }
    });
}

function showSecretAdminAccess() {
    const adminBtn = document.getElementById('secret-admin-btn');
    if (adminBtn) {
        // Marcar que el acceso fue autorizado
        sessionStorage.setItem('admin_access_authorized', 'true');
        adminBtn.style.display = 'block';
        
        // Mostrar mensaje temporal
        const tempMsg = document.createElement('div');
        tempMsg.innerHTML = '🔓 Panel de administración activado';
        tempMsg.style.cssText = 'position:fixed;top:20px;right:20px;background:#4caf50;color:white;padding:15px 20px;border-radius:8px;z-index:9999;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
        document.body.appendChild(tempMsg);
        
        setTimeout(() => {
            if (document.body.contains(tempMsg)) {
                document.body.removeChild(tempMsg);
            }
        }, 4000);
    }
}

// Protección adicional: verificar acceso autorizado antes de mostrar panel
function checkAdminAccess() {
    const isAuthorized = sessionStorage.getItem('admin_access_authorized') === 'true';
    const adminSection = document.getElementById('admin-section');
    
    if (!isAuthorized && adminSection && adminSection.style.display !== 'none') {
        console.warn('⚠️ Intento de acceso no autorizado al panel de administración');
        adminSection.style.display = 'none';
        
        // Mostrar mensaje de acceso denegado
        const denyMsg = document.createElement('div');
        denyMsg.innerHTML = '🚫 Acceso denegado';
        denyMsg.style.cssText = 'position:fixed;top:20px;right:20px;background:#f44336;color:white;padding:15px 20px;border-radius:8px;z-index:9999;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
        document.body.appendChild(denyMsg);
        
        setTimeout(() => {
            if (document.body.contains(denyMsg)) {
                document.body.removeChild(denyMsg);
            }
        }, 3000);
    }
}

// Verificar acceso cada 5 segundos
setInterval(checkAdminAccess, 5000);

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Iniciando sistema de cotización OSPADEP...');
    
    // Inicializar sistema de acceso secreto
    initSecretAccess();
    
    // 1. Intentar cargar precios desde archivo externo
    const preciosExternosCargados = await cargarPreciosExternos();
    
    // 2. Si no se pudieron cargar precios externos, usar datos de respaldo
    if (!preciosExternosCargados) {
        prestadoresData = prestadoresDataRespaldo;
        console.log('📋 Usando precios internos de respaldo');
    }
    
    // 3. Cargar planes personalizados si existen
    loadCustomPlans();
    
    // 4. Inicializar la aplicación
    initializeApp();
    
    // 5. Verificar sesión activa cuando el AuthSystem esté listo
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
    
    // ===== NUEVO: Ejecutar test y agregar funciones globales =====
    testNuevaLogicaCotizacion();
    
    // Agregar funciones al window para acceso desde consola
    window.testNuevaLogicaCotizacion = testNuevaLogicaCotizacion;
    window.cargarEjemploFormulario = cargarEjemploFormulario;
    window.calcularPrecioUnificado = calcularPrecioUnificado;
    window.generarDesgloseUnificado = generarDesgloseUnificado;
    window.calcularPrecioFinalOMINT = calcularPrecioFinalOMINT;
    window.calcularPrecioFinalSwiss = calcularPrecioFinalSwiss;
    window.calcularPrecioFinalActiva = calcularPrecioFinalActiva;
    window.calcularPrecioFinalMedife = calcularPrecioFinalMedife;
    window.determinarGrupoEtario = determinarGrupoEtario;
    window.determinarGrupoEtarioSwiss = determinarGrupoEtarioSwiss;
    window.determinarGrupoEtarioActiva = determinarGrupoEtarioActiva;
    window.determinarGrupoEtarioMedife = determinarGrupoEtarioMedife;
    window.generarDesglosePrecioActiva = generarDesglosePrecioActiva;
    window.generarDesglosePrecioMedife = generarDesglosePrecioMedife;
    
    // Verificar estado del sistema de precios externos
    verificarEstadoPreciosExternos();
    window.prestadoresData = prestadoresData;
    

    window.plantillaPorcentual = plantillaPorcentual;
    window.plantillaSinDescuentos = plantillaSinDescuentos;
    
    console.log('🚀 Aplicación iniciada con sistema multi-prestador (4 prestadores)');
    console.log('💡 Funciones disponibles en consola:');
    console.log('   - testNuevaLogicaCotizacion(): Ejecuta ejemplos comparativos entre 4 prestadores');
    console.log('   - cargarEjemploFormulario("familia"): Carga datos de ejemplo');
    console.log('   - calcularPrecioUnificado(prestadorKey, plan, composicion, edadTitular, edadPareja): Cálculo universal');
    console.log('   - generarDesgloseUnificado(prestadorKey, plan, composicion, edadTitular, edadPareja): Desglose universal');
    console.log('   - prestadoresData: Ver todos los prestadores y planes disponibles');
    console.log('   📊 Prestadores disponibles:', Object.keys(prestadoresData).map(k => `${k} (${prestadoresData[k].name})`).join(', '));
    console.log('   🏗️  Estructuras:', {
        'OMINT': 'precios específicos por rol',
        'SWISS MEDICAL': 'todos como adultos',
        'ACTIVA SALUD': 'simple (2 grupos etarios)',
        'MEDIFE': 'Individual/Matrimonio + hijos específicos'
    });
});

function initializeApp() {
    // Agregar event listeners a las opciones del formulario
    const optionItems = document.querySelectorAll('.option-item');
    optionItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const option = this.dataset.option;
            if (option) {
                selectOption(option);
            }
        });
    });

    // Event listener para el botón continuar
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            if (selectedOption) {
                showDetailsForm(selectedOption);
            }
        });
    }

    // Event listener para el formulario de cotización
    const cotizationForm = document.getElementById('cotization-form');
    if (cotizationForm) {
        cotizationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm()) {
                processForm();
            }
        });
    }

    // Event listeners para botones de contacto
    setupContactButtons();
}

function selectOption(option) {
    selectedOption = option;
    
    // Actualizar visualización de opciones seleccionadas
    const optionItems = document.querySelectorAll('.option-item');
    optionItems.forEach(item => {
        if (item.dataset.option === option) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    // Habilitar botón continuar
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.disabled = false;
    }
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
        // Radio buttons para sueldo bruto o aporte
        '<div class="form-row">' +
        '<div class="form-group">' +
        '<label>¿Tenés sueldo bruto o dato de aporte?</label>' +
        '<div class="aporte-toggle-group">' +
        '<label class="aporte-toggle">' +
        '<input type="radio" name="aporte-titular-toggle" value="sueldo">' +
        '<i class="fas fa-dollar-sign"></i> Sueldo bruto' +
        '</label>' +
        '<label class="aporte-toggle">' +
        '<input type="radio" name="aporte-titular-toggle" value="aporte">' +
        '<i class="fas fa-percentage"></i> Dato de aporte' +
        '</label>' +
        '</div>' +
        '<input type="number" id="sueldo-titular" name="sueldo-titular" placeholder="Ingresá tu sueldo bruto" style="display:none;">' +
        '<input type="number" id="aporte-titular" name="aporte-titular" placeholder="Ingresá tu aporte" style="display:none;">' +
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
                // Radio buttons para sueldo bruto o aporte de la pareja
                '<div class="form-row">' +
                '<div class="form-group">' +
                '<label>¿Tu pareja tiene sueldo bruto o dato de aporte?</label>' +
                '<div class="aporte-toggle-group">' +
                '<label class="aporte-toggle">' +
                '<input type="radio" name="aporte-pareja-toggle" value="sueldo">' +
                '<i class="fas fa-dollar-sign"></i> Sueldo bruto' +
                '</label>' +
                '<label class="aporte-toggle">' +
                '<input type="radio" name="aporte-pareja-toggle" value="aporte">' +
                '<i class="fas fa-percentage"></i> Dato de aporte' +
                '</label>' +
                '</div>' +
                '<input type="number" id="sueldo-pareja" name="sueldo-pareja" placeholder="Ingresá el sueldo bruto de tu pareja" style="display:none;">' +
                '<input type="number" id="aporte-pareja" name="aporte-pareja" placeholder="Ingresá el aporte de tu pareja" style="display:none;">' +
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
                // Radio buttons para sueldo bruto o aporte de la pareja
                '<div class="form-row">' +
                '<div class="form-group">' +
                '<label>¿Tu pareja tiene sueldo bruto o dato de aporte?</label>' +
                '<div class="aporte-toggle-group">' +
                '<label class="aporte-toggle">' +
                '<input type="radio" name="aporte-pareja-toggle" value="sueldo">' +
                '<i class="fas fa-dollar-sign"></i> Sueldo bruto' +
                '</label>' +
                '<label class="aporte-toggle">' +
                '<input type="radio" name="aporte-pareja-toggle" value="aporte">' +
                '<i class="fas fa-percentage"></i> Dato de aporte' +
                '</label>' +
                '</div>' +
                '<input type="number" id="sueldo-pareja" name="sueldo-pareja" placeholder="Ingresá el sueldo bruto de tu pareja" style="display:none;">' +
                '<input type="number" id="aporte-pareja" name="aporte-pareja" placeholder="Ingresá el aporte de tu pareja" style="display:none;">' +
                '</div>' +
                '</div>' +
                '</div>';
            // Sección de hijos igual que antes
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
                '<input type="text" id="edades-hijos" name="edades-hijos" placeholder="Ej: 5, 8, 12, 28" required>' +
                '<small class="field-help">Separa las edades con comas. Menores de 25 años tienen precio especial en OMINT</small>' +
                '<div class="error-message" id="error-edades-hijos"></div>' +
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
                '<input type="text" id="edades-hijos" name="edades-hijos" placeholder="Ej: 5, 8, 12, 28" required>' +
                '<small class="field-help">Separa las edades con comas. Menores de 25 años tienen precio especial en OMINT</small>' +
                '<div class="error-message" id="error-edades-hijos"></div>' +
                '</div>' +
                '</div>' +
                '</div>';
            break;
    }

    // Agregar sección de descuento especial (común para todas las opciones)
    sections += '<div class="form-section-group">' +
        '<div class="section-title">' +
        '<i class="fas fa-percent"></i> Descuento Especial (Opcional)' +
        '</div>' +
        '<div class="form-row">' +
        '<div class="form-group">' +
        '<label>' +
        '<input type="checkbox" id="aplicar-descuento" name="aplicar-descuento" class="form-check-input">' +
        '<span class="form-check-label">Aplicar descuento especial</span>' +
        '</label>' +
        '</div>' +
        '</div>' +
        '<div class="form-row" id="descuento-row" style="display:none;">' +
        '<div class="form-group">' +
        '<label for="porcentaje-descuento">Porcentaje de descuento (%)</label>' +
        '<input type="number" id="porcentaje-descuento" name="porcentaje-descuento" min="1" max="99" step="0.1" placeholder="Ej: 15">' +
        '<small class="field-help">Ingresa un porcentaje entre 1% y 99%</small>' +
        '<div class="error-message" id="error-porcentaje-descuento"></div>' +
        '</div>' +
        '</div>' +
        '</div>';
    
    // Agregar sección de descuento Plan Joven (solo OSPADEP SALUD)
    sections += '<div class="form-section-group">' +
        '<div class="section-title">' +
        '<i class="fas fa-gift"></i> Descuento Plan Joven - OSPADEP SALUD' +
        '</div>' +
        '<div class="form-row">' +
        '<div class="form-group">' +
        '<label>' +
        '<input type="checkbox" id="aplicar-descuento-35" name="aplicar-descuento-35" class="form-check-input">' +
        '<span class="form-check-label">Aplicar descuento Plan Joven (25%)</span>' +
        '</label>' +
        '<small class="field-help" style="display: block; margin-top: 8px; color: #64748b;">' +
        '⚠️ Este descuento solo aplica a planes de OSPADEP SALUD cuando el titular o cónyuge tiene menos de 35 años' +
        '</small>' +
        '</div>' +
        '</div>' +
        '</div>';

    // Después de generar los campos, configurar validaciones y lógica de toggles
    setTimeout(() => {
        setupFieldValidations();
        // Lógica de toggles excluyentes para titular
        const sueldoTitular = document.getElementById('sueldo-titular');
        const aporteTitular = document.getElementById('aporte-titular');
        const radiosTitular = document.getElementsByName('aporte-titular-toggle');
        radiosTitular.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'sueldo') {
                    sueldoTitular.style.display = 'block';
                    aporteTitular.style.display = 'none';
                    aporteTitular.value = '';
                } else if (this.value === 'aporte') {
                    aporteTitular.style.display = 'block';
                    sueldoTitular.style.display = 'none';
                    sueldoTitular.value = '';
                }
            });
        });

        // Lógica de toggles excluyentes para pareja (si existe)
        const sueldoPareja = document.getElementById('sueldo-pareja');
        const aportePareja = document.getElementById('aporte-pareja');
        const radiosPareja = document.getElementsByName('aporte-pareja-toggle');
        if (radiosPareja && radiosPareja.length) {
            radiosPareja.forEach(radio => {
                radio.addEventListener('change', function() {
                    if (this.value === 'sueldo') {
                        sueldoPareja.style.display = 'block';
                        aportePareja.style.display = 'none';
                        aportePareja.value = '';
                    } else if (this.value === 'aporte') {
                        aportePareja.style.display = 'block';
                        sueldoPareja.style.display = 'none';
                        sueldoPareja.value = '';
                    }
                });
            });
        }

        // Lógica para mostrar/ocultar el campo de descuento especial
        const checkboxDescuento = document.getElementById('aplicar-descuento');
        const descuentoRow = document.getElementById('descuento-row');
        const porcentajeInput = document.getElementById('porcentaje-descuento');
        
        if (checkboxDescuento && descuentoRow && porcentajeInput) {
            checkboxDescuento.addEventListener('change', function() {
                if (this.checked) {
                    descuentoRow.style.display = 'block';
                    porcentajeInput.focus();
                } else {
                    descuentoRow.style.display = 'none';
                    porcentajeInput.value = '';
                }
            });
        }
        
        // Lógica para el descuento de menores de 35 años
        const checkboxDescuento35 = document.getElementById('aplicar-descuento-35');
        const edadTitularInput = document.getElementById('edad-titular');
        const edadParejaInput = document.getElementById('edad-pareja');
        
        // Función para verificar si aplica el descuento
        function verificarDescuento35() {
            if (!checkboxDescuento35) return;
            
            const edadTitular = parseInt(edadTitularInput?.value) || 0;
            const edadPareja = parseInt(edadParejaInput?.value) || 0;
            
            // Verificar si al menos uno es menor de 35 años
            const aplicaDescuento = (edadTitular > 0 && edadTitular < 35) || (edadPareja > 0 && edadPareja < 35);
            
            if (aplicaDescuento) {
                checkboxDescuento35.disabled = false;
                checkboxDescuento35.parentElement.style.opacity = '1';
                checkboxDescuento35.parentElement.style.cursor = 'pointer';
            } else {
                checkboxDescuento35.disabled = true;
                checkboxDescuento35.checked = false;
                checkboxDescuento35.parentElement.style.opacity = '0.5';
                checkboxDescuento35.parentElement.style.cursor = 'not-allowed';
            }
        }
        
        // Escuchar cambios en las edades
        if (edadTitularInput) {
            edadTitularInput.addEventListener('input', verificarDescuento35);
            edadTitularInput.addEventListener('change', verificarDescuento35);
        }
        if (edadParejaInput) {
            edadParejaInput.addEventListener('input', verificarDescuento35);
            edadParejaInput.addEventListener('change', verificarDescuento35);
        }
        
        // Verificar al cargar
        verificarDescuento35();
    }, 0);

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
                errorMessage = 'Las edades deben ser números entre 0 y 35 años, separados por comas';
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

        case 'porcentaje-descuento':
            if (value) {
                const porcentaje = parseFloat(value);
                if (isNaN(porcentaje) || porcentaje < 1 || porcentaje > 99) {
                    isValid = false;
                    errorMessage = 'El porcentaje debe estar entre 1 y 99';
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
    
    // ===== NUEVO: Análisis de composición familiar =====
    formData.composicionFamiliar = analizarComposicionFamiliar(formData);
    
    console.log('💰 Datos del formulario procesados:', {
        option: selectedOption,
        composicion: formData.composicionFamiliar,
        edadTitular: formData['edad-titular'],
        tienePareja: formData.composicionFamiliar.tienePareja,
        menores: formData.composicionFamiliar.menores,
        descuentoEspecial: formData['aplicar-descuento'],
        descuento35: formData['aplicar-descuento-35']
    });
    
    // Mostrar indicador de carga
    const submitButton = form.querySelector('.continue-button');
    if (submitButton) {
        submitButton.classList.add('loading');
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculando cotización...';
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
    
    // ===== NUEVO: Generar planes de TODOS los prestadores con sistema unificado =====
    const planesCalculados = [];
    const composicionFamiliar = formData.composicionFamiliar;
    const edadTitular = parseInt(formData['edad-titular']);
    const edadPareja = formData['edad-pareja'] ? parseInt(formData['edad-pareja']) : null;
    
    console.log('🏥 Generando cotización multi-prestador:', {
        edadTitular,
        edadPareja,
        composicion: composicionFamiliar,
        prestadoresDisponibles: Object.keys(prestadoresData)
    });
    
    // Iterar por TODOS los prestadores y sus planes
    Object.keys(prestadoresData).forEach(prestadorKey => {
        const prestador = prestadoresData[prestadorKey];
        
        console.log(`📋 Procesando prestador: ${prestador.name} (${prestador.tipoEstructura || 'estructura_compleja'})`);
        
        Object.keys(prestador.planes).forEach(planKey => {
            const plan = prestador.planes[planKey];
            
            try {
                // Usar sistema unificado de cálculo
                const precioFinal = calcularPrecioUnificado(prestadorKey, plan, composicionFamiliar, edadTitular, edadPareja);
                const desglose = generarDesgloseUnificado(prestadorKey, plan, composicionFamiliar, edadTitular, edadPareja);
                
                // Determinar información de grupo etario según el prestador
                let grupoEtarioInfo;
                if (prestador.tipoEstructura === "plantilla_adultos_solo" || 
                    prestador.tipoEstructura === "plantilla_sin_descuentos" || 
                    prestador.tipoEstructura === "plantilla_porcentual") {
                    grupoEtarioInfo = `Titular: ${determinarGrupoEtarioSwiss(edadTitular)}`;
                } else if (prestador.tipoEstructura === "plantilla_adultos_simple") {
                    grupoEtarioInfo = `Titular: ${determinarGrupoEtarioActiva(edadTitular, plan)}`;
                } else if (prestador.tipoEstructura === "estructura_matrimonio_hijos") {
                    grupoEtarioInfo = `Titular: ${determinarGrupoEtarioMedife(edadTitular)}`;
                } else {
                    grupoEtarioInfo = `Titular: ${determinarGrupoEtario(edadTitular)} años`;
                }
                
                // Crear plan calculado
                const planCalculado = {
                    name: `${plan.name}`,
                    price: precioFinal,
                    ageRange: grupoEtarioInfo,
                    features: plan.features,
                    recommended: plan.recommended,
                    prestador: prestador.name,
                    composicion: composicionFamiliar,
                    desglose: desglose,
                    // NUEVO: incluir los campos de descuento de aportes, especial y 35 años
                    _precioBase: plan._precioBase,
                    _totalAportes: plan._totalAportes,
                    _descuentoEspecial: plan._descuentoEspecial,
                    _descuento35: plan._descuento35,
                    _porcentajeDescuento: plan._porcentajeDescuento,
                    _precioFinal: plan._precioFinal,
                    // Información adicional para el desglose
                    planDetails: {
                        prestadorKey: prestadorKey,
                        planKey: planKey,
                        composicionResumen: composicionFamiliar.resumen,
                        tipoEstructura: prestador.tipoEstructura || 'estructura_compleja'
                    }
                };
                
                if (prestador.name === 'SWISS MEDICAL' || prestador.name === 'SW NUBIAL' || prestador.name === 'SWISS') {
                    planCalculado.prestador = 'Swiss Medical';
                } else {
                    planCalculado.prestador = prestador.name;
                }
                
                planesCalculados.push(planCalculado);
                
                console.log(`✅ ${prestador.name} - ${plan.name} calculado:`, {
                    precioFinal,
                    tipoEstructura: prestador.tipoEstructura || 'estructura_compleja',
                    itemsDesglose: desglose.items.length
                });
                
            } catch (error) {
                console.error(`❌ Error calculando ${prestador.name} - ${plan.name}:`, error);
            }
        });
    });
    
    // ===== NUEVA LÓGICA: Analizar precios para determinar badges inteligentes =====
    if (planesCalculados.length > 0) {
        const preciosOrdenados = planesCalculados.map(p => p.price).sort((a, b) => a - b);
        const precioMinimo = preciosOrdenados[0];
        
        // Mejor precio: el más económico
        const planMasEconomico = planesCalculados.find(p => p.price === precioMinimo);
        if (planMasEconomico) {
            planMasEconomico.isBestPrice = true;
            console.log('🏆 Plan más económico:', planMasEconomico.prestador, planMasEconomico.name, '$' + planMasEconomico.price.toLocaleString());
        }
        
        // Mejor valor: buen precio + prestador reconocido o segundo más económico
        if (planesCalculados.length > 1) {
            // Buscar OMINT o Swiss Medical en el tercio inferior de precios
            const tercioInferior = preciosOrdenados.slice(0, Math.ceil(preciosOrdenados.length / 3));
            const planMejorValor = planesCalculados.find(p => 
                tercioInferior.includes(p.price) && 
                (p.prestador === 'OMINT' || p.prestador === 'Swiss Medical') &&
                !p.isBestPrice
            );
            
            if (planMejorValor) {
                planMejorValor.isBestValue = true;
                console.log('💎 Mejor valor (prestador reconocido económico):', planMejorValor.prestador, planMejorValor.name, '$' + planMejorValor.price.toLocaleString());
            } else {
                // Si no hay prestadores reconocidos económicos, marcar el segundo más barato
                const segundoMasEconomico = planesCalculados.find(p => 
                    p.price === preciosOrdenados[1] && !p.isBestPrice
                );
                if (segundoMasEconomico) {
                    segundoMasEconomico.isBestValue = true;
                    console.log('💎 Mejor valor (segundo más económico):', segundoMasEconomico.prestador, segundoMasEconomico.name, '$' + segundoMasEconomico.price.toLocaleString());
                }
            }
        }
    }

    // Ordenar planes: recomendados primero, luego mejor precio, luego mejor valor, luego por precio
    planesCalculados.sort((a, b) => {
        // Primero recomendados
        if (a.recommended && !b.recommended) return -1;
        if (!a.recommended && b.recommended) return 1;
        
        // Segundo mejor precio
        if (a.isBestPrice && !b.isBestPrice) return -1;
        if (!a.isBestPrice && b.isBestPrice) return 1;
        
        // Tercero mejor valor
        if (a.isBestValue && !b.isBestValue) return -1;
        if (!a.isBestValue && b.isBestValue) return 1;
        
        // Finalmente por precio
        return a.price - b.price;
    });
    
    console.log('📋 Planes multi-prestador calculados para mostrar:', {
        totalPlanes: planesCalculados.length,
        composicion: composicionFamiliar.resumen,
        prestadoresProcesados: [...new Set(planesCalculados.map(p => p.prestador))],
        planesConPrecios: planesCalculados.map(p => ({
            prestador: p.prestador,
            name: p.name,
            precioFinal: p.price,
            tipoEstructura: p.planDetails.tipoEstructura,
            itemsDesglose: p.desglose.items.length
        }))
    });
    
    if (planesCalculados.length === 0) {
        plansGrid.innerHTML = '<div class="no-plans-message">' +
            '<h3>⚠️ No se pudieron generar cotizaciones</h3>' +
            '<p>Por favor, verifica los datos ingresados y vuelve a intentar.</p>' +
            '</div>';
        return;
    }
    
    // Generar HTML de los planes
    plansGrid.innerHTML = planesCalculados.map(plan => generatePlanCard(plan)).join('');
    
    // Almacenar planes para filtro
    window.planesCalculados = planesCalculados;
    
    // Crear e inicializar el filtro de prestadores
    createPrestadorFilter(planesCalculados);
    initializePrestadorFilter();
    
    // Delegación de eventos para compartir y PDF de la card
    (function(){
        document.addEventListener('click', function(e) {
            // Compartir
            if (e.target.closest('.share-plan-btn')) {
                const btn = e.target.closest('.share-plan-btn');
                const card = btn.closest('.plan-card');
                if (!card) return;
                const planName = card.querySelector('.plan-name')?.textContent || '';
                const prestador = card.getAttribute('data-prestador') || '';
                const url = window.location.href;
                const text = `Mirá este plan de ${prestador}: ${planName} en OSPADEP`;
                if (navigator.share) {
                    navigator.share({
                        title: `Plan ${planName} - OSPADEP`,
                        text,
                        url
                    });
                } else {
                    navigator.clipboard.writeText(`${text}\n${url}`);
                    alert('Enlace copiado al portapapeles. ¡Listo para compartir!');
                }
                e.preventDefault();
                return;
            }
            // PDF
            if (e.target.closest('.pdf-plan-btn')) {
                const btn = e.target.closest('.pdf-plan-btn');
                const card = btn.closest('.plan-card');
                if (!card) return;
                const cardClone = card.cloneNode(true);
                // Quitar acciones
                const actions = cardClone.querySelector('.plan-card-actions');
                if (actions) actions.remove();
                // Quitar desglose de precio
                const desglose = cardClone.querySelector('.price-breakdown');
                if (desglose) desglose.remove();
                // Quitar badges antiguos
                const oldBadges = cardClone.querySelectorAll('.recommended-badge, .best-price-badge, .best-value-badge');
                oldBadges.forEach(b => b.remove());
                // Si es recomendado, agregar badge especial en esquina superior derecha
                if (card.classList.contains('recommended')) {
                    const badge = document.createElement('div');
                    badge.textContent = 'Recomendado';
                    badge.className = 'pdf-recommended-badge';
                    cardClone.appendChild(badge);
                }
                // Logo OSPADEP grande
                const logoURL = 'https://raw.githubusercontent.com/dantemoss/CotizadorWebOSPADEP-assets/main/logoOSPADEP16.9.jpg';
                const customStyle = `
                    <style>
                        body { background: #fff !important; margin: 0; padding: 0; }
                        .pdf-container { max-width: 480px; margin: 40px auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(44,62,80,0.10); padding: 32px 28px; font-family: 'DM Sans', Arial, sans-serif; position: relative; border: 2.5px solid #2563eb !important; }
                        .pdf-logo { display: block; margin: 0 auto 18px auto; max-width: 260px; }
                        .grupo-familiar-pdf { text-align: center; color: #2563eb; font-size: 1.15rem; font-weight: 600; margin-bottom: 18px; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
                        .plan-card { border: none !important; box-shadow: none !important; background: #fff; }
                        .plan-name { font-size: 2rem; color: #2563eb; margin-bottom: 18px; text-align: center; }
                        .plan-price { font-size: 1.5rem; color: #059669; text-align: center; margin-bottom: 18px; }
                        .provider-logo img { display: block; margin: 0 auto 18px auto; max-width: 100px; }
                        .plan-features { margin: 18px 0 0 0; padding: 0 0 0 18px; }
                        .plan-features li { margin-bottom: 6px; font-size: 1.05em; }
                        .pdf-recommended-badge { position: absolute; top: 24px; right: 24px; background: #fff; color: #2563eb; border: 2px solid #2563eb; border-radius: 18px; padding: 7px 22px; font-size: 1rem; font-weight: 700; box-shadow: 0 2px 8px rgba(44,62,80,0.08); z-index: 10; }
                    </style>
                `;
                const logoHTML = `<img src="${logoURL}" class="pdf-logo" alt="Logo OSPADEP" />`;
                const grupoHTML = `<div class='grupo-familiar-pdf'>Cotizacion Para plan de salud</div>`;
                const win = window.open('', '', 'width=800,height=900');
                win.document.write(`<!DOCTYPE html><html><head><title>Plan ${cardClone.querySelector('.plan-name')?.textContent || ''} - OSPADEP</title><link href='https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap' rel='stylesheet'>${customStyle}</head><body><div class='pdf-container'>${logoHTML}${grupoHTML}${cardClone.outerHTML}</div><script>setTimeout(()=>{window.print();},500);<\/script></body></html>`);
                win.document.close();
                e.preventDefault();
                return;
            }
        });
    })();
}

function generatePlanCard(plan) {
    const recommendedClass = plan.recommended ? 'recommended' : '';
    const features = plan.features.map(feature => '<li>' + feature + '</li>').join('');
    
    // ===== NUEVO: Determinar logo y color del prestador =====
    let prestadorColor = '#718096'; // Color por defecto
    let prestadorLogo = '';
    
    if (plan.prestador === 'OMINT') {
        prestadorColor = '#3182ce'; // Azul
        prestadorLogo = 'logosEmpresas/omint.png';
    } else if (plan.prestador === 'Swiss Medical') {
        prestadorColor = '#d53f8c'; // Rosa/fucsia
        prestadorLogo = 'logosEmpresas/swissmedical.png';
    } else if (plan.prestador === 'ACTIVA SALUD') {
        prestadorColor = '#059669'; // Verde
        prestadorLogo = 'logosEmpresas/activasalud.png';
    } else if (plan.prestador === 'MEDIFE') {
        prestadorColor = '#dc2626'; // Rojo
        prestadorLogo = 'logosEmpresas/medife.png';
    } else if (plan.prestador === 'OSPADEP SALUD') {
        prestadorColor = '#1e40af'; // Azul oscuro
        prestadorLogo = 'logosEmpresas/OSPADEPSalud.png';
    }
    
    // ===== NUEVO: Generar desglose de precio mejorado =====
    let desgloseHTML = '';
    if (plan.desglose && plan.desglose.items) {
        desgloseHTML = '<div class="price-breakdown">' +
            '<div class="breakdown-title">' +
            '<i class="fas fa-calculator"></i> Desglose del precio' +
            '</div>' +
            '<div class="breakdown-items">';
        
        plan.desglose.items.forEach(item => {
            const porcentajeInfo = item.porcentaje ? ` (${item.porcentaje})` : '';
            const precioFormateado = formatCurrency(item.subtotal);
            desgloseHTML += '<div class="breakdown-item">' +
                '<span class="breakdown-concept">' + item.concepto + porcentajeInfo + '</span>' +
                '<span class="breakdown-amount">' + precioFormateado + '</span>' +
                '</div>';
        });
        
        // Mostrar descuentos en el orden correcto: 1) Descuento especial, 2) Plan Joven, 3) Aportes
        const tieneDescuentos = (plan._descuentoEspecial && plan._descuentoEspecial > 0) || 
                                (plan._descuento35 && plan._descuento35 > 0) || 
                                (plan._totalAportes && plan._totalAportes > 0);
        
        if (tieneDescuentos && plan._precioBase) {
            // Mostrar subtotal sin descuentos
            desgloseHTML += '<div class="breakdown-item">' +
                '<span class="breakdown-concept" style="color:#888;">Subtotal sin descuento</span>' +
                '<span class="breakdown-amount" style="text-decoration:line-through;color:#888;">' + formatCurrency(plan._precioBase) + '</span>' +
                '</div>';
        }
        
        // 1. PRIMERO: Descuento especial (se aplica al precio base)
        if (plan._descuentoEspecial && plan._descuentoEspecial > 0) {
            desgloseHTML += '<div class="breakdown-item">' +
                '<span class="breakdown-concept" style="color:#a21caf;">Descuento especial (' + plan._porcentajeDescuento + '%)</span>' +
                '<span class="breakdown-amount" style="color:#a21caf;">- ' + formatCurrency(plan._descuentoEspecial) + '</span>' +
                '</div>';
        }
        
        // 1.5. Descuento Plan Joven (solo OSPADEP SALUD)
        console.log('📊 Verificando descuento Plan Joven en desglose:', {
            planName: plan.name,
            prestador: plan.prestador,
            descuento35: plan._descuento35,
            tiene: plan._descuento35 && plan._descuento35 > 0
        });
        
        if (plan._descuento35 && plan._descuento35 > 0) {
            console.log('✅ Mostrando descuento Plan Joven en desglose:', plan._descuento35);
            desgloseHTML += '<div class="breakdown-item" style="background:#eff6ff;padding:8px;border-radius:6px;">' +
                '<span class="breakdown-concept" style="color:#1053F3;font-weight:600;">🎁 Descuento Plan Joven (25%)</span>' +
                '<span class="breakdown-amount" style="color:#1053F3;font-weight:600;">- ' + formatCurrency(plan._descuento35) + '</span>' +
                '</div>';
        }
        
        // 3. FINALMENTE: Aportes descontados (se aplican después de descuento especial y Plan Joven)
        if (plan._totalAportes && plan._totalAportes > 0) {
            desgloseHTML += '<div class="breakdown-item">' +
                '<span class="breakdown-concept" style="color:#059669;">Aportes descontados</span>' +
                '<span class="breakdown-amount" style="color:#059669;">- ' + formatCurrency(plan._totalAportes) + '</span>' +
                '</div>';
        }
        desgloseHTML += '</div>' +
            '<div class="breakdown-total">' +
            '<span class="breakdown-concept"><strong>Total mensual</strong></span>' +
            `<span class="breakdown-amount" style="color:${plan._totalAportes && plan._totalAportes > 0 ? '#16a34a' : '#222'};font-weight:700;">` + formatCurrency(plan._precioFinal || plan.desglose.total) + '</span>' +
            '</div>' +
            '</div>';
    }
    
    // ===== BADGES ÚNICAMENTE IMPORTANTES =====
    let badgesHTML = '';
    
    // Solo badges que realmente aportan valor
    if (plan.isBestPrice) {
        badgesHTML += '<div class="best-price-badge"><i class="fas fa-dollar-sign"></i> Mejor Precio</div>';
    }
    
    if (plan.isBestValue) {
        badgesHTML += '<div class="best-value-badge"><i class="fas fa-trophy"></i> Mejor Valor</div>';
    }
    
    if (plan.recommended) {
        badgesHTML += '<div class="recommended-badge"><i class="fas fa-star"></i> Recomendado</div>';
    }
    
    // ===== NUEVO: Visualización de precio con descuento de aportes =====
    let priceHTML = '';
    if (plan._totalAportes && plan._totalAportes > 0 && plan._precioBase) {
        priceHTML = `<div class="plan-price">
            <span class="original-price" style="text-decoration:line-through;color:#888;font-size:18px;">${formatCurrency(plan._precioBase)}</span><br>
            <span class="discounted-price" style="color:#16a34a;font-size:32px;font-weight:700;">${formatCurrency(plan._precioFinal)}</span>
            <div class="price-period">por mes</div>
            <div class="aporte-descuento" style="color:#059669;font-size:13px;">Aportes descontados: -${formatCurrency(plan._totalAportes)}</div>
        </div>`;
    } else {
        priceHTML = `<div class="plan-price">
            <span class="currency">$</span>${plan.price.toLocaleString()}
            <div class="price-period">por mes</div>
        </div>`;
    }
    return '<div class="plan-card ' + recommendedClass + '" data-plan-name="' + plan.name + '" data-prestador="' + (plan.prestador || '') + '">' +
        badgesHTML +
        '<div class="plan-header">' +
            '<div class="provider-section">' +
                '<div class="provider-logo">' +
                    '<img src="' + prestadorLogo + '" alt="' + plan.prestador + '" class="prestador-logo" />' +
                '</div>' +
                '<div class="provider-info">' +
                    '<span class="provider-name">' + (plan.prestador || '') + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="plan-name">' + plan.name + '</div>' +
        '</div>' +
        priceHTML +
        desgloseHTML +
        '<ul class="plan-features">' + features + '</ul>' +
        '<div class="plan-card-actions" style="display:flex;gap:8px;">' +
        '<button class="select-plan-btn"><i class="fas fa-plus-circle"></i> Seleccionar Plan</button>' +
        '</div>' +
        '</div>';
}

// ===== FUNCIONES DE FILTRO POR PRESTADOR =====

function createPrestadorFilter(planesCalculados) {
    const filterContainer = document.getElementById('prestador-filter-bar');
    if (!filterContainer) return;
    
    // Obtener prestadores únicos
    const prestadores = [...new Set(planesCalculados.map(plan => plan.prestador))];
    
    // Crear checkboxes del filtro (desmarcados por defecto)
    let checkboxesHTML = '';
    
    prestadores.forEach(prestador => {
        checkboxesHTML += `
            <label class="filter-checkbox-modern">
                <input type="checkbox" onchange="filterByPrestadores()" data-prestador="${prestador}">
                <span class="checkbox-label-modern">${prestador}</span>
            </label>
        `;
    });
    
    filterContainer.innerHTML = `
        <div class="filter-header-modern">
            <span class="filter-label-modern">
                <i class="fas fa-filter"></i>
                Filtrar por prestador
            </span>
        </div>
        <div class="filter-checkboxes-modern">
            ${checkboxesHTML}
        </div>
    `;
}

function initializePrestadorFilter() {
    // Los checkboxes ya tienen el evento onchange, no necesitamos inicialización adicional
}

function filterByPrestadores() {
    const checkboxes = document.querySelectorAll('input[data-prestador]');
    const prestadoresSeleccionados = [];
    
    // Obtener prestadores seleccionados
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            prestadoresSeleccionados.push(checkbox.getAttribute('data-prestador'));
        }
    });
    
    // Filtrar planes
    const planCards = document.querySelectorAll('.plan-card');
    
    // Si no hay prestadores seleccionados, mostrar todos los planes
    if (prestadoresSeleccionados.length === 0) {
        planCards.forEach(card => {
            card.style.display = 'block';
        });
    } else {
        // Si hay prestadores seleccionados, filtrar
        planCards.forEach(card => {
            const prestadorCard = card.getAttribute('data-prestador');
            
            if (prestadoresSeleccionados.includes(prestadorCard)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}





function selectPlan(plan) {
    // Antes: alert('¡Excelente elección! Has seleccionado el ' + plan.name + '.\n\nUn miembro de nuestro equipo de ventas se contactará contigo en las próximas horas para finalizar la afiliación.\n\n¡Gracias por elegir OSPADEP!');
    // Ahora: no hacer nada (la selección se maneja con la barra lateral)
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
        if (isNaN(age) || age === '' || parseInt(age) < 0 || parseInt(age) > 35) {
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

// ===== SELECCIÓN MÚLTIPLE Y SIDEBAR DE PLANES SELECCIONADOS =====

// Definir selectedPlans como variable global
window.selectedPlans = [];

// Renderizar la barra lateral de planes seleccionados
function renderSelectedPlansSidebar() {
    // Remover sidebar existente
    const existingSidebar = document.querySelector('.selected-plans-sidebar');
    if (existingSidebar) {
        existingSidebar.remove();
    }
    
    // Si no hay planes seleccionados, ocultar la barra
    if (window.selectedPlans.length === 0) {
        return;
    }
    
    // Crear nueva sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'selected-plans-sidebar';
    
    // Construir el contenido de la barra lateral
    let html = '<div class="sidebar-header">' +
        '<i class="fas fa-list-ul sidebar-menu-btn" title="Cerrar barra" style="cursor:pointer;" onclick="closeSelectedPlansSidebar()"></i> Planes seleccionados' +
        '<button class="close-sidebar-btn" title="Cerrar" onclick="closeSelectedPlansSidebar()"><i class="fas fa-times"></i></button>' +
        '</div>' +
        '<div class="sidebar-plans-list">';
    
    // Agregar cada plan seleccionado
    window.selectedPlans.forEach((plan, idx) => {
        // Obtener el precio correcto
        const precio = plan.precioFinal || plan.price || plan._precioFinal || 0;
        const precioFormateado = typeof precio === 'number' ? 
            precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) : 
            '$' + precio.toString();
            
        html += `
            <div class="sidebar-plan-item">
                <div class="sidebar-plan-header">
                    <span class="sidebar-plan-name">${plan.name}</span>
                    <button class="remove-plan-btn" onclick="removePlanFromSelected(${idx})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="sidebar-plan-prestador">${plan.prestador}</div>
                <div class="sidebar-plan-price">${precioFormateado}</div>
                <div class="sidebar-plan-features">
                    ${plan.features ? plan.features.slice(0,2).map(f=>'<span>'+f+'</span>').join('') : ''}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Botones de acciones en la sidebar
    html += '<div class="sidebar-actions">';
    html += '<button class="copy-benefits-btn" style="border: 2px solid #f59e0b; background: #fff; color: #f59e0b; font-weight: 700; font-size: 1.13rem; border-radius: 10px; padding: 14px 0; width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 2px 8px 0 rgba(30,41,59,0.08); cursor: pointer; transition: all 0.2s; margin-bottom: 10px;" onmouseover="this.style.background=\'#f59e0b\'; this.style.color=\'#fff\';" onmouseout="this.style.background=\'#fff\'; this.style.color=\'#f59e0b\';" onclick="generateCompactEmailWithBenefits()"><i class="fas fa-envelope"></i> Copiar cotización mail</button>';
    html += '<button class="pdf-general-btn" style="border: 2px solid #2563eb; background: #fff; color: #2563eb; font-weight: 700; font-size: 1.13rem; border-radius: 10px; padding: 14px 0; width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 2px 8px 0 rgba(30,41,59,0.08); cursor: pointer; transition: all 0.2s; margin-bottom: 10px;" onmouseover="this.style.background=\'#2563eb\'; this.style.color=\'#fff\';" onmouseout="this.style.background=\'#fff\'; this.style.color=\'#2563eb\';" onclick="printCompactEmailWithBenefitsPDF()"><i class="fas fa-file-pdf"></i> Descargar PDF</button>';
    html += '</div>';
    
    sidebar.innerHTML = html;
    document.body.appendChild(sidebar);
    
    // Mostrar la sidebar animándola desde la derecha
    setTimeout(() => {
        sidebar.style.right = '0';
    }, 10);
}

function closeSelectedPlansSidebar() {
    const sidebar = document.querySelector('.selected-plans-sidebar');
    if (sidebar) {
        // Animar hacia fuera
        sidebar.style.right = '-420px';
        // Remover después de la animación
        setTimeout(() => {
            sidebar.remove();
        }, 350);
    }
    
    // Mostrar botón flotante si hay planes seleccionados
    if (window.selectedPlans.length > 0) {
        showSidebarFloatingButton();
    }
}

function showSidebarFloatingButton() {
    if (document.getElementById('sidebar-floating-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'sidebar-floating-btn';
    btn.className = 'sidebar-floating-btn';
    btn.innerHTML = '<i class="fas fa-list-ul"></i>';
    btn.title = 'Ver planes seleccionados';
    btn.onclick = function() {
        renderSelectedPlansSidebar();
        removeSidebarFloatingButton();
    };
    document.body.appendChild(btn);
}

function removeSidebarFloatingButton() {
    const btn = document.getElementById('sidebar-floating-btn');
    if (btn) btn.remove();
}

// Agregar o quitar plan de la lista de seleccionados
function togglePlanSelection(plan) {
    // Asegurar que el plan tenga el campo 'type' necesario para el informe
    if (!plan.type && plan.prestador) {
        // Mapear el prestador al tipo requerido por la función de informe
        const prestadorMap = {
            'OMINT': 'omint',
            'Swiss Medical': 'swiss_medical',
            'ACTIVA SALUD': 'activa_salud',
            'MEDIFE': 'medife',
            'OSPADEP SALUD': 'ospadep_salud'
        };
        plan.type = prestadorMap[plan.prestador] || 'omint';
    }
    
    // Asegurar que el plan tenga el precio final
    if (!plan.precioFinal && plan.price) {
        plan.precioFinal = plan.price;
    } else if (!plan.precioFinal && plan._precioFinal) {
        plan.precioFinal = plan._precioFinal;
    }
    
    const idx = window.selectedPlans.findIndex(p => p.name === plan.name && p.prestador === plan.prestador);
    
    if (idx === -1) {
        window.selectedPlans.push(plan);
        console.log('Plan agregado:', plan);
    } else {
        window.selectedPlans.splice(idx, 1);
        console.log('Plan removido:', plan);
    }
    
    renderSelectedPlansSidebar();
    updatePlanCardsSelection();
    
    // Generar y guardar el HTML de cotización completa automáticamente
    if (window.selectedPlans.length > 0) {
        generateAndSaveCompleteQuote();
    }
}

function removePlanFromSelected(idx) {
    window.selectedPlans.splice(idx, 1);
    renderSelectedPlansSidebar();
    updatePlanCardsSelection();
}

function updatePlanCardsSelection() {
    const planCards = document.querySelectorAll('.plan-card');
    planCards.forEach(card => {
        const name = card.getAttribute('data-plan-name');
        const prestador = card.getAttribute('data-prestador');
        const isSelected = window.selectedPlans.some(p => p.name === name && p.prestador === prestador);
        
        if (isSelected) {
            card.classList.add('selected');
            // Actualizar texto del botón
            const button = card.querySelector('.select-plan-btn');
            if (button) {
                button.innerHTML = '<i class="fas fa-check-circle"></i> Plan Seleccionado';
            }
        } else {
            card.classList.remove('selected');
            // Restaurar texto del botón
            const button = card.querySelector('.select-plan-btn');
            if (button) {
                button.innerHTML = '<i class="fas fa-plus-circle"></i> Seleccionar Plan';
            }
        }
    });
}




// Función para generar el informe HTML
function generarInformeHTML(datosCliente, plan) {
    const fechaActual = new Date();
    const numeroReferencia = generateRandomRef();
    
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cotización Personalizada OSPADEP</title>
            <meta name="color-scheme" content="light">
            <meta name="supported-color-schemes" content="light">
    <style>
                @media print {
        body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    
                    @page {
                        size: A4;
                        margin: 0.8cm;
                        /* Eliminar headers y footers del navegador */
                        @top-left { content: ""; }
                        @top-center { content: ""; }
                        @top-right { content: ""; }
                        @bottom-left { content: ""; }
                        @bottom-center { content: ""; }
                        @bottom-right { content: ""; }
                    }
                    
                    /* Ocultar elementos que pueden aparecer en print */
                    .no-print {
                        display: none !important;
                    }
                    
                    /* Optimizar espaciado para evitar páginas en blanco */
                    .container {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    
                    .benefits-section {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    
                    .comparison-section {
                        page-break-before: auto;
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    
        .footer {
                        page-break-inside: avoid;
                        break-inside: avoid;
                        margin-top: 20px !important;
                        display: block !important;
                        visibility: visible !important;
                    }
                    
                    /* Reducir espaciado en print */
            .header {
                        padding: 20px !important;
                    }
                    
                    .plan-section {
                        padding: 20px !important;
                    }
                    
                    .benefits-section {
                        padding: 20px !important;
                    }
                    
                    .comparison-section {
                        padding: 20px !important;
                    }
                    
                    /* Asegurar que las tablas no se rompan */
                    .comparison-table {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    
                    /* Forzar transparencia del logo en PDF */
                    .logo-container {
                        background: transparent !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    
                    .logo-img {
                        background: transparent !important;
                        background-color: transparent !important;
                        box-shadow: none !important;
                        border: none !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        mix-blend-mode: multiply;
                        filter: none !important;
                    }
                    
                    /* Forzar estilos del nuevo header en PDF */
                    .header {
                        padding: 30px 30px 20px 30px !important;
                        margin-bottom: 0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        background: linear-gradient(135deg, #1DB9A0 0%, #00A3C8 70%, #1A408C 100%) !important;
                    }
                    
                    .header-row {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: space-between !important;
                        gap: 30px !important;
                    }
                    
                    .logo-section {
                        flex: 0 0 auto !important;
                        min-width: 200px !important;
                    }
                    
                    .title-section {
                        flex: 1 !important;
                        text-align: right !important;
                    }
                    
                    .header-title {
                        font-size: 28px !important;
                        font-weight: 700 !important;
                        margin: 0 0 4px 0 !important;
                        text-align: right !important;
                        line-height: 1.1 !important;
                    }
                    
                    .header-subtitle {
                        font-size: 15px !important;
                        font-weight: 400 !important;
                        margin: 0 !important;
                        opacity: 0.9 !important;
                        text-align: right !important;
                        line-height: 1.2 !important;
                    }
                    
                    .info-block {
                        padding: 20px 30px !important;
                        margin-bottom: 30px !important;
                        margin-top: 0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        background: linear-gradient(135deg, #00A3C8 0%, #1A408C 100%) !important;
                    }
                    
                    .header-cards {
                        display: flex !important;
                        justify-content: center !important;
                        gap: 20px !important;
                        flex-wrap: wrap !important;
}
                    
                    .info-card {
                        background: rgba(255, 255, 255, 0.15);
                        border-radius: 8px;
                        padding: 15px;
                        flex: 1;
                        min-width: 140px;
                        max-width: 180px;
                        text-align: center;
                    }
                }
                
                :root {
                    --dominant: #1DB9A0;
                    --secondary: #00A3C8;
                    --accent: #1A408C;
                    --detail: #0B3D91;
                    --bg-light: #F8FAFB;
                    --text-dark: #2E3A46;
                    --text-muted: #69707A;
                    --card-bg: #FFFFFF;
                    --border-light: #E2E8F0;
                }
                
                *, *::before, *::after {
                    box-sizing: border-box;
                }
                
                body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                    background: var(--bg-light);
                    color: var(--text-dark);
                    line-height: 1.6;
                }
                
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: var(--card-bg);
                    overflow: hidden;
                }
                
                /* Header principal */
                .header {
                    padding: 0;
                    text-align: center;
                }
                
                .header-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 30px;
                }
                
                .logo-section {
                    flex: 0 0 auto;
                    min-width: 200px;
                }
                
                .logo-container {
                    background: transparent;
                    padding: 0;
                    text-align: left;
                }
                
                .logo-img {
                    max-width: 180px;
                    max-height: 80px;
                    background: transparent !important;
                    mix-blend-mode: multiply;
                    opacity: 1;
                }
                
                .title-section {
                    flex: 1;
                    text-align: right;
                }
                
                .header-title {
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0 0 4px 0;
                    text-align: right;
                    line-height: 1.1;
                }
                
                .header-subtitle {
                    font-size: 15px;
                    font-weight: 400;
                    margin: 0;
                    opacity: 0.9;
                    text-align: right;
                    line-height: 1.2;
                }
                
                /* Bloque de información */
                .info-block {
                    background: linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%);
                    color: #fff;
                    padding: 20px 30px;
                    margin-bottom: 30px;
                    margin-top: 0;
                }
                
                .header-cards {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    flex-wrap: wrap;
                    max-width: 100%;
                }
                
                .info-card {
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 8px;
                    padding: 15px;
                    flex: 1;
                    min-width: 140px;
                    max-width: 180px;
                    text-align: center;
                }
                
                .card-icon {
                    font-size: 24px;
                    margin-bottom: 8px;
                }
                
                .card-label {
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    opacity: 0.8;
                    margin-bottom: 4px;
                    letter-spacing: 0.5px;
                }
                
                .card-value {
                    font-size: 14px;
                    font-weight: 600;
                }
                
                /* Plan seleccionado */
                .plan-section {
                    background: linear-gradient(135deg, var(--dominant), var(--secondary));
                    color: white;
                    padding: 30px;
                    display: table;
                    width: 100%;
                }
                
                .plan-row {
                    display: table-row;
                }
                
                .plan-info {
                    display: table-cell;
                    vertical-align: middle;
                    width: 60%;
                    padding-right: 30px;
                }
                
                .plan-name {
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                }
                
                .plan-prestador {
                    font-size: 18px;
                    opacity: 0.9;
                    margin: 0;
                }
                
                .plan-price {
                    display: table-cell;
                    vertical-align: middle;
                    text-align: right;
                    width: 40%;
                }
                
                .price-amount {
                    font-size: 36px;
                    font-weight: 700;
                    line-height: 1;
                    display: block;
                }
                
                .price-period {
                    font-size: 14px;
                    opacity: 0.9;
                    margin-top: 5px;
                }
                
                /* Beneficios */
                .benefits-section {
                    padding: 30px;
                }
                
                .section-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: var(--accent);
                    margin: 0 0 20px 0;
                    text-align: center;
                }
                
                .benefits-grid {
                    display: table;
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 15px;
                }
                
                .benefits-row {
                    display: table-row;
                }
                
                .benefit-card {
                    display: table-cell;
                    background: #f8fafc;
                    border: 1px solid var(--border-light);
                    border-radius: 8px;
                    padding: 20px;
                    width: 50%;
                    vertical-align: top;
                }
                
                .benefit-icon {
                    background: var(--dominant);
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    display: inline-block;
                    text-align: center;
                    line-height: 40px;
                    font-size: 18px;
                    margin-bottom: 10px;
                }
                
                .benefit-title {
                    color: var(--accent);
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0 0 8px 0;
                }
                
                .benefit-description {
                    color: var(--text-muted);
                    font-size: 14px;
                    line-height: 1.4;
                    margin: 0;
                }
                
                /* Tabla comparativa */
                .comparison-section {
                    padding: 30px;
                    background: #f8fafc;
                }
                
                .comparison-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(27, 185, 160, 0.08);
                }
                
                .comparison-table th {
                    background: var(--accent);
                    color: white;
                    padding: 15px;
                    text-align: left;
                    font-weight: 600;
                }
                
                .comparison-table td {
                    padding: 12px 15px;
                    border-bottom: 1px solid var(--border-light);
                    vertical-align: top;
                }
                
                .comparison-table tr:last-child td {
                    border-bottom: none;
                }
                
                .comparison-check {
                    color: var(--dominant);
                    font-weight: bold;
                }
                
                /* Footer */
                    .footer {
                    background: var(--detail);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                
                .footer p {
                    margin: 0 0 10px 0;
                    line-height: 1.5;
                }
                
                .footer strong {
                    color: var(--dominant);
                }
                
                /* Responsivo para email */
                @media screen and (max-width: 600px) {
                    .header, .plan-section {
                        display: block !important;
                    }
                    
                    .logo-cell, .header-content, .plan-info, .plan-price {
                        display: block !important;
                        width: 100% !important;
                        padding: 0 !important;
                        text-align: center !important;
                        margin-bottom: 15px;
                    }
                    
                    .benefits-grid {
                        display: block !important;
                    }
                    
                    .benefit-card {
                        display: block !important;
                        width: 100% !important;
                        margin-bottom: 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="main-container">
                <div class="container">
                    <!-- Header principal -->
                    <div class="header">
                        <div class="header-row">
                            <div class="logo-section">
                                <div class="logo-container">
                            <img src="https://raw.githubusercontent.com/dantemoss/CotizadorWebOSPADEP-assets/main/logoOSPADEP16.9.jpg" alt="OSPADEP" style="width:100%; height:auto; display:block; border-radius: 12px 12px 0 0;" onerror="this.style.display='none';var alt=document.createElement('div');alt.style.color='#1e40af';alt.style.fontWeight='bold';alt.style.fontSize='22px';alt.style.margin='10px auto';alt.style.textAlign='center';alt.innerText='OSPADEP';this.parentNode.appendChild(alt);">
                        </div>
                            </div>
                            
                            <div class="title-section">
                                <h1 class="header-title">Cotización OSP-${numeroReferencia}</h1>
                            <div class="header-subtitle">
                                ${formatDate(fechaActual)} | Vigencia: 72 hs hábiles
                            </div>
                                </div>
                            </div>
                            </div>
                
                    <!-- Bloque de información -->
                    <div class="info-block">
                        <div class="header-cards">
                            <div class="info-card">
                                <div class="card-icon">👤</div>
                                <div class="card-label">BENEFICIARIO</div>
                                <div class="card-value">${getTipoPlanLabel(datosCliente.tipoCobertura)}</div>
                        </div>
                            <div class="info-card">
                                <div class="card-icon">🎂</div>
                                <div class="card-label">EDAD</div>
                                <div class="card-value">${datosCliente.edadTitular || '25'} años</div>
                    </div>
                            <div class="info-card">
                                <div class="card-icon">➕</div>
                                <div class="card-label">AFILIACIÓN</div>
                                <div class="card-value">Adherente</div>
                            </div>
                            <div class="info-card">
                                <div class="card-icon">🏢</div>
                                <div class="card-label">COBERTURA</div>
                                <div class="card-value">CABA y GBA</div>
                            </div>
                        </div>
                    </div>

                    <!-- Plan seleccionado -->
                    <div class="plan-section">
                        <div class="plan-row">
                            <div class="plan-info">
                                <h2 class="plan-name">${plan.name}</h2>
                            </div>
                            <div class="plan-price">
                                <span class="price-amount">$${(plan.precioFinal || plan.price || 0).toLocaleString('es-AR')}</span>
                                <div class="price-period">por mes</div>
                            </div>
                        </div>
                    </div>

                    <!-- Beneficios -->
                    <div class="benefits-section">
                        <h2 class="section-title">Beneficios Incluidos</h2>
                        <div class="benefits-grid">
                            ${generateBenefitsHTMLForEmail(plan)}
                        </div>
                    </div>

                    <!-- Tabla comparativa -->
                    <div class="comparison-section">
                        <h2 class="section-title">Comparación de Características</h2>
                        <table class="comparison-table">
                            <thead>
                                <tr>
                                    <th>Características</th>
                                    <th>${plan.name}</th>
                                    <th>Otros Planes</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${generateComparisonTableHTML(plan)}
                            </tbody>
                        </table>
                    </div>

                    </div>
                    
                    <!-- Footer compacto -->
                    <div class="footer">
                        <p><strong>Cotización válida por 30 días.</strong> Contáctenos: 📞 <strong>0800-345-6732</strong> | 📧 <strong>comercial@ospadep.com</strong> | 📱 <strong>www.ospadep.com</strong></p>
                        <p><em>Obra Social del Personal de Aeronavegación de Entes Privados</em></p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// ... existing code ...

function generateBenefitsHTML(plan) {
    // Beneficios específicos según el prestador
    const benefitsByProvider = {
        'omint': [
            {
                icon: 'hospital',
                title: 'Red OMINT Exclusiva',
                description: 'Acceso a la red de sanatorios y centros médicos propios de OMINT, con tecnología de última generación.'
            },
            {
                icon: 'mobile-alt',
                title: 'OMINT App',
                description: 'Gestiona tu plan desde la app: turnos online, credencial digital y cartilla médica actualizada.'
            },
            {
                icon: 'user-md',
                title: 'Médicos de Prestigio',
                description: 'Atención con profesionales de reconocida trayectoria en todas las especialidades.'
            },
            {
                icon: 'globe',
                title: 'Cobertura Internacional',
                description: 'Asistencia médica en el exterior y convenios con prestadores internacionales.'
            }
        ],
        'swiss_medical': [
            {
                icon: 'hospital',
                title: 'Red Swiss Medical',
                description: 'Acceso a Clínica y Maternidad Suizo Argentina y toda la red Swiss Medical Group.'
            },
            {
                icon: 'heartbeat',
                title: 'Programas Preventivos',
                description: 'Plan Materno Infantil y programas de prevención cardiovascular exclusivos.'
            },
            {
                icon: 'tooth',
                title: 'Odontología Integral',
                description: 'Cobertura odontológica completa incluyendo ortodoncia e implantes.'
            },
            {
                icon: 'star',
                title: 'Beneficios Exclusivos',
                description: 'Descuentos en farmacias, ópticas y centros de estética de la red.'
            }
        ],
        'activa_salud': [
            {
                icon: 'hospital',
                title: 'Red de Prestadores',
                description: 'Amplia red de prestadores en todo el país con los mejores centros médicos.'
            },
            {
                icon: 'calendar',
                title: 'Turnos 24/7',
                description: 'Sistema de turnos online disponible las 24 horas, los 365 días del año.'
            },
            {
                icon: 'heart',
                title: 'Programas de Salud',
                description: 'Programas de prevención y seguimiento personalizado de patologías crónicas.'
            },
            {
                icon: 'pills',
                title: 'Farmacia',
                description: 'Importantes descuentos en medicamentos en farmacias adheridas.'
            }
        ],
        'medife': [
            {
                icon: 'hospital',
                title: 'Red Medifé',
                description: 'Acceso a los mejores centros médicos y sanatorios del país.'
            },
            {
                icon: 'user-md',
                title: 'Médico de Cabecera',
                description: 'Seguimiento personalizado con tu médico de cabecera asignado.'
            },
            {
                icon: 'mobile-alt',
                title: 'App Mi Medifé',
                description: 'Gestiona tu plan desde el celular: turnos, autorizaciones y credencial digital.'
            },
            {
                icon: 'ambulance',
                title: 'Urgencias Premium',
                description: 'Servicio de urgencias y emergencias con unidades de alta complejidad.'
            }
        ]
    };

    // Obtener los beneficios específicos del prestador o usar beneficios genéricos
    const benefits = benefitsByProvider[plan.type] || [
        {
            icon: 'hospital',
            title: 'Red de Prestadores Premium',
            description: 'Acceso a una extensa red de centros médicos y profesionales de primer nivel.'
        },
        {
            icon: 'mobile-alt',
            title: 'Tecnología y Comodidad',
            description: 'App móvil exclusiva, turnos online y credencial digital.'
        },
        {
            icon: 'user-md',
            title: 'Atención Especializada',
            description: 'Cobertura integral en todas las especialidades médicas.'
        },
        {
            icon: 'ambulance',
            title: 'Atención 24/7',
            description: 'Servicio de urgencias y emergencias las 24 horas.'
        }
    ];

    return benefits.map(benefit => `
        <div class="benefit-card">
            <div class="benefit-icon">
                <i class="fas fa-${benefit.icon}"></i>
            </div>
            <div class="benefit-content">
                <h3>${benefit.title}</h3>
                <p>${benefit.description}</p>
            </div>
        </div>
    `).join('');
}

function generateComparisonTableHTML(plan) {
    // Características específicas según el prestador
    const comparisonsByProvider = {
        'omint': [
            {
                feature: 'Cobertura Nacional',
                planValue: '100% del país',
                otherValue: 'Según plan'
            },
            {
                feature: 'Centros Propios',
                planValue: 'Red exclusiva OMINT',
                otherValue: 'Variable'
            },
            {
                feature: 'Habitación Internación',
                planValue: 'Individual con acompañante',
                otherValue: 'Según disponibilidad'
            },
            {
                feature: 'Cobertura Medicamentos',
                planValue: '100% PMI, 60% ambulatorio',
                otherValue: '40-50% ambulatorio'
            },
            {
                feature: 'Asistencia al Viajero',
                planValue: 'Internacional',
                otherValue: 'Nacional'
            }
        ],
        'swiss_medical': [
            {
                feature: 'Red de Atención',
                planValue: 'Swiss Medical Group',
                otherValue: 'Prestadores varios'
            },
            {
                feature: 'Clínicas Principales',
                planValue: 'Suizo Americana y red SMG',
                otherValue: 'Según cartilla'
            },
            {
                feature: 'Cobertura Odontológica',
                planValue: 'Integral con ortodoncia',
                otherValue: 'Básica'
            },
            {
                feature: 'Plan Materno Infantil',
                planValue: 'Cobertura extendida',
                otherValue: 'Básica'
            },
            {
                feature: 'Descuentos Farmacia',
                planValue: '60% ambulatorio',
                otherValue: '40% ambulatorio'
            }
        ],
        'activa_salud': [
            {
                feature: 'Cartilla Médica',
                planValue: 'Amplia red nacional',
                otherValue: 'Red limitada'
            },
            {
                feature: 'Consultas Médicas',
                planValue: 'Sin límites',
                otherValue: 'Según plan'
            },
            {
                feature: 'Programas Preventivos',
                planValue: 'Incluidos sin cargo',
                otherValue: 'Cargo adicional'
            },
            {
                feature: 'Emergencias',
                planValue: 'Unidades propias',
                otherValue: 'Tercerizado'
            },
            {
                feature: 'Descuentos Especiales',
                planValue: 'Toda la red',
                otherValue: 'Limitados'
            }
        ],
        'medife': [
            {
                feature: 'Cobertura Nacional',
                planValue: 'Red Medifé completa',
                otherValue: 'Según plan'
            },
            {
                feature: 'Médico de Cabecera',
                planValue: 'Asignación personalizada',
                otherValue: 'No disponible'
            },
            {
                feature: 'App Móvil',
                planValue: 'Funcionalidad completa',
                otherValue: 'Básica'
            },
            {
                feature: 'Urgencias',
                planValue: 'Flota propia',
                otherValue: 'Tercerizado'
            },
            {
                feature: 'Programas de Salud',
                planValue: 'Incluidos',
                otherValue: 'Cargo adicional'
            }
        ]
    };

    // Normalizar el tipo de prestador para hacer la búsqueda
    const normalizedType = plan.type?.toLowerCase().replace(/[\s_-]/g, '');
    let prestadorKey = plan.type?.toLowerCase();
    
    // Mapear nombres de prestadores
    if (normalizedType === 'activasalud' || normalizedType === 'activa') {
        prestadorKey = 'activa_salud';
    } else if (normalizedType === 'swissmedical' || normalizedType === 'swiss') {
        prestadorKey = 'swiss_medical';
    }
    
    // Obtener las comparaciones específicas del prestador o usar comparaciones genéricas
    const comparisons = comparisonsByProvider[prestadorKey] || [
        {
            feature: 'Cobertura Nacional',
            planValue: 'Completa',
            otherValue: 'Limitada'
        },
        {
            feature: 'Centros Médicos',
            planValue: 'Primera línea',
            otherValue: 'Variables'
        },
        {
            feature: 'Tecnología Digital',
            planValue: 'Avanzada',
            otherValue: 'Básica'
        },
        {
            feature: 'Atención Personalizada',
            planValue: 'Preferencial',
            otherValue: 'Estándar'
        },
        {
            feature: 'Descuentos Farmacia',
            planValue: '40-60%',
            otherValue: '30-40%'
        }
    ];

    return comparisons.map(comp => `
        <tr>
            <td>${comp.feature}</td>
            <td>${comp.planValue}</td>
            <td>${comp.otherValue}</td>
        </tr>
    `).join('');
}

// ... existing code ...

async function generateSelectedPlansReport() {
    // Obtener los planes seleccionados
    const selectedPlans = window.selectedPlans || [];
    
    if (selectedPlans.length === 0) {
        alert('Por favor, selecciona al menos un plan para generar el informe.');
        return;
    }

    // Obtener los datos del cliente desde el estado global o el formulario
    let datosCliente = window.datosFormulario || {};
    
    // Si no están en el estado global, intentar obtenerlos del formulario
    if (!datosCliente.tipoCobertura) {
        const form = document.getElementById('cotization-form');
        if (form) {
            const formData = new FormData(form);
            datosCliente = {
                tipoCobertura: formData.get('tipo-cobertura') || window.selectedOption || 'solo',
                edadTitular: formData.get('edad-titular') || formData.get('edad'),
                edadPareja: formData.get('edad-pareja') || formData.get('edadPareja'),
                cantidadHijos: formData.get('cantidad-hijos') || formData.get('cantidadHijos'),
                edadesHijos: formData.get('edades-hijos') || formData.get('edadesHijos')
            };
        } else {
            // Usar datos por defecto
            datosCliente = {
                tipoCobertura: window.selectedOption || 'solo',
                edadTitular: 30,
                edadPareja: null,
                cantidadHijos: 0,
                edadesHijos: ''
            };
        }
    }

    console.log('Datos del cliente:', datosCliente);
    console.log('Planes seleccionados:', selectedPlans);

    // Usar el primer plan seleccionado como principal
    const planPrincipal = selectedPlans[0];
    const precio = typeof planPrincipal.price === 'number' ? planPrincipal.price : parseFloat(planPrincipal.price) || 0;
    const prestadorLabel = getPrestadorLabel(planPrincipal.type);
    
    // Generar beneficios del plan
    let beneficiosDelPlan = [];
    try {
        beneficiosDelPlan = generateBenefitsForPlan(planPrincipal);
    } catch (e) {
        console.log('Error generando beneficios, usando beneficios por defecto');
        beneficiosDelPlan = [
            { title: 'Cobertura médica integral' },
            { title: 'Atención ambulatoria' },
            { title: 'Estudios médicos' },
            { title: 'Medicamentos con descuento' },
            { title: 'Red nacional de prestadores' },
            { title: 'Atención de urgencias 24/7' }
        ];
    }
    
    // Crear HTML de la nueva plantilla de marketing directamente
    const informeHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OSPADEP - Cobertura médica para tu vida en movimiento</title>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@700&family=Inter:wght@600&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; font-weight: 600; line-height: 1.6; color: #333333; background-color: #f8f9fa;">
    
    <!-- Logo Section -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
        <tr>
            <td style="padding: 30px 20px; text-align: center;">
                <img src="https://raw.githubusercontent.com/dantemoss/CotizadorWebOSPADEP-assets/main/logoOSPADEP16.9.jpg" alt="OSPADEP Logo" style="height: 400px; width: auto; display: block; margin: 0 auto;" onerror="this.style.display='none';var alt=document.createElement('div');alt.style.color='#1e40af';alt.style.fontWeight='bold';alt.style.fontSize='22px';alt.style.margin='10px auto';alt.style.textAlign='center';alt.innerText='OSPADEP';this.parentNode.appendChild(alt);">
            </td>
        </tr>
    </table>

    <!-- Header Content Section -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1e3a8a; background-image: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%);">
        <tr>
            <td style="padding: 40px 20px 60px 20px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 42px; font-weight: 700; margin: 0 0 20px 0; line-height: 1.2; text-shadow: 0 2px 4px rgba(0,0,0,0.1); font-family: 'Manrope', sans-serif;">
                    Cobertura médica para<br>
                    <span style="color: #bfdbfe;">tu vida en movimiento</span>
                </h1>
                
                <!-- Membership Card -->
                <div style="display: inline-block; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 20px; padding: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); width: 320px; margin: 20px 0 60px 0; position: relative;">
                    <div style="color: #1e40af; font-weight: 700; font-size: 20px; margin-bottom: 15px; font-family: 'Manrope', sans-serif;">OSPADEP</div>
                    <div style="color: #64748b; font-size: 16px; margin-bottom: 20px;">${prestadorLabel.replace(/_/g, ' ')} - ${planPrincipal.name}</div>
                    <div style="color: #1e40af; font-size: 24px; font-weight: 600; font-family: 'Manrope', sans-serif;">$${precio.toLocaleString('es-AR')}</div>
                    <div style="color: #64748b; font-size: 14px; margin-top: 8px;">por mes</div>
                    <div style="position: absolute; top: 30px; right: 30px; width: 50px; height: 50px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-size: 24px; font-weight: 700;">+</span>
                    </div>
                </div>
                
                <!-- CTA Button with proper spacing -->
                <div style="margin-top: 40px;">
                    <a href="#" style="display: inline-block; background: #60a5fa; color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: 700; font-size: 18px; box-shadow: 0 6px 20px rgba(96, 165, 250, 0.4); font-family: 'Manrope', sans-serif; text-transform: uppercase; letter-spacing: 1px;">
                        COTIZÁ AHORA
                    </a>
                </div>
            </td>
        </tr>
    </table>

    <!-- Institutional Section -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
                    <tr>
                        <td style="text-align: center;">
                            <h2 style="color: #1e40af; font-size: 32px; font-weight: 700; margin: 0 0 20px 0; font-family: 'Manrope', sans-serif;">Somos OSPADEP</h2>
                            <p style="color: #64748b; font-size: 18px; line-height: 1.6; margin: 0 0 30px 0; max-width: 500px; margin-left: auto; margin-right: auto;">
                                Acompañamos a cada afiliado con atención personalizada, cobertura nacional y una red de prestadores en constante crecimiento.
                            </p>
                            <a href="#" style="display: inline-block; background: transparent; color: #3b82f6; text-decoration: none; padding: 12px 24px; border: 2px solid #3b82f6; border-radius: 25px; font-weight: 600; font-size: 16px;">
                                Conocé más
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Plan Details Section -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td style="padding: 40px 20px; text-align: center;">
                <h2 style="color: #1e40af; font-size: 28px; font-weight: 700; margin: 0 0 30px 0; font-family: 'Manrope', sans-serif;">Tu plan seleccionado</h2>
                
                <div style="background: #ffffff; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 2px solid #3b82f6; position: relative; max-width: 500px; margin: 0 auto;">
                    <div style="position: absolute; top: -10px; right: 20px; background: #3b82f6; color: white; padding: 5px 15px; border-radius: 15px; font-size: 12px; font-weight: 600;">TU PLAN</div>
                    <h3 style="color: #1e40af; font-size: 24px; font-weight: 700; margin: 0 0 15px 0; font-family: 'Manrope', sans-serif;">${prestadorLabel.replace(/_/g, ' ')} - ${planPrincipal.name}</h3>
                    <div style="color: #3b82f6; font-size: 32px; font-weight: 700; margin: 0 0 20px 0;">$${precio.toLocaleString('es-AR')}<span style="font-size: 16px; color: #64748b;">/mes</span></div>
                    
                    <!-- Beneficios -->
                    <div style="text-align: left;">
                        <h4 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 15px 0;">Beneficios incluidos:</h4>
                        <ul style="color: #64748b; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                            ${beneficiosDelPlan.slice(0, 6).map(beneficio => `<li style="margin: 8px 0;">${beneficio.title}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Comparison Section -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
        <tr>
            <td style="padding: 40px 20px; text-align: center;">
                <h2 style="color: #1e40af; font-size: 28px; font-weight: 700; margin: 0 0 30px 0; font-family: 'Manrope', sans-serif;">Comparación con otros planes</h2>
                
                <div style="max-width: 600px; margin: 0 auto;">
                    ${selectedPlans.map((plan, index) => {
                        const planPrecio = typeof plan.price === 'number' ? plan.price : parseFloat(plan.price) || 0;
                        const isSelected = index === 0;
                        const borderStyle = isSelected ? 'border: 2px solid #3b82f6;' : 'border: 2px solid #e2e8f0;';
                        const badge = isSelected ? '<div style="position: absolute; top: -10px; right: 20px; background: #3b82f6; color: white; padding: 5px 15px; border-radius: 15px; font-size: 12px; font-weight: 600;">SELECCIONADO</div>' : '';
                        
                        return `
                        <div style="background: #ffffff; border-radius: 16px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin: 15px 0; position: relative; ${borderStyle}">
                            ${badge}
                            <h3 style="color: #1e40af; font-size: 18px; font-weight: 700; margin: 0 0 10px 0;">${plan.type.replace(/_/g, ' ').toUpperCase()} - ${plan.name}</h3>
                            <div style="color: #3b82f6; font-size: 24px; font-weight: 700;">$${planPrecio.toLocaleString('es-AR')}<span style="font-size: 14px; color: #64748b;">/mes</span></div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </td>
        </tr>
    </table>

    <!-- Services Section -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td style="padding: 40px 20px; text-align: center;">
                <h2 style="color: #1e40af; font-size: 28px; font-weight: 700; margin: 0 0 20px 0; font-family: 'Manrope', sans-serif;">Accedé a estudios y tratamientos</h2>
                <p style="color: #64748b; font-size: 16px; margin: 0 0 40px 0;">con la mejor tecnología</p>
                
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; max-width: 600px; margin: 0 auto;">
                    <div style="background: #ffffff; border-radius: 16px; padding: 25px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08); flex: 1; min-width: 250px;">
                        <div style="background: #dbeafe; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-pills" style="color: #3b82f6; font-size: 32px;"></i>
                        </div>
                        <h4 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">Medicamentos</h4>
                        <p style="color: #64748b; font-size: 14px; margin: 0;">Descuentos especiales en farmacias adheridas</p>
                    </div>
                    <div style="background: #ffffff; border-radius: 16px; padding: 25px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08); flex: 1; min-width: 250px;">
                        <div style="background: #dbeafe; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-x-ray" style="color: #3b82f6; font-size: 32px;"></i>
                        </div>
                        <h4 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">Estudios</h4>
                        <p style="color: #64748b; font-size: 14px; margin: 0;">Laboratorio y diagnóstico por imágenes</p>
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Multimedia Section -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
                    <tr>
                        <td>
                            <h2 style="color: #1e40af; font-size: 28px; font-weight: 700; text-align: center; margin: 0 0 40px 0; font-family: 'Manrope', sans-serif;">Cuidamos tu bienestar en cada etapa</h2>
                            
                            <!-- Images Grid -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="width: 50%; vertical-align: top;">
                                        <img src="https://i.postimg.cc/gJ1mLSJP/foto-Seccion-Media.png" alt="Consulta médica moderna" style="width: 100%; height: auto;">
                                    </td>
                                    <td style="width: 50%; vertical-align: top; background-color: #ffffff;">
                                        <img src="https://i.postimg.cc/ZKKx941r/Imagen-Seccion2.png" alt="Tecnología médica avanzada" style="width: 100%; height: auto;">
                                    </td>
                                </tr>
                            </table>
                            
                            <div style="text-align: center; margin-top: 30px;">
                                <p style="color: #64748b; font-size: 16px; margin: 0;">Atención personalizada con la mejor tecnología médica</p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Final CTA Section with Steps -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1e3a8a; background-image: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);">
        <tr>
            <td style="padding: 50px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
                    <tr>
                        <td style="text-align: center;">
                            <h2 style="color: #ffffff; font-size: 36px; font-weight: 700; font-family: 'Manrope', sans-serif; margin: 0 0 20px 0;">Acceso completo a salud de calidad</h2>
                            <p style="color: #bfdbfe; font-size: 20px; font-family: 'Inter', sans-serif; font-weight: 600; margin: 0 0 60px 0;">Tu afiliación en 3 pasos simples</p>
                            
                            <!-- 3 Steps Process -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 50px; max-width: 520px; margin-left: auto; margin-right: auto;">
                                <tr>
                                    <td style="width: 28%; text-align: center; vertical-align: top; padding: 0 10px;">
                                        <!-- Step 1 -->
                                        <div style="margin-bottom: 30px;">
                                            <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: table; border: 2px solid rgba(255,255,255,0.3);">
                                                <div style="display: table-cell; vertical-align: middle; text-align: center;">
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ffffff;">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                        <circle cx="12" cy="7" r="4"></circle>
                                                    </svg>
                                                </div>
                                            </div>
                                            <h4 style="color: #ffffff; font-size: 16px; font-weight: 600; font-family: 'Manrope', sans-serif; margin: 0 0 8px 0;">Colocá tu información</h4>
                                            <p style="color: #bfdbfe; font-size: 14px; font-family: 'Inter', sans-serif; font-weight: 600; margin: 0; line-height: 1.4;">Datos básicos y contacto</p>
                                        </div>
                                    </td>
                                    
                                    <td style="width: 11%; text-align: center; vertical-align: middle;">
                                        <!-- Arrow 1 -->
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #bfdbfe;">
                                            <polyline points="9,18 15,12 9,6"></polyline>
                                        </svg>
                                    </td>
                                    
                                    <td style="width: 28%; text-align: center; vertical-align: top; padding: 0 10px;">
                                        <!-- Step 2 -->
                                        <div style="margin-bottom: 30px;">
                                            <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: table; border: 2px solid rgba(255,255,255,0.3);">
                                                <div style="display: table-cell; vertical-align: middle; text-align: center;">
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ffffff;">
                                                        <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4m6-6h4a2 2 0 0 1 2 2v3c0 1.1-.9 2-2 2h-4m-6 0V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <h4 style="color: #ffffff; font-size: 16px; font-weight: 600; font-family: 'Manrope', sans-serif; margin: 0 0 8px 0;">Elegí tu plan</h4>
                                            <p style="color: #bfdbfe; font-size: 14px; font-family: 'Inter', sans-serif; font-weight: 600; margin: 0; line-height: 1.4;">Regular o Premium</p>
                                        </div>
                                    </td>
                                    
                                    <td style="width: 11%; text-align: center; vertical-align: middle;">
                                        <!-- Arrow 2 -->
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #bfdbfe;">
                                            <polyline points="9,18 15,12 9,6"></polyline>
                                        </svg>
                                    </td>
                                    
                                    <td style="width: 28%; text-align: center; vertical-align: top; padding: 0 10px;">
                                        <!-- Step 3 -->
                                        <div style="margin-bottom: 30px;">
                                            <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: table; border: 2px solid rgba(255,255,255,0.3);">
                                                <div style="display: table-cell; vertical-align: middle; text-align: center;">
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ffffff;">
                                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <h4 style="color: #ffffff; font-size: 16px; font-weight: 600; font-family: 'Manrope', sans-serif; margin: 0 0 8px 0;">Hablá con un asesor</h4>
                                            <p style="color: #bfdbfe; font-size: 14px; font-family: 'Inter', sans-serif; font-weight: 600; margin: 0; line-height: 1.4;">y afiliate al instante</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <div style="text-align: center;">
                                <a href="#" style="display: inline-block; background: #60a5fa; color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: 700; font-size: 18px; font-family: 'Manrope', sans-serif; box-shadow: 0 6px 20px rgba(96, 165, 250, 0.4); text-transform: uppercase; letter-spacing: 1px;">
                                    INICIAR AFILIACIÓN
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Footer -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1e293b;">
        <tr>
            <td style="padding: 40px 20px; text-align: center; color: #94a3b8;">
                <div style="margin-bottom: 20px;">
                    <div style="font-size: 18px; color: #ffffff; font-weight: 600; margin-bottom: 10px;">¿Necesitas más información?</div>
                    <div style="font-size: 14px; margin-bottom: 20px;">Contactanos: 0800-345-6732 | comercial@ospadep.com</div>
                </div>
                
                <div style="color: #64748b; font-size: 12px; line-height: 1.5;">
                    *Este es un correo informativo generado automáticamente.
                </div>
            </td>
        </tr>
    </table>

</body>
</html>
    `;

    // Abrir la nueva plantilla de marketing en una ventana nueva
    const printWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
    printWindow.document.write(informeHTML);
    printWindow.document.close();
    
    // Agregar botón de descarga a la ventana del informe
    printWindow.onload = function() {
        addDownloadButtonToReport(printWindow, informeHTML);
    };
    
    // Enfocar la ventana
    printWindow.focus();
}

// ... existing code ...

// Función para generar informe consolidado de múltiples planes
function generarInformeConsolidado(datosCliente, planes) {
    const fechaActual = new Date();
    const numeroReferencia = generateRandomRef();
    
    // Generar resumen de planes
    const planesResumen = planes.map(plan => {
        const precio = typeof plan.price === 'number' ? plan.price : parseFloat(plan.price) || 0;
        return `
            <div class="plan-summary-item">
                <div class="plan-summary-info">
                    <h4>${getPrestadorLabel(plan.type)} - ${plan.name}</h4>
                    <p class="plan-coverage">${getTipoPlanLabel(datosCliente.tipoCobertura)} • ${plan.cobertura || 'Cobertura integral'}</p>
                </div>
                <div class="plan-summary-price">
                    <span class="price-amount">$${precio.toLocaleString('es-AR')}</span>
                    <span class="price-period">por mes</span>
                </div>
            </div>
        `;
    }).join('');

    // Calcular información de aportes OSPADEP
    const aportesPorcentaje = datosCliente.aportes || 0;
    const tieneAportes = aportesPorcentaje > 0;
    const montoAportes = tieneAportes ? (aportesPorcentaje * 100).toFixed(1) : 0;

    // Generar beneficios consolidados (únicos) - organizados en filas
    const todosLosBeneficios = planes.flatMap(plan => generateBenefitsForPlan(plan));
    const beneficiosUnicos = todosLosBeneficios.filter((beneficio, index, arr) => 
        arr.findIndex(b => b.title === beneficio.title) === index
    ).slice(0, 6); // Limitar a 6 beneficios

    // Organizar beneficios en filas de 3
    let beneficiosHTML = '';
    for (let i = 0; i < beneficiosUnicos.length; i += 3) {
        beneficiosHTML += '<div class="benefits-row">';
        
        for (let j = i; j < Math.min(i + 3, beneficiosUnicos.length); j++) {
            const beneficio = beneficiosUnicos[j];
            beneficiosHTML += `
                <div class="benefit-card-compact">
                    <div class="benefit-icon">${beneficio.icon}</div>
                    <div class="benefit-content">
                        <h4 class="benefit-title">${beneficio.title}</h4>
                        <p class="benefit-description">${beneficio.description}</p>
                    </div>
                </div>
            `;
        }
        
        beneficiosHTML += '</div>';
    }

    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cotización Comparativa OSPADEP</title>
            <meta name="color-scheme" content="light">
            <meta name="supported-color-schemes" content="light">
            <style>
                @media print {
                    * {
                        margin: 0 !important;
                        padding: 0 !important;
                        box-sizing: border-box !important;
                    }
                    
                    html, body {
                        width: 210mm !important;
                        height: 297mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        font-size: 11px;
                        overflow: hidden !important;
                    }
                    
                    @page {
                        size: A4 portrait;
                        margin: 0 !important;
                        padding: 0 !important;
                        @top-left { content: ""; }
                        @top-center { content: ""; }
                        @top-right { content: ""; }
                        @bottom-left { content: ""; }
                        @bottom-center { content: ""; }
                        @bottom-right { content: ""; }
                    }
                    
                    body {
                        margin: 0 !important;
                        padding: 15mm !important;
                        background: white !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        max-height: 297mm !important;
                        overflow: hidden !important;
                        box-sizing: border-box !important;
                    }
                    
                    .container {
                        width: 100% !important;
                        height: 267mm !important;
                        max-height: 267mm !important;
                        display: block !important;
                        overflow: hidden !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    
                    .header {
                        height: 70mm !important;
                        padding: 5mm !important;
                        margin: 0 0 3mm 0 !important;
                        display: block !important;
                    }
                    
                    .content-area {
                        height: 174mm !important;
                        max-height: 174mm !important;
                        overflow: hidden !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    
                    .plans-section {
                        height: auto !important;
                        max-height: 120mm !important;
                        padding: 6mm !important;
                        margin: 0 0 3mm 0 !important;
                        overflow: visible !important;
                    }
                    
                    .benefits-section {
                        height: auto !important;
                        max-height: 55mm !important;
                        padding: 6mm !important;
                        margin: 0 !important;
                        overflow: hidden !important;
                        page-break-after: auto !important;
                    }
                    
                    .footer {
                        height: 20mm !important;
                        padding: 5mm !important;
                        margin: 0 !important;
                        overflow: visible !important;
                        position: relative !important;
                        bottom: 0 !important;
                        display: block !important;
                        visibility: visible !important;
                        width: 100% !important;
                        background: white !important;
                        page-break-inside: avoid !important;
                        page-break-before: auto !important;
                    }
                    
                    /* Tamaños de fuente optimizados */
                    h1 { 
                        font-size: 16px !important; 
                        margin: 0 0 3mm 0 !important; 
                        line-height: 1.2 !important;
                    }
                    h2 { 
                        font-size: 13px !important; 
                        margin: 0 0 2mm 0 !important; 
                        line-height: 1.2 !important;
                    }
                    h3 { 
                        font-size: 11px !important; 
                        margin: 0 0 1mm 0 !important; 
                        line-height: 1.2 !important;
                    }
                    h4 { 
                        font-size: 10px !important; 
                        margin: 0 0 1mm 0 !important; 
                        line-height: 1.1 !important;
                    }
                    p { 
                        font-size: 9px !important; 
                        margin: 0 0 1mm 0 !important; 
                        line-height: 1.2 !important;
                    }
                    
                    /* Header específico */
                    .header {
                        padding: 5mm !important;
                        height: 70mm !important;
                    }
                    
                    .header-title {
                        font-size: 18px !important;
                        margin: 0 !important;
                        text-align: center !important;
                    }
                    
                    .logo-cell {
                        width: 60mm !important;
                        padding-right: 5mm !important;
                    }
                    
                    .logo-container {
                        height: 50mm !important;
                        padding: 3mm !important;
                    }
                    
                    .logo-img {
                        max-width: 54mm !important;
                        max-height: 44mm !important;
                    }
                    
                    .header-content {
                        width: auto !important;
                        text-align: center !important;
                    }
                    
                    .header-meta-right {
                        width: 60mm !important;
                        padding-left: 5mm !important;
                    }
                    
                    .meta-item {
                        padding: 2mm 3mm !important;
                        margin-bottom: 1mm !important;
                        background: rgba(255, 255, 255, 0.15) !important;
                    }
                    
                    .meta-label {
                        font-size: 8px !important;
                        display: block !important;
                    }
                    
                    .meta-value {
                        font-size: 10px !important;
                        display: block !important;
                        font-weight: 600 !important;
                    }
                    
                    /* Planes section */
                    .section-title {
                        font-size: 14px !important;
                        margin: 0 0 3mm 0 !important;
                        padding-bottom: 1mm !important;
                    }
                    
                    .plan-summary-item {
                        margin: 0 0 1.5mm 0 !important;
                        padding: 2mm !important;
                        height: auto !important;
                        min-height: auto !important;
                    }
                    
                    .plan-summary-info h4 {
                        font-size: 10px !important;
                        margin: 0 0 0.5mm 0 !important;
                        line-height: 1.1 !important;
                    }
                    
                    .plan-coverage {
                        font-size: 8px !important;
                        margin: 0 !important;
                        line-height: 1.1 !important;
                    }
                    
                    .price-amount {
                        font-size: 12px !important;
                        line-height: 1.1 !important;
                    }
                    
                    .price-period {
                        font-size: 7px !important;
                        line-height: 1.1 !important;
                    }
                    
                    /* Aportes section */
                    .aportes-section {
                        margin: 2mm 0 0 0 !important;
                    }
                    
                    .aportes-info {
                        padding: 3mm !important;
                    }
                    
                    .aportes-title {
                        font-size: 11px !important;
                        margin: 0 0 1mm 0 !important;
                        line-height: 1.1 !important;
                    }
                    
                    .aportes-amount {
                        font-size: 14px !important;
                        margin: 0 0 0.5mm 0 !important;
                        line-height: 1.1 !important;
                    }
                    
                    .aportes-description {
                        font-size: 8px !important;
                        margin: 0 !important;
                        line-height: 1.1 !important;
                    }
                    
                    .aportes-cta {
                        font-size: 9px !important;
                        margin: 0.5mm 0 0 0 !important;
                        line-height: 1.1 !important;
                    }
                    
                    /* Benefits section */
                    .benefits-row {
                        margin: 0 0 2mm 0 !important;
                        height: auto !important;
                    }
                    
                    .benefit-card-compact {
                        padding: 2mm !important;
                        margin-right: 2mm !important;
                        height: auto !important;
                    }
                    
                    .benefit-icon {
                        font-size: 14px !important;
                        margin: 0 0 1mm 0 !important;
                    }
                    
                    .benefit-title { 
                        font-size: 9px !important; 
                        margin: 0 0 1mm 0 !important; 
                        line-height: 1.1 !important;
                    }
                    
                    .benefit-description { 
                        font-size: 8px !important; 
                        margin: 0 !important; 
                        line-height: 1.2 !important;
                    }
                    
                    /* Footer */
                    .footer {
                        font-size: 8px !important;
                        line-height: 1.2 !important;
                    }
                    
                    .footer p {
                        margin: 0 0 1mm 0 !important;
                    }
                    
                    /* Forzar transparencia del logo en PDF */
                    .logo-container {
                        background: transparent !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    
                    .logo-img {
                        background: transparent !important;
                        background-color: transparent !important;
                        box-shadow: none !important;
                        border: none !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        mix-blend-mode: multiply;
                        filter: none !important;
                    }
                    
                    /* Forzar estilos del nuevo header en PDF */
                    .header {
                        padding: 20px 20px 15px 20px !important;
                        margin-bottom: 0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        background: linear-gradient(135deg, #1DB9A0 0%, #00A3C8 70%, #1A408C 100%) !important;
                    }
                    
                    .header-row {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: space-between !important;
                        gap: 25px !important;
                    }
                    
                    .logo-section {
                        flex: 0 0 auto !important;
                        min-width: 160px !important;
                    }
                    
                    .title-section {
                        flex: 1 !important;
                        text-align: right !important;
                    }
                    
                    .header-title {
                        font-size: 22px !important;
                        font-weight: 700 !important;
                        margin: 0 0 3px 0 !important;
                        text-align: right !important;
                        line-height: 1.1 !important;
                    }
                    
                    .header-subtitle {
                        font-size: 13px !important;
                        font-weight: 400 !important;
                        margin: 0 !important;
                        opacity: 0.9 !important;
                        text-align: right !important;
                        line-height: 1.2 !important;
                    }
                    
                    .info-block {
                        padding: 15px 20px !important;
                        margin-bottom: 20px !important;
                        margin-top: 0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        background: linear-gradient(135deg, #00A3C8 0%, #1A408C 100%) !important;
                    }
                    
                    .header-cards {
                        display: flex !important;
                        justify-content: center !important;
                        gap: 15px !important;
                        flex-wrap: wrap !important;
                    }
                    
                    .info-card {
                        background: rgba(255, 255, 255, 0.15) !important;
                        border-radius: 6px !important;
                        padding: 12px !important;
                        flex: 1 !important;
                        min-width: 110px !important;
                        max-width: 140px !important;
                        text-align: center !important;
                    }
                }
                
                :root {
                    --dominant: #1DB9A0;
                    --secondary: #00A3C8;
                    --accent: #1A408C;
                    --detail: #0B3D91;
                    --bg-light: #F8FAFB;
                    --text-dark: #2E3A46;
                    --text-muted: #69707A;
                    --card-bg: #FFFFFF;
                    --border-light: #E2E8F0;
                }
                
                *, *::before, *::after {
                    box-sizing: border-box;
                }
                
                body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                    background: var(--bg-light);
                    color: var(--text-dark);
                    line-height: 1.4;
                }
                
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: var(--card-bg);
                    overflow: hidden;
                }
                
                /* Header principal */
                .header {
                    background: linear-gradient(135deg, var(--dominant) 0%, var(--secondary) 70%, var(--accent) 100%);
                    color: #fff;
                    padding: 20px 20px 15px 20px;
                    margin-bottom: 0;
                }
                
                .header-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 25px;
                }
                
                .logo-section {
                    flex: 0 0 auto;
                    min-width: 160px;
                }
                
                .logo-container {
                    background: transparent;
                    padding: 0;
                    text-align: left;
                }
                
                .logo-img {
                    max-width: 150px;
                    max-height: 60px;
                    background: transparent !important;
                    mix-blend-mode: multiply;
                    opacity: 1;
                }
                
                .title-section {
                    flex: 1;
                    text-align: right;
                }
                
                .header-title {
                    font-size: 22px;
                    font-weight: 700;
                    margin: 0 0 3px 0;
                    line-height: 1.1;
                    text-align: right;
                }
                
                .header-subtitle {
                    font-size: 13px;
                    font-weight: 400;
                    margin: 0;
                    opacity: 0.9;
                    text-align: right;
                    line-height: 1.2;
                }
                
                /* Bloque de información */
                .info-block {
                    background: linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%);
                    color: #fff;
                    padding: 15px 20px;
                    margin-bottom: 20px;
                    margin-top: 0;
                }
                
                .header-cards {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    flex-wrap: wrap;
                    max-width: 100%;
                }
                
                .info-card {
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 6px;
                    padding: 12px;
                    flex: 1;
                    min-width: 110px;
                    max-width: 140px;
                    text-align: center;
                }
                
                .card-icon {
                    font-size: 18px;
                    margin-bottom: 6px;
                }
                
                .card-label {
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    opacity: 0.8;
                    margin-bottom: 3px;
                    letter-spacing: 0.5px;
                }
                
                .card-value {
                    font-size: 12px;
                    font-weight: 600;
                }
                
                /* Sección de planes */
                .plans-section {
                    padding: 20px;
                    border-bottom: 1px solid var(--border-light);
                }
                
                .section-title {
                    color: var(--accent);
                    font-size: 18px;
                    margin: 0 0 15px 0;
                    font-weight: 600;
                    border-bottom: 2px solid var(--dominant);
                    padding-bottom: 5px;
                }
                
                .plan-summary-item {
                    background: var(--bg-light);
                    border-left: 4px solid var(--dominant);
                    margin-bottom: 10px;
                    padding: 12px;
                    border-radius: 0 6px 6px 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .plan-summary-info {
                    flex: 1;
                    margin-right: 10px;
                }
                
                .plan-summary-info h4 {
                    color: var(--accent);
                    font-size: 14px;
                    margin: 0 0 3px 0;
                    font-weight: 600;
                }
                
                .plan-coverage {
                    color: var(--text-muted);
                    font-size: 12px;
                    margin: 0;
                }
                
                .plan-summary-price {
                    text-align: right;
                }
                
                .price-amount {
                    color: var(--dominant);
                    font-size: 18px;
                    font-weight: 700;
                    display: block;
                }
                
                .price-period {
                    color: var(--text-muted);
                    font-size: 11px;
                }
                
                .aportes-section {
                    margin-top: 15px;
                }
                
                .aportes-info {
                    background: linear-gradient(135deg, var(--dominant), var(--secondary));
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                }
                
                .aportes-info.promocional {
                    background: linear-gradient(135deg, var(--accent), #2563eb);
                }
                
                .aportes-title {
                    font-size: 16px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                }
                
                .aportes-amount {
                    font-size: 22px;
                    font-weight: 800;
                    margin: 0 0 5px 0;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                }
                
                .aportes-description {
                    font-size: 11px;
                    opacity: 0.95;
                    margin: 0;
                    line-height: 1.3;
                }
                
                .aportes-cta {
                    font-size: 12px;
                    font-weight: 600;
                    margin: 5px 0 0 0;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                }
                
                /* Beneficios compactos */
                .benefits-section {
                    padding: 20px;
                }
                
                .benefits-grid {
                    width: 100%;
                }
                
                .benefits-row {
                    display: table;
                    width: 100%;
                    margin-bottom: 8px;
                    table-layout: fixed;
                }
                
                .benefit-card-compact {
                    display: table-cell;
                    background: var(--bg-light);
                    border-radius: 6px;
                    padding: 8px;
                    margin-right: 8px;
                    border-left: 3px solid var(--dominant);
                    width: 33.33%;
                    vertical-align: top;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .benefit-icon {
                    font-size: 16px;
                    margin-bottom: 5px;
                    display: block;
                }
                
                .benefit-title {
                    color: var(--accent);
                    font-size: 11px;
                    font-weight: 600;
                    margin: 0 0 3px 0;
                    line-height: 1.2;
                }
                
                .benefit-description {
                    color: var(--text-muted);
                    font-size: 9px;
                    margin: 0;
                    line-height: 1.3;
                }
                
                /* Footer */
                .footer {
                    background: var(--bg-light);
                    padding: 12px;
                    text-align: center;
                    border-top: 1px solid var(--border-light);
                    color: var(--text-muted);
                    font-size: 10px;
                }
                
                .footer p {
                    margin: 0 0 3px 0;
                }
            </style>
        </head>
        <body>
            <div class="main-container">
                <div class="container">
                    <!-- Header principal -->
                    <div class="header">
                        <div class="header-row">
                            <div class="logo-section">
                                <div class="logo-container">
                            <img src="https://raw.githubusercontent.com/dantemoss/CotizadorWebOSPADEP-assets/main/logoOSPADEP16.9.jpg" alt="OSPADEP" style="width:100%; height:auto; display:block; border-radius: 12px 12px 0 0;" onerror="this.style.display='none';var alt=document.createElement('div');alt.style.color='#1e40af';alt.style.fontWeight='bold';alt.style.fontSize='22px';alt.style.margin='10px auto';alt.style.textAlign='center';alt.innerText='OSPADEP';this.parentNode.appendChild(alt);">
                        </div>
                            </div>
                            
                            <div class="title-section">
                                <h1 class="header-title">Cotización Comparativa OSP-${numeroReferencia}</h1>
                            <div class="header-subtitle">
                                ${formatDate(fechaActual)} | Vigencia: 72 hs hábiles
                            </div>
                                </div>
                            </div>
                            </div>
                
                    <!-- Bloque de información -->
                    <div class="info-block">
                        <div class="header-cards">
                            <div class="info-card">
                                <div class="card-icon">👤</div>
                                <div class="card-label">BENEFICIARIO</div>
                                <div class="card-value">${getTipoPlanLabel(datosCliente.tipoCobertura)}</div>
                        </div>
                            <div class="info-card">
                                <div class="card-icon">🎂</div>
                                <div class="card-label">EDAD</div>
                                <div class="card-value">${datosCliente.edadTitular || '25'} años</div>
                            </div>
                            <div class="info-card">
                                <div class="card-icon">➕</div>
                                <div class="card-label">AFILIACIÓN</div>
                                <div class="card-value">Adherente</div>
                            </div>
                            <div class="info-card">
                                <div class="card-icon">🏢</div>
                                <div class="card-label">COBERTURA</div>
                                <div class="card-value">CABA y GBA</div>
                            </div>
                        </div>
                    </div>

                    <div class="content-area">
                        <!-- Planes seleccionados -->
                        <div class="plans-section">
                            <h2 class="section-title">Planes Seleccionados (${planes.length})</h2>
                            ${planesResumen}
                            
                            <div class="aportes-section">
                                ${tieneAportes ? `
                                    <div class="aportes-info">
                                        <h3 class="aportes-title">🎯 Tus Aportes OSPADEP</h3>
                                        <p class="aportes-amount">${montoAportes}% bonificado</p>
                                        <p class="aportes-description">Como afiliado a OSPADEP, tienes descuentos especiales en estos planes</p>
                                    </div>
                                ` : `
                                    <div class="aportes-info promocional">
                                        <h3 class="aportes-title">💰 Paga Menos con tus Aportes</h3>
                                        <p class="aportes-description">Los afiliados a OSPADEP reciben descuentos especiales</p>
                                        <p class="aportes-cta">¡Consulta por tus beneficios como afiliado!</p>
                                    </div>
                                `}
                            </div>
                        </div>

                        <!-- Beneficios consolidados -->
                        <div class="benefits-section">
                            <h2 class="section-title">Beneficios Destacados</h2>
                            <div class="benefits-grid">
                                ${beneficiosHTML}
                            </div>
                            </div>
                        </div>

                    </div>
                    
                    <!-- Footer -->
                        <div class="footer">
                            <p><strong>Cotización válida por 30 días.</strong> Contáctenos: 📞 <strong>0800-345-6732</strong> | 📧 <strong>comercial@ospadep.com</strong> | 📱 <strong>www.ospadep.com</strong></p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Función para obtener beneficios específicos por plan
function generateBenefitsForPlan(plan) {
    const prestador = plan.type.toLowerCase().replace(/[\s_-]/g, '');
    
    switch(prestador) {
        case 'omint':
            return [
                { icon: '🏥', title: 'Red Premium OMINT', description: 'Sanatorio Otamendi y centros exclusivos' },
                { icon: '💊', title: 'Farmacia OMINT', description: '60% descuento en +500 farmacias' },
                { icon: '🔬', title: 'Laboratorio Central', description: 'Análisis sin bonificación' }
            ];
        case 'swissmedical':
        case 'swiss':
            return [
                { icon: '🏨', title: 'Hospital Universitario Austral', description: 'Centro de excelencia médica' },
                { icon: '🧬', title: 'Medicina Nuclear', description: 'PET-CT y resonancias 3Tesla' },
                { icon: '❤️', title: 'Instituto Cardiovascular', description: 'Cirugía cardíaca especializada' }
            ];
        case 'activasalud':
        case 'activa':
            return [
                { icon: '💪', title: 'Medicina del Deporte', description: 'Centro especializado en Belgrano' },
                { icon: '🏥', title: 'Sanatorio Modelo Caseros', description: 'Tecnología de última generación' },
                { icon: '🏃‍♀️', title: 'Programa Activa Vida', description: 'Descuentos en Megatlon y SportClub' }
            ];
        case 'medife':
            return [
                { icon: '🏥', title: 'Centro Médico Pueyrredón', description: 'Complejo premium en CABA' },
                { icon: '🔬', title: 'Laboratorio Stamboulian', description: 'Convenio exclusivo alta complejidad' },
                { icon: '🚨', title: 'Emergencias Vittal', description: 'Servicio móvil 24 horas' }
            ];
        default:
            return [
                { icon: '🏥', title: 'Cobertura Integral', description: 'Atención médica completa' },
                { icon: '🩺', title: 'Red de Especialistas', description: 'Profesionales calificados' },
                { icon: '🚑', title: 'Emergencias 24/7', description: 'Servicio de urgencias' }
            ];
    }
}

// Función para generar referencia única
function generateRandomRef() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Función para formatear fecha en español
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('es-AR', options);
}

// Función para obtener el label del tipo de plan
function getTipoPlanLabel(tipoCobertura) {
    switch(tipoCobertura) {
        case 'solo': return 'Individual';
        case 'pareja': return 'Pareja';
        case 'hijos': return 'Con hijos';
        case 'familia': return 'Familiar';
        default: return 'Individual';
    }
}

// Función para obtener el label del prestador
function getPrestadorLabel(type) {
    const prestadorMap = {
        'omint': 'OMINT',
        'swiss medical': 'Swiss Medical',
        'swiss_medical': 'Swiss Medical',
        'swissmedical': 'Swiss Medical',
        'swiss': 'Swiss Medical',
        'activa salud': 'Activa Salud',
        'activa': 'Activa Salud',
        'activa_salud': 'Activa Salud',
        'activasalud': 'Activa Salud',
        'medife': 'Medifé',
        'sw nubial': 'SW Nubial',
        'sw_nubial': 'SW Nubial',
        'swissnubial': 'SW Nubial'
    };
    
    // Normalizar el tipo para búsqueda
    const normalizedType = type?.toLowerCase().replace(/[\s_-]/g, '');
    
    // Buscar por tipo original, normalizado y variaciones
    return prestadorMap[type?.toLowerCase()] || 
           prestadorMap[normalizedType] || 
           prestadorMap[type?.toLowerCase().replace(/[\s_-]/g, '')] ||
           (type ? type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ') : 'Prestador');
}

// Función para generar beneficios en formato email-friendly
function generateBenefitsHTMLForEmail(plan) {
    const prestador = plan.type.toLowerCase().replace(/[\s_-]/g, '');
    let beneficios = [];
    
    switch(prestador) {
        case 'omint':
            beneficios = [
                { icon: '🏥', title: 'Red de Prestadores Premium', description: 'Más de 3.000 profesionales en CABA y GBA. Sanatorio Otamendi, Clínica Santa Isabel' },
                { icon: '🩺', title: 'Internación sin Límites', description: 'Cobertura 100% en habitación privada con acompañante. Sin copagos' },
                { icon: '🚑', title: 'Emergencias OMINT', description: 'Servicio propio de emergencias médicas móviles las 24hs' },
                { icon: '💊', title: 'Farmacia OMINT', description: 'Descuentos hasta 60% en más de 500 farmacias adheridas' },
                { icon: '🔬', title: 'Laboratorio Central', description: 'Análisis clínicos sin bonificación. Resultados online' },
                { icon: '🦷', title: 'Odontología Integral', description: 'Cobertura completa en consultas, endodoncia y cirugías' }
            ];
            break;
        case 'swissmedical':
        case 'swiss':
            beneficios = [
                { icon: '🏨', title: 'Hospital Universitario Austral', description: 'Acceso directo al centro de excelencia médica de Pilar' },
                { icon: '🔬', title: 'Instituto de Oncología', description: 'Centro de alta complejidad para tratamientos oncológicos y radioterapia' },
                { icon: '👶', title: 'Materno Infantil Austral', description: 'Maternidad premium con neonatología de nivel III' },
                { icon: '🧬', title: 'Medicina Nuclear', description: 'PET-CT, resonancias 3Tesla y diagnóstico molecular avanzado' },
                { icon: '🏥', title: 'Centros Swiss Medical', description: 'Red propia: Center, Barracas, Palermo, Vicente López' },
                { icon: '❤️', title: 'Instituto Cardiovascular', description: 'Cirugía cardíaca, hemodinamia y electrofisiología' }
            ];
            break;
        case 'activasalud':
        case 'activa':
            beneficios = [
                { icon: '💪', title: 'Centro de Medicina del Deporte', description: 'Sede Belgrano con especialistas en medicina deportiva y rehabilitación' },
                { icon: '🏃‍♀️', title: 'Programa Activa Vida', description: 'Descuentos en gimnasios Megatlon, SportClub y centros de wellness' },
                { icon: '🧘‍♀️', title: 'Medicina Integrativa', description: 'Acupuntura, homeopatía, osteopatía y terapias complementarias' },
                { icon: '🏥', title: 'Sanatorio Modelo de Caseros', description: 'Centro médico integral con tecnología de última generación' },
                { icon: '👩‍⚕️', title: 'Medicina Familiar', description: 'Médicos de cabecera y seguimiento personalizado de salud' },
                { icon: '📱', title: 'Telemedicina 24/7', description: 'Consultas virtuales sin costo adicional con especialistas' }
            ];
            break;
        case 'medife':
            beneficios = [
                { icon: '🏥', title: 'Centro Médico Pueyrredón', description: 'Complejo médico premium en CABA con todas las especialidades' },
                { icon: '🔬', title: 'Laboratorio Stamboulian', description: 'Convenio exclusivo con laboratorio de alta complejidad' },
                { icon: '🚨', title: 'Emergencias Vittal', description: 'Servicio de emergencias médicas móviles las 24 horas' },
                { icon: '💉', title: 'Vacunatorio Medifé', description: 'Centro de vacunación con vacunas importadas y calendario completo' },
                { icon: '👨‍⚕️', title: 'Medicina Preventiva', description: 'Checkeos ejecutivos y programas de medicina preventiva' },
                { icon: '🏨', title: 'Sanatorios Convenio', description: 'Trinidad Mitre, Clínica Bazterrica, Instituto Argentino del Diagnóstico' }
            ];
            break;
        case 'swnubial':
        case 'swissnubial':
            beneficios = [
                { icon: '🏥', title: 'Red Swiss Medical', description: 'Acceso a toda la red de centros y sanatorios Swiss Medical' },
                { icon: '💰', title: 'Plan Económico', description: 'Opción accesible con cobertura integral básica' },
                { icon: '🩺', title: 'Consultas Médicas', description: 'Especialistas y estudios con bonificaciones preferenciales' },
                { icon: '🚑', title: 'Emergencias Incluidas', description: 'Servicio de emergencias sin costo adicional' },
                { icon: '💊', title: 'Farmacia con Descuentos', description: 'Medicamentos con descuentos en farmacias de la red' },
                { icon: '🔬', title: 'Estudios Diagnósticos', description: 'Laboratorio y diagnóstico por imágenes con cobertura' }
            ];
            break;
        default:
            beneficios = [
                { icon: '🏥', title: 'Cobertura Médica Integral', description: 'Atención médica completa con especialistas' },
                { icon: '🩺', title: 'Red de Especialistas', description: 'Acceso a médicos especialistas calificados' },
                { icon: '🚑', title: 'Emergencias Médicas', description: 'Servicio de emergencias las 24 horas' },
                { icon: '💊', title: 'Cobertura Farmacológica', description: 'Descuentos en medicamentos esenciales' }
            ];
    }
    
    let html = '';
    for (let i = 0; i < beneficios.length; i += 2) {
        html += '<div class="benefits-row">';
        
        // Primer beneficio de la fila
        html += `
            <div class="benefit-card">
                <div class="benefit-icon">${beneficios[i].icon}</div>
                <h3 class="benefit-title">${beneficios[i].title}</h3>
                <p class="benefit-description">${beneficios[i].description}</p>
            </div>
        `;
        
        // Segundo beneficio de la fila (si existe)
        if (i + 1 < beneficios.length) {
            html += `
                <div class="benefit-card">
                    <div class="benefit-icon">${beneficios[i + 1].icon}</div>
                    <h3 class="benefit-title">${beneficios[i + 1].title}</h3>
                    <p class="benefit-description">${beneficios[i + 1].description}</p>
                </div>
            `;
        }
        
        html += '</div>';
    }
    
    return html;
}

// ===== FUNCIONES DE DESCARGA =====

// Función para descargar el informe de planes seleccionados
function downloadSelectedPlansReport() {
    // Obtener los planes seleccionados
    const selectedPlans = window.selectedPlans || [];
    
    if (selectedPlans.length === 0) {
        alert('Por favor, selecciona al menos un plan para descargar el informe.');
        return;
    }

    // Obtener los datos del cliente
    let datosCliente = window.datosFormulario || {};
    
    if (!datosCliente.tipoCobertura) {
        const form = document.getElementById('cotization-form');
        if (form) {
            const formData = new FormData(form);
            datosCliente = {
                tipoCobertura: formData.get('tipo-cobertura') || window.selectedOption || 'solo',
                edadTitular: formData.get('edad-titular') || formData.get('edad'),
                edadPareja: formData.get('edad-pareja') || formData.get('edadPareja'),
                cantidadHijos: formData.get('cantidad-hijos') || formData.get('cantidadHijos'),
                edadesHijos: formData.get('edades-hijos') || formData.get('edadesHijos')
            };
        } else {
            datosCliente = {
                tipoCobertura: window.selectedOption || 'solo',
                edadTitular: 30,
                edadPareja: null,
                cantidadHijos: 0,
                edadesHijos: ''
            };
        }
    }

    console.log('Descargando informe para planes:', selectedPlans);

    // Generar el HTML del informe
    const planPrincipal = selectedPlans[0];
    const precio = typeof planPrincipal.price === 'number' ? planPrincipal.price : parseFloat(planPrincipal.price) || 0;
    
    let beneficiosDelPlan = [];
    try {
        beneficiosDelPlan = generateBenefitsForPlan(planPrincipal);
    } catch (e) {
        console.log('Error generando beneficios, usando beneficios por defecto');
        beneficiosDelPlan = [
            { title: 'Cobertura médica integral' },
            { title: 'Atención ambulatoria' },
            { title: 'Estudios médicos' },
            { title: 'Medicamentos con descuento' },
            { title: 'Red nacional de prestadores' },
            { title: 'Atención de urgencias 24/7' }
        ];
    }
    
    // Crear el HTML completo
    const informeHTML = createDownloadableHTML(datosCliente, planPrincipal, selectedPlans, beneficiosDelPlan, precio);
    
    // Generar nombre del archivo
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split('T')[0]; // YYYY-MM-DD
    const tipoCobertura = datosCliente.tipoCobertura || 'plan';
    const nombreArchivo = `OSPADEP_Cotizacion_${tipoCobertura}_${fechaFormateada}.html`;
    
    // Descargar el archivo
    downloadHTML(informeHTML, nombreArchivo);
    
    // Mostrar mensaje de confirmación
    setTimeout(() => {
        alert(`✅ ¡Informe descargado correctamente!\n\nArchivo: ${nombreArchivo}\n\nPuedes abrirlo en cualquier navegador, imprimirlo o compartirlo.`);
    }, 500);
}

// Función para crear el HTML completo descargable
function createDownloadableHTML(datosCliente, planPrincipal, selectedPlans, beneficiosDelPlan, precio) {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OSPADEP - Cotización de Planes de Salud</title>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@700&family=Inter:wght@600&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        /* FORZAR COLORES EXACTOS EN IMPRESIÓN Y PANTALLA */
        *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            box-sizing: border-box;
        }
        
        html, body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-weight: 600;
            line-height: 1.6;
            color: #333333;
            background-color: #f8f9fa;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        /* Barra superior de descarga */
        .download-bar {
            background: linear-gradient(90deg, #7c3aed 60%, #2563eb 100%);
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .download-info {
            display: flex;
            align-items: center;
            gap: 15px;
            font-size: 14px;
        }
        .download-actions {
            display: flex;
            gap: 10px;
        }
        .download-btn {
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .download-btn:hover {
            background: rgba(255,255,255,0.3);
            border-color: rgba(255,255,255,0.5);
        }
        .download-btn.primary {
            background: #60a5fa;
            border-color: #60a5fa;
        }
        .download-btn.primary:hover {
            background: #3b82f6;
            border-color: #3b82f6;
        }
        
        /* ESTILOS OPTIMIZADOS PARA PDF - COMPACTOS Y EFECTIVOS */
        @media print {
            .download-bar { display: none !important; }
            
            /* Configuración de página compacta */
            @page {
                size: A4;
                margin: 0.3cm !important;
            }
            
            /* FORZAR COLORES */
            * { 
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* COMPACTAR DRASTICAMENTE */
            
            /* Logo más pequeño */
            img[style*="height: 400px"] {
                height: 100px !important;
                max-height: 100px !important;
            }
            
            /* Reducir padding en TODAS las celdas */
            td {
                padding: 8px 10px !important;
            }
            
            /* Header principal más compacto */
            td[style*="padding: 40px 20px 60px 20px"] {
                padding: 15px 10px 20px 10px !important;
            }
            
            /* Títulos más pequeños */
            h1 {
                font-size: 20px !important;
                margin: 0 0 8px 0 !important;
                line-height: 1.1 !important;
            }
            
            h2 {
                font-size: 16px !important;
                margin: 0 0 10px 0 !important;
            }
            
            h3 {
                font-size: 14px !important;
                margin: 0 0 8px 0 !important;
            }
            
            /* Tarjeta de membresía ultra compacta */
            div[style*="width: 320px"] {
                width: 200px !important;
                padding: 15px !important;
                margin: 8px 0 15px 0 !important;
            }
            
            /* Iconos y círculos pequeños */
            div[style*="width: 80px; height: 80px"] {
                width: 40px !important;
                height: 40px !important;
                margin: 0 auto 8px !important;
            }
            
            div[style*="width: 50px; height: 50px"] {
                width: 30px !important;
                height: 30px !important;
            }
            
            /* Botones más pequeños */
            a[style*="padding: 18px 40px"] {
                padding: 8px 20px !important;
                font-size: 12px !important;
                margin: 5px 0 !important;
            }
            
            /* Párrafos sin espaciado excesivo */
            p {
                margin: 0 0 5px 0 !important;
                font-size: 12px !important;
                line-height: 1.3 !important;
            }
            
            /* Listas más compactas */
            ul {
                margin: 0 !important;
                padding-left: 15px !important;
            }
            
            li {
                margin: 2px 0 !important;
                font-size: 11px !important;
                line-height: 1.2 !important;
            }
            
            /* Grids y divs más juntos */
            div[style*="padding: 25px"] {
                padding: 10px !important;
            }
            
            div[style*="padding: 30px"] {
                padding: 12px !important;
            }
            
            div[style*="margin: 15px 0"] {
                margin: 5px 0 !important;
            }
            
            div[style*="margin: 20px 0"] {
                margin: 8px 0 !important;
            }
            
            /* Tablas de comparación compactas */
            div[style*="max-width: 600px"] div {
                margin: 5px 0 !important;
                padding: 10px !important;
            }
            
            /* Proceso de 3 pasos súper compacto */
            table[style*="margin-bottom: 50px"] {
                margin-bottom: 10px !important;
            }
            
            div[style*="margin-bottom: 30px"] {
                margin-bottom: 8px !important;
            }
            
            /* Footer compacto */
            td[style*="color: #94a3b8"] {
                padding: 10px !important;
                font-size: 10px !important;
            }
            
            /* Evitar páginas vacías */
            table {
                page-break-inside: avoid !important;
                margin: 0 !important;
            }
            
            /* Forzar colores específicos */
            *[style*="background-color: #1e3a8a"] {
                background: #1e3a8a !important;
                background-image: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%) !important;
            }
            
            *[style*="background: #60a5fa"] {
                background: #60a5fa !important;
            }
            
            *[style*="background: #3b82f6"] {
                background: #3b82f6 !important;
            }
            
            *[style*="color: #ffffff"] { color: #ffffff !important; }
            *[style*="color: #1e40af"] { color: #1e40af !important; }
            *[style*="color: #64748b"] { color: #64748b !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; font-weight: 600; line-height: 1.6; color: #333333; background-color: #f8f9fa;">
    
    <!-- Logo Section -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
        <tr>
            <td style="padding: 30px 20px; text-align: center;">
                <img src="https://raw.githubusercontent.com/dantemoss/CotizadorWebOSPADEP-assets/main/logoOSPADEP16.9.jpg" alt="OSPADEP Logo" style="height: 400px; width: auto; display: block; margin: 0 auto;" onerror="this.style.display='none';var alt=document.createElement('div');alt.style.color='#1e40af';alt.style.fontWeight='bold';alt.style.fontSize='22px';alt.style.margin='10px auto';alt.style.textAlign='center';alt.innerText='OSPADEP';this.parentNode.appendChild(alt);">
            </td>
        </tr>
    </table>

    <!-- Header Content Section -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1e3a8a; background-image: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%);">
        <tr>
            <td style="padding: 40px 20px 60px 20px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 42px; font-weight: 700; margin: 0 0 20px 0; line-height: 1.2; text-shadow: 0 2px 4px rgba(0,0,0,0.1); font-family: 'Manrope', sans-serif;">
                    Cobertura médica para<br>
                    <span style="color: #bfdbfe;">tu vida en movimiento</span>
                </h1>
                
                <!-- Membership Card -->
                <div style="display: inline-block; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 20px; padding: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); width: 320px; margin: 20px 0 60px 0; position: relative;">
                    <div style="color: #1e40af; font-weight: 700; font-size: 20px; margin-bottom: 15px; font-family: 'Manrope', sans-serif;">OSPADEP</div>
                    <div style="color: #64748b; font-size: 16px; margin-bottom: 20px;">Plan ${planPrincipal.name.replace(/_/g, ' ')}</div>
                    <div style="color: #1e40af; font-size: 24px; font-weight: 600; font-family: 'Manrope', sans-serif;">$${precio.toLocaleString('es-AR')}</div>
                    <div style="color: #64748b; font-size: 14px; margin-top: 8px;">por mes</div>
                    <div style="position: absolute; top: 30px; right: 30px; width: 50px; height: 50px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-size: 24px; font-weight: 700;">+</span>
                    </div>
                </div>
                
                <!-- CTA Button with proper spacing -->
                <div style="margin-top: 40px;">
                    <a href="tel:+5411-1234-5678" style="display: inline-block; background: #60a5fa; color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: 700; font-size: 18px; box-shadow: 0 6px 20px rgba(96, 165, 250, 0.4); font-family: 'Manrope', sans-serif; text-transform: uppercase; letter-spacing: 1px;">
                        LLAMAR AHORA
                    </a>
                </div>
            </td>
        </tr>
    </table>

    <!-- Plan Details Section -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td style="padding: 40px 20px; text-align: center;">
                <h2 style="color: #1e40af; font-size: 28px; font-weight: 700; margin: 0 0 30px 0; font-family: 'Manrope', sans-serif;">Tu plan seleccionado</h2>
                
                <div style="background: #ffffff; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 2px solid #3b82f6; position: relative; max-width: 500px; margin: 0 auto;">
                    <div style="position: absolute; top: -10px; right: 20px; background: #3b82f6; color: white; padding: 5px 15px; border-radius: 15px; font-size: 12px; font-weight: 600;">TU PLAN</div>
                    <h3 style="color: #1e40af; font-size: 24px; font-weight: 700; margin: 0 0 15px 0; font-family: 'Manrope', sans-serif;">${planPrincipal.prestador.replace(/_/g, ' ')} - ${planPrincipal.name.replace(/_/g, ' ')}</h3>
                    <div style="color: #3b82f6; font-size: 32px; font-weight: 700; margin: 0 0 20px 0;">$${precio.toLocaleString('es-AR')}<span style="font-size: 16px; color: #64748b;">/mes</span></div>
                    
                    <!-- Beneficios -->
                    <div style="text-align: left;">
                        <h4 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 15px 0;">Beneficios incluidos:</h4>
                        <ul style="color: #64748b; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                            ${beneficiosDelPlan.slice(0, 6).map(beneficio => `<li style="margin: 8px 0;">${beneficio.title}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Comparison Section -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
        <tr>
            <td style="padding: 40px 20px; text-align: center;">
                <h2 style="color: #1e40af; font-size: 28px; font-weight: 700; margin: 0 0 30px 0; font-family: 'Manrope', sans-serif;">Comparación con otros planes</h2>
                
                <div style="max-width: 600px; margin: 0 auto;">
                ${selectedPlans.map((plan, index) => {
                    const planPrecio = typeof plan.price === 'number' ? plan.price : parseFloat(plan.price) || 0;
                    const isSelected = index === 0;
                    const borderStyle = isSelected ? 'border: 2px solid #3b82f6;' : 'border: 2px solid #e2e8f0;';
                    const badge = isSelected ? '<div style="position: absolute; top: -10px; right: 20px; background: #3b82f6; color: white; padding: 5px 15px; border-radius: 15px; font-size: 12px; font-weight: 600;">SELECCIONADO</div>' : '';
                    // Obtener beneficios: primero plan.beneficios, luego plan.features, si no hay ninguno, array vacío
                    let beneficios = [];
                    if (plan.beneficios && plan.beneficios.length > 0) {
                        beneficios = plan.beneficios;
                    } else if (plan.features && plan.features.length > 0) {
                        beneficios = plan.features;
                    }
                    return `
                    <div style="background: #ffffff; border-radius: 16px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin: 15px 0; position: relative; ${borderStyle}">
                        ${badge}
                        <h3 style="color: #1e40af; font-size: 18px; font-weight: 700; margin: 0 0 10px 0;">${plan.prestador.replace(/_/g, ' ')} - ${plan.name.replace(/_/g, ' ')}</h3>
                        <div style="color: #3b82f6; font-size: 24px; font-weight: 700;">$${planPrecio.toLocaleString('es-AR')}<span style="font-size: 14px; color: #64748b;">/mes</span></div>
                        <ul style='color: #64748b; font-size: 14px; line-height: 1.8; margin: 10px 0 0 18px; padding: 0;'>${beneficios.map(b=>`<li>${typeof b === 'string' ? b : (b.title || '')}</li>`).join('')}</ul>
                    </div>
                    `;
                }).join('')}
                </div>
            </td>
        </tr>
    </table>

    <!-- Services Section -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td style="padding: 40px 20px; text-align: center;">
                <h2 style="color: #1e40af; font-size: 28px; font-weight: 700; margin: 0 0 20px 0; font-family: 'Manrope', sans-serif;">Accedé a estudios y tratamientos</h2>
                <p style="color: #64748b; font-size: 16px; margin: 0 0 40px 0;">con la mejor tecnología</p>
                
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; max-width: 600px; margin: 0 auto;">
                    <div style="background: #ffffff; border-radius: 16px; padding: 25px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08); flex: 1; min-width: 250px;">
                        <div style="background: #dbeafe; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-pills" style="color: #3b82f6; font-size: 32px;"></i>
                        </div>
                        <h4 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">Medicamentos</h4>
                        <p style="color: #64748b; font-size: 14px; margin: 0;">Descuentos especiales en farmacias adheridas</p>
                    </div>
                    <div style="background: #ffffff; border-radius: 16px; padding: 25px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08); flex: 1; min-width: 250px;">
                        <div style="background: #dbeafe; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-x-ray" style="color: #3b82f6; font-size: 32px;"></i>
                        </div>
                        <h4 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">Estudios</h4>
                        <p style="color: #64748b; font-size: 14px; margin: 0;">Laboratorio y diagnóstico por imágenes</p>
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Beneficios Generales Section -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
                    <tr>
                        <td>
                            <h2 style="color: #1e40af; font-size: 28px; font-weight: 700; text-align: center; margin: 0 0 40px 0; font-family: 'Manrope', sans-serif;">Beneficios de tu cobertura OSPADEP</h2>
                            
                            <!-- Grid de beneficios -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <!-- Primera fila -->
                                <tr>
                                    <td style="width: 50%; vertical-align: top; padding: 0 10px 20px 0;">
                                        <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #3b82f6; height: 100%;">
                                            <div style="color: #3b82f6; font-size: 24px; margin-bottom: 10px;">
                                                <i class="fas fa-heartbeat"></i>
                                            </div>
                                            <h4 style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Cobertura médica integral</h4>
                                            <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">Consultas, internaciones, cirugías y tratamientos con amplia red de prestadores</p>
                                        </div>
                                    </td>
                                    <td style="width: 50%; vertical-align: top; padding: 0 0 20px 10px;">
                                        <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #3b82f6; height: 100%;">
                                            <div style="color: #3b82f6; font-size: 24px; margin-bottom: 10px;">
                                                <i class="fas fa-user-md"></i>
                                            </div>
                                            <h4 style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Atención ambulatoria</h4>
                                            <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">Consultorios externos, especialistas y estudios diagnósticos sin límites</p>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Segunda fila -->
                                <tr>
                                    <td style="width: 50%; vertical-align: top; padding: 0 10px 20px 0;">
                                        <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #3b82f6; height: 100%;">
                                            <div style="color: #3b82f6; font-size: 24px; margin-bottom: 10px;">
                                                <i class="fas fa-stethoscope"></i>
                                            </div>
                                            <h4 style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Urgencias 24/7</h4>
                                            <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">Atención de emergencias las 24 horas en toda la red nacional</p>
                                        </div>
                                    </td>
                                    <td style="width: 50%; vertical-align: top; padding: 0 0 20px 10px;">
                                        <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #3b82f6; height: 100%;">
                                            <div style="color: #3b82f6; font-size: 24px; margin-bottom: 10px;">
                                                <i class="fas fa-pills"></i>
                                            </div>
                                            <h4 style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Medicamentos con descuento</h4>
                                            <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">Hasta 80% de descuento en farmacias de todo el país</p>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Tercera fila -->
                                <tr>
                                    <td style="width: 50%; vertical-align: top; padding: 0 10px 0 0;">
                                        <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #3b82f6; height: 100%;">
                                            <div style="color: #3b82f6; font-size: 24px; margin-bottom: 10px;">
                                                <i class="fas fa-map-marker-alt"></i>
                                            </div>
                                            <h4 style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Cobertura nacional</h4>
                                            <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">Red de prestadores en CABA, GBA y principales ciudades del país</p>
                                        </div>
                                    </td>
                                    <td style="width: 50%; vertical-align: top; padding: 0 0 0 10px;">
                                        <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #3b82f6; height: 100%;">
                                            <div style="color: #3b82f6; font-size: 24px; margin-bottom: 10px;">
                                                <i class="fas fa-family"></i>
                                            </div>
                                            <h4 style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Planes familiares</h4>
                                            <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">Cobertura para toda la familia con precios preferenciales</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Multimedia Section -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
                    <tr>
                        <td>
                            <h2 style="color: #1e40af; font-size: 28px; font-weight: 700; text-align: center; margin: 0 0 40px 0; font-family: 'Manrope', sans-serif;">Cuidamos tu bienestar en cada etapa</h2>
                            
                            <!-- Images Grid -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="width: 50%; vertical-align: top;">
                                        <img src="https://i.postimg.cc/gJ1mLSJP/foto-Seccion-Media.png" alt="Consulta médica moderna" style="width: 100%; height: auto; border-radius: 8px;">
                                    </td>
                                    <td style="width: 50%; vertical-align: top; padding-left: 10px;">
                                        <img src="https://i.postimg.cc/ZKKx941r/Imagen-Seccion2.png" alt="Tecnología médica avanzada" style="width: 100%; height: auto; border-radius: 8px;">
                                    </td>
                                </tr>
                            </table>
                            
                            <div style="text-align: center; margin-top: 30px;">
                                <p style="color: #64748b; font-size: 16px; margin: 0;">Atención personalizada con la mejor tecnología médica</p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Final CTA Section with Steps -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1e3a8a; background-image: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);">
        <tr>
            <td style="padding: 50px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
                    <tr>
                        <td style="text-align: center;">
                            <h2 style="color: #ffffff; font-size: 36px; font-weight: 700; font-family: 'Manrope', sans-serif; margin: 0 0 20px 0;">Acceso completo a salud de calidad</h2>
                            <p style="color: #bfdbfe; font-size: 20px; font-family: 'Inter', sans-serif; font-weight: 600; margin: 0 0 60px 0;">Tu afiliación en 3 pasos simples</p>
                            
                            <!-- 3 Steps Process -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 50px; max-width: 520px; margin-left: auto; margin-right: auto;">
                                <tr>
                                    <td style="width: 28%; text-align: center; vertical-align: top; padding: 0 10px;">
                                        <!-- Step 1 -->
                                        <div style="margin-bottom: 30px;">
                                            <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: table; border: 2px solid rgba(255,255,255,0.3);">
                                                <div style="display: table-cell; vertical-align: middle; text-align: center;">
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ffffff;">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                        <circle cx="12" cy="7" r="4"></circle>
                                                    </svg>
                                                </div>
                                            </div>
                                            <h4 style="color: #ffffff; font-size: 16px; font-weight: 600; font-family: 'Manrope', sans-serif; margin: 0 0 8px 0;">Colocá tu información</h4>
                                            <p style="color: #bfdbfe; font-size: 14px; font-family: 'Inter', sans-serif; font-weight: 600; margin: 0; line-height: 1.4;">Datos básicos y contacto</p>
                                        </div>
                                    </td>
                                    
                                    <td style="width: 11%; text-align: center; vertical-align: middle;">
                                        <!-- Arrow 1 -->
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #bfdbfe;">
                                            <polyline points="9,18 15,12 9,6"></polyline>
                                        </svg>
                                    </td>
                                    
                                    <td style="width: 28%; text-align: center; vertical-align: top; padding: 0 10px;">
                                        <!-- Step 2 -->
                                        <div style="margin-bottom: 30px;">
                                            <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: table; border: 2px solid rgba(255,255,255,0.3);">
                                                <div style="display: table-cell; vertical-align: middle; text-align: center;">
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ffffff;">
                                                        <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4m6-6h4a2 2 0 0 1 2 2v3c0 1.1-.9 2-2 2h-4m-6 0V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <h4 style="color: #ffffff; font-size: 16px; font-weight: 600; font-family: 'Manrope', sans-serif; margin: 0 0 8px 0;">Elegí tu plan</h4>
                                            <p style="color: #bfdbfe; font-size: 14px; font-family: 'Inter', sans-serif; font-weight: 600; margin: 0; line-height: 1.4;">Regular o Premium</p>
                                        </div>
                                    </td>
                                    
                                    <td style="width: 11%; text-align: center; vertical-align: middle;">
                                        <!-- Arrow 2 -->
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #bfdbfe;">
                                            <polyline points="9,18 15,12 9,6"></polyline>
                                        </svg>
                                    </td>
                                    
                                    <td style="width: 28%; text-align: center; vertical-align: top; padding: 0 10px;">
                                        <!-- Step 3 -->
                                        <div style="margin-bottom: 30px;">
                                            <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: table; border: 2px solid rgba(255,255,255,0.3);">
                                                <div style="display: table-cell; vertical-align: middle; text-align: center;">
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ffffff;">
                                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <h4 style="color: #ffffff; font-size: 16px; font-weight: 600; font-family: 'Manrope', sans-serif; margin: 0 0 8px 0;">Hablá con un asesor</h4>
                                            <p style="color: #bfdbfe; font-size: 14px; font-family: 'Inter', sans-serif; font-weight: 600; margin: 0; line-height: 1.4;">y afiliate al instante</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <div style="text-align: center;">
                                <a href="tel:+5411-1234-5678" style="display: inline-block; background: #60a5fa; color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: 700; font-size: 18px; font-family: 'Manrope', sans-serif; box-shadow: 0 6px 20px rgba(96, 165, 250, 0.4); text-transform: uppercase; letter-spacing: 1px;">
                                    INICIAR AFILIACIÓN
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Footer -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1e293b;">
        <tr>
            <td style="padding: 40px 20px; text-align: center; color: #94a3b8;">
                <div style="margin-bottom: 20px;">
                    <div style="font-size: 18px; color: #ffffff; font-weight: 600; margin-bottom: 10px;">¿Necesitas más información?</div>
                    <div style="font-size: 14px; margin-bottom: 20px;">Contactanos: 0800-345-6732 | comercial@ospadep.com</div>
                </div>
                
                <div style="color: #64748b; font-size: 12px; line-height: 1.5;">
                    *Cotización generada automáticamente por el sistema OSPADEP. Vigencia: 72 horas hábiles.
                </div>
            </td>
        </tr>
    </table>

    <script>
        // Función para descargar el HTML actual como PDF (usando print)
        function downloadCurrentHTML() {
            // Instrucciones detalladas para el usuario
            alert('📋 INSTRUCCIONES PARA PDF COMPACTO (2-3 páginas):\\n\\n' +
                  '📋 CONFIGURACIÓN EXACTA PARA PDF PERFECTO:\\n\\n' +
                  '1. ✅ Se abrirá el diálogo de impresión\\n' +
                  '2. 🎯 Destino: "Guardar como PDF"\\n' +
                  '3. ⚙️ En "Más configuraciones" ajustar EXACTAMENTE:\\n' +
                  '   • ✅ "Gráficos de fondo": ACTIVADO\\n' +
                  '   • 📄 Orientación: "Vertical"\\n' +
                  '   • 📏 Escala: "90%" (importante!)\\n' +
                  '   • 📐 Márgenes: "Mínimo"\\n' +
                  '   • 🎨 Asegurar que "Imprimir fondos" esté activado\\n' +
                  '4. 💾 Guardar\\n\\n' +
                  '✨ RESULTADO: PDF compacto de solo 2 páginas con colores perfectos!');
            
            // Abrir diálogo de impresión
            setTimeout(function() {
                window.print();
            }, 1500);
        }
    </script>

        </body>
        </html>
    `;
}

// Función utilitaria para descargar un archivo HTML
function downloadHTML(content, filename) {
    // Crear un blob con el contenido HTML
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    
    // Crear un enlace temporal para la descarga
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Agregar al DOM, hacer clic y remover
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar la URL del objeto
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 100);
}

// Función para agregar botón de descarga al informe abierto en nueva ventana
function addDownloadButtonToReport(printWindow, htmlContent) {
    try {
        const doc = printWindow.document;
        
        // Crear barra de descarga
        const downloadBar = doc.createElement('div');
        downloadBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(90deg, #7c3aed 60%, #2563eb 100%);
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-family: system-ui, sans-serif;
        `;
        
        downloadBar.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; font-size: 14px;">
                <i class="fas fa-file-alt"></i>
                <span>Cotización OSPADEP - Informe generado</span>
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="window.print()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
                    <i class="fas fa-print"></i> Imprimir
                </button>
                <button onclick="downloadReportFromWindow()" style="background: #60a5fa; color: white; border: 1px solid #60a5fa; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
                    <i class="fas fa-download"></i> Descargar HTML
                </button>
            </div>
        `;
        
        // Insertar al inicio del body
        doc.body.insertBefore(downloadBar, doc.body.firstChild);
        
        // Agregar margen al contenido para que no se superponga
        doc.body.style.paddingTop = '70px';
        
        // Función para descargar desde la ventana
        printWindow.downloadReportFromWindow = function() {
            // Obtener el HTML completo de la ventana
            const fullHTML = doc.documentElement.outerHTML;
            
            // Crear blob y descargar
            const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
            const link = doc.createElement('a');
            const url = URL.createObjectURL(blob);
            
            const fechaActual = new Date();
            const fechaFormateada = fechaActual.toISOString().split('T')[0];
            const nombreArchivo = `OSPADEP_Cotizacion_${fechaFormateada}.html`;
            
            link.href = url;
            link.download = nombreArchivo;
            link.click();
            
            URL.revokeObjectURL(url);
        };
        
    } catch (error) {
        console.log('Error agregando botón de descarga:', error);
    }
}

// ===== PLANTILLA DE EMAIL COMPACTA =====

// Función para generar email compacto estilo Swiss Medical
function generateCompactEmailTemplate(datosCliente, planSeleccionado) {
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleDateString('es-AR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const precio = typeof planSeleccionado.price === 'number' ? 
        planSeleccionado.price : parseFloat(planSeleccionado.price) || 0;
    
    const prestadorLabel = getPrestadorLabel(planSeleccionado.type);
    const planName = planSeleccionado.name.replace(/_/g, ' ');
    
    // Generar ID único para la cotización
    const cotizacionId = generateUniqueQuoteId();
    
    // Guardar la cotización en localStorage para recuperarla después
    saveQuoteToStorage(cotizacionId, {
        datosCliente: datosCliente,
        planSeleccionado: planSeleccionado,
        planesSeleccionados: window.selectedPlans || [planSeleccionado],
        fechaGeneracion: fechaActual.toISOString()
    });

    }

// Función para generar ID único de cotización
function generateUniqueQuoteId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6);
    return `COT-${timestamp}-${random}`.toUpperCase();
}

// Función para guardar cotización en localStorage
function saveQuoteToStorage(quoteId, quoteData) {
    try {
        const quotes = JSON.parse(localStorage.getItem('ospadep_quotes') || '{}');
        quotes[quoteId] = quoteData;
        localStorage.setItem('ospadep_quotes', JSON.stringify(quotes));
        console.log('Cotización guardada:', quoteId);
    } catch (error) {
        console.error('Error guardando cotización:', error);
    }
}

// Función para recuperar cotización del localStorage
function getQuoteFromStorage(quoteId) {
    try {
        const quotes = JSON.parse(localStorage.getItem('ospadep_quotes') || '{}');
        return quotes[quoteId] || null;
    } catch (error) {
        console.error('Error recuperando cotización:', error);
        return null;
    }
}

// Función para generar email compacto de planes seleccionados
function generateCompactEmail() {
    const selectedPlans = window.selectedPlans || [];
    
    if (selectedPlans.length === 0) {
        alert('Por favor, selecciona al menos un plan para generar el email.');
        return;
    }

    // Obtener datos del cliente
    let datosCliente = window.datosFormulario || {};
    
    if (!datosCliente.tipoCobertura) {
        const form = document.getElementById('cotization-form');
        if (form) {
            const formData = new FormData(form);
            datosCliente = {
                tipoCobertura: formData.get('tipo-cobertura') || window.selectedOption || 'solo',
                edadTitular: formData.get('edad-titular') || formData.get('edad'),
                edadPareja: formData.get('edad-pareja') || formData.get('edadPareja'),
                cantidadHijos: formData.get('cantidad-hijos') || formData.get('cantidadHijos'),
                edadesHijos: formData.get('edades-hijos') || formData.get('edadesHijos')
            };
        } else {
            datosCliente = {
                tipoCobertura: window.selectedOption || 'solo',
                edadTitular: 30,
                edadPareja: null,
                cantidadHijos: 0,
                edadesHijos: ''
            };
        }
    }

    // Usar el primer plan seleccionado como principal
    const planPrincipal = selectedPlans[0];
    
    // NUEVA ESTRATEGIA: SIMPLE Y DIRECTA
    // 1. Generar el HTML del email
    const emailHTML = generateCompactEmailTemplate(datosCliente, planPrincipal);
    
    // 2. Información básica del plan
    const planName = planPrincipal.name.replace(/_/g, ' ');
    const planPrice = typeof planPrincipal.price === 'number' ? 
        planPrincipal.price.toLocaleString('es-AR') : 
        planPrincipal.price.toString();
    
    // 3. Crear ventana simple con botones funcionales
    const emailWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
    
    if (!emailWindow) {
        alert('Error: No se pudo abrir la ventana. Verifica los permisos de ventanas emergentes.');
        return;
    }

    // 4. Escribir contenido básico
    emailWindow.document.open();
    emailWindow.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>OSPADEP Email</title>');
    emailWindow.document.write('<style>body{margin:0;font-family:Arial,sans-serif}.toolbar{background:#1e40af;color:white;padding:15px;text-align:center}.btn{background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3);padding:10px 15px;margin:5px;border-radius:5px;cursor:pointer}.btn:hover{background:rgba(255,255,255,0.3)}.content{padding:20px}</style>');
    emailWindow.document.write('</head><body>');
    emailWindow.document.write('<div class="toolbar">');
    emailWindow.document.write('<h3>🛠️ Email OSPADEP - ' + planName + '</h3>');
    emailWindow.document.write('<button class="btn" onclick="copyEmail()">📋 Copiar HTML</button>');
    emailWindow.document.write('<button class="btn" onclick="copyPlainText()">📄 Copiar Texto</button>');
    emailWindow.document.write('<button class="btn" onclick="openGmail()">📧 Gmail</button>');
    emailWindow.document.write('<button class="btn" onclick="openOutlook()">📨 Outlook</button>');
    emailWindow.document.write('<button class="btn" onclick="shareWhatsApp()">📱 WhatsApp</button>');
    emailWindow.document.write('</div>');
    emailWindow.document.write('<div class="content">');
    emailWindow.document.write(emailHTML);
    emailWindow.document.write('</div>');
    
    // 5. NUEVA ESTRATEGIA: Usar localStorage para evitar problemas de escape
    // Guardar el contenido del email en localStorage
    const emailKey = 'ospadep_email_' + Date.now();
    localStorage.setItem(emailKey, emailHTML);
    localStorage.setItem(emailKey + '_planName', planName);
    localStorage.setItem(emailKey + '_planPrice', planPrice);
    
    // Crear JavaScript sin problemas de escape
    emailWindow.document.write('<script>');
    emailWindow.document.write('var emailKey = "' + emailKey + '";');
    emailWindow.document.write('var emailContent = localStorage.getItem(emailKey);');
    emailWindow.document.write('var planName = localStorage.getItem(emailKey + "_planName");');
    emailWindow.document.write('var planPrice = localStorage.getItem(emailKey + "_planPrice");');
    
    emailWindow.document.write('function copyEmail() {');
    emailWindow.document.write('  if (navigator.clipboard && emailContent) {');
    emailWindow.document.write('    var blob = new Blob([emailContent], {type: "text/html"});');
    emailWindow.document.write('    var clipboardItem = new ClipboardItem({"text/html": blob, "text/plain": new Blob([emailContent.replace(/<[^>]*>/g, "")], {type: "text/plain"})});');
    emailWindow.document.write('    navigator.clipboard.write([clipboardItem]).then(function() {');
    emailWindow.document.write('      alert("✅ Email copiado como HTML formateado");');
    emailWindow.document.write('    }).catch(function() {');
    emailWindow.document.write('      fallbackCopyAsHTML();');
    emailWindow.document.write('    });');
    emailWindow.document.write('  } else {');
    emailWindow.document.write('    fallbackCopyAsHTML();');
    emailWindow.document.write('  }');
    emailWindow.document.write('}');
    
    emailWindow.document.write('function fallbackCopyAsHTML() {');
    emailWindow.document.write('  var div = document.createElement("div");');
    emailWindow.document.write('  div.innerHTML = emailContent;');
    emailWindow.document.write('  div.style.position = "absolute";');
    emailWindow.document.write('  div.style.left = "-9999px";');
    emailWindow.document.write('  document.body.appendChild(div);');
    emailWindow.document.write('  var range = document.createRange();');
    emailWindow.document.write('  range.selectNodeContents(div);');
    emailWindow.document.write('  var selection = window.getSelection();');
    emailWindow.document.write('  selection.removeAllRanges();');
    emailWindow.document.write('  selection.addRange(range);');
    emailWindow.document.write('  try {');
    emailWindow.document.write('    document.execCommand("copy");');
    emailWindow.document.write('    alert("✅ Email copiado (versión compatible)");');
    emailWindow.document.write('  } catch (err) {');
    emailWindow.document.write('    alert("❌ Error al copiar. Selecciona el contenido manualmente.");');
    emailWindow.document.write('  }');
    emailWindow.document.write('  document.body.removeChild(div);');
    emailWindow.document.write('  selection.removeAllRanges();');
    emailWindow.document.write('}');
    
    emailWindow.document.write('function copyPlainText() {');
    emailWindow.document.write('  var plainText = emailContent.replace(/<[^>]*>/g, " ").replace(/\\s+/g, " ").trim();');
    emailWindow.document.write('  if (navigator.clipboard) {');
    emailWindow.document.write('    navigator.clipboard.writeText(plainText).then(function() {');
    emailWindow.document.write('      alert("✅ Texto plano copiado");');
    emailWindow.document.write('    });');
    emailWindow.document.write('  } else {');
    emailWindow.document.write('    var textarea = document.createElement("textarea");');
    emailWindow.document.write('    textarea.value = plainText;');
    emailWindow.document.write('    document.body.appendChild(textarea);');
    emailWindow.document.write('    textarea.select();');
    emailWindow.document.write('    document.execCommand("copy");');
    emailWindow.document.write('    document.body.removeChild(textarea);');
    emailWindow.document.write('    alert("✅ Texto plano copiado");');
    emailWindow.document.write('  }');
    emailWindow.document.write('}');
    
    emailWindow.document.write('function openGmail() {');
    emailWindow.document.write('  var subject = encodeURIComponent("Cotización OSPADEP - " + planName);');
    emailWindow.document.write('  window.open("https://mail.google.com/mail/?view=cm&su=" + subject, "_blank");');
    emailWindow.document.write('  setTimeout(function(){ alert("📧 Gmail abierto. Usa el botón COPIAR EMAIL y pégalo."); }, 1000);');
    emailWindow.document.write('}');
    
    emailWindow.document.write('function openOutlook() {');
    emailWindow.document.write('  var subject = encodeURIComponent("Cotización OSPADEP - " + planName);');
    emailWindow.document.write('  window.open("https://outlook.live.com/mail/0/deeplink/compose?subject=" + subject, "_blank");');
    emailWindow.document.write('  setTimeout(function(){ alert("📨 Outlook abierto. Usa el botón COPIAR EMAIL y pégalo."); }, 1000);');
    emailWindow.document.write('}');
    
    emailWindow.document.write('function shareWhatsApp() {');
    emailWindow.document.write('  var message = encodeURIComponent("🏥 COTIZACIÓN OSPADEP\\nPlan: " + planName + "\\nPrecio: $" + planPrice + "/mes\\nContacto: 0800-345-6732");');
    emailWindow.document.write('  window.open("https://wa.me/?text=" + message, "_blank");');
    emailWindow.document.write('}');
    
    // Limpiar localStorage después de 1 hora
    emailWindow.document.write('setTimeout(function() {');
    emailWindow.document.write('  localStorage.removeItem(emailKey);');
    emailWindow.document.write('  localStorage.removeItem(emailKey + "_planName");');
    emailWindow.document.write('  localStorage.removeItem(emailKey + "_planPrice");');
    emailWindow.document.write('}, 3600000);');
    
    emailWindow.document.write('setTimeout(function() {');
    emailWindow.document.write('  alert("🚀 Email listo para usar\\n\\n📋 COPIAR HTML: Para emails que soportan formato\\n📄 COPIAR TEXTO: Para emails básicos\\n📧 Luego abre Gmail/Outlook y pega el contenido");');
    emailWindow.document.write('}, 500);');
    emailWindow.document.write('</script>');
    
    emailWindow.document.write('</body></html>');
    emailWindow.document.close();
    emailWindow.focus();

}

// Función para generar y guardar el HTML de cotización completa
function generateAndSaveCompleteQuote() {
    if (!window.selectedPlans || window.selectedPlans.length === 0) {
        console.log('No hay planes seleccionados para generar cotización');
        return;
    }

    // Obtener datos del cliente
    let datosCliente = window.datosFormulario || {};
    
    if (!datosCliente.tipoCobertura) {
        const form = document.getElementById('cotization-form');
        if (form) {
            const formData = new FormData(form);
            datosCliente = {
                tipoCobertura: formData.get('tipo-cobertura') || window.selectedOption || 'solo',
                edadTitular: formData.get('edad-titular') || formData.get('edad'),
                edadPareja: formData.get('edad-pareja') || formData.get('edadPareja'),
                cantidadHijos: formData.get('cantidad-hijos') || formData.get('cantidadHijos'),
                edadesHijos: formData.get('edades-hijos') || formData.get('edadesHijos')
            };
        } else {
            datosCliente = {
                tipoCobertura: window.selectedOption || 'solo',
                edadTitular: 30,
                edadPareja: null,
                cantidadHijos: 0,
                edadesHijos: ''
            };
        }
    }

    // Usar el primer plan seleccionado como principal
    const planPrincipal = window.selectedPlans[0];
    const beneficiosDelPlan = planPrincipal.features || [];
    const precio = planPrincipal.price || planPrincipal._precioFinal || 0;
    
    // Generar el HTML completo usando la función existente
    const htmlCompleto = createDownloadableHTML(datosCliente, planPrincipal, window.selectedPlans, beneficiosDelPlan, precio);
    
    // Guardar en localStorage con timestamp
    const quoteId = 'complete_quote_' + Date.now();
    localStorage.setItem(quoteId, htmlCompleto);
    localStorage.setItem('last_complete_quote_id', quoteId);
    
    console.log('HTML de cotización completa generado y guardado:', quoteId);
    return quoteId;
}



// Función de respaldo para copiar HTML al portapapeles
function fallbackCopyHTMLToClipboard(htmlContent) {
    // Crear un elemento temporal para copiar HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-999999px';
    tempDiv.style.top = '-999999px';
    document.body.appendChild(tempDiv);
    
    // Seleccionar el contenido
    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccessMessage('HTML formateado copiado al portapapeles');
        } else {
            // Si falla, intentar con texto plano
            const plainText = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            fallbackCopyTextToClipboard(plainText);
        }
    } catch (err) {
        // Si falla, intentar con texto plano
        const plainText = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        fallbackCopyTextToClipboard(plainText);
    }
    
    // Limpiar
    selection.removeAllRanges();
    document.body.removeChild(tempDiv);
}

// Función de respaldo para copiar texto plano al portapapeles
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccessMessage('Texto copiado al portapapeles');
        } else {
            alert('❌ No se pudo copiar al portapapeles. Por favor, selecciona el texto manualmente.');
        }
    } catch (err) {
        alert('❌ Error al copiar al portapapeles. Por favor, selecciona el texto manualmente.');
    }
    
    document.body.removeChild(textArea);
}

// Función para generar HTML compacto con beneficios comparativos para email
function generateCompactEmailWithBenefits() {
    if (!window.selectedPlans || window.selectedPlans.length === 0) {
        alert('Por favor, selecciona al menos un plan para generar el email.');
        return;
    }

    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleDateString('es-AR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    // Generar HTML de los planes con beneficios
    let planesHTML = '';
    let totalPrecio = 0;

    window.selectedPlans.forEach((plan, index) => {
        const precio = plan.precioFinal || plan.price || plan._precioFinal || 0;
        const precioFormateado = typeof precio === 'number' ? 
            precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) : 
            '$' + precio.toString();
        
        totalPrecio += typeof precio === 'number' ? precio : parseFloat(precio) || 0;
        
        const prestadorLabel = getPrestadorLabel(plan.type);
        const planName = plan.name.replace(/_/g, ' ');
        
        // Generar lista de beneficios
        let beneficiosHTML = '';
        if (plan.features && plan.features.length > 0) {
            beneficiosHTML = '<ul style="margin: 10px 0; padding-left: 20px; text-align: left;">';
            plan.features.forEach(feature => {
                beneficiosHTML += `<li style="margin: 5px 0; color: #374151; font-size: 14px;">${feature}</li>`;
            });
            beneficiosHTML += '</ul>';
        }

        planesHTML += `
    <div style="background: white; border: 2px solid #e5e7eb; border-radius: 10px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin-bottom: 10px;">
            <tr>
                <td style="font-size: 18px; font-weight: 600; color: #1e40af; padding: 0 0 0 0; white-space:nowrap;">
                    ${planName}<br>
                    <span style="color: #6b7280; font-size: 14px; font-weight: 400;">${prestadorLabel}</span>
                </td>
                <td style="font-size: 24px; font-weight: 700; color: #059669; text-align: right; white-space:nowrap; padding-left: 40px; min-width: 120px;">
                    ${precioFormateado}
                </td>
            </tr>
        </table>
        <div style="margin-top: 15px;">
            <h4 style="color: #374151; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">Beneficios incluidos:</h4>
            ${beneficiosHTML}
        </div>
    </div>
`;
    });

    const totalFormateado = totalPrecio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

    // Calcular aportes solo una vez (primer plan con _totalAportes > 0)
    let aporteUnico = 0;
    for (let i = 0; i < window.selectedPlans.length; i++) {
        const plan = window.selectedPlans[i];
        if (plan._totalAportes && plan._totalAportes > 0) {
            aporteUnico = plan._totalAportes;
            break;
        }
    }
    let totalSectionHTML = '';
    if (aporteUnico > 0) {
        totalSectionHTML = `<div class="total-section"><h3>💸 Aportes descontados</h3><div class="total-price">$${aporteUnico.toLocaleString('es-AR')}</div></div>`;
    } else {
        totalSectionHTML = `<div class="total-section"><h3>¡Descontá con tus aportes!</h3></div>`;
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            padding: 0;
            text-align: center;
        }
        .header img {
            width: 100%;
            height: auto;
            display: block;
            border-radius: 12px 12px 0 0;
        }
        .content {
            padding: 30px;
        }
        .plans-section {
            margin-top: 20px;
        }
        .plans-section h3 {
            color: #1e40af;
            font-size: 20px;
            margin-bottom: 20px;
            text-align: center;
        }
        .total-section {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-top: 25px;
            text-align: center;
        }
        .total-section h3 {
            margin: 0 0 10px 0;
            font-size: 20px;
        }
        .total-price {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
        }
        .contact-section {
            background: #f3f4f6;
            border-radius: 8px;
            padding: 20px;
            margin-top: 25px;
            text-align: center;
        }
        .contact-section h3 {
            color: #1e40af;
            margin-top: 0;
        }
        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .contact-item {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
        }
        .contact-item strong {
            color: #1e40af;
            display: block;
            margin-bottom: 5px;
        }
        .footer {
            background: #1f2937;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .header {
                padding: 20px;
            }
            .content {
                padding: 20px;
            }
            .contact-info {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container" style="max-width: 420px; width: 100%; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(30,64,175,0.08); overflow: hidden;">
        <div class="header">
            <img src="https://raw.githubusercontent.com/dantemoss/CotizadorWebOSPADEP-assets/main/logoOSPADEP16.9.jpg"
            alt="OSPADEP"
            style="width:80%; max-width:200px; height:auto; display:block; margin: 0 auto 18px auto; border-radius: 14px;"
            onerror="this.style.display='none';var alt=document.createElement('div');alt.style.color='#1e40af';alt.style.fontWeight='bold';alt.style.fontSize='22px';alt.style.margin='10px auto';alt.style.textAlign='center';alt.innerText='OSPADEP';this.parentNode.appendChild(alt);">
        </div>
        
        <div class="content">
            <div class="plans-section">
                <h3>📋 Cotización de Planes de Salud</h3>
                ${planesHTML}
            </div>
            
            ${totalSectionHTML}
            
            <div class="contact-section">
                <h3>📞 ¿Necesitas más información?</h3>
                <div class="contact-info">
                    <div class="contact-item">
                        <strong>📞 Teléfono</strong>
                        +54 9 11 6625-9009
                    </div>
                    <div class="contact-item">
                        <strong>📧 Email</strong>
                        comercial@ospadep.com
                    </div>
                    <div class="contact-item">
                        <strong>🌐 Web</strong>
                        www.ospadep.com
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            *Cotización generada el ${fechaFormateada} - OSPADEP
        </div>
    </div>
</body>
</html>`;

    // Copiar al portapapeles
    if (navigator.clipboard) {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const clipboardItem = new ClipboardItem({
            'text/html': blob,
            'text/plain': new Blob([htmlContent.replace(/<[^>]*>/g, '')], { type: 'text/plain' })
        });
        
        navigator.clipboard.write([clipboardItem]).then(() => {
            showCopySuccessMessage('✅ HTML con beneficios copiado al portapapeles');
        }).catch(() => {
            fallbackCopyHTMLToClipboard(htmlContent);
        });
    } else {
        fallbackCopyHTMLToClipboard(htmlContent);
    }
}

// Función para mostrar mensaje de éxito
function showCopySuccessMessage(message = 'Copiado al portapapeles') {
    // Crear un mensaje temporal
    const messageElement = document.createElement('div');
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    messageElement.innerHTML = '✅ ' + message;
    
    // Agregar estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(messageElement);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
        if (style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }, 3000);
}

(function(){
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.select-plan-btn');
        if (btn) {
            const card = btn.closest('.plan-card');
            if (!card) return;
            const planName = card.getAttribute('data-plan-name');
            const planPrestador = card.getAttribute('data-prestador');
            console.log('Click en seleccionar plan:', planName, planPrestador, window.planesCalculados);
            let plan = null;
            if (window.planesCalculados) {
                plan = window.planesCalculados.find(
                    p => p.name == planName && p.prestador == planPrestador
                );
            }
            if (plan) {
                window.togglePlanSelection(plan);
            } else {
                alert('No se encontró el plan. Revisa la consola.');
            }
            e.preventDefault();
            return;
        }
    });
})();

function printCompactEmailWithBenefitsPDF() {
    if (!window.selectedPlans || window.selectedPlans.length === 0) {
        alert('Por favor, selecciona al menos un plan para generar el PDF.');
        return;
    }
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleDateString('es-AR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    // Función auxiliar para obtener el logo del prestador
    function getPrestadorLogo(prestador) {
        const logos = {
            'OMINT': 'logosEmpresas/omint.png',
            'Swiss Medical': 'logosEmpresas/swissmedical.png',
            'ACTIVA SALUD': 'logosEmpresas/activasalud.png',
            'MEDIFE': 'logosEmpresas/medife.png',
            'OSPADEP SALUD': 'logosEmpresas/OSPADEPSalud.png'
        };
        return logos[prestador] || '';
    }

    // Función auxiliar para obtener el color del prestador
    function getPrestadorColor(prestador) {
        const colores = {
            'OMINT': '#3182ce',
            'Swiss Medical': '#d53f8c',
            'ACTIVA SALUD': '#059669',
            'MEDIFE': '#dc2626',
            'OSPADEP SALUD': '#1053F3'
        };
        return colores[prestador] || '#718096';
    }

    // Generar HTML de los planes con toda la información detallada
    let planesHTML = '';
    window.selectedPlans.forEach((plan) => {
        const precio = plan.precioFinal || plan.price || plan._precioFinal || 0;
        const precioFormateado = typeof precio === 'number' ? 
            precio.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 
            precio.toString();
        const prestadorLabel = plan.prestador || getPrestadorLabel(plan.type);
        const planName = plan.name.replace(/_/g, ' ');
        const prestadorLogo = getPrestadorLogo(prestadorLabel);
        const prestadorColor = getPrestadorColor(prestadorLabel);
        
        // Generar badges
        let badgesHTML = '';
        if (plan.recommended) {
            badgesHTML += '<div class="badge recommended-badge">⭐ Recomendado</div>';
        }
        if (plan.isBestPrice) {
            badgesHTML += '<div class="badge best-price-badge">🏷️ Mejor Precio</div>';
        }
        if (plan.isBestValue) {
            badgesHTML += '<div class="badge best-value-badge">💎 Mejor Valor</div>';
        }

        // Generar características
        let beneficiosHTML = '';
        if (plan.features && plan.features.length > 0) {
            beneficiosHTML = '<ul class="plan-features-list">';
            plan.features.forEach(feature => {
                beneficiosHTML += `<li>${feature}</li>`;
            });
            beneficiosHTML += '</ul>';
        }

        // Generar desglose de precio
        let desgloseHTML = '';
        if (plan.desglose && plan.desglose.items && plan.desglose.items.length > 0) {
            desgloseHTML = '<div class="price-breakdown"><div class="breakdown-title">🧮 Desglose del precio</div><div class="breakdown-items">';
            
            plan.desglose.items.forEach(item => {
                const porcentajeInfo = item.porcentaje ? ` (${item.porcentaje})` : '';
                const subtotalFormateado = typeof item.subtotal === 'number' ? 
                    item.subtotal.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 
                    item.subtotal.toString();
                desgloseHTML += `
                    <div class="breakdown-item">
                        <span class="breakdown-concept">${item.concepto}${porcentajeInfo}</span>
                        <span class="breakdown-amount">$${subtotalFormateado}</span>
                    </div>
                `;
            });

            // Mostrar descuentos si existen
            const tieneDescuentos = (plan._descuentoEspecial && plan._descuentoEspecial > 0) || 
                                    (plan._descuento35 && plan._descuento35 > 0) || 
                                    (plan._totalAportes && plan._totalAportes > 0);
            
            if (tieneDescuentos && plan._precioBase) {
                const precioBaseFormateado = plan._precioBase.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                
                desgloseHTML += `
                    <div class="breakdown-item">
                        <span class="breakdown-concept" style="color:#888;">Subtotal sin descuento</span>
                        <span class="breakdown-amount" style="text-decoration:line-through;">$${precioBaseFormateado}</span>
                    </div>
                `;
                
                // Descuento especial
                if (plan._descuentoEspecial && plan._descuentoEspecial > 0) {
                    const descEspecialFormateado = plan._descuentoEspecial.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    desgloseHTML += `
                        <div class="breakdown-item">
                            <span class="breakdown-concept" style="color:#a21caf;">Descuento especial (${plan._porcentajeDescuento}%)</span>
                            <span class="breakdown-amount" style="color:#a21caf;">-$${descEspecialFormateado}</span>
                        </div>
                    `;
                }
                
                // Descuento Plan Joven
                if (plan._descuento35 && plan._descuento35 > 0) {
                    const desc35Formateado = plan._descuento35.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    desgloseHTML += `
                        <div class="breakdown-item discount-item" style="background:#eff6ff;padding:6px;border-radius:4px;">
                            <span class="breakdown-concept" style="color:#1053F3;font-weight:600;">🎁 Descuento Plan Joven (25%)</span>
                            <span class="breakdown-amount" style="color:#1053F3;font-weight:600;">-$${desc35Formateado}</span>
                        </div>
                    `;
                }
                
                // Aportes descontados
                if (plan._totalAportes && plan._totalAportes > 0) {
                    const aportesFormateado = plan._totalAportes.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    desgloseHTML += `
                        <div class="breakdown-item discount-item">
                            <span class="breakdown-concept" style="color:#059669;">Aportes descontados</span>
                            <span class="breakdown-amount" style="color:#059669;">-$${aportesFormateado}</span>
                        </div>
                    `;
                }
            }

            desgloseHTML += `
                <div class="breakdown-total">
                    <span class="breakdown-concept">Total Final</span>
                    <span class="breakdown-amount">$${precioFormateado}</span>
                </div>
            </div></div>`;
        }

        // Información de grupo etario
        const ageRangeHTML = plan.ageRange ? `<div class="plan-age-range">👤 ${plan.ageRange}</div>` : '';

        planesHTML += `
        <div class="plan-card-pdf" style="border-left-color: ${prestadorColor};">
            ${badgesHTML}
            <div class="provider-logo">
                <img src="${prestadorLogo}" alt="${prestadorLabel}" onerror="this.style.display='none';">
            </div>
            <h3 class="plan-name">${planName}</h3>
            ${ageRangeHTML}
            <div class="plan-price">
                <span class="currency">$</span>
                <span class="price">${precioFormateado}</span>
                <span class="period">/mes</span>
            </div>
            ${desgloseHTML}
            <div class="plan-features">
                <h4>✅ Características</h4>
                ${beneficiosHTML}
            </div>
        </div>
        `;
    });

    // Calcular aportes solo una vez (primer plan con _totalAportes > 0)
    let aporteUnico = 0;
    for (let i = 0; i < window.selectedPlans.length; i++) {
        const plan = window.selectedPlans[i];
        if (plan._totalAportes && plan._totalAportes > 0) {
            aporteUnico = plan._totalAportes;
            break;
        }
    }
    let totalSectionHTML = '';
    if (aporteUnico > 0) {
        totalSectionHTML = `<div class="total-section"><h3>💸 Aportes descontados</h3><div class="total-price">$${aporteUnico.toLocaleString('es-AR')}</div></div>`;
    } else {
        totalSectionHTML = `<div class="total-section"><h3>¡Descontá con tus aportes!</h3></div>`;
    }

    // Generar número de cotización único
    const cotizacionNumber = '#OSP-' + new Date().getFullYear() + 
                             (new Date().getMonth() + 1).toString().padStart(2, '0') + 
                             new Date().getDate().toString().padStart(2, '0') + '-' + 
                             Math.floor(Math.random() * 9000 + 1000);
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotización de Planes de Salud - OSPADEP</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        
        * { 
            box-sizing: border-box; 
            margin: 0;
            padding: 0;
        }
        
        html, body {
            width: 100%;
            height: 100%;
        }
        
        body {
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.3;
            color: #0F152B;
            background-color: #ffffff;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        
        .container {
            background: white;
            margin: 0 auto;
            max-width: 100%;
            padding: 0;
        }
        
        .header {
            background: #ffffff;
            padding: 12px 25px;
            margin: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 0;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .header-left {
            display: flex;
            align-items: center;
        }
        
        .header img {
            max-width: 180px;
            height: auto;
            filter: none;
        }
        
        .header-right {
            background: rgba(16, 83, 243, 0.08);
            backdrop-filter: blur(10px);
            padding: 12px 20px;
            border-radius: 12px;
            text-align: right;
            border: 1px solid rgba(16, 83, 243, 0.15);
        }
        
        .cotizacion-label {
            color: #64748b;
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }
        
        .cotizacion-number {
            color: #1053F3;
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 4px;
        }
        
        .cotizacion-date {
            color: #64748b;
            font-size: 0.75rem;
        }
        
        .header h1,
        .header p {
            display: none;
        }
        
        .plans-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 15px 20px;
            justify-content: center;
        }
        
        .plan-card-pdf {
            background: white;
            border: 2px solid #e2e8f0;
            border-left: 4px solid;
            border-radius: 6px;
            padding: 8px;
            padding-top: 28px;
            position: relative;
            width: calc(33.333% - 7px);
            min-width: 220px;
            max-width: 260px;
            box-sizing: border-box;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        
        .badge {
            position: absolute;
            padding: 3px 6px;
            border-radius: 10px;
            font-size: 0.55rem;
            font-weight: 600;
            z-index: 10;
        }
        
        .recommended-badge {
            background: #10b981;
            color: white;
            top: 6px;
            right: 6px;
        }
        
        .best-price-badge {
            background: #f59e0b;
            color: white;
            top: 6px;
            left: 6px;
        }
        
        .best-value-badge {
            background: #8b5cf6;
            color: white;
            top: 6px;
            left: 6px;
        }
        
        .provider-logo {
            text-align: center;
            margin-bottom: 6px;
            min-height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .provider-logo img {
            max-width: 70px;
            max-height: 35px;
            height: auto;
            object-fit: contain;
        }
        
        .plan-name {
            font-size: 0.95rem;
            font-weight: 700;
            color: #0F152B;
            margin-bottom: 4px;
            text-align: center;
            line-height: 1.2;
        }
        
        .plan-age-range {
            text-align: center;
            color: #64748b;
            font-size: 0.65rem;
            margin-bottom: 6px;
        }
        
        .plan-price {
            text-align: center;
            margin: 8px 0;
            padding: 8px;
            background: #f0f9ff;
            border-radius: 6px;
            border: 1px solid #bae6fd;
        }
        
        .plan-price .currency {
            font-size: 0.8rem;
            font-weight: 600;
            color: #0369a1;
        }
        
        .plan-price .price {
            font-size: 1.3rem;
            font-weight: 700;
            color: #0c4a6e;
        }
        
        .plan-price .period {
            font-size: 0.7rem;
            color: #64748b;
            font-weight: 500;
        }
        
        .price-breakdown {
            background: #f8fafc;
            border-radius: 4px;
            padding: 8px;
            margin: 6px 0;
            border: 1px solid #e2e8f0;
        }
        
        .breakdown-title {
            font-size: 0.65rem;
            font-weight: 600;
            color: #475569;
            margin-bottom: 4px;
        }
        
        .breakdown-items {
            margin-top: 3px;
        }
        
        .breakdown-item {
            display: flex;
            justify-content: space-between;
            font-size: 0.6rem;
            padding: 2px 0;
        }
        
        .breakdown-item.discount-item {
            background: #d1fae5;
            padding: 4px;
            border-radius: 3px;
            margin-top: 2px;
        }
        
        .breakdown-item.discount-item .breakdown-concept,
        .breakdown-item.discount-item .breakdown-amount {
            color: #059669;
            font-weight: 600;
        }
        
        .breakdown-concept {
            color: #64748b;
            font-weight: 500;
        }
        
        .breakdown-amount {
            color: #0F152B;
            font-weight: 600;
        }
        
        .breakdown-total {
            display: flex;
            justify-content: space-between;
            padding-top: 4px;
            margin-top: 4px;
            border-top: 1px solid #cbd5e1;
            font-weight: 700;
            font-size: 0.7rem;
        }
        
        .breakdown-total .breakdown-amount {
            color: #1053F3;
            font-size: 0.8rem;
        }
        
        .plan-features {
            margin: 8px 0;
        }
        
        .plan-features h4 {
            font-size: 0.7rem;
            font-weight: 600;
            color: #0F152B;
            margin-bottom: 4px;
        }
        
        .plan-features-list {
            list-style: none;
        }
        
        .plan-features-list li {
            padding: 2px 0;
            color: #475569;
            font-size: 0.65rem;
            line-height: 1.3;
            padding-left: 12px;
            position: relative;
        }
        
        .plan-features-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
            font-size: 0.6rem;
        }
        
        .total-section {
            background: #059669;
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            margin: 12px 20px;
            text-align: center;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        
        .total-section h3 {
            margin-bottom: 4px;
            font-size: 0.9rem;
            font-weight: 600;
        }
        
        .total-price {
            font-size: 1.4rem;
            font-weight: 700;
        }
        
        .contact-section {
            background: #f8fafc;
            border-radius: 8px;
            padding: 12px 20px;
            text-align: center;
            border: 1px solid #e2e8f0;
            margin: 0 20px 15px 20px;
        }
        
        .contact-section h3 {
            color: #0F152B;
            margin-bottom: 8px;
            font-size: 1rem;
            font-weight: 700;
        }
        
        .contact-info {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 8px;
        }
        
        .contact-item {
            background: white;
            padding: 8px 12px;
            border-radius: 5px;
            border: 1px solid #e2e8f0;
            flex: 1;
            min-width: 130px;
            text-align: center;
        }
        
        .contact-item strong {
            color: #1053F3;
            display: block;
            margin-bottom: 3px;
            font-size: 0.75rem;
        }
        
        .contact-item span {
            font-size: 0.7rem;
            color: #475569;
        }
        
        @media print {
            @page {
                margin: 0.5cm;
                size: A4 landscape;
            }
            
            body {
                background: white !important;
                margin: 0;
                padding: 0;
            }
            
            .container {
                max-width: 100%;
                padding: 0;
            }
            
            .plans-grid {
                display: flex !important;
                flex-wrap: wrap !important;
                gap: 8px !important;
                justify-content: center !important;
                margin: 10px 15px !important;
            }
            
            .plan-card-pdf {
                page-break-inside: avoid;
                break-inside: avoid;
                width: calc(33.333% - 6px) !important;
                min-width: 210px !important;
                max-width: 250px !important;
                margin-bottom: 0 !important;
                padding: 6px !important;
                padding-top: 26px !important;
            }
            
            .total-section {
                background: #059669 !important;
                color: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                margin: 8px 15px !important;
                padding: 8px 12px !important;
            }
            
            .recommended-badge {
                background: #10b981 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .best-price-badge {
                background: #f59e0b !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .best-value-badge {
                background: #8b5cf6 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .header {
                background: #ffffff !important;
                margin: 0 !important;
                padding: 10px 20px !important;
                border-bottom: 2px solid #e2e8f0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .header-right {
                background: rgba(16, 83, 243, 0.08) !important;
                border: 1px solid rgba(16, 83, 243, 0.15) !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                padding: 8px 15px !important;
            }
            
            .contact-section {
                margin: 0 15px 10px 15px !important;
                padding: 8px 15px !important;
            }
            
            .contact-section h3 {
                font-size: 0.85rem !important;
                margin-bottom: 5px !important;
            }
            
            .contact-info {
                gap: 8px !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-left">
                <img src="https://github.com/dantemoss/CotizadorWebOSPADEP-assets/blob/main/LOGO%20OSPADEP-Salud.png?raw=true"
                alt="OSPADEP"
                onerror="this.style.display='none';">
            </div>
            <div class="header-right">
                <div class="cotizacion-label">COTIZACIÓN</div>
                <div class="cotizacion-number">${cotizacionNumber}</div>
                <div class="cotizacion-date">${fechaFormateada}</div>
            </div>
        </div>
        <div class="plans-grid">
            ${planesHTML}
        </div>
        ${totalSectionHTML}
        <div class="contact-section">
            <h3>📞 ¿Necesitas más información?</h3>
            <div class="contact-info">
                <div class="contact-item">
                    <strong>📞 Teléfono</strong>
                    <span>+54 9 11 6625-9009</span>
                </div>
                <div class="contact-item">
                    <strong>📧 Email</strong>
                    <span>comercial@ospadep.com</span>
                </div>
                <div class="contact-item">
                    <strong>🌐 Web</strong>
                    <span>www.ospadep.com</span>
                </div>
            </div>
        </div>
    </div>
    <script>
        window.onload = function() { 
            // Esperar a que las imágenes se carguen antes de imprimir
            var images = document.images;
            var loaded = 0;
            var total = images.length;
            
            if (total === 0) {
                setTimeout(function() { window.print(); }, 600);
                return;
            }
            
            for (var i = 0; i < total; i++) {
                var img = images[i];
                if (img.complete) {
                    loaded++;
                } else {
                    img.addEventListener('load', function() {
                        loaded++;
                        if (loaded === total) {
                            setTimeout(function() { window.print(); }, 600);
                        }
                    });
                    img.addEventListener('error', function() {
                        loaded++;
                        if (loaded === total) {
                            setTimeout(function() { window.print(); }, 600);
                        }
                    });
                }
            }
            
            if (loaded === total) {
                setTimeout(function() { window.print(); }, 600);
            }
        };
    <\/script>
</body>
</html>`;

    // Abrir en nueva ventana y disparar print
    const printWindow = window.open('', '_blank', 'width=1200,height=900,scrollbars=yes');
    if (!printWindow) {
        alert('No se pudo abrir la ventana para imprimir. Verifica los permisos de ventanas emergentes.');
        return;
    }
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
}

// ================================
// SISTEMA DE PRECIOS EXTERNOS
// ================================

// Verificar estado del sistema de precios externos
function verificarEstadoPreciosExternos() {
    const statusElement = document.getElementById('external-status');
    const textElement = document.getElementById('status-text');
    const versionElement = document.getElementById('current-version');
    
    if (!statusElement) return; // Panel no visible aún
    
    if (preciosExternosDisponibles) {
        statusElement.className = 'status-indicator active';
        textElement.textContent = 'Precios externos cargados';
        
        // Intentar obtener versión del JSON
        fetch('precios-data.json')
            .then(response => response.json())
            .then(data => {
                versionElement.textContent = data.version || 'Sin versión';
            })
            .catch(() => {
                versionElement.textContent = 'Error al leer versión';
            });
    } else {
        statusElement.className = 'status-indicator inactive';
        textElement.textContent = 'Usando precios internos';
        versionElement.textContent = 'Septiembre 2025';
    }
}

// Mostrar panel de precios externos
function showExternalPricing() {
    // Ocultar otras secciones
    document.querySelectorAll('.admin-content > div').forEach(div => {
        if (div.style) div.style.display = 'none';
    });
    
    // Mostrar panel externo
    document.getElementById('external-pricing-section').style.display = 'block';
    
    // Verificar estado
    verificarEstadoPreciosExternos();
}

// Ocultar panel de precios externos
function hideExternalPricing() {
    document.getElementById('external-pricing-section').style.display = 'none';
}

// Cambiar tabs del panel externo
function switchExternalTab(tabName) {
    // Actualizar botones de navegación
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Actualizar paneles de contenido
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `tab-${tabName}`) {
            panel.classList.add('active');
        }
    });
}

// Aplicar aumentos por porcentaje a precios externos
async function aplicarAumentosExternos() {
    const omintPercent = parseFloat(document.getElementById('omint-percent').value) || 0;
    const swissPercent = parseFloat(document.getElementById('swiss-percent').value) || 0;
    const activaPercent = parseFloat(document.getElementById('activa-percent').value) || 0;
    const medifePercent = parseFloat(document.getElementById('medife-percent').value) || 0;
    const ospadepPercent = parseFloat(document.getElementById('ospadep-percent').value) || 0;
    
    if (omintPercent === 0 && swissPercent === 0 && activaPercent === 0 && medifePercent === 0 && ospadepPercent === 0) {
        alert('Ingresa al menos un porcentaje de aumento');
        return;
    }
    
    try {
        // Cargar datos actuales
        const response = await fetch('precios-data.json');
        const data = await response.json();
        
        // Aplicar aumentos
        if (omintPercent !== 0) aplicarAumentoAPrestador(data.prestadores.omint, omintPercent);
        if (swissPercent !== 0) {
            aplicarAumentoAPrestador(data.prestadores.swissMedical, swissPercent);
            aplicarAumentoAPrestador(data.prestadores.swNubial, swissPercent);
            aplicarAumentoAPrestador(data.prestadores.swiss, swissPercent);
        }
        if (activaPercent !== 0) aplicarAumentoAPrestador(data.prestadores.activaSalud, activaPercent);
        if (medifePercent !== 0) aplicarAumentoAPrestador(data.prestadores.medife, medifePercent);
        if (ospadepPercent !== 0) aplicarAumentoAPrestador(data.prestadores.ospadepSalud, ospadepPercent);
        
        // Actualizar versión y fecha
        const now = new Date();
        data.version = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
        data.fechaActualizacion = now.toISOString().split('T')[0];
        
        // Agregar al historial
        data.historialCambios.push({
            fecha: data.fechaActualizacion,
            descripcion: `Aumento por porcentajes: OMINT ${omintPercent}%, SWISS (todos) ${swissPercent}%, ACTIVA ${activaPercent}%, MEDIFE ${medifePercent}%, OSPADEP SALUD ${ospadepPercent}%`,
            autor: 'Panel Admin'
        });
        
        // Generar y descargar el nuevo JSON
        descargarJSON(data, 'precios-data-actualizado.json');
        
        alert(`✅ Aumentos aplicados exitosamente!
        
📊 Resumen:
• OMINT: ${omintPercent}%
• SWISS (todos los planes): ${swissPercent}%
  - SWISS MEDICAL (PO62, PO64, SB04)
  - SW NUBIAL (MS)
  - SWISS (SB02)
• ACTIVA SALUD: ${activaPercent}%
• MEDIFE: ${medifePercent}%
• OSPADEP SALUD: ${ospadepPercent}%

📥 Se descargó el archivo actualizado.
Sube este archivo como 'precios-data.json' para aplicar los cambios.`);
        
    } catch (error) {
        alert('Error al procesar aumentos: ' + error.message);
    }
}

// Aplicar aumento a un prestador específico
function aplicarAumentoAPrestador(prestador, porcentaje) {
    if (!prestador || !prestador.planes) return;
    
    const factor = 1 + (porcentaje / 100);
    
    Object.values(prestador.planes).forEach(plan => {
        if (plan.preciosPorEdad) {
            // Estructura ACTIVA SALUD
            Object.keys(plan.preciosPorEdad).forEach(grupo => {
                if (typeof plan.preciosPorEdad[grupo] === 'number') {
                    plan.preciosPorEdad[grupo] = Math.round(plan.preciosPorEdad[grupo] * factor);
                } else if (typeof plan.preciosPorEdad[grupo] === 'object') {
                    // Estructura OMINT/SWISS
                    Object.keys(plan.preciosPorEdad[grupo]).forEach(subgrupo => {
                        plan.preciosPorEdad[grupo][subgrupo] = Math.round(plan.preciosPorEdad[grupo][subgrupo] * factor);
                    });
                }
            });
        } else if (plan.precios) {
            // Estructura MEDIFE
            Object.keys(plan.precios).forEach(categoria => {
                if (typeof plan.precios[categoria] === 'object') {
                    Object.keys(plan.precios[categoria]).forEach(edad => {
                        plan.precios[categoria][edad] = Math.round(plan.precios[categoria][edad] * factor);
                    });
                }
            });
        }
    });
}

// Descargar JSON
function descargarJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Descargar JSON actual
async function descargarJSONExterno() {
    try {
        const response = await fetch('precios-data.json');
        const data = await response.json();
        descargarJSON(data, 'precios-data-backup.json');
        alert('✅ Archivo JSON descargado como respaldo');
    } catch (error) {
        alert('Error al descargar JSON: ' + error.message);
    }
}

// Manejar drag & drop de CSV
function allowDrop(ev) {
    ev.preventDefault();
}

function handleCSVDrop(ev) {
    ev.preventDefault();
    const files = ev.dataTransfer.files;
    if (files.length > 0) {
        procesarArchivoCSV(files[0]);
    }
}

function handleCSVFile(event) {
    const file = event.target.files[0];
    if (file) {
        procesarArchivoCSV(file);
    }
}

function procesarArchivoCSV(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        document.getElementById('csv-content').textContent = content.substring(0, 500) + '...';
        document.getElementById('csv-preview').style.display = 'block';
        
        // Guardar contenido para procesamiento
        window.csvContent = content;
    };
    reader.readAsText(file);
}

// Calculadora de reversión de aumentos por prestador específico
function calcularReversion() {
    const prestadorSeleccionado = document.getElementById('revert-prestador').value;
    const aumentoAnterior = parseFloat(document.getElementById('revert-calc').value);
    
    if (!prestadorSeleccionado) {
        alert('Selecciona el prestador que fue afectado');
        return;
    }
    
    if (!aumentoAnterior || aumentoAnterior === 0) {
        alert('Ingresa el porcentaje de aumento anterior');
        return;
    }
    
    // SIMPLIFICADO: Para revertir +X%, simplemente aplicar -X%
    // Esto es más intuitivo: si subiste 2%, bajas 2% para volver al original
    const descuentoNecesario = -aumentoAnterior;
    const descuentoRedondeado = descuentoNecesario;
    
    // Mapear nombres de prestadores
    const nombresPrestadores = {
        'omint': 'OMINT',
        'swiss': 'SWISS MEDICAL', 
        'activa': 'ACTIVA SALUD',
        'medife': 'MEDIFE'
    };
    
    // Mostrar resultado específico
    document.getElementById('original-increase').textContent = aumentoAnterior;
    document.getElementById('selected-prestador').textContent = nombresPrestadores[prestadorSeleccionado];
    document.getElementById('revert-percentage').textContent = descuentoRedondeado;
    document.getElementById('prestador-target').textContent = nombresPrestadores[prestadorSeleccionado];
    document.getElementById('calc-result').style.display = 'block';
    
    // Guardar para aplicar automáticamente
    window.descuentoCalculado = {
        prestador: prestadorSeleccionado,
        descuento: descuentoRedondeado,
        nombre: nombresPrestadores[prestadorSeleccionado]
    };
    
    console.log(`${nombresPrestadores[prestadorSeleccionado]} - Aumento anterior: ${aumentoAnterior}% -> Descuento necesario: ${descuentoRedondeado}%`);
}

// Función simplificada para aplicar descuentos directos
function aplicarDescuentoDirecto() {
    const prestadorSeleccionado = document.getElementById('revert-prestador').value;
    const porcentajeDescuento = parseFloat(document.getElementById('revert-calc').value);
    
    if (!prestadorSeleccionado) {
        alert('Selecciona el prestador al que quieres aplicar el descuento');
        return;
    }
    
    if (!porcentajeDescuento || porcentajeDescuento === 0) {
        alert('Ingresa el porcentaje de descuento a aplicar');
        return;
    }
    
    // Mapear nombres de prestadores
    const nombresPrestadores = {
        'omint': 'OMINT',
        'swiss': 'SWISS MEDICAL', 
        'activa': 'ACTIVA SALUD',
        'medife': 'MEDIFE',
        'ospadep': 'OSPADEP SALUD'
    };
    
    // Confirmar la acción
    const confirmar = confirm(`¿Aplicar un descuento del ${porcentajeDescuento}% a todos los planes de ${nombresPrestadores[prestadorSeleccionado]}?`);
    
    if (!confirmar) return;
    
    try {
        // Mapear IDs de select a keys del JSON
        const prestadorMapping = {
            'omint': 'omint',
            'swiss': 'swissMedical',
            'activa': 'activaSalud',
            'medife': 'medife',
            'ospadep': 'ospadepSalud'
        };
        
        const prestadorKey = prestadorMapping[prestadorSeleccionado];
        
        // Cargar datos actuales
        fetch('precios-data.json')
            .then(response => response.json())
            .then(data => {
                // Aplicar descuento (porcentaje negativo)
                aplicarAumentoAPrestador(data.prestadores[prestadorKey], -porcentajeDescuento);
                
                // Actualizar fecha y versión
                const now = new Date();
                data.version = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
                data.fechaActualizacion = now.toISOString().split('T')[0];
                
                // Agregar al historial
                data.historialCambios.push({
                    fecha: data.fechaActualizacion,
                    descripcion: `Descuento del ${porcentajeDescuento}% aplicado a ${nombresPrestadores[prestadorSeleccionado]}`,
                    autor: "Panel de Administración"
                });
                
                // Descargar archivo actualizado
                descargarJSON(data, `precios-data-${prestadorSeleccionado}-descuento-${porcentajeDescuento}%.json`);
                
                alert(`✅ Descuento del ${porcentajeDescuento}% aplicado a ${nombresPrestadores[prestadorSeleccionado]}!

📥 Se descargó el archivo actualizado.
Sube este archivo como 'precios-data.json' para aplicar los cambios.`);
                
                // Limpiar campos
                document.getElementById('revert-calc').value = '';
                document.getElementById('revert-prestador').value = '';
                
            })
            .catch(error => {
                alert('Error al aplicar descuento: ' + error.message);
            });
            
    } catch (error) {
        alert('Error al aplicar descuento: ' + error.message);
    }
}

// Aplicar el descuento calculado automáticamente al prestador específico
function aplicarDescuentoCalculado() {
    if (!window.descuentoCalculado) {
        alert('Primero calcula el descuento necesario');
        return;
    }
    
    const { prestador, descuento, nombre } = window.descuentoCalculado;
    
    // Mapear a los IDs de los campos
    const camposInputs = {
        'omint': 'omint-percent',
        'swiss': 'swiss-percent',
        'activa': 'activa-percent', 
        'medife': 'medife-percent',
        'ospadep': 'ospadep-percent'
    };
    
    const inputId = camposInputs[prestador];
    if (!inputId) {
        alert('Error: Prestador no reconocido');
        return;
    }
    
    // Limpiar otros campos para evitar confusión
    Object.values(camposInputs).forEach(id => {
        if (id !== inputId) {
            document.getElementById(id).value = '';
        }
    });
    
    // Aplicar el descuento calculado al campo específico
    document.getElementById(inputId).value = descuento;
    
    // Mostrar confirmación específica
    alert(`✅ Descuento de ${descuento}% aplicado al campo ${nombre}.

Esto revertirá el aumento anterior que aplicaste a ${nombre}.

Ahora haz clic en "Calcular y Generar Archivo" para crear el archivo actualizado.`);
    
    // Highlight del campo modificado
    const targetInput = document.getElementById(inputId);
    targetInput.style.backgroundColor = '#e8f5e8';
    targetInput.style.borderColor = '#4caf50';
    
    // Scroll hacia el botón principal
    document.querySelector('.btn-primary.large').scrollIntoView({ behavior: 'smooth' });
    
    // Remover highlight después de 3 segundos
    setTimeout(() => {
        targetInput.style.backgroundColor = '';
        targetInput.style.borderColor = '';
    }, 3000);
}

// Función universal para corregir precios exactos (eliminar errores de redondeo)
async function corregirPrecisionUniversal() {
    const prestadorSeleccionado = document.getElementById('precision-prestador').value;
    
    if (!prestadorSeleccionado) {
        alert('Por favor, selecciona un prestador para restaurar sus precios originales');
        return;
    }
    try {
        // Cargar datos actuales
        const response = await fetch('precios-data.json');
        const data = await response.json();
        
        // Mapear nombres de prestadores
        const nombresPrestadores = {
            'omint': 'OMINT',
            'swiss': 'SWISS MEDICAL',
            'activa': 'ACTIVA SALUD', 
            'medife': 'MEDIFE'
        };
        
        // Confirmar la acción
        const confirmar = confirm(`¿Restaurar los precios originales exactos de ${nombresPrestadores[prestadorSeleccionado]}?

Esto eliminará cualquier error de redondeo acumulativo y volverá a los precios base de Septiembre 2025.`);
        
        if (!confirmar) return;
        
        // Obtener precios originales del prestador desde el respaldo
        const preciosOriginales = prestadoresDataRespaldo[prestadorSeleccionado];
        
        if (!preciosOriginales) {
            alert('Error: No se encontraron los precios originales para este prestador');
            return;
        }
        
        // Restaurar precios exactos del prestador seleccionado
        data.prestadores[prestadorSeleccionado] = JSON.parse(JSON.stringify(preciosOriginales));
        
        // Actualizar fecha y versión
        const now = new Date();
        data.version = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
        data.fechaActualizacion = now.toISOString().split('T')[0];
        
        // Agregar al historial
        data.historialCambios.push({
            fecha: data.fechaActualizacion,
            descripcion: `Corrección de precisión ${nombresPrestadores[prestadorSeleccionado]} - Restauración de precios exactos originales`,
            autor: "Sistema de Corrección"
        });
        
        // Generar y descargar el JSON corregido
        descargarJSON(data, `precios-data-${prestadorSeleccionado}-corregido.json`);
        
        alert(`✅ Precios exactos de ${nombresPrestadores[prestadorSeleccionado]} restaurados!

📊 Corrección aplicada:
• Eliminados errores de redondeo acumulativo
• Restaurados precios originales exactos (Septiembre 2025)
• Todos los planes de ${nombresPrestadores[prestadorSeleccionado]} corregidos

📥 Se descargó: precios-data-${prestadorSeleccionado}-corregido.json
Sube este archivo como 'precios-data.json' para aplicar la corrección.`);
        
        // Limpiar selector
        document.getElementById('precision-prestador').value = '';
        
    } catch (error) {
        alert('Error al corregir precios del prestador: ' + error.message);
    }
}