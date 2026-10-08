# Form hook: a friendly guide

This guide explains the form hook used by Sign In and Sign Up. It uses simple words
and follows what happens when you type in a field.

The hook is in `form-hook.js`. It uses React's built-in `useReducer`. **This is not
Redux.**

## The short version

Think of a form as a small notebook:

- The notebook contains each field's current text.
- It also records whether each field is valid and whether the user has touched it.
- When something changes, we send React a small instruction called an **action**.
- A **reducer** reads that instruction and returns an updated notebook.

The flow is:

```text
You type in the email box
  -> AP_input reads the new text
  -> validators check the text
  -> AP_input calls inputHandler(id, value, isValid)
  -> inputHandler sends an action with dispatch
  -> formReducer makes updated form state
  -> React shows the updated screen
```

## First, what does the form state look like?

When Sign In starts, it gives the hook two empty fields:

```js
{
  email: { value: '', isValid: false },
  password: { value: '', isValid: false }
}
```

The hook turns those into a full form state like this:

```js
{
  inputs: {
    email: {
      value: '',
      isValid: false,
      isTouched: false
    },
    password: {
      value: '',
      isValid: false,
      isTouched: false
    }
  },
  isValid: false
}
```

Here is what those names mean:

- `inputs`: all the fields in this form.
- `email` and `password`: field names. They match the `id` given to each input.
- `value`: the text currently in that field.
- `isValid`: whether that field passed its checks.
- `isTouched`: whether you typed in the field or left it.
- The outer `isValid`: whether every field passed its checks.

There are two `isValid` values here on purpose. A field has its own validity, and
the form also has an overall validity.

## What is `useReducer`?

`useReducer` is a React tool for keeping state and updating it in a clear way. It
takes two important things:

1. A **reducer function**: the instructions for how state changes.
2. An **initial state**: the state to start with.

React gives back two things:

1. `formState`: the current state (our form notebook).
2. `dispatch`: a way to ask the reducer to update that state.

In this hook, the call looks like this:

```js
const [formState, dispatch] = useReducer(
  formReducer,
  { inputs: initialInputs, isValid: initialFormValidity },
  (initialState) => createFormState(initialState.inputs, initialState.isValid)
)
```

Read it from top to bottom:

- `formReducer`: the function React will use when we send an action.
- `{ inputs: initialInputs, isValid: initialFormValidity }`: the starting form
  information.
- The third function prepares that starting information by adding `isTouched: false`
  to each field.
- React returns a pair: current state and the dispatch function.
- `[formState, dispatch]` is called **array destructuring**. It gives each returned
  item a useful name. The first item is named `formState`; the second is named
  `dispatch`.

You can picture it like asking React to do this:

```text
React, remember this starting form.
When I send you an instruction, use formReducer to update it.
Give me the current form and a way to send instructions.
```

### Why not change `formState` directly?

React needs to know when data changes so it can draw the screen again. We do not
edit `formState` ourselves. Instead, we send an action with `dispatch`. React runs
the reducer, stores what it returns, and renders again.

## What is an action?

An action is a small message saying what happened. For example:

```js
{
  type: 'INPUT_CHANGE',
  inputId: 'email',
  value: 'person@example.com',
  isValid: true
}
```

- `type` says what happened: the user changed an input.
- `inputId` says which input changed.
- `value` is the new text.
- `isValid` is the result of checking that text.

The action does not update the form by itself. It is a message that `formReducer`
reads.

## Reading the hook one piece at a time

Open `form-hook.js` while reading this section.

### 1. Import React's tools

```js
import { useCallback, useReducer } from 'react'
```

- `useReducer` remembers the form state and lets us update it using actions.
- `useCallback` remembers the handler functions so they do not get recreated on
  every screen update. You can think of this as keeping the same function ready
  to reuse.

### 2. Prepare the starting fields

```js
const createFormState = (inputs, isValid = false) => ({
  inputs: Object.fromEntries(
    Object.entries(inputs).map(([id, input]) => [
      id,
      { ...input, isTouched: false }
    ])
  ),
  isValid
})
```

This is a helper function. A helper is just a named piece of code that does a
small job we want to reuse.

