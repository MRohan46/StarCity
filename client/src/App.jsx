import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import ResetPassword from './pages/ResetPassword'
import EmailVerification from './pages/EmailVerification'
import Register from './pages/Register'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/email-verify' element={<EmailVerification />}/>
        <Route path='/reset-password' element={<ResetPassword />}/>
      </Routes>
    </div>
  )
}

export default App
