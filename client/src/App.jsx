import './App.css'
import { Routes, Route,  } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';


import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ResetPassword from './pages/ResetPassword'
import EmailVerify from './pages/EmailVerify';

function App() {

  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route index path='/' element={<Home />}  />
        <Route path='/login' element={<Login />}  />
        <Route path='/signup' element={<SignUp />}  />
        <Route path='/email-verify' element={<EmailVerify />}  />
        <Route path='/resetpassord' element={<ResetPassword />}  />
        <Route path='*'  element={<Home/>}/>
      </Routes>
    </div>
  )
}

export default App
