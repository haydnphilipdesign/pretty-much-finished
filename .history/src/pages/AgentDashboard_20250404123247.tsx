import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  Container,
  Grid,
  Paper,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Theme,
  Button,
  Avatar,
  Divider,
  TextField,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ClosingsTable from '../components/ClosingsTable';
import { Database as DatabaseIcon } from 'lucide-react';

const drawerWidth = 240;

interface MenuItem {
  id: string;
  text: string;
  icon: JSX.Element;
}

const AgentDashboard: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState('overview');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  // Mock data for testing
  const mockClosings = [
    {
      id: '1',
      mlsNumber: 'MLS123456',
      propertyAddress: '123 Main St, City, State',
      clientNames: 'John & Jane Doe',
      submissionDate: '2024-01-15',
      status: 'pending' as const,
    },
    {
      id: '2',
      mlsNumber: 'MLS789012',
      propertyAddress: '456 Oak Ave, City, State',
      clientNames: 'Bob Smith',
      submissionDate: '2024-01-14',
      status: 'in_progress' as const,
    },
    {
      id: '3',
      mlsNumber: 'MLS345678',
      propertyAddress: '789 Pine Rd, City, State',
      clientNames: 'Alice Johnson',
      submissionDate: '2024-01-13',
      status: 'completed' as const,
    },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleEdit = (id: string) => {
    console.log('Edit closing:', id);
  };

  const handleView = (id: string) => {
    console.log('View closing:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete closing:', id);
  };

  const menuItems: MenuItem[] = [
    { id: 'overview', text: 'Overview', icon: <DashboardIcon /> },
    { id: 'closings', text: 'Closings', icon: <DescriptionIcon /> },
    { id: 'clients', text: 'Clients', icon: <PeopleIcon /> },
    { id: 'settings', text: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: 'black',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Agent Portal
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} aria-label="logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  selected={selectedSection === item.id}
                  onClick={() => setSelectedSection(item.id)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {selectedSection === 'overview' && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Active Closings
                    </Typography>
                    <Typography variant="h3" color="primary">
                      {mockClosings.filter((c) => c.status === 'in_progress').length}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Pending Review
                    </Typography>
                    <Typography variant="h3" color="warning.main">
                      {mockClosings.filter((c) => c.status === 'pending').length}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Completed
                    </Typography>
                    <Typography variant="h3" color="success.main">
                      {mockClosings.filter((c) => c.status === 'completed').length}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom>
                      Recent Closings
                    </Typography>
                    <ClosingsTable
                      closings={mockClosings.slice(0, 3)}
                      onEdit={handleEdit}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Quick Actions
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/agent-portal/transaction')}
                      >
                        New Transaction
                      </Button>
                      
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<DatabaseIcon />}
                        onClick={() => navigate('/agent-portal/transaction-with-autofill')}
                      >
                        Test Form with Autofill
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}
            {selectedSection === 'closings' && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom>
                      All Closings
                    </Typography>
                    <ClosingsTable
                      closings={mockClosings}
                      onEdit={handleEdit}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  </Paper>
                </Grid>
              </Grid>
            )}
            {selectedSection === 'clients' && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom>
                      Client Management
                    </Typography>
                    <Typography>Client list will be implemented here.</Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}
            {selectedSection === 'settings' && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: 'primary.main',
                          mr: 2,
                        }}
                      >
                        {/* Assuming user email is used for avatar */}
                        {/* Replace with actual user email or logic to get user email */}
                        {/* For example: {user?.email?.[0].toUpperCase()} */}
                        {/* For this example, we'll use a placeholder */}
                        A
                      </Avatar>
                      <Box>
                        <Typography variant="h5" gutterBottom>
                          Account Settings
                        </Typography>
                        <Typography color="text.secondary">
                          User ID: {/* Replace with actual user ID */}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 3 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          value="agent@example.com"
                          disabled
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleLogout}
                          startIcon={<LogoutIcon />}
                        >
                          Sign Out
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default AgentDashboard; 
