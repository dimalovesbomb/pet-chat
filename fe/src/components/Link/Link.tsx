import styled from 'styled-components';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { ReactElement } from 'react';

type BaseLinkProps = RouterLinkProps & {
  className?: string;
  children: ReactElement;
};

interface LinkProps {
  isButton?: boolean;
}

const BaseLink: React.FC<BaseLinkProps> = ({ className, to, children }) => {
  return (
    <RouterLink to={to} className={className}>
      {children}
    </RouterLink>
  );
};

export const Link = styled(BaseLink)<LinkProps>((props) => ({
  'text-decoration': props.isButton ? 'none' : 'underline',
}));
