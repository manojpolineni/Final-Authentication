import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import { useState, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";


const ResetPassword = () => {
  const navigate = useNavigate();
  const {backendUrl} = useContext(AppContext);

  const [email, setEmail]= useState('');
  const [newPassword, setNewPassword]= useState('');
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);
  const [visiblePassword, setVisisblePassword] = useState(false);

  const inputRef = useRef([]);
    const handleInput =(e, index)=>{
      if(e.target.value.length >0 && index <  inputRef.current.length -1){
        inputRef.current[index + 1 ].focus()
      }
    }

    const handleKeyDown = (e, index) =>{
      if(e.key === 'Backspace' && e.target.value === '' && index >0){
        inputRef.current[index - 1].focus(); 
      }
    }

    const handlePaste = (e) =>{
      const paste = e.clipboardData.getData('text')
      const pasteArray = paste.split('');
      pasteArray.forEach((char, index)=>{
        if(inputRef.current[index]){
          inputRef.current[index].value = char;
        }
      })
    }

    const onSubmitEmail = async (e)=>{
      e.preventDefault();
      try {
        const {data} = await axios.post(backendUrl + '/api/users/forgot-password', {email})
        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success && setIsEmailSent(true)
      } catch (error) {
        toast.error(error.message)
      }
    }

    const onsubmitOtp = async (e)=>{
      e.preventDefault();
      const otparray = inputRef.current.map(e=>e.value);
      setOtp(otparray.join(''))
      setIsOtpSubmited(true);
    }

    const onSubmitNewPassword =async (e) =>{
      e.preventDefault();
      try {
        const {data} = await axios.post(backendUrl + "/api/users/resetpassword", {email, otp, newPassword})

        data.success ? toast.success(data.message) : toast.error(data.message);
        data.success && navigate('/login');
      } catch (error) {
        toast.error(error.message)
      }
    }


  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 ">
    <img onClick={()=>navigate('/')}  src={assets.logo} alt="" className="absolute left-5 xm:left-20 top-5 w-28 xs:w-28 sm:w-32 cursor-pointer" />
       
    {!isEmailSent &&   
      <form onSubmit={onSubmitEmail} className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 tetx-sm">
        <h1 className="text-3xl font-semibold text-white text-center mb-3">Reset Password</h1>
        <p className="text-center mb-6 text-sm">Enter your registered Email address/</p>
        <div className="flex justify-between mb-4  items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c] ">
          <img src={assets.mail_icon} alt="" className="w-3 h-3"/>
          <input type="text" 
            placeholder="Enter Email" 
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            className="bg-transparent outline-none w-full text-white"
          />
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full " type="submit" >Submit</button>
      </form>
    }

    {/* OTP input form */}
    {!isOtpSubmited &&  isEmailSent &&
      <form onSubmit={onsubmitOtp} className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 tetx-sm">
            <h1 className="text-3xl font-semibold text-white text-center mb-3">Reset Password OTP</h1>
            <p className="text-center mb-6 text-sm">Enter the 6-digit code that sent to your email id.</p>
            <div className="flex justify-between mb-8" onPaste={handlePaste}>
                  {Array(6).fill(0).map((_, index)=>(
                        <input type="text" maxLength='1' key={index} 
                        ref={e => inputRef.current[index] = e}
                        onInput={(e)=> handleInput(e, index)}
                        onKeyDown={(e)=> handleKeyDown(e, index)}
                  
                        required
                        className="w-12 h-12 bg-[#333a5c] text-white text-center text-xl rounded-md "
                        />
                  ))}
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full " type="submit">Submit</button>
      </form>
    }

    {/* Enter New Password */}
    {isOtpSubmited && isEmailSent && 
      <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 tetx-sm">
        <h1 className="text-3xl font-semibold text-white text-center mb-3">Reset Password</h1>
        <p className="text-center mb-6 text-sm">Enter your New Password</p>
        <div className="flex justify-between mb-4  items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c] ">
        <img src={assets.mail_icon} alt="" className="w-3 h-3"/>
        <input 
          type={!visiblePassword ? 'password': "text"} 
          placeholder="Enter password" 
          value={newPassword}
          onChange={(e)=> setNewPassword(e.target.value)}
          className="bg-transparent outline-none w-full text-white"
        />
         <span onClick={()=> setVisisblePassword(!visiblePassword)} className=" absolute right-5 cursor-pointer ">{visiblePassword ?   <FaRegEye size={25} />: <FaRegEyeSlash size={25} /> }</span>
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full " type="submit" >Submit</button>
      </form>
    }
    </div>
  )
}

export default ResetPassword