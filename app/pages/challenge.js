import Link from 'next/link';
import { PageWrapper } from '../src/components/PageWrapper';
import { Container, Paper, Box } from '@mui/material';
import { Typography, Button, ButtonGroup, Alert } from '@mui/material';
import { gql, useQuery } from 'urql';
import { useMemo } from 'react';
import * as React from 'react';
import { useEthersAppContext } from 'eth-hooks/context';



// export const QUERY = gql`
//   query Board($where: StepTrackingEntity_filter!) {
//     stepTrackingEntities(
//       first: 5
//       where: $where
//     ) {
//       id
//       totalSteps
//     }
//   }
// `;


export const QUERY_1 = gql`
  query getStepCount($walletAddress: String!) {
    stepTrackingEntities(
      first: 5
      id: $walletAddress
    ) {
      id
      totalSteps
    }
  }
`;


export default function Challenge() {
    const ethersAppContext = useEthersAppContext();

    const result = useQuery({
        query: QUERY_1,
        requestPolicy: 'network-only',
        variables: { "walletAddress": "0x21a1bff1838dcb34bdf75fcfac77a6556cfb84a6" },
        context: useMemo(
            () => ({
              url: 'https://api.thegraph.com/subgraphs/name/hash-space/hash-space',
            }),
            []
        ),
    });
    console.log(result)
    const entries = result?.data?.stepTrackingEntities || [];
    console.log(entries)
    // const mappedRows = entries.map((entry) => ({
        // address: entry.id,
        // steps: entry.totalSteps,
    // }));


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
                    <Typography variant="body1" gutterBottom>
                        You have taken x steps.
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
// TODO: consider turning 'sync your steps' into 'take 10,000 steps' (although an 'easy' one can be helpful)