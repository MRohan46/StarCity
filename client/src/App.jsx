import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import ForgotPassword from './pages/ForgotPassword'
import EmailVerification from './pages/EmailVerification'
import Register from './pages/Register'
import PaymentPage from './pages/PaymentPage'
import Purchase from './pages/Purchase'
import Dashboard from './pages/Dashboard'
import Logout from './pages/Logout'
import ResetPassword from './pages/ResetPassword';
import PaidPayments from './pages/PaidPayments'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<Register />}/>
        <Route path='/email-verify' element={<EmailVerification />}/>
        <Route path='/forgot-password' element={<ForgotPassword />}/>
        <Route path='/reset-password/:token' element={<ResetPassword />}/>
        <Route path='/payment' element={<PaymentPage />}/>
        <Route path='/paid' element={<PaidPayments />}/>
        <Route path='/purchase' element={<Purchase />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/logout' element={<Logout />}/>
      </Routes>
    </div>
  )
}

export default App
