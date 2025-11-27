'use client';

import { useEffect, useRef } from 'react';
import { Ticket } from '@/lib/getTickets';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  tickets: Ticket[];
}

export function Map({ tickets }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // store initialized map instance

  useEffect(() => {
    if (!mapContainer.current) return;

    // Prevent double initialization
    if (mapRef.current) return;

    import('leaflet').then(L => {
      // Initialize map once
      mapRef.current = L.map(mapContainer.current).setView(
        [24.4539, 46.5260],
        6
      );

      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles © Esri',
          maxZoom: 19,
        }
      ).addTo(mapRef.current);

      // Sample site coordinates
      const cowSites: Record<string, [number, number]> = {
        'COW Site 1': [24.7136, 46.6753],
        'COW Site 2': [24.6748, 46.7317],
        'COW Site 3': [24.4539, 46.5260],
        'Site A': [24.5, 46.5],
        'Site B': [24.6, 46.7],
        'Site C': [24.3, 46.4],
      };

      const colors = {
        open: '#ef4444',
        pending: '#facc15',
        resolved: '#22c55e',
      };

      const addMarkers = (statusTickets: Ticket[], color: string) => {
        statusTickets.forEach(ticket => {
          const coords = cowSites[ticket.cowSite] || [24.4539, 46.5260];

          const jitterLat = coords[0] + (Math.random() * 0.01 - 0.005);
          const jitterLng = coords[1] + (Math.random() * 0.01 - 0.005);

          const marker = L.circleMarker([jitterLat, jitterLng], {
            radius: 6,
            fillColor: color,
            color: 'white',
            weight: 1.5,
            opacity: 0.9,
            fillOpacity: 0.8,
          }).addTo(mapRef.current);

          marker.bindPopup(
            `<div class="text-xs"><strong>${ticket.id}</strong><br/>${ticket.cowSite}</div>`,
            { maxWidth: 200 }
          );
        });
      };

      addMarkers(
        tickets.filter(t => t.status.toLowerCase() === 'open'),
        colors.open
      );

      addMarkers(
        tickets.filter(t => t.status.toLowerCase() === 'pending'),
        colors.pending
      );

      addMarkers(
        tickets.filter(
          t =>
            t.status.toLowerCase() === 'resolved' ||
            t.status.toLowerCase() === 'closed'
        ),
        colors.resolved
      );
    });
  }, [tickets]);

  return (
    <div className="flex flex-col h-full gap-2 text-white">
      <h3 className="text-xs sm:text-sm font-semibold drop-shadow">
        Satellite Map of COW Distributions
      </h3>

      <div
        ref={mapContainer}
        className="flex-1 rounded-lg border border-white/20 shadow-lg overflow-hidden"
      />

      <div className="flex gap-3 text-xs flex-shrink-0 flex-wrap">
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
