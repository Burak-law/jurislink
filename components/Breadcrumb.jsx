import Link from "next/link";

export default function Breadcrumb({ items }) {
  return (
    <nav className="text-xs text-juris-cream/40 mb-6">
      {items.map((item, i) => (
        <span key={i}>
          {item.href ? (
            <Link href={item.href} className="hover:text-juris-cream/70 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-juris-cream/60">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  );
}
