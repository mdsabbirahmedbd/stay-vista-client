import { Helmet } from "react-helmet-async";
import useAuth from "../../../hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import MylistRowData from "../../../components/Dashboard/MylistRowData";
import toast from "react-hot-toast";

const MyListings = () => {
  const axiosSecure = useAxiosSecure();

  const { user } = useAuth();

  const { data: listingData = [], isLoading ,refetch} = useQuery({
    queryKey: ["/mylistings", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure(`/mylistings/${user?.email}`);
      return data;
    },
  });


  const {mutateAsync} = useMutation({
    mutationFn:async (id) => {
      const {data} = await axiosSecure.delete(`/roomDelete/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Listing deleted successfully!");
      refetch();
    }
  })


  const handleDelete = async (id) => {
     mutateAsync(id)
  }



  if (isLoading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <>
      <Helmet>
        <title>My Listings</title>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      From
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      To
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Delete
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Update
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* Room row data */}
                  {listingData.map((item, index) => (
                    <MylistRowData refetch={refetch} room={item} key={index}  handleDelete={handleDelete}></MylistRowData>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyListings;
