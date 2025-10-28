import { useState, useEffect } from 'react';
import TicketColumn from './TicketColumn';
import { fetchTickets } from '../services/api';

function Board() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTickets();
      
      const sortedTickets = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      
      setTickets(sortedTickets);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterTicketsByStatus = (status) => {
    return tickets.filter((ticket) => ticket.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600 text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <TicketColumn status="open" tickets={filterTicketsByStatus('open')} />
      <TicketColumn
        status="in_progress"
        tickets={filterTicketsByStatus('in_progress')}
      />
      <TicketColumn status="done" tickets={filterTicketsByStatus('done')} />
    </div>
  );
}

export default Board;
