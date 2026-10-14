"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, UserCircle, LogOut, LoaderCircle } from "lucide-react";
import BrandLogo from "./BrandLogo";

const links = [["Cara kerja", "#cara-kerja"], ["Preset film", "#preset-film"], ["Harga", "#harga"], ["FAQ", "#faq"]];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => { if (active) setUser(data.user ?? null); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setAuthLoading(false); });
    return () => { active = false; };
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setAccountOpen(false);
    window.location.href = "/";
  }

  const authAction = authLoading ? <LoaderCircle className="h-5 w-5 animate-spin text-ink/40" /> : user ? (
    <div className="relative">
      <button onClick={() => setAccountOpen(!accountOpen)} className="flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 font-ui text-sm font-semibold">
        <UserCircle className="h-5 w-5 text-terracotta" />
        <span className="max-w-[170px] truncate">{user.email}</span>
      </button>
      {accountOpen && <div className="absolute right-0 top-12 w-40 rounded-xl border border-line bg-paper p-2 shadow-lg"><button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"><LogOut className="h-4 w-4" /> Keluar</button></div>}
    </div>
  ) : <Link href="/login" className="rounded-full px-4 py-2.5 font-ui text-sm font-semibold text-ink/70 transition hover:bg-sand/60">Masuk</Link>;

  return <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "bg-paper/90 backdrop-blur-xl border-b border-line shadow-sm" : "bg-transparent"}`}>
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
      <Link href="/" aria-label="Satu Kenangan beranda"><BrandLogo compact /></Link>
      <nav className="hidden items-center gap-8 md:flex">{links.map(([label, href]) => <a key={href} href={href} className="font-ui text-sm font-semibold text-ink/65 transition hover:text-terracotta">{label}</a>)}</nav>
      <div className="hidden items-center gap-3 md:flex">{authAction}<Link href="/create" className="group flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-ui text-sm font-bold text-paper transition hover:bg-terracotta">Buat album <ArrowRight className="h-4 w-4" /></Link></div>
      <button onClick={() => setOpen(!open)} className="rounded-xl border border-line bg-paper p-2.5 md:hidden" aria-label="Buka menu">{open ? <X /> : <Menu />}</button>
    </div>
    {open && <div className="mx-4 mb-4 rounded-2xl border border-line bg-paper p-5 shadow-xl md:hidden"><div className="flex flex-col gap-4">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="font-ui font-semibold text-ink">{label}</a>)}<div className="flex gap-3 border-t border-line pt-4">{user ? <button onClick={logout} className="flex-1 rounded-full border border-line py-3 font-ui font-semibold">Keluar</button> : <Link href="/login" className="flex-1 rounded-full border border-line py-3 text-center font-ui font-semibold">Masuk</Link>}<Link href="/create" className="flex-1 rounded-full bg-ink py-3 text-center font-ui font-bold text-paper">Mulai</Link></div></div></div>}
  </header>;
}
