import './AP_Alert.css'

const AP_Alert = ({
  open,
  message,
  onConfirm,
  confirmText = 'OK',
  cancelText,
  onCancel
}) => {
  if (!open) return null

  return (
    <div className="ap__alert-backdrop">
      <section className="ap__alert">
        <img className="ap__alert-logo" src="/logo.svg" alt="Apex" />
        <p>{message}</p>
        <div className="ap__alert-actions">
          {cancelText && onCancel && (
            <button className="ap__alert-cancel" type="button" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button className="ap__alert-confirm" type="button" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </section>
    </div>
  )
}

export default AP_Alert
