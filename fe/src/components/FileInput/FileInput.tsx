import React from 'react';
import { InputErrorMessage } from '../InputErrorMessage/InputErrorMessage';
import { Label } from '../Label/Label';

interface FileInputProps {
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const FileInput: React.FC<FileInputProps> = ({ title, onChange, error }) => {
  return (
    <div>
      <Label>{title}</Label>
      <input type="file" accept="image/png, image/gif, image/jpeg" multiple={false} onChange={onChange} />
      {error && <InputErrorMessage>{error}</InputErrorMessage>}
    </div>
  );
};
