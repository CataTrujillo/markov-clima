import {
  calculateDistributions,
  MatrixValidationError,
  STATES,
  validateMatrix,
} from "./model.mjs";

const STATE_COLORS = ["#e6a83f", "#7d9baa", "#537bc0"];
const form = document.querySelector("#simulation-form");
const errorBox = document.querySelector("#validation-errors");
const resultsSection = document.querySelector("#results");
const chartsContainer = document.querySelector("#charts");
const resultsTableBody = document.querySelector("#results-table-body");
const resultsSummary = document.querySelector("#results-summary");
const matrixInputs = [...form.querySelectorAll("input[data-row][data-column]")];
const percentFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 2,
});

function readMatrixInputs() {
  return STATES.map((_, rowIndex) => STATES.map((__, columnIndex) => {
    return form.elements.namedItem(`p-${rowIndex}-${columnIndex}`).value;
  }));
}

function clearValidationErrors() {
  errorBox.replaceChildren();
  errorBox.hidden = true;
  for (const input of matrixInputs) {
    input.removeAttribute("aria-invalid");
  }
}

function showValidationErrors(errors) {
  clearValidationErrors();

  const errorList = document.createElement("ul");
  for (const error of errors) {
    const item = document.createElement("li");
    item.textContent = error.message;
    errorList.append(item);

    if (error.row !== null && error.column !== null) {
      form.elements.namedItem(`p-${error.row}-${error.column}`).setAttribute("aria-invalid", "true");
    } else if (error.row !== null) {
      for (let columnIndex = 0; columnIndex < STATES.length; columnIndex += 1) {
        form.elements.namedItem(`p-${error.row}-${columnIndex}`).setAttribute("aria-invalid", "true");
      }
    }
  }

  errorBox.append(errorList);
  errorBox.hidden = false;
  resultsSection.hidden = true;
  chartsContainer.replaceChildren();
  resultsTableBody.replaceChildren();
}

function formatPercent(probability) {
  return `${percentFormatter.format(probability * 100)} %`;
}

function createChart(distribution) {
  const chart = document.createElement("section");
  chart.className = "horizon-chart";
  chart.setAttribute("aria-label", `Distribución después de ${distribution.steps} ${distribution.steps === 1 ? "paso" : "pasos"}`);

  const heading = document.createElement("h3");
  heading.textContent = `${distribution.steps} ${distribution.steps === 1 ? "paso" : "pasos"}`;
  chart.append(heading);

  for (let stateIndex = 0; stateIndex < STATES.length; stateIndex += 1) {
    const probability = distribution.probabilities[stateIndex];
    const row = document.createElement("div");
    row.className = "chart-row";

    const label = document.createElement("span");
    label.className = "chart-label";
    label.textContent = STATES[stateIndex];

    const track = document.createElement("div");
    track.className = "bar-track";
    track.setAttribute("aria-hidden", "true");

    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.setProperty("--bar-width", `${probability * 100}%`);
    fill.style.setProperty("--bar-color", STATE_COLORS[stateIndex]);
    track.append(fill);

    const value = document.createElement("span");
    value.className = "chart-value";
    value.textContent = formatPercent(probability);

    row.append(label, track, value);
    chart.append(row);
  }

  return chart;
}

function renderResults(distributions, initialStateIndex) {
  chartsContainer.replaceChildren(...distributions.map(createChart));
  resultsTableBody.replaceChildren();

  for (const distribution of distributions) {
    const row = document.createElement("tr");
    const stepHeader = document.createElement("th");
    stepHeader.scope = "row";
    stepHeader.textContent = String(distribution.steps);
    row.append(stepHeader);

    for (const probability of distribution.probabilities) {
      const cell = document.createElement("td");
      cell.textContent = formatPercent(probability);
      row.append(cell);
    }

    resultsTableBody.append(row);
  }

  resultsSummary.textContent = `Estado inicial: ${STATES[initialStateIndex]}. Cada fila muestra la distribución tras el número de pasos indicado.`;
  resultsSection.hidden = false;
}

form.addEventListener("input", clearValidationErrors);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearValidationErrors();

  try {
    const matrix = validateMatrix(readMatrixInputs());
    const initialStateIndex = Number(form.elements.namedItem("initial-state").value);
    const distributions = calculateDistributions(matrix, initialStateIndex);
    renderResults(distributions, initialStateIndex);
  } catch (error) {
    if (error instanceof MatrixValidationError) {
      showValidationErrors(error.errors);
      return;
    }

    throw error;
  }
});
