import React from 'react';
import { Modal } from '../../components/Modal/Modal';
import styled from 'styled-components';
import { Button } from '../../components/Button/Button';
import { removeUserId, rewriteState } from '../../shared/sessionStorageHelpers';

interface LogoutModalProps {
  isOpened: boolean;
  onClose: () => void;
}

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpened, onClose }) => {
  const headerTitle = 'Are you sure?';
  const handleOnClick = () => {
    rewriteState([]);
    removeUserId();
    window.location.reload();
  };

  return (
    <Modal isOpened={isOpened} headerTitle={headerTitle} closable onClose={onClose}>
      <ModalContainer>
        <h3>
          Don't be afraid, everything is stored in sessionStorage, so once you close this app - data will be deleted
          anyway
        </h3>
        <Button outline="red" onClick={handleOnClick}>
          Delete data anyway
        </Button>
      </ModalContainer>
    </Modal>
  );
};
