import { useState, useEffect, useCallback } from 'react'
import { kf } from '../sdk/wrapper.jsx'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table.jsx'
import { Skeleton } from './ui/skeleton.jsx'
import { Badge } from './ui/badge.jsx'

// ─── Palette — one hue per column header ────────────────────────────────────
const HEADER_COLORS = [
    'bg-violet-500', 'bg-blue-500', 'bg-cyan-500', 'bg-emerald-500',
    'bg-amber-500', 'bg-rose-500', 'bg-pink-500', 'bg-indigo-500',
]

// ─── Image thumbnail — shared by ImageCell and AttachmentCell ────────────────
function ImageThumb({ imageValue, className = 'h-10 w-10' }) {
    const [src, setSrc] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(function loadImage() {
        let cancelled = false
        kf.client
            .getImageUrl(imageValue)
            .then((dataUrl) => { if (!cancelled) setSrc(dataUrl) })
            .catch(() => {})
            .finally(() => { if (!cancelled) setLoading(false) })
        return () => { cancelled = true }
    }, [imageValue])

    if (loading) return <Skeleton className={`${className} rounded-lg`} />
    if (!src) return null
    return (
        <img
            src={src}
            alt=""
            className={`${className} rounded-lg object-cover ring-2 ring-white shadow-sm`}
        />
    )
}

// ─── Image cell (single image field) ─────────────────────────────────────────
function ImageCell({ imageValue }) {
    if (!imageValue?.key) {
        return <span className="text-xs text-muted-foreground/50">No image has been added</span>
    }
    return <ImageThumb imageValue={imageValue} className="h-10 w-10" />
}

// ─── File icon with tooltip ───────────────────────────────────────────────────
function FileIcon({ name }) {
    const [hover, setHover] = useState(false)
    return (
        <div
            className="relative"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="h-10 w-10 rounded-lg border border-border/60 bg-muted/50
                            flex items-center justify-center cursor-default">
                <svg className="h-5 w-5 text-muted-foreground" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            {hover && name && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10
                                whitespace-nowrap rounded-md bg-foreground px-2 py-1
                                text-xs text-background shadow-lg pointer-events-none">
                    {name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2
                                    border-4 border-transparent border-t-foreground" />
                </div>
            )}
        </div>
    )
}

// ─── Attachment cell (array of files) ────────────────────────────────────────
function AttachmentCell({ files }) {
    if (!files || files.length === 0) {
        return <span className="text-xs text-muted-foreground/50">No attachments</span>
    }

    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {files.map((file, i) =>
                Array.isArray(file.photos) && file.key
                    ? <ImageThumb key={i} imageValue={file} className="h-10 w-10" />
                    : <FileIcon key={i} name={file.name} />
            )}
        </div>
    )
}

// ─── Geo cell ────────────────────────────────────────────────────────────────
function GeoCell({ value }) {
    const lat = value?.Latitude
    const lng = value?.Longitude
    const hasCoords = lat != null && lng != null

    if (!hasCoords) {
        return (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/50">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                No location
            </span>
        )
    }

    return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-200
                         bg-blue-50 px-2 py-0.5 text-xs text-blue-700 font-mono">
            <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {Number(lat).toFixed(4)}, {Number(lng).toFixed(4)}
        </span>
    )
}

// ─── Cell value renderer ──────────────────────────────────────────────────────
function CellValue({ value }) {
    if (value === null || value === undefined || value === '') {
        return <span className="text-muted-foreground/40 text-xs">—</span>
    }

    // Image — object with key + photos array (or null placeholder)
    if (
        (typeof value === 'object' && !Array.isArray(value) && value?.key && Array.isArray(value?.photos)) ||
        (typeof value === 'object' && !Array.isArray(value) && value?._type === 'image')
    ) {
        return <ImageCell imageValue={value} />
    }

    // Geo — object with Longitude/Latitude keys
    if (typeof value === 'object' && !Array.isArray(value) && 'Longitude' in value && 'Latitude' in value) {
        return <GeoCell value={value} />
    }

    // Attachment — array of file objects (each has key + name)
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0].key) {
        return <AttachmentCell files={value} />
    }

    // Single attachment (non-photo file object)
    if (typeof value === 'object' && !Array.isArray(value) && value.key && value.name) {
        return <AttachmentCell files={[value]} />
    }

    // Boolean
    if (typeof value === 'boolean') {
        return (
            <Badge variant="outline" className={value
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-slate-50 text-slate-400'}>
                {value ? 'Yes' : 'No'}
            </Badge>
        )
    }

    // Generic array (multi-select, tags, etc.)
    if (Array.isArray(value)) {
        return (
            <div className="flex flex-wrap gap-1">
                {value.map((v, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                        {typeof v === 'object' ? (v.Name ?? v._id) : String(v)}
                    </Badge>
                ))}
            </div>
        )
    }

    // Lookup / user object
    if (typeof value === 'object') {
        return <span className="text-sm">{value.Name ?? value._id ?? '—'}</span>
    }

    // ISO date
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return (
            <span className="text-sm tabular-nums text-muted-foreground">
                {new Date(value).toLocaleDateString(undefined, {
                    day: 'numeric', month: 'short', year: 'numeric',
                })}
            </span>
        )
    }

    return <span className="text-sm text-foreground">{String(value)}</span>
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────
function SkeletonRows({ cols, rows = 5 }) {
    return Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i} className="border-border/50">
            {Array.from({ length: cols }).map((__, j) => (
                <TableCell key={j} className="min-w-36">
                    <Skeleton className="h-4 rounded-full"
                        style={{ width: `${55 + ((i * 3 + j * 7) % 35)}%` }} />
                </TableCell>
            ))}
        </TableRow>
    ))
}

