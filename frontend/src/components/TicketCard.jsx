function TicketCard({ ticket }) {
  const statusColors = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    done: 'bg-green-100 text-green-800',
  };

  const priorityColors = {
    low: 'text-gray-600',
    medium: 'text-orange-600',
    high: 'text-red-600',
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return 'No description';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <h3 className="font-bold text-lg text-gray-800 mb-2">{ticket.title}</h3>

      <p className="text-gray-600 text-sm mb-3">
        {truncateText(ticket.description)}
      </p>

      <div className="flex items-center justify-between mb-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            statusColors[ticket.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {formatStatus(ticket.status)}
        </span>

        <span
          className={`text-sm font-medium ${
            priorityColors[ticket.priority] || 'text-gray-600'
          }`}
        >
          {ticket.priority.toUpperCase()}
        </span>
      </div>

      <div className="text-xs text-gray-500 mt-2">
        <p>Assigned: {ticket.assigned_to || 'Unassigned'}</p>
      </div>
    </div>
  );
}

export default TicketCard;
