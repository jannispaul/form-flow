# FormFlow

Attributes based mutli step forms with wefblow or any HTML.

## Features:

- Multi step navigation
- Validation
- Conditional Logic
- Autosave

[ ] Current Step / Total numbre of steps
[ ] File upload
[ ] Generators
[ ] Data from Parameters?
[ ] submission handling

## Usage:

### General

`data-form="multi-step` Add this attribute to the form or parent of it. All steps should be contained in this form.

`data-name` Add this attribute to the form. The field data will be stored in localstorage under this value.

`data-form="step"` Each setp of the form should be in a div and have this attribute.

`data-form="step-indicator"` The same index as the current step will get the class `active`

`data-form="next-btn"` The next button will trigger the validation and going to the next step. There can be multiple and they can be anywhere on the page. Will get `disabled`class as long as fields in active step are not valid yet.

`data-form="back-btn"` THh back button will go to the previous step.

`data-form="submit-btn"` The submit button (only one) will submit the form.

### Conditional Logic

Add the following 2 attributes to a radio group, or select:

`data-condition`: Containes one or multiple, comma-seperated values. If one condition value is equal to the value of the checked child the condition resolves to true and the conditional element is shown. Spaces at end and beggingin of conditons will be trimmed off.
Example: `<select data-condition="value1, value2">`

`data-show`: Containes the name of the node to be shown if the condition is met / hidden if condition is not met.

`data-hide`: Containes the name of the node to be hidden if the condition is met / shown if the condition is not met.

`data-condition-name`: Set the name on the node to be shown/hidden depending on the previously defined condition. Elements with this attribute will be hidden by default automatically.

Chained conditions are dependent on their ancestors. Meaning if a condition is contained within a block that's hidden by another condition it and all other conditions that follow it will be hidden as well.

### Auto save

`data-auto-save`set this attribute on div to make all fields contained autosave their data to localstorage.
The data-name on form is neceassry as this is what the item in localstorage will be called to differntiate between different forms. Does not work for file inputs.

### Limitations

Only one form per page.
