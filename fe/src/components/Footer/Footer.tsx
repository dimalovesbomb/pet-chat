import React from 'react';
import styled from 'styled-components';

const FooterText = styled.h5`
  margin: 10px 0;
  text-decoration: underline;
`;

export const Footer: React.FC = () => {
  return (
    <FooterText>
      Implementation of this project is still in progress, bugs might (and most likely will) occur. Mobile is not
      implemented yet.
    </FooterText>
  );
};
