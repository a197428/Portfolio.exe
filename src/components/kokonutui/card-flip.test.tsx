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
  frontLabel: 'Press to reveal',
  backLabel: 'Press to collapse',
};

function card() {
  return screen.getByRole('button', {
    name: /Understand context.*definition of done/i,
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

    // Front face carries the quick overview and the flip hint.
    expect(front()).toHaveTextContent('01');
    expect(front()).toHaveTextContent('Understand context');
    expect(front()).toHaveTextContent('Press to reveal');
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
    expect(front()).toHaveAttribute('aria-hidden', 'true');
    expect(back()).toHaveAttribute('aria-hidden', 'false');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
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
    expect(back()).toHaveTextContent('Press to collapse');
  });
});
