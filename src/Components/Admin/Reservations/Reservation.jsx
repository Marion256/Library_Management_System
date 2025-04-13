"use client"

import React, { useState } from "react"
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
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Warning as WarningIcon,
} from "@mui/icons-material"

export default function ReservationTable({
  reservations = [], // Default empty array if undefined
  onSelectReservation = () => {}, // Default empty function
  onDeleteReservation = () => {}, // Default empty function
}) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

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

  const getStatusChip = (status) => {
    switch (status) {
      case "active":
        return (
          <Chip
            icon={<AccessTimeIcon fontSize="small" />}
            label="Active"
            color="primary"
            size="small"
            variant="outlined"
          />
        )
      case "overdue":
        return (
          <Chip
            icon={<WarningIcon fontSize="small" />}
            label="Overdue"
            color="error"
            size="small"
            variant="outlined"
          />
        )
      case "returned":
        return (
          <Chip
            icon={<CheckCircleIcon fontSize="small" />}
            label="Returned"
            color="success"
            size="small"
            variant="outlined"
          />
        )
      default:
        return <Chip label={status || 'Unknown'} size="small" variant="outlined" />
    }
  }

  // Safe pagination calculation
  const paginatedReservations = Array.isArray(reservations) 
    ? reservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : []

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="reservation table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Book Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Book ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Reservation Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!Array.isArray(reservations) || reservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No reservations found
                </TableCell>
              </TableRow>
            ) : (
              paginatedReservations.map((reservation) => (
                <TableRow hover key={reservation?.id || Math.random()}>
                  <TableCell>{reservation?.bookTitle || 'N/A'}</TableCell>
                  <TableCell>{reservation?.bookId || 'N/A'}</TableCell>
                  <TableCell>{reservation?.userName || 'N/A'}</TableCell>
                  <TableCell>{formatDate(reservation?.reservationDate)}</TableCell>
                  <TableCell>{formatDate(reservation?.dueDate)}</TableCell>
                  <TableCell>{getStatusChip(reservation?.status)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => onSelectReservation(reservation)}
                        color="primary"
                        disabled={!reservation}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => reservation?.id && onDeleteReservation(reservation.id)}
                        color="error"
                        disabled={!reservation?.id}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={Array.isArray(reservations) ? reservations.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          ".MuiTablePagination-toolbar": {
            minHeight: "52px",
          },
        }}
      />
    </Paper>
  )
}