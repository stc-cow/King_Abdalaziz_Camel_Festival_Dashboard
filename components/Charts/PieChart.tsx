interface PieChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  title?: string;
}

export function PieChart({ data, title }: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-3 h-full flex items-center justify-center text-white">
        <p className="text-white/70 text-xs sm:text-sm">No data</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = 60;
  const centerY = 60;
  const radius = 50;

  let currentAngle = -Math.PI / 2;
  const slices = data.map((item) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    currentAngle = endAngle;

    return { pathData, color: item.color, label: item.label, value: item.value };
  });

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-3 h-full flex flex-col text-white">
      {title && <h3 className="text-xs sm:text-sm font-semibold mb-2 flex-shrink-0 drop-shadow">{title}</h3>}
      <div className="flex-1 flex items-center justify-between gap-2 overflow-hidden">
        <svg width="140" height="140" viewBox="0 0 140 140" className="flex-shrink-0">
          {slices.map((slice, index) => (
            <path key={index} d={slice.pathData} fill={slice.color} stroke="white" strokeWidth="2" />
          ))}
        </svg>
        <div className="flex flex-col gap-1 text-xs overflow-y-auto flex-1">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-1 flex-shrink-0">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate drop-shadow">{item.label}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
