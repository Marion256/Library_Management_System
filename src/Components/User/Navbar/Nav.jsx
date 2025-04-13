import React from 'react'
import {Link} from 'react-router-dom'

function Nav() {
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">
      Library Management System
    </a>
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to='/user/home'>
            Home
          </Link>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Reservation
          </a>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to='/user/profile'>
            Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link
          to='/user/logout'
            className="nav-link"
            tabIndex={-1}
          >
            Logout
          </Link>
        </li>
      </ul>
    </div>
  </div>
</nav>

    </>
  )
}

export default Nav
