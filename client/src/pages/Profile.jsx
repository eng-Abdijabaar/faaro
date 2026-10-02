import {
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Mail,
  Phone,
  Plane,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  Link,
} from "react-router";

import Navbar from "../components/Navbar";
import useAuthStore from "../store/authStore";


const CustomerProfile = () => {
  const user = useAuthStore(
    (state) => state.user
  );

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated
    );


  if (
    !isAuthenticated ||
    !user
  ) {
    return null;
  }


  const initials =
    getInitials(
      user.fullName
    );


  const roleLabel =
    formatRole(
      user.role
    );


  return (
    <div className="min-h-screen bg-background text-text-primary">

      <Navbar />


      <main className="mx-auto max-w-[1150px] px-5 py-10 md:px-8">

        {/* =====================
            HEADER
        ===================== */}

        <div>

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-secondary md:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-text-secondary">
            View your account
            information and access
            the parts of Faaro
            connected to your
            account.
          </p>

        </div>


        <div className="mt-8 grid gap-7 lg:grid-cols-[340px_1fr]">


          {/* =====================
              LEFT PROFILE CARD
          ===================== */}

          <aside>

            <div className="rounded-3xl border border-border bg-white p-6">

              <div className="flex flex-col items-center text-center">

                {/* AVATAR */}

                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-white">

                  {initials}

                </div>


                {/* NAME */}

                <h2 className="mt-5 text-2xl font-bold text-secondary">
                  {user.fullName}
                </h2>


                <p className="mt-1 text-sm text-text-muted">
                  {user.email}
                </p>


                {/* ROLE */}

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary">

                  <ShieldCheck
                    size={16}
                  />

                  {roleLabel}

                </div>

              </div>


              {/* ACCOUNT STATUS */}

              <div className="mt-7 border-t border-border pt-6">

                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Account Status
                </p>


                <div className="mt-4 space-y-3">

                  <StatusRow
                    label="Status"
                    active={
                      user.status ===
                      "active"
                    }
                    value={
                      formatText(
                        user.status ||
                          "active"
                      )
                    }
                  />

                  <StatusRow
                    label="Email"
                    active={
                      Boolean(
                        user.isVerified
                      )
                    }
                    value={
                      user.isVerified
                        ? "Verified"
                        : `${user.isVerified}`
                    }
                  />

                </div>

              </div>

            </div>

          </aside>


          {/* =====================
              RIGHT
          ===================== */}

          <div className="space-y-7">


            {/* =====================
                ACCOUNT DETAILS
            ===================== */}

            <section className="rounded-3xl border border-border bg-white p-6 md:p-8">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">

                  <UserRound />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-secondary">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-sm text-text-muted">
                    Your Faaro account
                    information.
                  </p>

                </div>

              </div>


              <div className="mt-7 grid gap-4 sm:grid-cols-2">

                <InfoCard
                  icon={
                    <CircleUserRound />
                  }
                  label="Full Name"
                  value={
                    user.fullName
                  }
                />

                <InfoCard
                  icon={<Mail />}
                  label="Email Address"
                  value={user.email}
                />

                <InfoCard
                  icon={<Phone />}
                  label="Phone Number"
                  value={
                    user.phone ||
                    "Not provided"
                  }
                />

                <InfoCard
                  icon={
                    <ShieldCheck />
                  }
                  label="Account Role"
                  value={roleLabel}
                />

              </div>

            </section>


            {/* =====================
                QUICK ACCESS
            ===================== */}

            <section className="rounded-3xl border border-border bg-white p-6 md:p-8">

              <div>

                <p className="text-sm font-semibold text-primary">
                  Quick Access
                </p>

                <h2 className="mt-1 text-xl font-bold text-secondary">
                  Manage your account
                </h2>

              </div>


              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                {user.role ===
                  "customer" && (
                  <>

                    <QuickLink
                      to="/bookings"
                      icon={
                        <CalendarDays />
                      }
                      title="My Bookings"
                      description="View and manage your bookings."
                    />

                    <QuickLink
                      to="/refunds"
                      icon={
                        <ReceiptText />
                      }
                      title="My Refunds"
                      description="Track your refund requests."
                    />

                    <QuickLink
                      to="/explore"
                      icon={
                        <Plane />
                      }
                      title="Explore"
                      description="Find hotels, cars and apartments."
                    />

                  </>
                )}


                {user.role ===
                  "owner" && (
                  <>

                    <QuickLink
                      to="/business"
                      icon={
                        <Building2 />
                      }
                      title="Business Dashboard"
                      description="Manage your business on Faaro."
                    />

                    <QuickLink
                      to="/business/units"
                      icon={
                        <Building2 />
                      }
                      title="Manage Units"
                      description="Create and manage your units."
                    />

                    <QuickLink
                      to="/business/bookings"
                      icon={
                        <CalendarDays />
                      }
                      title="Business Bookings"
                      description="View confirmed bookings."
                    />

                  </>
                )}


                {user.role ===
                  "admin" && (
                  <>

                    <QuickLink
                      to="/admin"
                      icon={
                        <ShieldCheck />
                      }
                      title="Admin Dashboard"
                      description="Open administration dashboard."
                    />

                    <QuickLink
                      to="/admin/users"
                      icon={
                        <UserRound />
                      }
                      title="Manage Users"
                      description="View and manage platform users."
                    />

                    <QuickLink
                      to="/admin/refunds"
                      icon={
                        <ReceiptText />
                      }
                      title="Refund Requests"
                      description="Review customer refund requests."
                    />

                  </>
                )}

              </div>

            </section>


            {/* =====================
                SECURITY
            ===================== */}

            <section className="rounded-3xl border border-border bg-white p-6 md:p-8">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">

                  <BadgeCheck />

                </div>

                <div>

                  <h2 className="text-lg font-bold text-secondary">
                    Account Security
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
                    Your account
                    information is
                    protected through
                    Faaro's
                    authentication
                    system.
                  </p>

                  {!user.isVerified && (
                    <p className="mt-3 text-sm font-semibold text-amber-700">
                      Verify your email
                      address to complete
                      your account
                      verification.
                    </p>
                  )}

                </div>

              </div>

            </section>

          </div>

        </div>

      </main>

    </div>
  );
};


