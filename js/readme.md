# FormFlow

Attributes based mutli step forms with wefblow or any HTML.

## Features:

- Multi step navigation
- Validation
- Conditional Logic
  [ ] Autosave
  [ ] Data from Parameters
  [ ] File upload
  [ ] Generators
  [ ] Current Step / Total numbre of steps

## Usage:

Add attributes for the featuers

### Limitations

Only one form per page.

### Setup

`data-form="multi-step` Add this attribute to the form or parent of it. All steps should be contained in this form.
`data-name` Add this attribute to the form. The field data will be stored in localstorage under this value.
`data-form="step"` Each setp of the form should be in a div and have this attribute.
`data-form="step-indicator"` The same index as the current step will get the class `active`
`data-form="next-btn"` The next button will trigger the validation and going to the next step. There can be multiple and they can be anywhere on the page.
`data-form="back-btn"` THh back button will go to the previous step.
`data-form="submit-btn"` The submit button (only one) will submit the form.

### Conditional Logic

Add the following 2 attributes to a radio group, or select:
`data-condition`: Containes one or multiple, comma-seperated values. If one condition value is equal to the value of the checked child the condition resolves to true and the conditional element is shown. Spaces at end and beggingin of conditons will be trimmed off.
`data-show`: Containes the name of the node to be shown if the condition is met.

`data-condition-name`: Set the name on the node to be shown/hidden depending on the previously defined condition. Elements with this attribute will be hidden by default automatically.

Chained conditions are dependent on their ancestors. Meaning if a condition is contained within a block that's hidden by another condition it and all other conditions that follow it will be hidden as well.

### Auto save

`data-auto-save`set this attribute on div to make all fields contained autosave their data to localstorage.
