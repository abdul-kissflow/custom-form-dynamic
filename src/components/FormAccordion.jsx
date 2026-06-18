import { useEffect, useState } from 'react'
import { useForm } from '../hooks/useForm'
import { getFieldComponent } from './fields'
import * as Fields from './fields'
import { TableFieldCell } from './tablefields/index.js'

/* ─────────────────────────────────────────────────────────────────────────────
   ACCORDION LAYOUT  —  Stacked collapsible sections, ink & paper aesthetic
   Palette: warm off-white bg  ·  slate-900 headers  ·  amber accent
───────────────────────────────────────────────────────────────────────────── */

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

function AccordionPanel({ section, isOpen, onToggle, children, index, total }) {
    return (
        <div className={`overflow-hidden transition-all duration-300 ${index === 0 ? 'rounded-t-xl' : ''} ${index === total - 1 ? 'rounded-b-xl' : ''}`}>
            {/* Header */}
            <button
                type="button"
                onClick={onToggle}
                className={`w-full flex items-center justify-between px-7 py-5 text-left transition-colors ${
                    isOpen
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white'
                } ${index > 0 ? 'border-t border-slate-700' : ''}`}
            >
                <div className="flex items-center gap-4">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded transition-colors ${
                        isOpen ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-400'
                    }`}>
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                        <h3 className="text-sm font-semibold leading-tight">
                            {section.Name || `Section ${index + 1}`}
                        </h3>
                        {section.Type === 'Model' && (
                            <p className="text-xs text-slate-500 mt-0.5">Child table</p>
                        )}
                    </div>
                </div>
                <svg
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-400' : 'text-slate-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Body */}
            <div
                className={`bg-white transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-7 py-6 border-x border-b border-slate-200 last:border-b-0">
                    {children}
                </div>
            </div>
        </div>
    )
}

export function FormAccordion({
    flowType = 'dataform',
    flowId,
    formInstanceId,
    title = 'Form',
}) {
    const { formData, config, errors, updateField, save, reset, loading, error, isDirty, getTable, getFieldOptions } =
        useForm(flowType, flowId, formInstanceId)
    const [localState, setLocalState] = useState(formData)
    const [openSections, setOpenSections] = useState(new Set([0]))
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => { setLocalState(formData) }, [formData])

    const sections = Array.isArray(config.sections)
        ? config.sections.filter((s) => !s.isHidden)
        : []

    const handleChange = (fieldId, v) => setLocalState((p) => ({ ...p, [fieldId]: v }))
    const handleBlur = async (fieldId, v) => { try { await updateField(fieldId, v) } catch { /* noop */ } }

    const toggle = (idx) => {
        setOpenSections((prev) => {
            const next = new Set(prev)
            if (next.has(idx)) { next.delete(idx) } else { next.add(idx) }
            return next
        })
    }

    const expandAll = () => setOpenSections(new Set(sections.map((_, i) => i)))
    const collapseAll = () => setOpenSections(new Set())

    const handleSave = async () => {
        setSaving(true)
        setSaved(false)
        try {
            const ok = await save()
            if (ok) setSaved(true)
        } finally { setSaving(false) }
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] font-sans">
            <div className="max-w-3xl mx-auto px-4 py-10">

                {/* ── Page header ───────────────────────────────────────── */}
                <div className="mb-8">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">
                                {flowType}
                            </p>
                            <h1 className="text-3xl font-bold text-slate-900 leading-tight">{title}</h1>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            {isDirty && (
                                <span className="text-xs text-amber-600 font-medium">Unsaved changes</span>
                            )}
                            {saved && (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Saved
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={reset}
                                disabled={!isDirty}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white"
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving || !isDirty}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                {saving ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : null}
                                {saving ? 'Saving…' : 'Save'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Controls row */}
                    {sections.length > 1 && !loading && (
                        <div className="mt-5 flex items-center gap-1">
                            <span className="text-xs text-slate-400 mr-2">
                                {sections.length} section{sections.length !== 1 ? 's' : ''}
                            </span>
                            <button
                                type="button"
                                onClick={expandAll}
                                className="text-xs font-medium text-slate-500 hover:text-slate-900 underline underline-offset-2 transition-colors"
                            >
                                Expand all
                            </button>
                            <span className="text-slate-300 mx-1">·</span>
                            <button
                                type="button"
                                onClick={collapseAll}
                                className="text-xs font-medium text-slate-500 hover:text-slate-900 underline underline-offset-2 transition-colors"
                            >
                                Collapse all
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Accordion ─────────────────────────────────────────── */}
                {loading ? (
                    <div className="rounded-xl bg-slate-900 px-7 py-12 flex justify-center">
                        <svg className="w-7 h-7 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    </div>
                ) : (
                    <div className="rounded-xl overflow-hidden shadow-sm border border-slate-800">
                        {sections.map((section, idx) => (
                            <AccordionPanel
                                key={section.Id}
                                section={section}
                                isOpen={openSections.has(idx)}
                                onToggle={() => toggle(idx)}
                                index={idx}
                                total={sections.length}
                            >
                                {section.Type === 'Section' && (
                                    <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                                        {(section.Fields || []).map((field) => (
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

                                {section.Type === 'Model' && (
                                    <AccordionTable
                                        section={section}
                                        localState={localState}
                                        loading={loading}
                                        getTable={getTable}
                                        getFieldOptions={getFieldOptions}
                                    />
                                )}
                            </AccordionPanel>
                        ))}
                    </div>
                )}

                {/* ── Footer ────────────────────────────────────────────── */}
                {!loading && sections.length > 0 && (
                    <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
                        <span>
                            {openSections.size} of {sections.length} section{sections.length !== 1 ? 's' : ''} open
                        </span>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving || !isDirty}
                            className="text-amber-600 font-semibold hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? 'Saving…' : isDirty ? '↑ Save changes' : 'No changes'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

function AccordionTable({ section, localState, loading, getTable, getFieldOptions }) {
    const table = getTable(section.Id)
    const columns = section.Fields || []
    const rows = localState[`Table::${section.Id}`] || []
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-500">{rows.length} row{rows.length !== 1 ? 's' : ''}</p>
                <button
                    type="button"
                    onClick={() => table.addRow({})}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-40 transition-colors"
                >
                    + Add Row
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
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
                        {rows.length === 0
                            ? <tr><td colSpan={columns.length + 1} className="py-10 text-center text-slate-400 text-sm">No rows yet</td></tr>
                            : rows.map((row, rowIdx) => (
                                <tr key={row._id} className={`border-b border-slate-100 last:border-0 ${rowIdx % 2 === 1 ? 'bg-amber-50/20' : 'bg-white'}`}>
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
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
