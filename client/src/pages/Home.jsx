import Header from "../components/Header"
import Navbar from "../components/Navbar"
import Products from "./Products"
import Footer from "../components/Footer"

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('./assets/bg_img.png')] bg-cover bg-center ">
      <Navbar/>
      <Header/>
      <Products/>
      <Footer/>
    </div>
  )
}

export default Home