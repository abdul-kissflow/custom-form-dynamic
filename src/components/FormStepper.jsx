import { useEffect, useState } from 'react'
import { useForm } from '../hooks/useForm'
import { getFieldComponent } from './fields'
import * as Fields from './fields'
import { TableFieldCell } from './tablefields/index.js'

/* ─────────────────────────────────────────────────────────────────────────────
   STEPPER LAYOUT  —  Centered wizard card, one section at a time
   Palette: deep violet-purple gradient bg  ·  white card  ·  rose finish step
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

export function FormStepper({
    flowType = 'dataform',
    flowId,
    formInstanceId,
    title = 'Form',
}) {
    const { formData, config, errors, updateField, save, reset, loading, error, isDirty, getTable, getFieldOptions } =
        useForm(flowType, flowId, formInstanceId)
    const [localState, setLocalState] = useState(formData)
    const [step, setStep] = useState(0)
    const [saving, setSaving] = useState(false)
    const [done, setDone] = useState(false)
    const [direction, setDirection] = useState(1)

    useEffect(() => { setLocalState(formData) }, [formData])

    const sections = Array.isArray(config.sections)
        ? config.sections.filter((s) => !s.isHidden)
        : []

    const isLast = step === sections.length - 1
    const current = sections[step]
    const progress = sections.length > 1 ? (step / (sections.length - 1)) * 100 : 100

    const handleChange = (fieldId, v) => setLocalState((p) => ({ ...p, [fieldId]: v }))
    const handleBlur = async (fieldId, v) => { try { await updateField(fieldId, v) } catch { /* noop */ } }

    const goNext = async () => {
        if (isLast) {
            setSaving(true)
            try {
                const ok = await save()
                if (ok) setDone(true)
            } finally { setSaving(false) }
        } else {
            setDirection(1)
            setStep((s) => s + 1)
        }
    }

    const goBack = () => {
        setDirection(-1)
        setStep((s) => s - 1)
    }

    if (done) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 font-sans p-6">
                <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-sm w-full text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">All done!</h2>
                    <p className="text-slate-500 text-sm mb-8">Your form has been saved successfully.</p>
                    <button
                        type="button"
                        onClick={() => { setDone(false); setStep(0); reset() }}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700 transition-colors"
                    >
                        Start over
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 font-sans px-4 py-12">

            {/* Title */}
            <div className="w-full max-w-xl mb-8 text-center">
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
            </div>

            {/* Progress bar */}
            {sections.length > 1 && (
                <div className="w-full max-w-xl mb-8">
                    <div className="flex items-center gap-0">
                        {sections.map((s, i) => (
                            <div key={s.Id} className="flex-1 flex items-center">
                                <button
                                    type="button"
                                    onClick={() => i < step && setStep(i)}
                                    disabled={i > step}
                                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                                        i < step
                                            ? 'bg-white text-violet-700 cursor-pointer hover:scale-110'
                                            : i === step
                                            ? 'bg-violet-400 text-white ring-4 ring-violet-400/30 scale-110'
                                            : 'bg-white/10 text-white/40 cursor-default'
                                    }`}
                                >
                                    {i < step ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : i + 1}
                                </button>
                                {i < sections.length - 1 && (
                                    <div className="flex-1 h-0.5 mx-1 rounded-full overflow-hidden bg-white/10">
                                        <div
                                            className="h-full bg-white/60 transition-all duration-500"
                                            style={{ width: i < step ? '100%' : '0%' }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 flex justify-between px-1">
                        <span className="text-[11px] text-white/50 font-medium">
                            Step {step + 1} of {sections.length}
                        </span>
                        <span className="text-[11px] text-white/50 font-medium">
                            {Math.round(progress)}% complete
                        </span>
                    </div>
                </div>
            )}

            {/* Card */}
            {loading ? (
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-16 flex justify-center">
                    <svg className="w-7 h-7 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                </div>
            ) : current && (
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
                    {/* Card header */}
                    <div className="px-8 pt-8 pb-6">
                        <div className="flex items-center gap-2 mb-1">
                            {current.Type === 'Model' && (
                                <span className="text-[10px] font-semibold text-violet-500 uppercase tracking-widest">Table</span>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {current.Name || `Step ${step + 1}`}
                        </h2>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Fields */}
                    <div className="px-8 py-6">
                        {current.Type === 'Section' && (
                            <div className="space-y-5">
                                {(current.Fields || []).map((field) => (
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

                        {current.Type === 'Model' && (
                            <StepperTable
                                section={current}
                                localState={localState}
                                loading={loading}
                                getTable={getTable}
                                getFieldOptions={getFieldOptions}
                            />
                        )}
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Navigation */}
                    <div className="px-8 py-5 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={goBack}
                            disabled={step === 0}
                            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 disabled:opacity-0 disabled:pointer-events-none transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>

                        <button
                            type="button"
                            onClick={goNext}
                            disabled={saving}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                isLast
                                    ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/25'
                                    : 'bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/25'
                            } disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                            {saving ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Saving…
                                </>
                            ) : isLast ? (
                                <>
                                    Submit
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </>
                            ) : (
                                <>
                                    Continue
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

function StepperTable({ section, localState, loading, getTable, getFieldOptions }) {
    const table = getTable(section.Id)
    const columns = section.Fields || []
    const rows = localState[`Table::${section.Id}`] || []
    return (
        <div>
            <div className="flex justify-end mb-3">
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
                                <th key={col.Id} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap min-w-[140px]">{col.Name}</th>
                            ))}
                            <th className="w-10" />
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0
                            ? <tr><td colSpan={columns.length + 1} className="py-8 text-center text-slate-400 text-sm">No rows yet</td></tr>
                            : rows.map((row) => (
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
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
