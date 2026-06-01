import { useState } from 'react'

import { kf } from './sdk/wrapper.jsx'
import { CardReport } from './components/CardReport.jsx'
import { Button } from './components/ui/button.jsx'

// ─── Test IDs (replace with real values before running) ────────────────────
const DATAFORM_ID = 'Test_All_Fields_A00'
// const DATAFORM_VIEW_ID = 'G_view_A01'
// const DATAFORM_ITEM_ID = 'draft_UsBCTFx_VviN'
const DATAFORM_ITEM_ID = 'PkCjdkVu74nn'

const PROCESS_FLOW_ID = 'Information_Collection_Process_A00'
const PROCESS_INSTANCE_ID = 'PkD4_IIicLoa'
// const PROCESS_ACTIVITY_INSTANCE_ID = 'PkD4_OXfDMFn'
// const PROCESS_STEP_ID = 'Activity_GMocQRQcgl'
// const PROCESS_REASSIGN_USER = { _id: 'user-id', Name: 'Test User' }

const BOARD_FLOW_ID = 'Board_Flow_A00'
// const BOARD_CASE_ID = 'board-case-id'
// const REPORT_ID = 'Table_report_A00'
// const REPORT_ID = 'Chart_report_A00'
const REPORT_ID = 'Card_report_A00'
// const REPORT_ID = 'Pivot_report_A00'

const IMAGE_FIELD_ID = 'image_1'
const IMAGE_ITEM_ID = DATAFORM_ITEM_ID
// ───────────────────────────────────────────────────────────────────────────

async function testDataformActions() {
    console.group('=== Dataform Actions ===')
    try {
        const dataform = kf.app.getDataform(DATAFORM_ID)

        const viewFields = await dataform.getFields({})
        console.log(
            'getFields:',
            viewFields.map((field) => field.Name)
        )

        const items = await dataform.getItems({
            payload: {
                Columns: viewFields.filter((field) => field.Id === 'Text_1'),
            },
        })
        console.log('getItems:', items)
    } catch (e) {
        console.error('Dataform Actions Error:', e)
    }
    console.groupEnd()
}

async function testProcessActions() {
    console.group('=== Process Actions ===')
    try {
        const process = kf.app.getProcess(PROCESS_FLOW_ID)

        const myItems = await process.getMyItems({ status: 'draft' })
        console.log('getMyItems:', myItems)

        const myItemsFields = await process.getMyItemsFields({
            status: 'draft',
        })
        console.log('getMyItemsFields:', myItemsFields)

        const progress = await process.getProgress({
            instanceId: PROCESS_INSTANCE_ID,
        })
        console.log('getProgress:', progress)
    } catch (e) {
        console.error('Process Actions Error:', e)
    }
    console.groupEnd()
}

async function fetchReportData() {
    const dataform = kf.app.getDataform(DATAFORM_ID)
    return dataform.getReport(REPORT_ID).getItems({ page_number: 1, page_size: 10 })
}

async function testBoardActions() {
    console.group('=== Board Actions ===')
    try {
        const _board = kf.app.getBoard(BOARD_FLOW_ID)
        console.log('Board instance created')
    } catch (e) {
        console.error('Board Actions Error:', e)
    }
    console.groupEnd()
}

// function App() {
//     const [status, setStatus] = useState('idle') // idle | loading | success | error
//     const [imgSrc, setImgSrc] = useState(null)
//     const [errorMsg, setErrorMsg] = useState(null)
//     const [fieldValue, setFieldValue] = useState(null)

//     const handleGetImage = async () => {
//         setStatus('loading')
//         setImgSrc(null)
//         setErrorMsg(null)
//         setFieldValue(null)
//         console.group('=== getImageUrl ===')
//         try {
//             const dataform = kf.app.getDataform(DATAFORM_ID)
//             const item = await dataform.getItem({ itemId: IMAGE_ITEM_ID })
//             console.log('item:', item)

//             const imageValue = item[IMAGE_FIELD_ID]
//             console.log('imageValue:', imageValue)
//             setFieldValue(imageValue)

