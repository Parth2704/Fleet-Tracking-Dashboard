import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Alert,
  Snackbar,
  Paper,
  Chip,
  Divider,
  Tooltip
} from "@mui/material";
import { Schedule, Wifi } from "@mui/icons-material";
import { vehicleService, vehicleUtils } from "../services/vehicleService";
import StatisticsCards from "./StatisticsCards";
import StatusFilters from "./StatusFilters";
import VehicleList from "./VehicleList";
import VehicleModal from "./VehicleModal";
import LoadingSkeleton from "./LoadingSkeleton";

const FleetDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [liveUpdatesActive, setLiveUpdatesActive] = useState(true);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [seconds,setSeconds] = useState(0)

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await vehicleService.getAllVehicles();
      const vehiclesArray = Array.isArray(data) ? data : [];
      setVehicles(vehiclesArray);
      setFilteredVehicles(vehiclesArray);
    } catch (err) {
      setError("Failed to fetch vehicles data");
      setSnackbarOpen(true);
      setVehicles([]);
      setFilteredVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const data = await vehicleService.getStatistics();
      setStatistics(data || {});
    } catch (err) {
      setStatistics({});
    }
  };

  const handleFilterChange = async (status) => {
    try {
      setActiveFilter(status);
      setLoading(true);

      if (status === "all") {
        setFilteredVehicles(Array.isArray(vehicles) ? vehicles : []);
      } else {
        const filteredData = await vehicleService.getVehiclesByStatus(status);
        setFilteredVehicles(Array.isArray(filteredData) ? filteredData : []);
      }
    } catch (err) {
      setError("Failed to filter vehicles");
      setSnackbarOpen(true);
      setFilteredVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleClick = async (vehicle) => {
    try {
      const detailedVehicle = await vehicleService.getVehicleById(vehicle.id);
      setSelectedVehicle(detailedVehicle || vehicle);
      setModalOpen(true);
    } catch (err) {
      setError("Failed to fetch vehicle details");
      setSnackbarOpen(true);
      setSelectedVehicle(vehicle);
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setError("");
  };

  const getFilterCounts = () => {
    const vehiclesArray = Array.isArray(vehicles) ? vehicles : [];

    const counts = {
      all: vehiclesArray.length,
      idle: 0,
      delivered: 0,
      en_route: 0,
    };

    vehiclesArray.forEach((vehicle) => {
      const status = vehicle.status?.toLowerCase();
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });

    return counts;
  };

  useEffect(() => {
    fetchVehicles();
    fetchStatistics();
  }, []);
  useEffect(() => {
  const timeoutId = setTimeout(() => {
    setSeconds(prev => prev + 1);
  }, 1000);

  return () => {
    clearTimeout(timeoutId);
  };
}, [seconds]);
  useEffect(() => {
    const ws = new WebSocket("wss://case-study-26cf.onrender.com");
    ws.onopen = () => {
      console.log("Connected to WebSocket");
      ws.send("Hello");
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Load Data From Socket:", data.data);
        setSeconds(0)
        setLiveUpdatesActive(true)
        setVehicles(data?.data);
        fetchStatistics()
      } catch (err) {
        setLiveUpdatesActive(false)
        console.error("Failed to parse message:", event.data);
      }
    };
    ws.onclose = () => {
      setLiveUpdatesActive(false)
      console.log("WebSocket disconnected");
    };
    ws.onerror = (error) => {
      setLiveUpdatesActive(false)
      console.error("WebSocket error:", error);
    };
    return () => {
      ws.close();
    };
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography fontSize={{xs:20,sm:26,md:32}} fontWeight="bold" color="primary">
            🚛 Fleet Tracking Dashboard
          </Typography>
          <Typography fontSize={{xs:16,sm:20}}color="textSecondary">
            Real-time vehicle monitoring • LogiNext Case Study
          </Typography>
        </Box>
      </Box>

      <Grid container>
        <Grid item size={{ xs: 12, lg: 3.3 }}>
          <Paper elevation={0}>
            <Paper elevation={0} sx={{ p: {xs:1,md:3} }}>
              <Chip
                icon={<Wifi />}
                label="Live Updates Active"
                color="success"
                variant="outlined"
                sx={{
                  textAlign:'center',
                  width:'100%',
                  height:'40px',
                  borderRadius:'8px',
                  marginBottom:2,
                  animation: liveUpdatesActive ? "pulse 2s infinite" : "none",
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                    "100%": { opacity: 1 },
                  },
                }}
              />
              <Typography variant="h6" fontWeight="bold" mb={{xs:1,md:2}}>
                Filter by Status
              </Typography>
              <StatusFilters
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                filterCounts={getFilterCounts()}
              />
            </Paper>
            <Divider />
            <Paper elevation={0} sx={{ p: {xs:1,md:3} }}>
              <Typography variant="h6" fontWeight="bold" mb={{xs:1,md:2}}>
                Fleet Statistics
              </Typography>
              <StatisticsCards statistics={statistics} vehicles={vehicles} />
              <Tooltip title={`Updated ${vehicleUtils.formatAgo(seconds)} ago • Next update in ~ 3 minutes`}>
               <Chip
                icon={<Schedule sx={{width:'18px'}}/>}
                label={`Updated ${vehicleUtils.formatAgo(seconds)} ago • Next update in ~ 3 minutes`}
                sx={{
                  textAlign:'center',
                  color:'rgba(0, 0, 0, 0.6)',
                  background:'#efefefff',
                  width:'100%',
                  height:'40px',
                  borderRadius:'8px',
                  marginTop:2,
                  padding:'0px 8px'
                }}
              />
              </Tooltip>
            </Paper>
          </Paper>
        </Grid>
        <Grid item size={{ xs: 12, lg: 8.7 }}>
          <Paper elevation={0} sx={{ borderLeft:{xs:'none',lg:'1px solid #ccc'},p: '16px 0' }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={{xs:1,md:3}}
              p={'0 16px'}
            >
              <Typography variant="h6" fontWeight="bold">
                Vehicles (
                {Array.isArray(filteredVehicles) ? filteredVehicles.length : 0})
              </Typography>
              <Chip
                label="Live"
                color="success"
                variant="outlined"
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            </Box>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <VehicleList
                vehicles={filteredVehicles}
                onVehicleClick={handleVehicleClick}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
      <VehicleModal
        open={modalOpen}
        vehicle={selectedVehicle}
        onClose={handleModalClose}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FleetDashboard;
