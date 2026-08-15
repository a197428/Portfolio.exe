import { fireEvent, render, screen } from '@testing-library/react';
import { ProjectVideo } from '@/components/projects/ProjectVideo';
import { getProject } from '@/content';

it('selects a product chapter and seeks the presentation', () => {
  const project = getProject('bitrix24-integrations', 'en')!;
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  render(<ProjectVideo project={project} />);
  const video = document.querySelector('video')!;

  fireEvent.click(screen.getByRole('tab', { name: /TTLock Connector/ }));

  expect(screen.getByRole('tab', { name: /TTLock Connector/ })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(video.currentTime).toBe(150);
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Manage accounts, smart locks');
});
