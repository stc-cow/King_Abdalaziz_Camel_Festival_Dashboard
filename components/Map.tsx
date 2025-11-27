'use client';

import { useEffect, useRef } from 'react';
import { Ticket } from '@/lib/getTickets';

interface MapProps {
  tickets: Ticket[];
}

export function Map({ tickets }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    import('leaflet').then(L => {
      const map = L.map(mapContainer.current!).setView([24.4539, 46.5260], 6);

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri',
        maxZoom: 19,
      }).addTo(map);

      const cowSites: Record<string, [number, number]> = {
        'COW Site 1': [24.7136, 46.6753],
        'COW Site 2': [24.6748, 46.7317],
        'COW Site 3': [24.4539, 46.5260],
        'Site A': [24.5, 46.5],
        'Site B': [24.6, 46.7],
        'Site C': [24.3, 46.4],
      };

      const openTickets = tickets.filter(t => t.status.toLowerCase() === 'open');
      const pendingTickets = tickets.filter(t => t.status.toLowerCase() === 'pending');
      const resolvedTickets = tickets.filter(t => t.status.toLowerCase() === 'resolved' || t.status.toLowerCase() === 'closed');

      const colors = {
        open: '#ef4444',
        pending: '#facc15',
        resolved: '#22c55e',
      };

      const addMarkersForStatus = (statusTickets: Ticket[], status: 'open' | 'pending' | 'resolved', color: string) => {
        statusTickets.forEach(ticket => {
          const coords = cowSites[ticket.cowSite] || [24.4539, 46.5260];
          const marker = L.circleMarker([coords[0] + Math.random() * 0.01, coords[1] + Math.random() * 0.01], {
            radius: 6,
            fillColor: color,
            color: 'white',
            weight: 1.5,
            opacity: 0.9,
            fillOpacity: 0.8,
          }).addTo(map);

          marker.bindPopup(
            `<div class="text-xs"><strong>${ticket.id}</strong><br/>${ticket.cowSite}</div>`,
            { maxWidth: 200 }
          );
        });
      };

      addMarkersForStatus(openTickets, 'open', colors.open);
      addMarkersForStatus(pendingTickets, 'pending', colors.pending);
      addMarkersForStatus(resolvedTickets, 'resolved', colors.resolved);
    });
  }, [tickets]);

  return (
    <div className="flex flex-col h-full gap-2 text-white">
      <h3 className="text-xs sm:text-sm font-semibold flex-shrink-0 drop-shadow">Satellite Map of Cow Distributions</h3>
      <div ref={mapContainer} className="flex-1 rounded-lg border border-white/20 shadow-lg overflow-hidden" />
      <div className="flex gap-3 flex-wrap text-xs flex-shrink-0">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ef4444' }} />
          <span>Open</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#facc15' }} />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e' }} />
          <span>Resolved</span>
        </div>
      </div>
    </div>
  );
}
