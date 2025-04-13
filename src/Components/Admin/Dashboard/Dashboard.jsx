"use client"

import React, {useContext, useEffect, useState} from "react";
import '../Dashboard/dashboard.css'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  Container,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Book as BookIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {AuthContext} from '../../Context/AuthProvider'
import UseAxios from '../../UseAxios/AxiosInstance'

const BASE_URL = 'https://lms-n8b3.onrender.com/books/'

const Dashboard = () => {
  const {user} = useContext(AuthContext)
  const axiosInstance = UseAxios()
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const LIST_USERS = `${BASE_URL}list_users`

  const [users, setUsers] = useState([])

  // fectch users
  const fetchUsers = async()=>{
    try{
      const response = await axiosInstance.get(LIST_USERS)
      const data = response.data.filter(user => user.is_customer === true)
      console.log(data)
      setUsers(data)
    }catch(err){
      console.log('user fecth err', err)
    }
  }

  useEffect(()=>{
    fetchUsers()
  }, [])

  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

   // format date
   const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString('en-US', { month: 'short' }); // Gets "Feb"
    const day = date.getDate(); // Gets day (e.g., 17)
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`; // Returns "Feb 17"
  };

  // Recent reservations data
  const recentReservations = [
    { book: "The Great Gatsby", user: "John Doe", status: "Reserved" },
    { book: "To Kill a Mockingbird", user: "Alice Smith", status: "Checked Out" },
    { book: "1984", user: "Robert Johnson", status: "Overdue" },
  ];

  return (
    <Box>
      {/* Main content */}
      <Box>
        <Toolbar />
        <Container >
          {/* Header */}
          <Box className='dash_box'>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Dashboard Overview
            </Typography>
          </Box>

          <Typography variant="h6" component="h6" fontWeight="light" className='mt-2'>
              Welcome <strong>{user.first_name}</strong> 👋!! Hope you get a good Experience
            </Typography>

          {/* Overview Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={6}>
                    <div className='row user_row'>
                    <Card sx={{ height: "100%", boxShadow: theme.shadows[2] }} className='col-lg-12 col-md-12 col-sm-12'>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Total Users
                      </Typography>
                      <Typography variant="h3" component="div">
                       {users?.length || 0}
                      </Typography>
                      
                    </Box>
                    <PersonIcon sx={{ fontSize: 60, color: "primary.main", opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
                    </div>
             
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <div className='row reserve_row'>
              <Card sx={{ height: "100%", boxShadow: theme.shadows[2] }} className='col-lg-12 col-md-12 col-sm-12'>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Reservations
                      </Typography>
                      <Typography variant="h3" component="div">
                        89
                      </Typography>
                     
                    </Box>
                    <CalendarIcon sx={{ fontSize: 40, color: "primary.main", opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
              </div>
             
            </Grid>
          </Grid>

          {/* Recent Activity */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div className='row user_table_row'>
              <Card sx={{ boxShadow: theme.shadows[2] }} className='col-lg-12 col-md-12 col-sm-12'>
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 600 }}>
                    Recent Users
                  </Typography>
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <Table sx={{ minWidth: 400 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users?.length === 0 && (<>
                          <TableRow>
                        <TableCell colSpan={7} align="center">
                            No Users found
                          </TableCell>
                        </TableRow>
                        </>)}
                       
                        {users.map((user) => (
                          <TableRow key={user.id} hover>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar sx={{ width: 32, height: 32, mr: 1.5 }} alt={user.first_name} src={user.first_name}/>
                                {user.first_name} {user.last_name}
                              </Box>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{formatDate(user.date_joined)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </CardContent>
              </Card>
                </div>
              
            </Grid>
            <Grid item xs={12} md={6}>
              <div className='row user_reserve_table'>
              <Card sx={{ boxShadow: theme.shadows[2] }} className='col-lg-12 col-md-12 col-sm-12 table-responsive'>
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 600 }}>
                    Recent Reservations
                  </Typography>
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <Table sx={{ minWidth: 400 }} className='table-responsive'>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Book</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentReservations.map((reservation, index) => (
                          <TableRow key={index} hover>
                            <TableCell>{reservation.book}</TableCell>
                            <TableCell>{reservation.user}</TableCell>
                            <TableCell>
                              <Badge
                                variant="dot"
                                color={
                                  reservation.status === "Reserved"
                                    ? "warning"
                                    : reservation.status === "Checked Out"
                                    ? "success"
                                    : "error"
                                }
                                sx={{ mr: 1 }}
                              />
                              {reservation.status}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </CardContent>
              </Card>
              </div>
              
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;