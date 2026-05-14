'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Camera, Gift, Mail, MessageCircle, Phone, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { buildWhatsAppMessage, INSTAGRAM_HANDLE, INSTAGRAM_URL, MANUAL_PAYMENT_NOTE, UPI_ID, UPI_QR_URL } from '@/lib/commerce';

const shopLinks = [
  { label: 'FACEWASH', href: '/products?subcategory=facewash' },
  { label: 'SUNSCREEN', href: '/products?subcategory=sunscreen' },
  { label: 'MOISTURIZER', href: '/products?subcategory=moisturizer' },
  { label: 'SERUM', href: '/products?subcategory=serum' },
  { label: 'BODY MIST', href: '/products?subcategory=body-mist' },
  { label: 'FACE SCRUB', href: '/products?subcategory=face-scrub' },
  { label: 'LIP BALM', href: '/products?subcategory=lip-balm' },
  { label: 'LIP GLOSS', href: '/products?subcategory=lip-gloss' },
  { label: 'Face mask', href: '/products?subcategory=face-mask' },
  { label: 'Sheet mask', href: '/products?subcategory=sheet-mask' },
  { label: 'Strobe cream', href: '/products?subcategory=strobe-cream' },
  { label: 'NIGHT CREAM', href: '/products?subcategory=night-cream' },
  { label: 'Body scrub', href: '/products?subcategory=body-scrub' },
  { label: 'Body wash', href: '/products?subcategory=body-wash' },
  { label: 'Under arm roll on', href: '/products?subcategory=under-arm-roll-on' },
  { label: 'Combo', href: '/products?subcategory=combo' },
];

const offerNotes = [
  'Free scrunchies with every order',
  'Order on product availability',
  'Absolutely free delivery above ₹799',
  'Delivery charge ₹45 below ₹799',
  'No COD',
  'No return',
  'Any 2 at 149/- each 89/-',
  'Get a LAKME Peach Milk Moisturiser as a free gift',
  'Shop your favourites before the offer ends',
  'The combo is here!',
];

