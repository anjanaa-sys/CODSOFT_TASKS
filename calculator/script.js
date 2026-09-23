const display = document.getElementById("display");
const history = document.getElementById("history");
const keys = document.querySelector(".keys");

let expression = "";
let justCalculated = false;

function updateDisplay(value = expression || "0") {
  display.textContent = value;
}

function isOperator(char) {
  return ["+", "−", "×", "÷"].includes(char);
}

function addValue(value) {
  if (justCalculated && !isOperator(value)) {
    expression = "";
    history.textContent = "";
  }
  justCalculated = false;

  if (value === ".") {
    const current = expression.split(/[+−×÷]/).pop();
    if (current.includes(".")) return;
    if (!current) expression += "0";
  }

  if (isOperator(value)) {
    if (!expression) return;
    if (isOperator(expression.at(-1))) {
      expression = expression.slice(0, -1);
    }
  }

  expression += value;
  updateDisplay();
}

function calculate() {
  if (!expression || isOperator(expression.at(-1))) return;

  try {
    const original = expression;
    let safe = expression
      .replaceAll("×", "*")
      .replaceAll("÷", "/")
      .replaceAll("−", "-");

    // Percent converts a number such as 25% to 0.25.
    safe = safe.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

    if (!/^[0-9+\-*/().% ]+$/.test(safe)) throw new Error("Invalid");

    const result = Function('"use strict"; return (' + safe + ')')();
    if (!Number.isFinite(result)) throw new Error("Math error");

    history.textContent = original + " =";
    expression = String(Number(result.toFixed(10)));
    updateDisplay();
    justCalculated = true;
  } catch {
    history.textContent = expression;
    expression = "";
    display.textContent = "Error";
    justCalculated = true;
  }
}

function clearAll() {
  expression = "";
  history.textContent = "";
  justCalculated = false;
  updateDisplay();
}

function deleteLast() {
  if (justCalculated) {
    clearAll();
    return;
  }
  expression = expression.slice(0, -1);
  updateDisplay();
}

function percent() {
  if (!expression) return;
  const match = expression.match(/(\d+(?:\.\d+)?)$/);
  if (!match) return;
  const number = Number(match[1]) / 100;
  expression = expression.slice(0, match.index) + number;
  updateDisplay();
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (value !== undefined) addValue(value);
  if (action === "clear") clearAll();
  if (action === "delete") deleteLast();
  if (action === "percent") percent();
  if (action === "calculate") calculate();
});

document.addEventListener("keydown", (event) => {
  const keyMap = {
    "*": "×",
    "/": "÷",
    "-": "−"
  };

  if (/\d/.test(event.key) || event.key === ".") {
    addValue(event.key);
  } else if (["+", "-", "*", "/"].includes(event.key)) {
    addValue(keyMap[event.key] || event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    deleteLast();
  } else if (event.key === "Escape") {
    clearAll();
  } else if (event.key === "%") {
    percent();
  }
});
