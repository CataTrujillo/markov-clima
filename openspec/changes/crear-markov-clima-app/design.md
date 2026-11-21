# Design

## Context

El repositorio no contiene todavía archivos de aplicación ni una configuración de dependencias. La interfaz, el cálculo y las pruebas deben poder ejecutarse localmente con HTML, CSS y JavaScript, sin servicios externos. Si la lógica del navegador usa módulos nativos, la página se servirá por HTTP local en vez de abrirse directamente con `file://`. Los comportamientos obligatorios están definidos en `specs/markov-clima/spec.md`.

## Goals / Non-Goals

**Goals:**
- Separar el cálculo y la validación de la manipulación del DOM para probarlos directamente.
- Mantener consistentes el orden de estados, la matriz, los resultados tabulares y las gráficas.
- Proporcionar una ejecución simple en navegador y pruebas con herramientas integradas de Node.js.

**Non-Goals:**
- Consultar datos meteorológicos, publicar un pronóstico o incorporar servicios remotos.
- Añadir frameworks de interfaz, bibliotecas de gráficas o herramientas de compilación.

## Decisions

- **Módulos nativos de JavaScript y archivos estáticos.** Mantener la página, los estilos y la lógica en archivos HTML, CSS y JavaScript separados. Es suficiente para una aplicación pequeña y permite ejecutar el código en navegador y desde Node.js sin dependencias de producción.
- **Lógica de dominio pura y vector fila.** Implementar validación y cálculo en funciones independientes del DOM. Representar la matriz como filas de origen y columnas de destino y calcular `p(n) = p(0) × P^n` mediante multiplicaciones sucesivas por `P`, conservando los resultados en los pasos 1, 3, 5 y 10. Esto evita invertir por error la convención de la matriz y facilita probar cada horizonte.
- **Validación antes de convertir y calcular.** Comprobar primero que cada entrada no esté vacía, convertirla a número y verificar que sea finita y esté en `[0, 1]`; después comprobar cada suma de fila contra `1e-9`. No normalizar filas automáticamente, porque eso cambiaría silenciosamente la matriz elegida por la persona.
- **Gráficas de barras con CSS y tabla como representación legible.** Mostrar los mismos resultados numéricos en ambas vistas, sin incorporar una dependencia de visualización. La tabla también ofrece una alternativa textual a las barras.
- **Pruebas con `node:test`.** Probar las funciones puras con matrices conocidas, resultados esperados para cada horizonte 1, 3, 5 y 10 y casos inválidos como campos vacíos, valores no finitos, valores fuera de rango y sumas de fila justo dentro y fuera de la tolerancia. Documentar en README cómo servir la página por HTTP local y ejecutar las pruebas con Node.js.

## Risks / Trade-offs

- [La aritmética de punto flotante puede producir pequeñas diferencias en sumas] → Aplicar la tolerancia especificada de `1e-9` a las sumas de filas sin redondear los valores usados internamente.
- [Las barras por sí solas no comunican con precisión los valores] → Mantener una tabla de porcentajes junto a cada horizonte y etiquetar los tres estados en ambas representaciones.
- [Un campo vacío convertido directamente con `Number` podría parecer cero] → Detectar y rechazar la cadena vacía antes de convertirla.
