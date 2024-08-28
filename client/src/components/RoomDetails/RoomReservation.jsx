
import Button from "../Shared/Button/Button";
import { useState } from "react";
import { DateRange } from "react-date-range";
import { differenceInCalendarDays } from "date-fns";
import BookingModal from './../modal/BookingModal';
import useAuth from "../../hooks/useAuth";



const RoomReservation = ({ room ,refetch}) => {


  const {user} = useAuth()
  const [state, setState] = useState([
    {
      startDate: new Date(room?.startDate),
      endDate: new Date(room?.endDate),
      key: "selection",
    },
  ]);
 


  const  [isOpen,setIsOpen] = useState(false)
  const closeModal = () => {
    setIsOpen(false)
  }

  const totalDays = parseInt(differenceInCalendarDays(new Date(room.endDate), new Date(room.startDate)));
  const totalPryce = totalDays * room?.price





  return (
    <div className="rounded-xl border-[1px] border-neutral-200 overflow-hidden bg-white">
      <div className="flex items-center gap-1 p-4">
        <div className="text-2xl font-semibold">$ {room?.price}</div>
        <div className="font-light text-neutral-600">night</div>
      </div>
   
      <hr />
      <div className="flex justify-center my-4">
      <DateRange
      showDateDisplay={false}
         rangeColors ={['#F6536D']}
         onChange={() => 
         {
          setState([ {
            startDate: new Date(room.startDate),
            endDate: new Date(room.endDate),
            key: "selection",
          },])
         }
        }
        moveRangeOnFirstSelection={false}
        ranges={state}
      />
      </div>
      <hr />
      <div className="p-4">
        <Button disabled={room.booked === true} onClick={()=> setIsOpen(true)} label={ room.booked ? "Booked" : "Reserve"} />
      </div>
        <BookingModal refetch={refetch} isOpen={isOpen} closeModal={closeModal}  bookingInfo={{...room, price:totalPryce, guest:{name: user?.displayName, email:user?.email, image : user?.photoURL}}}></BookingModal>
      <hr />
      <div className="p-4 flex items-center justify-between font-semibold text-lg">
        <div>Total</div>
        <div>${totalPryce}</div>
      </div>
      
    </div>
  );
};


export default RoomReservation;
