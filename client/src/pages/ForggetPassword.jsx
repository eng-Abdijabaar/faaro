import {
  useState,
} from "react";

import {
  Link,
} from "react-router";

import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  Mail,
  Plane,
} from "lucide-react";

import toast from "react-hot-toast";

import useAuthStore from "../store/authStore";


const ForggetPassword = () => {
  const forgotPassword =
    useAuthStore(
      (state) =>
        state.forgotPassword
    );

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [message, setMessage] =
    useState("");


  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const value =
        email
          .trim()
          .toLowerCase();

      if (!value) {
        toast.error(
          "Please enter your email"
        );

        return;
      }

      try {
        setLoading(true);

        const response =
          await forgotPassword(
            value
          );

        setMessage(
          response?.message ||
            "If an account exists with this email, a password reset link has been sent."
        );

        setSubmitted(true);
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Unable to send reset link"
        );
      } finally {
        setLoading(false);
      }
    };


  if (submitted) {
    return (
      <AuthContainer>

        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2
              size={38}
            />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Check Your Email
          </p>

          <h1 className="mt-3 text-3xl font-bold text-secondary">
            Reset link sent
          </h1>

          <p className="mt-4 leading-7 text-text-secondary">
            {message}
          </p>

          <div className="mt-6 rounded-xl bg-surface-soft p-4">

            <p className="text-sm text-text-secondary">
              We sent instructions
              to
            </p>

            <p className="mt-1 break-all font-semibold text-secondary">
              {email}
            </p>

          </div>

          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setMessage("");
            }}
            className="mt-7 w-full rounded-xl border border-border px-5 py-3.5 font-semibold text-secondary transition hover:bg-surface-soft"
          >
            Try Another Email
          </button>

          <Link
            to="/signin"
            className="mt-3 block w-full rounded-xl bg-primary px-5 py-3.5 font-semibold text-white"
          >
            Back to Sign In
          </Link>

        </div>

      </AuthContainer>
    );
  }


  return (
    <AuthContainer>

      <Link
        to="/signin"
        className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-primary"
      >
        <ArrowLeft size={17} />

        Back to Sign In
      </Link>


      <div className="mt-7">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <Mail size={25} />
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Password Recovery
        </p>

        <h1 className="mt-2 text-3xl font-bold text-secondary">
          Forgot your password?
        </h1>

        <p className="mt-3 leading-7 text-text-secondary">
          Enter the email address
          connected to your Faaro
          account and we'll send you
          password reset
          instructions.
        </p>

      </div>


      <form
        onSubmit={
          handleSubmit
        }
        className="mt-8"
      >

        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-secondary"
        >
          Email Address
        </label>

        <div className="flex items-center gap-3 rounded-xl border border-border px-4 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">

          <Mail
            size={18}
            className="shrink-0 text-text-muted"
          />

          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder="you@example.com"
            className="w-full bg-transparent py-4 text-sm text-secondary outline-none"
          />

        </div>


        <button
          type="submit"
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >

          {loading && (
            <LoaderCircle
              size={18}
              className="animate-spin"
            />
          )}

          {loading
            ? "Sending..."
            : "Send Reset Link"}

        </button>

      </form>

    </AuthContainer>
  );
};


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


export default ForggetPassword;