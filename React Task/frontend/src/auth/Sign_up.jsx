import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AP_Alert from '../shared/components/AP_Alert'
import { AP_Button } from '../shared/components/AP_Button'
import AP_Form from '../shared/components/AP_Form'
import { AP_input } from '../shared/components/AP_Input'
import { AuthContext } from '../shared/context/auth-context'
import { useForm } from '../shared/hooks/form-hook'
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../shared/utils/validators'

const Sign_up = () => {
  const [formState, inputHandler, inputBlurHandler] = useForm({
    firstName: { value: '', isValid: false },
    lastName: { value: '', isValid: false },
    email: { value: '', isValid: false },
    phoneNumber: { value: '', isValid: false },
    password: { value: '', isValid: false },
    confirmPassword: { value: '', isValid: false }
  })
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const inputChangeHandler = (id, value, isValid) => {
    inputHandler(id, value, isValid)

    if (id === 'password' && formState.inputs.confirmPassword.value) {
      inputHandler(
        'confirmPassword',
        formState.inputs.confirmPassword.value,
        formState.inputs.confirmPassword.value === value
      )
    }
  }

  const signUpSubmitHandler = (event) => {
    event.preventDefault()

    if (!formState.isValid) return

    setShowSuccessAlert(true)
  }

  const confirmSignUpHandler = () => {
    login()
    navigate('/', { replace: true })
  }

  const passwordMatches = (value) =>
    value.length > 0 && value === formState.inputs.password.value

  return (
    <>
      <AP_Form onSubmit={signUpSubmitHandler} title="Create Account">
        <AP_input
          id="firstName"
          type="text"
          label="First name"
          placeholder="Enter your first name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="First name is required."
          onInput={inputChangeHandler}
          onBlur={inputBlurHandler}
          value={formState.inputs.firstName.value}
          isValid={formState.inputs.firstName.isValid}
          isTouched={formState.inputs.firstName.isTouched}
          required
          autoComplete="given-name"
        />
        <AP_input
          id="lastName"
          type="text"
          label="Last name"
          placeholder="Enter your last name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Last name is required."
          onInput={inputChangeHandler}
          onBlur={inputBlurHandler}
          value={formState.inputs.lastName.value}
          isValid={formState.inputs.lastName.isValid}
          isTouched={formState.inputs.lastName.isTouched}
          required
          autoComplete="family-name"
        />
        <AP_input
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
          errorText="Enter a valid email address."
          onInput={inputChangeHandler}
          onBlur={inputBlurHandler}
          value={formState.inputs.email.value}
          isValid={formState.inputs.email.isValid}
          isTouched={formState.inputs.email.isTouched}
          required
          autoComplete="email"
        />
        <AP_input
          id="phoneNumber"
          type="tel"
          label="Phone"
          placeholder="Enter your phone number"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Phone number is required."
          onInput={inputChangeHandler}
          onBlur={inputBlurHandler}
          value={formState.inputs.phoneNumber.value}
          isValid={formState.inputs.phoneNumber.isValid}
          isTouched={formState.inputs.phoneNumber.isTouched}
          required
          autoComplete="tel"
        />
        <AP_input
          id="password"
          type="password"
          label="Password"
          placeholder="Create a password"
          hint="Use at least 8 characters."
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
          errorText="Password must be at least 8 characters."
          onInput={inputChangeHandler}
          onBlur={inputBlurHandler}
          value={formState.inputs.password.value}
          isValid={formState.inputs.password.isValid}
          isTouched={formState.inputs.password.isTouched}
          required
          autoComplete="new-password"
        />
        <AP_input
          id="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="Enter your password again"
          validators={[passwordMatches]}
          errorText="Passwords must match."
          onInput={inputChangeHandler}
          onBlur={inputBlurHandler}
          value={formState.inputs.confirmPassword.value}
          isValid={formState.inputs.confirmPassword.isValid}
          isTouched={formState.inputs.confirmPassword.isTouched}
          required
          autoComplete="new-password"
        />
        <AP_Button text="Create account" disabled={!formState.isValid} />
        <p className="ap__form__switch">
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </p>
      </AP_Form>
      <AP_Alert
        open={showSuccessAlert}
        message="You successfully registered."
        onConfirm={confirmSignUpHandler}
      />
    </>
  )
}

export default Sign_up
