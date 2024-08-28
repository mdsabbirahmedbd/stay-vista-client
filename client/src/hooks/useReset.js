import toast from "react-hot-toast";
import useAuth from "./useAuth"


const useReset = () => {
  const {user,resetPassword,setLoading} = useAuth();



  const handleReset  = async ()=>{
    if(!user?.email) return toast.error('Plase Write your email address.......')
    try{
      await resetPassword(user?.email)
      toast.success('Please Check youer email')
      }catch(error){
        toast.error(error.meggage)
        setLoading(false)
    }
  }

  return handleReset
}

export default useReset
