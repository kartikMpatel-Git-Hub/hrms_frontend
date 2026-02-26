import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { InfoIcon } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { login, isAuthenticating, authError } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const isValidEmail = (email: string): boolean => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(email)) {
      return false;
    }
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    const [localPart, domain] = parts;
    if (localPart.length > 64 || localPart.length === 0) return false;
    if (domain.length > 255 || domain.length === 0) return false;
    if (domain.startsWith('.') || domain.endsWith('.')) return false;
    if (domain.includes('..')) return false;
    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    if (localPart.includes('..')) return false;
    return true;
  };

  const isValidCredentials = () => {
    const errs: string[] = [];
    if (!credentials.email.trim() || !credentials.password.trim()) {
      errs.push('Email and password are required.');
    } else if (!isValidEmail(credentials.email.trim())) {
      errs.push('Please enter a valid email address.');
    }
    setFormErrors(errs);
    return errs.length === 0;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors([]);
    if (!isValidCredentials()) return;

    try {
      const user = await login(credentials);
      switch (user.role) {
        case "HR": navigate("/hr/dashboard"); break;
        case "EMPLOYEE": navigate("/employee/dashboard"); break;
        case "MANAGER": navigate("/manager/dashboard"); break;
        default: navigate("./")
      }
    } catch (error) {
      // console.error("Login error:", error);
    }
  };

  const handleChangeEvent = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };



  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="flex justify-center text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={handleChangeEvent}
                  name="email"
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <button
                    type="button"
                    onClick={() => navigate('/forget-password')}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
                <Input id="password" type="password" required onChange={handleChangeEvent} name="password" />
              </Field>
              <Field>
                <Button type="submit" disabled={isAuthenticating}>Login</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        {
          authError && (
            <Alert variant="destructive">
              <InfoIcon />
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )
        }
      </Card>
    </div>
  )
}
