import { Link } from 'react-router'

/**
 * Registry / Map pattern.
 * This component attempts to be a single point of entry for all Button objects in this app
 * This way, we can create a single source of truth for all buttons to ensure consistency
 * @param {*} param0
 * @param to optional link to page
 * @param type default | primary | secondary | neutral
 * @returns
 */
const Button = ({ to = undefined, type = 'default ', children, ...props }) => {
  let Variant = buttons[type] || buttons['default']
  return to ? (
    <Link to={to}>
      <Variant type={type} {...props}>
        {children}
      </Variant>
    </Link>
  ) : (
    <Variant type={type} {...props}>
      {children}
    </Variant>
  )
}

export default Button

const DefaultButton = ({ onclick, className = '', children }) => {
  const handleOnClick = (e) => {
    onclick?.(e)
  }
  return (
    <button onClick={handleOnClick} className={className + `btn`}>
      {children}
    </button>
  )
}
const PrimaryButton = ({ onclick, className = '', children }) => {
  const handleOnClick = (e) => {
    onclick?.(e)
  }
  return (
    <button onClick={handleOnClick} className={className + `btn btn-primary`}>
      {children}
    </button>
  )
}
const SecondaryButton = ({ onclick, className = '', children }) => {
  const handleOnClick = (e) => {
    onclick?.(e)
  }
  return (
    <button onClick={handleOnClick} className={className + `btn btn-secondary`}>
      {children}
    </button>
  )
}
const NeutralButton = ({ onclick, className = '', children }) => {
  const handleOnClick = (e) => {
    onclick?.(e)
  }
  return (
    <button onClick={handleOnClick} className={className + `btn btn-neutral`}>
      {children}
    </button>
  )
}

const DangerButton = ({ onclick, className = '', children }) => {
  const handleOnClick = (e) => {
    onclick?.(e)
  }
  return (
    <button onClick={handleOnClick} className={className + `btn btn-error`}>
      {children}
    </button>
  )
}

const buttons = {
  default: DefaultButton,
  primary: PrimaryButton,
  secondary: SecondaryButton,
  neutral: NeutralButton,
  danger: DangerButton,
}
