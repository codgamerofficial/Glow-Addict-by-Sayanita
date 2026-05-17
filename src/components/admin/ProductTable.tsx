"use client";
import React, { useMemo, useState, useEffect } from 'react';
import generated from '../../data/generated-catalog.json';

export default function ProductTable() {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    setProducts(generated.products || []);
  }, []);

  const cols = useMemo(() => [
    { key: 'image', label: 'Image' },
    { key: 'title', label: 'Name' },
    { key: 'brand', label: 'Brand' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    { key: 'stock', label: 'Stock' },
    { key: 'actions', label: 'Actions' },
  ], []);

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input placeholder="Search products" className="border rounded px-3 py-1" />
          <button className="px-3 py-1 bg-indigo-600 text-white rounded">Search</button>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded">Import CSV</button>
          <button className="px-3 py-1 border rounded">Export CSV</button>
        </div>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            {cols.map(c => <th key={c.key} className="p-3 border-b">{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="hover:bg-slate-50">
              <td className="p-3 border-b"><img src={p.image || (p.images && p.images[0]) || '/images/logo.png'} alt={p.title} className="w-14 h-14 object-cover rounded"/></td>
              <td className="p-3 border-b">{p.title}</td>
              <td className="p-3 border-b">{p.brand}</td>
              <td className="p-3 border-b">{p.category}</td>
              <td className="p-3 border-b">{p.price || p.offerPrice || p.mrp || '—'}</td>
              <td className="p-3 border-b">{p.stock ?? p.stockQuantity ?? p.stock || '—'}</td>
              <td className="p-3 border-b">
                <a href={`/admin/products/${p.id}`} className="text-indigo-600">Edit</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
