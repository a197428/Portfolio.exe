import { describe, expect, it } from 'vitest';
import { buildBobPrompt } from './prompt';

describe('Bob grounding prompt', () => {
  it('requires evidence, honest gaps, and structured vacancy output', () => {
    const prompt = buildBobPrompt(
      { mode: 'vacancy', message: 'Role', history: [], locale: 'en', role: 'ai' },
      {
        evidence: [
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
        coverage: {
          complete: false,
          scope: 'focused',
          intents: ['projects'],
          requestedTypes: ['project'],
          matchingProjectHrefs: ['/projects/agent'],
          usedHistory: false,
        },
      },
    );
    expect(prompt).toContain('Use only the evidence');
    expect(prompt).toContain('Match, Evidence, Gaps, Interview questions');
    expect(prompt).toContain('Never invent');
    expect(prompt).toContain('clean plain text only');
    expect(prompt).toContain('Complete result set: no');
    expect(prompt).toContain('Never infer that the portfolio has no other projects');
    expect(prompt).not.toContain('Cite claims inline');
    expect(prompt).toContain('Uses a Worker.');
  });
});
