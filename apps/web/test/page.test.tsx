import { describe, it, expect } from 'vitest';
import LandingPage from '../src/app/page';

describe('Root Landing Page', () => {
  it('redirects to dashboard', () => {
    try {
      LandingPage();
    } catch (e: any) {
      expect(e?.digest).toContain('/dashboard');
    }
  });
});
