import { PageWrapper } from '../../src/components/PageWrapper';
import { Container, Paper, Box, Button, Typography } from '@mui/material';
import { useEthersAppContext } from 'eth-hooks/context';
import { useRouter } from 'next/router'
import { useStateContext } from '../../src/context/state';
import DoneIcon from '@mui/icons-material/Done'

export default function Join(){

    const ethersAppContext = useEthersAppContext();
    const { playerContract } = useStateContext();
    const walletConnected = ethersAppContext.active;
    const registered =
    ethersAppContext.active && playerContract.playerState.isSignedUp;
    const router = useRouter()
    const id  = router.query;

    return (
        <PageWrapper>
            <Container maxWidth="sm">
            <Box sx={{ height: 10 }} />
            <Paper style={{ padding: '10px' }}>
                {id.invited_by && 
                <Typography variant="body1" gutterBottom>
                    Invited By:<br/> 
                    {id.invited_by}
                    </Typography>}
                
                <Typography>
                    Join Hash Space
                </Typography>
                <Box sx={{ height: 10 }} />
                <Button
                    disabled={registered || !walletConnected}
                    startIcon={registered ? <DoneIcon /> : null}
                    color="secondary"
                    variant="outlined"
                    onClick={playerContract.playerRegister}
                    size="small">
                    Register
                </Button>

            </Paper>

            </Container>
        </PageWrapper>
    )
}