import { render, screen } from '@testing-library/react';
import { ProjectEvidence } from '@/components/projects/ProjectEvidence';
import { getProject } from '@/content';

it('renders the Local AI Assistant video and evidence without exposing provenance', () => {
  const project = getProject('local-ai-assistant', 'en')!;

  render(<ProjectEvidence project={project} />);

  const video = document.querySelector('video');
  expect(video).toHaveAttribute('src', '/media/local-ai-assistant.mp4');
  expect(video).toHaveAttribute('poster', '/media/local-ai-assistant-poster.webp');
  expect(video).toHaveAttribute('preload', 'metadata');
  expect(
    screen.getByText('Contextual answers grounded in the active browser tab'),
  ).toBeVisible();
  expect(
    screen.getByText('FastAPI exposes WebSocket and REST conversation contracts'),
  ).toBeVisible();
  expect(screen.getByText(/15 component tests cover/)).toBeVisible();
  expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/a197428/local-ai-assistant-extension',
  );
  expect(screen.queryByText(project.source!.commit)).not.toBeInTheDocument();
});

it('renders a poster and demo while keeping private source provenance hidden', () => {
  const project = getProject('neurosport', 'en')!;

  render(<ProjectEvidence project={project} />);

  expect(document.querySelector('img')).toHaveAttribute('src', '/media/neurosport.webp');
  expect(screen.getByRole('link', { name: 'Live demo' })).toHaveAttribute(
    'href',
    'https://dev.neurosport.pages.dev/',
  );
  expect(screen.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument();
  expect(screen.queryByText(project.source!.commit)).not.toBeInTheDocument();
});
