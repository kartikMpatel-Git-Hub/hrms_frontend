import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from './login-form';

function Login() {
  const { user, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && user) {
      switch (user.role) {
        case "HR":
          navigate("/hr/dashboard");
          break;
        case "EMPLOYEE":
          navigate("/employee/dashboard");
          break;
        case "MANAGER":
          navigate("/manager/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, isInitializing, navigate]);

  if (isInitializing) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='w-full max-w-md p-6 rounded-lg'>
          <p className='text-center'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='flex items-center justify-center min-h-screen'>
        <div className='w-full max-w-md p-6 rounded-lg'>
          <LoginForm />
        </div>
      </div>
    </>
  );
}

export default Login; 