// ─── Main component ───────────────────────────────────────────────────────────
export function DataformTable({ dataformId }) {
    const [fields, setFields] = useState([])
    const [items, setItems] = useState([])
    const [status, setStatus] = useState('loading')
    const [error, setError] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const fetchData = useCallback(function fetchData() {
        if (!dataformId || !kf) return
        setStatus('loading')
        setError(null)

        const dataform = kf.app.getDataform(dataformId)
        dataform
            .getFields({})
            .then((fetchedFields) => {
                setFields(fetchedFields)
                return dataform.getItems({ payload: { Columns: fetchedFields } })
            })
            .then((fetchedItems) => {
                setItems(fetchedItems.Data)
                setStatus('success')
            })
            .catch((e) => {
                setError(e?.message ?? 'Failed to load data')
                setStatus('error')
            })
            .finally(() => setRefreshing(false))
    }, [dataformId])

    useEffect(fetchData, [fetchData])

    const handleRefresh = () => {
        setRefreshing(true)
        fetchData()
    }

    const handleRowClick = async (item) => {
        try {
            const dataform = kf.app.getDataform(dataformId)
            await dataform.openForm({ _id: item._id })
        } catch (e) {
            console.error('openForm error:', e)
        }
    }

    return (
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4
                            bg-gradient-to-r from-violet-500/10 via-blue-500/5 to-transparent
                            border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500
                                    flex items-center justify-center shadow-sm">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M3 10h18M3 14h18M10 6h4M10 18h4" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">{dataformId}</p>
                        {status === 'success' && (
                            <p className="text-xs text-muted-foreground">
                                {items.length} {items.length === 1 ? 'record' : 'records'}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Status indicator */}
                    {status === 'loading' && (
                        <div className="flex items-center gap-1.5 text-xs text-violet-500 font-medium">
                            <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                            Loading
                        </div>
                    )}
                    {status === 'success' && !refreshing && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Live
                        </div>
                    )}

                    {/* Refresh button */}
                    <button
                        onClick={handleRefresh}
                        disabled={status === 'loading'}
                        className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background
                                   px-3 py-1.5 text-xs font-medium text-foreground shadow-sm
                                   hover:bg-muted/60 disabled:opacity-40 disabled:cursor-not-allowed
                                   transition-colors"
                    >
                        <svg
                            className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* ── Error ── */}
            {status === 'error' && (
                <div className="flex items-center gap-3 px-5 py-6 text-sm text-rose-600 bg-rose-50/50">
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M12 9v3m0 3h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    {error}
                </div>
            )}

            {/* ── Table ── */}
            {status !== 'error' && (
                <Table>
                    <TableHeader>
                        <TableRow className="border-border/50 hover:bg-transparent">
                            {status === 'loading'
                                ? Array.from({ length: 4 }).map((_, i) => (
                                      <TableHead key={i} className="min-w-36">
                                          <Skeleton className="h-3.5 w-20 rounded-full" />
                                      </TableHead>
                                  ))
                                : fields.map((field, i) => (
                                      <TableHead key={field.Id} className="min-w-36 py-3">
                                          <span className="inline-flex items-center gap-1.5">
                                              <span className={`h-2 w-2 rounded-full shrink-0
                                                  ${HEADER_COLORS[i % HEADER_COLORS.length]}`} />
                                              <span className="text-xs font-semibold uppercase
                                                               tracking-wide text-muted-foreground">
                                                  {field.Name}
                                              </span>
                                          </span>
                                      </TableHead>
                                  ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {status === 'loading' ? (
                            <SkeletonRows cols={4} rows={6} />
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={fields.length} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <svg className="h-8 w-8 opacity-30" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
                                        </svg>
                                        <span className="text-sm">No records found</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item, rowIdx) => (
                                <TableRow
                                    key={item._id}
                                    onClick={() => handleRowClick(item)}
                                    className="cursor-pointer border-border/40 transition-all duration-150
                                               hover:bg-gradient-to-r hover:from-violet-50/60 hover:to-blue-50/30"
                                    style={{ animationDelay: `${rowIdx * 30}ms` }}
                                >
                                    {fields.map((field, colIdx) => (
                                        <TableCell
                                            key={field.Id}
                                            className={`min-w-36 ${colIdx === 0 ? 'font-medium' : ''}`}
                                        >
                                            <CellValue value={item[field.Id]} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            )}

            {/* ── Footer ── */}
            {status === 'success' && items.length > 0 && (
                <div className="px-5 py-2.5 border-t border-border/40 bg-muted/20
                                flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Click any row to open the form</p>
                    <div className="flex gap-1">
                        {HEADER_COLORS.slice(0, Math.min(fields.length, 5)).map((c, i) => (
                            <span key={i} className={`h-1.5 w-5 rounded-full ${c} opacity-60`} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
