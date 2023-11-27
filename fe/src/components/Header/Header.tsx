import React, { useState } from 'react';
import styled from 'styled-components';
import { getMeUser } from '../../shared/sessionStorageHelpers';
import { colors } from '../../shared/colors';
import { Button } from '../Button/Button';
import { ProfilePic } from '../ProfilePic/ProfilePic';
import { LogoutModal } from '../../pages/LogoutModal/LogoutModal';

interface HeaderProps {
  text?: string;
}

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 100%;
`;

const Left = styled.div`
  display: flex;
  gap: 10px;
`;

const HeaderText = styled.h2`
  font-size: 1.5rem;
  font-weight: normal;
  color ${colors.font.primary}
`;

const ProfilePicContainer = styled.div`
  display: flex;
  margin: auto;
  height: 50px;
  width: 50px;
`;

export const Header: React.FC<HeaderProps> = ({ text }) => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const meUser = getMeUser();
  const defaultHeader = `Welcome, ${meUser?.name ? meUser.name : 'user'}!`;

  return (
    <>
      <HeaderContainer>
        <Left>
          <HeaderText>{text || defaultHeader}</HeaderText>
          <ProfilePicContainer>
            <ProfilePic src={meUser?.pic || './no-face.jpeg'} alt={`${meUser?.name || 'Users'}'s profile pic`} />
          </ProfilePicContainer>
        </Left>
        <div>
          <Button onClick={() => setIsModalOpened(true)}>Clear all data and log out</Button>
        </div>
      </HeaderContainer>
      <LogoutModal isOpened={isModalOpened} onClose={() => setIsModalOpened(false)} />
    </>
  );
};
