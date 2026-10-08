import {BrowserRouter as Router , Routes, Route, Navigate} from 'react-router-dom'
import Users from './user/Users'
import UserPlaces from './places/UserPlaces'
import NewPlace from './places/NewPlace'

function App(){
  return(
    <Router>
      <main>
          <Routes>
            <Route path='' element={<Users/>}/>
            <Route path='/:userId/places' element={<UserPlaces/>}/>
            <Route path='/places/new' element={<NewPlace/>}/>
            <Route path='*' element={<Navigate to="/"/>} />
          </Routes>
      </main>
    </Router>
  )
}