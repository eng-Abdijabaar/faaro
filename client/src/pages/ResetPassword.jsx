import {
  useState,
} from "react";

import {
  Link,
  useParams,
  useSearchParams,
} from "react-router";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Plane,
  XCircle,
} from "lucide-react";

import toast from "react-hot-toast";

import useAuthStore from "../store/authStore";


const ResetPassword = () => {
  const { token: paramToken } =
    useParams();

  const [searchParams] =
    useSearchParams();

  const resetPassword =
    useAuthStore(
      (state) =>
        state.resetPassword
    );

  const token =
    paramToken ||
    searchParams.get("token");


  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    success,
    setSuccess,
  ] = useState(false);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");


  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (!token) {
        toast.error(
          "Reset token is missing"
        );

        return;
      }

      if (
        password.length < 8
      ) {
        toast.error(
          "Password must be at least 8 characters"
        );

        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        toast.error(
          "Passwords do not match"
        );

        return;
      }

      try {
        setLoading(true);

        const response =
          await resetPassword({
            token,
            password,
          });

        setSuccessMessage(
          response?.message ||
            "Your password has been reset successfully."
        );

        setSuccess(true);
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Unable to reset password"
        );
      } finally {
        setLoading(false);
      }
    };


  if (!token) {
    return (
      <AuthContainer>

        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-danger">
            <XCircle
              size={38}
            />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-danger">
            Invalid Link
          </p>

          <h1 className="mt-3 text-3xl font-bold text-secondary">
            Reset token missing
          </h1>

          <p className="mt-4 leading-7 text-text-secondary">
            This password reset
            link is incomplete or
            invalid. Request a new
            password reset link.
          </p>

          <Link
            to="/forgot-password"
            className="mt-8 block rounded-xl bg-primary px-5 py-3.5 font-semibold text-white"
          >
            Request New Link
          </Link>

        </div>

      </AuthContainer>
    );
  }


  if (success) {
    return (
      <AuthContainer>

        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">

            <CheckCircle2
              size={38}
            />

          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Password Updated
          </p>

          <h1 className="mt-3 text-3xl font-bold text-secondary">
            Password reset complete
          </h1>

          <p className="mt-4 leading-7 text-text-secondary">
            {successMessage}
          </p>

          <Link
            to="/signin"
            className="mt-8 block rounded-xl bg-primary px-5 py-3.5 font-semibold text-white"
          >
            Sign In With New Password
          </Link>

        </div>

      </AuthContainer>
    );
  }


  return (
    <AuthContainer>

      <div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">

          <KeyRound
            size={26}
          />

        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Password Recovery
        </p>

        <h1 className="mt-2 text-3xl font-bold text-secondary">
          Create a new password
        </h1>

        <p className="mt-3 leading-7 text-text-secondary">
          Choose a new password for
          your Faaro account.
        </p>

      </div>


      <form
        onSubmit={
          handleSubmit
        }
        className="mt-8 space-y-5"
      >

        {/* PASSWORD */}

        <PasswordInput
          id="password"
          label="New Password"
          value={password}
          show={showPassword}
          onChange={
            setPassword
          }
          onToggle={() =>
            setShowPassword(
              (prev) => !prev
            )
          }
        />


        {/* CONFIRM */}

        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          value={
            confirmPassword
          }
          show={
            showConfirmPassword
          }
          onChange={
            setConfirmPassword
          }
          onToggle={() =>
            setShowConfirmPassword(
              (prev) => !prev
            )
          }
        />


        {/* RULE */}

        <div className="rounded-xl bg-surface-soft p-4">

          <div className="flex gap-3">

            <LockKeyhole
              size={18}
              className="mt-0.5 shrink-0 text-primary"
            />

            <p className="text-xs leading-5 text-text-secondary">
              Use at least 8
              characters for your
              new password.
            </p>

          </div>

        </div>


        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >

          {loading && (
            <LoaderCircle
              size={18}
              className="animate-spin"
            />
          )}

          {loading
            ? "Resetting..."
            : "Reset Password"}

        </button>

      </form>


      <p className="mt-6 text-center text-sm text-text-secondary">

        Remember your password?{" "}

        <Link
          to="/signin"
          className="font-semibold text-primary"
        >
          Sign In
        </Link>

      </p>

    </AuthContainer>
  );
};


const PasswordInput = ({
  id,
  label,
  value,
  show,
  onChange,
  onToggle,
}) => (
  <label className="block">

    <span className="mb-2 block text-sm font-semibold text-secondary">
      {label}
    </span>

    <div className="flex items-center gap-3 rounded-xl border border-border px-4 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">

      <LockKeyhole
        size={18}
        className="shrink-0 text-text-muted"
      />

      <input
        id={id}
        type={
          show
            ? "text"
            : "password"
        }
        required
        minLength={8}
        autoComplete={
          id === "password"
            ? "new-password"
            : "new-password"
        }
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full bg-transparent py-4 text-sm text-secondary outline-none"
      />

      <button
        type="button"
        onClick={onToggle}
        className="text-text-muted transition hover:text-secondary"
        aria-label={
          show
            ? "Hide password"
            : "Show password"
        }
      >

        {show ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}

      </button>

    </div>

  </label>
);


const AuthContainer = ({
  children,
}) => (
  <div className="flex min-h-screen items-center justify-center bg-background px-5 py-12">

    <div className="w-full max-w-md">

      <Link
        to="/"
        className="mb-8 flex items-center justify-center gap-3"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
          <Plane size={22} />
        </div>

        <div>
          <p className="text-xl font-bold text-secondary">
            Faaro
          </p>

          <p className="-mt-1 text-xs text-text-muted">
            Bookings
          </p>
        </div>
      </Link>

      <div className="rounded-3xl border border-border bg-white p-7 shadow-sm sm:p-9">
        {children}
      </div>

    </div>

  </div>
);


export default ResetPassword;