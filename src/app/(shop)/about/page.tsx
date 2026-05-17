'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Mail, MessageCircle, Phone, ShieldCheck, Truck } from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import { businessRules, catalogMedia, contactDetails } from '@/data/catalog';

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="container-main" style={{ padding: '42px 16px 64px', maxWidth: 980 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img
            src={catalogMedia.logo}
            alt="Glow Addict by Sayanita"
            style={{ width: 88, height: 88, objectFit: 'contain', margin: '0 auto 14px', borderRadius: 18 }}
          />
          <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, marginBottom: 8 }}>
            Glow Addict by Sayanita
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Authentic premium skincare at a price within reach.</p>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ padding: 28, marginBottom: 20 }}
        >
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 24, fontFamily: 'Outfit', marginBottom: 14 }}>
            <Heart size={22} style={{ color: 'var(--primary)' }} /> Our Story
          </h2>
          <blockquote style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 17, lineHeight: 1.9 }}>
            "As a girl's girl, I realized that many women adore the ritual of self-care, but the high price of authentic products often stands in the way. That's why I created Glow Addict by Sayanita-an opportunity to indulge in genuine, premium skincare at a price within reach.
            <br /><br />
            With each order, I ensure you receive not just authentic products, but also the personalized attention you deserve.
            <br /><br />
            Every woman should feel celebrated, seen, and cherished-because your self-care journey matters."
          </blockquote>
        </motion.section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 26 }}>
          <div className="glass-card" style={{ padding: 18 }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 16, marginBottom: 6 }}>Shipping Policy</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
              <Truck size={14} style={{ display: 'inline', marginRight: 6 }} />
              Free Delivery Above ₹{businessRules.freeDeliveryAbove}
              <br />
              Shipping Charge ₹{businessRules.shippingChargeBelow} Below ₹{businessRules.freeDeliveryAbove}
            </p>
          </div>
          <div className="glass-card" style={{ padding: 18 }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 16, marginBottom: 6 }}>Order Policy</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
              <ShieldCheck size={14} style={{ display: 'inline', marginRight: 6 }} />
              No Return
              <br />
              No Replacement
              <br />
              No COD Available
            </p>
          </div>
          <div className="glass-card" style={{ padding: 18 }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 16, marginBottom: 6 }}>Contact</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
              <Mail size={14} style={{ display: 'inline', marginRight: 6 }} /> {contactDetails.email}
              <br />
              <Phone size={14} style={{ display: 'inline', marginRight: 6 }} /> {contactDetails.phone}
              <br />
              <a href={contactDetails.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Instagram</a>
              {' • '}
              <a href={contactDetails.whatsapp} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                <MessageCircle size={14} style={{ display: 'inline', marginRight: 4 }} /> WhatsApp Support
              </a>
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/products" className="btn-gradient" style={{ display: 'inline-block', textDecoration: 'none', padding: '14px 28px' }}>
            <span>Explore 85+ Products</span>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
