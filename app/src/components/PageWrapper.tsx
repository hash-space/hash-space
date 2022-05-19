import { Container, Box } from '@mui/material';
import HeaderBar from './HeaderBar';

interface IProps {
  children: React.ReactNode;
}

export function PageWrapper(props: IProps) {
  return (
    <Container maxWidth={false} disableGutters sx={{ minHeight: '100vh' }}>
      <HeaderBar />
      {props.children}
    </Container>
  );
}
