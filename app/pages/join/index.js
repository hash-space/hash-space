import { PageWrapper } from '../../src/components/PageWrapper';
import { Container, Paper, Box, Button, Typography } from '@mui/material';
import { useEthersAppContext } from 'eth-hooks/context';
import { useRouter } from 'next/router'


export default function Join(){
    const router = useRouter()
    const id  = router.query;
    return (
        <PageWrapper>
            <Container maxWidth="sm">
            <Box sx={{ height: 10 }} />
            <Paper style={{ padding: '10px' }}>
                <Typography variant="body1" gutterBottom>
                    {id.invited_by}
                    Join Hash Space
                </Typography>
                <Button
                    color="secondary"
                    variant="outlined"
                    size="small">
                    Register
                </Button>

            </Paper>

            </Container>
        </PageWrapper>
    )
}