import { getTickets } from '@/lib/getTickets';
import { Dashboard } from '@/components/Dashboard';

export default async function Home() {
  const tickets = await getTickets();
  return <Dashboard tickets={tickets} />;
}
