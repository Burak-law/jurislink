export default function ActivityFeed({ activity }) {
  return (
    <ul className="flex flex-col">
      {activity.map((item, i) => (
        <li key={item.id} className="relative pl-6 pb-6 last:pb-0">
          {i < activity.length - 1 && (
            <span className="absolute left-[3px] top-3 bottom-0 w-px bg-slate-200" />
          )}
          <span className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-juris-accent shadow-sm" />
          <p className="text-juris-text text-sm">
            <span className="font-bold">{item.action}</span>{" "}
            <span className="text-juris-text/70">— {item.target}</span>
            {item.result && (
              <span className="text-juris-text/50 font-medium"> ({item.result})</span>
            )}
          </p>
          <p className="text-juris-text/40 font-bold text-xs mt-0.5">{item.date}</p>
        </li>
      ))}
    </ul>
  );
}
