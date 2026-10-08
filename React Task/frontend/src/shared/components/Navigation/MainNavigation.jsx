import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/auth-context'
import { AP_Button } from '../AP_Button'
import AP_Alert from '../AP_Alert'
import MainHeader from './MainHeader'

const MainNavigation = () => {
  const { logout } = useContext(AuthContext)
  const [showLogoutAlert, setShowLogoutAlert] = useState(false)
  const navigate = useNavigate()

  const confirmLogoutHandler = () => {
    setShowLogoutAlert(false)
    logout()
    navigate('/sign-in', { replace: true })
  }

  return (
    <>
      <MainHeader>
        <img src="/logo.svg" alt="Apex" />
        <AP_Button type="button" onClick={() => setShowLogoutAlert(true)} text="Logout" />
      </MainHeader>
      <AP_Alert
        open={showLogoutAlert}
        message="Are you sure you want to logout?"
        confirmText="Yes"
        cancelText="No"
        onCancel={() => setShowLogoutAlert(false)}
        onConfirm={confirmLogoutHandler}
      />
    </>
  )
}

export default MainNavigation