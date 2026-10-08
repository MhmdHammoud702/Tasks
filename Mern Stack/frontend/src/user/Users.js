import { useState } from "react"
import UsersList from "./components/UsersList"

const Users = () => {
  const [users,setUsers] = useState([])
  return (
    <UsersList items={users}/>
  )
}

export default Users