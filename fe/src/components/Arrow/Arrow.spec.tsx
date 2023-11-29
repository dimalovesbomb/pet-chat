import { screen } from '@testing-library/react';
import render from '../../test-utils/test-utils';
import { Arrow } from './Arrow';

describe('Arrow', () => {
  it('Should render correctly', () => {
    render(<Arrow />);
    expect(screen.getByText('', { selector: 'svg' })).toBeInTheDocument();
  });
});
