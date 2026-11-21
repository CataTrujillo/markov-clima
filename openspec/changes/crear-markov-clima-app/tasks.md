# Tasks

## 1. Modelo de Markov y pruebas

- [x] 1.1 Crear funciones independientes del DOM para validar campos y filas de la matriz; verificar con `node:test` campos vacíos, valores no numéricos o no finitos, valores fuera de `[0, 1]`, una diferencia de suma igual a `1e-9` aceptada y una diferencia superior rechazada.
- [x] 1.2 Implementar la distribución inicial de vector fila y `p(n) = p(0) × P^n` para 1, 3, 5 y 10 pasos; verificar con `node:test` las distribuciones esperadas en cada horizonte y al menos un estado inicial distinto de soleado.

## 2. Interfaz y documentación

- [x] 2.1 Crear la página HTML y los estilos CSS para mostrar el nombre y la autora, los tres estados, la matriz editable, el selector inicial, las gráficas de barras, la tabla porcentual y la advertencia hipotética; verificar visualmente que las cuatro gráficas y sus valores tabulares identifican los mismos estados y horizontes.
- [x] 2.2 Conectar el formulario con el modelo y mostrar errores claros en español para entradas inválidas; verificar que una matriz inválida no produce un cálculo y que al corregirla se muestran los cuatro horizontes.
- [x] 2.3 Documentar en README cómo servir la aplicación por HTTP local (sin abrir módulos con `file://`) y ejecutar las pruebas `node:test`; verificar que los comandos documentados se ejecutan desde las instrucciones indicadas y que las pruebas terminan correctamente.
