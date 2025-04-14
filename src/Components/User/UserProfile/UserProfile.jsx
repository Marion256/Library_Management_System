"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { 
  Avatar, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Chip, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogActions, 
  TextField, 
  Typography,
  Box,
  Skeleton,
  CircularProgress,
  Paper,
  Alert
} from "@mui/material"
import {
  ArrowBack as ArrowBackIcon,
  Book as BookIcon
} from "@mui/icons-material"

import { AuthContext } from '../../Context/AuthProvider';
import UseAxios from '../../UseAxios/AxiosInstance';
import moment from 'moment'
import useHook from '../../CustomHook/UseHook';
// import '../Profile/profile.css'
import Nav from "../Navbar/Nav";

const BORROWED_BOOKS = 'http://127.0.0.1:8000/books/borrowed_books'

export default function UserProfile() {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [borrowedBooks, setBorrowedBooks] = useState([])
  const { user } = useContext(AuthContext);
  const axiosInstance = UseAxios();
  const { person, setPerson, dateFormat, isLoading } = useHook();
  const [loader, setLoader] = useState(false)

  const relativeTime = moment(person.date_joined).fromNow();
  const navigate = useNavigate()

  // fetch borrowed books
  const fetchBorrowedBooks = async()=>{
     try{
      setLoader(true)
      const response = await axiosInstance.get(BORROWED_BOOKS)
      const data = response.data
      console.log(data)
      setBorrowedBooks(data)
      setLoader(false)
     }catch(err){
      console.log('failed to fetch borrowed books', err)
     }
  }

  useEffect(()=>{
    fetchBorrowedBooks()
  }, [])

  const handleUser = (e) => {
    const { name, value } = e.target;
    setPerson({ ...person, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axiosInstance.put(
        `/books/update_user/${user?.user_id}`,
        person
      );
      setShowEditDialog(false);
      // Add success notification here if needed
    } catch (error) {
      console.error('Error updating profile:', error);
      // Add error notification here if needed
    } finally {
      setIsSubmitting(false);
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return "Not Available"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return "U"
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
  }

  if (isLoading) {
    return <ProfileSkeleton />
  }

  return (
    <>
    <Nav/>
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4, px: 2 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardHeader
          sx={{ pb: 0 }}
          title={
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-start', gap: 2 }}>
              <Avatar 
                sx={{ width: 64, height: 64 }}
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${person?.username}`}
                alt={person?.username}
              >
                {getInitials(person?.first_name, person?.last_name)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" component="h2">{person?.username}</Typography>
                <Typography color="text.secondary">{person?.email}</Typography>
              </Box>
              <Button 
                variant="contained" 
                onClick={() => setShowEditDialog(true)}
                sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
              >
                Edit Profile
              </Button>
            </Box>
          }
        />
        <CardContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">First Name</Typography>
              <Typography variant="body1">{person?.first_name || "Not Available"}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Last Name</Typography>
              <Typography variant="body1">{person?.last_name || "Not Available"}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Date Joined</Typography>
              <Typography variant="body1">{formatDate(person?.date_joined)}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Status</Typography>
              <Chip label={person.is_staff ? 'Admin' : 'User'} color="primary" />
            </Box>
          </Box>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{ width: 48, height: 48 }}
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${person?.username}`}
                alt={person?.username}
              >
                {getInitials(person?.first_name, person?.last_name)}
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight="medium">{person?.email}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Joined {relativeTime}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      {person && (
        <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)}>
          <DialogContent sx={{ minWidth: 400 }}>
            <DialogTitle>Edit Profile</DialogTitle>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Box sx={{ display: 'grid', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={person.email}
                  onChange={handleUser}
                />
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={person.username}
                  onChange={handleUser}
                  required
                />
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={person.first_name}
                  onChange={handleUser}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={person.last_name}
                  onChange={handleUser}
                />
              </Box>
              <DialogActions sx={{ mt: 3 }}>
                <Button 
                  onClick={() => setShowEditDialog(false)}
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  variant="contained"
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      )}

       {/* Borrowing History Section */}
       <Paper elevation={3} sx={{ p: 3, borderRadius: "12px" }} className="mt-3">
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
          Borrowing History
        </Typography>

        {loader ? (<CircularProgress/>) : (
          <>
              {borrowedBooks?.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                This book has not been borrowed yet.
              </Alert>
             )} 

             {borrowedBooks.map(books =>{
              const {id, book} = books
              return (
                <>
                <Box className='d-flex' gap={5}>
                <Typography variant="body2" component="h5" sx={{ fontWeight: 400, mb: 2 }}>
                  <BookIcon/> {book.title}
              </Typography>

              <Typography variant="body1" component="h5" sx={{ fontWeight: 100, mb: 2 }}>
                 Borrowed {borrowedBooks.filter(borrowed => borrowed.book.title === book.title).length} times
              </Typography>
                </Box>
                </>
              )
             })}
          </>
        )}

        <Button component={Link} to="/user/home" startIcon={<ArrowBackIcon />} variant="contained" sx={{ mt: 2 }}>
          Back to Book List
        </Button>
      </Paper>
    </Box>
    </>
  )
}

// Skeleton loader component for the profile page
function ProfileSkeleton() {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4, px: 2 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardHeader
          sx={{ pb: 0 }}
          title={
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-start', gap: 2 }}>
              <Skeleton variant="circular" width={64} height={64} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width={200} height={40} />
                <Skeleton variant="text" width={250} height={24} />
              </Box>
              <Skeleton variant="rectangular" width={120} height={40} />
            </Box>
          }
        />
        <CardContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i}>
                <Skeleton variant="text" width={100} height={24} />
                <Skeleton variant="text" width={160} height={32} />
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="circular" width={48} height={48} />
              <Box>
                <Skeleton variant="text" width={200} height={28} />
                <Skeleton variant="text" width={150} height={24} />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>

  )
}