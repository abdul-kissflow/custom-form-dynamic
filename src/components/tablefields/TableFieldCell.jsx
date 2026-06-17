import { useState, useEffect, useCallback } from 'react'
import { getTableFieldComponent } from './resolver.js'

export function TableFieldCell({ field, rowId, tableId, value, table, loading, getFieldOptions }) {
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

    return (
        <TableComponent
            field={field}
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            getFieldOptions={boundGetFieldOptions}
        />
    )
}
