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
    planetConquerEntities(orderBy: $orderBy, first: 10) {
      id
      totalYield
    }
  }
`;

export function YieldLeaderBoard() {
  const rank_metric = 'totalYield';
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
  const entries = users?.data?.planetConquerEntities || [];
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
              <TableCell align="right">Yield earned (base units)</TableCell>
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
