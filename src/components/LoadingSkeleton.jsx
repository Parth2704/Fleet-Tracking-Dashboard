import React from 'react';
import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const LoadingSkeleton = () => {

  const generateSkeletonRows = (count = 8) => {
    return Array.from({ length: count }, (_, index) => index);
  };

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            {['Vehicle', 'Driver', 'Status', 'Speed', 'Destination', 'ETA', 'Last Update', 'Location'].map((header) => (
              <TableCell key={header}>
                <Skeleton variant="text" width="80%" height={24} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {generateSkeletonRows().map((index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton variant="text" width={60} height={20} />
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Skeleton variant="circular" width={16} height={16} />
                  <Skeleton variant="text" width={100} height={20} />
                </Box>
              </TableCell>
              <TableCell>
                <Skeleton variant="rounded" width={80} height={24} />
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Skeleton variant="circular" width={16} height={16} />
                  <Skeleton variant="text" width={50} height={20} />
                </Box>
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={120} height={20} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={40} height={20} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={80} height={20} />
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Skeleton variant="circular" width={16} height={16} />
                  <Skeleton variant="text" width={90} height={20} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LoadingSkeleton;