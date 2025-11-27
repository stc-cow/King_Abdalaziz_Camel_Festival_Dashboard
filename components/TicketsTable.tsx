'use client';

import { useState, useMemo } from 'react';
import { Ticket } from '@/lib/getTickets';

interface TicketsTableProps {
  tickets: Ticket[];
}

const statusColors: Record<string, string> = {
  'open': 'bg-red-500/30 text-red-50 border border-red-200/40',
  'closed': 'bg-green-500/30 text-green-50 border border-green-200/40',
  'pending': 'bg-yellow-500/30 text-yellow-50 border border-yellow-200/40',
  'resolved': 'bg-green-500/30 text-green-50 border border-green-200/40',
};

const getStatusColor = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  return statusColors[normalizedStatus] || 'bg-gray-100 text-gray-800';
};

export function TicketsTable({ tickets }: TicketsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTickets = useMemo(() => {
    return tickets.filter(
      ticket =>
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.cowSite.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tickets, searchTerm]);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 flex-shrink-0">
        <h3 className="text-xs sm:text-sm font-semibold text-white drop-shadow">Tickets</h3>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-40 px-2 py-1 border border-white/30 bg-white/10 text-white placeholder:text-white/70 rounded text-xs focus:outline-none focus:ring-2 focus:ring-[#7d2cff]"
        />
      </div>

      <div className="flex-1 overflow-y-hidden">
        <table className="w-full text-xs text-white/90">
          <thead className="bg-white/10">
            <tr className="border-b border-white/20">
              <th className="text-left py-1 px-2 font-semibold">ID</th>
              <th className="text-left py-1 px-2 font-semibold hidden sm:table-cell">Site</th>
              <th className="text-left py-1 px-2 font-semibold hidden md:table-cell">Type</th>
              <th className="text-left py-1 px-2 font-semibold hidden lg:table-cell">Date</th>
              <th className="text-left py-1 px-2 font-semibold">Status</th>
              <th className="text-left py-1 px-2 font-semibold hidden sm:table-cell">Age</th>
            </tr>
          </thead>
          <tbody>
            {displayedTickets.map(ticket => (
              <tr key={ticket.id} className="border-b border-white/10 hover:bg-white/5">
                <td className="py-1 px-2 font-mono text-white">{ticket.id}</td>
                <td className="py-1 px-2 hidden sm:table-cell text-xs text-white/80">{ticket.cowSite.substring(0, 8)}</td>
                <td className="py-1 px-2 hidden md:table-cell text-xs text-white/80">{ticket.issueType.substring(0, 8)}</td>
                <td className="py-1 px-2 hidden lg:table-cell text-xs text-white/80">{ticket.openDate.substring(0, 5)}</td>
                <td className="py-1 px-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status.substring(0, 5)}
                  </span>
                </td>
                <td className="py-1 px-2 font-semibold text-white hidden sm:table-cell">{ticket.agingDays}d</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {displayedTickets.length === 0 && (
        <div className="py-2 text-center text-white/70 text-xs flex-shrink-0">
          No tickets found
        </div>
      )}

      <div className="flex items-center justify-between pt-1 gap-2 flex-shrink-0 text-xs">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 bg-white/10 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 text-xs border border-white/20"
        >
          Prev
        </button>
        <span className="text-xs text-white/80">
          {currentPage}/{totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-2 py-1 bg-white/10 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 text-xs border border-white/20"
        >
          Next
        </button>
      </div>
    </div>
  );
}
