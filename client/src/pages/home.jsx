import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
    ArrowRight,
    BadgeDollarSign,
    Building2,
    CalendarDays,
    Car,
    Headphones,
    Hotel,
    MapPin,
    Menu,
    Plane,
    Search,
    ShieldCheck,
    Star,
    X,
} from "lucide-react";
import Navbar from "../components/Navbar";

const HOME_IMAGES = {
  hero: "https://images.unsplash.com/photo-1660519167902-42fa6857567c?auto=format&fit=crop&w=2200&q=85",
  hotel: "https://images.unsplash.com/photo-1741487433406-d0fd4d788fb4?auto=format&fit=crop&w=1200&q=80",
  car: "https://images.unsplash.com/photo-1650530579355-7ad9d4766043?auto=format&fit=crop&w=1200&q=80",
  apartment: "https://images.unsplash.com/photo-1742569635629-a44737b5a5dd?auto=format&fit=crop&w=1200&q=80",
  featuredHotel: "https://images.unsplash.com/photo-1771775529138-a7a20ba7e032?auto=format&fit=crop&w=1200&q=80",
  featuredCar: "https://images.unsplash.com/photo-1650530579355-7ad9d4766043?auto=format&fit=crop&w=1200&q=80",
  featuredApartment: "https://images.unsplash.com/photo-1742569635629-a44737b5a5dd?auto=format&fit=crop&w=1200&q=80",
  whyFaaro: "https://images.unsplash.com/photo-1775212295680-85b054fa4bad?auto=format&fit=crop&w=1600&q=85",
};

const Home = () => {
    const navigate = useNavigate();

    const [mobileMenu, setMobileMenu] = useState(false);

    const [searchData, setSearchData] = useState({
        category: "hotel",
        city: "",
        startDate: "",
        endDate: "",
    });

    const handleSearch = (e) => {
        e.preventDefault();

        const params = new URLSearchParams();

        params.set("category", searchData.category);

        if (searchData.city.trim()) {
            params.set("city", searchData.city.trim());
        }

        if (searchData.startDate) {
            params.set("startDate", searchData.startDate);
        }

        if (searchData.endDate) {
            params.set("endDate", searchData.endDate);
        }

        navigate(`/explore?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-background text-text-primary">
            {/* ================= NAVBAR ================= */}

            <Navbar />


            {/* ================= HERO ================= */}

            <section className="">
                <div
                    className="relative mx-auto min-h-[650px]  overflow-hidden  bg-cover bg-center"
                    style={{
                        backgroundImage: `
              linear-gradient(
                90deg,
                rgba(8, 31, 45, .86) 0%,
                rgba(8, 31, 45, .65) 45%,
                rgba(8, 31, 45, .18) 100%
              ),
              url("${HOME_IMAGES.hero}")
            `,
                    }}
                >
                    <div className="flex min-h-[650px] items-center px-6 py-16 sm:px-10 md:px-16 lg:px-20">
                        <div className="w-full max-w-3xl">
                            <div className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                                Explore Somalia with confidence
                            </div>

                            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                                Your next journey
                                <span className="block text-teal-300">
                                    starts with Faaro.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                                Discover trusted hotels, comfortable apartments and
                                reliable car rentals — all in one place.
                            </p>

                            {/* Search Box */}
                            <form
                                onSubmit={handleSearch}
                                className="mt-10 rounded-2xl bg-white p-3 shadow-2xl sm:p-4"
                            >
                                {/* Category tabs */}
                                <div className="mb-4 flex gap-2 overflow-x-auto">
                                    <CategoryTab
                                        active={searchData.category === "hotel"}
                                        icon={<Hotel size={17} />}
                                        label="Hotels"
                                        onClick={() =>
                                            setSearchData((prev) => ({
                                                ...prev,
                                                category: "hotel",
                                            }))
                                        }
                                    />

                                    <CategoryTab
                                        active={searchData.category === "car_rental"}
                                        icon={<Car size={17} />}
                                        label="Cars"
                                        onClick={() =>
                                            setSearchData((prev) => ({
                                                ...prev,
                                                category: "car_rental",
                                            }))
                                        }
                                    />

                                    <CategoryTab
                                        active={searchData.category === "apartment"}
                                        icon={<Building2 size={17} />}
                                        label="Apartments"
                                        onClick={() =>
                                            setSearchData((prev) => ({
                                                ...prev,
                                                category: "apartment",
                                            }))
                                        }
                                    />
                                </div>

                                {/* Inputs */}
                                <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
                                    <SearchInput
                                        icon={<MapPin size={19} />}
                                        label="Location"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Where are you going?"
                                            value={searchData.city}
                                            onChange={(e) =>
                                                setSearchData((prev) => ({
                                                    ...prev,
                                                    city: e.target.value,
                                                }))
                                            }
                                            className="w-full bg-transparent text-sm text-secondary outline-none placeholder:text-text-muted"
                                        />
                                    </SearchInput>

                                    <SearchInput
                                        icon={<CalendarDays size={19} />}
                                        label="Start date"
                                    >
                                        <input
                                            type="date"
                                            value={searchData.startDate}
                                            onChange={(e) =>
                                                setSearchData((prev) => ({
                                                    ...prev,
                                                    startDate: e.target.value,
                                                }))
                                            }
                                            className="w-full bg-transparent text-sm text-secondary outline-none"
                                        />
                                    </SearchInput>

                                    <SearchInput
                                        icon={<CalendarDays size={19} />}
                                        label="End date"
                                    >
                                        <input
                                            type="date"
                                            value={searchData.endDate}
                                            onChange={(e) =>
                                                setSearchData((prev) => ({
                                                    ...prev,
                                                    endDate: e.target.value,
                                                }))
                                            }
                                            className="w-full bg-transparent text-sm text-secondary outline-none"
                                        />
                                    </SearchInput>

                                    <button
                                        type="submit"
                                        className="flex min-h-16 items-center justify-center gap-2 rounded-xl bg-primary px-7 font-semibold text-white transition hover:bg-primary-dark"
                                    >
                                        <Search size={19} />
                                        Search
                                    </button>
                                </div>
                            </form>

                            <p className="mt-5 text-sm text-white/70">
                                Popular: Mogadishu • Hargeisa • Garowe • Kismayo
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= CATEGORIES ================= */}

            <section className="mx-auto max-w-[1650px] px-5 py-24 md:px-8">
                <SectionHeading
                    small="Find what you need"
                    title="Explore by category"
                    description="Whether you're looking for a place to stay or a car for your journey, Faaro makes it simple."
                />

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    <CategoryCard
                        title="Hotels"
                        description="Discover comfortable hotel rooms for business, family trips and vacations."
                        image={HOME_IMAGES.hotel}
                        icon={<Hotel />}
                        to="/explore?category=hotel"
                    />

                    <CategoryCard
                        title="Car Rentals"
                        description="Find reliable vehicles for your next trip with simple and secure booking."
                        image={HOME_IMAGES.car}
                        icon={<Car />}
                        to="/explore?category=car_rental"
                    />

                    <CategoryCard
                        title="Apartments"
                        description="Find private apartments that feel like home wherever your journey takes you."
                        image={HOME_IMAGES.apartment}
                        icon={<Building2 />}
                        to="/explore?category=apartment"
                    />
                </div>
            </section>

            {/* ================= FEATURED ================= */}

            <section className="bg-surface-soft py-24">
                <div className="mx-auto max-w-[1650px] px-5 md:px-8">
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <SectionHeading
                            small="Popular choices"
                            title="Featured places"
                            description="Explore some of the places travelers are discovering on Faaro."
                        />

                        <Link
                            to="/explore"
                            className="flex shrink-0 items-center gap-2 font-semibold text-primary"
                        >
                            Explore all
                            <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        <ListingCard
                            id="1"
                            image={HOME_IMAGES.featuredHotel}
                            category="Hotel"
                            title="Ocean View Hotel"
                            city="Mogadishu"
                            rating="4.8"
                            price="85"
                        />

                        <ListingCard
                            id="2"
                            image={HOME_IMAGES.featuredCar}
                            category="Car Rental"
                            title="Toyota Land Cruiser"
                            city="Mogadishu"
                            rating="4.9"
                            price="60"
                        />

                        <ListingCard
                            id="3"
                            image={HOME_IMAGES.featuredApartment}
                            category="Apartment"
                            title="Modern City Apartment"
                            city="Hargeisa"
                            rating="4.7"
                            price="75"
                        />
                    </div>
                </div>
            </section>

            {/* ================= HOW IT WORKS ================= */}

            <section className="mx-auto max-w-[1650px] px-5 py-24 md:px-8">
                <SectionHeading
                    small="Simple booking"
                    title="How Faaro works"
                    description="Finding and booking what you need only takes a few steps."
                    center
                />

                <div className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-3">
                    <StepCard
                        number="01"
                        icon={<Search size={26} />}
                        title="Search"
                        description="Choose hotels, cars or apartments and search your preferred location."
                    />

                    <StepCard
                        number="02"
                        icon={<CalendarDays size={26} />}
                        title="Choose"
                        description="Compare available options and select the one that works best for you."
                    />

                    <StepCard
                        number="03"
                        icon={<ShieldCheck size={26} />}
                        title="Book securely"
                        description="Complete your booking through our secure payment process."
                    />
                </div>
            </section>

            {/* ================= WHY FAARO ================= */}

            <section className="mx-auto max-w-[1650px] px-5 pb-24 md:px-8">
                <div className="grid overflow-hidden rounded-[28px] bg-secondary lg:grid-cols-2">
                    <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-300">
                            Why Faaro?
                        </p>

                        <h2 className="mt-4 max-w-xl text-4xl font-bold leading-tight text-white md:text-5xl">
                            Booking made simple, secure and reliable.
                        </h2>

                        <p className="mt-5 max-w-xl leading-7 text-white/65">
                            We bring hotels, vehicles and apartments together in
                            one simple marketplace.
                        </p>

                        <div className="mt-10 space-y-6">
                            <WhyItem
                                icon={<ShieldCheck />}
                                title="Secure booking"
                                text="Simple and protected booking experience."
                            />

                            <WhyItem
                                icon={<BadgeDollarSign />}
                                title="Competitive prices"
                                text="Compare different options before you book."
                            />

                            <WhyItem
                                icon={<Headphones />}
                                title="Support when needed"
                                text="Get help throughout your booking journey."
                            />
                        </div>
                    </div>

                    <div className="min-h-[450px]">
                        <img
                            src={HOME_IMAGES.whyFaaro}
                            alt="Travel with Faaro Bookings"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* ================= BUSINESS CTA ================= */}

            <section className="mx-auto max-w-[1650px] px-5 pb-24 md:px-8">
                <div className="relative overflow-hidden rounded-[28px] bg-primary px-7 py-14 sm:px-12 lg:px-16">
                    <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                        <div>
                            <p className="font-semibold text-teal-100">
                                For business owners
                            </p>

                            <h2 className="mt-2 max-w-2xl text-3xl font-bold text-white md:text-4xl">
                                Grow your business with Faaro Bookings.
                            </h2>

                            <p className="mt-4 max-w-xl leading-7 text-white/75">
                                Join the platform and make your hotel, rental cars or
                                apartments available to more customers.
                            </p>
                        </div>

                        <Link
                            to="/signup"
                            className="flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-primary transition hover:bg-slate-100"
                        >
                            Become a partner
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= FOOTER ================= */}

            <footer className="border-t border-border bg-white">
                <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                                <Plane size={21} />
                            </div>

                            <span className="text-xl font-bold text-secondary">
                                Faaro Bookings
                            </span>
                        </Link>

                        <p className="mt-5 max-w-sm leading-7 text-text-secondary">
                            Discover and book hotels, cars and apartments through
                            one simple platform.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-secondary">
                            Explore
                        </h3>

                        <div className="mt-5 flex flex-col gap-3 text-sm text-text-secondary">
                            <Link to="/explore?category=hotel">
                                Hotels
                            </Link>

                            <Link to="/explore?category=car_rental">
                                Cars
                            </Link>

                            <Link to="/explore?category=apartment">
                                Apartments
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-secondary">
                            Company
                        </h3>

                        <div className="mt-5 flex flex-col gap-3 text-sm text-text-secondary">
                            <Link to="/about">
                                About
                            </Link>

                            <Link to="/signin">
                                Sign In
                            </Link>

                            <Link to="/signup">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border">
                    <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-3 px-5 py-6 text-sm text-text-muted sm:flex-row md:px-8">
                        <p>
                            © 2026 Faaro Bookings. All rights reserved.
                        </p>

                        <p>
                            Hotels • Cars • Apartments
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

/* ======================================================
   SMALL COMPONENTS
====================================================== */

const MobileLink = ({ to, label }) => {
    return (
        <Link
            to={to}
            className="rounded-lg px-3 py-3 font-medium text-text-secondary hover:bg-surface-soft"
        >
            {label}
        </Link>
    );
};

const CategoryTab = ({
    active,
    icon,
    label,
    onClick,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition ${active
                    ? "bg-primary text-white"
                    : "bg-surface-soft text-text-secondary hover:text-primary"
                }`}
        >
            {icon}
            {label}
        </button>
    );
};