const supportLinks = [
  { icon: Phone, title: 'Call', value: '+91 86178 97185', href: 'tel:+918617897185' },
  { icon: Mail, title: 'Email', value: 'sayanitapayra@gmail.com', href: 'mailto:sayanitapayra@gmail.com' },
  { icon: Camera, title: 'Instagram', value: INSTAGRAM_HANDLE, href: INSTAGRAM_URL },
  { icon: MessageCircle, title: 'WhatsApp', value: 'Buy on WhatsApp', href: buildWhatsAppMessage('Hi Glow Addict, I want to order products from the store.') },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-main">
        <div className="footer-promise">
          {[
            { icon: ShieldCheck, label: '100% authentic products' },
            { icon: Truck, label: 'Free delivery above ₹799' },
            { icon: Sparkles, label: 'AI beauty matching' },
            { icon: Gift, label: 'Free scrunchies with every order' },
          ].map(({ icon: Icon, label }) => (
            <span key={label}>
              <Icon size={18} /> {label}
            </span>
          ))}
        </div>

        <div className="footer-notes" aria-label="Store offers and delivery rules">
          {offerNotes.map((note) => (
            <span key={note}>{note}</span>
          ))}
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo" aria-label="Glow Addict home">
              <Image src="/images/logo.png" alt="Glow Addict" width={220} height={78} className="footer-logo-image" />
            </Link>
            <p className="footer-founder">By Sayanita</p>
            <p>
              Premium skincare, makeup and bodycare with live offers, combo deals, free-gift drops and quick buying support on WhatsApp and Instagram.
            </p>
            <div className="footer-social">
              {supportLinks.map(({ icon: Icon, href, title, value }) => (
                <a key={title} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} aria-label={title}>
                  <Icon size={19} />
                  <span>{value}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="footer-column">
            <h4>Shop Categories</h4>
            {shopLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="footer-column">
            <h4>Offers & Rules</h4>
            <div className="footer-rules">
              <p>Any 2 at 149/- each 89/-</p>
              <p>Absolutely Delivery FREE on orders above ₹799/- 🎁</p>
              <p>Get a LAKME Peach Milk Moisturiser as a special free gift with your order 💖</p>
              <p>NO COD</p>
              <p>NO RETURN</p>
              <p>Delivery charges - 45/- below 799/-</p>
              <p>All shades are available</p>
              <p>Order on product availability</p>
            </div>
          </div>

          <div className="footer-column footer-payment-column">
            <h4>Buy & Pay</h4>
            <a className="footer-buy-link" href={buildWhatsAppMessage('Hi Glow Addict, I want to place an order.') } target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} /> WhatsApp Buy
            </a>
            <a className="footer-buy-link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              <Camera size={18} /> Insta Buy
            </a>
            <div className="footer-qr-card">
              <img src={UPI_QR_URL} alt="UPI payment QR code" className="footer-qr" loading="lazy" />
              <p>{UPI_ID}</p>
              <small>{MANUAL_PAYMENT_NOTE}</small>
            </div>
            <div className="footer-support-list">
              {supportLinks.map(({ icon: Icon, title, value, href }) => (
                <a key={title} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                  <Icon size={16} />
                  <span>{value}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Glow Addict by Sayanita. Free scrunchies with every order.</p>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .site-footer {
          position: relative;
          overflow: hidden;
          padding: 34px 0 28px;
          color: #fff;
          background:
            radial-gradient(circle at 80% 0%, rgba(245, 31, 123, 0.36), transparent 28%),
            linear-gradient(145deg, #171018, #29142d 56%, #111b13);
        }

        .footer-promise {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 34px;
        }

        .footer-promise span {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 54px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 900;
          text-align: center;
        }

        .footer-notes {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 28px;
        }

        .footer-notes span {
          padding: 10px 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.86);
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 800;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: minmax(260px, 1.4fr) repeat(3, minmax(190px, 1fr));
          gap: 32px;
        }

        .footer-logo {
          text-decoration: none;
        }

        .footer-logo-image {
          width: auto;
          height: 72px;
          object-fit: contain;
        }

        .footer-founder {
          margin: 18px 0 6px;
          color: var(--citrus);
          font-family: var(--font-display);
          font-weight: 900;
        }

        .footer-brand > p:last-of-type {
          max-width: 390px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 14px;
          line-height: 1.7;
        }

        .footer-social {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .footer-social a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 40px;
          padding: 0 12px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
          font-size: 12px;
          text-decoration: none;
          transition: all 0.2s var(--spring);
        }

        .footer-social a:hover {
          color: var(--primary);
          background: #fff;
          transform: translateY(-2px);
        }

        .footer-column h4 {
          margin-bottom: 14px;
          color: #fff;
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .footer-column a {
          display: block;
          width: fit-content;
          padding: 5px 0;
          color: rgba(255, 255, 255, 0.68);
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s var(--spring);
        }

        .footer-column a:hover {
          color: #fff;
          transform: translateX(3px);
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 36px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.56);
          font-size: 13px;
        }

        .footer-bottom div {
          display: flex;
          gap: 16px;
        }

        .footer-bottom a {
          color: inherit;
          text-decoration: none;
        }

        .footer-bottom a:hover {
          color: #fff;
        }

        .footer-rules {
          display: grid;
          gap: 10px;
          color: rgba(255, 255, 255, 0.76);
          font-size: 14px;
          line-height: 1.55;
        }

        .footer-rules p {
          margin: 0;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .footer-rules p:last-child {
          padding-bottom: 0;
          border-bottom: 0;
        }

        .footer-payment-column {
          gap: 10px;
        }

        .footer-buy-link,
        .footer-support-list a {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.86);
          text-decoration: none;
        }

        .footer-buy-link {
          padding: 10px 14px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.08);
          font-size: 13px;
          font-weight: 800;
        }

        .footer-qr-card {
          display: grid;
          gap: 10px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.08);
        }

        .footer-qr {
          width: 100%;
          max-width: 220px;
          justify-self: center;
          border-radius: 18px;
          background: #fff;
        }

        .footer-qr-card p {
          margin: 0;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          word-break: break-all;
        }

        .footer-qr-card small {
          color: rgba(255, 255, 255, 0.64);
          font-size: 12px;
          line-height: 1.55;
        }

        .footer-support-list {
          display: grid;
          gap: 10px;
        }

        .footer-support-list a {
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 13px;
        }

        .footer-support-list a:last-child {
          border-bottom: 0;
        }

        @media (max-width: 900px) {
          .footer-promise,
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .footer-bottom {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </footer>
  );
}
