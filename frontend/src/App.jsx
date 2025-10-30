"use client"

import { useState } from "react"
import Board from "./components/Board"

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [onLogout, setOnLogout] = useState(null)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-slate-700 to-slate-800 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Ticketing System</h1>
              <p className="text-sm text-slate-300 mt-1">Manage your tickets efficiently</p>
            </div>

            {currentUser && (
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-sm text-slate-300">Welcome back</p>
                  <p className="text-lg font-semibold text-white">{currentUser.username}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Board onUserChange={setCurrentUser} onLogoutChange={setOnLogout} />
      </main>
    </div>
  )
}

export default App
