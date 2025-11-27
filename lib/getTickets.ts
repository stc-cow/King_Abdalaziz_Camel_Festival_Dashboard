export interface Ticket {
  id: string;
  cowSite: string;
  issueType: string;
  openDate: string;
  status: string;
  agingDays: number;
}

export async function getTickets(): Promise<Ticket[]> {
  try {
    const response = await fetch(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSbbDDjYaOGEd9bgF9IKaarmaWw-Yz2Pd0f_C4gelacmktiqjris1vqBufc-G-acPQJ12kOhBZYHpeR/pub?output=csv',
      { next: { revalidate: 300 } }
    );
    
    if (!response.ok) throw new Error('Failed to fetch CSV');
    
    const csv = await response.text();
    const lines = csv.trim().split('\n');
    
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const tickets: Ticket[] = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      
      const getColumnValue = (columnName: string) => {
        const colIndex = headers.findIndex(h => h.includes(columnName));
        return colIndex >= 0 ? values[colIndex] : '';
      };
      
      const openDate = getColumnValue('date') || getColumnValue('open');
      const statusVal = getColumnValue('status');
      
      const openDateObj = new Date(openDate);
      const today = new Date();
      const agingDays = isNaN(openDateObj.getTime()) 
        ? 0 
        : Math.floor((today.getTime() - openDateObj.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        id: getColumnValue('id') || getColumnValue('ticket') || `TKT-${index + 1}`,
        cowSite: getColumnValue('site') || getColumnValue('cow') || 'Unknown',
        issueType: getColumnValue('issue') || getColumnValue('type') || 'Other',
        openDate: openDate,
        status: statusVal || 'Open',
        agingDays: Math.max(0, agingDays),
      };
    });
    
    return tickets;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
}
