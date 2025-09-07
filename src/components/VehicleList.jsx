import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import {
  LocationOn,
} from '@mui/icons-material';
import { vehicleUtils } from '../services/vehicleService';

const VehicleList = ({ vehicles = [], onVehicleClick }) => {
  const handleRowClick = (vehicle) => {
    onVehicleClick(vehicle);
  };

const formatLastUpdate = (timestamp) => {
  if (!timestamp) return "-";

  try {
    const date = new Date(timestamp);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch (error) {
    return "-";
  }
};

  const formatLocation = (location) => {
    if (!location) return '-';
    
    if (typeof location === 'string') {
      return location;
    }
    
    if (location.lat && location.lng) {
      return vehicleUtils.formatCoordinates(location.lat, location.lng);
    }
    
    if (location.latitude && location.longitude) {
      return vehicleUtils.formatCoordinates(location.latitude, location.longitude);
    }
    
    return '-';
  };

  if (!vehicles.length) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        py={8}
        textAlign="center"
      >
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No vehicles found
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Try adjusting your filters or check back later.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      elevation={0}
      sx={{ 
        maxHeight: '600px',
        '& .MuiTable-root': {
          minWidth: 800,
        },
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
              Vehicle
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
              Driver
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50',width:'80px' }}>
              Speed
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
              Destination
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
              ETA
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
              Last Update
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
              Location
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow
              key={vehicle.id}
              onClick={() => handleRowClick(vehicle)}
              sx={{
                cursor: 'pointer',
              }}
            >
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight="bold" color="primary" sx={{ fontSize: '0.90rem' }}>
                    {vehicle.vehicleNumber}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight='500' sx={{ fontSize: '0.90rem' }}>
                    {vehicle.driverName || '-'}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell >
                <Chip
                  label={vehicleUtils.formatStatus(vehicle.status)}
                  size="14px"
                  sx={{ fontWeight: 'bold',background:vehicleUtils.getStatusColor(vehicle.status).bg,color:vehicleUtils.getStatusColor(vehicle.status).text,fontSize: '0.80rem',borderRadius:'8px',height:26 }}
                />
              </TableCell>

              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                   <Chip
                  label={vehicleUtils.formatSpeed(vehicle.speed)}
                  sx={{ fontWeight: 'bold',fontSize: '0.80rem',borderRadius:'8px',height:26 }}
                />
                  {/* <Typography variant="body2" sx={{ fontSize: '0.90rem' }}>
                    {vehicleUtils.formatSpeed(vehicle.speed)}
                  </Typography> */}
                </Box>
              </TableCell>

              <TableCell>
                <Tooltip title={vehicle.destination || '-'}>
                <Typography variant="body2" fontWeight='500' noWrap sx={{ maxWidth: 100,fontSize: '0.90rem' }}>
                  {vehicle.destination || '-'}
                </Typography>
                </Tooltip>
              </TableCell>

              <TableCell>
                <Typography variant="body2" fontWeight='500' sx={{ fontSize: '0.90rem' }}>
                  {formatLastUpdate(vehicle.estimatedArrival) || '-'}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body2" fontWeight='500' sx={{ fontSize: '0.90rem' }}>
                  {formatLastUpdate(vehicle.lastUpdated)}
                </Typography>
              </TableCell>

              <TableCell>
                <Tooltip title="View on map">
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight='500' sx={{ fontSize: '0.90rem' }}>
                      {formatLocation(vehicle.currentLocation)}
                    </Typography>
                  </Box>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VehicleList;