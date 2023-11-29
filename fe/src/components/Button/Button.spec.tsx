import { screen } from '@testing-library/react';
import render from '../../test-utils/test-utils';
import { Button } from './Button';
import userEvent from '@testing-library/user-event';

describe('Button', () => {
  it('Should render correctly', () => {
    render(<Button>test</Button>);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('Should call onClick handler', () => {
    const mockOnClick = jest.fn();
    render(<Button onClick={mockOnClick}>test</Button>);
    userEvent.click(screen.getByText('test'));
    expect(mockOnClick).toBeCalled();
  });
});
