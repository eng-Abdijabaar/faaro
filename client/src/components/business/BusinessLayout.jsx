import {
  BookOpenCheck,
  Boxes,
  BriefcaseBusiness,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router";

import useAuthStore from "../../store/authStore";

const navigation = [
  {
    label: "Dashboard",
    to: "/business",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Units",
    to: "/business/units",
    icon: Boxes,
  },
  {
    label: "Bookings",
    to: "/business/bookings",
    icon: CalendarDays,
  },
  {
    label: "Check Booking",
    to: "/business/check-booking",
    icon: BookOpenCheck,
  },
  {
    label: "Profile",
    to: "/business/profile",
    icon: UserRound,
  },
];

const BusinessLayout = ({
  children,
}) => {
  const navigate =
    useNavigate();

  const user =
    useAuthStore(
      (state) => state.user
    );

  const logout =
    useAuthStore(
      (state) => state.logout
    );

  const handleLogout =
    async () => {
      try {
        await logout();
      } finally {
        navigate("/signin");
      }
    };

  return (
    <div className="min-h-screen bg-background">

      <div className="flex">

        {/* DESKTOP SIDEBAR */}

        <aside className="hidden min-h-screen w-64 shrink-0 border-r border-border bg-white lg:block">

          <div className="sticky top-0 flex h-screen flex-col p-6">

            <NavLink
              to="/business"
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">

                <BriefcaseBusiness
                  size={21}
                />

              </div>

              <div>
                <h2 className="font-bold text-secondary">
                  Faaro
                </h2>

                <p className="text-xs text-text-muted">
                  Business Portal
                </p>
              </div>
            </NavLink>

            <nav className="mt-9 space-y-2">

              {navigation.map(
                ({
                  label,
                  to,
                  icon: Icon,
                  end,
                }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({
                      isActive,
                    }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-primary-light text-primary"
                          : "text-text-secondary hover:bg-surface-soft"
                      }`
                    }
                  >
                    <Icon size={18} />

                    {label}
                  </NavLink>
                )
              )}

            </nav>

            <div className="mt-auto border-t border-border pt-5">

              <p className="truncate text-sm font-semibold text-secondary">
                {user?.fullName ||
                  "Business Owner"}
              </p>

              <p className="truncate text-xs text-text-muted">
                {user?.email}
              </p>

              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-danger transition hover:bg-red-50"
              >
                <LogOut size={18} />

                Logout
              </button>

            </div>

          </div>

        </aside>

        {/* CONTENT */}

        <div className="min-w-0 flex-1">

          {/* MOBILE */}

          <header className="border-b border-border bg-white lg:hidden">

            <div className="flex items-center justify-between px-5 py-4">

              <Link
                to="/business"
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">

                  <BriefcaseBusiness
                    size={19}
                  />

                </div>

                <div>
                  <p className="font-bold text-secondary">
                    Faaro Business
                  </p>

                  <p className="text-xs text-text-muted">
                    Owner Portal
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="rounded-xl p-2 text-danger"
              >
                <LogOut size={19} />
              </button>

            </div>

            <nav className="flex gap-2 overflow-x-auto border-t border-border px-4 py-3">

              {navigation.map(
                ({
                  label,
                  to,
                  icon: Icon,
                  end,
                }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({
                      isActive,
                    }) =>
                      `flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${
                        isActive
                          ? "bg-primary text-white"
                          : "bg-surface-soft text-text-secondary"
                      }`
                    }
                  >
                    <Icon size={15} />

                    {label}
                  </NavLink>
                )
              )}

            </nav>

          </header>

          <main className="mx-auto max-w-[1500px] p-5 md:p-8">
            {children}
          </main>

        </div>

      </div>

    </div>
  );
};

export default BusinessLayout;