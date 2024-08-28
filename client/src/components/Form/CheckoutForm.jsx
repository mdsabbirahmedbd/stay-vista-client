/* eslint-disable react-hooks/exhaustive-deps */



import {CardElement,  useElements, useStripe} from '@stripe/react-stripe-js';

import './common.css';
import useAxiosSecure from './../../hooks/useAxiosSecure';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { ImSpinner9 } from "react-icons/im";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';




const CheckoutForm = ({closeModal,bookingInfo,refetch}) => {
  const {user} = useAuth()
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [clientSecret, setClientSecret] = useState();
  const [cardError,setCardError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate()


  useEffect(()=>{
    if(!bookingInfo.price || bookingInfo.price<1) return;
    mutateAsync({price: bookingInfo.price});
  },[]);



  const {mutateAsync} = useMutation({
    mutationKey: 'createPaymentIntent',
    mutationFn:async(price) => {
      const {data} = await axiosSecure.post('/create-payment-intent',price);
      setClientSecret(data.ClientSecret);
    }
  })





  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setCardError(error.message);
      return
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      setCardError("")
    }


    // confirm payment and setUp payment 

      const  {error:cinformError,paymentIntent} =  await stripe.confirmCardPayment(clientSecret,{
        payment_method: {
          card: card,
          billing_details:{
            email:user?.email,
            name:user?.displayName,
          }
        }
       })

       if(cinformError){
        console.log(cinformError.message)
        setCardError(cinformError.message)
        setIsProcessing(false)
        return
       }


       if(paymentIntent.status === "succeeded") {
        // 1. create paymentinfo on object 

        const paymentInfo = {
          ...bookingInfo,
          roomId : bookingInfo._id,
          transitionId: paymentIntent.id,
          date: new Date()
        }
        delete paymentInfo._id

        try{
        // 2. save paymentinfo in booking collection on {mongoDb}
      // eslint-disable-next-line no-unused-vars
       await axiosSecure.post('/bookings',paymentInfo);
      

      
          // 3. change room status on booked 

      await axiosSecure.patch(`/room/status/${bookingInfo?._id}`,{status:true})
       


      //  4. finally change the web ui 
       toast.success('Booking room successfully 😊')
       navigate('/dashboard/my-bookings')
        refetch()

        }catch(err){
          console.log(err.message)
        }


        setIsProcessing(false)
        closeModal()
       }


  };









  return (
  <>
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
       {
      cardError && <p className="text-red-500 ">{cardError}</p>
    }

      <div className='flex my-5 justify-around'>
                  <button type="submit" disabled={!stripe || !clientSecret || isProcessing}
                    onClick={() => {
                    }}
                    className="'inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2'"
                   
                  >
                 { isProcessing ? <ImSpinner9 className='animate-spin m-auto' size={24} /> :
                 `Pay ${bookingInfo.price}`}
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                    onClick={closeModal}
                  >
                    No
                  </button>
                </div>
    </form>

  </>
  );
};





export default CheckoutForm;