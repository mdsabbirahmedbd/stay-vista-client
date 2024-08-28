
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';

const Dashboard = () => {
  return (
    <div className='md:flex min-h-screen gap-80 '> 
        <div>
            <Sidebar></Sidebar> 
        </div>
        <div className='flex-1 '>
          <Outlet></Outlet>
        </div>
      
    </div>
  )
}

export default Dashboard
