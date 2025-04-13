import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import moment from 'moment';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import Swal from 'sweetalert2';
import '../Accounts/user.css';
import UseAxios from '../../UseAxios/AxiosInstance';

const BASE_URL = `https://lms-n8b3.onrender.com/books/`;
const list_users = `${BASE_URL}list_users`;

function Accounts() {
    const axiosInstance = UseAxios();
    const [users, setUsers] = useState([]);
    const [load, setLoad] = useState(false);

    const fetchUsers = async () => {
        setLoad(true);
        try {
            const response = await axiosInstance.get(list_users);
            // Initialize isUpdating for each user
            const usersWithStatus = response.data.map(user => ({
                ...user,
                isUpdating: false
            }));
            setUsers(usersWithStatus);
        } catch (err) {
            console.log('Error fetching users:', err);
            Swal.fire({
                title: 'Error',
                text: 'Failed to fetch users',
                icon: 'error',
                timer: 3000,
                toast: true,
                position: 'top'
            });
        } finally {
            setLoad(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            const tableId = '#myTable';

            // Destroy existing DataTable if it exists
            if ($.fn.DataTable.isDataTable(tableId)) {
                $(tableId).DataTable().destroy();
            }

            // Initialize DataTable with proper options
            $(tableId).DataTable({
                destroy: true,
                responsive: true,
                autoWidth: false,
                language: {
                    emptyTable: "No users available"
                }
            });
        }

        // Cleanup DataTable on component unmount
        return () => {
            if ($.fn.DataTable.isDataTable('#myTable')) {
                $('#myTable').DataTable().destroy();
            }
        };
    }, [users]);

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                await axiosInstance.delete(`${BASE_URL}delete_user/${id}`);
                
                // Properly update the state by filtering out the deleted user
                setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
                
                // Reinitialize DataTable after state update
                if ($.fn.DataTable.isDataTable('#myTable')) {
                    $('#myTable').DataTable().destroy();
                }
                
                Swal.fire({
                    title: 'Deleted!',
                    text: 'User has been removed',
                    icon: 'success',
                    timer: 3000,
                    toast: true,
                    position: 'top',
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            }
        } catch (err) {
            console.log('Error deleting user:', err);
            Swal.fire({
                title: 'Error',
                text: 'Failed to delete user',
                icon: 'error',
                timer: 3000,
                toast: true,
                position: 'top',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const handleActiveChange = async (id, newStatus) => {
        try {
            // Update local state immediately for better UX
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === id 
                        ? { ...user, isUpdating: true } 
                        : user
                )
            );

            const response = await axiosInstance.patch(
                `${BASE_URL}deactivate_user/${id}`, 
                { is_active: newStatus }
            );

            // Update state with the response from server
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === id
                        ? { 
                            ...user, 
                            is_active: response.data.is_active, 
                            isUpdating: false 
                          }
                        : user
                )
            );

            Swal.fire({
                title: 'Status Updated',
                text: `User is now ${response.data.is_active ? 'Active' : 'Deactivated'}`,
                icon: 'success',
                timer: 3000,
                toast: true,
                position: 'top',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } catch (err) {
            console.log('Error updating status:', err);
            
            // Revert the change on error
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === id
                        ? { ...user, isUpdating: false }
                        : user
                )
            );

            Swal.fire({
                title: 'Error',
                text: 'Failed to update user status',
                icon: 'error',
                timer: 3000,
                toast: true,
                position: 'top',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    return (
        <div className="container-fluid doc_manage px-5 p-2">
            <h6>
                <strong>Manage User Accounts</strong>
            </h6>

            <div className="doctor_table bg-white p-2 col-lg-12 col-sm-12 table-responsive">
                <table id="myTable" className="table table-striped table-hover table-bordered">
                    <thead>
                        <tr className="table-striped">
                            <th scope="col">Id</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Joined</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {load ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    <div className="loader"></div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    <h6>No Users Available</h6>
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => {
                                const { id, email, first_name, last_name, is_active, date_joined, isUpdating } = user;
                                const JoinedPeriod = moment(date_joined).fromNow();
                                return (
                                    <tr key={id}>
                                        <th scope="row">{id}</th>
                                        <td>{first_name}</td>
                                        <td>{last_name}</td>
                                        <td>{email}</td>
                                        <td>{JoinedPeriod}</td>
                                        <td>
                                            <span
                                                className={`activate p-1 rounded text-center ${
                                                    is_active ? 'text-white bg-success' : 'text-white bg-danger'
                                                }`}
                                                onClick={() => !isUpdating && handleActiveChange(id, !is_active)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {isUpdating ? (
                                                    <div className="spinner-border spinner-border-sm" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                ) : is_active ? (
                                                    'Active'
                                                ) : (
                                                    'Deactivated'
                                                )}
                                            </span>
                                        </td>
                                        <td>
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => handleDelete(id)}>
                                                    <DeleteIcon color='error'/>
                                                </IconButton>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Accounts;