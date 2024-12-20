/* eslint-disable react/no-unescaped-entities */
import { useContext } from "react"
import { assets } from "../assets/assets"
import { AppContext } from "../context/AppContext"

const Header = () => {
  const {userData} = useContext(AppContext);

  return (
    <div className="flex items-center h-screen justify-center flex-col px-4 mt-20 text-center text-gray-800 capitalize">
      <span className=" w-40 h-40 flex justify-center items-center animate-gradient rounded-full mb-6"><img src={assets.header_img} alt="" className="animate-bounce w-36 h-36 rounded-full " /></span> 
      <h1 className="flex items-center gap-2 text-xl xm:text-3xl sm:text-2xl font-medium mb-2">Hey {userData ? userData.userName: 'Developer Mawa'} 
        <img className="w-8 aspect-square" src={assets.hand_wave} alt="" />
      </h1>
      <h2 className="text-3xl xm:text-5xl mb-4 font-semibold sm:text-3xl">Welcome to our app</h2>
      <p className="mb-8 max-w-md">Let's start with a quick product tour and we will have you up and runnig in no time!
      </p>
      <button className="rounded-full px-8 py-2.5 transition-all gradient_anim_btn text-white font-semibold text-sm m-3 bg-gradient-to-br from-yellow-400 via-pink-500 to-blue-500 bg-[length:200%_auto] animate-gradientMove outline-none">Get Strted</button>
    </div>
  )
}

export default Header