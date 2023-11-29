import { screen } from '@testing-library/react';
import render from '../../test-utils/test-utils';
import { Footer } from './Footer';

describe('Footer', () => {
  it('Should render correctly', () => {
    render(<Footer />);
    expect(
      screen.getByText(
        'Implementation of this project is still in progress, bugs might (and most likely will) occur. Mobile is not implemented yet.',
      ),
    ).toBeInTheDocument();
  });
});
