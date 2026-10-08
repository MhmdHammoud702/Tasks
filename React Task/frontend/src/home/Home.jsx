import { useEffect, useState } from 'react'
import AP_Loader from '../shared/components/AP_Loader'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 5000)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div>
      {isLoading ? <AP_Loader /> : <h1>Home</h1>}
    </div>
  )
}

export default Home