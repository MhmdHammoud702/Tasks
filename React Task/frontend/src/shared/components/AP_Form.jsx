import './AP_Form.css'

const AP_Form = ({children,onSubmit,title}) => {
  return (
    <div className='ap__form__parent'>
        <form onSubmit={onSubmit}>
            <div className='ap__form__header'>
                <h3>{title}</h3>
                <img className='ap__form__img' src="/logo.svg" alt="" />
            </div>
            {children}
        </form>
    </div>
  )
}

export default AP_Form