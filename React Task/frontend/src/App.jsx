import { useCallback, useMemo, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthContext } from './shared/context/auth-context.jsx'
import Home from './home/Home.jsx'
import Sign_in from './auth/Sign_in.jsx'
import Sign_up from './auth/Sign_up.jsx'
import MainNavigation from './shared/components/Navigation/MainNavigation.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const login = useCallback(() => setIsLoggedIn(true), [])
  const logout = useCallback(() => setIsLoggedIn(false), [])
  const authValue = useMemo(
    () => ({ isLoggedIn, login, logout }),
    [isLoggedIn, login, logout]
  )
  let routes

  if (isLoggedIn) {
    routes = (
      <>
      <MainNavigation/>
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
      </>
    )
  } else {
    routes = (
      <Routes>
        <Route path="/sign-in" element={<Sign_in />} />
        <Route path="/sign-up" element={<Sign_up />} />
        <Route path="*" element={<Sign_in />} />
      </Routes>
    )
  }
  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <main>
            {routes}
        </main>
      </Router>
    </AuthContext.Provider>
  )
}

export default App