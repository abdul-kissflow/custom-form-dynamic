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
export { RatingField } from './RatingField'
export { SliderField } from './SliderField'
export { UserSelectField } from './UserSelectField'
export { MultiUserSelectField } from './MultiUserSelectField'
export { SequenceNumberField } from './SequenceNumberField'
export { AggregationField } from './AggregationField'
export { ImageField } from './ImageField'
export { AttachmentField } from './AttachmentField'
export { ChecklistField } from './ChecklistField'
export { LookupField } from './LookupField'

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
    'User': 'UserSelectField', // Single user select
    'MultiUser': 'MultiUserSelectField', // Multiple user select
    'StarRating': 'RatingField',
    'Slider': 'SliderField',
    'SequenceNumber': 'SequenceNumberField',
    'Image': 'ImageField',
    'Attachment': 'AttachmentField',
    'Checklist': 'ChecklistField',
    'Lookup': 'LookupField',
    'RemoteLookup': 'LookupField',
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

    // Aggregation fields carry their *display* type in `Type` (Number, Currency,
    // Text, Date, DateTime) and are identified by `Widget === 'Aggregation'`
    if (widget === 'Aggregation') {
        return 'AggregationField'
    }

    if(fieldType === 'Reference') {
        return 'LookupField'
    }

    // console.log(fieldTypeMap[fieldType] || 'TextField')
    return fieldTypeMap[fieldType] || 'TextField'
}
