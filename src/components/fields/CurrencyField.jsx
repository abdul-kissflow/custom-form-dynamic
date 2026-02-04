import { Input } from '@/components/ui/input'

export function CurrencyField({ field, value, onChange, onBlur, error, disabled = false }) {
    const formatValue = (val) => {
        if (!val) return ''
        // Parse and format as currency
        const num = parseFloat(val)
        return isNaN(num) ? val : num.toString()
    }

    return (
        <div className="space-y-2">
            <label htmlFor={field.Id} className="block text-sm font-semibold text-gray-700">
                {field.Name}
                {field.Required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-600 text-sm">$</span>
                <Input
                    id={field.Id}
                    type="number"
                    name={field.Id}
                    value={formatValue(value)}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={(e) => onBlur(e.target.value)}
                    placeholder={`Enter ${field.Name.toLowerCase()}`}
                    disabled={disabled || field.ReadOnly}
                    step={field.Decimalpoint ? '0.01' : '1'}
                    className={`pl-8 ${error ? 'border-red-300 bg-red-50' : ''}`}
                />
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
