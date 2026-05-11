'use client';

import Link from 'next/link';
import { Search, Home, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black px-4 py-12"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card text-center max-w-md space-y-6"
      >
        {/* Glow Addict Logo Reference */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">
            Glow Addict
          </h1>
          <p className="text-muted-foreground">Where beauty meets innovation</p>
        </div>

        {/* 404 Illustration */}
        <div className="flex items-center justify-center space-x-4">
          <Search className="h-10 w-10 text-pink-400" />
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground">404</h2>
            <p className="text-muted-foreground">Page not found</p>
          </div>
          <ArrowRight className="h-10 w-10 text-pink-400" />
        </div>

        {/* Message */}
        <p className="text-muted-foreground">
          It seems the page you're looking for has moved or never existed.
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:space-x-3 w-full max-w-xs">
          <Link
            href="/"
            className="flex-1 btn-gradient hover:btn-gradient-hover text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <Link
            href="/shop"
            className="flex-1 btn-gradient hover:btn-gradient-hover text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}