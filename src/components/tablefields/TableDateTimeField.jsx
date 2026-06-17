import { Input } from '@/components/ui/input'

export function TableDateTimeField({ field, value, onChange, onBlur, disabled }) {
    const display = value ? String(value).slice(0, 16) : ''

    return (
        <Input
            type="datetime-local"
            value={display}
            onChange={(e) => onChange(e.target.value || null)}
            onBlur={(e) => onBlur(e.target.value || null)}
            disabled={disabled || field.ReadOnly}
            className="h-8 text-sm px-2 border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-400 bg-white"
        />
    )
}
