export default function AreaProgressBar({ area, percent }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-juris-text font-bold text-sm">{area}</p>
        <p className="text-juris-text/50 font-bold text-xs">{percent}%</p>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <div
          className="h-full bg-juris-accent rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
