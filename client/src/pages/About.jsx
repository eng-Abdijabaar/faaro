import {
  ArrowRight,
  Building2,
  Car,
  CheckCircle2,
  Hotel,
  Search,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

import { Link } from "react-router";

import Navbar from "../components/Navbar";


const About = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary">

      {/* =========================
          NAVBAR
      ========================= */}

      <Navbar />

      {/* =========================
          HERO
      ========================= */}

      <section className="border-b border-border bg-white">

        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:px-8 lg:grid-cols-2 lg:items-center lg:py-28">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles size={16} />
              About Faaro
            </div>

            <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-secondary md:text-6xl">
              One place for your
              next stay, car or
              apartment.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-text-secondary">
              Faaro Bookings makes it
              easier to discover and
              book hotels, rental cars
              and apartments through one
              simple platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-white transition hover:bg-primary-dark"
              >
                Explore Bookings

                <ArrowRight size={18} />
              </Link>

              <Link
                to="/signup"
                className="rounded-xl border border-border bg-white px-6 py-3.5 font-semibold text-secondary transition hover:bg-surface-soft"
              >
                Create Account
              </Link>

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative">

            <div className="rounded-[32px] bg-primary p-8 text-white md:p-10">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                Faaro Bookings
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                Simple booking from
                discovery to payment.
              </h2>

              <div className="mt-8 space-y-4">

                <HeroFeature
                  text="Browse available hotels, cars and apartments"
                />

                <HeroFeature
                  text="Create and manage your bookings"
                />

                <HeroFeature
                  text="Complete payments securely"
                />

                <HeroFeature
                  text="Track booking and payment status"
                />

              </div>

            </div>

            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-white p-5 shadow-lg md:block">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <ShieldCheck size={22} />
                </div>

                <div>

                  <p className="font-bold text-secondary">
                    Simple & Secure
                  </p>

                  <p className="text-xs text-text-muted">
                    Designed for easy booking
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          CATEGORIES
      ========================= */}

      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-8">

        <div className="max-w-2xl">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            What you can book
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-secondary md:text-4xl">
            Three categories.
            One booking experience.
          </h2>

          <p className="mt-4 leading-7 text-text-secondary">
            Faaro focuses on three
            essential booking categories
            and keeps the experience
            consistent across all of them.
          </p>

        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <CategoryCard
            icon={<Hotel size={28} />}
            title="Hotels"
            description="Browse hotel rooms, compare options and choose dates that work for your stay."
            link="/explore?category=hotel"
          />

          <CategoryCard
            icon={<Car size={28} />}
            title="Car Rentals"
            description="Find available rental cars and choose your pickup and return dates."
            link="/explore?category=car_rental"
          />

          <CategoryCard
            icon={<Building2 size={28} />}
            title="Apartments"
            description="Discover apartments for short stays with clear details and simple booking."
            link="/explore?category=apartment"
          />

        </div>

      </section>

      {/* =========================
          HOW IT WORKS
      ========================= */}

      <section className="border-y border-border bg-white">

        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8">

          <div className="text-center">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold text-secondary md:text-4xl">
              From search to confirmed booking
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-text-secondary">
              The booking flow is kept
              simple so customers can
              focus on finding the right
              option.
            </p>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <StepCard
              number="01"
              icon={<Search size={23} />}
              title="Explore"
              description="Browse hotels, cars and apartments by category, city and price."
            />

            <StepCard
              number="02"
              icon={<CheckCircle2 size={23} />}
              title="Create Booking"
              description="Choose your dates and create your booking before payment."
            />

            <StepCard
              number="03"
              icon={<WalletCards size={23} />}
              title="Pay"
              description="Complete payment securely from your bookings page."
            />

            <StepCard
              number="04"
              icon={<ShieldCheck size={23} />}
              title="Confirmed"
              description="After successful payment, your booking can be confirmed."
            />

          </div>

        </div>

      </section>

      {/* =========================
          PURPOSE
      ========================= */}

      <section className="mx-auto grid max-w-[1400px] gap-10 px-5 py-20 md:px-8 lg:grid-cols-2 lg:items-center">

        <div>

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Our purpose
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-secondary md:text-4xl">
            Make local booking
            easier to understand
            and manage.
          </h2>

          <p className="mt-5 max-w-xl leading-8 text-text-secondary">
            Faaro brings customers and
            booking businesses together
            through a straightforward
            digital experience. Customers
            can discover available units,
            create bookings, complete
            payments and keep track of
            their booking history.
          </p>

        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <ValueCard
            icon={<Search />}
            title="Easy discovery"
            description="Browse options without complicated navigation."
          />

          <ValueCard
            icon={<ShieldCheck />}
            title="Clear booking flow"
            description="Booking and payment are separated into understandable steps."
          />

          <ValueCard
            icon={<WalletCards />}
            title="Secure payments"
            description="Customers complete payment through Stripe Checkout."
          />

          <ValueCard
            icon={<CheckCircle2 />}
            title="Booking management"
            description="Customers can track their bookings and current status."
          />

        </div>

      </section>

      {/* =========================
          ROLES
      ========================= */}

      <section className="bg-secondary">

        <div className="mx-auto max-w-[1400px] px-5 py-20 text-white md:px-8">

          <div className="max-w-2xl">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-light">
              Built for everyone
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              A platform for customers
              and booking businesses.
            </h2>

          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            <RoleCard
              title="Customers"
              description="Explore units, create bookings, complete payments, request refunds and manage bookings."
            />

            <RoleCard
              title="Business Owners"
              description="Manage their business and the units customers can discover and book."
            />

            <RoleCard
              title="Administrators"
              description="Manage the platform, users and business activity."
            />

          </div>

        </div>

      </section>

      {/* =========================
          CTA
      ========================= */}

      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-8">

        <div className="overflow-hidden rounded-[32px] bg-primary px-6 py-12 text-center text-white md:px-12 md:py-16">

          <h2 className="mx-auto max-w-2xl text-3xl font-bold md:text-4xl">
            Ready to find your
            next booking?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-white/80">
            Explore available hotels,
            rental cars and apartments
            and create your next booking.
          </p>

          <Link
            to="/explore"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-primary transition hover:bg-white/90"
          >
            Start Exploring

            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </div>
  );
};


