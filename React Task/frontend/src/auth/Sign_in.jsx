import { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AP_Alert from '../shared/components/AP_Alert'
import { AP_Button } from '../shared/components/AP_Button'
import AP_Form from '../shared/components/AP_Form'
import { AP_input } from '../shared/components/AP_Input'
import { AuthContext } from '../shared/context/auth-context'
import { useForm } from '../shared/hooks/form-hook'
import { VALIDATOR_EMAIL, VALIDATOR_REQUIRE } from '../shared/utils/validators'

const Sign_in = () => {
  const [formState, inputHandler, inputBlurHandler] = useForm({
    email: { value: '', isValid: false },
    password: { value: '', isValid: false }
  })
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const authSubmitHandler = (event) => {
    event.preventDefault()

    if (!formState.isValid) return

    setShowSuccessAlert(true)
  }

  const confirmLoginHandler = () => {
    login()
    navigate('/', { replace: true })
  }

  return (
    <>
      <AP_Form onSubmit={authSubmitHandler} title="Sign In">
        <AP_input
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          hint="Enter the email address."
          errorText="Enter a valid email address."
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
          onInput={inputHandler}
          onBlur={inputBlurHandler}
          value={formState.inputs.email.value}
          isValid={formState.inputs.email.isValid}
          isTouched={formState.inputs.email.isTouched}
          required
          autoComplete="email"
        />
        <AP_input
          id="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          hint="Enter your account password."
          errorText="Password is required."
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
          onBlur={inputBlurHandler}
          value={formState.inputs.password.value}
          isValid={formState.inputs.password.isValid}
          isTouched={formState.inputs.password.isTouched}
          required
          autoComplete="current-password"
        />
        <AP_Button text="Sign In" disabled={!formState.isValid} />
        <p className="ap__form__switch">
          Don&apos;t have an account? <Link to="/sign-up">Sign up</Link>
        </p>
      </AP_Form>
      <AP_Alert
        open={showSuccessAlert}
        message="You successfully signed in."
        onConfirm={confirmLoginHandler}
      />
    </>
  )
}

export default Sign_in
