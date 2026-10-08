export const AP_Button = ({
  onClick,
  text,
  className,
  disabled = false,
  type = 'submit'
}) => {
  const element = (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  )

  return <>{element}</>
}
