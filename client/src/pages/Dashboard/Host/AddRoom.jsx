/* eslint-disable no-unused-vars */
import { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import useAuth from "./../../../hooks/useAuth";
import { imagesUploaded } from "../../../Utils";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddRoom = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState();
  const [loading,setLoading] = useState(false);

  // State for date selection
  const [date, setDates] = useState({
    startDate: new Date(),
    endDate: new Date() ,
    key: "selection",
  });

  const dateHandler = (range) => {
    setDates(range.selection);
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (roomData) => {
      const { data } = await axiosSecure.post("/addRoom", roomData);
      return data;
    },
    onSuccess: () => {
      toast.success("Room added successfully!");
       setLoading(false);
       navigate('/dashboard/my-listings')
    }
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Your form submission logic goes here
    setLoading(true);
    const form = e.target;
    const location = form.location.value;
    const category = form.category.value;
    const title = form.title.value;
    const image = form.image.files[0];
    const price = form.price.value;
    const bedrooms = form.bedrooms.value;
    const bathrooms = form.bathrooms.value;
    const description = form.description.value;
    const total_guest = form.total_guest.value;
    const startDate = date.startDate;
    const endDate = date.endDate;
    const host = {
      name: user?.displayName,
      email: user?.email,
      photo: user?.photoURL,
    };
    try{
      const image_Url = await imagesUploaded(image);
      const allFormLocations = {
        location,
        category,
        description,
        title,
        price,
        bedrooms,
        bathrooms,
        total_guest,
        host,
        image_Url,
        startDate,
        endDate,
      };
       await mutateAsync(allFormLocations)
       form.reset();
    }
    catch(error){
      setLoading(false);
      toast.error(error.message);
    }
  };

  const displayImages = (image) => {
    setImagePreview(URL.createObjectURL(image));
  };

  return (
    <div>
      <AddRoomForm
        imagePreview={imagePreview}
        displayImages={displayImages}
        date={date}
        dateHandler={dateHandler}
        handleFormSubmit={handleFormSubmit}
        loading={loading}
      ></AddRoomForm>
    </div>
  );
};

export default AddRoom;
