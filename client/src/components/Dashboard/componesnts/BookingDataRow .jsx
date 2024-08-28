import { format } from 'date-fns'
import { useState } from 'react'
import DeleteModal from '../../modal/DeleteModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'


const BookingDataRow = ({ booking, refetch }) => {
    const [ isOpen,setisOpen] = useState(false)
    const axiosSecure = useAxiosSecure()



const {mutateAsync} = useMutation({
    mutationFn: async (id) => {
        const {data} = await axiosSecure.delete(`/bookingDelete/${id}`);
        return data;
    },
   onSuccess : async () => {
    toast.success("Booking deleted successfully 🙂")
    await axiosSecure.patch(`/room/status/${booking?.roomId}`,{status:false})
    refetch()
   }
})



    const closeModal = () => {
        setisOpen(false)
    }



    const   handleDelete = async (id) => {
         mutateAsync(id)
    }


  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <div className='flex items-center'>
          <div className='flex-shrink-0'>
            <div className='block relative'>
              <img
                alt='profile'
                src={booking?.image_Url}
                className='mx-auto object-cover rounded h-10 w-15 '
              />
            </div>
          </div>
          <div className='ml-3'>
            <p className='text-gray-900 whitespace-no-wrap'>{booking?.title}</p>
          </div>
        </div>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <div className='flex items-center'>
          <div className='flex-shrink-0'>
            <div className='block relative'>
              <img
                alt='profile'
                src={booking?.guest?.image}
                className='mx-auto object-cover rounded h-10 w-15 '
              />
            </div>
          </div>
          <div className='ml-3'>
            <p className='text-gray-900 whitespace-no-wrap'>
              {booking?.guest?.name}
            </p>
          </div>
        </div>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>${booking?.price}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>
          {format(new Date(booking?.startDate), "P")}
        </p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>
          {format(new Date(booking?.endDate), 'P')}
        </p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <span className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'>
          <span
            aria-hidden='true'
            className='absolute inset-0 bg-red-200 opacity-50 rounded-full'
          ></span>
          <span onClick={()=>setisOpen(true)} className='relative'>Cancel</span>
          <DeleteModal isOpen={isOpen} handleDelete={handleDelete} closeModal={closeModal} id={booking?._id}></DeleteModal>
        </span>
      </td>
    </tr>
  )
}



export default BookingDataRow