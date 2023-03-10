//
// Variables
//

const form = document.querySelector("[data-form='multi-step'] form");
const formName = form.dataset.name;
const steps = document.querySelectorAll("[data-form='step']");
const backButtons = document.querySelectorAll("[data-form='back-btn']");
const nextButtons = document.querySelectorAll("[data-form='next-btn']");
const submitButton = document.querySelector("[data-form='submit-btn']");
const stepIndicators = document.querySelectorAll(
  "[data-form='step-indicator']"
);
const conditionElements = document.querySelectorAll("[data-condition]");
const conditionalElements = document.querySelectorAll("[data-condition-name]");
const repeatableItem = document.querySelector("[data-repeat='item']");
const addRepeatableButton = document.querySelectorAll(
  "[data-repeat='add-item']"
);
const deleteRepeatableButton = document.querySelectorAll(
  "[data-repeat='delete-item']"
);

// Start at the first step
let currentStep = 0;

//
// Functions
//

// Chech if element is visble (does not work on fixed elements)
function isVisible(el) {
  return !(el.offsetParent === null);
  // return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

// Find items in array that have the same name tag
function isOneChecked(array, name) {
  return array.find((item) => {
    return item.name === name && item.checked;
  });
}
// Make sure all conditional logic is displayed correctely
function updateLogic() {
  conditionElements.forEach((el) => {
    updateConditionalElements(el);
  });
}

// Show active step and update step indicator
function showActiveStep(params) {
  steps.forEach((el, index) => {
    // console.log(el, index);
    index === currentStep
      ? (el.style.display = "block")
      : (el.style.display = "none");
    index === currentStep
      ? stepIndicators[index]?.classList.add("active")
      : stepIndicators[index]?.classList.remove("active");
  });

  // Make sure all conditional fields are displayed correctely
  updateLogic();
}

// Validate the current step
function validateStep(hideValidationOverlays = false) {
  let isValid = true;

  // Get all required inputs, textareas and selects
  const requiredFields = Array.from(
    steps[currentStep].querySelectorAll(
      "input[required], textarea[required], select[required]"
    )
  );

  // Loop over requiered fields
  for (let i = 0; i < requiredFields.length; i++) {
    // Only validate if visible
    if (!isVisible(requiredFields[i])) continue;

    // Trigger browser validity check
    const fieldIsValid = hideValidationOverlays
      ? requiredFields[i].checkValidity()
      : requiredFields[i].reportValidity();

    // Field is invalid stop
    if (!fieldIsValid) return (isValid = false);
  }
  return isValid;
}

function validateStepWithoutOverlays(params) {
  console.log("validate silent");
  const hideValidationOverlays = true;
  if (!validateStep(hideValidationOverlays)) {
    nextButtons.forEach((button) => button.classList.add("disabled"));
  } else {
    nextButtons.forEach((button) => button.classList.remove("disabled"));
  }
}

// Hide all elements with data-condition attribute
function hideConditionalElements() {
  conditionalElements.forEach((el) => (el.style.display = "none"));
}

// Go to previous step
function prevStep() {
  currentStep > 0 && currentStep--;
  showActiveStep();
}
// Go to next step
function nextStep() {
  // Dont go if fields are invalid
  if (!validateStep()) return;

  currentStep < steps.length && currentStep++;
  showActiveStep();
  validateStepWithoutOverlays();
}

// Submit form
function submitForm(params) {
  // Dont submit if fields are invalid
  if (!validateStep()) return;

  form.submit();
  // Clear saved formdata from localstorage
  localStorage.removeItem(formName);
}

//
// Conditional logic
//

// console.log("conditionObject:", conditionArray);
function updateConditionalElements(el) {
  let conditionHolder;
  // Check if el or a child of it holds condition
  el.dataset.condition
    ? (conditionHolder = el)
    : (conditionHolder = el.querySelector("[data-condition]"));

  // Get selected/checked value
  const value = el.querySelector(":checked")?.value;

  // Get conditions from attribute and turn into array
  const conditionValues = conditionHolder?.dataset.condition
    .split(",")
    .map((item) => item.trim());

  // Get element to be shown if condition is true
  const elementToBeShown = document.querySelector(
    `[data-condition-name="${conditionHolder?.dataset.show}"]`
  );
  // Get element to be hidden if condition is true
  const elementToBeHidden = document.querySelector(
    `[data-condition-name="${conditionHolder?.dataset.hide}"]`
  );

  // If there is no more element to be updated return
  if (!elementToBeShown) return;

  function meetsAnyCondition(arrayOfConditions, activeValue) {
    return arrayOfConditions.some((condition) => condition === activeValue);
  }
  // Check if any condition is true
  const conditionIsMet = meetsAnyCondition(conditionValues, value);

  if (!conditionHolder) return;

  // If no condtion is true or the element is not visible hide the dependant element
  if (!conditionIsMet) {
    elementToBeShown.style.display = "none";
    if (elementToBeHidden) {
      elementToBeHidden.style.display = "block";
    }
  } else {
    elementToBeShown.style.display = "block";
    if (elementToBeHidden) {
      elementToBeHidden.style.display = "none";
    }
  }
  // Call the function on the updated element to check for more conditions
  // updateConditionalElements(elementToBeShown);
}

//
// Auto save
//

// Helper function for saving data to inditfy fields by name or id
function getName(field) {
  if (field.name.length > 0) {
    return field.name;
  }
  if (field.id.length > 0) {
    return field.id;
  }
  return null;
}

function saveDataToLocalStorage(event) {
  // Only run for fields in the [data-auto-save] form
  if (!event.target.closest("[data-form='multi-step']")) return;

  // Get an ID for the field
  var name = getName(event.target);
  if (!name) return;

  // Get existing data from localStorage
  let saved = localStorage.getItem(formName);
  saved = saved ? JSON.parse(saved) : {};

  // Add the field to the localStorage object
  // If it's a checkbox, use on/off values
  // Otherwise, save the value
  if (event.target.type === "checkbox") {
    saved[name] = event.target.checked ? "on" : "off";
  } else {
    saved[name] = event.target.value;
  }
  // Save the object back to localStorage
  localStorage.setItem(formName, JSON.stringify(saved));
}

// Load saved form data from localStorage
function loadDataFromLocalStorage() {
  console.log("loading");
  // Get data from localStorage
  let saved = localStorage.getItem(formName);
  if (!saved) return;
  saved = JSON.parse(saved);
  // Get all of the form fields
  let fields = document.querySelectorAll(
    "[data-auto-save] input, [data-auto-save] textarea, [data-auto-save] select"
  );

  // Loop through each field and load any saved data in localStorage
  Array.prototype.slice.call(fields).forEach(function (field) {
    // console.log(field.type);
    // If the field has no usable ID, skip it
    let name = getName(field);
    if (!name) return;

    // Skip the files input as the File object cannot be stored in localstorage
    if (name.includes("files")) return;

    // If there's no saved data in localStorage, skip it
    if (!saved[name]) return;

    // Set the field value to the saved data in localStorage
    // If it's a checkbox, set it's checked state
    // If it's a radio button and its value matches, set its checked state
    // Otherwise, set the value
    if (field.type === "checkbox") {
      field.checked = saved[name] === "on" ? true : false;
    } else if (field.type === "radio") {
      field.checked = saved[name] === field.value ? true : false;
    } else {
      field.value = saved[name];
    }
  });

  // Make sure all conditional fields are displayed correctely
  updateLogic();
}

//
// Setup the form
//
function initiateForm() {
  loadDataFromLocalStorage();
  hideConditionalElements();
  showActiveStep();
  validateStepWithoutOverlays();
}
// Run once on startup
initiateForm();

//
// Event listeners
//

// Listen for input events
document.addEventListener(
  "input",
  function (event) {
    validateStepWithoutOverlays();
    saveDataToLocalStorage;
  },
  false
);
// Event listener for clicks
document.addEventListener("click", function (event) {
  // Click of next button
  if (event.target.matches("[data-form='next-btn']")) {
    nextStep();
  }
  // Click of back button
  if (event.target.matches("[data-form='back-btn']")) {
    prevStep();
  }
  // Click on conditional logic element trigger
  if (event.target.closest("[data-condition]")) {
    updateConditionalElements(event.target.closest("[data-condition]"));
  }
  // Click on conditional logic element trigger
  if (event.target.closest("[data-repeat='delete-item']")) {
    deleteRepeatable(event.target.closest("[data-repeat='item']"));
  }
  // Click on conditional logic element trigger
  if (event.target.closest("[data-repeat='add-item']")) {
    addRepeatable(event.target.closest("[data-repeat='add-item']"));
  }
  // Click of back button
  if (event.target.matches("[data-form='submit-btn']")) {
    submitForm();
  }
});

// When select choice is changed
document.addEventListener(
  "change",
  function (event) {
    validateStepWithoutOverlays();
    // Click on conditional logic element trigger
    if (event.target.closest("[data-condition]")) {
      updateConditionalElements(event.target.closest("[data-condition]"));
    }
  },
  true
);
