import axios from "axios"


const commonAxios = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
})

const useAxiosCommon = () => {
  return  commonAxios
}

export default useAxiosCommon
