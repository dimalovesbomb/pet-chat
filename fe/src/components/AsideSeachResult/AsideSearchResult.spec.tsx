import { screen } from '@testing-library/react';
import render from '../../test-utils/test-utils';
import { AsideSearchResult } from './AsideSearchResult';

describe('AsideSearchResult', () => {
  it('Should render correctly', () => {
    render(
      <AsideSearchResult>
        <li>test</li>
      </AsideSearchResult>,
    );
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
