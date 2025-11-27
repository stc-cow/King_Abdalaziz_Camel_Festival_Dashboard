interface BarChartProps {
  data: Array<{ label: string; value: number }>;
  title?: string;
}

export function BarChart({ data, title }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-3 h-full flex items-center justify-center text-white">
        <p className="text-white/70 text-xs sm:text-sm">No data</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const chartHeight = 180;
  const barWidth = Math.max(20, Math.floor(250 / data.length));
  const spacing = Math.max(4, Math.floor((280 - barWidth * data.length) / (data.length + 1)));

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-3 h-full flex flex-col text-white">
      {title && <h3 className="text-xs sm:text-sm font-semibold mb-2 flex-shrink-0 drop-shadow">{title}</h3>}
      <div className="flex-1 pb-2 flex items-end justify-center gap-1">
        <svg width={spacing + data.length * (barWidth + spacing)} height={chartHeight} viewBox={`0 0 ${spacing + data.length * (barWidth + spacing)} ${chartHeight}`}>
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * (chartHeight - 30);
            const x = spacing + index * (barWidth + spacing);
            const y = chartHeight - barHeight - 20;

            return (
              <g key={index}>
                <rect x={x} y={y} width={barWidth} height={barHeight} fill="#7d2cff" rx={2} />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#e5e7eb"
                  className="truncate"
                >
                  {item.label.substring(0, 5)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
