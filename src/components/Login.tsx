// src/pages/Login.tsx
import { useState, type ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login, isAuthenticating, authError } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const isValidCredentials = () => {
    const errs: string[] = [];
    if (!credentials.email.trim() || !credentials.password.trim()) {
      errs.push('Email and password are required.');
    }
    setFormErrors(errs);
    return errs.length === 0;
  };

  const handleLogin = async () => {
    setFormErrors([]);
    if (!isValidCredentials()) return;

    try {
      const user = await login(credentials);
      if (user.role === 'HR') {
        navigate('/hr/dashboard');
      } else {
        navigate('/welcome');
      }
    } catch {
    }
  };

  const handleChangeEvent = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <div>Welcome To System!</div>
      <div>
        <input
          type="text"
          name="email"
          className="border-2 m-2"
          value={credentials.email}
          placeholder="Enter Your Email"
          onChange={handleChangeEvent}
          required
          autoComplete="username"
        />
        <input
          type="password"
          name="password"
          className="border-2 m-2"
          value={credentials.password}
          placeholder="Enter your Password"
          onChange={handleChangeEvent}
          required
          autoComplete="current-password"
        />
        <button
          className="border-2 m-2 p-2 bg-slate-800 text-white rounded-2xl disabled:opacity-50"
          onClick={handleLogin}
          disabled={isAuthenticating}
        >
          {isAuthenticating ? 'Logging in…' : 'Login'}
        </button>
      </div>

      {formErrors.map((e) => (
        <div className="text-red-700" key={e}>
          {e}
        </div>
      ))}

      {authError && <div className="text-red-700">{authError}</div>}
    </div>
  );
}

export default Login;