const SearchInput = ({
    icon,
    label,
    children,
}) => {
    return (
        <div className="flex min-h-16 items-center gap-3 rounded-xl border border-border px-4">
            <div className="text-primary">
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <p className="mb-1 text-xs font-semibold text-text-muted">
                    {label}
                </p>

                {children}
            </div>
        </div>
    );
};

const SectionHeading = ({
    small,
    title,
    description,
    center = false,
}) => {
    return (
        <div
            className={
                center
                    ? "mx-auto max-w-2xl text-center"
                    : "max-w-2xl"
            }
        >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                {small}
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-secondary md:text-4xl">
                {title}
            </h2>

            <p className="mt-4 leading-7 text-text-secondary">
                {description}
            </p>
        </div>
    );
};

const CategoryCard = ({
    image,
    icon,
    title,
    description,
    to,
}) => {
    return (
        <Link
            to={to}
            className="group overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-1 hover:shadow-xl"
        >
            <div className="h-56 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
            </div>

            <div className="p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                    {icon}
                </div>

                <h3 className="text-xl font-bold text-secondary">
                    {title}
                </h3>

                <p className="mt-3 leading-7 text-text-secondary">
                    {description}
                </p>

                <div className="mt-6 flex items-center gap-2 font-semibold text-primary">
                    Explore
                    <ArrowRight
                        size={17}
                        className="transition group-hover:translate-x-1"
                    />
                </div>
            </div>
        </Link>
    );
};

