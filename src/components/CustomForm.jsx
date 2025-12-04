import { useState } from 'react'
import { useForm } from '../hooks/useForm'

/**
 * Example: Custom Form Component using useForm hook
 *
 * This component demonstrates how to build a custom form using the Kissflow SDK.
 * The form automatically manages validation, error handling, and persistence through
 * the underlying form store.
 *
 * Usage:
 * 1. Create a form/dataform in Kissflow (e.g., "EmpMaster")
 * 2. Create a custom component that renders this component
 * 3. Pass formInstanceId as a component parameter
 *
 * Features:
 * - Auto-validation through form store
 * - Real-time error tracking
 * - Automatic persistence (auto-save)
 * - Dirty state tracking
 * - Easy field updates and form reset
 */
export function CustomForm() {
    const [submitSuccess, setSubmitSuccess] = useState(false)

    // Initialize form hook
    // In a real scenario, formInstanceId would come from component props or SDK context
    const formInstanceId = "PkCT9cShTOek"

    const {
        formData,
        errors,
        updateField,
        save,
        reset,
        loading,
        error,
        isDirty
    } = useForm("dataform", "Test_All_Fields_A00", formInstanceId)

    // Handle input change
    const handleFieldChange = async (fieldId, value) => {
        try {
            await updateField(fieldId, value)
            setSubmitSuccess(false)
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
                // Optional: Reset form after successful save
                // reset();
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

    // if (loading) {
    //     return <div className={styles.loading}>Loading form...</div>
    // }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Custom Form
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

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        {/* Form Fields */}
                        <div className="p-8 space-y-6">
                            {/* First Name Field */}
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                                    First Name *
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ''}
                                    onChange={(e) =>
                                        handleFieldChange('firstName', e.target.value)
                                    }
                                    placeholder="Enter first name"
                                    className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.firstName
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300 bg-white hover:border-gray-400'
                                    }`}
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-red-600 font-medium flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.707 13.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8.5-8.5z" clipRule="evenodd" />
                                        </svg>
                                        {Array.isArray(errors.firstName)
                                            ? errors.firstName[0]
                                            : errors.firstName}
                                    </p>
                                )}
                            </div>

                            {/* Last Name Field */}
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                                    Last Name *
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName || ''}
                                    onChange={(e) =>
                                        handleFieldChange('lastName', e.target.value)
                                    }
                                    placeholder="Enter last name"
                                    className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.lastName
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300 bg-white hover:border-gray-400'
                                    }`}
                                />
                                {errors.lastName && (
                                    <p className="text-sm text-red-600 font-medium flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.707 13.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8.5-8.5z" clipRule="evenodd" />
                                        </svg>
                                        {Array.isArray(errors.lastName)
                                            ? errors.lastName[0]
                                            : errors.lastName}
                                    </p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                    Email *
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={(e) =>
                                        handleFieldChange('email', e.target.value)
                                    }
                                    placeholder="Enter email address"
                                    className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.email
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300 bg-white hover:border-gray-400'
                                    }`}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600 font-medium flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.707 13.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8.5-8.5z" clipRule="evenodd" />
                                        </svg>
                                        {Array.isArray(errors.email)
                                            ? errors.email[0]
                                            : errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Age Field */}
                            <div className="space-y-2">
                                <label htmlFor="age" className="block text-sm font-semibold text-gray-700">
                                    Age
                                </label>
                                <input
                                    id="age"
                                    type="number"
                                    name="age"
                                    value={formData.age || ''}
                                    onChange={(e) =>
                                        handleFieldChange('age', e.target.value)
                                    }
                                    placeholder="Enter age"
                                    className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.age
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300 bg-white hover:border-gray-400'
                                    }`}
                                />
                                {errors.age && (
                                    <p className="text-sm text-red-600 font-medium flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.707 13.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8.5-8.5z" clipRule="evenodd" />
                                        </svg>
                                        {Array.isArray(errors.age)
                                            ? errors.age[0]
                                            : errors.age}
                                    </p>
                                )}
                            </div>

                            {/* Notes Field */}
                            <div className="space-y-2">
                                <label htmlFor="notes" className="block text-sm font-semibold text-gray-700">
                                    Notes
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes || ''}
                                    onChange={(e) =>
                                        handleFieldChange('notes', e.target.value)
                                    }
                                    placeholder="Enter additional notes"
                                    rows="4"
                                    className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.notes
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300 bg-white hover:border-gray-400'
                                    }`}
                                />
                                {errors.notes && (
                                    <p className="text-sm text-red-600 font-medium flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.707 13.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8.5-8.5z" clipRule="evenodd" />
                                        </svg>
                                        {Array.isArray(errors.notes)
                                            ? errors.notes[0]
                                            : errors.notes}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200"></div>

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
                                    <p className="text-sm font-semibold mt-1 text-blue-600">5</p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Debug Info (remove in production) */}
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
            </div>
        </div>
    )
}
