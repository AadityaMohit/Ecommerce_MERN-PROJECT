import React, { useEffect, useState,useNavigate } from 'react';
import './setting.css';

function Settings() {
  const [username, setUsername] = useState('');
  const [useremail, setUserEmail] = useState('');
  const [userphone, setUserphone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileImage, setProfileImage] = useState('');
  useEffect(() => {
    const lname = localStorage.getItem('username');
    const lemail = localStorage.getItem('useremail');
    const t = localStorage.getItem('token');
    const phone=localStorage.getItem('phone')
    setUserphone(phone)
    console.log(phone);
    
    console.log(t);
   
    setUsername(lname);
    setUserEmail(lemail);
  }, []);
  useEffect(() => {
    const lname = localStorage.getItem('username');
    const lemail = localStorage.getItem('useremail');
    const token = localStorage.getItem('token');

    setUsername(lname);
    setUserEmail(lemail);

 
    fetch('http://localhost:5000/api/auth/profile-image', {
      headers: {
        'auth_token': token,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error('Failed to fetch profile image');
        }
      })
      .then((blob) => {
        const imageUrl = URL.createObjectURL(blob);  
        setProfileImage(imageUrl);  
      })
      .catch((err) => {
        console.error(err);
        setProfileImage(''); 
      });
  }, []);
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/updateuser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth_token': localStorage.getItem('token'),  
        },
        body: JSON.stringify({
          name: username,
          email: useremail,
          phone: userphone, 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('username', username);
        localStorage.setItem('useremail', useremail);
        localStorage.setItem('phone', userphone);
        setIsEditing(false);
        setSuccess('User details updated successfully.');
      } else {
        setError(data.error || 'Failed to update user details.');
      }
    } catch (err) {
      setError('An error occurred while updating user details.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'useremail') {
      setUserEmail(value);
    }  else if (name === 'userphone') {
      setUserphone(value);  
    }else if (name === 'currentPassword') {
      setCurrentPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true);
  };

  const handleChangePasswordSave = async () => {
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/updatepassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth_token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsChangingPassword(false);
        setSuccess('Password updated successfully.');
      } else {
        setError(data.error || 'Failed to update password.');
      }
    } catch (err) {
      setError('An error occurred while updating password.');
    }
  };  
  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action is irreversible.');
    if (!confirmDelete) return;
    try {
      const response = await fetch('http://localhost:5000/api/auth/deleteuser', {
        method: 'DELETE',
        headers: {
          'auth_token': localStorage.getItem('token'),
        },
      });
  
      if (response.ok) {
        alert('Your account has been deleted.');
        localStorage.clear();
        window.location.href = '/login'; 
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete account.');
      }
    } catch (err) {
      alert('An error occurred while deleting the account.');
    }
  };
  
  const handleDeactivateUser = async () => {
    const confirmDeactivate = window.confirm('Are you sure you want to deactivate your account?');
    if (!confirmDeactivate) return;
    try {
      const response = await fetch('http://localhost:5000/api/auth/deactivateuser', {
        method: 'POST',
        headers: {
          'auth_token': localStorage.getItem('token'),
        },
      });
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('useremail');
      localStorage.removeItem('phone');
      if (response.ok) {
        alert('Your account has been deactivated.');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to deactivate account.');
      }
    } catch (err) {
      alert('An error occurred while deactivating the account.');
    }
  };
  
  return (
    <div className="settings-container">
      <h2>User Settings</h2>
      {userphone}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div className="profile-image-container">
        <img src={profileImage || '/default-profile.png'} alt="Profile" style={{height:'200px',width:'200px',textAlign:'center'}} className="profile-image" />
      </div>

      <div className="user-details">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          {isEditing ? (
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
            />
          ) : (
            <p>{username}</p>
          )}
        </div> <div className="form-group">
          <label htmlFor="userphone">Phone:</label>
          {isEditing ? (
            <input
              type="text"
              id="userphone"
              name="userphone"
              value={userphone}
              onChange={handleChange}   
            />
          ) : (
            <p>{userphone}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="useremail">Email:</label>
          {isEditing ? (
            <input
              type="email"
              id="useremail"
              name="useremail"
              value={useremail}
              onChange={handleChange}
            />
          ) : (
            <p>{useremail}</p>
          )}
        </div>
        <div className="button-group">
          {isEditing ? (
            <button onClick={handleSaveClick}>Save Changes</button>
          ) : (
            <button onClick={handleEditClick}>Edit</button>
          )}
        </div>
      </div>

      {/* Password Update Section */}
      <div className="password-update">
        
        <h3>Change Password</h3>
        {isChangingPassword ? (
          <>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password:</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={currentPassword}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div className="button-group">
              <button onClick={handleChangePasswordSave}>Save Password</button>
            </div>
          </>
        ) : (
          <button onClick={handleChangePasswordClick}>Change Password</button>
        )}
      </div>
      <div className="account-actions">
        <h3>Account Actions</h3>
        <div className="button-group">
          <button onClick={handleDeactivateUser}>Deactivate Account</button>
          <button onClick={handleDeleteUser}>Delete Account</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
