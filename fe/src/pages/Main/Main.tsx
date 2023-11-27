import React, { useState } from 'react';
import { Aside } from '../Aside/Aside';
import { Header } from '../../components/Header/Header';
import { MainContainer } from './MainContainer';
import { Chat } from '../Chat/Chat';
import styled from 'styled-components';
import { RegisterModal } from '../RegisterModal/RegisterModal';
import { Footer } from '../../components/Footer/Footer';
import './Main.scss';

interface ContainerProps {
  isAsideExpanded: boolean;
}

const Container = styled('div')<ContainerProps>(({ isAsideExpanded }) => {
  return {
    display: 'grid',
    gridTemplateColumns: isAsideExpanded ? '1fr 3fr' : '0.1fr 3fr',
    gridTemplateRows: '.5fr 2fr 1fr',
    gridTemplateAreas: `
      "header header"
      "aside main"
      "aside main"
      "footer footer"
  `,
    height: '100vh',
    transition: 'grid-template-columns .5s',
  };
});

export const Main: React.FC = () => {
  const [isAsideExpanded, setIsAsideExpanded] = useState(true);

  return (
    <MainContainer>
      {({ users, formProps, messages }) => (
        <Container isAsideExpanded={isAsideExpanded}>
          <header className="header">
            <Header />
          </header>
          <aside className="aside">
            <Aside users={users} sizeProps={{ isExpanded: isAsideExpanded, setIsExpanded: setIsAsideExpanded }} />
          </aside>
          <main className="main">
            <Chat messages={messages} />
          </main>
          <footer className="footer">
            <Footer />
          </footer>
          <RegisterModal isOpened={formProps.shouldOpenModal} formProps={formProps}></RegisterModal>
        </Container>
      )}
    </MainContainer>
  );
};
