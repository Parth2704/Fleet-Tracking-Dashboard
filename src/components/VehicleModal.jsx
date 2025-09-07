import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  Close,
  LocalShipping,
  Person,
  Phone,
  LocationOn,
  Battery30,
  LocalGasStation,
  Schedule,
  Speed,
} from '@mui/icons-material';
import { vehicleUtils } from '../services/vehicleService';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const VehicleModal = ({ open, vehicle, onClose }) => {

  const handleClose = () => {
    onClose();
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    return phone.startsWith('+') ? phone : `+${phone}`;
  };

  const getBatteryColor = (level) => {
    if (level > 50) return 'success';
    if (level > 20) return 'warning';
    return 'error';
  };

  const getFuelColor = (level) => {
    if (level > 50) return 'success';
    if (level > 25) return 'warning';
    return 'error';
  };
  const getInfoCards = () => {
    if (!vehicle) return [];

    return [
      {
        title: 'Status',
        value: vehicleUtils.formatStatus(vehicle.status),
        icon: LocalShipping,
        isChip: true,
        chipColor: vehicleUtils.getStatusColor(vehicle.status),
      },
      {
        title: 'Current Speed',
        value: vehicleUtils.formatSpeed(vehicle.speed),
        icon: Speed,
      },
      {
        title: 'Driver',
        value: vehicle.driverName || 'N/A',
        icon: Person,
      },
      {
        title: 'Phone',
        value: formatPhoneNumber(vehicle.driverPhone),
        icon: Phone,
      },
      {
        title: 'Destination',
        value: vehicle.destination || 'N/A',
        icon: LocationOn,
      },
      {
        title: 'Location',
        value: vehicle.currentLocation ? vehicleUtils.formatCoordinates(
          vehicle.currentLocation.lat || vehicle.currentLocation.latitude,
          vehicle.currentLocation.lng || vehicle.currentLocation.longitude
        ) : 'N/A',
        icon: LocationOn,
      },
    ];
  };

  if (!vehicle) return null;

  const infoCards = getInfoCards();
  const batteryLevel = vehicle.batteryLevel || 0;
  const fuelLevel = vehicle.fuelLevel || 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <LocalShipping color="primary" />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {vehicle.vehicleNumber}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {vehicle.driverName} • {vehicleUtils.formatStatus(vehicle.status)}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="large">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: {xs:2,sm:3}}}>
        <Grid container spacing={{xs:1,sm:3}}>
          {infoCards.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <Grid item size={{xs:12, sm:6}} key={index}>
                    <Box display="flex" alignItems="center" gap={2} sx={{padding:2,borderRadius:4,borderLeft:'6px solid #3561e2',background:'#f8f9fa',height:'100%'}}>
                      <IconComponent color="action" />
                      <Box flex={1}>
                        <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase' }}>
                          {info.title}
                        </Typography>
                        {info.isChip ? (
                          <Box mt={1}>
                              <Chip
                            icon={info.value === 'DELIVERED' && <CheckBoxIcon sx={{color:`${info.chipColor.text} !important`}}/>}
                              label={info.value}
                              size="medium"
                              sx={{ fontWeight: 'bold',background:info.chipColor.bg,color:info.chipColor.text,borderRadius:'8px',fontSize:'14px',height:'40px' }}
                            />
                          </Box>
                        ) : (
                          <Typography fontWeight="600" sx={{ fontSize:"16px",wordBreak: 'break-word' }}>
                            {info.value}
                          </Typography>
                        )}
                      </Box>
                    </Box>
              </Grid>
            );
          })}

          <Grid item size={{xs:12, sm:6}}>
            <Box sx={{padding:2,borderRadius:4,borderLeft:'6px solid #3561e2',background:'#f8f9fa',}}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Battery30 color="action" />
                  <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase' }}>
                    Battery Level
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box flex={1}>
                    <LinearProgress
                      variant="determinate"
                      value={batteryLevel}
                      color={getBatteryColor(batteryLevel)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {batteryLevel}%
                  </Typography>
                </Box>
                </Box>
          </Grid>

          <Grid item size={{xs:12, sm:6}}>
            <Box sx={{padding:2,borderRadius:4,borderLeft:'6px solid #3561e2',background:'#f8f9fa',}}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <LocalGasStation color="action" />
                  <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase' }}>
                    Fuel Level
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box flex={1}>
                    <LinearProgress
                      variant="determinate"
                      value={fuelLevel}
                      color={getFuelColor(fuelLevel)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {fuelLevel}%
                  </Typography>
                </Box>
                </Box>
          </Grid>

          <Grid item size={{xs:12, sm:6}}>
            <Box display="flex" alignItems="center" gap={2} sx={{padding:2,borderRadius:4,borderLeft:'6px solid #3561e2',background:'#f8f9fa',}}>
                  <Schedule color="action" />
                  <Box>
                    <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase' }}>
                      Last Updated
                    </Typography>
                    <Typography fontWeight="600" fontSize={16}>
                      {vehicle.lastUpdated 
                        ? new Date(vehicle.lastUpdated).toLocaleString()
                        : 'N/A'
                      }
                    </Typography>
                  </Box>
                </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleModal;