import React from 'react';
import styled from 'styled-components';
import { colors } from '../../shared/colors';

interface ModalProps {
  isOpened: boolean;
  closable?: boolean;
  onClose?: () => void;
  headerTitle: string;
  children: React.ReactElement;
}

const CloseIcon: React.FC = () => {
  return (
    <svg
      viewBox="0 -0.5 25 25"
      fill={colors.font.secondary}
      xmlns="http://www.w3.org/2000/svg"
      stroke={colors.font.secondary}
      strokeWidth="0.9"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z"
          fill="#000000"
        ></path>
      </g>
    </svg>
  );
};

const ModalOuter = styled.div`
  position: fixed;
  z-index: ${colors.zIndex.modal};
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: rgba(33, 46, 53, 0.7);

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalInner = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 50%;
  background-color: ${colors.background.dark};
  border-bottom: 2px solid ${colors.green.light};
  border-radius: 5px;
  padding: 10px;
  z-index: ${colors.zIndex.modal};
`;

const ModalHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: auto;
  min-height: 30px;
  padding-bottom: 5px;
  border-bottom: 1px solid ${colors.green.light};
`;

const ModalHeader = styled.h3`
  display: flex;
  margin: 0;
  padding: 0;
  color: ${colors.font.primary};
  font-size: 20px;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  width: 30px;
  height: 30px;
  border: 1px solid ${colors.green.light};
  border-radius: 5px;
  background-color: transparent;
`;

export const Modal: React.FC<ModalProps> = ({ isOpened, headerTitle, closable = false, onClose, children }) => {
  const onClickOutsideModal = () => {
    if (closable && onClose) {
      onClose();
    }
  };

  if (!isOpened) {
    return null;
  }

  return (
    <ModalOuter role="modal" onClick={onClickOutsideModal}>
      <ModalInner onClick={(e) => e.stopPropagation()}>
        <ModalHeaderContainer>
          <ModalHeader>{headerTitle}</ModalHeader>
          {closable && onClose && (
            <CloseButton onClick={onClose}>
              <CloseIcon />
            </CloseButton>
          )}
        </ModalHeaderContainer>
        {children}
      </ModalInner>
    </ModalOuter>
  );
};
