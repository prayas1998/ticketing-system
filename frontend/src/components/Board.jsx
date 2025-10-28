import { useState, useEffect } from 'react';
import TicketColumn from './TicketColumn';
import AuthModal from './AuthModal';
import CreateTicketModal from './CreateTicketModal';
import { fetchTickets, getCurrentUser, updateTicket, deleteTicket, logout } from '../services/api';

function Board() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      loadTickets();
    } catch (err) {
      setShowAuthModal(true);
      setLoading(false);
    }
  };

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTickets();
      const sortedTickets = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setTickets(sortedTickets);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async () => {
    setShowAuthModal(false);
    await checkAuth();
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setTickets([]);
    setShowAuthModal(true);
  };

  const handleUpdateTicket = async (id, updates) => {
    try {
      await updateTicket(id, updates);
      await loadTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTicket = async (id) => {
    try {
      await deleteTicket(id);
      await loadTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  const filterTicketsByStatus = (status) => {
    return tickets.filter((ticket) => ticket.status === status);
  };

  if (showAuthModal) {
    return <AuthModal onLoginSuccess={handleLoginSuccess} />;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-gray-600 text-xl">Loading...</p></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64"><div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded"><p className="font-bold">Error</p><p>{error}</p></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-lg">Welcome, <span className="font-bold">{currentUser?.username}</span></p>
        <div className="flex gap-2">
          <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create Ticket</button>
          <button onClick={handleLogout} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Logout</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TicketColumn status="open" tickets={filterTicketsByStatus('open')} onUpdate={handleUpdateTicket} onDelete={handleDeleteTicket} />
        <TicketColumn status="in_progress" tickets={filterTicketsByStatus('in_progress')} onUpdate={handleUpdateTicket} onDelete={handleDeleteTicket} />
        <TicketColumn status="done" tickets={filterTicketsByStatus('done')} onUpdate={handleUpdateTicket} onDelete={handleDeleteTicket} />
      </div>
      {showCreateModal && <CreateTicketModal onClose={() => setShowCreateModal(false)} onSuccess={loadTickets} />}
    </div>
  );
}

export default Board;
