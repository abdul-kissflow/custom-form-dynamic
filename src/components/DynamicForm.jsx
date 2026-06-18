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
    RatingField,
    SliderField,
    UserSelectField,
    MultiUserSelectField,
    SequenceNumberField,
    AggregationField,
    ImageField,
    AttachmentField,
    ChecklistField,
    LookupField,
    SignatureField,
    getFieldComponent,
} from './fields'
import { TableFieldCell } from './tablefields/index.js'

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

    const resolveFieldComponent = (field) => {
        const componentName = getFieldComponent(field.Type, field.Widget)
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
            RatingField,
            SliderField,
            UserSelectField,
            MultiUserSelectField,
            SequenceNumberField,
            AggregationField,
            ImageField,
            AttachmentField,
            ChecklistField,
            LookupField,
            SignatureField,
        }
        return componentMap[componentName] || TextField
    }

    const visibleSections = Array.isArray(config.sections)
        ? config.sections.filter((s) => !s.isHidden)
        : []

    const hasErrors = Object.keys(errors).length > 0

    return (
        <div className="min-h-screen bg-[--color-background] font-sans">
            <form onSubmit={handleSubmit} noValidate>
                {/* ── Sticky top bar ───────────────────────────────────── */}
                <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-[--color-border]">
                    <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <h1 className="text-base font-semibold text-[--color-foreground] truncate">
                                {title}
                            </h1>
                            {isDirty && (
                                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                                    Unsaved
                                </span>
                            )}
                            {submitSuccess && (
                                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Saved
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={loading || !isDirty}
                                className="px-3 py-1.5 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !isDirty}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg bg-[--color-primary] text-white hover:opacity-90 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Saving…
                                    </>
                                ) : (
                                    'Save'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Page body ────────────────────────────────────────── */}
                <div className="max-w-5xl mx-auto px-6 py-8 space-y-2">

                    {/* Banner messages */}
                    {error && (
                        <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                            <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {isNewRecord && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-sm">
                            <svg className="w-4 h-4 animate-spin shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Creating new record…
                        </div>
                    )}

                    {/* ── Form card ──────────────────────────────────────── */}
                    <div className="bg-white rounded-xl border border-[--color-border] shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex flex-col items-center gap-3 py-20">
                                <svg className="w-7 h-7 text-[--color-primary] animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <p className="text-sm text-slate-400">Loading form…</p>
                            </div>
                        ) : visibleSections.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-20 text-slate-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-sm">No fields available</p>
                            </div>
                        ) : (
                            <div>
                                {visibleSections.map((section, sectionIdx) => {
                                    // ── Field section ───────────────────────
                                    if (section.Type === 'Section') {
                                        return (
                                            <div
                                                key={section.Id}
                                                className={`px-8 py-6 ${sectionIdx > 0 ? 'border-t border-[--color-border]' : ''}`}
                                            >
                                                {section.Name && (
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <span className="w-0.5 h-4 rounded-full bg-[--color-primary] shrink-0" />
                                                        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                                            {section.Name}
                                                        </h2>
                                                    </div>
                                                )}
                                                <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                                    {(section.Fields || []).map((field) => {
                                                        const FieldComponent = resolveFieldComponent(field)
                                                        return (
                                                            <FieldComponent
                                                                key={field.Id}
                                                                field={field}
                                                                value={localState[field.Id]}
                                                                onChange={(value) => handleLocalChange(field.Id, value)}
                                                                onBlur={(value) => handleFieldBlur(field.Id, value)}
                                                                error={errors[field.Id]}
                                                                disabled={loading}
                                                                getFieldOptions={getFieldOptions}
                                                            />
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    }

                                    // ── Child table section ─────────────────
                                    if (section.Type === 'Model') {
                                        const table = getTable(section.Id)
                                        const columns = section.Fields || []
                                        const rows = localState[`Table::${section.Id}`] || []

                                        return (
                                            <div
                                                key={section.Id}
                                                className={`${sectionIdx > 0 ? 'border-t border-[--color-border]' : ''}`}
                                            >
                                                {/* Table header */}
                                                <div className="px-8 py-5 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-0.5 h-4 rounded-full bg-[--color-primary] shrink-0" />
                                                        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                                            {section.Name}
                                                        </h2>
                                                        {rows.length > 0 && (
                                                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                                                                {rows.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => table.addRow({})}
                                                        disabled={loading}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[--color-primary] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shadow-sm"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                        Add Row
                                                    </button>
                                                </div>

                                                {/* Table */}
                                                <div className="overflow-x-auto border-t border-[--color-border]">
                                                    <table className="min-w-full text-sm">
                                                        <thead>
                                                            <tr className="bg-slate-50 border-b border-[--color-border]">
                                                                {columns.map((col) => (
                                                                    <th
                                                                        key={col.Id}
                                                                        className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap min-w-[140px]"
                                                                    >
                                                                        {col.Name}
                                                                    </th>
                                                                ))}
                                                                <th className="px-4 py-3 w-12" />
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {rows.length === 0 ? (
                                                                <tr>
                                                                    <td
                                                                        colSpan={columns.length + 1}
                                                                        className="px-4 py-10 text-center text-slate-400 text-sm"
                                                                    >
                                                                        No rows yet — click <strong className="font-medium text-slate-500">Add Row</strong> to begin.
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                rows.map((row, rowIdx) => (
                                                                    <tr
                                                                        key={row._id}
                                                                        className={`border-b border-[--color-border] last:border-0 transition-colors hover:bg-slate-50/60 ${rowIdx % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'}`}
                                                                    >
                                                                        {columns.map((col) => (
                                                                            <td key={col.Id} className="px-2 py-1.5">
                                                                                <TableFieldCell
                                                                                    field={col}
                                                                                    rowId={row._id}
                                                                                    tableId={section.Id}
                                                                                    value={row[col.Id]}
                                                                                    table={table}
                                                                                    loading={loading}
                                                                                    getFieldOptions={getFieldOptions}
                                                                                />
                                                                            </td>
                                                                        ))}
                                                                        <td className="px-3 py-1.5 text-center">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => table.deleteRow(row._id)}
                                                                                disabled={loading}
                                                                                className="p-1 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                                                title="Delete row"
                                                                            >
                                                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                                </svg>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )
                                    }

                                    return null
                                })}

                                {/* Error summary */}
                                {hasErrors && (
                                    <div className="px-8 py-4 border-t border-red-100 bg-red-50/60">
                                        <p className="text-xs text-red-600 font-medium">
                                            {Object.keys(errors['_root'] || {}).length} validation error(s) — review fields above.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Debug panels ───────────────────────────────────── */}
                    {visibleSections.length > 0 && (
                        <div className="space-y-2 pt-4">
                            {[
                                { label: 'Form Data', data: formData },
                                { label: 'Validation Errors', data: errors },
                                { label: 'Form Config', data: config },
                            ].map(({ label, data }) => (
                                <details key={label} className="group bg-white rounded-lg border border-[--color-border] overflow-hidden text-xs">
                                    <summary className="px-5 py-3 cursor-pointer select-none flex items-center justify-between font-medium text-slate-600 hover:bg-slate-50">
                                        {label}
                                        <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <pre className="px-5 py-4 bg-slate-50 border-t border-[--color-border] overflow-x-auto text-slate-700 leading-relaxed">
                                        {JSON.stringify(data, null, 2)}
                                    </pre>
                                </details>
                            ))}
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}
