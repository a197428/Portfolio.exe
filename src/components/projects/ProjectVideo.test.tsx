import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ProjectVideo } from '@/components/projects/ProjectVideo';
import { getProject } from '@/content';

it('switches to the selected product presentation from the beginning', async () => {
  const project = getProject('bitrix24-integrations', 'en')!;
  const pause = vi
    .spyOn(HTMLMediaElement.prototype, 'pause')
    .mockImplementation(() => undefined);
  const load = vi
    .spyOn(HTMLMediaElement.prototype, 'load')
    .mockImplementation(() => undefined);
  const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  render(<ProjectVideo project={project} />);
  const video = document.querySelector('video')!;

  expect(video).toHaveAttribute('src', '/media/bitrix24-acquiring.mp4');
  expect(video).toHaveAttribute('poster', '/media/bitrix24-acquiring-poster.webp');

  fireEvent.click(screen.getByRole('tab', { name: /ApartSharing/ }));
  await waitFor(() =>
    expect(video).toHaveAttribute('src', '/media/bitrix24-apartsharing.mp4'),
  );
  expect(video).toHaveAttribute('poster', '/media/bitrix24-apartsharing-poster.webp');

  video.currentTime = 12;
  fireEvent.click(screen.getByRole('tab', { name: /TTLock Connector/ }));

  expect(screen.getByRole('tab', { name: /TTLock Connector/ })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await waitFor(() => expect(video).toHaveAttribute('src', '/media/bitrix24-ttlock.mp4'));
  expect(video).toHaveAttribute('poster', '/media/bitrix24-ttlock-poster.webp');
  expect(video.currentTime).toBe(0);
  expect(pause).toHaveBeenCalled();
  expect(load).toHaveBeenCalled();
  expect(play).toHaveBeenCalled();
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Manage accounts, smart locks');

  fireEvent.click(screen.getByRole('tab', { name: /Acquiring & Robots/ }));
  await waitFor(() =>
    expect(video).toHaveAttribute('src', '/media/bitrix24-acquiring.mp4'),
  );
  expect(video).toHaveAttribute('poster', '/media/bitrix24-acquiring-poster.webp');
});