/* =============================
   HERO FEATURE
============================= */

const HeroFeature = ({ text }) => {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
        <CheckCircle2 size={17} />
      </div>

      <p className="text-sm font-medium text-white/90">
        {text}
      </p>

    </div>
  );
};


/* =============================
   CATEGORY CARD
============================= */

const CategoryCard = ({
  icon,
  title,
  description,
  link,
}) => {
  return (
    <Link
      to={link}
      className="group rounded-3xl border border-border bg-white p-7 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
    >

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary transition group-hover:bg-primary group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold text-secondary">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-text-secondary">
        {description}
      </p>

      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
        Explore

        <ArrowRight
          size={16}
          className="transition group-hover:translate-x-1"
        />
      </div>

    </Link>
  );
};


/* =============================
   STEP CARD
============================= */

const StepCard = ({
  number,
  icon,
  title,
  description,
}) => {
  return (
    <div className="relative rounded-2xl border border-border bg-background p-6">

      <span className="absolute right-5 top-5 text-3xl font-bold text-primary/10">
        {number}
      </span>

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-secondary">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-text-secondary">
        {description}
      </p>

    </div>
  );
};


/* =============================
   VALUE CARD
============================= */

const ValueCard = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-secondary">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-text-secondary">
        {description}
      </p>

    </div>
  );
};


/* =============================
   ROLE CARD
============================= */

const RoleCard = ({
  title,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

      <div className="mb-5 h-1 w-10 rounded-full bg-primary" />

      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-white/70">
        {description}
      </p>

    </div>
  );
};


export default About;