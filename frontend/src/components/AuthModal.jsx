"use client"

import { useState } from "react"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"

function AuthModal({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-lg border border-slate-200">
        {isLogin ? (
          <LoginForm onLoginSuccess={onLoginSuccess} onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onLoginSuccess={onLoginSuccess} onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
}

export default AuthModal
