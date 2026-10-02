import { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router";

import {
  LogOut,
  Menu,
  Plane,
  UserRound,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import useAuthStore from "../store/authStore";


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const user = useAuthStore(
    (state) => state.user
  );

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated
    );

  const logout = useAuthStore(
    (state) => state.logout
  );


  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = async () => {
    try {
      await logout();

      toast.success(
        "Logged out successfully"
      );

      setMobileMenu(false);

      navigate("/", {
        replace: true,
      });
    } catch {
      toast.error(
        "Failed to logout"
      );
    }
  };


  const closeMenu = () => {
    setMobileMenu(false);
  };


  /* =========================
     DASHBOARD PATH
  ========================= */

  const dashboardPath =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "owner"
        ? "/business"
        : null;


  const isCustomer =
    isAuthenticated &&
    user?.role === "customer";


  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md">

      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 md:px-8">


        {/* =====================
            LOGO
        ===================== */}

        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
            <Plane size={23} />
          </div>

          <div>

            <h1 className="text-xl font-bold text-secondary">
              Faaro
            </h1>

            <p className="-mt-1 text-xs font-medium text-text-muted">
              Bookings
            </p>

          </div>

        </Link>


        {/* =====================
            DESKTOP NAV
        ===================== */}

        <nav className="hidden items-center gap-7 md:flex">

          <NavItem
            to="/"
            label="Home"
            pathname={
              location.pathname
            }
          />

          <NavItem
            to="/explore"
            label="Explore"
            pathname={
              location.pathname
            }
          />


          {/* CUSTOMER */}

          {isCustomer && (
            <>
              <NavItem
                to="/bookings"
                label="My Bookings"
                pathname={
                  location.pathname
                }
              />

              <NavItem
                to="/refunds"
                label="My Refunds"
                pathname={
                  location.pathname
                }
              />

              <NavItem
                to="/profile"
                label="Profile"
                pathname={
                  location.pathname
                }
              />
            </>
          )}


          {/* ADMIN / OWNER */}

          {isAuthenticated &&
            dashboardPath && (
              <NavItem
                to={dashboardPath}
                label="Dashboard"
                pathname={
                  location.pathname
                }
              />
            )}


          <NavItem
            to="/about"
            label="About"
            pathname={
              location.pathname
            }
          />

        </nav>


        {/* =====================
            DESKTOP RIGHT
        ===================== */}

        <div className="hidden items-center gap-3 md:flex">

          {!isAuthenticated ? (
            <>
              <Link
                to="/signin"
                className="rounded-xl px-5 py-3 text-sm font-semibold text-secondary transition hover:bg-surface-soft"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>

              {/* USER CARD */}

              {isCustomer ? (
                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded-xl bg-surface-soft px-3 py-2 transition hover:bg-primary-light"
                >

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary">
                    <UserRound
                      size={17}
                    />
                  </div>

                  <div className="max-w-[140px]">

                    <p className="truncate text-sm font-semibold text-secondary">
                      {user?.fullName}
                    </p>

                    <p className="text-[11px] capitalize text-text-muted">
                      Customer
                    </p>

                  </div>

                </Link>
              ) : (
                <div className="flex items-center gap-3 rounded-xl bg-surface-soft px-3 py-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary">
                    <UserRound
                      size={17}
                    />
                  </div>

                  <div className="max-w-[140px]">

                    <p className="truncate text-sm font-semibold text-secondary">
                      {user?.fullName}
                    </p>

                    <p className="text-[11px] capitalize text-text-muted">
                      {formatRole(
                        user?.role
                      )}
                    </p>

                  </div>

                </div>
              )}


              {/* LOGOUT */}

              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-text-secondary transition hover:border-red-200 hover:bg-red-50 hover:text-danger"
                title="Logout"
              >
                <LogOut
                  size={18}
                />
              </button>

            </>
          )}

        </div>


        {/* =====================
            MOBILE BUTTON
        ===================== */}

        <button
          type="button"
          onClick={() =>
            setMobileMenu(
              (prev) => !prev
            )
          }
          className="rounded-lg p-2 text-secondary md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileMenu ? (
            <X />
          ) : (
            <Menu />
          )}
        </button>

      </div>


      {/* =====================
          MOBILE MENU
      ===================== */}

      {mobileMenu && (
        <div className="border-t border-border bg-white px-5 py-5 md:hidden">


          {/* USER INFO */}

          {isAuthenticated &&
            user && (
              isCustomer ? (
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="mb-4 flex items-center gap-3 rounded-xl bg-surface-soft p-3 transition hover:bg-primary-light"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
                    <UserRound
                      size={19}
                    />
                  </div>

                  <div>

                    <p className="font-semibold text-secondary">
                      {user.fullName}
                    </p>

                    <p className="text-xs text-text-muted">
                      Customer
                    </p>

                  </div>

                </Link>
              ) : (
                <div className="mb-4 flex items-center gap-3 rounded-xl bg-surface-soft p-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
                    <UserRound
                      size={19}
                    />
                  </div>

                  <div>

                    <p className="font-semibold text-secondary">
                      {user.fullName}
                    </p>

                    <p className="text-xs capitalize text-text-muted">
                      {formatRole(
                        user.role
                      )}
                    </p>

                  </div>

                </div>
              )
            )}


          <nav className="flex flex-col gap-2">

            <MobileNavLink
              to="/"
              label="Home"
              active={
                location.pathname ===
                "/"
              }
              onClick={closeMenu}
            />

            <MobileNavLink
              to="/explore"
              label="Explore"
              active={
                location.pathname.startsWith(
                  "/explore"
                )
              }
              onClick={closeMenu}
            />


            {/* CUSTOMER */}

            {isCustomer && (
              <>
                <MobileNavLink
                  to="/bookings"
                  label="My Bookings"
                  active={
                    location.pathname.startsWith(
                      "/bookings"
                    )
                  }
                  onClick={closeMenu}
                />

                <MobileNavLink
                  to="/refunds"
                  label="My Refunds"
                  active={
                    location.pathname.startsWith(
                      "/refunds"
                    )
                  }
                  onClick={closeMenu}
                />

                <MobileNavLink
                  to="/profile"
                  label="Profile"
                  active={
                    location.pathname ===
                    "/profile"
                  }
                  onClick={closeMenu}
                />
              </>
            )}


            {/* DASHBOARD */}

            {isAuthenticated &&
              dashboardPath && (
                <MobileNavLink
                  to={
                    dashboardPath
                  }
                  label="Dashboard"
                  active={
                    location.pathname.startsWith(
                      dashboardPath
                    )
                  }
                  onClick={
                    closeMenu
                  }
                />
              )}


            <MobileNavLink
              to="/about"
              label="About"
              active={
                location.pathname ===
                "/about"
              }
              onClick={closeMenu}
            />


            <div className="my-2 h-px bg-border" />


            {/* AUTH */}

            {!isAuthenticated ? (
              <>
                <MobileNavLink
                  to="/signin"
                  label="Sign In"
                  active={
                    location.pathname ===
                    "/signin"
                  }
                  onClick={
                    closeMenu
                  }
                />

                <Link
                  to="/signup"
                  onClick={
                    closeMenu
                  }
                  className="rounded-xl bg-primary px-5 py-3 text-center font-semibold text-white"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-semibold text-danger transition hover:bg-red-50"
              >
                <LogOut
                  size={17}
                />

                Logout
              </button>
            )}

          </nav>

        </div>
      )}

    </header>
  );
};


/* ==========================
   DESKTOP LINK
========================== */

const NavItem = ({
  to,
  label,
  pathname,
}) => {
  const active =
    to === "/"
      ? pathname === "/"
      : pathname === to ||
        pathname.startsWith(
          `${to}/`
        );

  return (
    <Link
      to={to}
      className={`text-sm font-semibold transition ${
        active
          ? "text-primary"
          : "text-text-secondary hover:text-primary"
      }`}
    >
      {label}
    </Link>
  );
};


/* ==========================
   MOBILE LINK
========================== */

const MobileNavLink = ({
  to,
  label,
  active,
  onClick,
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`rounded-lg px-3 py-3 font-medium transition ${
        active
          ? "bg-primary-light text-primary"
          : "text-text-secondary hover:bg-surface-soft"
      }`}
    >
      {label}
    </Link>
  );
};


/* ==========================
   ROLE
========================== */

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


export default Navbar;