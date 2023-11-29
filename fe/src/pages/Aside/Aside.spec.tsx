import { screen, waitFor } from '@testing-library/react';
import render from '../../test-utils/test-utils';
import { Aside, AsideProps } from './Aside';
import userEvent from '@testing-library/user-event';
import { State } from '../../shared/types';
import { SESSION_STORAGE_KEY } from '../../shared/sessionStorageHelpers';

const mockUsers = [
  {
    name: 'Lorem Ipsum',
    id: '1',
    pic: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
  },
  {
    name: 'Vasia',
    id: '2',
    pic: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
  },
];

const getProps = (): AsideProps => {
  return {
    users: mockUsers,
    sizeProps: {
      isExpanded: false,
      setIsExpanded: jest.fn(),
    },
  };
};
const mockGetMeUser = jest.fn<State, unknown[]>();
jest.mock('../../shared/sessionStorageHelpers', () => ({
  ...jest.requireActual('../../shared/sessionStorageHelpers'),
  getMeUser: () => mockGetMeUser(),
}));

const mockUseLocation = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockUseLocation(),
}));

const mockGetMessages = jest.fn();
jest.mock('../../socket', () => ({
  ...jest.requireActual('../../socket'),
  getMessages: () => mockGetMessages(),
}));

describe('Aside', () => {
  beforeEach(() => {
    mockUseLocation.mockReturnValue({ search: '', pathname: '/2' });
  });

  it('Should render correctly', () => {
    render(<Aside {...getProps()} />);

    expect(screen.getByText('Lorem Ipsum', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('Vasia', { selector: 'p' })).toBeInTheDocument();
  });

  it('Should filter users', () => {
    render(<Aside {...getProps()} />);

    const inputEl = screen.getByPlaceholderText('Type a username');
    userEvent.type(inputEl, 'l');

    expect(screen.getByText('Lorem Ipsum')).toBeInTheDocument();
    expect(screen.queryByText('Vasia')).not.toBeInTheDocument();
  });

  it('Should call getMeUser on init', () => {
    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        name: 'Lorem Ipsum',
        id: '1',
        pic: null,
        isMe: true,
      }),
    );

    render(<Aside {...getProps()} />);

    expect(mockGetMeUser).toBeCalled();
  });

  it('Should render "user not found"', () => {
    render(<Aside {...getProps()} />);

    const inputEl = screen.getByPlaceholderText('Type a username');
    userEvent.type(inputEl, 'zh');

    expect(screen.getByText('User not found')).toBeInTheDocument();
  });

  it('Should not render "me user"', () => {
    const props: AsideProps = {
      ...getProps(),
      users: [
        ...getProps().users,
        {
          id: '3',
          name: 'Me me',
          pic: null,
          isMe: true,
        },
      ],
    };
    render(<Aside {...props} />);

    expect(screen.queryByText('Me me')).not.toBeInTheDocument();
  });

  it('should call getMessages on user card click', () => {
    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        name: 'Test test',
        id: '3',
        pic: null,
        isMe: true,
      }),
    );
    render(<Aside {...getProps()} />);

    const userCardEl = screen.getByText('Lorem Ipsum');
    userEvent.click(userCardEl);

    waitFor(() => {
      expect(mockGetMessages).toBeCalled();
    });
  });
});
