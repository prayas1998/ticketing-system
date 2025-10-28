import TicketCard from './TicketCard';

function TicketColumn({ status, tickets }) {
  const statusTitles = {
    open: 'Open',
    in_progress: 'In Progress',
    done: 'Done',
  };

  const statusColors = {
    open: 'bg-blue-600',
    in_progress: 'bg-yellow-600',
    done: 'bg-green-600',
  };

  return (
    <div className="flex flex-col bg-gray-50 rounded-lg p-4">
      <div
        className={`${
          statusColors[status] || 'bg-gray-600'
        } text-white font-bold text-lg px-4 py-2 rounded-md mb-4`}
      >
        {statusTitles[status] || status} ({tickets.length})
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto">
        {tickets.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tickets</p>
        ) : (
          tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
        )}
      </div>
    </div>
  );
}

export default TicketColumn;
