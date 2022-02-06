import React, { useState, useEffect } from 'react';
const API = process.env.REACT_APP_API;

export const Users = () => {
  /* api: http://localhost:5000 */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');

  const [editing, setEditing] = useState(false);

  const [buttonName, setButtonName] = useState('Create');

  const [users, setUsers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing) {
      const res = await fetch(`${API}/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      await res.json();
    } else {
      const res = await fetch(`${API}/user/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      await res.json();
      setButtonName('Create');
      setEditing(false);
      setId(null);
    }

    await getUsers();
    setName('');
    setEmail('');
    setPassword('');
  };

  const getUsers = async () => {
    const res = await fetch(`${API}/users`);

    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUser = async (id) => {
    const userResponse = window.confirm('Are you sure you want to delete it?');
    if (userResponse) {
      const res = await fetch(`${API}/user/delete/${id}`, {
        method: 'DELETE',
      });

      await res.json();
      await getUsers();
    }
  };

  const updateUser = async (id) => {
    const res = await fetch(`${API}/user/${id}`);
    const data = await res.json();

    setButtonName('Modify');
    setEditing(true);
    setId(id);
    setName(data.name);
    setEmail(data.email);
    setPassword(data.password);
  };

  return (
    <div className="row">
      <div className="col-md-4">
        <form onSubmit={handleSubmit} className="card card-body">
          <div className="form-group">
            <input type="text" onChange={(e) => setName(e.target.value)} value={name} className="form-control" placeholder="Name" autoFocus />
          </div>

          <div className="form-group">
            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} className="form-control" placeholder="Email" />
          </div>

          <div className="form-group">
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} className="form-control" placeholder="Password" />
          </div>
          <button className="btn btn-primary btn-block">{buttonName}</button>
        </form>
      </div>
      <div className="col-md-6">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>
                  <button className="btn btn-secondary btn-sm btn-block" onClick={() => updateUser(user._id)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm btn-block" onClick={() => deleteUser(user._id)}>
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