- `inputs` comes from the screen. For Sign In, it contains `email` and `password`.
- `isValid = false` means: if nobody gives this function an `isValid` value, use
  `false`.
- `Object.entries(inputs)` turns the fields into a list of pairs. For example:
  `[['email', { value: '', isValid: false }]]`.
- `.map(...)` goes through each pair.
- `[id, input]` gives the two parts of one pair their names:
  - `id` is the field name, such as `'email'`.
  - `input` is that field's information, such as `{ value: '', isValid: false }`.
- `{ ...input, isTouched: false }` copies the field information and adds
  `isTouched: false`. The three dots mean “copy the properties from this object.”
- `[id, copiedInput]` makes a new pair with the same id and the prepared field.
- `Object.fromEntries(...)` turns the list of pairs back into an object.
- The returned `inputs` are the prepared fields.
- The returned `isValid` is the starting overall form validity.

Why add `isTouched`? So the page knows whether to show an error yet. A blank field
can be invalid when the page first opens, but showing an error before the person
has tried to fill it in can feel unfriendly.

### 3. Make the reducer

```js
export const formReducer = (state, action) => {
  switch (action.type) {
    // ...
  }
}
```

- `formReducer` is the function React uses to update the form.
- `state` comes from React. It is the form as it is right now.
- `action` comes from the code that called `dispatch`. It describes what happened.
- `switch (action.type)` checks the action's `type` and picks the matching rule.
- The reducer must **return** the new state. React then saves it and updates the
  page.

The words `state` and `action` are names chosen by us. They are not special
JavaScript words. We could call them `currentForm` and `message`, but `state` and
`action` are common names that make reducer code easier to recognize.

### 4. When an input changes

The reducer's `INPUT_CHANGE` part does this:

```js
const currentInput = state.inputs[action.inputId]
```

- `state.inputs` is the list of fields React currently remembers.
- `action.inputId` is the id from the action, such as `'email'`.
- This line finds the old email field so we can replace it.
- `currentInput` is just a variable name for the field we found.

```js
if (!currentInput) {
  throw new Error(`Cannot update unknown form input "${action.inputId}".`)
}
```

If the action says `inputId: 'emali'` by mistake, there is no field with that name.
This error helps us find the typo instead of pretending the update worked.

```js
const inputs = {
  ...state.inputs,
  [action.inputId]: {
    ...currentInput,
    value: action.value,
    isValid: action.isValid,
    isTouched: true
  }
}
```

- `...state.inputs` copies all the fields so the old state is not edited.
- `[action.inputId]` means “use the value inside `action.inputId` as the field
  name.” If the id is `'email'`, this updates `inputs.email`.
- `...currentInput` keeps the field's other information.
- `value: action.value` saves the new text.
- `isValid: action.isValid` saves the result of checking that text.
- `isTouched: true` records that the person has interacted with this field.
- The finished object is named `inputs`. It contains all fields, with only the
  changed one replaced.

```js
return {
  inputs,
  isValid: Object.values(inputs).every((input) => input.isValid)
}
```

- `return` gives the next state back to React.
- `inputs` is the updated group of fields.
- `Object.values(inputs)` makes a list of the field information.
- `.every(...)` checks every field.
- The overall `isValid` becomes `true` only if every field is valid.

This is why the reducer recalculates overall validity after every field change.

### 5. When you leave a field

The input calls `inputBlurHandler` when it loses focus. That sends an
`INPUT_BLUR` action. The reducer copies the current state and marks that one field
as `isTouched: true`.

It does **not** change the field's text or validation result. It only tells the
page “the user has visited this field.” The input uses that information to decide
when to show its error message.

### 6. Resetting a form

The `RESET` action calls `createFormState` again. That clears the fields back to
their starting values and makes every field untouched.

The hook creates a `resetForm` function for sending this action. A screen can use
it after a successful submission if it wants to clear the form.

### 7. The default action

```js
default:
  return state
```

If the reducer receives an action type it does not know, it keeps the current
state. There is nothing to update for an unknown instruction.

### 8. Make the `useForm` hook

```js
export const useForm = (initialInputs, initialFormValidity = false) => {
```

