import { screen } from '@testing-library/react';
import render from '../../test-utils/test-utils';
import { AsideUserCard } from './AsideUserCard';

describe('AsideUserCard', () => {
  it('Should render correctly', () => {
    render(<AsideUserCard name="Test" isActive pic="/test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByAltText(`Test's profile pic`)).toBeInTheDocument();
  });
});
