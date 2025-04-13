"use client"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import Nav from "../Navbar/Nav";
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Card,
  CardContent,
  Avatar,
  Grid,
  Divider,
  Button,
  Breadcrumbs,
  Rating,
  Stack,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material"
import {
  ArrowBack as ArrowBackIcon,
  Book as BookIcon,
  Tag as TagIcon,
  Description as FileTextIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  Schedule as ClockIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  Language as LanguageIcon,
  Category as CategoryIcon,
  Bookmark as BookmarkIcon,
  LocalLibrary as LocalLibraryIcon,
} from "@mui/icons-material"
import UseAxios from "../../UseAxios/AxiosInstance"
import Swal from "sweetalert2"

export default function BookDetails() {
    const navigate = useNavigate()
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const axiosInstance = UseAxios()
  const BOOK_DETAIL = `http://127.0.0.1:8000/books/book_detail/${id}`

//   fetch book details
  const fetchDetail = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(BOOK_DETAIL)
      setBook(response.data)
      setError(null)
    } catch (err) {
      console.log('book detail error', err)
      setError(err.response?.data?.message || "Failed to fetch book details")
      setBook(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  console.log(book)

  const getGenreColor = (genre) => {
    const genreMap = {
      Classic: "#8884d8",
      Fiction: "#82ca9d",
      Dystopian: "#ff8042",
      Romance: "#ff6b81",
      Fantasy: "#6a0dad",
      "Coming-of-age": "#f4a261",
      Adventure: "#2a9d8f",
      Historical: "#e9c46a",
      Epic: "#457b9d",
    }
    return genreMap[genre] || "#1976d2"
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case "Available":
        return { icon: <CheckCircleIcon />, color: "#2e7d32", text: "Available" }
      case "Checked Out":
        return { icon: <XCircleIcon />, color: "#d32f2f", text: "Checked Out" }
      case "Reserved":
        return { icon: <ClockIcon />, color: "#ed6c02", text: "Reserved" }
      default:
        return { icon: <CheckCircleIcon />, color: "#2e7d32", text: "Available" }
    }
  }

  const getAvatarLetter = (title) => title?.charAt(0).toUpperCase() || "B"

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress sx={{ color: "#764ba2" }} size={60} thickness={5} />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>
          {error}
        </Alert>
        <Button component={Link} to="/admin/books" startIcon={<ArrowBackIcon />} variant="contained" sx={{ mt: 2 }}>
          Back to Book List
        </Button>
      </Container>
    )
  }

  if (!book) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2, borderRadius: "8px" }}>
          Book not found
        </Alert>
        <Button component={Link} to="/admin/books" startIcon={<ArrowBackIcon />} variant="contained" sx={{ mt: 2 }}>
          Back to Book List
        </Button>
      </Container>
    )
  }

  return (
    <>
    <Nav/>
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
          Dashboard
        </Link>
        <Link to="/user/home" style={{ textDecoration: "none", color: "inherit" }}>
          Books
        </Link>
        <Typography color="text.primary">{book.title}</Typography>
      </Breadcrumbs>

      {/* Header Section */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Button
            component={Link}
            to="/user/home"
            startIcon={<ArrowBackIcon />}
            variant="contained"
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              mr: 2,
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
            }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Book Details
          </Typography>
        </Box>

        <Chip
          icon={getStatusInfo(book.status).icon}
          label={getStatusInfo(book.status).text}
          sx={{
            bgcolor: getStatusInfo(book.status).color,
            color: "white",
            fontWeight: "bold",
            fontSize: "1rem",
            py: 1,
            px: 2,
          }}
        />
      </Paper>

      {/* Book Details Card */}
      <Card
        sx={{
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          overflow: "visible",
          mb: 4,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Grid container>
            {/* Book Cover/Avatar Section */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRight: { md: "1px solid #eee" },
                borderBottom: { xs: "1px solid #eee", md: "none" },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: getGenreColor(book.genre),
                  width: 150,
                  height: 150,
                  fontSize: "4rem",
                  fontWeight: "bold",
                  mb: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                {getAvatarLetter(book.title)}
              </Avatar>

              <Typography variant="h5" component="h2" sx={{ fontWeight: 600, textAlign: "center", mb: 1 }}>
                {book.title}
              </Typography>

              <Typography variant="subtitle1" sx={{ fontStyle: "italic", textAlign: "center", mb: 2 }}>
                by {book.author}
              </Typography>

              <Chip
                icon={<TagIcon fontSize="small" />}
                label={book.genre}
                sx={{
                  bgcolor: getGenreColor(book.genre),
                  color: "white",
                  mb: 2,
                }}
              />

              {/* <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Rating value={4.5} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  4.5/5
                </Typography>
              </Box> */}

              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                {book.copies} {book.copies === 1 ? "copy" : "copies"} available
              </Typography>
            </Grid>

            {/* Book Details Section */}
            <Grid item xs={12} md={8} sx={{ p: 3 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BookmarkIcon sx={{ mr: 1 }} /> Book Information
              </Typography>

              <TableContainer component={Paper} elevation={0} sx={{ mb: 3 }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: "bold", width: "40%" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                          Author
                        </Box>
                      </TableCell>
                      <TableCell>{book.author}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: "bold" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                          Published
                        </Box>
                      </TableCell>
                      <TableCell>{book.published_at}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: "bold" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CategoryIcon fontSize="small" sx={{ mr: 1 }} />
                          Genre
                        </Box>
                      </TableCell>
                      <TableCell>{book.genre}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: "bold" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <FileTextIcon fontSize="small" sx={{ mr: 1 }} />
                          Pages
                        </Box>
                      </TableCell>
                      <TableCell>{book.pages}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: "bold" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LanguageIcon fontSize="small" sx={{ mr: 1 }} />
                          Language
                        </Box>
                      </TableCell>
                      <TableCell>English</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: "bold" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LocalLibraryIcon fontSize="small" sx={{ mr: 1 }} />
                          Status
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          icon={getStatusInfo(book.status).icon}
                          label={getStatusInfo(book.status).text}
                          sx={{
                            bgcolor: getStatusInfo(book.status).color,
                            color: "white",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BookIcon sx={{ mr: 1 }} /> Book Summary
              </Typography>

              <Typography variant="body1" paragraph>
                {book.summary ||
                  "No summary available for this book."}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Borrowing History Section */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: "12px" }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
          Borrowing History
        </Typography>

        <Alert severity="info" sx={{ mb: 2 }}>
          This book has not been borrowed yet.
        </Alert>

        <Button component={Link} to="/user/home" startIcon={<ArrowBackIcon />} variant="contained" sx={{ mt: 2 }}>
          Back to Book List
        </Button>
      </Paper>
    </Container>
    </>
  )
}