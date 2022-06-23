import { gql, useQuery } from 'urql';
import { useMemo } from 'react';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export const QUERY = gql`
  query Board($orderBy: String!) {
    stepTrackingEntities(orderBy: $orderBy, first: 10) {
      id
      totalSteps
      week1Steps
      week2Steps
      week3Steps
      week4Steps
      week5Steps
      week6Steps
      week7Steps
      week8Steps
    }
  }
`;

export function StepLeaderBoard() {
  const rank_metric = 'totalSteps';
  const [users, _] = useQuery({
    query: QUERY,
    requestPolicy: 'network-only',
    variables: { orderBy: rank_metric },
    context: useMemo(
      () => ({
        url: 'https://api.thegraph.com/subgraphs/name/hash-space/hash-space',
      }),
      []
    ),
  });
  const entries = users?.data?.stepTrackingEntities || [];
  const mappedRows = entries.map((entry) => ({
    address: entry.id,
    steps: entry[rank_metric],
  }));

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell align="right">Steps taken</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mappedRows.map((row) => (
              <TableRow
                key={row.address}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.address}
                </TableCell>
                <TableCell align="right">{row.steps}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
