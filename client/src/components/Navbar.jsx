import { useContext } from 'react';
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const {backendUrl, setIsLoggedIn, 
    userData,removeAuthToken, setUserData} = useContext(AppContext);

    const logout = async ()=>{
      try {
        axios.defaults.withCredentials = true;
        const {data} = await axios.post(backendUrl+ '/api/users/logout')
        data.success && setIsLoggedIn(false);
        data.success && setUserData(false);
        removeAuthToken();
        navigate('/')
      } catch (error) {
        toast.error(error.messages);
      }
    }

    // const sendVerificationOtp = async ()=>{
    //   try {
    //     axios.defaults.withCredentials = true
    //     const {data} = await axios.post(backendUrl + '/api/users/sendmail')
    //     if(data.success){
    //       navigate('/email-verify');
    //       toast.success(data.message)
    //     }
    //   } catch (error) {
    //     toast.error(error.message)
    //   }
    // }

    return (
      <div className='flex justify-between items-center w-full p-4 xm:p-6 xm:px-24 sm:px-24 sm:p-6  absolute top-0  '>
        <img src={assets.logo} alt="" className="w-28 xm:w-32 sm:w-28" />
          {userData? 
          <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
            {userData.userName[0].toUpperCase()}
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10 '>
              <ul className='w-full list-none m-0 p-2 bg-gray-300 text-sm rounded-lg'>
                {/* {!userData.verifiedUser && <li className='py-1 px-2 hover:bg-gray-100 cursor-pointer  ' onClick={sendVerificationOtp}> Verify Email </li>} */}
                <li className='px-2 hover:bg-gray-100 cursor-pointer pr-10' onClick={logout}> Logout </li>
              </ul>
            </div>
          </div> 
          : 
          <button className='flex items-center gap-2 border px-6 py-2 bg-white hover:bg-gradient-to-tr from-pink-300 to-blue-300 p-0.5 hover:shadow-lg rounded-full' onClick={()=> navigate('/login')}>Login <img src={assets.arrow_icon} alt="" /> </button>
        }
      </div>
    )
}

export default Navbar