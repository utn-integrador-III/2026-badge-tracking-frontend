import { describe, expect, it } from 'vitest';
import { firstRunTutorialSteps, getNextTutorialStep, isTutorialComplete } from './tutorial';

describe('first-run tutorial', () => {
  it('defines the onboarding steps for a first-time badge holder', () => {
    expect(firstRunTutorialSteps).toHaveLength(3);
    expect(firstRunTutorialSteps[0].title).toBe('Revise su carnet');
  });

  it('advances through steps without exceeding the final step', () => {
    expect(getNextTutorialStep(0, 3)).toBe(1);
    expect(getNextTutorialStep(2, 3)).toBe(2);
    expect(isTutorialComplete(1, 3)).toBe(false);
    expect(isTutorialComplete(2, 3)).toBe(true);
  });
});
