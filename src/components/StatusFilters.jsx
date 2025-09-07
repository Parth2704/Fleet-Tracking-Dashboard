import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Grid,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
const StatusFilters = ({ activeFilter, onFilterChange, filterCounts = {} }) => {
  const filterConfig = [
    {
      key: "all",
      label: "All",
      textColor:'#2664ea',
      color: "#9ba2af",
      count: filterCounts.all || 0,
    },
    {
      key: "idle",
      label: "Idle",
      color: "#ff9800",
      count: filterCounts.idle || 0,
    },
    {
      key: "en_route",
      label: "En Route",
      color: "#5fa4f9",
      count: filterCounts.en_route || 0,
    },
    {
      key: "delivered",
      label: "Delivered",
      color: "#33d298",
      count: filterCounts.delivered || 0,
    },
  ];
  const handleFilterClick = (filterKey) => {
    onFilterChange(filterKey);
  };

  return (
    <List disablePadding>
      <Grid container spacing={{ xs: 0, md: 2 }}>
        {filterConfig.map((filter) => {
          const isActive = activeFilter === filter.key;

          return (
            <Grid item key={filter.key} size={{ xs: 12, sm: 6, md: 3, lg: 6 }}>
              <ListItem
                disablePadding
                sx={{ border: `1px solid ${isActive ? filter?.textColor || filter?.color : '#ccc'}`, borderRadius: 2 }}
              >
                <ListItemButton
                  onClick={() => handleFilterClick(filter.key)}
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 20 }}>
                    <FiberManualRecordIcon
                      sx={{ color: filter.color }}
                      fontSize="14px"
                    />
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Typography
                        fontSize={"0.90rem"}
                        fontWeight={isActive ? 600 : 400}
                        color={
                          isActive ? `${filter?.textColor || filter?.color}` : "text.primary"
                        }
                      >
                        {filter.label} ( {filter.count} )
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </Grid>
          );
        })}
      </Grid>
    </List>
  );
};

export default StatusFilters;
