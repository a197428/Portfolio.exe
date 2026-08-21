import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FlipCard, type FlipCardProps } from '@/components/kokonutui/card-flip';

const props: FlipCardProps = {
  index: '01',
  title: 'Understand context',
  summary: 'Capture real constraints, integrations, and the definition of done.',
  details: [
    'Map the real constraints and the people who use the system',
    'Record integrations and external dependencies',
    'Agree the definition of done',
    'Verify requirements and mockups before implementation',
  ],
  frontLabel: 'View details',
  backLabel: 'Back to overview',
  revealLabel: 'View details: {{title}}',
  collapseLabel: 'Back to overview: {{title}}',
};

function card() {
  // Matches whatever side is active: both the reveal and the collapse
  // accessible names carry the card title.
  return screen.getByRole('button', {
    name: /Understand context/i,
  });
}

function front() {
  return card().querySelector('.flip-card-front') as HTMLElement;
}

function back() {
  return card().querySelector('.flip-card-back') as HTMLElement;
}

describe('FlipCard', () => {
  it('renders one toggle button with the front face readable and the back hidden', () => {
    render(<FlipCard {...props} />);

    const toggle = card();
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(toggle).toHaveAttribute('data-pinned', 'false');
    expect(toggle).toHaveAttribute('tabindex', '0');

    // The accessible name explains the reveal action with the card title.
    expect(toggle).toHaveAttribute('aria-label', 'View details: Understand context');

    // Front face carries the quick overview and the neutral hint label.
    expect(front()).toHaveTextContent('01');
    expect(front()).toHaveTextContent('Understand context');
    expect(front()).toHaveTextContent('View details');
    expect(front()).toHaveAttribute('aria-hidden', 'false');

    // The back face is present but hidden from assistive technology.
    expect(back()).toHaveTextContent('Map the real constraints');
    expect(back()).toHaveTextContent('Verify requirements and mockups');
    expect(back()).toHaveAttribute('aria-hidden', 'true');
  });

  it('pins the back face open on click and returns on a second click', () => {
    render(<FlipCard {...props} />);
    const toggle = card();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(toggle).toHaveAttribute('data-pinned', 'true');
    expect(toggle).toHaveAttribute('aria-label', 'Back to overview: Understand context');
    expect(front()).toHaveAttribute('aria-hidden', 'true');
    expect(back()).toHaveAttribute('aria-hidden', 'false');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(toggle).toHaveAttribute('aria-label', 'View details: Understand context');
    expect(front()).toHaveAttribute('aria-hidden', 'false');
    expect(back()).toHaveAttribute('aria-hidden', 'true');
  });

  it('pins with Enter and Space, and releases with Escape', () => {
    render(<FlipCard {...props} />);
    const toggle = card();

    fireEvent.keyDown(toggle, { key: 'Enter' });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');

    fireEvent.keyDown(toggle, { key: 'Escape' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    fireEvent.keyDown(toggle, { key: ' ' });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');

    // Escape releases the pinned state even while focused.
    fireEvent.keyDown(toggle, { key: 'Escape' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  it('previews the back while focused and returns to the front on blur when unpinned', () => {
    render(<FlipCard {...props} />);
    const toggle = card();

    fireEvent.focus(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(back()).toHaveAttribute('aria-hidden', 'false');

    fireEvent.blur(toggle);
    expect(back()).toHaveAttribute('aria-hidden', 'true');

    // A pinned card stays open after losing focus.
    fireEvent.click(toggle);
    fireEvent.blur(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(back()).toHaveAttribute('aria-hidden', 'false');
  });

  it('renders every detail point once on the back face', () => {
    render(<FlipCard {...props} />);
    const list = back().querySelector('.flip-card-details');
    expect(list).not.toBeNull();
    const items = list!.querySelectorAll('li');
    expect(items).toHaveLength(props.details.length);
    expect(back()).toHaveTextContent('Back to overview');
  });

  it('keeps the visible hints neutral and free of press/click instructions', () => {
    render(<FlipCard {...props} />);
    const toggle = card();

    expect(front()).toHaveTextContent('View details');
    expect(back()).toHaveTextContent('Back to overview');

    // The old action-based instructions are gone from the rendered UI.
    expect(toggle).not.toHaveTextContent('Press to reveal');
    expect(toggle).not.toHaveTextContent('Press to collapse');
    expect(toggle).not.toHaveTextContent('Press');
    expect(toggle).not.toHaveTextContent('Click');
    expect(toggle).not.toHaveTextContent('Hover');
  });
});