- `useForm` is our own reusable React hook.
- `initialInputs` is sent in by the screen that uses the hook.
- `initialFormValidity` is optional. If the screen does not send it, it starts
  as `false`.
- `export` lets other files import and use this hook.

The `useReducer(...)` call shown earlier is inside this hook. It gives the hook
`formState` and `dispatch`.

### 9. Make a handler for changed input

```js
const inputHandler = useCallback((id, value, isValid) => {
  dispatch({ type: 'INPUT_CHANGE', inputId: id, value, isValid })
}, [])
```

- `inputHandler` is the function passed down to the input component.
- `id`, `value`, and `isValid` come from `AP_input` after it checks the new text.
- `dispatch(...)` sends the instruction to React.
- The action's `type` tells the reducer to use its `INPUT_CHANGE` rule.
- `inputId`, `value`, and `isValid` tell the reducer what changed.
- `[]` is the dependency list for `useCallback`. It is empty because this function
  only uses `dispatch`, which React keeps stable.

### 10. Make a handler for leaving input

```js
const inputBlurHandler = useCallback((id) => {
  dispatch({ type: 'INPUT_BLUR', inputId: id })
}, [])
```

- `id` comes from the input that was left.
- This sends the reducer an `INPUT_BLUR` message for that field.
- The reducer marks that field as touched.

### 11. Make a reset function

```js
const resetForm = useCallback(() => {
  dispatch({ type: 'RESET', inputs: initialInputs, isValid: initialFormValidity })
}, [initialInputs, initialFormValidity])
```

- This function asks the reducer to start the form over.
- The action carries the original fields and starting validity.
- `[initialInputs, initialFormValidity]` tells React what outside values the
  function uses. If either changes, React creates an up-to-date function.
- Screens that do not need reset can simply ignore this returned function.

### 12. Return the hook's four results

```js
return [formState, inputHandler, inputBlurHandler, resetForm]
```

This sends four things back to the screen:

1. `formState`: read field values and whether the form is valid.
2. `inputHandler`: call this when text changes.
3. `inputBlurHandler`: call this when a field is left.
4. `resetForm`: call this to clear the form.

The caller chooses names when it receives those results. For example:

```js
const [formState, inputHandler, inputBlurHandler] = useForm(fields)
```

This means:

- “Take result 1 and name it `formState`.”
- “Take result 2 and name it `inputHandler`.”
- “Take result 3 and name it `inputBlurHandler`.”
- “I do not need result 4 here.”

The names on the left are chosen by the screen; the order must match the hook's
return order.

## How `AP_input` talks to the hook

The screen passes these important props to `AP_input`:

```jsx
<AP_input
  id="email"
  value={formState.inputs.email.value}
  isValid={formState.inputs.email.isValid}
  isTouched={formState.inputs.email.isTouched}
  validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
  onInput={inputHandler}
  onBlur={inputBlurHandler}
/>
```

What each one means:

- `id="email"`: the field's name. It must also be a key in the initial fields.
- `value={...}`: give the input its current text from React's form state.
- `isValid={...}`: give it the latest validation result from form state.
- `isTouched={...}`: tell it whether the user has interacted with it.
- `validators={[...]}`: give it the checks to run when the text changes.
- `onInput={inputHandler}`: give it the function that reports a changed value.
- `onBlur={inputBlurHandler}`: give it the function that reports when the user
  leaves the field.

Inside `AP_input`, the browser calls `changeHandler` when someone types:

```js
const nextValue = event.target.value
onInput?.(id, nextValue, validate(nextValue, validators))
```

- `event` is supplied by the browser through React's `onChange`.
- `event.target` is the actual HTML input element.
- `.value` is the text inside that element.
- `nextValue` is a variable we chose to mean “the text after this change.”
- `validate(...)` runs this field's validators and returns `true` or `false`.
- `onInput?.(...)` calls the prop if it was provided. The `?.` means “only call
  this if it is not missing.”
- The values passed are `id`, `nextValue`, and the validation result. Those become
  the `id`, `value`, and `isValid` arguments of `inputHandler`.

Then `inputHandler` sends them with `dispatch`; React runs the reducer and updates
the page. This is how the values travel through the code.

