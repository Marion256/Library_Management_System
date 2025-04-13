"use client"
import React, { useEffect, useState } from "react"
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Tooltip,
  TextField,
  InputAdornment,
  Box,
  CircularProgress,
  Menu,
  MenuItem,
  Button,
  Select,
  FormControl,
  InputLabel
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material"
import UseAxios from "../../UseAxios/AxiosInstance"
import Swal from "sweetalert2"

const BASE_URL = 'https://lms-n8b3.onrender.com/books/'

const statusOptions = [
  { value: "Returned", label: "Returned", color: "success" },
  { value: "Taken", label: "Taken", color: "error" },
  { value: "Pending", label: "Pending", color: "warning" },
  { value: "Waiting", label: "Waiting", color: "info" },
];

export default function ReservationTable({
}) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState("")
  const [reservations, setReservations] = useState([])
  const [reserveLoader, setReserveLoader] = useState(false)
  const [statusLoaders, setStatusLoaders] = useState({})
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentReservation, setCurrentReservation] = useState(null)

  const axiosInstance = UseAxios()
  const LIST_RESERVATIONS = `${BASE_URL}list_reservations`
  const DELETE_RESERVATIONS = `${BASE_URL}delete_reservation/`;

  const fetchReservations = async () => {
    try {
      setReserveLoader(true)
      const response = await axiosInstance.get(LIST_RESERVATIONS)
      setReservations(response.data || [])
    } catch (err) {
      console.error('Error fetching reservations:', err)
    } finally {
      setReserveLoader(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const formatDate = (date) => {
    try {
      return date ? new Date(date).toLocaleDateString() : 'N/A'
    } catch {
      return 'Invalid date'
    }
  }

  const filteredReservations = reservations.filter(reservation => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    const bookTitle = reservation?.book?.title?.toLowerCase() || ''
    const userName = reservation?.user?.username?.toLowerCase() || ''
    const firstName = reservation?.user?.first_name?.toLowerCase() || ''
    const lastName = reservation?.user?.last_name?.toLowerCase() || ''
    const contact = reservation?.contact?.toString() || ''
    
    return (
      bookTitle.includes(searchLower) ||
      userName.includes(searchLower) ||
      firstName.includes(searchLower) ||
      lastName.includes(searchLower) ||
      contact.includes(searchLower)
    )
  })

  const paginatedReservations = filteredReservations.slice(
    page * rowsPerPage, 
    page * rowsPerPage + rowsPerPage
  )

  // delete reservation
  const handleDelete = async (id) => {
      try {
        await axiosInstance.delete(`${DELETE_RESERVATIONS}${id}`)
        .then(res =>{
          if(res.status === 200){
              Swal.fire({
                  title: 'Reservation Deleted successfully',
                  icon: "error",
                  timer: 6000,
                  toast: true,
                  position: 'top',
                  timerProgressBar: true,
                  showConfirmButton: false,
              })
          }
        });
      
        fetchReservations(); // Refresh the list after deletion
      } catch (err) {
        console.error('Error deleting reservation:', err);
      }
    };

  const changeStatus = async (id, newStatus) => {
    try {
      setStatusLoaders((prev) => ({ ...prev, [id]: true }));
      await axiosInstance.patch(
        `${BASE_URL}change_status/${id}`,
        { status: newStatus }
      )
      setReservations((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error changing reservation status:", err);
    } finally {
      setStatusLoaders((prev) => ({ ...prev, [id]: false }));
      setAnchorEl(null);
    }
  };

  const handleMenuOpen = (event, reservation) => {
    setAnchorEl(event.currentTarget);
    setCurrentReservation(reservation);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentReservation(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Returned":
        return <CheckCircleIcon color="success" fontSize="small" />;
      case "Taken":
        return <WarningIcon color="error" fontSize="small" />;
      case "Pending":
        return <AccessTimeIcon color="warning" fontSize="small" />;
      default:
        return <AccessTimeIcon color="info" fontSize="small" />;
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by book title, name, or contact..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setPage(0)
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="reservation table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Book Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Copies</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Reservation Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reserveLoader ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredReservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {searchTerm ? "No matching reservations found" : "No reservations available"}
                </TableCell>
              </TableRow>
            ) : (
              paginatedReservations.map((reservation) => (
                <TableRow hover key={reservation.id}>
                  <TableCell>{reservation.book?.title || 'N/A'}</TableCell>
                  <TableCell>{reservation.copies || 'N/A'}</TableCell>
                  <TableCell>
                    {reservation.user?.first_name || ''} {reservation.user?.last_name || ''}
                    {!reservation.user?.first_name && !reservation.user?.last_name && 'N/A'}
                  </TableCell>
                  <TableCell>{formatDate(reservation.reservation_date)}</TableCell>
                  <TableCell>{reservation.contact || 'N/A'}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {statusLoaders[reservation.id] ? (
                        <CircularProgress size={20} />
                      ) : (
                        <>
                          {getStatusIcon(reservation.status)}
                          {reservation.status}
                        </>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        endIcon={<ArrowDropDownIcon />}
                        onClick={(e) => handleMenuOpen(e, reservation)}
                        disabled={statusLoaders[reservation.id]}
                      >
                        Status
                      </Button>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(reservation.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={currentReservation?.status === option.value}
            onClick={() => changeStatus(currentReservation?.id, option.value)}
            disabled={statusLoaders[currentReservation?.id]}
          >
            <Box display="flex" alignItems="center" gap={1}>
              {getStatusIcon(option.value)}
              {option.label}
            </Box>
          </MenuItem>
        ))}
      </Menu>
      
      {!reserveLoader && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredReservations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  )
}