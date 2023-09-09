import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

export default function ShowUsers() {

    const [users, setUsers] = useState([]); // Esto es un hook
    useEffect(() => {
        getUsers(); // Esto es lo que se ejecuta cuando se carga la página
    }, []);

    function getUsers() { // Esta función hace una petición GET a la API
        axios.get('http://127.0.0.1:7000/listUsers') // La API está en el puerto 7000
            .then(function(response) {
                console.log(response.data);
                setUsers(response.data); // Se guarda la respuesta en el hook
            })
            .catch(err => { // Si hay un error, se ejecuta esta función
                console.log(err);
            });
    }

    const deleteUser = (id) => {
        axios.delete(`http://127.0.0.1:7000/deleteUser/${id}`).then(function(response) {
            console.log(response.data);
            getUsers();
        }).catch(err => {
            console.log(err);
        });
        alert("Successfully deleted!");
    }

    return (
        <div>
            <div className='container h-100'>
                <div className='row h-100'>
                    <div className='col-12'>
                        <p><Link to="/registerUser" className='btn btn-success'>Add New User</Link></p>
                        <h1>List Users</h1>
                        <table className='table table-bordered table-striped'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, key) =>
                                    <tr key={key}>
                                        <td>{key + 1}</td>
                                        <td>{user.fname + ' ' + user.lname}</td>
                                        <td>{user.uname}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <Link to={`user/${user.id}/edit`} className='btn btn-success' style={{marginRight: "10px"}}>Edit</Link>
                                            <button onClick={() => deleteUser(user.id)} className='btn btn-danger'>Delete</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}