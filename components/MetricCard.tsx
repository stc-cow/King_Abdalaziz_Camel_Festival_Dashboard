interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'purple' | 'blue' | 'green' | 'yellow' | 'red';
}

const colorClasses = {
  purple: 'bg-purple-50 text-[#7d2cff]',
  blue: 'bg-blue-50 text-[#0f2a52]',
  green: 'bg-green-50 text-[#22c55e]',
  yellow: 'bg-yellow-50 text-[#facc15]',
  red: 'bg-red-50 text-[#ef4444]',
};

const iconBg = {
  purple: 'bg-purple-100',
  blue: 'bg-blue-100',
  green: 'bg-green-100',
  yellow: 'bg-yellow-100',
  red: 'bg-red-100',
};

export function MetricCard({ title, value, icon, color }: MetricCardProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">{title}</p>
        <div className={`${iconBg[color]} w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0`}>
          {icon}
        </div>
      </div>
      <h3 className={`text-xl sm:text-2xl font-bold ${colorClasses[color]} truncate`}>{value}</h3>
    </div>
  );
}
