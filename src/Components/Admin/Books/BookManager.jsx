"use client"
import '../Books/book.css'
import { useState, useEffect } from "react"
import {Link} from 'react-router-dom'
import useHook from '../../CustomHook/UseHook'
import {
  Container,
  Typography,
  TextField,
  Box,
  InputAdornment,
  Pagination,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Card,
  CardContent,
  Avatar,
  Rating,
  Badge,
} from "@mui/material"
import {
  Search as SearchIcon,
  Book as BookIcon,
  Tag as TagIcon,
  // Calendar as CalendarIcon,
  Description as FileTextIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  Schedule as ClockIcon
} from "@mui/icons-material"
import Button from '@mui/material/Button';

export default function BookManager() {
    const { listBooks} = useHook()
    
  // State management
  const [books, setBooks] = useState(listBooks || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchBy, setSearchBy] = useState("title")
  const [currentPage, setCurrentPage] = useState(1)
  const [booksPerPage] = useState(9)

  // Search and filter books
  useEffect(() => {
    setLoading(true)
    try {
      setTimeout(() => {
        const filteredBooks = listBooks.filter((book) => {
          const searchValue = searchTerm.toLowerCase()
          const bookValue = book[searchBy]?.toString().toLowerCase() || ""
          return bookValue.includes(searchValue)
        })
        setBooks(filteredBooks)
        setCurrentPage(1)
        setLoading(false)
      }, 500)
    } catch (err) {
      setError("An error occurred while searching books")
      setLoading(false)
    }
  }, [searchTerm, searchBy, listBooks])

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook)
  const totalPages = Math.ceil(books.length / booksPerPage)

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
        return { icon: <CheckCircleIcon fontSize="small" />, color: "#2e7d32", text: "Available" }
      case "Checked Out":
        return { icon: <XCircleIcon fontSize="small" />, color: "#d32f2f", text: "Checked Out" }
      case "Reserved":
        return { icon: <ClockIcon fontSize="small" />, color: "#ed6c02", text: "Reserved" }
      default:
        return { icon: <CheckCircleIcon fontSize="small" />, color: "#2e7d32", text: "Available" }
    }
  }

  const getAvatarLetter = (title) => title.charAt(0).toUpperCase()

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper elevation={3} sx={{
        p: 3,
        mb: 4,
        borderRadius: "16px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{
          fontWeight: 700,
          textAlign: "center",
          mb: 3,
          textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
        }}>
          Book List
        </Typography>

        <Box sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: "center",
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={`Search by ${searchBy}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "white" }} />
                </InputAdornment>
              ),
              sx: {
                bgcolor: "rgba(255,255,255,0.15)",
                borderRadius: "8px",
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.5)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.7)",
                },
              },
            }}
          />
         <Link to='/admin/add_books'>
         <button className="btn btn-primary rounded p-2 text-white text-center add_book">Add Book</button>
         </Link>
        </Box>

        {searchTerm && !loading && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Chip
              label={`${books.length} books found`}
              sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: "bold" }}
            />
          </Box>
        )}
      </Paper>

      {/* Loading and Error States */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress sx={{ color: "#764ba2" }} size={60} thickness={5} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>
          {error}
        </Alert>
      )}

      {/* Book List */}
      {!loading && books.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: "8px", py: 2 }}>
          No books found. Try a different search term.
        </Alert>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            {currentBooks.map((book) => (
              <Card key={book.id} sx={{
                mb: 2,
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)" },
              }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{
                    display: "flex",
                    p: 3,
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                  }}>
                    <Badge
                      badgeContent={book.copies}
                      color={book.copies > 0 ? "success" : "error"}
                      sx={{ mr: { xs: 0, sm: 3 }, mb: { xs: 2, sm: 0 } }}
                    >
                      <Avatar sx={{
                        bgcolor: getGenreColor(book.genre),
                        width: 60,
                        height: 60,
                        fontSize: "1.8rem",
                        fontWeight: "bold",
                      }}>
                        {getAvatarLetter(book.title)}
                      </Avatar>
                    </Badge>

                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", md: "center" },
                        mb: 1,
                      }}>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                          {book.title}
                        </Typography>

                        <div className="book-btns ms-auto">
                        <Chip
                          icon={getStatusInfo(book.status).icon}
                          label={getStatusInfo(book.status).text}
                          sx={{
                            bgcolor: getStatusInfo(book.status).color,
                            color: "white",
                            mt: { xs: 1, md: 0 },
                          }}
                        />
                        
                        <Link to={`/admin/book_detail/${book.id}`}>
                        <Button size='small' className=''>View details</Button>
                        </Link>
                        </div>
                       
                      </Box>

                      <Box sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: { xs: 1, sm: 2 },
                        mt: 1,
                      }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <BookIcon fontSize="small" sx={{ mr: 1, color: "gray" }} />
                          <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                            {book.author}
                          </Typography>
                        </Box>
                        {/* <Rating value={book.rating} precision={0.1} readOnly size="small" /> */}
                      </Box>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                        <Chip
                          icon={<TagIcon fontSize="small" />}
                          label={book.genre}
                          size="small"
                          sx={{ bgcolor: getGenreColor(book.genre), color: "white" }}
                        />
                        <Chip
                          // icon={<CalendarIcon fontSize="small" />}
                          label={`Published: ${book.published_at}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<FileTextIcon fontSize="small" />}
                          label={`${book.pages} pages`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="secondary"
                showFirstButton
                showLastButton
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  )
}