import { useEffect, useState } from 'react'
import { useForm } from '../hooks/useForm'

/**
 * Dynamic Form Component
 *
 * This component generates a form dynamically based on the formData returned by useForm.
 * All fields are rendered as text inputs for now. Different field types can be added later.
 *
 * Props:
 * - flowType: string - Type of flow ("dataform", "board", "process")
 * - flowId: string - ID of the flow/dataform
 * - formInstanceId: string - Optional instance ID (creates new record if not provided)
 * - title: string - Optional form title
 *
 * Usage:
 * <DynamicForm
 *   flowType="dataform"
 *   flowId="Test_All_Fields_A00"
 *   formInstanceId="PkCT9cShTOek"
 *   title="Employee Form"
 * />
 */
export function DynamicForm({ flowType = 'dataform', flowId="Test_All_Fields_A00", formInstanceId="PkCT9cShTOek", title = 'Dynamic Form' }) {
    const [submitSuccess, setSubmitSuccess] = useState(false)
    
    // Initialize form hook
    const {
        formData,
        errors,
        updateField,
        save,
        reset,
        loading,
        error,
        isDirty,
        isNewRecord
    } = useForm(flowType, flowId, formInstanceId)
    
    const [localState, setLocalState] = useState(formData)

    useEffect(() => {
        setLocalState(formData)
    }, [formData])
    // Handle input change
    const handleFieldChange = async (fieldId, value) => {
        try {
            await updateField(fieldId, value)
            setSubmitSuccess(false)
        } catch (err) {
            console.error('Field update failed:', err)
        }
    }

      const handleLocalFieldChange = async (fieldId, value) => {
        try {
            setLocalState((prev)=> ({...prev, [fieldId]: value}))
            // setSubmitSuccess(false)
        } catch (err) {
            console.error('Field update failed:', err)
        }
    }
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSubmitSuccess(false)
            const success = await save()

            if (success) {
                setSubmitSuccess(true)
                // Show success notification
                if (window.kf?.client?.showInfo) {
                    window.kf.client.showInfo('Form saved successfully!')
                }
            }
        } catch (err) {
            console.error('Save failed:', err)
        }
    }

    // Handle form reset
    const handleReset = () => {
        reset()
        setSubmitSuccess(false)
    }

    // Convert field ID to readable label (e.g., "firstName" -> "First Name")
    const getFieldLabel = (fieldId) => {
        return fieldId
            .replace(/([A-Z])/g, ' $1') // Insert space before uppercase letters
            .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
            .trim()
    }

    // Get all field IDs from formData
    const fieldIds = Object.keys(formData)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className=" mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {title}
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>

                {/* General error message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-800">{error}</span>
                    </div>
                )}

                {/* Success message */}
                {submitSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-800 font-medium">Form saved successfully!</span>
                    </div>
                )}

                {/* New record indicator */}
                {isNewRecord && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-blue-800">Creating new record...</span>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        {/* Form Fields */}
                        <div className="p-8">
                            {fieldIds.length > 0 ? (
                                <div className="grid grid-cols-3 gap-6">
                                    {fieldIds.map((fieldId) => (
                                        <div key={fieldId} className="space-y-2">
                                            <label
                                                htmlFor={fieldId}
                                                className="block text-sm font-semibold text-gray-700"
                                            >
                                                {getFieldLabel(fieldId)}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id={fieldId}
                                                    type="text"
                                                    name={fieldId}
                                                    value={localState[fieldId] || ''}
                                                    onChange={(e) =>
                                                        handleLocalFieldChange(fieldId, e.target.value)
                                                    }
                                                    onBlur={(e) =>
                                                        handleFieldChange(fieldId, e.target.value)
                                                    }
                                                    
                                                    placeholder={`Enter ${getFieldLabel(fieldId).toLowerCase()}`}
                                                    className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                        errors[fieldId]
                                                            ? 'border-red-300 bg-red-50'
                                                            : 'border-gray-300 bg-white hover:border-gray-400'
                                                    }`}
                                                />
                                            </div>
                                            {errors[fieldId] && (
                                                <p className="text-sm text-red-600 font-medium flex items-center gap-1.5">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.707 13.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8.5-8.5z" clipRule="evenodd" />
                                                    </svg>
                                                    {Array.isArray(errors[fieldId])
                                                        ? errors[fieldId][0]
                                                        : errors[fieldId]}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    {loading ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <p className="text-gray-600">Loading form fields...</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No fields available</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        {fieldIds.length > 0 && <div className="border-t border-gray-200"></div>}

                        {/* Form Actions & Status */}
                        {fieldIds.length > 0 && (
                            <>
                                {/* Action Buttons */}
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
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M19.414 1.586a2 2 0 00-2.828 0L7 11.172V15h3.828l9.586-9.586a2 2 0 000-2.828z" />
                                                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
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
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 1119.414 9.414 1 1 0 11-1.414-1.414A5 5 0 004.059 4.059V3a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Reset
                                    </button>
                                </div>

                                {/* Form Status */}
                                <div className="px-8 py-4 bg-white border-t border-gray-200">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Status</p>
                                            <p className={`text-sm font-semibold mt-1 ${isDirty ? 'text-amber-600' : 'text-green-600'}`}>
                                                {isDirty ? 'Unsaved' : 'Saved'}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Errors</p>
                                            <p className={`text-sm font-semibold mt-1 ${Object.keys(errors).length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {Object.keys(errors).length}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Fields</p>
                                            <p className="text-sm font-semibold mt-1 text-blue-600">{fieldIds.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </div>

                {/* Debug Info (remove in production) */}
                {fieldIds.length > 0 && (
                    <div className="mt-8 space-y-4">
                        <details className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-700 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z" />
                                </svg>
                                Form Data (Debug)
                            </summary>
                            <pre className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-xs overflow-x-auto text-gray-800">{JSON.stringify(formData, null, 2)}</pre>
                        </details>

                        <details className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-700 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Validation Errors (Debug)
                            </summary>
                            <pre className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-xs overflow-x-auto text-gray-800">{JSON.stringify(errors, null, 2)}</pre>
                        </details>
                    </div>
                )}
            </div>
        </div>
    )
}
