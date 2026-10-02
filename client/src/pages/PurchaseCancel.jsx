import { Link } from "react-router";

import {
  ArrowLeft,
  CreditCard,
} from "lucide-react";

import Navbar from "../components/Navbar";


const PurchaseCancel = () => {
  return (
    <div className="min-h-screen bg-background">

      <Navbar />

      <main className="mx-auto flex min-h-[75vh] max-w-[650px] items-center justify-center px-5 py-16">

        <div className="w-full rounded-[28px] border border-border bg-white p-8 text-center shadow-sm sm:p-12">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-warning">

            <CreditCard
              size={38}
            />

          </div>

          <h1 className="mt-6 text-3xl font-bold text-secondary">
            Payment not completed
          </h1>

          <p className="mx-auto mt-4 max-w-md leading-7 text-text-secondary">
            Your payment was not
            completed. Your booking
            has not been confirmed.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

            <Link
              to="/bookings"
              className="rounded-xl bg-primary px-6 py-3 font-semibold text-white"
            >
              My Bookings
            </Link>

            <Link
              to="/explore"
              className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 font-semibold text-secondary"
            >
              <ArrowLeft
                size={17}
              />

              Explore
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
};


export default PurchaseCancel;