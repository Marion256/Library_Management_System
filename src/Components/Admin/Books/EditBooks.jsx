import React, { useState, useEffect } from 'react'
import '../Books/book.css'
import { useParams, useNavigate } from 'react-router-dom'
import UseAxios from '../../UseAxios/AxiosInstance'
import Swal from 'sweetalert2'

const BASE_URL = 'http://127.0.0.1:8000/books/'

function EditBooks() {
    const { id } = useParams()
    const navigate = useNavigate()
    const EDIT_BOOK = `${BASE_URL}edit_book/${id}`
    const BOOK_DETAIL = `${BASE_URL}book_detail/${id}`
    const axiosInstance = UseAxios()
    
    const [books, setBooks] = useState({
        title: "",
        author: "",
        published_at: "",
        genre: "",
        copies: "",
        pages: "",
        summary: ""
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchDetail = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(BOOK_DETAIL)
            setBooks(response.data)
            setError(null)
        } catch (err) {
            console.log('book detail error', err)
            setError(err.response?.data?.message || "Failed to fetch book details")
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load book details',
                confirmButtonText: 'OK'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDetail()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target
        setBooks({ ...books, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        try {
            const response = await axiosInstance.put(EDIT_BOOK, books)
            
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Book updated successfully',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate(`/admin/book_detail/${id}`)
            })
            
        } catch (err) {
            console.log('update error', err)
            setError(err.response?.data?.message || "Failed to update book")
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'Failed to update book',
                confirmButtonText: 'OK'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="container">
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading book details...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container">
                <div className="alert alert-danger my-4">
                    {error}
                </div>
                <button 
                    className="btn btn-secondary"
                    onClick={() => window.history.back()}
                >
                    Go Back
                </button>
            </div>
        )
    }

    return (
        <div className="container">
            <h4>Update Library Books</h4>
            <form className='add_book_form bg-white p-2 rounded' onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Title
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name='title'
                        value={books.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="author" className="form-label">
                        Author
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="author"
                        name='author'
                        value={books.author}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="genre" className="form-label">
                        Genre
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="genre"
                        name='genre'
                        value={books.genre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="published_at" className="form-label">
                        Published Year
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="published_at"
                        name='published_at'
                        value={books.published_at}
                        onChange={handleChange}
                        required
                        min="1000"
                        max={new Date().getFullYear()}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="copies" className="form-label">
                        Available Copies
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="copies"
                        name='copies'
                        value={books.copies}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="pages" className="form-label">
                        Pages
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="pages"
                        name='pages'
                        value={books.pages}
                        onChange={handleChange}
                        required
                        min="1"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="summary" className="form-label">
                        Brief Summary
                    </label>
                    <textarea
                        className="form-control"
                        id="summary"
                        name='summary'
                        value={books.summary}
                        onChange={handleChange}
                        required
                        rows="3"
                    />
                </div>

                <div className="d-flex justify-content-between">
                    <button 
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                    <button 
                        className='btn btn-primary text-white text-center' 
                        type='submit'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Updating...
                            </>
                        ) : 'Update Book'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditBooks