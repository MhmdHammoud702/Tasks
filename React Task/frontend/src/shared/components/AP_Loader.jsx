import { Loader2Icon } from 'lucide-react'
import './AP_Loader.css'

const AP_Loader = () => {
  return (
    <div className='ap__loader'>
        <div className='ap__loader__spinner'>
            <Loader2Icon className='animate-spin' size={25}/>
        </div>
    </div>
  )
}

export default AP_Loader