import { describe, expect, it } from 'vitest';
import { bobPlainText } from './plainText';

describe('Bob plain-text presentation', () => {
  it('removes Markdown decoration while preserving readable structure', () => {
    expect(
      bobPlainText(
        '## **Навыки**\n\n- **Frontend:** React [1]\n- `Backend`: FastAPI\n[Проект](/projects/demo)',
      ),
    ).toBe('Навыки\n\n• Frontend: React\n• Backend: FastAPI\nПроект');
  });

  it('leaves ordinary punctuation and multiplication symbols intact', () => {
    expect(bobPlainText('Опыт: Vue 3, C++ и 2 * 3 = 6.')).toBe(
      'Опыт: Vue 3, C++ и 2 * 3 = 6.',
    );
  });
});
