import React, { isValidElement } from 'react';
import styled from 'styled-components';
import { colors } from '../../shared/colors';
import { InputErrorMessage } from '../InputErrorMessage/InputErrorMessage';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: 'search' | React.ReactElement;
  required?: boolean;
  error?: string;
}

const ComponentContainer = styled.div`
  position: relative;
  width: 100%;
`;

const InputContainer = styled('div')<{ hasError: boolean }>(({ hasError }) => {
  return {
    display: 'flex',
    position: 'relative',
    border: `2px solid ${hasError ? colors.red.primary : colors.green.light}`,
    borderRadius: '5px',
    backgroundColor: colors.componentsBackground.primary,
  };
});

const IconContainer = styled.div`
  margin: auto;
  padding-right: 10px;
`;

const InputBase = styled.input`
  border: transparent;
  width: 100%;
  min-height: 25px;
  padding-left: 5px;
  background-color: ${colors.componentsBackground.primary};

  &::placeholder {
    font-style: italic;
  }

  &:placeholder-shown {
    text-overflow: ellipsis;
  }
`;

const ErrorMessageContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 0;
`;

const SVG = () => {
  return (
    <svg
      fill="#c3d2e9"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="15px"
      height="15px"
      viewBox="0 0 390.704 390.704"
      xmlSpace="preserve"
      stroke="#c3d2e9"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <g>
          <g>
            <path d="M379.711,326.556L265.343,212.188c30.826-54.189,23.166-124.495-23.001-170.663c-55.367-55.366-145.453-55.366-200.818,0 c-55.365,55.366-55.366,145.452,0,200.818c46.167,46.167,116.474,53.827,170.663,23.001l114.367,114.369 c14.655,14.655,38.503,14.654,53.157,0C394.367,365.059,394.368,341.212,379.711,326.556z M214.057,214.059 c-39.77,39.771-104.479,39.771-144.25,0c-39.77-39.77-39.77-104.48,0-144.25c39.771-39.77,104.48-39.77,144.25,0 C253.828,109.579,253.827,174.29,214.057,214.059z"></path>{' '}
          </g>
        </g>
      </g>
    </svg>
  );
};

export const Input: React.FC<InputProps> = ({ value, onChange, placeholder, icon, required = false, error }) => {
  const renderIcon = () => {
    if (icon === 'search') {
      return (
        <IconContainer>
          <SVG />
        </IconContainer>
      );
    }
    if (isValidElement(icon)) {
      return <IconContainer>{icon}</IconContainer>;
    }
    return null;
  };

  return (
    <ComponentContainer>
      <InputContainer hasError={!!error}>
        <InputBase value={value} onChange={onChange} placeholder={placeholder} required={required} />
        {renderIcon()}
      </InputContainer>
      <ErrorMessageContainer>{error && <InputErrorMessage>{error}</InputErrorMessage>}</ErrorMessageContainer>
    </ComponentContainer>
  );
};
