'use client';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Tag } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import { useAuthStore } from '@/features/auth/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/shared/Toast';
import PageTransition from '@/components/shared/PageTransition';
import CartWhatsAppShare from '@/components/cart/CartWhatsAppShare';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, getItemCount } = useCartStore();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const subtotal = getSubtotal();
  const total = getTotal();
  const shipping = subtotal > 499 ? 0 : 49;
  const itemCount = getItemCount();
  const { showToast } = useToast();

  const handleRemove = (productId: string, name: string) => {
    removeItem(productId);
    showToast(`${name} removed from cart`);
  };

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="cart-empty-container">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
          >
            <ShoppingBag className="cart-empty-icon" />
          </motion.div>
          <h2 className="cart-empty-title">Your cart is empty</h2>
          <p className="cart-empty-desc">Add some amazing products to get started!</p>
          <Link href="/products" className="btn-gradient cart-empty-btn">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Start Shopping <ArrowRight size={18} /></span>
          </Link>
        </div>

        <style jsx>{`
          .cart-empty-container {
            display: grid;
            place-items: center;
            gap: clamp(12px, 2vw, 20px);
            min-height: 60vh;
            padding: clamp(40px, 10vw, 80px) clamp(16px, 3vw, 20px);
            text-align: center;
          }

          .cart-empty-icon {
            width: clamp(48px, 12vw, 80px);
            height: clamp(48px, 12vw, 80px);
            color: var(--text-muted);
            margin-bottom: clamp(12px, 2vw, 20px);
          }

          .cart-empty-title {
            font-family: var(--font-display);
            font-size: clamp(24px, 5vw, 32px);
            font-weight: 900;
            margin-bottom: clamp(6px, 1vw, 12px);
          }

          .cart-empty-desc {
            color: var(--text-muted);
            font-size: clamp(14px, 1.1vw, 16px);
            margin-bottom: clamp(16px, 2.5vw, 24px);
            max-width: 420px;
          }

          .cart-empty-btn {
            text-decoration: none;
            padding: clamp(12px, 1.8vw, 16px) clamp(24px, 3vw, 32px);
            font-size: clamp(14px, 1vw, 16px);
          }
        `}</style>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="cart-page-wrapper">
        <h1 className="cart-page-title">
          Shopping Cart <span className="cart-page-count">({itemCount} items)</span>
        </h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items-container">
            <AnimatePresence mode="popLayout">
              {items.map(item => {
                const price = item.product.salePrice || item.product.price;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 200, scale: 0.8 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                    className="cart-item glass-card"
                  >
                    <Link href={`/products/${item.product.slug}`} className="cart-item-image-link">
                      <div className="cart-item-image">
                        <img src={item.product.images[0]} alt={item.product.name} />
                      </div>
                    </Link>
                    <div className="cart-item-content">
                      <div className="cart-item-brand">{item.product.brandName}</div>
                      <Link href={`/products/${item.product.slug}`} className="cart-item-name-link">
                        <h3 className="cart-item-name">{item.product.name}</h3>
                      </Link>
                      <div className="cart-item-controls">
                        <div className="quantity-control">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="qty-btn"
                          >
                            <Minus size={14} />
                          </motion.button>
                          <motion.span
                            key={item.quantity}
                            initial={{ scale: 1.3 }}
                            animate={{ scale: 1 }}
                            className="qty-display"
                          >
                            {item.quantity}
                          </motion.span>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="qty-btn"
                          >
                            <Plus size={14} />
                          </motion.button>
                        </div>
                        <motion.span
                          key={price * item.quantity}
                          initial={{ scale: 1.1, color: 'var(--primary)' }}
                          animate={{ scale: 1, color: 'var(--text-primary)' }}
                          className="item-total"
                        >
                          ₹{(price * item.quantity).toLocaleString()}
                        </motion.span>
                        {item.product.salePrice && (
                          <span className="item-original-price">
                            ₹{(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleRemove(item.product.id, item.product.name)}
                      className="cart-remove-btn"
                      aria-label="Remove from cart"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="cart-summary glass-card"
          >
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-rows">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className={`summary-value ${shipping === 0 ? 'summary-free' : ''}`}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <div className="shipping-hint">
                  <p>
                    <Truck size={12} /> Add ₹{499 - subtotal} more for free shipping
                  </p>
                </div>
              )}
              <div className="summary-total">
                <span>Total</span>
                <motion.span
                  key={total}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="gradient-text"
                >
                  ₹{total.toLocaleString()}
                </motion.span>
              </div>
            </div>
            {/* Coupon */}
            <div className="coupon-section">
              <input placeholder="Coupon code" className="input-glass coupon-input" />
              <motion.button whileTap={{ scale: 0.95 }} className="btn-outline coupon-btn">
                <Tag size={14} /> Apply
              </motion.button>
            </div>
            {isInitialized && isAuthenticated ? (
              <Link href="/checkout" className="btn-gradient checkout-btn">
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <Link href="/login?redirect=/checkout" className="btn-gradient checkout-btn">
                <span>Sign in to Checkout</span>
                <ArrowRight size={18} />
              </Link>
            )}
            <div className="delivery-info">
              <Truck size={14} />
              <span>Estimated delivery: 3-5 business days</span>
            </div>
          </motion.div>

          {/* WhatsApp Order Button */}
          <CartWhatsAppShare />
        </div>

        <style jsx>{`
          .cart-page-wrapper {
            max-width: var(--container-2xl);
            margin: 0 auto;
            padding: clamp(16px, 3vw, 28px);
          }

          .cart-page-title {
            font-family: var(--font-display);
            font-size: clamp(28px, 5vw, 36px);
            font-weight: 900;
            margin-bottom: clamp(16px, 2.5vw, 28px);
            letter-spacing: -0.5px;
          }

          .cart-page-count {
            font-size: clamp(16px, 2vw, 20px);
            color: var(--text-muted);
            font-weight: 500;
          }

          .cart-layout {
            display: grid;
            grid-template-columns: 1fr;
            gap: clamp(16px, 2.5vw, 24px);
          }

          @media (min-width: 768px) {
            .cart-layout {
              grid-template-columns: 1fr 380px;
            }
          }

          .cart-items-container {
            display: flex;
            flex-direction: column;
            gap: clamp(10px, 1.5vw, 14px);
          }

          .cart-item {
            display: grid;
            grid-template-columns: clamp(70px, 15vw, 90px) 1fr clamp(32px, 6vw, 44px);
            gap: clamp(12px, 2vw, 16px);
            padding: clamp(12px, 2vw, 16px);
            align-items: start;
          }

          @media (max-width: 374px) {
            .cart-item {
              grid-template-columns: clamp(60px, 13vw, 70px) 1fr 32px;
            }
          }

          .cart-item-image-link {
            text-decoration: none;
          }

          .cart-item-image {
            width: 100%;
            aspect-ratio: 0.9;
            border-radius: clamp(10px, 1.5vw, 14px);
            overflow: hidden;
            flex-shrink: 0;
            background: var(--bg-ghost);
          }

          .cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .cart-item-content {
            display: flex;
            flex-direction: column;
            gap: clamp(6px, 1vw, 10px);
            min-width: 0;
          }

          .cart-item-brand {
            font-size: clamp(10px, 0.85vw, 12px);
            font-weight: 900;
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }

          .cart-item-name-link {
            text-decoration: none;
            color: inherit;
          }

          .cart-item-name {
            font-size: clamp(13px, 1vw, 15px);
            font-weight: 600;
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .cart-item-controls {
            display: flex;
            align-items: center;
            gap: clamp(8px, 1.5vw, 12px);
            flex-wrap: wrap;
          }

          .quantity-control {
            display: flex;
            align-items: center;
            border: 1px solid var(--border-glass);
            border-radius: clamp(8px, 1.2vw, 10px);
            overflow: hidden;
          }

          .qty-btn {
            background: var(--bg-glass);
            border: none;
            padding: clamp(6px, 1vw, 8px) clamp(8px, 1.2vw, 10px);
            cursor: pointer;
            color: var(--text-primary);
            transition: all 0.2s var(--spring);
            display: grid;
            place-items: center;
          }

          @media (hover: hover) {
            .qty-btn:hover {
              background: var(--bg-base);
            }
          }

          .qty-display {
            padding: clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 12px);
            font-size: clamp(12px, 1vw, 14px);
            font-weight: 600;
          }

          .item-total {
            font-family: var(--font-display);
            font-size: clamp(14px, 1.2vw, 16px);
            font-weight: 700;
          }

          .item-original-price {
            font-size: clamp(11px, 0.9vw, 13px);
            color: var(--text-muted);
            text-decoration: line-through;
          }

          .cart-remove-btn {
            width: clamp(32px, 6vw, 40px);
            height: clamp(32px, 6vw, 40px);
            display: grid;
            place-items: center;
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            border-radius: clamp(8px, 1.2vw, 10px);
            transition: all 0.22s var(--spring);
          }

          @media (hover: hover) {
            .cart-remove-btn:hover {
              color: var(--error);
              background: rgba(239, 68, 68, 0.1);
            }
          }

          .cart-summary {
            padding: clamp(16px, 2vw, 24px);
            height: fit-content;
            position: sticky;
            top: clamp(80px, 10vw, 120px);
            display: flex;
            flex-direction: column;
            gap: clamp(12px, 1.8vw, 16px);
          }

          .summary-title {
            font-family: var(--font-display);
            font-size: clamp(16px, 1.2vw, 18px);
            font-weight: 900;
            margin: 0 0 clamp(12px, 1.8vw, 16px) 0;
            letter-spacing: -0.3px;
          }

          .summary-rows {
            display: flex;
            flex-direction: column;
            gap: clamp(10px, 1.5vw, 12px);
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            font-size: clamp(12px, 1vw, 14px);
          }

          .summary-label {
            color: var(--text-secondary);
            font-weight: 500;
          }

          .summary-value {
            font-weight: 600;
            text-align: right;
          }

          .summary-free {
            color: var(--success);
            font-weight: 700;
          }

          .shipping-hint {
            background: rgba(233, 30, 140, 0.06);
            border-radius: clamp(8px, 1.2vw, 10px);
            padding: clamp(8px, 1.2vw, 10px) clamp(10px, 1.5vw, 12px);
          }

          .shipping-hint p {
            margin: 0;
            font-size: clamp(11px, 0.9vw, 12px);
            color: var(--text-muted);
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .summary-total {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid var(--border-glass);
            padding-top: clamp(10px, 1.5vw, 12px);
            font-size: clamp(16px, 1.3vw, 18px);
            font-family: var(--font-display);
            font-weight: 900;
          }

          .coupon-section {
            display: flex;
            gap: clamp(8px, 1.2vw, 10px);
            margin: clamp(12px, 1.8vw, 16px) 0;
          }

          .coupon-input {
            flex: 1;
            padding: clamp(10px, 1.5vw, 12px) clamp(12px, 1.8vw, 14px);
            font-size: clamp(12px, 1vw, 14px);
            border-radius: clamp(8px, 1.2vw, 10px);
          }

          .coupon-btn {
            padding: clamp(10px, 1.5vw, 12px) clamp(12px, 1.8vw, 14px);
            font-size: clamp(12px, 1vw, 14px);
            flex-shrink: 0;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .checkout-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: clamp(8px, 1.2vw, 10px);
            width: 100%;
            padding: clamp(12px, 1.8vw, 14px);
            font-size: clamp(13px, 1vw, 15px);
            text-decoration: none;
            font-family: var(--font-display);
            font-weight: 700;
          }

          .delivery-info {
            display: flex;
            align-items: center;
            gap: clamp(6px, 1vw, 8px);
            margin-top: clamp(8px, 1.2vw, 10px);
            justify-content: center;
            font-size: clamp(11px, 0.9vw, 12px);
            color: var(--text-muted);
          }

          .delivery-info svg {
            color: var(--success);
            flex-shrink: 0;
          }
        `}</style>
      </div>
    </PageTransition>
  );
}
