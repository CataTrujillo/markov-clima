# Spec Delta

## Purpose

Permite explorar localmente distribuciones hipotéticas de estados climáticos mediante una cadena de Markov configurable, sin presentar los resultados como pronósticos meteorológicos.

## ADDED Requirements

### Requirement: Configuración inicial y selección de estado
La aplicación SHALL presentar los estados soleado, nublado y lluvioso, la matriz de transición predeterminada y un selector de estado inicial. Las filas representan el estado de origen y las columnas el estado de destino, en el orden de los estados mostrado.

#### Scenario: Carga de valores predeterminados
- **WHEN** la persona abre la aplicación
- **THEN** ve la matriz `[[0.7, 0.2, 0.1], [0.3, 0.4, 0.3], [0.2, 0.3, 0.5]]` y el estado inicial soleado seleccionado

#### Scenario: Identificación de la aplicación
- **WHEN** la persona ve la página principal
- **THEN** la página muestra el nombre “Markov Clima” y la autora “Maria Trujillo”

#### Scenario: Selección de otro estado inicial
- **WHEN** la persona selecciona nublado o lluvioso como estado inicial
- **THEN** ese estado se usa como estado de probabilidad inicial uno y los otros estados tienen probabilidad inicial cero

### Requirement: Validación de la matriz editable
La aplicación SHALL aceptar cálculos únicamente cuando cada campo de la matriz contenga un número finito entre 0 y 1 inclusive y cada fila cumpla `|suma - 1| <= 1e-9`.

#### Scenario: Matriz válida en el límite de tolerancia
- **WHEN** todos los campos son números finitos en `[0, 1]` y cada fila cumple `|suma - 1| <= 1e-9`
- **THEN** la matriz se acepta para el cálculo

#### Scenario: Campo vacío
- **WHEN** la persona intenta calcular con cualquier campo de la matriz vacío
- **THEN** la aplicación rechaza el cálculo y señala claramente el campo vacío

#### Scenario: Valor no numérico o no finito
- **WHEN** la persona intenta calcular con un valor no numérico o no finito
- **THEN** la aplicación rechaza el cálculo y señala el campo inválido

#### Scenario: Valor fuera del intervalo
- **WHEN** la persona intenta calcular con un valor menor que cero o mayor que uno
- **THEN** la aplicación rechaza el cálculo y señala el valor fuera de rango

#### Scenario: Fila cuya suma excede la tolerancia
- **WHEN** los valores de una fila no suman uno dentro de la tolerancia de `1e-9`
- **THEN** la aplicación rechaza el cálculo e identifica la fila que debe corregirse

### Requirement: Cálculo de horizontes de la cadena de Markov
Con una matriz válida y un estado inicial seleccionado, la aplicación SHALL calcular cada distribución como vector fila según `p(n) = p(0) × P^n` para `n` igual a 1, 3, 5 y 10.

#### Scenario: Distribuciones en los cuatro horizontes
- **WHEN** la persona calcula con una matriz válida y un estado inicial
- **THEN** la aplicación presenta una distribución correspondiente a cada uno de los horizontes 1, 3, 5 y 10, en ese orden

#### Scenario: Un paso desde soleado con la matriz predeterminada
- **WHEN** el estado inicial es soleado y se calcula un paso con la matriz predeterminada
- **THEN** la distribución del primer horizonte es soleado `0.7`, nublado `0.2` y lluvioso `0.1`

### Requirement: Presentación e interpretación de resultados
La aplicación SHALL mostrar cada distribución calculada en una gráfica de barras y en una tabla de porcentajes, y SHALL advertir que las probabilidades son hipotéticas y no constituyen un pronóstico real.

#### Scenario: Visualización de resultados
- **WHEN** se muestran resultados de un cálculo válido
- **THEN** cada uno de los cuatro horizontes tiene una gráfica de barras y una fila o sección correspondiente en la tabla de porcentajes, con los tres estados identificados

#### Scenario: Advertencia sobre la naturaleza de los resultados
- **WHEN** la persona consulta la aplicación o sus resultados
- **THEN** se muestra claramente que las probabilidades son hipotéticas y no constituyen un pronóstico real
