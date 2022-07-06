import Link from 'next/link';
import { PageWrapper } from '../src/components/PageWrapper';
import { Container, Paper, Box } from '@mui/material';
import { Typography, Button, ButtonGroup, Alert } from '@mui/material';


export default function Challenge() {
    return(
        <PageWrapper>
            <Container maxWidth="sm">
                <Box sx={{ height: 10 }} />
                <Paper style={{ padding: '10px' }}>
                    <Typography variant="h5" gutterBottom>
                        <b>Have you completed the challenges?</b>
                    </Typography>
                </Paper>
            </Container>
        </PageWrapper>
    )
}



