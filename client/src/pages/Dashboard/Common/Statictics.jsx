
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import AdminStatistics from '../Admin/AdminStatistics';
import GuestStatistics from '../Guest/GuestStatistics';
import HostStatistics from '../Host/HostStatistics';
import useRole from './../../../hooks/useRole';
const Statictics = () => {
  const [role,isLoading]= useRole()
  if(isLoading) return <LoadingSpinner />
  return (
    <div>
       {role === 'admin' &&  <AdminStatistics></AdminStatistics>}
       {role === 'host' &&  <HostStatistics></HostStatistics>}
       {role === 'guest' &&  <GuestStatistics></GuestStatistics>}
    </div>
  )
}

export default Statictics
