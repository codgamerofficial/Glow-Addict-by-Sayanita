'use client';
import React, { useState, createContext, useContext } from 'react';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';

interface AdminCtx { sidebarOpen: boolean; toggleSidebar: () => void; }
const AdminContext = createContext<AdminCtx>({ sidebarOpen: true, toggleSidebar: () => {} });
export const useAdmin = () => useContext(AdminContext);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <AdminContext.Provider value={{ sidebarOpen, toggleSidebar: () => setSidebarOpen(p => !p) }}>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(p => !p)} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)', marginLeft: sidebarOpen ? '260px' : '72px' }}>
          <AdminTopbar onMenuToggle={() => setSidebarOpen(p => !p)} />
          <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            {children}
          </main>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){
          [data-admin-sidebar]{position:fixed!important;z-index:100;transform:translateX(${sidebarOpen?'0':'-100%'});transition:transform .3s ease}
          [data-admin-main]{margin-left:0!important}
        }
      `}</style>
    </AdminContext.Provider>
  );
}