## Why are `value` and `onChange` both needed?

```jsx
<input value={value} onChange={changeHandler} />
```

- `value` lets React tell the input what text to show.
- `onChange` lets React hear when the user types.

Together, React is in charge of the input's value. This is called a **controlled
input**. The value goes into the input from React, and every new keystroke goes
back into React through the change handler.

## Why are there both `isValid` and `isTouched`?

Imagine the email box starts empty:

- It is not a valid email yet, so `isValid` is `false`.
- The user has not used the box, so `isTouched` is also `false`.
- The page can wait before showing the error.

After the user types an invalid email and leaves:

- `isValid` stays `false`.
- `isTouched` becomes `true`.
- The page shows the error because `isTouched && !isValid` is true.

That is why touching and validity are different pieces of information.

## Why can the submit button be disabled?

The screen reads:

```jsx
<AP_Button disabled={!formState.isValid} text="Create account" />
```

- `formState.isValid` is the overall validity returned by the reducer.
- `!` means “not.”
- When the form is invalid, `!formState.isValid` is `true`, so the button is disabled.
- When every field is valid, the button is enabled.

The submit handler also checks validity. This is an extra safety check in case
submission is triggered another way.

## How password confirmation works

The Signup screen has a `passwordMatches` function. It checks that the confirmation
is not empty and equals the password.

The password and confirmation fields depend on each other. If the person already
typed a confirmation and then changes the password, Signup checks the confirmation
again. Otherwise, the old confirmation could incorrectly remain valid.

`inputHandler` sends updates to React; it does not instantly change the
`formState` variable in the middle of the same function. React applies the updates
and then renders again. The Signup screen uses the current render's values to
calculate the new confirmation result.

## How to use the hook in another form

### Step 1: List the fields

The field names below must match the `id` values used by the inputs:

```js
const [formState, inputHandler, inputBlurHandler] = useForm({
  email: { value: '', isValid: false },
  password: { value: '', isValid: false }
})
```

Here, `email` and `password` are not special React names. They are keys we chose
for this form.

### Step 2: Connect an input

```jsx
<AP_input
  id="email"
  value={formState.inputs.email.value}
  isValid={formState.inputs.email.isValid}
  isTouched={formState.inputs.email.isTouched}
  validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
  onInput={inputHandler}
  onBlur={inputBlurHandler}
/>
```

### Step 3: Handle submit

```js
const submitHandler = (event) => {
  event.preventDefault()

  if (!formState.isValid) return

  // Continue with this screen's submit behavior.
}
```

- `event` is supplied when the form is submitted.
- `preventDefault()` stops the browser from refreshing the page.
- The `if` line stops invalid form data from continuing.
- The code after the guard is where the screen would submit to its service.

## What this hook does not do

The form hook only remembers values and validation state. It does not:

- register or sign in a real user;
- contact a server;
- decide what success message to show;
- navigate to another page.

Those jobs belong to the screen or another part of the app. Client-side checks
help users fill in a form, but a real server must check submitted information too.

## Is this a good way to build forms?

### Rating for this app: 4 out of 5 stars

**★★★★☆**

This is a good fit here because Sign In and Sign Up both have several fields and
need the same kind of validation state. The shared hook means they can use the
same rules for remembering values, touched fields, and overall validity.

It is not automatically the best choice for every form. A tiny form with one
simple field may be easier to write with `useState`. Choose this hook when the
shared structure makes your forms easier to understand, not just because reducers
sound advanced.

## Small practice exercise

1. Find the `email` initial field in `Sign_in.jsx`.
2. Find the email `AP_input` and check that its `id` is also `"email"`.
3. Type in the email field and watch `changeHandler` call `inputHandler`.
4. Follow `inputHandler` to the `dispatch` call in `form-hook.js`.
5. Follow the `INPUT_CHANGE` case and see where it saves the value.
6. Find `formState.inputs.email.value` in `Sign_in.jsx`: that is the same value
   coming back out of the reducer and being shown in the input.

The important idea is: **the screen gives the hook the starting fields; the input
sends changes; the reducer returns the new form; the screen reads that new form.**
