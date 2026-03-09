import { useEffect, useState } from 'react'
import { useForm } from '../hooks/useForm'
import {
    TextField,
    NumberField,
    EmailField,
    DateField,
    DateTimeField,
    TextareaField,
    SelectField,
    MultiSelectField,
    CheckboxField,
    BooleanField,
    RadioField,
    CurrencyField,
    getFieldComponent,
} from './fields'

/**
 * Dynamic Form Component
 *
 * Renders a form dynamically from config (raw getFormConfiguration() array) returned by useForm.
 * - type:'Section' → renders grouped fields
 * - type:'Model'   → renders child table with inline row editing
 *
 * Props:
 * - flowType: string - "dataform" | "board" | "process"
 * - flowId: string - ID of the flow
 * - formInstanceId: string - Optional instance ID (creates new record if omitted)
 * - title: string - Optional form title
 */
export function DynamicForm({
    flowType = 'dataform',
    flowId = 'Test_All_Fields_A00',
    formInstanceId = 'PkCT9cShTOek',
    title = 'Dynamic Form',
}) {
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const {
        formData,
        config,
        errors,
        updateField,
        save,
        reset,
        loading,
        error,
        isDirty,
        isNewRecord,
        getFieldOptions,
        getTable,
    } = useForm(flowType, flowId, formInstanceId)

    const [localState, setLocalState] = useState(formData)

    useEffect(() => {
        setLocalState(formData)
    }, [formData])

    const handleLocalChange = (fieldId, value) => {
        setLocalState((prev) => ({ ...prev, [fieldId]: value }))
    }

    const handleFieldBlur = async (fieldId, value) => {
        try {
            await updateField(fieldId, value)
            setSubmitSuccess(false)
        } catch (err) {
            console.error('Field update failed:', err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSubmitSuccess(false)
            const success = await save()
            if (success) {
                setSubmitSuccess(true)
                if (window.kf?.client?.showInfo) {
                    window.kf.client.showInfo('Form saved successfully!')
                }
            }
        } catch (err) {
            console.error('Save failed:', err)
        }
    }

    const handleReset = () => {
        reset()
        setSubmitSuccess(false)
    }

    // Resolve typed field component from field.type + field.widget
    const resolveFieldComponent = (field) => {
        const componentName = getFieldComponent(field.type, field.widget)
        const componentMap = {
            TextField,
            NumberField,
            EmailField,
            DateField,
            DateTimeField,
            TextareaField,
            SelectField,
            MultiSelectField,
            CheckboxField,
            BooleanField,
            RadioField,
            CurrencyField,
        }
        return componentMap[componentName] || TextField
    }

    const visibleSections = Array.isArray(config.sections)
        ? config.sections.filter((s) => !s.isHidden)
        : []

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {title}
                    </h1>
                    <div className="h-1 w-24 bg-linear-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>

                {/* General error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <svg
                            className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-red-800">{error}</span>
                    </div>
                )}

                {/* Success */}
                {submitSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <svg
                            className="w-5 h-5 text-green-600 shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-green-800 font-medium">
                            Form saved successfully!
                        </span>
                    </div>
                )}

                {/* New record */}
                {isNewRecord && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                        <svg
                            className="w-5 h-5 text-blue-600 shrink-0 mt-0.5 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span className="text-blue-800">
                            Creating new record...
                        </span>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <div className="p-8">
                            {loading ? (
                                <div className="flex flex-col items-center gap-3 py-12">
                                    <svg
                                        className="w-8 h-8 text-blue-600 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    <p className="text-gray-600">
                                        Loading form...
                                    </p>
                                </div>
                            ) : visibleSections.length === 0 ? (
                                <p className="text-center text-gray-500 py-12">
                                    No fields available
                                </p>
                            ) : (
                                <div className="space-y-10">
                                    {visibleSections.map((section) => {
                                        // ── Field section ──────────────────────────
                                        if (section.type === 'Section') {
                                            return (
                                                <div key={section.id}>
                                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                                        {section.name}
                                                    </h3>
                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        {(
                                                            section.fields || []
                                                        ).map((field) => {
                                                            const FieldComponent =
                                                                resolveFieldComponent(
                                                                    field
                                                                )
                                                            return (
                                                                <FieldComponent
                                                                    key={
                                                                        field.id
                                                                    }
                                                                    field={{
                                                                        Id: field.id,
                                                                        Name: field.name,
                                                                        Type: field.type,
                                                                        Widget: field.widget,
                                                                        Required:
                                                                            field.required,
                                                                    }}
                                                                    value={
                                                                        localState[
                                                                            field
                                                                                .id
                                                                        ]
                                                                    }
                                                                    onChange={(
                                                                        value
                                                                    ) =>
                                                                        handleLocalChange(
                                                                            field.id,
                                                                            value
                                                                        )
                                                                    }
                                                                    onBlur={(
                                                                        value
                                                                    ) =>
                                                                        handleFieldBlur(
                                                                            field.id,
                                                                            value
                                                                        )
                                                                    }
                                                                    error={
                                                                        errors[
                                                                            field
                                                                                .id
                                                                        ]
                                                                    }
                                                                    disabled={
                                                                        loading
                                                                    }
                                                                    getFieldOptions={
                                                                        getFieldOptions
                                                                    }
                                                                />
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        }

                                        // ── Child table section ────────────────────
                                        if (section.type === 'Model') {
                                            const table = getTable(section.id)
                                            const columns = section.fields || []
                                            const rows =
                                                localState[
                                                    `Table::${section.id}`
                                                ] || []
                                            return (
                                                <div key={section.id}>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                                            {section.name}
                                                        </h3>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                table.addRow({})
                                                            }
                                                            disabled={loading}
                                                            className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            + Add Row
                                                        </button>
                                                    </div>

                                                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                                                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    {columns.map(
                                                                        (
                                                                            col
                                                                        ) => (
                                                                            <th
                                                                                key={
                                                                                    col.id
                                                                                }
                                                                                className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                                                            >
                                                                                {
                                                                                    col.name
                                                                                }
                                                                            </th>
                                                                        )
                                                                    )}
                                                                    <th className="px-4 py-2.5 w-12"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-100">
                                                                {rows.length ===
                                                                0 ? (
                                                                    <tr>
                                                                        <td
                                                                            colSpan={
                                                                                columns.length +
                                                                                1
                                                                            }
                                                                            className="px-4 py-6 text-center text-gray-400 text-sm"
                                                                        >
                                                                            No
                                                                            rows
                                                                            yet.
                                                                            Click
                                                                            +
                                                                            Add
                                                                            Row
                                                                            to
                                                                            begin.
                                                                        </td>
                                                                    </tr>
                                                                ) : (
                                                                    rows.map(
                                                                        (
                                                                            row
                                                                        ) => (
                                                                            <tr
                                                                                key={
                                                                                    row._id
                                                                                }
                                                                                className="hover:bg-gray-50"
                                                                            >
                                                                                {columns.map(
                                                                                    (
                                                                                        col
                                                                                    ) => (
                                                                                        <td
                                                                                            key={
                                                                                                col.id
                                                                                            }
                                                                                            className="px-4 py-2"
                                                                                        >
                                                                                            <input
                                                                                                type="text"
                                                                                                defaultValue={
                                                                                                    row[
                                                                                                        col
                                                                                                            .id
                                                                                                    ] ||
                                                                                                    ''
                                                                                                }
                                                                                                onBlur={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    table.updateRow(
                                                                                                        row._id,
                                                                                                        col.id,
                                                                                                        e
                                                                                                            .target
                                                                                                            .value
                                                                                                    )
                                                                                                }
                                                                                                disabled={
                                                                                                    loading
                                                                                                }
                                                                                                className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm disabled:bg-gray-50 disabled:text-gray-400"
                                                                                            />
                                                                                        </td>
                                                                                    )
                                                                                )}
                                                                                <td className="px-4 py-2 text-center">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() =>
                                                                                            table.deleteRow(
                                                                                                row._id
                                                                                            )
                                                                                        }
                                                                                        disabled={
                                                                                            loading
                                                                                        }
                                                                                        className="text-red-500 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
                                                                                        title="Delete row"
                                                                                    >
                                                                                        <svg
                                                                                            className="w-4 h-4"
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20"
                                                                                        >
                                                                                            <path
                                                                                                fillRule="evenodd"
                                                                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                                                clipRule="evenodd"
                                                                                            />
                                                                                        </svg>
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    {rows.length > 0 && (
                                                        <p className="mt-1.5 text-xs text-gray-400">
                                                            {rows.length} row
                                                            {rows.length !== 1
                                                                ? 's'
                                                                : ''}
                                                        </p>
                                                    )}
                                                </div>
                                            )
                                        }

                                        return null
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Divider + Actions */}
                        {visibleSections.length > 0 && !loading && (
                            <>
                                <div className="border-t border-gray-200"></div>
                                <div className="px-8 py-6 bg-gray-50 flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading || !isDirty}
                                        className={`flex-1 px-6 py-2.5 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                                            loading || !isDirty
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                                        }`}
                                    >
                                        {loading ? (
                                            <>
                                                <svg
                                                    className="w-4 h-4 animate-spin"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M19.414 1.586a2 2 0 00-2.828 0L7 11.172V15h3.828l9.586-9.586a2 2 0 000-2.828z" />
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Save
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        disabled={loading || !isDirty}
                                        className={`flex-1 px-6 py-2.5 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                                            loading || !isDirty
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800'
                                        }`}
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 1119.414 9.414 1 1 0 11-1.414-1.414A5 5 0 004.059 4.059V3a1 1 0 01-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Reset
                                    </button>
                                </div>

                                <div className="px-8 py-4 bg-white border-t border-gray-200">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                                                Status
                                            </p>
                                            <p
                                                className={`text-sm font-semibold mt-1 ${isDirty ? 'text-amber-600' : 'text-green-600'}`}
                                            >
                                                {isDirty ? 'Unsaved' : 'Saved'}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                                                Errors
                                            </p>
                                            <p
                                                className={`text-sm font-semibold mt-1 ${Object.keys(errors).length > 0 ? 'text-red-600' : 'text-green-600'}`}
                                            >
                                                {
                                                    Object.keys(
                                                        errors['_root'] || {}
                                                    ).length
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </div>

                {/* Debug */}
                {visibleSections.length > 0 && (
                    <div className="mt-8 space-y-4">
                        <details className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-700">
                                Form Data (Debug)
                            </summary>
                            <pre className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-xs overflow-x-auto text-gray-800">
                                {JSON.stringify(formData, null, 2)}
                            </pre>
                        </details>
                        <details className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-700">
                                Validation Errors (Debug)
                            </summary>
                            <pre className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-xs overflow-x-auto text-gray-800">
                                {JSON.stringify(errors, null, 2)}
                            </pre>
                        </details>
                        <details className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-700">
                                Form Config (Debug)
                            </summary>
                            <pre className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-xs overflow-x-auto text-gray-800">
                                {JSON.stringify(config, null, 2)}
                            </pre>
                        </details>
                    </div>
                )}
            </div>
        </div>
    )
}
