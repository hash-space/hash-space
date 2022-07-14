import Link from 'next/link';
import { PageWrapper } from '../src/components/PageWrapper';
import { Container, Paper, Box } from '@mui/material';
import { Typography, Button, ButtonGroup, Alert,Switch } from '@mui/material';
import { gql, useQuery } from 'urql';
import { useMemo } from 'react';
import * as React from 'react';
import { useEthersAppContext } from 'eth-hooks/context';
import { useState, useEffect } from 'react';
import { const_web3DialogClosedByUser } from 'eth-hooks/models';



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

const QUERY_1 = gql`
  query getData($walletAddress: String!) {
    stepTrackingEntities(
        first: 1
        where : {
            id: $walletAddress
        }
        orderBy: totalSteps
        orderDirection: desc
    ) {
        id
        totalSteps
    }
    planetConquerEntities(
        first: 1
        where : {
            id: $walletAddress
        }
        orderBy: numSyncs
        orderDirection: desc
    ) {
        id
        numSyncs    
    }
  }
`;



export default function challenge() {

    let totalSteps = 0;
    let planetsVisited = 0;

    const ethersAppContext = useEthersAppContext();
    const account = ethersAppContext.account;
    // const account = ethersAppContext.account != undefined ? "0x21a1bff1838dcb34bdf75fcfac77a6556cfb84a6" : undefined;
    const [result,_] = useQuery({
        query: QUERY_1,
        requestPolicy: 'network-only',
        variables: { "walletAddress": account },
        context: useMemo(
            () => ({
              url: 'https://api.thegraph.com/subgraphs/name/hash-space/hash-space',
            }),
            []
        ),
    });   

    if(ethersAppContext.account == undefined) {
        return(
            <PageWrapper>
                <Container maxWidth="sm">
                    <Box sx={{ height: 10 }} />
                    <Paper style={{ padding: '10px' }}>
                        <Typography variant="h5" gutterBottom>
                            <b>Connect your wallet</b>
                        </Typography>
                    </Paper>
                </Container>
            </PageWrapper>
        )
    }
    
    if(result.fetching) {
        return(
            <PageWrapper>
                <Container maxWidth="sm">
                    <Box sx={{ height: 10 }} />
                    <Paper style={{ padding: '10px' }}>
                        <Typography variant="h5" gutterBottom>
                            <b>Loading.........</b>
                        </Typography>
                    </Paper>
                </Container>
            </PageWrapper>
        )
    } else {        
        if(result.error != undefined) {
            return(
                <PageWrapper>
                    <Container maxWidth="sm">
                        <Box sx={{ height: 10 }} />
                        <Paper style={{ padding: '10px' }}>
                            <Typography variant="h5" gutterBottom>
                                <b>Something went wrong</b>
                            </Typography>
                        </Paper>
                    </Container>
                </PageWrapper>
            )
        }
        if(result.data.stepTrackingEntities.length > 0) {
            totalSteps = result.data.stepTrackingEntities[0]["totalSteps"];
            console.log(result.data.stepTrackingEntities)
        }
        if(result.data.planetConquerEntities.length > 0) {
            planetsVisited = result.data.planetConquerEntities[0]["numSyncs"];
        }        
    }


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
                        You have taken {totalSteps} steps. 
                        <Switch disabled defaultChecked={totalSteps > 0} onChange={()=>false}/>
                        {
                            totalSteps > 0 ? (
                                <>
                                    <br/>
                                    <b><u>Completed.</u></b>
                                </>
                            ) : (
                                <>
                                    <br/>
                                    <b>
                                        <u>
                                            <i>
                                            You need to sync your steps to complete this challenge.
                                            </i>
                                        </u>
                                    </b>
                                </>
                                
                            )
                        }
                        
                    </Typography>
                </Paper>
                <Box sx={{ height: 10 }} />
                <Paper style={{ padding: '10px' }}>
                    <Typography variant="h6" gutterBottom>
                        CHALLENGE 2: Visit 3 planets
                    </Typography>
                     <Typography variant="body1" gutterBottom>
                        You have visited {planetsVisited} steps.
                        <Switch disabled defaultChecked={planetsVisited >= 3} onChange={()=>false}/>
                        {
                            planetsVisited >= 3 ? (
                                <>
                                    <br/>
                                    <b><u>Completed.</u></b>
                                </>
                            ) : (
                                <>
                                    <br/>
                                    <b>
                                        <u>
                                            <i>
                                            You need to visit 3 planets. So far, you have visited {planetsVisited} planet{planetsVisited > 1 ? "s" : ""}
                                            </i>
                                        </u>
                                    </b>
                                </>
                                
                            )
                        }
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