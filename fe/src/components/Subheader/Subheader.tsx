import React from 'react';
import styled from 'styled-components';
import { colors } from '../../shared/colors';

interface SubheaderProps {
  children: string | React.ReactElement;
}

const H3 = styled.h3`
  color: ${colors.font.primary};
  font-weight: normal;
`;

export const Subheader: React.FC<SubheaderProps> = ({ children }) => {
  return <H3>{children}</H3>;
};
