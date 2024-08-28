import { useState } from 'react';
import useAuth from '../../../hooks/useAuth'
import { Helmet } from 'react-helmet-async'
import ResetPassModal from '../../../components/modal/ResetPassModal';
import UpdateModal from '../../../components/modal/UpdateModal';
import useRole from './../../../hooks/useRole';

const Profile = () => {
  const { user } = useAuth();
  const [role] = useRole()


 
  const  roleResult =  role.toString().charAt(0).toUpperCase() + role.toString().slice(1)
  console.log(roleResult)

  const [isOpen,setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
  };

  const  [openUpdate,setOpenUdate] = useState(false);

  const closeUpdate  = ()=>{
    setOpenUdate(false);
  }
  return (
    <div className='flex justify-center items-center h-screen'>
      <Helmet>
        <title>User | Profile</title>
      </Helmet>
      <div className='bg-white shadow-lg rounded-2xl w-3/5'>
        <img
          alt='profile'
          src='https://wallpapercave.com/wp/wp10784415.jpg'
          className='w-full mb-4 rounded-t-lg h-36'
        />
        <div className='flex flex-col items-center justify-center p-4 -mt-16'>
          <a href='#' className='relative block'>
            <img
              alt='profile'
              src={user?.photoURL}
              className='mx-auto object-cover rounded-full h-24 w-24  border-2 border-white '
            />
          </a>

          <p className={`
          ${roleResult == "Guest" && 'bg-pink-500'} 
          ${roleResult == "Admin" && 'bg-green-500'} 
          ${roleResult == "Host" && 'bg-yellow-500'} 
          
          p-2 px-4 font-semibold  rounded-full
            `}>
   {roleResult}
          </p>
          <p className='mt-2 text-xl font-medium text-gray-800 '>
            User Id: {user?.uid}
          </p>
          <div className='w-full p-2 mt-4 rounded-lg'>
            <div className='flex flex-wrap items-center justify-between text-sm text-gray-600 '>
              <p className='flex flex-col'>
                Name
                <span className='font-bold text-black '>
                  {user?.displayName}
                </span>
              </p>
              <p className='flex flex-col'>
                Email
                <span className='font-bold text-black '>{user?.email}</span>
              </p>

              <div>
                <button onClick={()=> setOpenUdate(true)} className='bg-[#F43F5E] px-10 py-1 rounded-lg text-white cursor-pointer hover:bg-[#af4053] block mb-1'>
                  Update Profile
                </button>
                <UpdateModal closeUpdate={closeUpdate} openUpdate={openUpdate}></UpdateModal>

                <button onClick={()=>setOpen(true)} className='bg-[#F43F5E] px-7 py-1 rounded-lg text-white cursor-pointer hover:bg-[#af4053]'>
                  Change Password
                </button>
                {/* Reset password modal is openign */}
                <ResetPassModal email={user?.email} isOpen={isOpen} closeModal={closeModal}></ResetPassModal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile