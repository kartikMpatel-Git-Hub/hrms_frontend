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
import { useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { InfoIcon, CheckCircle2 } from "lucide-react"
import { ForgetPasswordService } from "@/api/AuthenticationService"

export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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

  const isValidForm = () => {
    const errs: string[] = [];
    if (!email.trim()) {
      errs.push('Email is required.');
    } else if (!isValidEmail(email.trim())) {
      errs.push('Please enter a valid email address.');
    }
    setFormErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors([]);
    setErrorMessage('');
    setSuccessMessage('');

    if (!isValidForm()) return;

    setIsLoading(true);
    try {
      await ForgetPasswordService(email.trim());
      setSuccessMessage('New password has been sent to your email. Please check your inbox.');
      setEmail('');
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to process forget password request.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="flex justify-center text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={handleEmailChange}
                  value={email}
                  disabled={isLoading}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Sending...' : 'Send New Password'}
                </Button>
              </Field>
              <Field>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                  disabled={isLoading}
                >
                  Back to Login
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>

        {formErrors.length > 0 && (
          <Alert variant="destructive">
            <InfoIcon />
            <AlertTitle>Validation Error</AlertTitle>
            <AlertDescription>
              {formErrors.map((err, idx) => (
                <div key={idx}>{err}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="destructive">
            <InfoIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle2 className="text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  )
}
