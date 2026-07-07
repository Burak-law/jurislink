"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SearchBar({
  defaultValue = "",
  autoFocus = false,
  showHint = true,
  actionPath = "/search",
}) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.results || []);
          setIsDropdownOpen(true);
        }
      } catch (error) {
        console.error("Search fetch error", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsDropdownOpen(false);
    router.push(`${actionPath}?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="mt-10 max-w-xl mx-auto relative" ref={dropdownRef}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch rounded-lg overflow-hidden shadow-sm border border-slate-200 relative z-20"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsDropdownOpen(true);
          }}
          placeholder="Davaları, terimleri veya doktrinleri arayın…"
          autoFocus={autoFocus}
          className="flex-1 px-6 py-4 bg-slate-50 text-juris-text placeholder-juris-text/40 font-medium font-body focus:outline-none focus:bg-white focus:ring-2 focus:ring-juris-accent transition-colors"
        />
        <button
          type="submit"
          className="bg-juris-accent text-white font-bold px-10 py-4 hover:bg-juris-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-juris-accent relative"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          ) : "Ara"}
        </button>
      </form>
      
      {/* Autocomplete Dropdown */}
      {isDropdownOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-sm shadow-xl border border-slate-200 z-50 text-left overflow-hidden">
          <ul className="max-h-80 overflow-y-auto">
            {suggestions.map((item) => (
              <li key={item.id} className="border-b border-slate-100 last:border-0">
                <Link
                  href={item.href}
                  className="block px-5 py-4 hover:bg-slate-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-heading font-bold text-juris-text">{item.title}</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm bg-juris-accent/10 text-juris-accent flex-shrink-0">
                      {item.type === "yargitay" ? "Yargıtay" : item.type === "vocabulary" ? "Sözlük" : "Pratik"}
                    </span>
                  </div>
                  <p className="text-sm text-juris-text/60 mt-1">{item.snippet}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showHint && (
        <p className="text-juris-text/40 font-medium text-xs mt-3">
          Örnek: &quot;Kıdem Tazminatı&quot;, &quot;İş Sözleşmesi&quot; veya &quot;Mobbing&quot;
        </p>
      )}
    </div>
  );
}
