import './App.css';
import FleetDashboard from './components/FleetDashboard';
import { theme } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

function App() {
  return (
    <ThemeProvider theme={theme}>
       <CssBaseline />
       <FleetDashboard />
    </ThemeProvider>
  );
}

export default App;