//             if (!imageValue) {
//                 console.warn('No image value found for field:', IMAGE_FIELD_ID)
//                 setErrorMsg(`No image found for field "${IMAGE_FIELD_ID}"`)
//                 setStatus('error')
//                 return
//             }

//             const result = await kf.client.getImageUrl(imageValue)
//             console.log('dataUrl prefix:', result?.slice(0, 60))
//             setImgSrc(result)
//             setStatus('success')
//         } catch (e) {
//             console.error('getImageUrl Error:', e)
//             setErrorMsg(e?.message ?? String(e))
//             setStatus('error')
//         }
//         console.groupEnd()
//     }

//     return (
//         <div className="min-h-screen bg-background flex items-center justify-center p-6">
//             <div className="w-full max-w-md space-y-4">

//                 {/* Header */}
//                 <div className="space-y-1">
//                     <h1 className="text-xl font-semibold text-foreground">SDK Image Test</h1>
//                     <p className="text-sm text-muted-foreground">
//                         Tests <code className="bg-muted px-1 py-0.5 rounded text-xs">kf.client.getImageUrl()</code>
//                     </p>
//                 </div>

//                 {/* Config card */}
//                 <div className="rounded-lg border bg-card p-4 space-y-2 text-sm">
//                     <div className="flex justify-between">
//                         <span className="text-muted-foreground">Dataform</span>
//                         <span className="font-mono text-foreground">{DATAFORM_ID}</span>
//                     </div>
//                     <div className="flex justify-between">
//                         <span className="text-muted-foreground">Item ID</span>
//                         <span className="font-mono text-foreground">{IMAGE_ITEM_ID}</span>
//                     </div>
//                     <div className="flex justify-between">
//                         <span className="text-muted-foreground">Field ID</span>
//                         <span className="font-mono text-foreground">{IMAGE_FIELD_ID}</span>
//                     </div>
//                 </div>

//                 {/* Action button */}
//                 <button
//                     onClick={handleGetImage}
//                     disabled={status === 'loading'}
//                     className="w-full rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium
//                                hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
//                 >
//                     {status === 'loading' ? 'Loading…' : 'Get Image'}
//                 </button>

//                 {/* Image preview */}
//                 {status === 'success' && imgSrc && (
//                     <div className="rounded-lg border bg-card overflow-hidden">
//                         <div className="px-4 pt-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                             Preview
//                         </div>
//                         <img
//                             src={imgSrc}
//                             alt="Field image"
//                             className="w-full object-contain max-h-72"
//                         />
//                         <div className="px-4 py-2 border-t">
//                             <p className="text-xs text-muted-foreground font-mono truncate">
//                                 {imgSrc.slice(0, 60)}…
//                             </p>
//                         </div>
//                     </div>
//                 )}

//                 {/* Error state */}
//                 {status === 'error' && (
//                     <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
//                         {errorMsg ?? 'Something went wrong'}
//                     </div>
//                 )}

//                 {/* Raw field value */}
//                 {fieldValue && (
//                     <details className="rounded-lg border bg-card text-sm">
//                         <summary className="px-4 py-2.5 cursor-pointer text-muted-foreground hover:text-foreground select-none">
//                             Raw field value
//                         </summary>
//                         <pre className="px-4 pb-3 text-xs overflow-x-auto text-foreground">
//                             {JSON.stringify(fieldValue, null, 2)}
//                         </pre>
//                     </details>
//                 )}

//             </div>
//         </div>
//     )
// }

function App() {
    const [reportData, setReportData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function handleLoadReport() {
        setLoading(true)
        setError(null)
        try {
            const data = await fetchReportData()
            setReportData(data)
        } catch (e) {
            setError(e?.message ?? String(e))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="space-y-1">
                    <h1 className="text-xl font-semibold text-foreground">Card Report</h1>
                    <p className="text-sm text-muted-foreground font-mono">{REPORT_ID}</p>
                </div>

                <Button onClick={handleLoadReport} disabled={loading}>
                    {loading ? 'Loading…' : 'Load Report'}
                </Button>

                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}

                {reportData && <CardReport data={reportData} />}
            </div>
        </div>
    )
}

export default App
