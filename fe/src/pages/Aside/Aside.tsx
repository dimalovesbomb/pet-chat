import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { State } from '../../shared/types';
import { AsideSearch, AsideSearchResult } from '../../components/AsideSeachResult/AsideSearchResult';
import { AsideUserCard } from '../../components/AsideUserCard/AsideUserCard';
import { Input } from '../../components/Input/Input';
import { Link } from '../../components/Link/Link';
import { UserNotFound } from '../../components/UserNotFound/UserNotFound';
import './Aside.scss';
import { Subheader } from '../../components/Subheader/Subheader';
import styled from 'styled-components';
import { Arrow } from '../../components/Arrow/Arrow';
import { colors } from '../../shared/colors';

interface AsideProps {
  users: State[];
  sizeProps: {
    isExpanded: boolean;
    setIsExpanded: (isExpanded: boolean) => void;
  };
}

const Li = styled.li`
  list-style-type: none;
`;

interface ExpandButtonProps {
  isExpanded: boolean;
}

const ExpandButton = styled('button')<ExpandButtonProps>(({ isExpanded }) => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: colors.zIndex.front,

    position: 'absolute',
    top: '10px',
    right: '-13px',
    transform: `rotate(${isExpanded ? '270deg' : '90deg'})`,
    transition: 'transform .5s',

    backgroundColor: 'transparent',
    border: `1px solid ${colors.green.light}`,
    borderRadius: '50%',
    width: '25px',
    height: '25px',
  };
});

export const Aside: React.FC<AsideProps> = ({ users, sizeProps }) => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<State[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isExpanded, setIsExpanded } = sizeProps;

  const activeUserId = location.pathname.substring(1);

  useEffect(() => {
    setSelectedUsers(users);
  }, [users]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    const foundUsers = users.filter((user) => user.name.toLowerCase().includes(e.target.value));
    setSelectedUsers(foundUsers);
  };

  const handleScrolled = (e: React.UIEvent<HTMLElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 0);
  };

  return (
    <nav className="aside-container">
      <ExpandButton onClick={() => setIsExpanded(!isExpanded)} isExpanded={isExpanded}>
        <Arrow />
      </ExpandButton>
      <AsideSearch isScrolled={isScrolled}>
        <div>
          <Subheader>Select a user</Subheader>
        </div>
        <Input value={searchValue} onChange={handleSearchChange} placeholder="Type a username" icon="search" />
      </AsideSearch>
      <AsideSearchResult onScroll={handleScrolled}>
        {!selectedUsers.length && <UserNotFound variant={users.length ? '404' : 'no-user-list'} />}
        {selectedUsers.map(({ name, id, pic, isMe }) => {
          return isMe ? null : (
            <Li key={id}>
              <Link to={`/${id}`} isButton>
                <AsideUserCard name={name} isActive={id === activeUserId} pic={pic} />
              </Link>
            </Li>
          );
        })}
      </AsideSearchResult>
    </nav>
  );
};
