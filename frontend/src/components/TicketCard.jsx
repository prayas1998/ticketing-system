"use client"

function TicketCard({ ticket, onUpdate, onDelete }) {
  const statusConfig = {
    open: { badge: "bg-slate-100 text-slate-700", dot: "bg-slate-400" },
    in_progress: { badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
    done: { badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
  }

  const priorityConfig = {
    low: { text: "text-slate-600", label: "Low" },
    medium: { text: "text-amber-600", label: "Medium" },
    high: { text: "text-red-600", label: "High" },
  }

  const statusInfo = statusConfig[ticket.status] || statusConfig.open
  const priorityInfo = priorityConfig[ticket.priority] || priorityConfig.medium

  const truncateText = (text, maxLength = 85) => {
    if (!text) return "No description"
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  const formatStatus = (status) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm">
      <h3 className="font-semibold text-sm text-slate-900 mb-2 line-clamp-2">{ticket.title}</h3>

      <p className="text-slate-600 text-xs mb-3 line-clamp-2">{truncateText(ticket.description)}</p>

      <div className="flex items-center justify-between mb-3 gap-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.badge}`}>
          {formatStatus(ticket.status)}
        </span>
        <span className={`text-xs font-semibold ${priorityInfo.text}`}>{priorityInfo.label}</span>
      </div>

      <div className="text-xs text-slate-500 mb-3 space-y-1">
        <p>
          Assigned:{" "}
          <span className="text-slate-700 font-medium">{ticket.assigned_to_user?.username || "Unassigned"}</span>
        </p>
        <p>
          By: <span className="text-slate-700 font-medium">{ticket.created_by_user?.username || "Unknown"}</span>
        </p>
      </div>

      <div className="flex gap-2">
        <select
          onChange={(e) => onUpdate && onUpdate(ticket.id, { status: e.target.value })}
          value={ticket.status}
          className="flex-1 text-xs border border-slate-200 rounded px-2 py-1.5 bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button
          onClick={() => onDelete && window.confirm("Delete this ticket?") && onDelete(ticket.id)}
          className="text-xs bg-red-50 text-red-600 px-2 py-1.5 rounded border border-red-200 hover:bg-red-100 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default TicketCard
