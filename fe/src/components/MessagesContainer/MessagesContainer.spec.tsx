import { screen } from '@testing-library/react';
import render from '../../test-utils/test-utils';
import { MessagesContainer } from './MessagesContainer';
import { Message } from '../../shared/types';

const messagesMock: Message[] = [
  {
    senderId: '1',
    message: '1 to 2',
    attachments: null,
    timestamp: 1701182282247,
    to: '2',
  },
  {
    senderId: '2',
    message: '2 to 1',
    attachments: null,
    timestamp: 1701182765984,
    to: '1',
  },
];

describe('MessagesContainer', () => {
  it('Should render correctly', () => {
    render(<MessagesContainer messages={messagesMock} activeUserId="1" meId="1" />);
    expect(screen.getByText('1 to 2')).toBeInTheDocument();
    expect(screen.getByText('2 to 1')).toBeInTheDocument();
    expect(screen.getByText('15:38')).toBeInTheDocument();
    expect(screen.getByText('15:46')).toBeInTheDocument();
  });
});
