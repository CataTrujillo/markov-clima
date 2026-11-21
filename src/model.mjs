export const STATES = Object.freeze(["soleado", "nublado", "lluvioso"]);
export const HORIZONS = Object.freeze([1, 3, 5, 10]);
export const DEFAULT_MATRIX = Object.freeze([
  Object.freeze([0.7, 0.2, 0.1]),
  Object.freeze([0.3, 0.4, 0.3]),
  Object.freeze([0.2, 0.3, 0.5]),
]);

export const ROW_SUM_TOLERANCE = 1e-9;

export class MatrixValidationError extends Error {
  constructor(errors) {
    super("La matriz contiene valores inválidos.");
    this.name = "MatrixValidationError";
    this.errors = errors;
  }
}

export function validateMatrix(rawMatrix) {
  if (
    !Array.isArray(rawMatrix)
    || rawMatrix.length !== STATES.length
    || rawMatrix.some((row) => !Array.isArray(row) || row.length !== STATES.length)
  ) {
    throw new MatrixValidationError([
      { code: "shape", row: null, column: null, message: "La matriz debe tener 3 filas y 3 columnas." },
    ]);
  }

  const matrix = [];
  const errors = [];

  for (let rowIndex = 0; rowIndex < STATES.length; rowIndex += 1) {
    const row = [];

    for (let columnIndex = 0; columnIndex < STATES.length; columnIndex += 1) {
      const rawValue = rawMatrix[rowIndex][columnIndex];
      const valueText = typeof rawValue === "string" ? rawValue.trim() : rawValue;

      if (valueText === "") {
        errors.push({
          code: "empty",
          row: rowIndex,
          column: columnIndex,
          message: `Falta el valor de ${STATES[rowIndex]} a ${STATES[columnIndex]}.`,
        });
        row.push(Number.NaN);
        continue;
      }

      const value = typeof valueText === "number"
        ? valueText
        : typeof valueText === "string"
          ? Number(valueText)
          : Number.NaN;

      if (!Number.isFinite(value)) {
        errors.push({
          code: "finite",
          row: rowIndex,
          column: columnIndex,
          message: `El valor de ${STATES[rowIndex]} a ${STATES[columnIndex]} debe ser un número finito.`,
        });
        row.push(Number.NaN);
        continue;
      }

      if (value < 0 || value > 1) {
        errors.push({
          code: "range",
          row: rowIndex,
          column: columnIndex,
          message: `El valor de ${STATES[rowIndex]} a ${STATES[columnIndex]} debe estar entre 0 y 1.`,
        });
      }

      row.push(value);
    }

    matrix.push(row);
  }

  if (errors.length === 0) {
    for (let rowIndex = 0; rowIndex < STATES.length; rowIndex += 1) {
      const rowSum = matrix[rowIndex].reduce((sum, value) => sum + value, 0);

      if (Math.abs(rowSum - 1) > ROW_SUM_TOLERANCE) {
        errors.push({
          code: "row-sum",
          row: rowIndex,
          column: null,
          message: `La fila de ${STATES[rowIndex]} debe sumar 1 (tolerancia: ${ROW_SUM_TOLERANCE}).`,
        });
      }
    }
  }

  if (errors.length > 0) {
    throw new MatrixValidationError(errors);
  }

  return matrix;
}

export function calculateDistributions(rawMatrix, initialStateIndex) {
  const matrix = validateMatrix(rawMatrix);

  if (!Number.isInteger(initialStateIndex) || initialStateIndex < 0 || initialStateIndex >= STATES.length) {
    throw new RangeError("El estado inicial seleccionado no es válido.");
  }

  let distribution = STATES.map((_, index) => Number(index === initialStateIndex));
  const results = [];

  for (let step = 1; step <= HORIZONS[HORIZONS.length - 1]; step += 1) {
    const nextDistribution = STATES.map(() => 0);

    for (let origin = 0; origin < STATES.length; origin += 1) {
      for (let destination = 0; destination < STATES.length; destination += 1) {
        nextDistribution[destination] += distribution[origin] * matrix[origin][destination];
      }
    }

    distribution = nextDistribution;

    if (HORIZONS.includes(step)) {
      results.push({ steps: step, probabilities: [...distribution] });
    }
  }

  return results;
}
