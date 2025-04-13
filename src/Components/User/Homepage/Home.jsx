"use client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useHook from "../../CustomHook/UseHook";
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
  Badge,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Book as BookIcon,
  Tag as TagIcon,
  Description as FileTextIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  Schedule as ClockIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import Nav from "../Navbar/Nav";

export default function BookManager() {
  const { listBooks, fetchBooks } = useHook();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(9);
  const [anchorEl, setAnchorEl] = useState(null);

  // Load books data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (!listBooks || listBooks.length === 0) {
          await fetchBooks();
        } else {
          setBooks(listBooks);
          const results = books.filter(book => {
            const fieldValue = String(book[searchBy]).toLowerCase();
            return fieldValue.includes(searchTerm.toLowerCase());
          });
          setFilteredBooks(results);
          setCurrentPage(1); 
        }
      } catch (error) {
        console.error("Error loading books:", error);
        setBooks([]);
        setFilteredBooks([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchBooks, listBooks, searchTerm, searchBy, books]);

  // Filter books based on search criteria
  // useEffect(() => {
  //   if (!searchTerm.trim()) {
  //     setFilteredBooks(books);
  //     return;
  //   }

  //   const searchValue = searchTerm.trim().toLowerCase();
  //   const filtered = books.filter(book => {
  //     switch (searchBy) {
  //       case "title":
  //         return book.title?.toLowerCase().includes(searchValue);
  //       case "author":
  //         return book.author?.toLowerCase().includes(searchValue);
  //       case "genre":
  //         return book.genre?.toLowerCase().includes(searchValue);
  //       default:
  //         return true;
  //     }
  //   });
  //   setFilteredBooks(filtered);
  //   setCurrentPage(1); // Reset to first page when search changes
  // }, [searchTerm, searchBy, books]);

  // Pagination calculations
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchByChange = (value) => {
    setSearchBy(value);
    setAnchorEl(null);
  };

  // Search dropdown handlers
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);


  // Helper functions
  const getGenreColor = (genre) => ({
    Classic: "#8884d8",
    Fiction: "#82ca9d",
    Dystopian: "#ff8042",
    Romance: "#ff6b81",
    Fantasy: "#6a0dad",
    "Coming-of-age": "#f4a261",
    Adventure: "#2a9d8f",
    Historical: "#e9c46a",
    Epic: "#457b9d",
  }[genre] || "#1976d2");

  const getStatusInfo = (status) => ({
    "Available": { icon: <CheckCircleIcon fontSize="small" />, color: "#2e7d32", text: "Available" },
    "Checked Out": { icon: <XCircleIcon fontSize="small" />, color: "#d32f2f", text: "Checked Out" },
    "Reserved": { icon: <ClockIcon fontSize="small" />, color: "#ed6c02", text: "Reserved" },
  }[status] || { icon: <CheckCircleIcon fontSize="small" />, color: "#2e7d32", text: "Available" });

  const getAvatarLetter = (title) => title?.charAt(0)?.toUpperCase() || "B";

  return (
    <>
      <Nav />
      <Container maxWidth="md" sx={{ py: 4 }}>
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

          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: "center" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={`Search by ${searchBy.charAt(0).toUpperCase() + searchBy.slice(1)}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
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
            <Box>
            {/* <TextField
            fullWidth
            variant="outlined"
            placeholder={`Search by ${searchBy}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          /> */}
          
            <Button
            variant="outlined"
            className='bg-secondary text-white'
            onClick={(e) => setAnchorEl(e.currentTarget)}
            endIcon={<ArrowDropDownIcon />}
          >
            {searchBy}
          </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                PaperProps={{ sx: { bgcolor: "rgba(255,255,255,0.95)", color: "#333" } }}
              >
                <MenuItem onClick={() => handleSearchByChange("title")}>Title</MenuItem>
                <MenuItem onClick={() => handleSearchByChange("author")}>Author</MenuItem>
                <MenuItem onClick={() => handleSearchByChange("genre")}>Genre</MenuItem>
              </Menu>
            </Box>
          </Box>

          {!loading && searchTerm.trim() && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Chip
                label={filteredBooks.length > 0 
                  ? `${filteredBooks.length} ${filteredBooks.length === 1 ? "book" : "books"} found`
                  : "No books found"}
                sx={{ 
                  bgcolor: filteredBooks.length > 0 ? "rgba(255,255,255,0.2)" : "rgba(255,0,0,0.2)",
                  color: "white", 
                  fontWeight: "bold" 
                }}
              />
            </Box>
          )}
        </Paper>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress sx={{ color: "#764ba2" }} size={60} thickness={5} />
          </Box>
        ) : filteredBooks.length === 0 && !searchTerm.trim() ? (
          <Alert severity="info" sx={{ borderRadius: "8px", py: 2 }}>
            No books available
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
                            <Link to={`/user/details/${book.id}`}>
                              <Button size="small">View details</Button>
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
                        </Box>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                          <Chip
                            icon={<TagIcon fontSize="small" />}
                            label={book.genre}
                            size="small"
                            sx={{ bgcolor: getGenreColor(book.genre), color: "white" }}
                          />
                          <Chip
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
    </>
  );
}