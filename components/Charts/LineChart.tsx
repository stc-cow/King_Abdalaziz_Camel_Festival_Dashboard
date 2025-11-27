interface LineChartProps {
  data: Array<{ date: string; value: number }>;
  title?: string;
}

export function LineChart({ data, title }: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-3 h-full flex items-center justify-center text-white">
        <p className="text-white/70 text-xs sm:text-sm">No data</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const chartHeight = 180;
  const chartWidth = 320;
  const padding = 25;

  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - (item.value / maxValue) * (chartHeight - padding * 2);
    return { x, y, ...item };
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-3 h-full flex flex-col text-white">
      {title && <h3 className="text-xs sm:text-sm font-semibold mb-2 flex-shrink-0 drop-shadow">{title}</h3>}
      <div className="flex-1 flex justify-center">
        <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + ratio * (chartHeight - padding * 2)}
              x2={chartWidth - padding}
              y2={padding + ratio * (chartHeight - padding * 2)}
              stroke="#94a3b8"
              strokeWidth="1"
            />
          ))}

          <path d={pathData} stroke="#7d2cff" strokeWidth="2" fill="none" />

          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#7d2cff" stroke="white" strokeWidth="1.5" />
          ))}

          <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#333" strokeWidth="1.5" />
          <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#333" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}
