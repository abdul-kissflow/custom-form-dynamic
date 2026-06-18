import { useEffect, useState } from 'react'
import { useForm } from '../hooks/useForm'
import { getFieldComponent } from './fields'
import * as Fields from './fields'
import { TableFieldCell } from './tablefields/index.js'

/* ─────────────────────────────────────────────────────────────────────────────
   TABBED LAYOUT  —  Dark left-rail navigation + clean content panel
   Palette: slate-900 nav  ·  white content  ·  violet accent
───────────────────────────────────────────────────────────────────────────── */

function SectionIcon({ index }) {
    return (
        <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0">
            {index + 1}
        </span>
    )
}

function FieldRenderer({ field, value, onChange, onBlur, error, disabled, getFieldOptions }) {
    const componentName = getFieldComponent(field.Type, field.Widget)
    const Component = Fields[componentName] || Fields.TextField
    return (
        <Component
            field={field}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={error}
            disabled={disabled}
            getFieldOptions={getFieldOptions}
        />
    )
}

export function FormTabbed({
    flowType = 'dataform',
    flowId,
    formInstanceId,
    title = 'Form',
}) {
    const { formData, config, errors, updateField, save, reset, loading, error, isDirty, getFieldOptions } =
        useForm(flowType, flowId, formInstanceId)
    const [localState, setLocalState] = useState(formData)
    const [activeIdx, setActiveIdx] = useState(0)
    const [saving, setSaving] = useState(false)

    useEffect(() => { setLocalState(formData) }, [formData])

    const sections = Array.isArray(config.sections)
        ? config.sections.filter((s) => !s.isHidden)
        : []

    const handleChange = (fieldId, value) => setLocalState((p) => ({ ...p, [fieldId]: value }))
    const handleBlur = async (fieldId, value) => { try { await updateField(fieldId, value) } catch { /* noop */ } }
    const handleSave = async () => {
        setSaving(true)
        try { await save() } finally { setSaving(false) }
    }

    const activeSection = sections[activeIdx]

    return (
        <div className="flex h-screen bg-slate-950 font-sans overflow-hidden">
            {/* ── Left rail ──────────────────────────────────────────── */}
            <aside className="w-56 flex flex-col bg-slate-900 border-r border-slate-800 shrink-0">
                {/* Brand bar */}
                <div className="px-5 py-4 border-b border-slate-800">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-0.5">Form</p>
                    <h1 className="text-sm font-semibold text-white truncate">{title}</h1>
                </div>

                {/* Nav items */}
                <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
                    {loading ? (
                        <div className="px-3 py-6 flex justify-center">
                            <svg className="w-5 h-5 animate-spin text-slate-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        </div>
                    ) : sections.map((s, i) => (
                        <button
                            key={s.Id}
                            type="button"
                            onClick={() => setActiveIdx(i)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left text-sm transition-all ${
                                i === activeIdx
                                    ? 'bg-violet-600 text-white font-medium'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                        >
                            <SectionIcon index={i} />
                            <span className="truncate">{s.Name || `Section ${i + 1}`}</span>
                            {s.Type === 'Model' && (
                                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">
                                    table
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Footer actions */}
                <div className="p-3 border-t border-slate-800 space-y-1.5">
                    {isDirty && (
                        <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-amber-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Unsaved changes
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || !isDirty}
                        className="w-full py-2 rounded-md text-sm font-semibold bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                        type="button"
                        onClick={reset}
                        disabled={!isDirty}
                        className="w-full py-2 rounded-md text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </aside>

            {/* ── Content panel ────────────────────────────────────────── */}
            <main className="flex-1 flex flex-col overflow-hidden bg-white">
                {/* Content header */}
                {activeSection && (
                    <div className="px-10 pt-8 pb-6 border-b border-slate-100">
                        <div className="flex items-baseline gap-3">
                            <span className="text-xs font-semibold text-slate-400">
                                {activeIdx + 1} / {sections.length}
                            </span>
                            <h2 className="text-2xl font-bold text-slate-900">
                                {activeSection.Name || `Section ${activeIdx + 1}`}
                            </h2>
                        </div>
                        {error && (
                            <p className="mt-2 text-sm text-red-500">{error}</p>
                        )}
                    </div>
                )}

                {/* Fields */}
                <div className="flex-1 overflow-y-auto px-10 py-8">
                    {!loading && activeSection?.Type === 'Section' && (
                        <div className="max-w-2xl grid gap-7 sm:grid-cols-2">
                            {(activeSection.Fields || []).map((field) => (
                                <FieldRenderer
                                    key={field.Id}
                                    field={field}
                                    value={localState[field.Id]}
                                    onChange={(v) => handleChange(field.Id, v)}
                                    onBlur={(v) => handleBlur(field.Id, v)}
                                    error={errors[field.Id]}
                                    disabled={loading}
                                    getFieldOptions={getFieldOptions}
                                />
                            ))}
                        </div>
                    )}

                    {!loading && activeSection?.Type === 'Model' && (
                        <TableSection
                            section={activeSection}
                            localState={localState}
                            loading={loading}
                            errors={errors}
                            getFieldOptions={getFieldOptions}
                            flowType={flowType}
                            flowId={flowId}
                            formInstanceId={formInstanceId}
                        />
                    )}
                </div>

                {/* Prev / Next nav */}
                {sections.length > 1 && (
                    <div className="px-10 py-4 border-t border-slate-100 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                            disabled={activeIdx === 0}
                            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </button>
                        <div className="flex gap-1.5">
                            {sections.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setActiveIdx(i)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        i === activeIdx ? 'bg-violet-600 w-5' : 'bg-slate-200 hover:bg-slate-400'
                                    }`}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setActiveIdx((i) => Math.min(sections.length - 1, i + 1))}
                            disabled={activeIdx === sections.length - 1}
                            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}

function TableSection({ section, localState, loading, errors, getFieldOptions, flowType, flowId, formInstanceId }) {
    const { getTable } = useForm(flowType, flowId, formInstanceId)
    const table = getTable(section.Id)
    const columns = section.Fields || []
    const rows = localState[`Table::${section.Id}`] || []

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500">{rows.length} row{rows.length !== 1 ? 's' : ''}</p>
                <button
                    type="button"
                    onClick={() => table.addRow({})}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 transition-colors"
                >
                    + Add Row
                </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            {columns.map((col) => (
                                <th key={col.Id} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap min-w-[140px]">
                                    {col.Name}
                                </th>
                            ))}
                            <th className="w-10" />
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr><td colSpan={columns.length + 1} className="py-12 text-center text-slate-400 text-sm">No rows yet</td></tr>
                        ) : rows.map((row) => (
                            <tr key={row._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                                {columns.map((col) => (
                                    <td key={col.Id} className="px-2 py-1.5">
                                        <TableFieldCell field={col} rowId={row._id} tableId={section.Id} value={row[col.Id]} table={table} loading={loading} getFieldOptions={getFieldOptions} />
                                    </td>
                                ))}
                                <td className="px-2 text-center">
                                    <button type="button" onClick={() => table.deleteRow(row._id)} disabled={loading} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
