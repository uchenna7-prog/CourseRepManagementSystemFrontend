import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import styles from './Signup.module.css';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleRegistration = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          middleName,
          lastName,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      console.log('Registration successful:', data);
    } 
    catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    handleRegistration();
  };

  return (
    <div className={styles.container}>
      <div className={styles.signupCard}>
        <h1 className={styles.appName}>RepTrack</h1>
        <p className={styles.description}>Create your account</p>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.inputGroup}>
            <User className={styles.icon} size={20} />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Middle Name (Optional) */}
          <div className={styles.inputGroup}>
            <User className={styles.icon} size={20} />
            <input
              type="text"
              placeholder="Middle Name (Optional)"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Surname */}
          <div className={styles.inputGroup}>
            <User className={styles.icon} size={20} />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={styles.input}
            />
          </div>

  
          <div className={styles.inputGroup}>
            <Mail className={styles.icon} size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <Lock className={styles.icon} size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

   
          <div className={styles.inputGroup}>
            <Lock className={styles.icon} size={20} />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

   
          <button type="submit" className={styles.signupButton}>
            SIGN UP
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account? <a href="#login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
