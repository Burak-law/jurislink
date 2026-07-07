export default function Skeleton({ className = "" }) {
  return (
    <div className={`relative overflow-hidden bg-juris-cream/10 rounded-sm ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-juris-cream/10 to-transparent" />
    </div>
  );
}
