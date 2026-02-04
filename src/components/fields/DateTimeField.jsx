import { Input } from '@/components/ui/input'

export function DateTimeField({ field, value, onChange, onBlur, error, disabled = false }) {
    // Convert ISO 8601 to datetime-local format (YYYY-MM-DDTHH:mm)
    const formatValue = (val) => {
        if (!val) return ''
        // Handle both ISO and datetime-local formats
        return val.slice(0, 16)
    }

    return (
        <div className="space-y-2">
            <label htmlFor={field.Id} className="block text-sm font-semibold text-gray-700">
                {field.Name}
                {field.Required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
                id={field.Id}
                type="datetime-local"
                name={field.Id}
                value={formatValue(value)}
                onChange={(e) => onChange(e.target.value)}
                onBlur={(e) => onBlur(e.target.value)}
                disabled={disabled || field.ReadOnly}
                className={error ? 'border-red-300 bg-red-50' : ''}
            />
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
