

import { BsFingerprint } from 'react-icons/bs'
import { GrUserAdmin } from 'react-icons/gr'
import MenuItem from './MenuItem'
import useRole from '../../../../hooks/useRole'
import HostModal from '../../../modal/HostRequstModel'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import useAuth from '../../../../hooks/useAuth'
import toast from 'react-hot-toast'


const GuestMenu = () => {
  const {user} = useAuth()
  const [role]= useRole()
  const axiosSecure = useAxiosSecure()





  const [isModalOpen, setIsModalOpen] = useState(false)

  const closeModal = () => {
    setIsModalOpen(false)
  }






  const {mutateAsync} = useMutation({
    mutationFn: async (requstUser) => {
      const {data} = await axiosSecure.put('/user',requstUser);
      return data;
    }
  })



  const modalHandler  = async () => {
    try{
      const currentUser = {
        email : user?.email,
        role : 'guest',
        status : 'Requested',
       }; 
           const  result =  await mutateAsync(currentUser)
           if(result.modifiedCount > 0) {
              toast.success("Successfully! Please wait for admin confirmation")
           }
           else{
            toast.error("Please wait for admin approval");
           }
       
    }catch(error) {
      console.log(error)
    }finally{
      closeModal()
    }
 }

  return (
    <>
      <MenuItem
        icon={BsFingerprint}
        label='My Bookings'
        address='my-bookings'
      />

     { 
        role == 'guest' && 
      <div onClick={()=> setIsModalOpen(true)} className='flex items-center px-4 py-2 mt-5  transition-colors duration-300 transform text-gray-600  hover:bg-gray-300   hover:text-gray-700 cursor-pointer'>
        <GrUserAdmin className='w-5 h-5' />

        <span className='mx-4 font-medium'>Become A Host</span>
      </div>}

      <HostModal closeModal={closeModal} isOpen={isModalOpen} modalHandler={modalHandler}></HostModal>
    </>
  )
}

export default GuestMenu