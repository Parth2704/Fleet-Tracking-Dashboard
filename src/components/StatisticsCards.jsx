import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { DirectionsCar, Speed, PlayArrow, Schedule } from "@mui/icons-material";

const StatisticsCards = ({ statistics, vehicles = [] }) => {
  const getMovingVehicles = () => {
    return vehicles.filter((vehicle) => vehicle.speed && vehicle.speed > 0)
      .length;
  };

  const getAverageSpeed = () => {
    if (!vehicles.length) return 0;
    const totalSpeed = vehicles.reduce(
      (sum, vehicle) => sum + (vehicle.speed || 0),
      0
    );
    return Math.round((totalSpeed / vehicles.length) * 10) / 10;
  };

  const getLastUpdate = () => {
    if (!vehicles.length) return "--:--";
    const latestUpdate = vehicles.reduce((latest, vehicle) => {
      const vehicleTime = new Date(vehicle.lastUpdated);
      const latestTime = new Date(latest);
      return vehicleTime > latestTime
        ? vehicle.lastUpdated
        : latest;
    }, vehicles[0]?.lastUpdated);

    if (!latestUpdate) return "--:--";
    const date = new Date(latestUpdate);
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  const statsConfig = [
    {
      title: "Total Fleet",
      value: statistics.totalVehicles || vehicles.length || 0,
      icon: DirectionsCar,
      color: "primary.main",
      suffix: "",
    },
    {
      title: "Avg Speed",
      value: statistics.averageSpeed || getAverageSpeed(),
      icon: Speed,
      color: "info.main",
      suffix: "",
    },
    {
      title: "Moving",
      value: statistics.movingVehicles || getMovingVehicles(),
      icon: PlayArrow,
      color: "success.main",
      suffix: "",
    },
    {
      title: "Last Update",
      value: statistics.lastUpdated || getLastUpdate(),
      icon: Schedule,
      color: "warning.main",
      suffix: "",
      isTime: true,
    },
  ];

  return (
    <Grid container spacing={{xs:1,md:2}}>
      {statsConfig.map((stat, index) => (
        <Grid item size={{ xs:12,sm:6,md:3,lg:6}} key={index}>
          <Card
            elevation={1}
            sx={{
              boxShadow: 0,
              border: "1px solid #ccc",
              textAlign: "center",
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="text.primary"
                    sx={{ lineHeight: 1 }}
                  >
                    {stat.isTime ? stat.value : `${stat.value}${stat.suffix}`}
                  </Typography>
                  <Box
                    color="text.secondary"
                    sx={{
                      marginTop:'8px',
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap:0.5
                    }}
                  >
                    <stat.icon fontSize="small" />
                    <Typography
                      color="text.secondary"
                      sx={{ mt:0.30,textTransform: "uppercase", letterSpacing: 0.5,fontSize:'0.90rem' }}
                    >
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatisticsCards;
