import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { Fragment } from 'react'
import useAuth from '../../hooks/useAuth'
import { imagesUploaded } from '../../Utils'

const   UpdateModal = ({openUpdate,closeUpdate}) => {
  const {user, updateUserProfile} = useAuth()
 

  const hanleSubmit  = async (e) => {
      e.preventDefault()
      const form = e.target;
      const name = form.name.value;
      const image = form.image.files[0]
    
      try{
        const currentImage = await imagesUploaded(image)
        await updateUserProfile(name,currentImage)
            
      }catch(error){
        console.log(error);
      }finally{
     await closeUpdate()
      }



  }

  return (
    <Transition appear show={openUpdate} as={Fragment}>
    <Dialog as='div' className='relative z-10' onClose={closeUpdate}>
      <TransitionChild
        as={Fragment}
        enter='ease-out duration-300'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='ease-in duration-200'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'>
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
                className='text-lg font-medium leading-6 text-center text-gray-900'
              >
              Update Your Profile?
              </DialogTitle>
             <form onSubmit={hanleSubmit}>
             <div className='mt-5 flex flex-col items-center gap-5 '>
               <img className='w-1/3 ' src={user?.photoURL} alt="" />
               <input name='image'  type="file"  />
               <input name='name' className='w-full  border border-zinc-700 p-2 rounded-md' type="text"  placeholder={user?.displayName} />
               <input disabled className='w-full  border border-zinc-700 p-2 rounded-md' type="email" value={user?.email} />
              </div>
              {/* yes  or no buttons in here  */}
              <div className='flex mt-5 justify-around'>
                <button 
                  type='submit'
                  className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                >
                  Yes
                </button>
                <button
                  type='button'
                  className='inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2'
                  onClick={closeUpdate}
                >
                  No
                </button>
              </div>
             </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </Transition>
)
}

export default  UpdateModal
