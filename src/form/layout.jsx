import { FormField, SectionTable } from './shared.jsx'
import { CheckIcon, MoonIcon, PlusIcon, SpinnerIcon, SunIcon } from './icons.jsx'
import { useTheme } from '../hooks/useTheme.js'

/* ─────────────────────────────────────────────────────────────────────────────
   FORM LAYOUT  —  Neutral card, sticky action bar, one section per block
───────────────────────────────────────────────────────────────────────────── */

export function FormLayout({
    title,
    sections,
    formData,
    config,
    localState,
    errors,
    loading,
    error,
    isDirty,
    isNewRecord,
    isFormReadOnly,
    submitSuccess,
    onFieldChange,
    onFieldBlur,
    onSave,
    onReset,
    getFieldOptions,
    parseAttachment,
    getTable,
}) {
    const { isDark, toggleTheme } = useTheme()
    const rootErrors = Object.keys(errors?.['_root'] || {})
    const tableErrorCount = Object.entries(errors || {})
        .filter(([k]) => k !== '_root')
        .reduce(
            (n, [, rows]) =>
                n +
                Object.values(rows).reduce(
                    (m, fields) => m + Object.keys(fields || {}).length,
                    0
                ),
            0
        )
    const totalErrorCount = rootErrors.length + tableErrorCount
    const hasErrors = totalErrorCount > 0

    return (
        <div className="min-h-screen bg-[--color-background] font-sans">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    onSave()
                }}
                noValidate
            >
                {/* ── Sticky top bar ───────────────────────────────────── */}
                <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-[--color-border]">
                    <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <h1 className="text-base font-semibold text-[--color-foreground] truncate">
                                {title}
                            </h1>
                            {isDirty && (
                                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-medium border border-warning/40">
                                    <span className="w-1.5 h-1.5 rounded-full bg-warning inline-block" />
                                    Unsaved
                                </span>
                            )}
                            {submitSuccess && (
                                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium border border-success/40">
                                    <CheckIcon className="w-3 h-3" />
                                    Saved
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={toggleTheme}
                                aria-label={
                                    isDark
                                        ? 'Switch to light mode'
                                        : 'Switch to dark mode'
                                }
                                title={
                                    isDark
                                        ? 'Switch to light mode'
                                        : 'Switch to dark mode'
                                }
                                className="p-2 text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                            >
                                {isDark ? (
                                    <SunIcon className="w-4 h-4" />
                                ) : (
                                    <MoonIcon className="w-4 h-4" />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onReset}
                                disabled={loading || !isDirty || isFormReadOnly}
                                className="px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !isDirty || isFormReadOnly}
                                className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                                    loading || !isDirty || isFormReadOnly
                                        ? 'bg-muted text-muted-foreground shadow-none cursor-not-allowed'
                                        : 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <SpinnerIcon className="w-3.5 h-3.5" />
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
                    {error && (
                        <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/40 text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    {isFormReadOnly && !loading && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted border border-border text-muted-foreground text-sm">
                            This form is read-only — you don&apos;t have edit
                            access.
                        </div>
                    )}

                    {isNewRecord && loading && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-info/10 border border-info/40 text-info text-sm">
                            <SpinnerIcon className="w-4 h-4 text-info" />
                            Creating new record…
                        </div>
                    )}

                    {isNewRecord && !loading && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-info/10 border border-info/40 text-info text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-info shrink-0 inline-block" />
                            New record — fill in the fields and save
                        </div>
                    )}

                    {/* ── Form card ──────────────────────────────────────── */}
                    <div className="bg-background rounded-xl border border-[--color-border] shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex flex-col items-center gap-3 py-20">
                                <SpinnerIcon className="w-7 h-7 text-[--color-primary]" />
                                <p className="text-sm text-muted-foreground">
                                    Loading form…
                                </p>
                            </div>
                        ) : sections.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-20 text-muted-foreground">
                                <p className="text-sm">No fields available</p>
                            </div>
                        ) : (
                            <div>
                                {sections.map((section, sectionIdx) => {
                                    if (section.Type === 'Section') {
                                        return (
                                            <div
                                                key={section.Id}
                                                className={`px-8 py-6 ${sectionIdx > 0 ? 'border-t border-[--color-border]' : ''}`}
                                            >
                                                {section.Name && (
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <span className="w-0.5 h-4 rounded-full bg-[--color-primary] shrink-0" />
                                                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                                                            {section.Name}
                                                        </h2>
                                                    </div>
                                                )}
                                                <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                                    {(section.Fields || [])
                                                        .filter(
                                                            (field) =>
                                                                !field.IsHidden
                                                        )
                                                        .map((field) => (
                                                            <FormField
                                                                key={field.Id}
                                                                field={field}
                                                                isFormReadOnly={
                                                                    isFormReadOnly
                                                                }
                                                                value={
                                                                    localState[
                                                                        field.Id
                                                                    ]
                                                                }
                                                                onChange={
                                                                    onFieldChange
                                                                }
                                                                onBlur={
                                                                    onFieldBlur
                                                                }
                                                                error={
                                                                    errors[
                                                                        '_root'
                                                                    ]?.[
                                                                        field.Id
                                                                    ]
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                                getFieldOptions={
                                                                    getFieldOptions
                                                                }
                                                                parseAttachment={
                                                                    parseAttachment
                                                                }
                                                            />
                                                        ))}
                                                </div>
                                            </div>
                                        )
                                    }

                                    if (section.Type === 'Model') {
                                        const table = getTable(section.Id)
                                        const columns = (
                                            section.Fields || []
                                        ).filter((col) => !col.IsHidden)
                                        const isTableReadOnly =
                                            isFormReadOnly ||
                                            section.Permission === 'ReadOnly'
                                        const rows =
                                            localState[
                                                `Table::${section.Id}`
                                            ] || []

                                        return (
                                            <div
                                                key={section.Id}
                                                className={`${sectionIdx > 0 ? 'border-t border-[--color-border]' : ''}`}
                                            >
                                                <div className="px-8 py-5 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-0.5 h-4 rounded-full bg-[--color-primary] shrink-0" />
                                                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                                                            {section.Name}
                                                        </h2>
                                                        {rows.length > 0 && (
                                                            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                                                                {rows.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            table.addRow({})
                                                        }
                                                        disabled={
                                                            loading ||
                                                            isTableReadOnly
                                                        }
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                                                    >
                                                        <PlusIcon />
                                                        Add Row
                                                    </button>
                                                </div>

                                                <div className="border-t border-[--color-border]">
                                                    <SectionTable
                                                        section={section}
                                                        columns={columns}
                                                        rows={rows}
                                                        table={table}
                                                        loading={loading}
                                                        isTableReadOnly={
                                                            isTableReadOnly
                                                        }
                                                        getFieldOptions={
                                                            getFieldOptions
                                                        }
                                                        tableErrors={
                                                            errors?.[section.Id]
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }

                                    return null
                                })}

                                {hasErrors && (
                                    <div className="px-8 py-4 border-t border-destructive/30 bg-destructive/10">
                                        <p className="text-xs text-destructive font-medium">
                                            {totalErrorCount} validation
                                            error(s) — review fields above.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Debug panels ───────────────────────────────────── */}
                    {sections.length > 0 && (
                        <div className="space-y-2 pt-4">
                            {[
                                { label: 'Form Data', data: formData },
                                { label: 'Validation Errors', data: errors },
                                { label: 'Form Config', data: config },
                            ].map(({ label, data }) => (
                                <details
                                    key={label}
                                    className="group bg-background rounded-lg border border-[--color-border] overflow-hidden text-xs"
                                >
                                    <summary className="px-5 py-3 cursor-pointer select-none flex items-center justify-between font-medium text-muted-foreground hover:bg-muted">
                                        {label}
                                        <span className="text-muted-foreground transition-transform group-open:rotate-180">
                                            ⌄
                                        </span>
                                    </summary>
                                    <pre className="px-5 py-4 bg-muted border-t border-[--color-border] overflow-x-auto text-foreground leading-relaxed">
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
