interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'purple' | 'blue' | 'green' | 'yellow' | 'red';
}

const colorClasses = {
  purple: 'text-purple-200',
  blue: 'text-blue-200',
  green: 'text-green-200',
  yellow: 'text-yellow-200',
  red: 'text-red-200',
};

const iconBg = {
  purple: 'bg-purple-500/40',
  blue: 'bg-blue-500/40',
  green: 'bg-green-500/40',
  yellow: 'bg-yellow-500/40',
  red: 'bg-red-500/40',
};

export function MetricCard({ title, value, icon, color }: MetricCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-3 flex flex-col gap-2 text-white">
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm font-semibold truncate drop-shadow">{title}</p>
        <div className={`${iconBg[color]} w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 text-white shadow`}> 
          {icon}
        </div>
      </div>
      <h3 className={`text-xl sm:text-2xl font-bold ${colorClasses[color]} truncate drop-shadow`}>{value}</h3>
    </div>
  );
}
