import { screen } from '@testing-library/react';
import render from '../../test-utils/test-utils';
import { SelectUserBanner } from './SelectUserBanner';

describe('SelectUserBanner', () => {
  it('Should render correctly', () => {
    render(<SelectUserBanner />);

    expect(screen.getByText('No user selected')).toBeInTheDocument();
    expect(screen.getByText('', { selector: 'svg' })).toBeInTheDocument();
    expect(screen.getByText('Please, select a user from a list on your left')).toBeInTheDocument();
  });
});
