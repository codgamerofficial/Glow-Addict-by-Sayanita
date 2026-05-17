import React from 'react';
import Link from 'next/link';

export default function AdminTopNav() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-md hover:bg-slate-100">☰</button>
        <div className="text-lg font-semibold">Glow Addict Admin</div>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/admin/products/new" className="btn btn-primary">+ Add Product</Link>
        <div className="w-8 h-8 bg-slate-200 rounded-full" />
      </div>
    </header>
  );
}
