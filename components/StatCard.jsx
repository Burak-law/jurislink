import TiltCard from "./TiltCard";

export default function StatCard({ value, label }) {
  return (
    <TiltCard maxTilt={5}>
      <div className="bg-slate-50 text-juris-text rounded-xl border border-slate-200 border-t-4 border-t-juris-accent p-6 text-center shadow-sm">
        <p className="font-heading font-bold text-3xl md:text-4xl mb-1 text-juris-accent">{value}</p>
        <p className="text-juris-text/60 font-bold text-xs uppercase tracking-wide">{label}</p>
      </div>
    </TiltCard>
  );
}
