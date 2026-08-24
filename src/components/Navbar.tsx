"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";

const links = [
  ["Cara kerja", "#cara-kerja"],
  ["Preset film", "#preset-film"],
  ["Harga", "#harga"],
  ["FAQ", "#faq"],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll(); window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "bg-paper/90 backdrop-blur-xl border-b border-line shadow-sm" : "bg-transparent"}`}>
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Satu Kenangan beranda"><BrandLogo compact /></Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => <a key={href} href={href} className="font-ui text-sm font-semibold text-ink/65 transition hover:text-terracotta">{label}</a>)}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="rounded-full px-4 py-2.5 font-ui text-sm font-semibold text-ink/70 transition hover:bg-sand/60">Masuk</Link>
          <Link href="/create" className="group flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-ui text-sm font-bold text-paper transition hover:bg-terracotta">Buat album <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></Link>
        </div>
        <button onClick={() => setOpen(!open)} className="rounded-xl border border-line bg-paper p-2.5 md:hidden" aria-label="Buka menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="mx-4 mb-4 rounded-2xl border border-line bg-paper p-5 shadow-xl md:hidden"><div className="flex flex-col gap-4">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="font-ui font-semibold text-ink">{label}</a>)}<div className="flex gap-3 border-t border-line pt-4"><Link href="/login" className="flex-1 rounded-full border border-line py-3 text-center font-ui font-semibold">Masuk</Link><Link href="/create" className="flex-1 rounded-full bg-ink py-3 text-center font-ui font-bold text-paper">Mulai</Link></div></div></div>}
    </header>
  );
}
