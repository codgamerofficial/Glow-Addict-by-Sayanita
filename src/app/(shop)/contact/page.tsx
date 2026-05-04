'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/shared/Toast';
import PageTransition from '@/components/shared/PageTransition';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      showToast('Message sent! We\'ll get back to you within 24 hours. 💕');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <PageTransition>
      <div className="container-main" style={{ padding: '40px 16px', maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Contact Us</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>We&apos;d love to hear from you</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Contact Info */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: Mail, title: 'Email', value: 'support@glowaddict.in', href: 'mailto:support@glowaddict.in' },
                { icon: Phone, title: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                { icon: MapPin, title: 'Location', value: 'India', href: '#' },
                { icon: Clock, title: 'Business Hours', value: 'Mon-Sat, 10 AM – 7 PM IST', href: '#' },
              ].map(({ icon: Icon, title, value, href }, i) => (
                <motion.a
                  key={title}
                  href={href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card"
                  style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={20} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2px' }}>{title}</div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{value}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
            style={{ padding: '28px' }}
          >
            <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Send a Message</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text" required placeholder="Your Name" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-glass" style={{ fontSize: '14px' }}
              />
              <input
                type="email" required placeholder="Email Address" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-glass" style={{ fontSize: '14px' }}
              />
              <input
                type="text" required placeholder="Subject" value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="input-glass" style={{ fontSize: '14px' }}
              />
              <textarea
                required placeholder="Your Message" rows={4} value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="input-glass" style={{ fontSize: '14px', resize: 'vertical' }}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={submitting}
                className="btn-gradient"
                style={{ padding: '14px', fontSize: '15px', opacity: submitting ? 0.7 : 1 }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Send size={16} /> {submitting ? 'Sending...' : 'Send Message'}
                </span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
