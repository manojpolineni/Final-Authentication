import { useContext, useEffect, useRef } from "react"
import { assets } from "../assets/assets"
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa6";

const EmailVerify = () => {
      axios.defaults.withCredentials = true 
      const navigate = useNavigate();

      const {backendUrl, isLoggedIn, 
            userData, getUserData}  = useContext(AppContext)

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

      const handleSubmitOTP = async(e) =>{
            try {
                  e.preventDefault();
                  const otpArray = inputRef.current.map(e => e.value)
                  const otp = otpArray.join('');
                  
                  const {data} = await axios.post(backendUrl + '/api/users/verifyuser', {otp})

                  if(data.success){
                        toast.success(data.message)
                        getUserData()
                        navigate('/')
                  }else{
                        toast.error(data.message)
                  }
            } catch (error) {
                  toast.error(error.message)
            }
      }

      useEffect(()=>{
            isLoggedIn && userData && userData.verifiedUser && navigate('/')
      }, [isLoggedIn, userData])

  return (
    <div className="flex items-center flex-col justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 ">

      <img  src={assets.logo} alt="" className="absolute left-5 xm:left-20 top-5 w-28 xs:w-28 sm:w-32 cursor-pointer" />
      <form onSubmit={handleSubmitOTP} className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 tetx-sm">
            <h1 className="text-3xl font-semibold text-white text-center mb-3">Email Verify OTP</h1>
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
            <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full " type="submit">Verify email OTP</button>
      </form>
      <div className="flex justify-center items-center mt-10">
         <span className="flex  tetx-center text-black tetx-2xl cursor-pointer" onClick={()=>navigate('/login')}> <FaArrowLeft size={25} className="mx-2"/>Back to Login</span>   
      </div>
    </div>
  )
}

export default EmailVerify