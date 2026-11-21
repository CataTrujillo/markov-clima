# Proposal

## Why

Hace falta una aplicación sencilla para explorar cómo evoluciona una distribución de estados climáticos en una cadena de Markov. La visualización de varios horizontes y la advertencia explícita de que el modelo es hipotético permiten aprender el cálculo sin confundirlo con un pronóstico meteorológico.

## What Changes

- Crear una aplicación web en HTML, CSS y JavaScript con los estados soleado, nublado y lluvioso.
- Permitir editar la matriz de transición (filas de origen y columnas de destino) y elegir el estado inicial, validando probabilidades y filas antes de calcular.
- Calcular `p(n) = p(0) × P^n` y presentar en gráficas de barras y una tabla las distribuciones después de 1, 3, 5 y 10 pasos, usando como valores iniciales `[[0.7, 0.2, 0.1], [0.3, 0.4, 0.3], [0.2, 0.3, 0.5]]`.
- Indicar claramente que los resultados son hipotéticos y no constituyen un pronóstico real.
- Añadir pruebas automatizadas con `node:test` para los cálculos, los cuatro horizontes y las entradas inválidas, además de instrucciones de ejecución y pruebas en el README.

## Capabilities

### New Capabilities
- `markov-clima`: Configuración, validación, simulación y presentación de distribuciones hipotéticas de estados climáticos mediante una cadena de Markov.

### Modified Capabilities
- Ninguna.

## Impact

- Nuevos archivos de interfaz web y lógica de simulación en HTML, CSS y JavaScript.
- Pruebas ejecutables con el módulo integrado `node:test` y documentación de inicio en el README.
- No se requieren servicios externos; la aplicación calcula localmente y no realiza predicciones meteorológicas reales.
