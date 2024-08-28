import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { Fragment, useState } from 'react'
import UpRoomFoorm from '../Form/UpRoomForm'
import { imagesUploaded } from './../../Utils/index';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';


const UpdateRoomModal = ({ setIsEditModalOpen, isOpen ,room,refetch}) => {
      const axiosSecure = useAxiosSecure()
    const[loading,setLoading] = useState(false) 
    const [roomData,setRoomData] = useState(room)
  
      
    
    const [date, setDates] = useState({
        startDate: new Date(room?.startDate),
        endDate: new Date(room?.endDate) ,
        key: "selection",
      });

      const handleDates = item => {
        setDates(item.selection)
        setRoomData({
          ...roomData,
          endDate: item.selection.endDate,
          startDate: item.selection.startDate,
        })
      }


      const handleImageUpload = async (image) => {
        setLoading(true)

        try{
            // image uploaded method is setup 

            const newImage =   await imagesUploaded(image);
            console.log(newImage)
            setRoomData({...roomData,image_Url : newImage })
            setLoading(false)

        }catch(error){
            console.log(error);
        }

      }
    
      
     
      const {mutateAsync} = useMutation({
            mutationFn: async (updateData) => {
                const {data} = await axiosSecure.put(`/room/update/${room._id}`,updateData)
                return data
            }
  
      })
          


    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        const newData = Object.assign({}, roomData);
        delete newData?._id
        try{  
              await mutateAsync(newData)
          refetch()
          toast.success('Room updated successfully')
          setLoading(false)
          setIsEditModalOpen(false)
        }catch(error){
            console.log(error.message)
            setLoading(false)
        }
    }
    


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        onClose={() => setIsEditModalOpen(false)}
      >
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <DialogTitle
                  as='h3'
                  className='text-lg font-medium text-center leading-6 text-gray-900'
                >
                  Update Room Info
                </DialogTitle>
                <div className='mt-2 w-full'>
                    {/* Update room form */}
                    

                     <UpRoomFoorm handleImageUpload={handleImageUpload} date={date} handleSubmit={handleSubmit} roomData={roomData} setRoomData={setRoomData}  handleDates={handleDates} loading={loading} />

                    {/* Update room form  end */}
                    

                </div>
                <hr className='mt-8 ' />
                <div className='mt-2 '>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}



export default UpdateRoomModal