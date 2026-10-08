import Card from '../../shared/components/Card'
import UserItem from './UserItem'

const UsersList = ({items}) => {
  if(items.length === 0){
    return (
        <div className=''>
            <Card>
                <h2>No Users Found</h2>
            </Card>
        </div>
    )
  }
  return (
    <ul>
        {items.map((user)=>(
            <UserItem id={user.id} image={user.image} name={user.name} placeCount={user.placeCount}/>
        ))}
    </ul>
  )
}

export default UsersList