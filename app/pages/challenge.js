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
                <Box sx={{ height: 10 }} />
                <Paper style={{ padding: '10px' }}>
                    <Typography variant="h6" gutterBottom>
                        CHALLENGE 1: Sync your steps
                    </Typography>
                </Paper>
                <Box sx={{ height: 10 }} />
                <Paper style={{ padding: '10px' }}>
                    <Typography variant="h6" gutterBottom>
                        CHALLENGE 2: Visit 3 planets
                    </Typography>
                </Paper>
                <Box sx={{ height: 10 }} />
                <Paper style={{ padding: '10px' }}>
                    <Typography variant="h6" gutterBottom>
                        CHALLENGE 3: Invite three friends to the game
                    </Typography>
                </Paper>
                <Box sx={{ height: 10 }} />
                <Paper style={{ padding: '10px' }}>
                    <Typography variant="h6" gutterBottom>
                        CHALLENGE 4: Tweet a screenshot from the game
                    </Typography>
                </Paper>
            </Container>
        </PageWrapper>
    )
}

// TODO: add note that invited friends must sync their steps