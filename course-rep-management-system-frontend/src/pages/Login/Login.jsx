import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc'; // Google icon
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const handleLogin = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'login failed');
        return;
      }

      console.log('login successful:', data);
    } 
    catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    handleLogin()
  };

  const handleGoogleLogin = () => {
    console.log('Continue with Google clicked');
    // TODO: Add Google auth logic here
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard }>
        <h1 className={styles.appName}>RepTrack</h1>
        <p className={styles.description}>Manage activities efficiently</p>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Email */}
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

          {/* Submit */}
          <button type="submit" className={styles.loginButton}>
            LOGIN
          </button>
        </form>

        {/* OR Divider */}
        <div className={styles.divider}>
          <span>OR</span>
        </div>

        {/* Google Login */}
        <button className={styles.googleButton} onClick={handleGoogleLogin}>
          <FcGoogle size={20} className={styles.googleIcon} />
          Continue with Google
        </button>

        <p className={styles.footerText}>
          Don’t have an account? <a href="#signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;