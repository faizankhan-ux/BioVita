import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './lib/toast-context.tsx';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ThemeProvider } from 'next-themes';
import App from './App.tsx';
import './index.css';

// ─── Environment Variable Diagnostics ───────────────────────────────────────
// This block logs which env vars are available at runtime.
// Safe to keep in production — only prints status, never prints actual values.
console.log("🔧 [BioVita] Environment Check:", {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? "✅ SET" : "❌ MISSING",
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? "✅ SET" : "❌ MISSING",
  FIREBASE_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? "✅ SET" : "❌ MISSING",
  FIREBASE_PROJECT: import.meta.env.VITE_FIREBASE_PROJECT_ID ? "✅ SET" : "❌ MISSING",
  GEMINI_KEY: import.meta.env.VITE_GEMINI_API_KEY ? "✅ SET" : "❌ MISSING",
  API_URL: import.meta.env.VITE_API_URL || "❌ MISSING (backend calls will fail)",
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
});
// ─────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <AuthProvider>
          <LanguageProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
