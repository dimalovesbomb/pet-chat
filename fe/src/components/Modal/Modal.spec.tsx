import { screen } from '@testing-library/react';
import render from '../../test-utils/test-utils';
import { Modal } from './Modal';
import userEvent from '@testing-library/user-event';

const modalChildren = <div>modal content</div>;

describe('Modal', () => {
  it('Should render correctly', () => {
    render(
      <Modal isOpened headerTitle="Test title">
        {modalChildren}
      </Modal>,
    );

    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByText('modal content')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('Should render with close button', () => {
    const mockOnClose = jest.fn();
    render(
      <Modal isOpened headerTitle="Test title" closable onClose={mockOnClose}>
        {modalChildren}
      </Modal>,
    );
    const buttonEl = screen.getByRole('button');
    expect(buttonEl).toBeInTheDocument();

    userEvent.click(buttonEl);
    expect(mockOnClose).toBeCalled();
  });

  it('Should call onClose when clicking outside the container', () => {
    const mockOnClose = jest.fn();
    render(
      <Modal isOpened headerTitle="Test title" closable onClose={mockOnClose}>
        {modalChildren}
      </Modal>,
    );

    const outerDivEl = screen.getByRole('modal');
    userEvent.click(outerDivEl);
    expect(mockOnClose).toBeCalled();
  });

  it('Should not render modal if isOpened === false', () => {
    render(
      <Modal isOpened={false} headerTitle="Test title">
        {modalChildren}
      </Modal>,
    );
    expect(screen.queryByText('modal content')).not.toBeInTheDocument();
  });
});
