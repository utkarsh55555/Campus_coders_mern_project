import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-lg font-bold text-white">
            Expense<span className="aurora-text">Flow</span>
          </p>
          <p className="mt-1 text-sm text-white/40">Elegant finance for modern life.</p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-white/50">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#demo" className="hover:text-white">Product</a>
          <Link to="/login" className="hover:text-white">Sign in</Link>
          <Link to="/register" className="hover:text-white">Register</Link>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-4 text-xs text-white/30 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} ExpenseFlow. Crafted for clarity.
      </p>
    </footer>
  );
}
