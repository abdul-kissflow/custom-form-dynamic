import { useState } from 'react'
import { useForm } from '../hooks/useForm'
import styles from './CustomForm.module.css'

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
        isNewRecord,
        getFormData
    } = useForm(flowType, flowId, formInstanceId)

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
        <div className={styles.container}>
            <h2>{title}</h2>

            {/* General error message */}
            {error && <div className={styles.errorBanner}>{error}</div>}

            {/* Success message */}
            {submitSuccess && (
                <div className={styles.successBanner}>
                    Form saved successfully!
                </div>
            )}

            {isNewRecord && (
                <div style={{
                    backgroundColor: '#e7f3ff',
                    border: '1px solid #b3d9ff',
                    color: '#004085',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                }}>
                    Creating new record...
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Dynamically render form fields */}
                {fieldIds.length > 0 ? (
                    fieldIds.map((fieldId) => (
                        <div key={fieldId} className={styles.formGroup}>
                            <label htmlFor={fieldId}>
                                {getFieldLabel(fieldId)}
                            </label>
                            <input
                                id={fieldId}
                                type="text"
                                name={fieldId}
                                value={formData[fieldId] || ''}
                                onChange={(e) =>
                                    handleFieldChange(fieldId, e.target.value)
                                }
                                className={errors[fieldId] ? styles.fieldError : ''}
                                placeholder={`Enter ${getFieldLabel(fieldId).toLowerCase()}`}
                            />
                            {errors[fieldId] && (
                                <span className={styles.error}>
                                    {Array.isArray(errors[fieldId])
                                        ? errors[fieldId][0]
                                        : errors[fieldId]}
                                </span>
                            )}
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#666', textAlign: 'center', padding: '1rem' }}>
                        {loading ? 'Loading form fields...' : 'No fields available'}
                    </p>
                )}

                {/* Form Actions */}
                {fieldIds.length > 0 && (
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
                )}

                {/* Form Status */}
                {fieldIds.length > 0 && (
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
                        <p>
                            Total Fields:{' '}
                            <strong>{fieldIds.length}</strong>
                        </p>
                    </div>
                )}
            </form>

            {/* Debug Info (remove in production) */}
            {fieldIds.length > 0 && (
                <>
                    <details className={styles.debugInfo}>
                        <summary>Form Data (Debug)</summary>
                        <pre>{JSON.stringify(formData, null, 2)}</pre>
                    </details>

                    <details className={styles.debugInfo}>
                        <summary>Validation Errors (Debug)</summary>
                        <pre>{JSON.stringify(errors, null, 2)}</pre>
                    </details>
                </>
            )}
        </div>
    )
}
