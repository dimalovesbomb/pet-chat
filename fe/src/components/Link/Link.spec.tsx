import { screen } from '@testing-library/react';
import render from '../../test-utils/test-utils';
import { Link } from './Link';
import userEvent from '@testing-library/user-event';

describe('Link', () => {
  it('Should render', () => {
    render(
      <Link to="/test">
        <p>test</p>
      </Link>,
    );
    
    userEvent.click(screen.getByText('test'));
    expect(window.location.pathname).toEqual('/test');
  });
});
