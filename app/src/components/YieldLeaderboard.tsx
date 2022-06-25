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
      week1Yield
      week2Yield
      week3Yield
      week4Yield
      week5Yield
      week6Yield
      week7Yield
      week8Yield
      week9Yield
      week10Yield
      week11Yield
      week12Yield
      week13Yield
      week14Yield
      week15Yield
      week16Yield
      week17Yield
      week18Yield
      week19Yield
      week20Yield
      week21Yield
      week22Yield
      week23Yield
      week24Yield
      week25Yield
      week26Yield
      week27Yield
      week28Yield
      week29Yield
      week30Yield
      week31Yield
      week32Yield
      week33Yield
      week34Yield
      week35Yield
      week36Yield
      week37Yield
      week38Yield
      week39Yield
      week40Yield
      week41Yield
      week42Yield
      week43Yield
      week44Yield
      week45Yield
      week46Yield
      week47Yield
      week48Yield
      week49Yield
      week50Yield
      week51Yield
      week52Yield
    }
  }
`;


export function YieldLeaderBoard() {
  const rank_metric = 'totalYield'; // TODO: update to specific week
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
