import { screen } from '@testing-library/react';
import render from '../../test-utils/test-utils';
import { UserNotFound } from './UserNotFound';

describe('UserNotFound', () => {
  it('Should render as "User not found"', () => {
    render(<UserNotFound />);
    expect(screen.getByText('User not found')).toBeInTheDocument();
  });

  it('Should render as "No users yet"', () => {
    render(<UserNotFound variant="no-user-list" />);
    expect(screen.getByText('No users yet')).toBeInTheDocument();
  });
});
