interface BarChartProps {
  data: Array<{ label: string; value: number }>;
  title?: string;
}

export function BarChart({ data, title }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md p-3 h-full flex items-center justify-center">
        <p className="text-gray-400 text-xs sm:text-sm">No data</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const chartHeight = 180;
  const barWidth = Math.max(20, Math.floor(250 / data.length));
  const spacing = Math.max(4, Math.floor((280 - barWidth * data.length) / (data.length + 1)));

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md p-3 h-full flex flex-col">
      {title && <h3 className="text-xs sm:text-sm font-semibold mb-2 text-gray-800 flex-shrink-0">{title}</h3>}
      <div className="flex-1 overflow-x-auto pb-2 flex items-end justify-center gap-1">
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
                  fill="#666"
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
