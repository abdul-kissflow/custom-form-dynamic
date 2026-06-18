import { useEffect, useState } from 'react'
import { useForm } from '../hooks/useForm'
import { getFieldComponent } from './fields'
import * as Fields from './fields'
import { TableFieldCell } from './tablefields/index.js'

/* ─────────────────────────────────────────────────────────────────────────────
   COLORFUL LAYOUT  —  Bold per-section palette, vivid gradient header
   Each section cycles through a curated set of color themes.
───────────────────────────────────────────────────────────────────────────── */

const SECTION_PALETTES = [
    {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        header: 'bg-gradient-to-r from-rose-500 to-pink-500',
        badge: 'bg-rose-100 text-rose-700',
        btn: 'bg-rose-500 hover:bg-rose-400 text-white',
        dot: 'bg-rose-400',
        label: 'text-rose-600',
        row: 'hover:bg-rose-50/60',
        addRow: 'border-rose-400 text-rose-600 hover:bg-rose-500 hover:text-white',
    },
    {
        bg: 'bg-violet-50',
        border: 'border-violet-200',
        header: 'bg-gradient-to-r from-violet-600 to-indigo-500',
        badge: 'bg-violet-100 text-violet-700',
        btn: 'bg-violet-600 hover:bg-violet-500 text-white',
        dot: 'bg-violet-400',
        label: 'text-violet-600',
        row: 'hover:bg-violet-50/60',
        addRow: 'border-violet-500 text-violet-600 hover:bg-violet-600 hover:text-white',
    },
    {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        header: 'bg-gradient-to-r from-amber-500 to-orange-400',
        badge: 'bg-amber-100 text-amber-700',
        btn: 'bg-amber-500 hover:bg-amber-400 text-white',
        dot: 'bg-amber-400',
        label: 'text-amber-600',
        row: 'hover:bg-amber-50/60',
        addRow: 'border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white',
    },
    {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        header: 'bg-gradient-to-r from-emerald-600 to-teal-500',
        badge: 'bg-emerald-100 text-emerald-700',
        btn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
        dot: 'bg-emerald-400',
        label: 'text-emerald-600',
        row: 'hover:bg-emerald-50/60',
        addRow: 'border-emerald-500 text-emerald-600 hover:bg-emerald-600 hover:text-white',
    },
    {
        bg: 'bg-sky-50',
        border: 'border-sky-200',
        header: 'bg-gradient-to-r from-sky-500 to-cyan-400',
        badge: 'bg-sky-100 text-sky-700',
        btn: 'bg-sky-500 hover:bg-sky-400 text-white',
        dot: 'bg-sky-400',
        label: 'text-sky-600',
        row: 'hover:bg-sky-50/60',
        addRow: 'border-sky-500 text-sky-600 hover:bg-sky-500 hover:text-white',
    },
]

