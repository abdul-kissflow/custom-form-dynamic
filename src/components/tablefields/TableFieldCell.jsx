import { useState, useEffect, useCallback } from 'react'
import { getTableFieldComponent } from './resolver.js'

export function TableFieldCell({ field, rowId, tableId, value, table, loading, getFieldOptions, error }) {
    const [localValue, setLocalValue] = useState(value ?? null)

    useEffect(
        function syncValue() {
            setLocalValue(value ?? null)
        },
        [value]
    )

    const handleChange = (val) => setLocalValue(val)
    const handleBlur = (val) => table.updateRow(rowId, field.Id, val)

    const boundGetFieldOptions = useCallback(
        (fieldId) => getFieldOptions(fieldId, tableId, rowId),
        [getFieldOptions, tableId, rowId]
    )

    const TableComponent = getTableFieldComponent(field.Type, field.Widget)
    const hasError = Array.isArray(error) ? error.length > 0 : Boolean(error)

    return (
        <div>
            <TableComponent
                field={field}
                value={localValue}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                getFieldOptions={boundGetFieldOptions}
            />
            {hasError && (
                <p className="mt-0.5 text-[10px] text-red-500 leading-tight">
                    {Array.isArray(error) ? error[0] : error}
                </p>
            )}
        </div>
    )
}
