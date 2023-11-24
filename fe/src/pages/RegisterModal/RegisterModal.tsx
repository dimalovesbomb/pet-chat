import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../../components/Modal/Modal';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';

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
  align-items: center;
  flex-direction: column;
  width: 70%;
  margin: auto;
`;

const Block = styled.div`
  margin-bottom: 15px;
`;

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpened, formProps }) => {
  const [fileError, setFileError] = useState('');
  const { inputValue, setInputValue, fileValue, setFileValue, onSubmit } = formProps;

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // validation is off for now
    // if (inputValue.length && !!fileValue) {
    //   setFileValue(fileValue);
    //   onSubmit();
    // }
    onSubmit();
  };
  return (
    <Modal isOpened={isOpened} headerTitle="Looks like we need to register you!">
      <form onSubmit={handleSubmit}>
        <FormContainer>
          <Block>
            <p>We have to register you first! Don't be afraid, we only need your name and your pic :)</p>
            <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Your name" />
          </Block>
          <Block>
            <p>And choose your pic!</p>
            <input
              type="file"
              accept="image/png, image/gif, image/jpeg"
              multiple={false}
              onChange={handleFileInputChange}
            />
            {fileError && <p>{fileError}</p>}
          </Block>

          <Button hasError={!!fileError} type="submit">
            Get me in!
          </Button>
        </FormContainer>
      </form>
    </Modal>
  );
};
