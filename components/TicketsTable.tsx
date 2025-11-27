'use client';

import { useState, useMemo } from 'react';
import { Ticket } from '@/lib/getTickets';

interface TicketsTableProps {
  tickets: Ticket[];
}

const statusColors: Record<string, string> = {
  'open': 'bg-red-100 text-red-800',
  'closed': 'bg-green-100 text-green-800',
  'pending': 'bg-yellow-100 text-yellow-800',
  'resolved': 'bg-green-100 text-green-800',
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
        <h3 className="text-xs sm:text-sm font-semibold text-gray-800">Tickets</h3>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-40 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-[#7d2cff]"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-gray-300">
              <th className="text-left py-1 px-2 font-semibold text-gray-700">ID</th>
              <th className="text-left py-1 px-2 font-semibold text-gray-700 hidden sm:table-cell">Site</th>
              <th className="text-left py-1 px-2 font-semibold text-gray-700 hidden md:table-cell">Type</th>
              <th className="text-left py-1 px-2 font-semibold text-gray-700 hidden lg:table-cell">Date</th>
              <th className="text-left py-1 px-2 font-semibold text-gray-700">Status</th>
              <th className="text-left py-1 px-2 font-semibold text-gray-700 hidden sm:table-cell">Age</th>
            </tr>
          </thead>
          <tbody>
            {displayedTickets.map(ticket => (
              <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-1 px-2 font-mono text-gray-900">{ticket.id}</td>
                <td className="py-1 px-2 text-gray-700 hidden sm:table-cell text-xs">{ticket.cowSite.substring(0, 8)}</td>
                <td className="py-1 px-2 text-gray-700 hidden md:table-cell text-xs">{ticket.issueType.substring(0, 8)}</td>
                <td className="py-1 px-2 text-gray-700 hidden lg:table-cell text-xs">{ticket.openDate.substring(0, 5)}</td>
                <td className="py-1 px-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status.substring(0, 5)}
                  </span>
                </td>
                <td className="py-1 px-2 font-semibold text-gray-900 hidden sm:table-cell">{ticket.agingDays}d</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {displayedTickets.length === 0 && (
        <div className="py-2 text-center text-gray-500 text-xs flex-shrink-0">
          No tickets found
        </div>
      )}

      <div className="flex items-center justify-between pt-1 gap-2 flex-shrink-0 text-xs">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 bg-gray-100 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 text-xs"
        >
          Prev
        </button>
        <span className="text-xs text-gray-600">
          {currentPage}/{totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-2 py-1 bg-gray-100 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 text-xs"
        >
          Next
        </button>
      </div>
    </div>
  );
}
