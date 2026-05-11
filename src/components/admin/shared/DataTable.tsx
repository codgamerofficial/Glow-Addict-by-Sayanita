'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  pageSize?: number;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  bulkActions?: { label: string; onClick: (ids: string[]) => void }[];
  getId?: (item: T) => string;
}

export function DataTable<T extends Record<string, unknown>>({ data, columns, searchPlaceholder = 'Search...', pageSize = 10, onRowClick, actions, getId = (item) => item.id as string }: Props<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = data.filter(item =>
    Object.values(item).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  const sorted = sortKey ? [...filtered].sort((a, b) => {
    const va = a[sortKey], vb = b[sortKey];
    const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
    return sortDir === 'asc' ? cmp : -cmp;
  }) : filtered;

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);
  const allSelected = paged.length > 0 && paged.every(item => selectedIds.has(getId(item)));

  const toggleAll = () => {
    const newSet = new Set(selectedIds);
    if (allSelected) paged.forEach(item => newSet.delete(getId(item)));
    else paged.forEach(item => newSet.add(getId(item)));
    setSelectedIds(newSet);
  };

  const toggleOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const cellStyle: React.CSSProperties = { padding: '12px 16px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.04)' };

  return (
    <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 14px 30px rgba(0,0,0,0.2)' }}>
      {/* Search bar */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.13)', borderRadius: 12, padding: '0 12px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} placeholder={searchPlaceholder} style={{ flex: 1, padding: '9px 0', background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13 }} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{filtered.length} results</div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <th style={{ ...cellStyle, width: 40 }}>
                <input aria-label="Select all rows" type="checkbox" checked={allSelected} onChange={toggleAll} style={{ accentColor: '#E91E8C' }} />
              </th>
              {columns.map(col => (
                <th key={col.key} onClick={() => col.sortable && handleSort(col.key)} style={{
                  ...cellStyle, textAlign: 'left', fontWeight: 600, fontSize: 11, textTransform: 'uppercase',
                  letterSpacing: '0.06em', color: 'var(--text-muted)', cursor: col.sortable ? 'pointer' : 'default',
                  width: col.width, userSelect: 'none',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {col.sortable && sortKey === col.key && <ChevronDown size={12} style={{ transform: sortDir === 'desc' ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }} />}
                  </span>
                </th>
              ))}
              {actions && <th style={{ ...cellStyle, width: 80, textAlign: 'right', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paged.map(item => {
              const id = getId(item);
              return (
                <tr key={id} onClick={() => onRowClick?.(item)} style={{ cursor: onRowClick ? 'pointer' : 'default', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={cellStyle} onClick={e => e.stopPropagation()}>
                    <input aria-label="Select row" type="checkbox" checked={selectedIds.has(id)} onChange={() => toggleOne(id)} style={{ accentColor: '#E91E8C' }} />
                  </td>
                  {columns.map(col => (
                    <td key={col.key} style={{ ...cellStyle, color: 'var(--text-primary)' }}>
                      {col.render ? col.render(item) : String(item[col.key] ?? '')}
                    </td>
                  ))}
                  {actions && <td style={{ ...cellStyle, textAlign: 'right' }} onClick={e => e.stopPropagation()}>{actions(item)}</td>}
                </tr>
              );
            })}
            {paged.length === 0 && (
              <tr><td colSpan={columns.length + 2} style={{ ...cellStyle, textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No results found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button aria-label="Previous page" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{
            width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)',
            color: page === 0 ? 'var(--text-muted)' : 'var(--text-primary)', cursor: page === 0 ? 'not-allowed' : 'pointer',
          }}>
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
            <button key={i} onClick={() => setPage(i)} style={{
              width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: page === i ? 'linear-gradient(135deg, #E91E8C, #7C3AED)' : 'rgba(255,255,255,0.14)',
              border: page === i ? 'none' : '1px solid rgba(255,255,255,0.22)',
              color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: page === i ? 600 : 400,
            }}>
              {i + 1}
            </button>
          ))}
          <button aria-label="Next page" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} style={{
            width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)',
            color: page >= totalPages - 1 ? 'var(--text-muted)' : 'var(--text-primary)', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
          }}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
