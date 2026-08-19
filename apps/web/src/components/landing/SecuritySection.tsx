'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  FileCheck, 
  Server, 
  EyeOff 
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
    <section className="py-20 md:py-28 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-surface text-[10px] font-mono text-muted">
            <span>SECURITY ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Your source code stays yours.
          </h2>
          <p className="text-base sm:text-lg text-muted">
            CodeGraph is built from the ground up with defensive security, cryptographic identity validation, and strict isolation layers.
          </p>
        </div>

        {/* Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECURITY_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title}
                className="p-6 rounded-xl border border-border bg-surface/40 space-y-3 hover:border-black transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-foreground">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-mono text-sm font-bold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted font-sans leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
