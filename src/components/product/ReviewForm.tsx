'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';

interface ReviewFormProps {
  productId: string;
  slug: string;
  onReviewSubmitted?: () => void;
}

type SkinType = 'Oily' | 'Dry' | 'Combination' | 'Sensitive' | 'Normal';

const SKIN_TYPES: SkinType[] = ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'];

export default function ReviewForm({ productId, slug, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [skinType, setSkinType] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const [touched, setTouched] = useState<{
    rating: boolean;
    title: boolean;
    body: boolean;
  }>({
    rating: false,
    title: false,
    body: false,
  });

  const validate = (): boolean => {
    const errors: string[] = [];

    if (rating === 0) {
      errors.push('Rating is required');
    }
    if (!title || title.trim().length < 3) {
      errors.push('Title must be at least 3 characters');
    }
    if (!body || body.trim().length < 50) {
      errors.push('Review must be at least 50 characters');
    }

    if (errors.length > 0) {
      setError(errors.join('. '));
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/products/${slug}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          title: title.trim(),
          body: body.trim(),
          skinType: skinType || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit review');
      }

      setSuccess(true);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      // Reset form after a brief delay to show success
      setTimeout(() => {
        setRating(0);
        setTitle('');
        setBody('');
        setSkinType('');
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="glass-card p-6 space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <h3 className="text-lg font-bold font-outfit text-[var(--text-primary)]">
        Write a Review
      </h3>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="bg-[rgba(239,68,68,0.1)] border border-[var(--error)] border-opacity-50 rounded-lg p-3 text-sm text-[var(--error)]"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Alert */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="bg-[rgba(16,185,129,0.1)] border border-[var(--success)] border-opacity-50 rounded-lg p-3 text-sm text-[var(--success)] flex items-center gap-2"
          >
            <CheckCircle size={18} />
            <span>Review submitted successfully! Thank you.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Star Rating */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          Rating <span className="text-[var(--error)]">*</span>
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              onClick={() => {
                setRating(star);
                setTouched((prev) => ({ ...prev, rating: true }));
              }}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="focus:outline-none"
              aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
            >
              <Star
                size={28}
                fill={star <= rating ? 'var(--accent-gold)' : 'none'}
                color={star <= rating ? 'var(--accent-gold)' : 'var(--text-muted)'}
                strokeWidth={star <= rating ? 0 : 1.5}
              />
            </motion.button>
          ))}
          {touched.rating && rating === 0 && (
            <span className="text-xs text-[var(--error)]">Required</span>
          )}
        </div>
      </div>

      {/* Title Input */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          Title <span className="text-[var(--error)]">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTouched((prev) => ({ ...prev, title: true }));
          }}
          onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
          className="input-glass"
          placeholder="Summarize your review in a few words"
          maxLength={100}
          required
        />
        {touched.title && title.trim().length > 0 && title.trim().length < 3 && (
          <p className="text-xs text-[var(--error)]">
            Title must be at least 3 characters ({title.trim().length}/100)
          </p>
        )}
        {touched.title && title.trim().length === 0 && (
          <p className="text-xs text-[var(--error)]">Title is required</p>
        )}
      </div>

      {/* Review Body */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          Review <span className="text-[var(--error)]">*</span>
        </label>
        <textarea
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            setTouched((prev) => ({ ...prev, body: true }));
          }}
          onBlur={() => setTouched((prev) => ({ ...prev, body: true }))}
          className="input-glass min-h-[120px] resize-vertical"
          placeholder="Share your experience with this product..."
          rows={4}
          required
        />
        {touched.body && body.trim().length > 0 && body.trim().length < 50 && (
          <p className="text-xs text-[var(--error)]">
            {`Review must be at least 50 characters (${body.trim().length}/50)`}
          </p>
        )}
        {touched.body && body.trim().length === 0 && (
          <p className="text-xs text-[var(--error)]">Review is required</p>
        )}
        {body.length > 0 && (
          <p className="text-xs text-[var(--text-muted)] text-right">{body.length} characters</p>
        )}
      </div>

      {/* Skin Type Dropdown */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Skin Type</label>
        <select
          value={skinType}
          onChange={(e) => setSkinType(e.target.value)}
          className="input-glass appearance-none cursor-pointer bg-[var(--bg-surface)]"
        >
          <option value="" disabled>
            Select your skin type (optional)
          </option>
          {SKIN_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={submitting}
        whileTap={{ scale: submitting ? 1 : 0.96 }}
        whileHover={{ scale: submitting ? 1 : 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={`
          w-full btn-gradient p-3 text-sm font-semibold flex items-center justify-center gap-2
          ${submitting ? 'opacity-75 cursor-not-allowed' : ''}
        `}
      >
        {submitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <CheckCircle size={16} className="opacity-50" />
            </motion.div>
            <span>Submitting...</span>
          </>
        ) : success ? (
          <>
            <CheckCircle size={16} />
            <span>Submitted!</span>
          </>
        ) : (
          <>
            <Star size={16} fill="white" color="white" />
            <span>Post Review</span>
          </>
        )}
      </motion.button>
    </motion.form>
  );
}