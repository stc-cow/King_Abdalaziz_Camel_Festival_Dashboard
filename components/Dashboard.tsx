'use client';

import { Ticket } from '@/lib/getTickets';
import { MetricCard } from '@/components/MetricCard';

interface DashboardProps {
  tickets: Ticket[];
}

export function Dashboard({ tickets }: DashboardProps) {
  return (
    <div className="p-8">
      <h1>Dashboard Test</h1>
      <p>Total Tickets: {tickets.length}</p>
      <MetricCard title="Test" value={10} icon="📊" color="purple" />
    </div>
  );
}
