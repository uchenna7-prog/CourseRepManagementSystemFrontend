import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import styles from "./Login.module.css";

const Login = () => {
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginUser(email, password);
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        {/* App name & description */}
        <h1 className={styles.appName}>RepTrack</h1>
        <p className={styles.appDescription}>
          Manage course representatives, track activities, and stay organized —
          all in one place.
        </p>

        {error && <p className={styles.errorMessage}>{error}</p>}

        {/* Login form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
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

          {/* Forgot password */}
          <div className={styles.forgotPassword}>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className={styles.loginBtn}>
            Login
          </button>
        </form>

        {/* Divider */}
        <div className={styles.divider}>
          <span>OR</span>
        </div>

        {/* Google login */}
        <button className={styles.googleBtn} type="button">
          <FcGoogle size={20} />
          <span>Continue with Google</span>
        </button>

        {/* Sign up link */}
        <p className={styles.signUpText}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.signUpLink}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
