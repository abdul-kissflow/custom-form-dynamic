import { Checkbox } from '@/components/ui/checkbox'

export function CheckboxField({ field, value, onChange, onBlur, error, disabled = false }) {
    const handleChange = (checked) => {
        onChange(checked)
        onBlur(checked)
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Checkbox
                    id={field.Id}
                    checked={value || false}
                    onCheckedChange={handleChange}
                    disabled={disabled || field.ReadOnly}
                />
                <label
                    htmlFor={field.Id}
                    className="text-sm font-semibold text-gray-700 cursor-pointer"
                >
                    {field.Name}
                    {field.Required && <span className="text-red-500 ml-1">*</span>}
                </label>
            </div>
            {error && (
                <p className="text-sm text-red-600 font-medium flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.707 13.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8.5-8.5z" clipRule="evenodd" />
                    </svg>
                    {Array.isArray(error) ? error[0] : error}
                </p>
            )}
        </div>
    )
}
