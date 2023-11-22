import styled from 'styled-components';
import { colors } from '../../shared/colors';

interface ButtonProps {
  outline?: 'green' | 'red';
  hasError?: boolean;
}

export const Button = styled('button')<ButtonProps>(({ outline = 'green', hasError = false }) => {
  return {
    backgroundColor: colors.background.dark,
    border: `1px solid ${hasError || outline === 'red' ? colors.red.primary : colors.green.light}`,
    borderRadius: '5px',
    padding: '10px',
    cursor: hasError ? 'none' : 'pointer',
    opacity: hasError ? '.3' : '1',
  };
});
