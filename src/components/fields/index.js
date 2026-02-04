export { TextField } from './TextField'
export { NumberField } from './NumberField'
export { EmailField } from './EmailField'
export { DateField } from './DateField'
export { DateTimeField } from './DateTimeField'
export { TextareaField } from './TextareaField'
export { SelectField } from './SelectField'
export { MultiSelectField } from './MultiSelectField'
export { CheckboxField } from './CheckboxField'
export { BooleanField } from './BooleanField'
export { RadioField } from './RadioField'
export { CurrencyField } from './CurrencyField'

// Field type mapper
export const fieldTypeMap = {
    'Text': 'TextField',
    'Number': 'NumberField',
    'Email': 'EmailField',
    'Date': 'DateField',
    'DateTime': 'DateTimeField',
    'Textarea': 'TextareaField',
    'Select': 'SelectField',
    'Multiselect': 'MultiSelectField',
    'Checkbox': 'CheckboxField',
    'Boolean': 'BooleanField',
    'Radio': 'RadioField',
    'Currency': 'CurrencyField',
    'User': 'SelectField', // Single user select
    'MultiUser': 'MultiSelectField', // Multiple user select
}

/**
 * Get the appropriate field component for a given field type
 * @param {string} fieldType - The type of the field
 * @param {string} widget - The widget type (if any)
 * @returns {string} - The component name to render
 */
export function getFieldComponent(fieldType, widget) {
    // Handle widget-specific rendering (e.g., Radio widget for Select type)
    if (fieldType === 'Select' && widget === 'Radio') {
        return 'RadioField'
    }

    // console.log(fieldTypeMap[fieldType] || 'TextField')
    return fieldTypeMap[fieldType] || 'TextField'
}
