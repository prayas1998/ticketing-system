"use client"

import { useState, useEffect } from "react"
import TicketColumn from "./TicketColumn"
import AuthModal from "./AuthModal"
import CreateTicketModal from "./CreateTicketModal"
import { fetchTickets, getCurrentUser, updateTicket, deleteTicket, logout } from "../services/api"

function Board({ onUserChange, onLogoutChange }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    onUserChange(currentUser)
  }, [currentUser, onUserChange])

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)
      loadTickets()
    } catch (err) {
      logout()
      setShowAuthModal(true)
      setLoading(false)
    }
  }

  const loadTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchTickets()
      const sortedTickets = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setTickets(sortedTickets)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = async () => {
    setShowAuthModal(false)
    await checkAuth()
  }

  const handleLogout = () => {
    logout()
    setCurrentUser(null)
    setTickets([])
    setShowAuthModal(true)
  }

  useEffect(() => {
    onLogoutChange(() => handleLogout)
  }, [onLogoutChange])

  const handleUpdateTicket = async (id, updates) => {
    try {
      await updateTicket(id, updates)
      await loadTickets()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteTicket = async (id) => {
    try {
      await deleteTicket(id)
      await loadTickets()
    } catch (err) {
      setError(err.message)
    }
  }

  const filterTicketsByStatus = (status) => {
    return tickets.filter((ticket) => ticket.status === status)
  }

  if (showAuthModal) {
    return <AuthModal onLoginSuccess={handleLoginSuccess} />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500 text-lg">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-red-50 border border-red-200 text-red-800 px-8 py-6 rounded-lg shadow-lg max-w-md">
          <div className="flex items-start justify-between mb-3">
            <p className="font-bold text-lg">Error</p>
            <button
              onClick={() => {
                setError(null);
                loadTickets();
              }}
              className="text-red-600 hover:text-red-800 font-bold text-xl leading-none"
              title="Close"
            >
              ×
            </button>
          </div>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadTickets();
            }}
            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-8">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          + Create Ticket
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TicketColumn
          status="open"
          tickets={filterTicketsByStatus("open")}
          onUpdate={handleUpdateTicket}
          onDelete={handleDeleteTicket}
        />
        <TicketColumn
          status="in_progress"
          tickets={filterTicketsByStatus("in_progress")}
          onUpdate={handleUpdateTicket}
          onDelete={handleDeleteTicket}
        />
        <TicketColumn
          status="done"
          tickets={filterTicketsByStatus("done")}
          onUpdate={handleUpdateTicket}
          onDelete={handleDeleteTicket}
        />
      </div>
      {showCreateModal && <CreateTicketModal onClose={() => setShowCreateModal(false)} onSuccess={loadTickets} />}
    </div>
  )
}

export default Board
