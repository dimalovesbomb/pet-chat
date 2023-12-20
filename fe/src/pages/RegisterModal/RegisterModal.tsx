import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../../components/Modal/Modal';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import { FileInput } from '../../components/FileInput/FileInput';
import { Label } from '../../components/Label/Label';

interface RegisterModalProps {
  isOpened: boolean;
  formProps: {
    inputValue: string;
    setInputValue: (value: string) => void;
    fileValue: File | null;
    setFileValue: (value: File | null) => void;
    onSubmit: () => void;
  };
}

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 70%;
  margin: auto;
`;

const Block = styled.div`
  margin-bottom: 15px;
`;

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpened, formProps }) => {
  const [fileError, setFileError] = useState('');
  const [inputError, setInputError] = useState('');
  const { inputValue, setInputValue, setFileValue, onSubmit } = formProps;

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxAllowedSize = 1 * 1024 * 1024;
    const targetFileSize = e.target.files?.[0]?.size || 0;

    if (targetFileSize <= maxAllowedSize) {
      setFileValue(e.target.files?.[0] || null);
      setFileError('');
      return;
    }

    setFileError('Max size is 1mb');
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputError('');
    setInputValue(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue.trim()) {
      setInputValue(inputValue.trim());
      onSubmit();
      return;
    }
    setInputError('This is a required field');
  };

  return (
    <Modal isOpened={isOpened} headerTitle="Looks like we need to register you!">
      <form onSubmit={handleSubmit}>
        <FormContainer>
          <Block>
            <Label>We have to register you first! Don't be afraid, we only need your name and your pic :)</Label>
            <Input value={inputValue} error={inputError} onChange={handleInputChange} placeholder="Your name" />
          </Block>
          <Block>
            <FileInput title="And choose your pic! (or don't)" onChange={handleFileInputChange} error={fileError} />
          </Block>
          <Button hasError={!!fileError || !!inputError} type="submit">
            Get me in!
          </Button>
        </FormContainer>
      </form>
    </Modal>
  );
};
