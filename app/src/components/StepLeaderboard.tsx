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
    stepTrackingEntities(orderBy: $orderBy, first: 10, orderDirection: "desc") {
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
      week9Steps
      week10Steps
      week11Steps
      week12Steps
      week13Steps
      week14Steps
      week15Steps
      week16Steps
      week17Steps
      week18Steps
      week19Steps
      week20Steps
      week21Steps
      week22Steps
      week23Steps
      week24Steps
      week25Steps
      week26Steps
      week27Steps
      week28Steps
      week29Steps
      week30Steps
      week31Steps
      week32Steps
      week33Steps
      week34Steps
      week35Steps
      week36Steps
      week37Steps
      week38Steps
      week39Steps
      week40Steps
      week41Steps
      week42Steps
      week43Steps
      week44Steps
      week45Steps
      week46Steps
      week47Steps
      week48Steps
      week49Steps
      week50Steps
      week51Steps
      week52Steps
    }
  }
`;

function getWeekNumber(d: Date) {
  var currentDate = new Date(d.getTime());
  const firstJanThisYear = new Date(0);
  firstJanThisYear.setUTCDate(1);
  firstJanThisYear.setUTCFullYear(currentDate.getUTCFullYear());
  firstJanThisYear.setUTCHours(1);
  firstJanThisYear.setUTCMinutes(1);
  firstJanThisYear.setUTCSeconds(1);

  var diff = currentDate.getTime() - firstJanThisYear.getTime();
  var dayNumber = Math.floor(diff / (24 * 60 * 60 * 1000));
  let weekNum = Math.ceil(dayNumber / 7);

  return weekNum;
}

export function StepLeaderBoard() {
  const weekNumber = getWeekNumber(new Date());
  const rank_metric = `week${weekNumber}Steps`;
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
