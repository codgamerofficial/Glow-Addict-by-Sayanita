import Link from 'next/link';
import React from 'react';

export default function AdminSidebar() {
  return (
    <aside className="w-60 bg-white dark:bg-slate-800 h-screen p-4 border-r">
      <div className="mb-6">
        <Link href="/">
          <img src="/images/logo.png" alt="Glow Addict" className="w-40" />
        </Link>
      </div>
      <nav className="space-y-2">
        <Link href="/admin" className="block p-2 rounded hover:bg-slate-100">Dashboard</Link>
        <Link href="/admin/products" className="block p-2 rounded hover:bg-slate-100">Products</Link>
        <Link href="/admin/media" className="block p-2 rounded hover:bg-slate-100">Media</Link>
        <Link href="/admin/orders" className="block p-2 rounded hover:bg-slate-100">Orders</Link>
        <Link href="/admin/customers" className="block p-2 rounded hover:bg-slate-100">Customers</Link>
        <Link href="/admin/settings" className="block p-2 rounded hover:bg-slate-100">Settings</Link>
      </nav>
    </aside>
  );
}
