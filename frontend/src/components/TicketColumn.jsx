import TicketCard from "./TicketCard"

function TicketColumn({ status, tickets, onUpdate, onDelete }) {
  const statusConfig = {
    open: {
      title: "Open",
      color: "bg-slate-100 text-slate-700 border-slate-300",
      badge: "bg-slate-200 text-slate-700",
    },
    in_progress: {
      title: "In Progress",
      color: "bg-amber-100 text-amber-700 border-amber-300",
      badge: "bg-amber-200 text-amber-700",
    },
    done: {
      title: "Done",
      color: "bg-emerald-100 text-emerald-700 border-emerald-300",
      badge: "bg-emerald-200 text-emerald-700",
    },
  }

  const config = statusConfig[status] || statusConfig.open

  return (
    <div className="flex flex-col bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className={`${config.color} border-b px-4 py-3 font-semibold text-sm`}>
        {config.title} <span className="text-xs font-normal opacity-75">({tickets.length})</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tickets.length === 0 ? (
          <p className="text-slate-400 text-center py-8 text-sm">No tickets</p>
        ) : (
          tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onUpdate={onUpdate} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  )
}

export default TicketColumn
