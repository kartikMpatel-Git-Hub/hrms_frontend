import { LoginForm } from './login-form';

function Login() {

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