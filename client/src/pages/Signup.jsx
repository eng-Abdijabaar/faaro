import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  User,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  MapPinned,
  ShieldCheck,
  BadgePercent,
  Plane,
  LoaderCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import useAuthStore from "../store/authStore";

const Signup = () => {
  const navigate = useNavigate();

  const { register, isLoading } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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

    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const password = formData.password;

    /* =========================
       FRONTEND VALIDATION
    ========================= */

    if (
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill in all fields");
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

    if (
      password !== formData.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      /*
        Backend expects only:

        fullName
        email
        phone
        password
      */

      const response = await register({
        fullName,
        email,
        phone,
        password,
      });

      toast.success(
        response.message ||
          "Account created. Check your email to verify it."
      );

      navigate("/signin");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to create account";

      toast.error(message);
    }
  };

  return (
    <main className="min-h-screen bg-background p-3 md:p-6">

      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-[1450px] overflow-hidden rounded-[28px] bg-surface shadow-xl">

        {/* ==================================
            LEFT SIDE
        ================================== */}

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
                Travel • Stay • Drive
              </p>

              <h1 className="text-5xl font-bold leading-[1.08] text-white xl:text-6xl">
                Join Faaro
                <br />

                <span className="text-teal-300">
                  Bookings.
                </span>
              </h1>

              <p className="mt-6 max-w-sm text-lg leading-8 text-white/80">
                Create your account and start
                exploring trusted hotels, car rentals
                and apartments.
              </p>
            </div>
          </div>

          {/* BENEFITS */}

          <div className="relative z-10 space-y-6 p-10 xl:p-14">

            <Feature
              icon={<MapPinned size={22} />}
              title="Explore destinations"
              description="Find places you'll love"
            />

            <Feature
              icon={<BadgePercent size={22} />}
              title="Great booking deals"
              description="Competitive prices for your journey"
            />

            <Feature
              icon={<ShieldCheck size={22} />}
              title="Secure booking"
              description="Simple and protected payments"
            />
          </div>
        </section>

        {/* ==================================
            RIGHT SIDE
        ================================== */}

        <section className="flex w-full items-center justify-center px-5 py-10 sm:px-10 lg:w-[57%] lg:px-16 xl:px-24">

          <div className="w-full max-w-[590px]">

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

            {/* SIGN IN */}

            <div className="mb-10 flex justify-end">

              <p className="text-sm text-text-secondary">
                Already have an account?{" "}

                <Link
                  to="/signin"
                  className="font-semibold text-primary transition hover:text-primary-dark"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* HEADER */}

            <div className="mb-8">

              <h2 className="text-4xl font-bold tracking-tight text-secondary">
                Create Your Account
              </h2>

              <p className="mt-3 leading-7 text-text-secondary">
                Join Faaro Bookings and start
                discovering hotels, cars and
                apartments.
              </p>
            </div>

            {/* ==================================
                FORM
            ================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* FULL NAME */}

              <InputField
                label="Full Name"
                icon={<User size={19} />}
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
              />

              {/* EMAIL */}

              <InputField
                label="Email Address"
                icon={<Mail size={19} />}
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />

              {/* PHONE */}

              <InputField
                label="Phone Number"
                icon={<Phone size={19} />}
                name="phone"
                type="tel"
                placeholder="25261XXXXXXX"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
              />

              {/* PASSWORD */}

              <PasswordField
                label="Password"
                name="password"
                placeholder="6–24 characters"
                value={formData.password}
                onChange={handleChange}
                visible={showPassword}
                toggle={() =>
                  setShowPassword((prev) => !prev)
                }
                autoComplete="new-password"
              />

              {/* PASSWORD HINT */}

              <p className="-mt-2 text-xs text-text-muted">
                Password must be between 6 and 24
                characters.
              </p>

              {/* CONFIRM PASSWORD */}

              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Enter password again"
                value={formData.confirmPassword}
                onChange={handleChange}
                visible={showConfirmPassword}
                toggle={() =>
                  setShowConfirmPassword(
                    (prev) => !prev
                  )
                }
                autoComplete="new-password"
              />

              {/* TERMS */}

              <label className="flex cursor-pointer items-start gap-3">

                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 accent-[var(--primary)]"
                />

                <span className="text-sm leading-6 text-text-secondary">
                  I agree to the{" "}

                  <button
                    type="button"
                    className="font-medium text-primary hover:underline"
                  >
                    Terms of Service
                  </button>

                  {" "}and{" "}

                  <button
                    type="button"
                    className="font-medium text-primary hover:underline"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>

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

                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* VERIFY INFO */}

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-primary-light p-4">

              <Mail
                size={19}
                className="mt-0.5 shrink-0 text-primary"
              />

              <p className="text-xs leading-5 text-text-secondary">
                After creating your account, we'll send
                an email verification link. You must
                verify your email before signing in.
              </p>
            </div>

            {/* MOBILE LOGIN */}

            <p className="mt-8 text-center text-sm text-text-secondary lg:hidden">
              Already have an account?{" "}

              <Link
                to="/signin"
                className="font-semibold text-primary"
              >
                Sign In
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

/* ==========================================
   INPUT
========================================== */

const InputField = ({
  label,
  icon,
  name,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}) => {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-text-primary">
        {label}
      </label>

      <div className="flex h-14 items-center gap-3 rounded-xl border border-border px-4 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">

        <span className="text-text-muted">
          {icon}
        </span>

        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required
          className="h-full flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
        />
      </div>
    </div>
  );
};

/* ==========================================
   PASSWORD
========================================== */

const PasswordField = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  visible,
  toggle,
  autoComplete,
}) => {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-text-primary">
        {label}
      </label>

      <div className="flex h-14 items-center gap-3 rounded-xl border border-border px-4 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">

        <LockKeyhole
          size={19}
          className="shrink-0 text-text-muted"
        />

        <input
          name={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          minLength={6}
          maxLength={24}
          autoComplete={autoComplete}
          required
          className="h-full flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
        />

        <button
          type="button"
          onClick={toggle}
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
          className="text-text-muted transition hover:text-text-primary"
        >
          {visible ? (
            <EyeOff size={19} />
          ) : (
            <Eye size={19} />
          )}
        </button>
      </div>
    </div>
  );
};

/* ==========================================
   FEATURE
========================================== */

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

export default Signup;