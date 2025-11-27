import { getTickets } from '@/lib/getTickets';
import { MetricCard } from '@/components/MetricCard';
import { BarChart } from '@/components/Charts/BarChart';
import { PieChart } from '@/components/Charts/PieChart';
import { LineChart } from '@/components/Charts/LineChart';
import { TicketsTable } from '@/components/TicketsTable';
import { Map } from '@/components/Map';

export default async function Home() {
  const tickets = await getTickets();

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

  const availabilityData = [{ label: 'Availability', value: 100, color: '#22c55e' }];

  const issueTypeCounts = tickets.reduce((acc, t) => {
    acc[t.issueType] = (acc[t.issueType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantIssue = Object.entries(issueTypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  const maxAging = tickets.length ? Math.max(...tickets.map(t => t.agingDays)) : 0;
  const pendingCount = tickets.filter(t => t.status.toLowerCase() === 'pending').length;
  const fastestSite = resolvedTickets > 0 ? Object.entries(ticketsBySite).sort((a, b) => a[1] - b[1])[0][0] : 'N/A';

  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden"
      style={{
        backgroundImage:
          'url(https://cdn.builder.io/api/v1/image/assets%2Fbd65b3cd7a86452e803a3d7dc7a3d048%2Fec3e7df644ec4266be4f41295e564e67?format=webp&width=800)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full overflow-hidden text-white">
        <header className="bg-[#7d2cff]/80 backdrop-blur-xl shadow-lg py-2 px-4 sm:px-6 flex-shrink-0 border-b border-white/20">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fbd65b3cd7a86452e803a3d7dc7a3d048%2Fa2ef9b4964584f7bbade9f5d2e1927ed?format=webp&width=800"
              alt="ACES"
              className="h-10 sm:h-12 object-contain flex-shrink-0"
            />
            <div className="flex-1 text-center min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis drop-shadow">
                Camel Festival – COW Tickets Dashboard • COW Sites • Outages • Tickets • SLA Performance
              </h1>
            </div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fbd65b3cd7a86452e803a3d7dc7a3d048%2F813e3102f0264d06b4f31fb6a915f397?format=webp&width=800"
              alt="STC"
              className="h-10 sm:h-12 object-contain flex-shrink-0"
            />
          </div>
        </header>

        <div className="flex-1 overflow-hidden px-3 sm:px-4 py-3 relative">
          <div className="grid grid-cols-12 grid-rows-6 gap-3 h-full pr-2">
            <div className="col-span-3 row-span-2 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2 h-full">
                <MetricCard title="Total" value={totalTickets} icon="📊" color="purple" />
                <MetricCard title="Open" value={openTickets} icon="🔴" color="red" />
                <MetricCard title="Resolved" value={resolvedTickets} icon="✅" color="green" />
                <MetricCard title="SLA %" value={slaCompliance} icon="🎯" color="blue" />
              </div>
            </div>

            <div className="col-span-3 row-span-2">
              <BarChart data={barChartData} title="Tickets by Site" />
            </div>

            <div className="col-span-3 row-span-2">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-3 h-full flex flex-col">
                <h3 className="text-xs sm:text-sm font-semibold mb-2 drop-shadow">Tickets Insights</h3>
                <div className="flex-1 flex flex-col justify-between text-sm text-white/90">
                  <p className="drop-shadow">Oldest aging ticket: {maxAging} days</p>
                  <p className="drop-shadow">Fastest resolved site: {fastestSite}</p>
                  <p className="drop-shadow">Dominant issue type: {dominantIssue}</p>
                  <p className="drop-shadow">Pending follow-ups: {pendingCount}</p>
                </div>
              </div>
            </div>

            <div className="col-span-6 col-start-4 row-span-6 relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden p-3">
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56">
                  <PieChart data={availabilityData} title="Availability 100%" />
                </div>
              </div>
              <Map tickets={tickets} />
            </div>

            <div className="col-span-3 row-span-3">
              <PieChart data={pieChartData} title="Tickets by Status" />
            </div>
            <div className="col-span-3 row-span-3">
              <LineChart data={lineChartData} title="Daily Trend" />
            </div>
          </div>

          <div className="absolute bottom-3 left-3 right-3 h-36 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl p-3">
            <TicketsTable tickets={tickets} />
          </div>
        </div>
      </div>
    </div>
  );
}
