import { useCallback, useReducer } from 'react'

// 1. Prepare the starting state: copy each field and mark it untouched.
const createFormState = (inputs, isValid = false) => ({
  inputs: Object.fromEntries(
    Object.entries(inputs).map(([id, input]) => [
      id,
      { ...input, isTouched: false }
    ])
  ),
  isValid
})

// 2. Describe how each action changes the form state.
export const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE': {
      const currentInput = state.inputs[action.inputId]

      if (!currentInput) {
        throw new Error(`Cannot update unknown form input "${action.inputId}".`)
      }

      const inputs = {
        ...state.inputs,
        [action.inputId]: {
          ...currentInput,
          value: action.value,
          isValid: action.isValid,
          isTouched: true
        }
      }

      return {
        inputs,
        isValid: Object.values(inputs).every((input) => input.isValid)
      }
    }
    case 'INPUT_BLUR': {
      const currentInput = state.inputs[action.inputId]

      if (!currentInput) {
        throw new Error(`Cannot mark unknown form input "${action.inputId}" as touched.`)
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { ...currentInput, isTouched: true }
        },
      }
    }
    case 'RESET':
      return createFormState(action.inputs, action.isValid)
    default:
      return state
  }
}

// 3. Give a form screen its state and the functions used to update it.
export const useForm = (initialInputs, initialFormValidity = false) => {
  const [formState, dispatch] = useReducer(
    formReducer,
    { inputs: initialInputs, isValid: initialFormValidity },
    (initialState) => createFormState(initialState.inputs, initialState.isValid)
  )

  // Called when a field's value changes.
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({ type: 'INPUT_CHANGE', inputId: id, value, isValid })
  }, [])

  // Called when the user leaves a field.
  const inputBlurHandler = useCallback((id) => {
    dispatch({ type: 'INPUT_BLUR', inputId: id })
  }, [])

  // Called when the form should return to its starting values.
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET', inputs: initialInputs, isValid: initialFormValidity })
  }, [initialInputs, initialFormValidity])

  // These positions determine the order of the values returned to the screen.
  return [formState, inputHandler, inputBlurHandler, resetForm]
}
