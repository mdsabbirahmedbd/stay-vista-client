import { format } from "date-fns";
import { useState } from "react";
import DeleteModal from "../modal/DeleteModal";
import UpdateRoomModal from "../modal/UpdateRoomModal";

const MylistRowData = ({room,handleDelete,refetch}) => {
    const [isOpen,setIsOpen] = useState(false);

    const [ isEditModal , setIsEditModalOpen] = useState(false);
    
    const closeModal = () => {
        setIsOpen(false);
    }





  return (
    <>
      <tr>
        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{room.title}</td>
        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{room.location}</td>
        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{room.price}</td>
        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{format(new Date(room?.startDate), "P")}</td>
        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{format(new Date(room?.endDate), "P")}</td>
        <td className="px-5 py-4 whitespace-nowrap text-center text-sm font-medium text-red">
        <button onClick={()=> setIsOpen(true)} className="p-1 border rounded-md bg-red-500">Delete</button >
        <DeleteModal id={room?._id} handleDelete={handleDelete} isOpen={isOpen} closeModal={closeModal}></DeleteModal>
        </td>
        <td className="px-5 py-4 whitespace-nowrap text-center text-sm font-medium text-red">
        <button onClick={() => setIsEditModalOpen(true)}  className="p-1 border rounded-md bg-green-500">Update</button>
        </td>
          
      </tr>
      <UpdateRoomModal room={room} refetch={refetch} isOpen={isEditModal} setIsEditModalOpen={setIsEditModalOpen} />
      </>

  );
};

export default MylistRowData;
