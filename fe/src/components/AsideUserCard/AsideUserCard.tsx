import React from 'react';
import { styled } from 'styled-components';
import { colors } from '../../shared/colors';
import { ProfilePic } from '../ProfilePic/ProfilePic';

interface DivProps {
  isActive: boolean;
}

interface AsideUserCardProps {
  name: string;
  isActive: boolean;
  pic: string | null;
}

const Div = styled.div<DivProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ isActive }) => (isActive ? colors.background.light : colors.background.dark)};
  padding: 8px;
  margin: 5px 0;
  min-width: 5rem;
  border-bottom: 2px solid ${colors.green.light};
  border-radius: 5px;
  cursor: pointer;
  box-shadow: ${({ isActive }) => (isActive ? '0px 5px 10px 2px rgba(6, 6, 6, 0.2) inset' : 'none')};

  &:hover {
    box-shadow: 0 5px 10px 2px rgba(6, 6, 6, 0.2) inset;
  }
`;

const Name = styled.p`
  display: inline-block;
  font-size: 14px;
  margin: 0;
  color: ${colors.font.primary};
  text-overflow: ellipsis;
  max-height: 37px;
  width: calc(80%);
  overflow: hidden;
`;

const ProfilePicContainer = styled.div`
  display: flex;
  margin: auto;
  height: 35px;
  width: 35px;
`;

export const AsideUserCard: React.FC<AsideUserCardProps> = ({ name, isActive, pic }) => {
  return (
    <Div isActive={isActive}>
      <Name>{name}</Name>
      <ProfilePicContainer>
        <ProfilePic src={pic || './no-face.jpeg'} alt={`${name}'s profile pic`} />
      </ProfilePicContainer>
    </Div>
  );
};
