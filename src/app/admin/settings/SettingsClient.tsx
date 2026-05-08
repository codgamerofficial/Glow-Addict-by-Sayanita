'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Key, Database, Globe, ShieldAlert } from 'lucide-react';

import { AuditLog } from '@/types/admin';
import { updateStoreSettings } from '@/actions/admin';
import { useState } from 'react';

export default function SettingsClient({ initialLogs, initialSettings }: { initialLogs?: AuditLog[], initialSettings?: Record<string, string | boolean | unknown> }) {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(initialSettings || {
    store_name: 'Glow Addict',
    contact_email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@glowaddict.com',
    contact_phone: '+91 98765 43210',
    currency: 'INR',
    maintenance_mode: false
  });
  const [isSaving, setIsSaving] = useState(false);

  const sections = [
    { id: 'general', icon: <Globe size={18} />, title: 'General', desc: 'Store details, currency, region' },
    { id: 'roles', icon: <Users size={18} />, title: 'Roles & Permissions', desc: 'Manage admin access levels' },
    { id: 'security', icon: <Shield size={18} />, title: 'Security', desc: '2FA, session settings' },
    { id: 'api', icon: <Key size={18} />, title: 'API Keys', desc: 'Manage external integrations' },
    { id: 'database', icon: <Database size={18} />, title: 'Database & Backups', desc: 'Manual backups, cleanup' },
  ];

  const logs = initialLogs || [];

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await updateStoreSettings(settings);
      alert('Settings saved successfully!');
    } catch {
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>System configuration and access control</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 24 }}>
        {/* Settings Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sections.map((s) => (
            <button key={s.id} 
              onClick={() => setActiveTab(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', textAlign: 'left',
                background: activeTab === s.id ? 'linear-gradient(135deg, rgba(233,30,140,0.1), rgba(124,58,237,0.05))' : 'transparent',
                color: activeTab === s.id ? '#F5B7C5' : 'var(--text-secondary)',
                transition: 'background 0.2s',
              }}>
              <div style={{ color: activeTab === s.id ? '#E91E8C' : 'var(--text-muted)' }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: activeTab === s.id ? 'var(--text-primary)' : 'inherit' }}>{s.title}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{s.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div>
          {activeTab === 'general' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 600, marginBottom: 20 }}>General Store Settings</h3>
              <div style={{ display: 'grid', gap: 16, maxWidth: 500 }}>
                <div>
                  <label htmlFor="store_name" style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Store Name</label>
                  <input id="store_name" className="input-glass" value={settings.store_name as string} onChange={e => setSettings({...settings, store_name: e.target.value})} />
                </div>
                <div>
                  <label htmlFor="contact_email" style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Contact Email</label>
                  <input id="contact_email" className="input-glass" value={settings.contact_email as string} onChange={e => setSettings({...settings, contact_email: e.target.value})} />
                </div>
                <div>
                  <label htmlFor="contact_phone" style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Contact Phone</label>
                  <input id="contact_phone" className="input-glass" value={settings.contact_phone as string} onChange={e => setSettings({...settings, contact_phone: e.target.value})} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  <input id="maintenance_mode" type="checkbox" checked={settings.maintenance_mode as boolean} onChange={e => setSettings({...settings, maintenance_mode: e.target.checked})} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                  <label htmlFor="maintenance_mode" style={{ fontSize: 13 }}>Maintenance Mode</label>
                </div>
                <button 
                  disabled={isSaving}
                  onClick={handleSaveSettings}
                  className="btn-gradient" 
                  style={{ marginTop: 8, padding: '10px 20px', width: 'fit-content' }}>
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'roles' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><ShieldAlert size={18} style={{ color: '#F59E0B' }} /> Role Management</h3>
                <button style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' }}>Add Role</button>
              </div>
              
              <div style={{ display: 'grid', gap: 12 }}>
                {[
                  { name: 'Super Admin', users: 2, desc: 'Full system access', color: '#EF4444' },
                  { name: 'Staff Admin', users: 4, desc: 'Can manage products, orders, customers', color: '#3B82F6' },
                  { name: 'Inventory Manager', users: 3, desc: 'Stock levels and warehouse only', color: '#10B981' },
                  { name: 'Customer Support', users: 8, desc: 'View orders, manage tickets', color: '#8B5CF6' }
                ].map(role => (
                  <div key={role.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: role.color, boxShadow: `0 0 10px ${role.color}` }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{role.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{role.desc}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{role.users} active users</div>
                      <button style={{ padding: '6px 12px', borderRadius: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer' }}>Edit Permissions</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'database' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Database Management</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Advanced controls for system data. Use with caution.</p>
              
              <div style={{ padding: 16, borderRadius: 12, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#EF4444', marginBottom: 4 }}>Reset Database to Defaults</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>This will clear current content and reload seed data.</div>
                </div>
                <button 
                  onClick={async () => {
                    if (!confirm('CRITICAL: This will reset all products and orders to seed data. Proceed?')) return;
                    setIsSaving(true);
                    try {
                      const res = await fetch('/api/admin/seed', { method: 'POST' });
                      const data = await res.json();
                      if (data.success) alert('Database successfully reset! 🚀');
                      else alert('Reset failed: ' + data.error);
                    } catch {
                      alert('Network error during reset');
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  style={{ padding: '10px 18px', borderRadius: 10, background: '#EF4444', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                  Reset & Seed DB
                </button>
              </div>
            </motion.div>
          )}

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Recent Audit Logs</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {logs.map(log => (
                <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>{(log.adminName || 'U').charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, marginBottom: 2 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.adminName || 'System'}</span>
                      <span style={{ color: 'var(--text-muted)' }}> {log.action.replace('_', ' ')} {log.entity} </span>
                      {log.entityId && <span style={{ color: 'var(--text-primary)', fontSize: 11, opacity: 0.8 }}> ({log.entityId})</span>}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
              {logs.length === 0 && <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>No audit logs available.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
