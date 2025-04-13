import React, { useState } from 'react'
import '../Books/book.css'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import UseAxios from '../../UseAxios/AxiosInstance'

const POST_BOOKS_API = 'https://lms-n8b3.onrender.com/books/add_books'

function AddBooks() {
    const axiosInstance = UseAxios()
    const navigate = useNavigate()
    const [books, setBooks] = useState({
        title: "",
        author: "",
        published_at: "",
        genre: "",
        copies: "",
        pages: "",
        summary: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setBooks({ ...books, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const formdata = new FormData()
            formdata.append('title', books.title)
            formdata.append('author', books.author)
            formdata.append('published_at', books.published_at)
            formdata.append('copies', books.copies)
            formdata.append('pages', books.pages)
            formdata.append('genre', books.genre)
            formdata.append('summary', books.summary)

            await axiosInstance.post(POST_BOOKS_API, formdata)
            .then(res =>{
                if(res.status === 201){
                    Swal.fire({
                        title: 'Success!',
                        text: 'Book added successfully',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    })
                    setIsSubmitting(false)
                }
            })

            // Redirect to admin books page
            navigate('/admin/books')

        } catch (error) {
            console.error('Error adding book:', error)
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to add book',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container">
            <h4>Upload Library Books</h4>
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

                <button 
                    className='btn btn-primary text-white text-center' 
                    type='submit'
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Uploading...' : 'Upload'}
                </button>
            </form>
        </div>
    )
}

export default AddBooks