/* =================================
   INFO CARD
================================= */

const InfoCard = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-start gap-4 rounded-xl bg-surface-soft p-4">

    <div className="mt-0.5 text-primary">
      {icon}
    </div>

    <div className="min-w-0">

      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-secondary">
        {value || "—"}
      </p>

    </div>

  </div>
);


/* =================================
   STATUS
================================= */

const StatusRow = ({
  label,
  value,
  active,
}) => (
  <div className="flex items-center justify-between gap-4">

    <span className="text-sm text-text-secondary">
      {label}
    </span>

    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "bg-green-50 text-green-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >

      {active && (
        <CheckCircle2
          size={13}
        />
      )}

      {value}

    </span>

  </div>
);


/* =================================
   QUICK LINK
================================= */

const QuickLink = ({
  to,
  icon,
  title,
  description,
}) => (
  <Link
    to={to}
    className="group flex items-center gap-4 rounded-2xl border border-border p-5 transition hover:border-primary/30 hover:bg-primary-light/30"
  >

    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">

      {icon}

    </div>


    <div className="min-w-0 flex-1">

      <p className="font-bold text-secondary">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-text-muted">
        {description}
      </p>

    </div>


    <ChevronRight
      size={18}
      className="shrink-0 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary"
    />

  </Link>
);


/* =================================
   HELPERS
================================= */

const getInitials = (
  name
) => {
  if (!name) {
    return "U";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(
      (word) =>
        word[0]?.toUpperCase()
    )
    .join("");
};


const formatRole = (
  role
) => {
  if (role === "owner") {
    return "Business Owner";
  }

  if (role === "admin") {
    return "Administrator";
  }

  return "Customer";
};


const formatText = (
  value
) => {
  if (!value) {
    return "—";
  }

  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
};


export default CustomerProfile;