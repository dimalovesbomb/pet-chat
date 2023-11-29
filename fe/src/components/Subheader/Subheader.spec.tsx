import { screen } from '@testing-library/react';
import render from '../../test-utils/test-utils';
import { Subheader } from './Subheader';

describe('Subheader', () => {
  it('Should render content', () => {
    const content = <p>content</p>;
    render(<Subheader>{content}</Subheader>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});
