import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import ResetPassword from './pages/ResetPassword'
import EmailVerification from './pages/EmailVerification'
import Register from './pages/Register'
import PaymentPage from './pages/PaymentPage'
import Purchase from './pages/Purchase'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/email-verify' element={<EmailVerification />}/>
        <Route path='/reset-password' element={<ResetPassword />}/>
        <Route path='/payment' element={<PaymentPage />}/>
        <Route path='/purchase' element={<Purchase />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
      </Routes>
    </div>
  )
}

export default App
