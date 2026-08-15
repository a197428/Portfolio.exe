import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Avatar } from '@/components/avatar';

describe('Avatar', () => {
  it('renders a decorative profile image with configurable dimensions', () => {
    const { container } = render(
      <Avatar
        avatar="/image/avatar.jpg"
        name="Alexander Popov"
        className="profile-avatar"
        style={{ width: 144 }}
      />,
    );

    expect(screen.getByRole('presentation')).toHaveAttribute('src', '/image/avatar.jpg');
    expect(container.firstElementChild).toHaveClass('profile-avatar');
    expect(container.firstElementChild).toHaveStyle({ width: '144px', height: '120px' });
  });

  it('shows accessible profile initials when the image fails', () => {
    render(
      <Avatar
        avatar="/image/missing.jpg"
        name="Александр Попов"
        alt="Портрет Александра Попова"
      />,
    );

    fireEvent.error(screen.getByRole('img', { name: 'Портрет Александра Попова' }));

    expect(
      screen.getByRole('img', { name: 'Портрет Александра Попова' }),
    ).toHaveTextContent('АП');
  });

  it('retries rendering when the avatar URL changes', async () => {
    const { rerender } = render(
      <Avatar
        avatar="/image/missing.jpg"
        name="Alexander Popov"
        alt="Profile portrait"
      />,
    );
    fireEvent.error(screen.getByRole('img', { name: 'Profile portrait' }));

    rerender(
      <Avatar avatar="/image/avatar.jpg" name="Alexander Popov" alt="Profile portrait" />,
    );

    await waitFor(() =>
      expect(screen.getByRole('img', { name: 'Profile portrait' })).toHaveAttribute(
        'src',
        '/image/avatar.jpg',
      ),
    );
  });
});
