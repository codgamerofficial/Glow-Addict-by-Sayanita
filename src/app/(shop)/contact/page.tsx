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
      <div className="container-main p-10 px-4 max-w-[900px]">
        <div className="text-center mb-10">
          <h1 className="font-outfit text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-[var(--text-muted)] text-[15px]">We&apos;d love to hear from you</p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          {/* Contact Info */}
          <div>
            <div className="flex flex-col gap-4">
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
                  className="glass-card p-5 flex items-center gap-3.5 no-underline text-inherit"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shrink-0">
                    <Icon size={20} color="white" />
                  </div>
                  <div>
                    <div className="text-[12px] text-[var(--text-muted)] font-medium mb-0.5">{title}</div>
                    <div className="text-sm font-medium">{value}</div>
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
            className="glass-card p-7"
          >
            <h2 className="font-outfit text-lg font-semibold mb-5">Send a Message</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <input
                type="text" required placeholder="Your Name" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-glass text-sm"
              />
              <input
                type="email" required placeholder="Email Address" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-glass text-sm"
              />
              <input
                type="text" required placeholder="Subject" value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="input-glass text-sm"
              />
              <textarea
                required placeholder="Your Message" rows={4} value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="input-glass text-sm resize-y"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={submitting}
                className={`btn-gradient p-3.5 text-[15px] ${submitting ? 'opacity-70' : 'opacity-100'}`}
              >
                <span className="flex items-center justify-center gap-2">
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
