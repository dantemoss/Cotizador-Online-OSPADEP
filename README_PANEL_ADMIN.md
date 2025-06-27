# Panel Administrativo - Cotizador OSPADEP

## 📋 Descripción General

El panel administrativo te permite gestionar los precios de todos los planes médicos de manera dinámica y sencilla. Puedes aplicar aumentos porcentuales masivos o editar precios individuales según las necesidades del momento.

## 🔐 Acceso al Panel

1. **Botón de Acceso**: Haz clic en el ícono de engranaje flotante (⚙️) ubicado en la esquina inferior derecha de la página
2. **Contraseña**: Ingresa la contraseña: `ospadep2024`
3. **Acceso Rápido**: También puedes presionar **Enter** después de escribir la contraseña

## 🛠️ Funcionalidades Principales

### 1. Actualización Masiva por Porcentaje

**Ideal para**: Aumentos generales de precios, ajustes por inflación, descuentos promocionales

**Cómo usar**:

- Haz clic en **"Actualización Masiva"**
- Ingresa el porcentaje de cambio (ej: `1.5` para 1.5% de aumento, `-2` para 2% de descuento)
- Selecciona la categoría:
  - **Todos los planes**: Aplica a planes individuales y familiares
  - **Solo planes individuales**: Únicamente planes para una persona
  - **Solo planes familiares**: Únicamente planes para familias
- Confirma la operación

**Ejemplo**: Si quieres aplicar un aumento del 1.5% a todos los planes, ingresa `1.5` y selecciona "Todos los planes".

### 2. Edición Individual de Precios

**Ideal para**: Ajustes específicos de planes particulares

**Cómo usar**:

- Haz clic en **"Edición Individual"**
- Verás una lista con todos los planes y sus precios actuales
- Modifica directamente el precio en el campo correspondiente
- Los cambios se muestran en tiempo real (verde = aumento, rojo = descuento)
- Haz clic en **"Guardar Cambios"** para aplicar

### 3. Restaurar Precios Originales

**Cómo usar**:

- Haz clic en **"Restaurar Precios Originales"**
- Confirma la acción
- Todos los precios volverán a sus valores iniciales

### 4. Exportar Configuración

**Cómo usar**:

- Haz clic en **"Exportar Configuración"**
- Se descargará un archivo JSON con:
  - Precios originales
  - Precios actuales
  - Histórico de cambios
  - Fecha y hora de exportación

## 📊 Información y Monitoreo

### Precios Actuales

- **Vista general**: Muestra todos los planes con sus precios actuales
- **Indicadores visuales**: Los precios modificados muestran el precio original tachado
- **Estado**: Indica si el precio es original o modificado

### Histórico de Cambios

- **Registro automático**: Todas las modificaciones se guardan automáticamente
- **Información detallada**: Fecha, hora, descripción del cambio y cantidad de planes afectados
- **Límite**: Se mantienen los últimos 50 cambios para optimizar el rendimiento

## 💾 Persistencia de Datos

- **Almacenamiento local**: Los cambios se guardan en el navegador usando localStorage
- **Persistencia**: Los precios modificados se mantienen entre sesiones
- **Compatibilidad**: Funciona sin conexión a internet

## ⚠️ Consideraciones Importantes

### Seguridad

- **Contraseña**: Cambia la contraseña en el código (`ADMIN_PASSWORD`) para mayor seguridad
- **Acceso restringido**: Solo personal autorizado debe conocer la contraseña

### Respaldos

- **Exporta regularmente**: Usa la función de exportar para crear respaldos
- **Antes de cambios importantes**: Siempre exporta la configuración actual

### Validaciones

- **Confirmaciones**: Todas las operaciones masivas requieren confirmación
- **Valores mínimos**: Los precios no pueden ser negativos o cero
- **Cálculos automáticos**: Los porcentajes se aplican y redondean automáticamente

## 🔄 Flujo de Trabajo Recomendado

1. **Antes de hacer cambios**: Exporta la configuración actual como respaldo
2. **Aplica los cambios**: Usa actualización masiva o edición individual según necesites
3. **Verifica**: Revisa los precios en la vista de "Precios Actuales"
4. **Documenta**: El sistema registra automáticamente los cambios en el histórico
5. **Respaldo post-cambios**: Exporta nuevamente si los cambios son significativos

## 🎯 Ejemplos de Uso Común

### Aumento Mensual por Inflación

1. Accede al panel administrativo
2. Selecciona "Actualización Masiva"
3. Ingresa el porcentaje (ej: `2.5` para 2.5%)
4. Selecciona "Todos los planes"
5. Confirma la operación

### Promoción en Planes Familiares

1. Selecciona "Actualización Masiva"
2. Ingresa un valor negativo (ej: `-10` para 10% de descuento)
3. Selecciona "Solo planes familiares"
4. Confirma la operación

### Ajuste de Plan Específico

1. Selecciona "Edición Individual"
2. Busca el plan específico en la lista
3. Modifica el precio directamente
4. Guarda los cambios

## 🆘 Resolución de Problemas

### No puedo acceder al panel

- Verifica que la contraseña sea correcta: `ospadep2024`
- Asegúrate de hacer clic en el botón de engranaje flotante

### Los cambios no se aplican

- Confirma que hayas hecho clic en "Guardar Cambios" o "Calcular y Aplicar"
- Verifica que los valores ingresados sean válidos (números positivos)

### Quiero deshacer cambios

- Usa "Restaurar Precios Originales" para volver al estado inicial
- O modifica manualmente los precios en "Edición Individual"

## 📞 Soporte

Para cualquier consulta o problema con el panel administrativo, contacta al equipo técnico con los detalles específicos del inconveniente.
