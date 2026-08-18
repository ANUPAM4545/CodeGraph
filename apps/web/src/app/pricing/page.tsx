import React from 'react';
import { Navbar } from '../../components/public/Navbar';
import { Footer } from '../../components/public/Footer';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/Card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for individual developers and open source projects.',
    features: ['1 User', 'Up to 3 Repositories', 'Community Support', 'Basic Architecture Search'],
    cta: 'Start for free',
    href: '/signup',
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month',
    description: 'For engineering teams collaborating on microservices.',
    features: ['Up to 10 Users', 'Unlimited Repositories', 'Priority Support', 'Advanced Impact Analysis', 'API Access'],
    cta: 'Get Started',
    href: '/signup',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations requiring strict compliance and isolation.',
    features: ['Unlimited Users', 'Self-hosted options', 'SAML SSO', 'Dedicated Account Manager', 'Custom Data Retention'],
    cta: 'Contact Sales',
    href: '#',
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-surface py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Simple, transparent pricing</h1>
            <p className="text-lg text-muted">Start mapping your architecture for free. Upgrade when you need team collaboration.</p>
            <div className="inline-block bg-background border border-border px-3 py-1 text-xs font-medium rounded-full mt-4">
              Billing integration coming soon
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PLANS.map((plan, i) => (
              <Card key={i} className={`flex flex-col ${plan.highlight ? 'border-primary ring-1 ring-primary shadow-lg' : 'border-border'}`}>
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-muted mt-2 min-h-[40px]">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-8">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href} className="mt-auto">
                    <Button variant={plan.highlight ? 'primary' : 'outline'} className="w-full">{plan.cta}</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
