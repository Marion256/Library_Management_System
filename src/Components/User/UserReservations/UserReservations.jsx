"use client";
import { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import {
  Event as EventIcon,
  PersonAdd,
  Search,
  Phone,
} from "@mui/icons-material";
import axios from "axios";
import { AuthContext } from "../../Context/AuthProvider";
import Select from 'react-select';
import useHook from "../../CustomHook/UseHook";
import UseAxios from "../../UseAxios/AxiosInstance";
import Swal from "sweetalert2";
import Nav from "../Navbar/Nav";

const BASE_URL = 'https://lms-n8b3.onrender.com/books/';

export function UserReservations() {
    const axiosInstance = UseAxios()
  const { user } = useContext(AuthContext);
  const { listBooks, loading: booksLoading } = useHook();
  const [reservations, setReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [reserveLoader, setReserveLoader] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [postReservations, setPostReservations] = useState({
    user: user?.user_id, 
    book: '', 
    copies: '', 
    contact: '', 
    reservation_date: ''
  });
  const [postLoader, setPostLoader] = useState(false)

  const LIST_USER_RESERVATIONS = `${BASE_URL}user_reservations/${user?.user_id}`;
  const POST_RESERVATIONS = `${BASE_URL}post_reservations`;
  const DELETE_RESERVATIONS = `${BASE_URL}delete_reservation/`;

  // fetch user reservations
  const fetchReservations = async () => {
    try {
      setReserveLoader(true);
      const response = await axios.get(LIST_USER_RESERVATIONS);
      const { reserve } = response.data;
      setReservations(reserve);
      setReserveLoader(false);
    } catch (err) {
      console.log('err', err);
      setReserveLoader(false);
    }
  };

  // Convert books into react-select options with title and author
  const BookOptions = listBooks?.map((book) => ({
    value: book.id,
    label: `${book.title} (${book.author})`, // Display both title and author
    title: book.title, // Keep original title for reference
    author: book.author,
    copies: book.copies
  })) || [];

  // Custom option component to show both title and author
  const formatOptionLabel = ({ label, author, copies }) => (
    <div>
      <div>{label}</div>
      <div style={{ fontSize: '0.8rem', color: '#666' }}>
        Available copies: {copies}
      </div>
    </div>
  );

  // Handle book selection change
  const handleBookChange = (selectedOption) => {
    setSelectedBook(selectedOption);
    setPostReservations({ 
      ...postReservations, 
      book: selectedOption ? selectedOption.value : '',
      copies: selectedOption ? Math.min(selectedOption.copies, postReservations.copies || '') : ''
    });
  };

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

  useEffect(() => {
    fetchReservations();
  }, []);

  // Filter reservations based on search query
  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.book?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postReservations.book || !postReservations.copies || 
        !postReservations.contact || !postReservations.reservation_date) {
      return;
    }

    try {
        setPostLoader(true)
      const response = await axiosInstance.post(POST_RESERVATIONS, postReservations);
      
      if (response.data) {
        fetchReservations(); // Refresh the list
        // Reset form
        setPostReservations({
          user: user?.user_id,
          book: '',
          copies: '',
          contact: '',
          reservation_date: ''
        });
        setSelectedBook(null);
        setOpen(false);
        setPostLoader(false)
        Swal.fire({
            title: 'Reservation created successfully',
            icon: "success",
            timer: 6000,
            toast: true,
            position: 'top',
            timerProgressBar: true,
            showConfirmButton: false,
        })
      }
    } catch (err) {
      console.error('Error creating reservation:', err);
      setPostLoader(false)
    }
  };


  return (
    <>
    <Nav/>
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader
          title="Reservations"
          subheader="View and manage all your reservations"
          action={
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <TextField
                size="small"
                placeholder="Search reservations..."
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1 }} />,
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: { xs: "100%", sm: 300 } }}
              />
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => setOpen(true)}
              >
                New Reservation
              </Button>
            </Box>
          }
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Book</TableCell>
                  <TableCell>Copies</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Contact</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reserveLoader ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredReservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                      <Typography color="text.secondary">No reservations found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {reservation.book?.title?.charAt(0)}
                          </Avatar>
                          <div>
                            <div>{reservation.book?.title}</div>
                            <Typography variant="body2" color="text.secondary">
                              {reservation.book?.author}
                            </Typography>
                          </div>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {reservation.copies}
                      </TableCell>
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Phone fontSize="small" />
                          {reservation.contact}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <EventIcon fontSize="small" />
                          {format(new Date(reservation.reservation_date), "MMM d, yyyy")}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={reservation.status} 
                          color={
                            reservation.status === 'Pending' ? 'warning' : 
                            reservation.status === 'Taken' ? 'secondary' : 'success'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Delete">
                          <IconButton onClick={()=>handleDelete(reservation.id)}>
                            <DeleteIcon color='error' />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* New Reservation Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Create New Reservation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Fill in the details to create a new reservation.
            </DialogContentText>
            <Box sx={{ display: "grid", gap: 3, pt: 2 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel shrink>Book</InputLabel>
                  <Select
                    value={selectedBook}
                    onChange={handleBookChange}
                    options={BookOptions}
                    formatOptionLabel={formatOptionLabel}
                    placeholder="Select Book"
                    isLoading={booksLoading}
                    loadingMessage={() => "Loading books..."}
                    noOptionsMessage={() => "No books available"}
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '56px',
                        paddingTop: '8px'
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999
                      }),
                      option: (base) => ({
                        ...base,
                        padding: '8px 12px'
                      })
                    }}
                  />
                </FormControl>
                <TextField
                  label="Copies"
                  type="number"
                  name='copies'
                  value={postReservations.copies}
                  onChange={(e) => {
                    const maxCopies = selectedBook?.copies || Infinity;
                    const value = Math.min(Number(e.target.value), maxCopies);
                    setPostReservations({
                      ...postReservations, 
                      copies: value > 0 ? value : ''
                    });
                  }}
                  inputProps={{
                    min: 1,
                    max: selectedBook?.copies || undefined
                  }}
                  required
                  fullWidth
                  helperText={
                    selectedBook && `Max available: ${selectedBook.copies}`
                  }
                />
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                <TextField
                  label="Phone"
                  name='contact'
                  value={postReservations.contact}
                  onChange={(e) => setPostReservations({
                    ...postReservations, 
                    contact: e.target.value
                  })}
                  required
                  fullWidth
                />
                <TextField
                  type="date"
                  name='reservation_date'
                  value={postReservations.reservation_date}
                  onChange={(e) => setPostReservations({
                    ...postReservations, 
                    reservation_date: e.target.value
                  })}
                  required
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={!postReservations.book || !postReservations.copies || 
                       !postReservations.contact || !postReservations.reservation_date}
            >
              {postLoader ? 'Creating...' : 'Create Reservation'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
    </>
  );
}