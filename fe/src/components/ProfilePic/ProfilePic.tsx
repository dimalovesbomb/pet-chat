import styled from 'styled-components';
import { colors } from '../../shared/colors';

export const ProfilePic = styled.img`
  border: 2px solid ${colors.green.dark};
  border-radius: 50%;
  display: block;
  width: 100%;
  object-fit: cover;
`;
