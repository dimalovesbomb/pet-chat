import { screen, waitFor } from '@testing-library/react';
import render from '../../test-utils/test-utils';
import { Message } from './Message';
import type { Message as IMessage } from '../../shared/types';
import userEvent from '@testing-library/user-event';

const messageMock: IMessage = {
  senderId: '1',
  message: Array(600).fill('test ').join(''),
  attachments: null,
  timestamp: 1701182392293,
  to: '2',
};

describe('Message', () => {
  it('should render without "Open full message" button', () => {
    render(
      <Message
        senderId="1"
        message="Test message"
        attachments={messageMock.attachments}
        timestamp={messageMock.timestamp}
        to={messageMock.to}
        isMe
        prevMessageFromSameSender={false}
      />,
    );
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('15:39')).toBeInTheDocument();
    expect(screen.queryByText('Open full message')).not.toBeInTheDocument();
  });

  it('Should render with "Open full message" button and open Modal on click', () => {
    render(
      <Message
        senderId="1"
        message={messageMock.message}
        attachments={messageMock.attachments}
        timestamp={messageMock.timestamp}
        to={messageMock.to}
        isMe
        prevMessageFromSameSender={false}
      />,
    );

    const showFullMessageButtonEl = screen.getByText('Open full message', { selector: 'button' });
    expect(showFullMessageButtonEl).toBeInTheDocument();

    userEvent.click(showFullMessageButtonEl);
    waitFor(() => {
      expect(screen.getByText('Message from ', { exact: false })).toBeInTheDocument();
      expect(screen.getByText(messageMock.message)).toBeInTheDocument();
    });
  });

  it('Should render attachments', () => {
    const attachmentsMock = [{ src: '/test', type: 'image' }];
    render(
      <Message
        senderId="1"
        message={messageMock.message}
        attachments={attachmentsMock}
        timestamp={messageMock.timestamp}
        to={messageMock.to}
        isMe
        prevMessageFromSameSender={false}
      />,
    );
    expect(screen.getByAltText('/test')).toBeInTheDocument();
  });
});