function palette(idx) {
    return SECTION_PALETTES[idx % SECTION_PALETTES.length]
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

function SectionCard({ section, index, localState, errors, loading, getFieldOptions, handleChange, handleBlur, getTable }) {
    const p = palette(index)
    const isTable = section.Type === 'Model'
    const table = isTable ? getTable(section.Id) : null
    const rows = isTable ? (localState[`Table::${section.Id}`] || []) : []
    const columns = section.Fields || []

    return (
        <div className={`rounded-2xl border ${p.border} overflow-hidden shadow-sm`}>
            {/* Colored header strip */}
            <div className={`${p.header} px-6 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                        {index + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-white">
                        {section.Name || `Section ${index + 1}`}
                    </h3>
                </div>
                {isTable && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white`}>
                        {rows.length} row{rows.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Body */}
            <div className={`${p.bg} px-6 py-6`}>
                {!isTable && (
                    <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                        {columns.map((field) => (
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

                {isTable && (
                    <div>
                        <div className="flex justify-end mb-3">
                            <button
                                type="button"
                                onClick={() => table.addRow({})}
                                disabled={loading}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors disabled:opacity-40 ${p.addRow}`}
                            >
                                + Add Row
                            </button>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-white/60 bg-white/70">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className={`${p.header}`}>
                                        {columns.map((col) => (
                                            <th key={col.Id} className="px-4 py-2.5 text-left text-[11px] font-semibold text-white/90 uppercase tracking-wider whitespace-nowrap min-w-[140px]">
                                                {col.Name}
                                            </th>
                                        ))}
                                        <th className="w-10" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length + 1} className="py-10 text-center text-slate-400 text-sm">
                                                No rows yet
                                            </td>
                                        </tr>
                                    ) : rows.map((row, rowIdx) => (
                                        <tr key={row._id} className={`border-b border-slate-100 last:border-0 ${rowIdx % 2 === 1 ? p.bg : 'bg-white'} ${p.row} transition-colors`}>
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
                                            <td className="px-2 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => table.deleteRow(row._id)}
                                                    disabled={loading}
                                                    className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export function FormColorful({
    flowType = 'dataform',
    flowId,
    formInstanceId,
    title = 'Form',
}) {
    const { formData, config, errors, updateField, save, reset, loading, error, isDirty, getFieldOptions, getTable } =
        useForm(flowType, flowId, formInstanceId)
    const [localState, setLocalState] = useState(formData)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => { setLocalState(formData) }, [formData])

    const sections = Array.isArray(config.sections)
        ? config.sections.filter((s) => !s.isHidden)
        : []

    const handleChange = (fieldId, v) => setLocalState((p) => ({ ...p, [fieldId]: v }))
    const handleBlur = async (fieldId, v) => { try { await updateField(fieldId, v) } catch { /* noop */ } }

    const handleSave = async () => {
        setSaving(true)
        setSaved(false)
        try {
            const ok = await save()
            if (ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
        } finally { setSaving(false) }
    }

    return (
        <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #fdf2f8 50%, #f0fdf4 100%)' }}>

            {/* ── Hero header ───────────────────────────────────────────── */}
            <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)' }}>
                {/* Decorative blobs */}
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/10 blur-2xl" />

                <div className="relative max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-white/60 uppercase tracking-widest mb-1">{flowType}</p>
                        <h1 className="text-2xl font-bold text-white">{title}</h1>
                        {error && <p className="mt-1 text-sm text-rose-200">{error}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                        {saved && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 bg-white/20 px-3 py-1.5 rounded-full">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                Saved
                            </span>
                        )}
                        {isDirty && !saved && (
                            <span className="text-[11px] text-white/60 font-medium">Unsaved changes</span>
                        )}
                        <button
                            type="button"
                            onClick={reset}
                            disabled={!isDirty}
                            className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-white/80 bg-white/15 hover:bg-white/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving || !isDirty}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold bg-white text-indigo-600 hover:bg-white/90 disabled:bg-white/30 disabled:text-white/50 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/10"
                        >
                            {saving && (
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {saving ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </div>

                {/* Section pill nav */}
                {!loading && sections.length > 1 && (
                    <div className="relative max-w-4xl mx-auto px-6 pb-5 flex gap-2 flex-wrap">
                        {sections.map((s, i) => {
                            const p = palette(i)
                            return (
                                <a
                                    key={s.Id}
                                    href={`#section-${s.Id}`}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white hover:bg-white/30 transition-colors`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                                    {s.Name || `Section ${i + 1}`}
                                </a>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* ── Sections ──────────────────────────────────────────────── */}
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <svg className="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    </div>
                ) : sections.map((section, idx) => (
                    <div key={section.Id} id={`section-${section.Id}`}>
                        <SectionCard
                            section={section}
                            index={idx}
                            localState={localState}
                            errors={errors}
                            loading={loading}
                            getFieldOptions={getFieldOptions}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            getTable={getTable}
                        />
                    </div>
                ))}

                {/* Bottom save */}
                {!loading && sections.length > 0 && (
                    <div className="flex justify-end pt-2 pb-8">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving || !isDirty}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed transition-all"
                            style={{ background: isDirty ? 'linear-gradient(135deg, #6366f1, #a855f7)' : undefined }}
                            data-disabled={!isDirty || undefined}
                        >
                            {saving && (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {saving ? 'Saving…' : isDirty ? 'Save changes' : 'No changes'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
