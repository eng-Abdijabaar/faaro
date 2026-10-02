import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router";

import {
  UserRound,
  LockKeyhole,
  Eye,
  EyeOff,
  Plane,
  ShieldCheck,
  MapPinned,
  BadgePercent,
  LoaderCircle,
} from "lucide-react";

import toast from "react-hot-toast";

import useAuthStore from "../store/authStore";

const SignIn = () => {
  const navigate = useNavigate();

  const {
    login,
    isLoading,
  } = useAuthStore();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const identifier =
      formData.identifier.trim();

    const password =
      formData.password;

    if (!identifier || !password) {
      toast.error(
        "Please provide your email or phone and password"
      );

      return;
    }

    if (
      password.length < 6 ||
      password.length > 24
    ) {
      toast.error(
        "Password must be between 6 and 24 characters"
      );

      return;
    }

    /*
      Backend requires either:

      {
        email,
        password
      }

      OR:

      {
        phone,
        password
      }

      Never both.
    */

    const credentials =
      identifier.includes("@")
        ? {
            email:
              identifier.toLowerCase(),
            password,
          }
        : {
            phone: identifier,
            password,
          };

    try {
      const user =
        await login(credentials);

      toast.success(
        `Welcome back, ${user.fullName}`
      );

      /*
        Redirect based on backend role:

        customer
        owner
        admin
      */

      switch (user.role) {
        case "admin":
          navigate(
            "/admin",
            {
              replace: true,
            }
          );

          break;

        case "owner":
          navigate(
            "/business",
            {
              replace: true,
            }
          );

          break;

        default:
          navigate(
            "/",
            {
              replace: true,
            }
          );
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to sign in";

      toast.error(message);
    }
  };

  return (
    <main className="min-h-screen bg-background p-3 md:p-6">

      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-[1450px] overflow-hidden rounded-[28px] bg-surface shadow-xl">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <section
          className="relative hidden w-[43%] overflow-hidden lg:flex lg:flex-col lg:justify-between"
          style={{
            backgroundImage: `
              linear-gradient(
                180deg,
                rgba(2, 25, 45, 0.3) 0%,
                rgba(2, 30, 48, 0.45) 45%,
                rgba(0, 20, 35, 0.9) 100%
              ),
              url("/images/signin-bg.jpg")
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >

          {/* LOGO + HERO */}

          <div className="relative z-10 p-10 xl:p-14">

            <Link
              to="/"
              className="mb-20 flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                <Plane size={24} />
              </div>

              <span className="text-2xl font-bold text-white">
                Faaro Bookings
              </span>
            </Link>

            <div className="max-w-md">

              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-teal-300">
                Welcome back
              </p>

              <h1 className="text-5xl font-bold leading-[1.08] text-white xl:text-6xl">

                Your journey

                <br />

                <span className="text-teal-300">
                  continues here.
                </span>
              </h1>

              <p className="mt-6 max-w-sm text-lg leading-8 text-white/80">
                Sign in and continue
                exploring trusted hotels,
                cars and apartments with
                Faaro Bookings.
              </p>
            </div>
          </div>

          {/* FEATURES */}

          <div className="relative z-10 space-y-6 p-10 xl:p-14">

            <Feature
              icon={
                <MapPinned size={22} />
              }
              title="Discover destinations"
              description="Explore hotels, cars and apartments"
            />

            <Feature
              icon={
                <BadgePercent
                  size={22}
                />
              }
              title="Great booking deals"
              description="Find competitive prices for every trip"
            />

            <Feature
              icon={
                <ShieldCheck
                  size={22}
                />
              }
              title="Secure experience"
              description="Your account and bookings stay protected"
            />
          </div>
        </section>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <section className="flex w-full items-center justify-center px-5 py-10 sm:px-10 lg:w-[57%] lg:px-16 xl:px-24">

          <div className="w-full max-w-[560px]">

            {/* MOBILE LOGO */}

            <Link
              to="/"
              className="mb-10 flex items-center gap-2 text-xl font-bold text-secondary lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <Plane size={21} />
              </div>

              Faaro Bookings
            </Link>

            {/* SIGN UP LINK */}

            <div className="mb-12 flex justify-end">

              <p className="text-sm text-text-secondary">
                Don't have an account?{" "}

                <Link
                  to="/signup"
                  className="font-semibold text-primary transition hover:text-primary-dark"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            {/* HEADER */}

            <div className="mb-9">

              <h2 className="text-4xl font-bold tracking-tight text-secondary">
                Welcome Back
              </h2>

              <p className="mt-3 leading-7 text-text-secondary">
                Sign in to manage your
                bookings and continue
                exploring Faaro.
              </p>
            </div>

            {/* =========================
                FORM
            ========================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL / PHONE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Email or Phone Number
                </label>

                <div className="flex h-14 items-center gap-3 rounded-xl border border-border px-4 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">

                  <UserRound
                    size={19}
                    className="shrink-0 text-text-muted"
                  />

                  <input
                    type="text"
                    name="identifier"
                    placeholder="Email or phone number"
                    value={
                      formData.identifier
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="username"
                    required
                    className="h-full flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Password
                </label>

                <div className="flex h-14 items-center gap-3 rounded-xl border border-border px-4 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">

                  <LockKeyhole
                    size={19}
                    className="shrink-0 text-text-muted"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    minLength={6}
                    maxLength={24}
                    autoComplete="current-password"
                    required
                    className="h-full flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="text-text-muted transition hover:text-text-primary"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* FORGOT PASSWORD */}

              <div className="flex justify-end">

                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-primary transition hover:text-primary-dark"
                >
                  Forgot password?
                </Link>
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-semibold text-white shadow-sm transition hover:bg-primary-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <LoaderCircle
                      size={20}
                      className="animate-spin"
                    />

                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* INFO */}

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-primary-light p-4">

              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-primary"
              />

              <p className="text-xs leading-5 text-text-secondary">
                Your account must be verified
                and active before you can sign
                in.
              </p>
            </div>

            {/* MOBILE SIGNUP */}

            <p className="mt-8 text-center text-sm text-text-secondary lg:hidden">
              Don't have an account?{" "}

              <Link
                to="/signup"
                className="font-semibold text-primary"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

/* ===============================
   FEATURE
================================ */

const Feature = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex items-center gap-4 text-white">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
        {icon}
      </div>

      <div>

        <p className="font-semibold">
          {title}
        </p>

        <p className="mt-0.5 text-sm text-white/65">
          {description}
        </p>
      </div>
    </div>
  );
};

export default SignIn;