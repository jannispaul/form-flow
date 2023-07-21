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

#### Mandatory

`data-form="multi-step"` Add this attribute to the form or parent of it. All steps should be contained in this form.

`data-name` Add this attribute to the form. The field data will be stored in localstorage under this value.

`data-form="step"` Each setp of the form should be in a div and have this attribute.

`data-form="next"` The next button will trigger the validation and going to the next step. There can be multiple and they can be anywhere on the page. Will get `disabled` class as long as fields in active step are not valid yet.

`data-form="back"` The back button will go to the previous step.

#### Optional

`data-form="submit"` The submit button (only one) will submit the form.

`data-form="step-indicator"` The same index as the current step will get the class `active`

### Conditional Logic

Works with radio group or select.
Add the following 3 attributes:

**On the radio/select:**
`data-condition-name`: Sets the name on the element that lets you select a value. Works with input type radio and select.

**On the conditional element:**
`data-condition-el`: Sets the name of the node previously set with `data-condition-name`. Elements with this attribute will be hidden by default.

`data-condition`: Containes one or multiple, comma-seperated values. If at least one condition value is equal to the value of the checked child the condition resolves to true and the conditional element is shown. Spaces at end and beggingin of conditons will be trimmed off. An exclamation mark at the beginning of the condition negates it.

Gotchas:

- The conditional element will be set to `display:none;` and `display:block;`. Its best to not apply any other display property to it but insted nest another div inside.
- In order to achieve nested conditions nest radio/select items in divs that are conditional.

Example:

```html
<select data-condition-name="name1">
  <div data-condition="value1, !value2" data-condition-el="name1"></div>
</select>
```

### Auto save

`data-auto-save`set this attribute on div / form to make all fields contained autosave their data to localstorage.
The data-name on form is necessary as this is what the item in localstorage will be called to differntiate between different forms. Does not work for file inputs.

### Limitations

Only one form per page.