const ListingCard = ({
    id,
    image,
    category,
    title,
    city,
    rating,
    price,
}) => {
    return (
        <Link
            to={`/unit/${id}`}
            className="group overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-1 hover:shadow-xl"
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-secondary">
                    {category}
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-start justify-between gap-5">
                    <div>
                        <h3 className="text-lg font-bold text-secondary">
                            {title}
                        </h3>

                        <div className="mt-2 flex items-center gap-1.5 text-sm text-text-secondary">
                            <MapPin size={15} />
                            {city}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 font-semibold text-secondary">
                        <Star
                            size={17}
                            className="fill-warning text-warning"
                        />
                        {rating}
                    </div>
                </div>

                <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
                    <div>
                        <span className="text-2xl font-bold text-secondary">
                            ${price}
                        </span>

                        <span className="text-sm text-text-muted">
                            {" "}
                            / night
                        </span>
                    </div>

                    <span className="font-semibold text-primary">
                        View details
                    </span>
                </div>
            </div>
        </Link>
    );
};

const StepCard = ({
    number,
    icon,
    title,
    description,
}) => {
    return (
        <div className="relative rounded-2xl border border-border bg-white p-7 text-center">
            <span className="absolute right-5 top-4 text-5xl font-bold text-slate-100">
                {number}
            </span>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
                {icon}
            </div>

            <h3 className="mt-6 text-xl font-bold text-secondary">
                {title}
            </h3>

            <p className="mt-3 leading-7 text-text-secondary">
                {description}
            </p>
        </div>
    );
};

const WhyItem = ({
    icon,
    title,
    text,
}) => {
    return (
        <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-teal-300">
                {icon}
            </div>

            <div>
                <h3 className="font-semibold text-white">
                    {title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-white/60">
                    {text}
                </p>
            </div>
        </div>
    );
};

export default Home;