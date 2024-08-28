import { useState } from "react";
import UpdateUserModal from "../../modal/UpdateUserModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

const UsersDataRow = ({ user, refetch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  const { mutateAsync } = useMutation({
    mutationFn: async (role) => {
      const { data } = await axiosSecure.patch(`/userRole/${user?.email}`, role);
      return data;
    },
    onSuccess: () => {
      refetch();
      toast.success("Role updated successfully!");
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to update role!");
    },
  });

  const modalHandler = async (selected) => {
    console.log(selected)
    const userRole = {
        role: selected,
        status: "Verified",
      };
    try {
      await mutateAsync(userRole);
    } catch (err) {
      toast.error(err.message);
    }
  };



  const {mutateAsync:deleteUser} = useMutation({
          mutationFn: async (id) => {
            const { data } = await axiosSecure.delete(`/userDelete/${id}`);
            return data;
          }
          
  })


  const handleUserDelete = async (userId) => {
      try{
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
          if (result.isConfirmed) {
            await deleteUser(userId);
            refetch()
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
            
          }
        });
          
           

      }catch(err){
        toast.error(err.message);
      }
  }




  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{user?.email}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{user?.role}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {user?.status ? (
          <p className={`${user.status === "Verified" ? "text-green-500" : "text-yellow-500"} whitespace-no-wrap`}>
            {user.status}
          </p>
        ) : (
          <p className="text-red-500 whitespace-no-wrap">Unavailable</p>
        )}
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button onClick={() => setIsOpen(true)} className="px-2 py-1  text-xs  font-semibold rounded-full bg-green-500">
          Update role
        </button>
        <UpdateUserModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          user={user}
          modalHandler={modalHandler}
        ></UpdateUserModal>
      </td>

     
     {/* delete user in the website for security purposes only */}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
      <button onClick={ () => handleUserDelete(user?._id)}><MdDelete className="text-3xl text-red-500" /></button>
      </td>
    </tr>
  );
};

export default UsersDataRow;
