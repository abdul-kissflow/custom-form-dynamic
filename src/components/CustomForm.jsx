import { useState } from 'react'
import { useForm } from '../hooks/useForm'
import styles from './CustomForm.module.css'

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
        isDirty,
        getFormData
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
        <div className={styles.container}>
            <h2>Custom Form</h2>

            {/* General error message */}
            {error && <div className={styles.errorBanner}>{error}</div>}

            {/* Success message */}
            {submitSuccess && (
                <div className={styles.successBanner}>
                    Form saved successfully!
                </div>
            )}
            <button onClick={() => {
                const data = getFormData()
                console.log("Current Form Data:", data)
            }}>Get Form Data</button>
            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Example: Text Field */}
                <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name *</label>
                    <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName || ''}
                        onChange={(e) =>
                            handleFieldChange('firstName', e.target.value)
                        }
                        className={errors.firstName ? styles.fieldError : ''}
                        placeholder="Enter first name"
                    />
                    {errors.firstName && (
                        <span className={styles.error}>
                            {Array.isArray(errors.firstName)
                                ? errors.firstName[0]
                                : errors.firstName}
                        </span>
                    )}
                </div>

                {/* Example: Text Field */}
                <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={(e) =>
                            handleFieldChange('lastName', e.target.value)
                        }
                        className={errors.lastName ? styles.fieldError : ''}
                        placeholder="Enter last name"
                    />
                    {errors.lastName && (
                        <span className={styles.error}>
                            {Array.isArray(errors.lastName)
                                ? errors.lastName[0]
                                : errors.lastName}
                        </span>
                    )}
                </div>

                {/* Example: Email Field */}
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email *</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={(e) =>
                            handleFieldChange('email', e.target.value)
                        }
                        className={errors.email ? styles.fieldError : ''}
                        placeholder="Enter email address"
                    />
                    {errors.email && (
                        <span className={styles.error}>
                            {Array.isArray(errors.email)
                                ? errors.email[0]
                                : errors.email}
                        </span>
                    )}
                </div>

                {/* Example: Number Field */}
                <div className={styles.formGroup}>
                    <label htmlFor="age">Age</label>
                    <input
                        id="age"
                        type="number"
                        name="age"
                        value={formData.age || ''}
                        onChange={(e) =>
                            handleFieldChange('age', e.target.value)
                        }
                        className={errors.age ? styles.fieldError : ''}
                        placeholder="Enter age"
                    />
                    {errors.age && (
                        <span className={styles.error}>
                            {Array.isArray(errors.age)
                                ? errors.age[0]
                                : errors.age}
                        </span>
                    )}
                </div>

                {/* Example: Text Area */}
                <div className={styles.formGroup}>
                    <label htmlFor="notes">Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes || ''}
                        onChange={(e) =>
                            handleFieldChange('notes', e.target.value)
                        }
                        className={errors.notes ? styles.fieldError : ''}
                        placeholder="Enter additional notes"
                        rows="4"
                    />
                    {errors.notes && (
                        <span className={styles.error}>
                            {Array.isArray(errors.notes)
                                ? errors.notes[0]
                                : errors.notes}
                        </span>
                    )}
                </div>

                {/* Form Actions */}
                <div className={styles.actions}>
                    <button
                        type="submit"
                        disabled={loading || !isDirty}
                        className={styles.buttonPrimary}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading || !isDirty}
                        className={styles.buttonSecondary}
                    >
                        Reset
                    </button>
                </div>

                {/* Form Status */}
                <div className={styles.formStatus}>
                    <p>
                        Status:{' '}
                        <strong>
                            {isDirty ? 'Unsaved changes' : 'All changes saved'}
                        </strong>
                    </p>
                    <p>
                        Validation Errors:{' '}
                        <strong>{Object.keys(errors).length}</strong>
                    </p>
                </div>
            </form>

            {/* Debug Info (remove in production) */}
            <details className={styles.debugInfo}>
                <summary>Form Data (Debug)</summary>
                <pre>{JSON.stringify(formData, null, 2)}</pre>
            </details>

            <details className={styles.debugInfo}>
                <summary>Validation Errors (Debug)</summary>
                <pre>{JSON.stringify(errors, null, 2)}</pre>
            </details>
        </div>
    )
}
