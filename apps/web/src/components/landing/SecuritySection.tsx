'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  FileCheck, 
  Server, 
  EyeOff,
  CheckCircle2
} from 'lucide-react';

const SECURITY_ITEMS = [
  {
    icon: Lock,
    title: 'HttpOnly Secure Cookies',
    desc: 'Session tokens stored in encrypted HttpOnly, SameSite=Lax cookies, completely immune to client-side XSS extraction.',
  },
  {
    icon: Key,
    title: 'PKCE GitHub OAuth',
    desc: 'Proof Key for Code Exchange (RFC 7636) prevents authorization code interception and token injection attacks.',
  },
  {
    icon: ShieldCheck,
    title: 'One-Way API Key Hashing',
    desc: 'Developer API keys (cg_live_...) are hashed using SHA-256 prior to database persistence; raw keys cannot be retrieved.',
  },
  {
    icon: FileCheck,
    title: 'HMAC Webhook Verification',
    desc: 'Every incoming GitHub event is cryptographically verified against a shared secret using SHA-256 HMAC signatures.',
  },
  {
    icon: Server,
    title: 'Tenant-Scoped Queries',
    desc: 'Every Cypher graph query and Qdrant vector retrieval strictly injects tenant & version IDs into query boundaries.',
  },
  {
    icon: EyeOff,
    title: 'Encrypted Credential Store',
    desc: 'OAuth tokens and sensitive organization secrets are encrypted at rest using AES-128-CBC / Fernet symmetric ciphers.',
  },
];

export default function SecuritySection() {
  return (
    <section className="py-24 md:py-32 bg-background border-b border-border relative overflow-hidden">
      
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface text-[11px] font-mono text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>SECURITY ARCHITECTURE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            Your source code stays yours.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            CodeGraph is built with defensive security, cryptographic identity validation, and strict multi-tenant isolation layers.
          </p>
        </div>

        {/* 3x2 Security Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {SECURITY_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="p-6 rounded-3xl border border-border bg-surface/40 shadow-2xs hover:border-black hover:bg-surface hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-default"
              >
                <div className="w-11 h-11 rounded-2xl bg-background border border-border flex items-center justify-center text-foreground group-hover:bg-black group-hover:text-white group-hover:border-black transition-all shadow-2xs">
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-base text-foreground font-mono">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted font-sans leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-muted">
                  <span>Cryptographically Verified</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
