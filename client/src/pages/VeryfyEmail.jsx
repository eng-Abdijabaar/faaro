import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useParams,
  useSearchParams,
} from "react-router";

import {
  CheckCircle2,
  LoaderCircle,
  MailCheck,
  Plane,
  XCircle,
} from "lucide-react";

import useAuthStore from "../store/authStore";


const VeryfyEmail = () => {
  const { token: paramToken } =
    useParams();

  const [searchParams] =
    useSearchParams();

  const verifyEmail =
    useAuthStore(
      (state) =>
        state.verifyEmail
    );

  const hasVerified =
    useRef(false);

  const [status, setStatus] =
    useState("loading");

  const [message, setMessage] =
    useState("");

  const token =
    paramToken ||
    searchParams.get("token");


  useEffect(() => {
    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    const verify = async () => {
      if (!token) {
        setStatus("error");

        setMessage(
          "The verification link is missing its token."
        );

        return;
      }

      try {
        const response =
          await verifyEmail(
            token
          );

        setStatus("success");

        setMessage(
          response?.message ||
            "Your email has been verified successfully."
        );
      } catch (error) {
        setStatus("error");

        setMessage(
          error.response?.data
            ?.message ||
            "The verification link is invalid or has expired."
        );
      }
    };

    verify();
  }, [
    token,
    verifyEmail,
  ]);


  return (
    <AuthPage>

      {status === "loading" && (
        <StatusContent
          icon={
            <LoaderCircle
              size={38}
              className="animate-spin"
            />
          }
          iconClass="bg-primary-light text-primary"
          small="Email Verification"
          title="Verifying your email..."
          description="Please wait while we verify your email address."
        />
      )}


      {status === "success" && (
        <StatusContent
          icon={
            <CheckCircle2
              size={38}
            />
          }
          iconClass="bg-green-50 text-green-600"
          small="Email Verified"
          title="Verification complete"
          description={
            message
          }
        >
          <Link
            to="/signin"
            className="mt-8 block w-full rounded-xl bg-primary px-5 py-3.5 text-center font-semibold text-white transition hover:bg-primary-dark"
          >
            Continue to Sign In
          </Link>
        </StatusContent>
      )}


      {status === "error" && (
        <StatusContent
          icon={
            <XCircle
              size={38}
            />
          }
          iconClass="bg-red-50 text-danger"
          small="Verification Failed"
          title="Unable to verify email"
          description={
            message
          }
        >
          <div className="mt-8 space-y-3">

            <Link
              to="/signin"
              className="block w-full rounded-xl bg-primary px-5 py-3.5 text-center font-semibold text-white"
            >
              Go to Sign In
            </Link>

            <Link
              to="/"
              className="block w-full rounded-xl border border-border px-5 py-3.5 text-center font-semibold text-secondary"
            >
              Back Home
            </Link>

          </div>
        </StatusContent>
      )}

    </AuthPage>
  );
};


const AuthPage = ({
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


const StatusContent = ({
  icon,
  iconClass,
  small,
  title,
  description,
  children,
}) => (
  <div className="text-center">

    <div
      className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${iconClass}`}
    >
      {icon}
    </div>

    <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
      {small}
    </p>

    <h1 className="mt-3 text-2xl font-bold text-secondary">
      {title}
    </h1>

    <p className="mt-4 leading-7 text-text-secondary">
      {description}
    </p>

    {children}

  </div>
);


export default VeryfyEmail;