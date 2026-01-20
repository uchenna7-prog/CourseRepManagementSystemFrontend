import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  const [message, setMessage] = useState('');

  const handleRegistration = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, middleName, lastName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'Registration failed');
        return;
      }
      console.log('Registration successful:', data);
    } catch {
      setMessage('Something went wrong. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setMessage('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setMessage('');
    handleRegistration();
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.signupCard}>
        <h1 className={styles.appName}>RepTrack</h1>
        <p className={styles.appDescription}>
          Create your account and manage course representatives easily.
        </p>

        {message && <p className={styles.errorMessage}>{message}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* First Name */}
          <div className={styles.inputGroup}>
            <User size={18} />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          {/* Middle Name */}
          <div className={styles.inputGroup}>
            <User size={18} />
            <input
              type="text"
              placeholder="Middle Name (Optional)"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </div>

          {/* Last Name */}
          <div className={styles.inputGroup}>
            <User size={18} />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className={styles.inputGroup}>
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <Lock size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className={styles.inputGroup}>
            <Lock size={18} />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" className={styles.signupBtn}>
            Sign Up
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{' '}
          <Link to="/" className={styles.footerLink}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
