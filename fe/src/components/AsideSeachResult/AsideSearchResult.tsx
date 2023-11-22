import styled from 'styled-components';

export const AsideSearch = styled('div')<{ isScrolled: boolean }>(({ isScrolled }) => ({
  boxShadow: isScrolled ? '0px 5px 5px -5px rgba(6, 6, 6, 0.6)' : 'none',
  transition: 'ease .2s',
  marginBottom: '5px',
}));

export const AsideSearchResult = styled('ul')(() => ({
  overflowY: 'scroll',
  transition: 'ease .2s',
  marginTop: '5px',
  paddingLeft: 0,
}));
