import { useState } from 'react'
import './AP_Input.css'
import AP_Eye from './AP_Eye'
import { validate } from '../utils/validators'

export const AP_input = ({
  id,
  type,
  placeholder,
  label,
  hint,
  errorText = 'Please enter a valid value.',
  validators = [],
  onInput,
  onBlur,
  value = '',
  isValid = true,
  isTouched = false,
  required = false,
  autoComplete
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  const changeHandler = (event) => {
    const nextValue = event.target.value
    onInput?.(id, nextValue, validate(nextValue, validators))
  }

  const element = (
    <div className={`ap__input${isTouched && !isValid ? ' ap__input--invalid' : ''}`}>
      <input
        id={id}
        name={id}
        type={isPassword && showPassword ? 'text' : type}
        placeholder={placeholder}
        onChange={changeHandler}
        onBlur={() => onBlur?.(id)}
        value={value}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={isTouched && !isValid}
      />
      {isPassword && (
        <AP_Eye
          showPassword={showPassword}
          togglePassword={() => setShowPassword((visible) => !visible)}
        />
      )}
    </div>
  )


  return (
    <div className="ap__input-field">
      <label htmlFor={id}>{label}</label>
      {element}
      {hint && <small className="ap__input-hint">{hint}</small>}
      {isTouched && !isValid && (
        <small className="ap__input-error" role="alert">{errorText}</small>
      )}
    </div>
  )
}
