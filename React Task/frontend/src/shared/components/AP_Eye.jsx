import './AP_Eye.css'
import { Eye, EyeOff } from "lucide-react";

const AP_Eye = ({ showPassword, togglePassword }) => {
  return (
    <button
      className="ap__eye"
      type="button"
      onClick={togglePassword}
    >
      {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
    </button>
  )
}

export default AP_Eye