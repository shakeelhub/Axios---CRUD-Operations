import React, { useState, useEffect } from "react";
import  Axios  from 'axios';

const MockAPIURL = "https://jsonplaceholder.typicode.com/users";

const Crud = () => {
  
  // State variables to manage users data and form inputs  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);

  // Fetch users data from the mock API when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch users data from the mock API
  const fetchUsers = async () => {
    try {
      const response = await Axios.get(MockAPIURL);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users: ", error);
      setLoading(false);
    }
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to add a new user to the mock API
  const addUser = async () => {
    try {
      const response = await Axios.post(MockAPIURL, formData);
      setUsers([...users, response.data]);
      setFormData({
        name: "",
        email: "",
        website: "",
      });
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  };

  // Function to edit a user's data
  const editUser = async (id) => {
    setEditingUserId(id);
    const userToEdit = users.find((user) => user.id === id);
    setFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      website: userToEdit.website,
    });
  };

   // Function to update an existing user's data in the mock API
  const updateUser = async () => {
    try {
      const response = await Axios.put(`${MockAPIURL}/${editingUserId}`, formData);
      const updatedUser = response.data;
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setFormData({
        name: "",
        email: "",
        website: "",
      });
      setEditingUserId(null);
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

   // Function to delete a user from the mock API
  const deleteUser = async (id) => {
    try {
      await Axios.delete(`${MockAPIURL}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  // Function to render the list of users in a table format
  const renderUsers = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    if (users.length === 0) {
      return <p>No users found.</p>;
    }

    return (
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email} - {user.website}
            <button onClick={() => editUser(user.id)} className="btn btn-sm btn-primary">Edit</button>
            <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger">Delete</button>
          </li>
        ))}
      </ul>
    );
  };

  // Return the JSX for the app with form and user list
  return (
    <div className="container mt-5">
      <h1 className="mb-4 justify-content-center text-center">User CRUD App</h1>
      <form onSubmit={(e) => e.preventDefault()} className="mb-3">
        <div className="form-group justify-content-center text-center">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
          class='inp'
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          class='inp'
        />
        <input
          type="text"
          name="website"
          placeholder="Website"
          value={formData.website}
          onChange={handleInputChange}
          required
          class='inp'
        />
         {/* Show "Update User" and "Cancel" buttons if editing a user, otherwise show "Add User" button */}
        {editingUserId ? (
          <>
           <button onClick={updateUser}  className="btn add btn-success mr-2">Update User</button> 
            <button onClick={() => setEditingUserId(null)}  className="btn addbtn-secondary">Cancel</button>
          </>
        ) : (
          <button onClick={addUser} className="btn btn-primary center add">Add User</button>
        )}
        </div>
        
      </form>
      <div className="table-responsive data ">
        <table className="table table-bordered table-striped table-hover my-4">
          <thead>
            <tr>
              <th className="justify-content-center text-center">Name</th>
              <th className="justify-content-center text-center">Email</th>
              <th className="mb-4 justify-content-center text-center">Website</th>
              <th className="mb-4 justify-content-center text-center">Edit</th>
              <th className="mb-4 justify-content-center text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.website}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary justify-content-center text-center"
                    onClick={() => editUser(user.id)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger justify-content-center text-center"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default Crud;
