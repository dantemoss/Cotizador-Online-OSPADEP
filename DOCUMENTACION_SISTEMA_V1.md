# 📋 DOCUMENTACIÓN COMPLETA - COTIZADOR ONLINE OSPADEP v1.0

## Fecha de documentación: Enero 2026
## Propósito: Documentación técnica para desarrollo de Versión 2.0

---

## 📑 ÍNDICE

1. [Descripción General](#1-descripción-general)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Estructura de Datos de Precios](#3-estructura-de-datos-de-precios)
4. [Flujo de Usuario](#4-flujo-de-usuario)
5. [Sistema de Cálculo de Precios](#5-sistema-de-cálculo-de-precios)
6. [Prestadores y sus Estructuras](#6-prestadores-y-sus-estructuras)
7. [Variables del Sistema](#7-variables-del-sistema)
8. [Problemas Conocidos y Errores](#8-problemas-conocidos-y-errores)
9. [Recomendaciones para V2](#9-recomendaciones-para-v2)

---

## 1. DESCRIPCIÓN GENERAL

### ¿Qué es?
El Cotizador Online OSPADEP es una aplicación web que permite a los usuarios cotizar planes de salud de múltiples prestadores médicos, calculando precios personalizados según su composición familiar, edad y situación laboral.

### Prestadores Disponibles
- **OMINT** (5 planes)
- **SWISS MEDICAL** (3 planes: PO62, PO64, SB04)
- **SW NUBIAL** (1 plan: MS)
- **SWISS** (1 plan: SB02)
- **ACTIVA SALUD** (5 planes)
- **MEDIFE** (3 planes: Bronce, Plata, Oro)
- **OSPADEP SALUD** (3 planes: OS25, OS300, OS900)

### Tecnologías Utilizadas
- HTML5 / CSS3 / JavaScript vanilla
- Sin frameworks ni librerías externas
- Datos almacenados en JSON (`precios-data.json`)

---

## 2. ARQUITECTURA DEL SISTEMA

### Archivos Principales

```
Cotizador-Online-OSPADEP/
├── index.html              # Estructura HTML principal
├── styles.css              # Estilos CSS
├── script.js               # Lógica principal (~11,000 líneas)
├── precios-data.json       # Base de datos de precios
├── config.js               # Configuración del sistema
├── security.js             # Sistema de seguridad
├── user-system.js          # Gestión de usuarios
├── auth-system.js          # Autenticación
├── logosEmpresas/          # Logos de prestadores
└── planes/                 # Archivos CSV de respaldo
```

### Flujo de Datos

```
precios-data.json → cargarPreciosExternos() → prestadoresData (global)
                                                      ↓
Usuario completa formulario → formData (global) → calcularPrecioUnificado()
                                                      ↓
                                              showPlans() → generatePlanCard()
```

---

## 3. ESTRUCTURA DE DATOS DE PRECIOS

### Archivo: `precios-data.json`

```json
{
  "version": "2026-02",
  "fechaActualizacion": "2026-01-16",
  "prestadores": {
    "omint": { ... },
    "swissMedical": { ... },
    "swNubial": { ... },
    "swiss": { ... },
    "activaSalud": { ... },
    "medife": { ... },
    "ospadepSalud": { ... }
  },
  "historialCambios": [ ... ]
}
```

### Tipos de Estructura de Precios (tipoEstructura)

| Tipo | Prestadores | Descripción |
|------|-------------|-------------|
| `estructura_compleja` | OMINT, OSPADEP SALUD | Precios diferenciados por rol (adulto, hijo1, hijo2+) y edad |
| `plantilla_adultos_solo` | SWISS MEDICAL | Solo 2 grupos etarios (≤65, >65), todos pagan como adultos |
| `plantilla_adultos_simple` | SW NUBIAL, SWISS, ACTIVA SALUD | Similar a anterior, precio único o por 2 grupos |
| `estructura_matrimonio_hijos` | MEDIFE | Precios especiales para matrimonio e hijos diferenciados |

---

## 4. FLUJO DE USUARIO

### Paso 1: Selección de Tipo de Plan
El usuario elige entre 4 opciones de composición familiar:

```javascript
// Opciones disponibles (data-option)
- "solo"     → Plan individual (1 persona)
- "pareja"   → Plan para 2 personas (titular + cónyuge)
- "hijos"    → Plan para titular + hijos (sin pareja)
- "familia"  → Plan completo (titular + pareja + hijos)
```

### Paso 2: Información Personal
Se recopilan los siguientes datos según la opción elegida:

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `edad-titular` | number | Sí | Edad del titular (18-100) |
| `situacion-laboral` | select | Sí | "dependencia" o "particular" |
| `edad-pareja` | number | Condicional | Si eligió pareja/familia |
| `cantidad-menores` | number | Condicional | Cantidad de hijos <21 años |
| `edad-menor-X` | number | Condicional | Edad de cada hijo menor |
| `cantidad-mayores` | number | Condicional | Cantidad de hijos 21-29 años |
| `edad-mayor-X` | number | Condicional | Edad de cada hijo mayor |

### Paso 3: Cotización
Se muestran todos los planes disponibles con precios calculados, filtros por prestador y badges de "Mejor precio" / "Mejor valor".

---

## 5. SISTEMA DE CÁLCULO DE PRECIOS

### Función Principal: `calcularPrecioUnificado()`

```javascript
function calcularPrecioUnificado(prestadorKey, plan, composicionFamiliar, edadTitular, edadPareja = null) {
    // 1. Determina el tipo de estructura del prestador
    // 2. Llama a la función de cálculo específica
    // 3. Aplica descuentos (Plan Joven, descuento especial, aportes)
    // 4. Retorna precio final redondeado
}
```

### Objeto `composicionFamiliar`

```javascript
composicionFamiliar = {
    tienePareja: boolean,        // Si incluye cónyuge
    menores: [edad1, edad2...],  // Array de edades de hijos <21
    mayores: [edad1, edad2...],  // Array de edades de hijos 21-29
    resumen: "string"            // Descripción textual
}
```

### Funciones de Cálculo por Prestador

| Función | Prestador | Lógica |
|---------|-----------|--------|
| `calcularPrecioFinalOMINT()` | OMINT | Precios por grupo etario + rol (adulto/hijo1/hijo2+) |
| `calcularPrecioFinalSwiss()` | SWISS MEDICAL | Precio único ≤65 o >65, todos como adultos |
| `calcularPrecioFinalActiva()` | ACTIVA SALUD | Precio único (≤100) o diferenciado (AS300: ≤65/>65) |
| `calcularPrecioFinalSwNubial()` | SW NUBIAL | Precio ≤65 o >65, todos como adultos |
| `calcularPrecioFinalSwissBasico()` | SWISS | Precio ≤65 o >65, todos como adultos |
| `calcularPrecioFinalMedife()` | MEDIFE | Precio individual/matrimonio + hijos diferenciados |
| `calcularPrecioFinalOspadep()` | OSPADEP SALUD | Precios por 8 franjas etarias + rol |

---

## 6. PRESTADORES Y SUS ESTRUCTURAS

### 6.1 OMINT (`estructura_compleja`)

**Grupos Etarios:**
```javascript
function determinarGrupoEtario(edad) {
    if (edad <= 25) return "0-25";
    if (edad <= 35) return "26-35";
    if (edad <= 54) return "36-54";
    if (edad <= 59) return "55-59";
    return "60+";
}
```

**Estructura de Precios:**
```json
{
  "preciosPorEdad": {
    "0-25": {
      "adultoConyugue": 92859,
      "hijo1Menor": 80877,
      "hijo2MasMenores": 69932
    },
    ...
  }
}
```

**Lógica de Cálculo:**
1. Titular → `adultoConyugue` del grupo etario correspondiente
2. Cónyuge → `adultoConyugue` de SU grupo etario
3. Primer hijo <25 → `hijo1Menor` (del grupo del titular)
4. Segundo hijo+ <25 → `hijo2MasMenores` (del grupo del titular)
5. Hijos ≥25 → `adultoConyugue` de SU grupo etario

**⚠️ ERROR DETECTADO:** Los precios de hijos se toman del grupo del TITULAR, no del grupo del hijo.

---

### 6.2 SWISS MEDICAL (`plantilla_adultos_solo`)

**Grupos Etarios:**
```javascript
function determinarGrupoEtarioSwiss(edad) {
    return edad <= 65 ? "≤65" : ">65";
}
```

**Estructura de Precios:**
```json
{
  "preciosPorEdad": {
    "≤65": 277459,
    ">65": 806229
  }
}
```

**Lógica de Cálculo:**
- TODOS los miembros pagan precio completo según su grupo etario
- No hay descuentos para menores ni cónyuges
- Cada persona se calcula individualmente

---

### 6.3 ACTIVA SALUD (`estructura_compleja` pero simplificada)

**Grupos Etarios:**
```javascript
function determinarGrupoEtarioActiva(edad, plan = null) {
    if (plan && plan.name === "PLAN AS 300") {
        return edad < 66 ? "≤65" : ">65";  // Solo AS300 tiene 2 grupos
    }
    return '≤100';  // Resto: precio único
}
```

**Estructura de Precios:**
```json
// Planes AS25, AS700, AS800, AS900:
{ "preciosPorEdad": { "≤100": 76876 } }

// Plan AS300:
{ "preciosPorEdad": { "≤65": 88704, ">65": 133266 } }
```

**Lógica de Cálculo:**
- Todos pagan el mismo precio (excepto AS300 que diferencia >65)
- No hay descuentos para menores ni cónyuges

---

### 6.4 MEDIFE (`estructura_matrimonio_hijos`)

**Grupos Etarios:**
```javascript
function determinarGrupoEtarioMedife(edad) {
    if (edad <= 29) return "0-29";
    if (edad <= 39) return "30-39";
    if (edad <= 49) return "40-49";
    if (edad <= 59) return "50-59";
    return "60+";
}
```

**Estructura de Precios:**
```json
{
  "precios": {
    "individual": { "0-29": 121352, "30-39": 152538, ... },
    "conyuge": { "0-29": 105254, "30-39": 122687, ... },
    "matrimonio": { "0-29": 226606, "30-39": 275225, ... },
    "hijos": {
      "primerHijo": 98862,
      "segundoHijo": 81677,
      "hijoAdulto": 121714,
      "familiarCargo": 313450
    }
  }
}
```

**Lógica de Cálculo:**
1. Si tiene pareja → Usa precio `matrimonio` de la EDAD MAYOR entre ambos
2. Si es individual → Usa precio `individual` del titular
3. Hijos <21: Primer hijo → `primerHijo`, Segundo+ → `segundoHijo`
4. Hijos 21-29 → `hijoAdulto`
5. Hijos >29 → `familiarCargo`

**⚠️ NOTA:** El precio de cónyuge en la estructura NO se usa actualmente, siempre se usa matrimonio.

---

### 6.5 OSPADEP SALUD (`estructura_compleja`)

**Grupos Etarios:**
```javascript
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
```

**Estructura de Precios (DOBLE):**
```json
{
  "preciosPorEdad": {           // Con obra social
    "18-27": { "adultoConyugue": 74087, "hijoMenor": 45193 },
    ...
  },
  "preciosPorEdadParticular": { // Sin obra social (con IVA)
    "18-27": { "adultoConyugue": 81866, "hijoMenor": 49938 },
    ...
  }
}
```

**Lógica de Cálculo:**
1. Determina si usar `preciosPorEdad` o `preciosPorEdadParticular` según `situacion-laboral`
2. Titular → `adultoConyugue` de su grupo etario
3. Cónyuge → `adultoConyugue` de SU grupo etario
4. TODOS los hijos menores → `hijoMenor` × cantidad (precio único)
5. Hijos mayores → `adultoConyugue` de SU grupo etario

**Descuento Plan Joven (25%):**
- Se aplica SOLO a OSPADEP SALUD
- Aplica a titular y/o cónyuge menores de 35 años
- NO aplica a hijos
- Se calcula sobre el precio base antes de aportes

---

## 7. VARIABLES DEL SISTEMA

### Variables Globales Principales

```javascript
let selectedOption = null;          // Opción de composición familiar elegida
let formData = {};                  // Datos del formulario
let validationErrors = {};          // Errores de validación
let prestadoresData = {};           // Datos de precios cargados del JSON
let preciosExternosDisponibles = false;  // Flag de carga exitosa
window.situacionLaboralActual = 'dependencia';  // Para OSPADEP SALUD
window.planesCalculados = [];       // Planes calculados para mostrar
```

### Plantillas de Descuentos

```javascript
// Usada para Swiss Medical y similares (SIN descuentos)
const plantillaSinDescuentos = {
    capitaTitular: 1.00,    // 100%
    segundaCapita: 1.00,    // 100% - Sin descuento
    menor: 0.50             // 50% - No se usa en Swiss
};

// Plantilla tradicional (NO USADA actualmente)
const plantillaPorcentual = {
    capitaTitular: 1.00,    // 100%
    segundaCapita: 0.75,    // 75% - Con descuento
    menor: 0.50             // 50%
};
```

---

## 8. PROBLEMAS CONOCIDOS Y ERRORES

### 🔴 ERRORES CRÍTICOS

#### 8.1 Código Duplicado y Redundante
- El archivo `script.js` tiene ~11,000 líneas con MUCHO código duplicado
- Existen funciones de cálculo similares para cada prestador cuando podrían unificarse
- Hay datos de respaldo hardcodeados que se duplican con el JSON

#### 8.2 Inconsistencia en Grupos Etarios de Hijos (OMINT)
```javascript
// PROBLEMA: Los precios de hijos se toman del grupo del TITULAR
precioTotal += preciosGrupoTitular.hijo1Menor;  // ← Debería ser del grupo del HIJO?
```
Esto puede causar precios incorrectos si el hijo tiene una edad que corresponde a otro grupo.

#### 8.3 Estructura de Precios Inconsistente entre Prestadores
- OMINT usa `adultoConyugue`, `hijo1Menor`, `hijo2MasMenores`
- OSPADEP usa `adultoConyugue`, `hijoMenor`
- MEDIFE usa estructura completamente diferente
- Esto dificulta el mantenimiento y genera funciones duplicadas

#### 8.4 Campo `conyuge` de MEDIFE No Utilizado
La estructura de MEDIFE incluye precios de `conyuge` que nunca se usan:
```json
"conyuge": { "0-29": 105254, ... }  // NUNCA SE USA
```
Siempre se usa el precio de `matrimonio` cuando hay pareja.

#### 8.5 Variable Global para Situación Laboral
```javascript
window.situacionLaboralActual = 'dependencia';
```
Usar variables globales en `window` es una mala práctica y puede causar conflictos.

### 🟡 ERRORES MENORES

#### 8.6 Validación de Edades Inconsistente
- Algunos prestadores aceptan hijos hasta 25 años (OMINT)
- Otros hasta 29 años (MEDIFE)
- La UI permite ingresar hijos "mayores" de 21-29 pero la lógica varía

#### 8.7 Manejo de Errores Silencioso
```javascript
try {
    const precioFinal = calcularPrecioUnificado(...);
} catch (error) {
    console.error(`❌ Error calculando...`);  // Solo log, no feedback al usuario
}
```

#### 8.8 Falta de Validación de Datos del JSON
No se valida que el JSON tenga la estructura correcta antes de usarlo.

#### 8.9 Código de Backup Obsoleto
Existe `script_backup.js` y código comentado que genera confusión.

### 🟢 MEJORAS SUGERIDAS

#### 8.10 Sin Sistema de Caché
Los precios se recalculan cada vez que se cambia algo, sin cachear resultados.

#### 8.11 Sin Pruebas Automatizadas
No hay tests unitarios para validar los cálculos de precios.

#### 8.12 Dependencia de Consola para Debug
Todo el debugging se hace con `console.log`, sin sistema de logging estructurado.

---

## 9. RECOMENDACIONES PARA V2

### 9.1 Arquitectura

1. **Usar un Framework Moderno**
   - React, Vue o Svelte para mejor organización
   - TypeScript para tipado estático

2. **Separar Lógica de Negocio**
   ```
   /src
     /services
       - PriceCalculatorService.ts
       - PrestadorService.ts
     /models
       - Prestador.ts
       - Plan.ts
       - FamilyComposition.ts
     /components
       - FormWizard/
       - PlanCard/
       - PriceBreakdown/
   ```

3. **Unificar Estructura de Precios**
   ```typescript
   interface PlanPricing {
     type: 'simple' | 'age-based' | 'role-based' | 'family-based';
     ageGroups: AgeGroup[];
     roles?: PricingRole[];
     discounts?: Discount[];
   }
   ```

### 9.2 Sistema de Cálculo

1. **Crear una Clase Calculadora por Tipo**
   ```typescript
   interface PriceCalculator {
     calculate(plan: Plan, family: FamilyComposition): PriceResult;
   }
   
   class SimpleCalculator implements PriceCalculator { ... }
   class AgeBasedCalculator implements PriceCalculator { ... }
   class RoleBasedCalculator implements PriceCalculator { ... }
   class FamilyBasedCalculator implements PriceCalculator { ... }
   ```

2. **Factory Pattern para Seleccionar Calculadora**
   ```typescript
   class CalculatorFactory {
     static getCalculator(prestador: Prestador): PriceCalculator {
       switch(prestador.tipoEstructura) {
         case 'simple': return new SimpleCalculator();
         // ...
       }
     }
   }
   ```

### 9.3 Datos y Validación

1. **Esquema JSON Validado**
   - Usar JSON Schema para validar `precios-data.json`
   - Migrar a base de datos si escala

2. **Versionado de Precios**
   - Mantener histórico de precios
   - Permitir rollback

3. **API Backend**
   - Mover cálculos sensibles al servidor
   - Proteger lógica de negocio

### 9.4 UX/UI

1. **Wizard Mejorado**
   - Validación en tiempo real
   - Previsualización de precio mientras completa

2. **Comparador de Planes**
   - Tabla comparativa lado a lado
   - Filtros avanzados

3. **Responsive Mejorado**
   - Mobile-first design
   - PWA para uso offline

### 9.5 Testing

1. **Tests Unitarios**
   ```typescript
   describe('OmintCalculator', () => {
     it('should calculate correct price for single adult', () => { ... });
     it('should apply child discount correctly', () => { ... });
   });
   ```

2. **Tests de Integración**
   - Validar flujo completo de cotización

3. **Tests E2E**
   - Cypress o Playwright para flujos de usuario

---

## ANEXO A: Ejemplo de Cálculo Completo

### Escenario
- Titular: 35 años, relación de dependencia
- Cónyuge: 32 años
- Hijo 1: 8 años
- Hijo 2: 5 años

### Cálculo OMINT Plan 6500

```javascript
// Grupos etarios
titular → "26-35"
cónyuge → "26-35"
hijos → menores de 25

// Precios del grupo "26-35"
adultoConyugue: 227182
hijo1Menor: 138785
hijo2MasMenores: 120514

// Cálculo
Titular:        227,182
Cónyuge:        227,182
Primer hijo:    138,785
Segundo hijo:   120,514
─────────────────────────
TOTAL:          713,663
```

### Cálculo MEDIFE Plan Plata

```javascript
// Edad mayor del matrimonio: 35 → grupo "30-39"
// Precio matrimonio "30-39": 338,143

// Hijos menores de 21
primerHijo: 124,323
segundoHijo: 90,869

// Cálculo
Matrimonio:     338,143
Primer hijo:    124,323
Segundo hijo:    90,869
─────────────────────────
TOTAL:          553,335
```

---

## ANEXO B: Mapa de Funciones Principales

```
cargarPreciosExternos()
    └── Carga precios-data.json → prestadoresData

generateFormFields(option)
    └── Genera campos dinámicos según opción elegida

handleFormSubmit()
    ├── Valida datos del formulario
    ├── Construye composicionFamiliar
    └── Llama a showPlans()

showPlans()
    ├── Itera todos los prestadores
    ├── Para cada plan: calcularPrecioUnificado()
    ├── Ordena y asigna badges
    └── Genera HTML con generatePlanCard()

calcularPrecioUnificado()
    ├── Determina tipo de estructura
    ├── Llama función específica:
    │   ├── calcularPrecioFinalOMINT()
    │   ├── calcularPrecioFinalSwiss()
    │   ├── calcularPrecioFinalActiva()
    │   ├── calcularPrecioFinalSwNubial()
    │   ├── calcularPrecioFinalSwissBasico()
    │   ├── calcularPrecioFinalMedife()
    │   └── calcularPrecioFinalOspadep()
    ├── Aplica descuento Plan Joven (OSPADEP)
    ├── Aplica descuento especial
    └── Resta aportes

generarDesgloseUnificado()
    └── Genera detalle línea por línea del cálculo
```

---

**Documento generado para el equipo de desarrollo - Versión 2.0 del Cotizador OSPADEP**
