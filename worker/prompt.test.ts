import { describe, expect, it } from 'vitest';
import { buildBobPrompt } from './prompt';

describe('Bob grounding prompt', () => {
  it('requires evidence, honest gaps, and structured vacancy output', () => {
    const prompt = buildBobPrompt(
      { mode: 'vacancy', message: 'Role', history: [], locale: 'en', role: 'ai' },
      [
        {
          id: 'one',
          locale: 'en',
          type: 'project',
          title: 'Agent',
          href: '/projects/agent',
          route: '/projects/agent',
          roles: ['ai'],
          content: 'Uses a Worker.',
          score: 0.9,
        },
      ],
    );
    expect(prompt).toContain('Use only the evidence');
    expect(prompt).toContain('Match, Evidence, Gaps, Interview questions');
    expect(prompt).toContain('Never invent');
    expect(prompt).toContain('clean plain text only');
    expect(prompt).not.toContain('Cite claims inline');
    expect(prompt).toContain('Uses a Worker.');
  });
});
