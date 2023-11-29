import { act, screen, waitFor } from '@testing-library/react';
import render from '../../test-utils/test-utils';
import { State } from '../../shared/types';
import { Header } from './Header';
import userEvent from '@testing-library/user-event';

const mockGetMeUser = jest.fn<State | undefined, unknown[]>();
jest.mock('../../shared/sessionStorageHelpers', () => ({
  ...jest.requireActual('../../shared/sessionStorageHelpers'),
  getMeUser: () => mockGetMeUser(),
}));

describe('Header', () => {
  it('Should render correctly', () => {
    mockGetMeUser.mockReturnValue({
      name: 'Lorem Ipsum',
      id: '1',
      pic: null,
      isMe: true,
    });
    render(<Header />);

    expect(screen.getByText('Welcome, Lorem Ipsum!')).toBeInTheDocument();
    expect(screen.getByAltText("Lorem Ipsum's profile pic")).toBeInTheDocument();
    expect(screen.getByText('Clear all data and log out')).toBeInTheDocument();
  });

  it('Should render "Welcome, user!"', () => {
    mockGetMeUser.mockReturnValue(undefined);
    render(<Header />);
    expect(screen.getByText('Welcome, user!')).toBeInTheDocument();
  });

  it('Should render custom header text', () => {
    render(<Header text="Custon text" />);
    expect(screen.getByText('Custon text')).toBeInTheDocument();
  });

  it('Should open and close modal', () => {
    render(<Header />);
    const logoutButtonEl = screen.getByText('Clear all data and log out');
    act(() => {
      userEvent.click(logoutButtonEl);
    });
    expect(screen.getByRole('modal')).toBeInTheDocument();

    const closeButtonEl = screen.getByText('', { selector: 'svg' });
    act(async () => {
      await userEvent.click(closeButtonEl);
    });
    waitFor(() => {
      expect(screen.queryByRole('modal')).not.toBeInTheDocument();
    });
  });
});
