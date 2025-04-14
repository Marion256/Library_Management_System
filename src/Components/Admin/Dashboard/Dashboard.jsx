"use client"

import React, { useContext, useEffect, useState } from "react"
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Chip,
  LinearProgress,
} from "@mui/material"
import {
  Person as PersonIcon,
  Book as BookIcon,
  CalendarToday as CalendarIcon,
  TrendingUp,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material"
import { AuthContext } from "../../Context/AuthProvider"

import UseAxios from "../../UseAxios/AxiosInstance"

const BASE_URL = "https://lms-n8b3.onrender.com/books/"

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const axiosInstance = UseAxios()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const LIST_USERS = `${BASE_URL}list_users`
  const LIST_RESERVATIONS = `${BASE_URL}list_reservations`
  const [users, setUsers] = useState([])
  const [reservations, setReservations] = useState([])

  // fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(LIST_USERS)
      const data = response.data.filter((user) => user.is_customer === true)
      setUsers(data)
    } catch (err) {
      console.log("user fetch err", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch reservations
  const fetchReservations = async()=>{
    try{
      setLoading(true)
      const response = await axiosInstance.get(LIST_RESERVATIONS)
      const data = response.data
       setReservations(data)
       setLoading(false)
    }catch(err){
      console.log('err fetching reservations', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchReservations()
  }, [])

  const theme = useTheme()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  // format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const month = date.toLocaleString("en-US", { month: "short" })
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  // Recent reservations data
  const recentReservations = [
    { book: "The Great Gatsby", user: "John Doe", status: "Reserved" },
    { book: "To Kill a Mockingbird", user: "Alice Smith", status: "Checked Out" },
    { book: "1984", user: "Robert Johnson", status: "Overdue" },
    { book: "Pride and Prejudice", user: "Emma Wilson", status: "Reserved" },
  ]

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning"
      case "Returned":
        return "success"
      case "Taken":
        return "error"
      default:
        return "default"
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <CalendarIcon fontSize="small" />
      case "Returned":
        return <ArrowUpward fontSize="small" />
      case "Taken":
        return <ArrowDownward fontSize="small" />
      default:
        return null
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        pb: 4,
      }}
    >
      {/* Main content */}
      <Box>
        <Container maxWidth="lg" sx={{ pt: 4 }}>
          {/* Header */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
            }}
          >
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary.dark" sx={{ mb: 1 }}>
                Dashboard Overview
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "text.secondary",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                Welcome{" "}
                <Typography component="span" fontWeight="bold" color="primary.main">
                  {user.first_name}
                </Typography>
                <span role="img" aria-label="wave">
                  👋
                </span>{" "}
                Hope you get a good experience
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: { xs: 2, sm: 0 },
              }}
            >
             
            </Box>
          </Box>

          {/* Overview Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  height: "100%",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
                  borderRadius: 2,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography color="text.secondary" variant="subtitle2" fontWeight="medium">
                      TOTAL USERS
                    </Typography>
                    <Avatar
                      sx={{
                        bgcolor: "primary.light",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <PersonIcon sx={{ color: "white" }} />
                    </Avatar>
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="bold" sx={{ mb: 1 }}>
                    {loading ? <LinearProgress sx={{ my: 2 }} /> : users?.length || 0}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "success.main",
                    }}
                  >
                    <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" fontWeight="medium">
                      +12% from last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  height: "100%",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
                  borderRadius: 2,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography color="text.secondary" variant="subtitle2" fontWeight="medium">
                      RESERVATIONS
                    </Typography>
                    <Avatar
                      sx={{
                        bgcolor: "secondary.light",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <CalendarIcon sx={{ color: "white" }} />
                    </Avatar>
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="bold" sx={{ mb: 1 }}>
                    {loading ? <LinearProgress sx={{ my: 2 }} /> : reservations?.length || 0}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "success.main",
                    }}
                  >
                    <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" fontWeight="medium">
                      +5% from last week
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Activity */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card
                sx={{
                  boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 3, pb: 1 }}>
                    <Typography variant="h6" component="div" fontWeight="bold">
                      Recent Users
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      List of recently registered users
                    </Typography>
                  </Box>
                  {loading ? (
                    <LinearProgress />
                  ) : (
                    <TableContainer>
                      <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {users?.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                <Typography variant="body1" color="text.secondary">
                                  No Users found
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}

                          {users.slice(0, 5).map((user) => (
                            <TableRow
                              key={user.id}
                              hover
                              sx={{
                                "&:hover": {
                                  backgroundColor: "rgba(0,0,0,0.02)",
                                },
                              }}
                            >
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Avatar
                                    sx={{
                                      width: 36,
                                      height: 36,
                                      mr: 1.5,
                                      bgcolor: `${theme.palette.primary.main}${user.id * 20}`,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {user.first_name.charAt(0)}
                                    {user.last_name.charAt(0)}
                                  </Avatar>
                                  <Typography variant="body2" fontWeight="medium">
                                    {user.first_name} {user.last_name}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{user.email}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{formatDate(user.date_joined)}</Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card
                sx={{
                  boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 3, pb: 1 }}>
                    <Typography variant="h6" component="div" fontWeight="bold">
                      Recent Reservations
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Latest book reservation activities
                    </Typography>
                  </Box>
                     {loading ? (
                      <LinearProgress/>
                     ) : (
                      <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead sx={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Book</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reservations.slice(0,5).map((reservation, index) => (
                          <TableRow
                            key={index}
                            hover
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.02)",
                              },
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar
                                  sx={{
                                    width: 36,
                                    height: 36,
                                    mr: 1.5,
                                    bgcolor: `${theme.palette.secondary.main}${index * 20}`,
                                  }}
                                >
                                  <BookIcon fontSize="small" />
                                </Avatar>
                                <Typography variant="body2" fontWeight="medium">
                                  {reservation.book.title}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{reservation.user.first_name} {reservation.user.last_name}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={reservation.status}
                                color={getStatusColor(reservation.status)}
                                icon={getStatusIcon(reservation.status)}
                                sx={{
                                  fontWeight: "medium",
                                  minWidth: 100,
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                     )}
                  
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default Dashboard
