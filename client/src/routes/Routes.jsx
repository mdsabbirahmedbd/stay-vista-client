import { createBrowserRouter } from 'react-router-dom'
import Main from '../layouts/Main'
import Home from '../pages/Home/Home'
import ErrorPage from '../pages/ErrorPage'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import RoomDetails from '../pages/RoomDetails/RoomDetails'
import PrivateRoute from './PrivateRoute'
import Dashboard from '../layouts/Dashboard'
import Statictics from '../pages/Dashboard/Common/Statictics'
import AddRoom from '../pages/Dashboard/Host/AddRoom'
import MyListings from '../pages/Dashboard/Host/MyListings'
import Profile from '../pages/Dashboard/Common/Profile'
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers'
import AdminRouts from './AdminRouts'
import HostRouts from './HostRouts'
import MyBookings from '../pages/Dashboard/Guest/MyBooking'
import ManageBookings from '../pages/Dashboard/Host/ManageBookings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/room/:id',
        element: <PrivateRoute><RoomDetails /></PrivateRoute>
      },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },

  {
    path:'dashboard',
    element:<PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    children:[
      {
        index:true,
        element:<Statictics></Statictics>
      },
      {
        path:'add-room',
        element:<HostRouts><PrivateRoute><AddRoom></AddRoom></PrivateRoute></HostRouts>
      },
      {
        path:'my-listings',
        element:<HostRouts><privateRoute><MyListings></MyListings></privateRoute></HostRouts>
      },
      {
        path:'profile',
        element:<privateRoute><Profile></Profile></privateRoute>
      },
      {
        path:'manageUsers',
        element:<AdminRouts><PrivateRoute><ManageUsers></ManageUsers></PrivateRoute></AdminRouts>
      },
      {
        path:'my-bookings',
        element:<PrivateRoute><MyBookings></MyBookings></PrivateRoute>
      },
      {
        path:'manage-bookings',
        element:<PrivateRoute><HostRouts><ManageBookings></ManageBookings></HostRouts></PrivateRoute>
      }
    ]
  }
])
