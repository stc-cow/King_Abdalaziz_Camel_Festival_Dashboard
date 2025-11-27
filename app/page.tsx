import { getTickets } from '@/lib/getTickets';
import { Dashboard } from '@/components/Dashboard';

export const dynamic = 'force-static';

export const dynamic = 'force-static';

export default async function Home() {
  const tickets = await getTickets();

  return <Dashboard tickets={tickets} />;
}
