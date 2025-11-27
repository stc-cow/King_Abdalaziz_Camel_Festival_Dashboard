'use client';

import { Ticket } from '@/lib/getTickets';
import { MetricCard } from '@/components/MetricCard';
import { BarChart } from '@/components/Charts/BarChart';
import { PieChart } from '@/components/Charts/PieChart';
import { LineChart } from '@/components/Charts/LineChart';
import { TicketsTable } from '@/components/TicketsTable';
import { Map } from '@/components/Map';

interface DashboardProps {
  tickets: Ticket[];
}

export function Dashboard({ tickets }: DashboardProps) {
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status.toLowerCase() === 'open').length;
  const resolvedTickets = tickets.filter(t => t.status.toLowerCase() === 'resolved' || t.status.toLowerCase() === 'closed').length;
  const slaCompliance = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0;

  const ticketsBySite = tickets.reduce((acc, ticket) => {
    acc[ticket.cowSite] = (acc[ticket.cowSite] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barChartData = Object.entries(ticketsBySite).map(([label, value]) => ({ label, value }));

  const statusCounts = tickets.reduce((acc, ticket) => {
    const status = ticket.status.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(statusCounts).map(([label, value]) => ({
    label,
    value,
    color: label === 'open' ? '#ef4444' : label === 'pending' ? '#facc15' : '#22c55e',
  }));

  const ticketsByDate = tickets.reduce((acc, ticket) => {
    const date = ticket.openDate.substring(0, 10);
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const lineChartData = Object.entries(ticketsByDate)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, value]) => ({ date, value }));

  return (
    <div 
      className="min-h-screen w-screen flex flex-col overflow-hidden"
      style={{
        backgroundImage: 'url(https://cdn.builder.io/api/v1/image/assets%2Fbd65b3cd7a86452e803a3d7dc7a3d048%2Fec3e7df644ec4266be4f41295e564e67?format=webp&width=800)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        <header className="bg-[#7d2cff] shadow-lg py-2 px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <img src="https://cdn.builder.io/api/v1/image/assets%2Fbd65b3cd7a86452e803a3d7dc7a3d048%2Fa2ef9b4964584f7bbade9f5d2e1927ed?format=webp&width=800" alt="ACES" className="h-10 sm:h-12 object-contain flex-shrink-0" />
            <div className="flex-1 text-center min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                Camel Festival – COW Tickets Dashboard • COW Sites • Outages • Tickets • SLA Performance
              </h1>
            </div>
            <img src="https://cdn.builder.io/api/v1/image/assets%2Fbd65b3cd7a86452e803a3d7dc7a3d048%2F813e3102f0264d06b4f31fb6a915f397?format=webp&width=800" alt="STC" className="h-10 sm:h-12 object-contain flex-shrink-0" />
          </div>
        </header>

        <div className="flex-1 overflow-hidden px-2 sm:px-4 py-2 sm:py-3">
          <div className="grid grid-cols-12 gap-2 sm:gap-3 h-full">
            
            <div className="col-span-12 sm:col-span-4 flex flex-col gap-2 overflow-hidden">
              <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                <MetricCard title="Total" value={totalTickets} icon="📊" color="purple" />
                <MetricCard title="Open" value={openTickets} icon="🔴" color="red" />
                <MetricCard title="Resolved" value={resolvedTickets} icon="✅" color="green" />
                <MetricCard title="SLA %" value={slaCompliance} icon="🎯" color="blue" />
              </div>
              
              <div className="flex-1 overflow-hidden min-h-0">
                <div className="h-full overflow-y-auto">
                  <BarChart data={barChartData} title="Tickets/Site" />
                </div>
              </div>
            </div>

            <div className="col-span-12 sm:col-span-4 flex flex-col gap-2 overflow-hidden">
              <div className="flex-1 overflow-hidden min-h-0 bg-white/70 backdrop-blur-sm rounded-xl shadow-md p-2">
                <Map tickets={tickets} />
              </div>
            </div>

            <div className="col-span-12 sm:col-span-4 flex flex-col gap-2 overflow-hidden">
              <div className="flex-1 overflow-hidden min-h-0">
                <div className="h-full overflow-y-auto">
                  <PieChart data={pieChartData} title="Status" />
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden min-h-0">
                <div className="h-full overflow-y-auto">
                  <LineChart data={lineChartData} title="Trend" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 overflow-hidden px-2 sm:px-4 pb-2 sm:pb-3 bg-white/70 backdrop-blur-sm border-t border-gray-200">
          <div className="h-32 sm:h-40 overflow-hidden">
            <TicketsTable tickets={tickets} />
          </div>
        </div>
      </div>
    </div>
  );
}
