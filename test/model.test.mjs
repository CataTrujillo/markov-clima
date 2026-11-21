import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateDistributions,
  DEFAULT_MATRIX,
  HORIZONS,
  MatrixValidationError,
  validateMatrix,
} from "../src/model.mjs";

function defaultMatrixAsStrings() {
  return DEFAULT_MATRIX.map((row) => row.map(String));
}

function getValidationError(matrix) {
  let validationError;
  assert.throws(
    () => validateMatrix(matrix),
    (error) => {
      validationError = error;
      return error instanceof MatrixValidationError;
    },
  );
  return validationError;
}

test("acepta la matriz predeterminada", () => {
  assert.deepEqual(validateMatrix(defaultMatrixAsStrings()), DEFAULT_MATRIX);
});

test("rechaza los campos vacíos", () => {
  const matrix = defaultMatrixAsStrings();
  matrix[1][2] = " ";

  const error = getValidationError(matrix);
  assert.ok(error.errors.some((entry) => entry.code === "empty" && entry.row === 1 && entry.column === 2));
});

test("rechaza entradas no numéricas y no finitas", () => {
  for (const invalidValue of ["no es número", "NaN", "Infinity", "-Infinity"]) {
    const matrix = defaultMatrixAsStrings();
    matrix[0][0] = invalidValue;

    const error = getValidationError(matrix);
    assert.ok(error.errors.some((entry) => entry.code === "finite" && entry.row === 0 && entry.column === 0));
  }
});

test("rechaza valores fuera de [0, 1]", () => {
  for (const invalidValue of ["-0.01", "1.01"]) {
    const matrix = defaultMatrixAsStrings();
    matrix[2][1] = invalidValue;

    const error = getValidationError(matrix);
    assert.ok(error.errors.some((entry) => entry.code === "range" && entry.row === 2 && entry.column === 1));
  }
});

test("acepta una diferencia de suma igual al límite de tolerancia", () => {
  const matrix = defaultMatrixAsStrings();
  matrix[0] = [String(1 - 1e-9), "0", "0"];

  assert.deepEqual(validateMatrix(matrix)[0], [1 - 1e-9, 0, 0]);
});

test("rechaza una diferencia de suma superior a la tolerancia", () => {
  const matrix = defaultMatrixAsStrings();
  matrix[0] = [String(1 - 1.1e-9), "0", "0"];

  const error = getValidationError(matrix);
  assert.ok(error.errors.some((entry) => entry.code === "row-sum" && entry.row === 0));
});

test("calcula los cuatro horizontes desde nublado con valores esperados independientes", () => {
  const expected = [
    { steps: 1, probabilities: [0.3, 0.4, 0.3] },
    { steps: 3, probabilities: [0.426, 0.292, 0.282] },
    { steps: 5, probabilities: [0.44976, 0.28444, 0.2658] },
    { steps: 10, probabilities: [0.4563614352, 0.2826516496, 0.2609869152] },
  ];

  const actual = calculateDistributions(DEFAULT_MATRIX, 1);

  assert.deepEqual(actual.map(({ steps }) => steps), HORIZONS);
  for (let horizonIndex = 0; horizonIndex < expected.length; horizonIndex += 1) {
    for (let stateIndex = 0; stateIndex < expected[horizonIndex].probabilities.length; stateIndex += 1) {
      assert.ok(
        Math.abs(actual[horizonIndex].probabilities[stateIndex] - expected[horizonIndex].probabilities[stateIndex]) < 1e-12,
        `Paso ${expected[horizonIndex].steps}, estado ${stateIndex}`,
      );
    }

    const probabilitySum = actual[horizonIndex].probabilities.reduce((sum, probability) => sum + probability, 0);
    assert.ok(Math.abs(probabilitySum - 1) < 1e-12);
  }
});

test("usa la fila del estado seleccionado como distribución del primer paso", () => {
  const actual = calculateDistributions(DEFAULT_MATRIX, 2);
  assert.deepEqual(actual[0].probabilities, DEFAULT_MATRIX[2]);
});

test("rechaza un índice de estado inicial inválido", () => {
  assert.throws(() => calculateDistributions(DEFAULT_MATRIX, 3), RangeError);
});
