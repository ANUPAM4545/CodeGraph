'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stepper } from '../../components/ui/Stepper';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { authService } from '../../lib/auth/authService';
import { Github } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [orgName, setOrgName] = useState('');
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);

  const STEPS = ['Welcome', 'Organization', 'Connect', 'Repository'];

  const handleCreateOrg = async () => {
    if (!orgName.trim()) return;
    setIsCreatingOrg(true);
    try {
      await authService.createOrganization(orgName);
      setStep(2);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreatingOrg(false);
    }
  };

  const handleSelectRepo = () => {
    // Redirect to the import pipeline
    router.push('/import');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl mb-12">
        <Stepper steps={STEPS} currentStep={step} />
      </div>

      <Card className="w-full max-w-md shadow-lg border-border">
        <CardContent className="p-8">
          {step === 0 && (
            <div className="text-center space-y-6">
              <div className="w-12 h-12 bg-primary text-primary-foreground font-bold flex items-center justify-center rounded-xl mx-auto">
                C
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Welcome to CodeGraph</h2>
                <p className="text-muted mt-2 text-sm">Let's set up your workspace to start exploring your codebase architecture.</p>
              </div>
              <Button className="w-full" onClick={() => setStep(1)}>Get Started</Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Create Organization</h2>
                <p className="text-muted mt-1 text-sm">This is where your repositories and team members will live.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Organization Name</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g. Acme Corp" 
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <Button className="w-full" onClick={handleCreateOrg} disabled={!orgName.trim() || isCreatingOrg}>
                {isCreatingOrg ? 'Creating...' : 'Create Organization'}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Connect GitHub</h2>
                <p className="text-muted mt-1 text-sm">CodeGraph needs access to your repositories to analyze them.</p>
              </div>
              <Button variant="outline" className="w-full gap-2" onClick={() => setStep(3)}>
                <Github className="w-4 h-4" /> Connect GitHub App
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Select Repository</h2>
                <p className="text-muted mt-1 text-sm">Choose a repository to run the initial architectural analysis.</p>
              </div>
              <div className="border border-border rounded-md overflow-hidden">
                <div className="p-3 hover:bg-surface cursor-pointer flex justify-between items-center" onClick={handleSelectRepo}>
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-muted" />
                    <span className="font-medium text-sm">acme/event-platform</span>
                  </div>
                  <span className="text-xs text-muted">Private</span>
                </div>
                <div className="p-3 hover:bg-surface cursor-pointer flex justify-between items-center border-t border-border" onClick={handleSelectRepo}>
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-muted" />
                    <span className="font-medium text-sm">acme/auth-service</span>
                  </div>
                  <span className="text-xs text-muted">Private</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
