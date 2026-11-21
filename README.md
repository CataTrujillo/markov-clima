# Markov Clima

Aplicación educativa para explorar cómo cambia una distribución de estados climáticos en una cadena de Markov. **Autora: Maria Trujillo.**

Los resultados son hipotéticos y no constituyen un pronóstico meteorológico real.

## Requisitos

- Node.js 20 o posterior, que incluye `node:test`.
- npm, incluido con Node.js.

No se necesitan dependencias externas ni ejecutar `npm install`.

## Iniciar la aplicación

Desde la carpeta del proyecto, en PowerShell:

```powershell
npm.cmd start
```

Abre <http://127.0.0.1:4173/> en el navegador. El servidor escucha solo en la interfaz local; deténlo con `Ctrl+C`.

La aplicación ofrece una matriz editable con filas de origen y columnas de destino, y permite elegir soleado, nublado o lluvioso como estado inicial. Cada valor debe ser finito y estar entre 0 y 1; cada fila debe sumar 1 con una tolerancia de `1e-9`. Después de calcular, se muestran gráficas de barras y una tabla porcentual para 1, 3, 5 y 10 pasos.

## Ejecutar las pruebas

Desde la carpeta del proyecto, en PowerShell:

```powershell
npm.cmd test
```

Las pruebas usan el ejecutor integrado `node:test` y verifican la validación de entradas, el límite de tolerancia y los resultados esperados independientes en cada horizonte.
