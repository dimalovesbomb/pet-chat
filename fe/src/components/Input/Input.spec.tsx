import { screen } from '@testing-library/react';
import render from '../../test-utils/test-utils';
import { Input } from './Input';
import userEvent from '@testing-library/user-event';

describe('Input', () => {
  it('Should render correctly', () => {
    const mockOnChange = jest.fn();
    render(<Input value="" onChange={mockOnChange} placeholder="test" />);
    const inputEl = screen.getByPlaceholderText('test');
    expect(inputEl).toBeInTheDocument();

    userEvent.type(inputEl, '123');
    expect(mockOnChange).toBeCalled();
  });

  it('Should render a search icon', () => {
    render(<Input value="" onChange={jest.fn()} icon="search" />);
    expect(screen.getByText('', { selector: 'svg' })).toBeInTheDocument();
  });

  it('Should render any icon', () => {
    const mockIcon = <svg></svg>;
    render(<Input value="" onChange={jest.fn()} icon={mockIcon} />);
    expect(screen.getByText('', { selector: 'svg' })).toBeInTheDocument();
  });
});
