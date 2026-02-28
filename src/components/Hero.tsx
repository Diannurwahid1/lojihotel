import Image from "next/image";

export default function Hero() {
    return (
        <section id="beranda" className="relative h-screen min-h-[700px] flex items-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero.png"
                    alt="Loji Hotel Solo exterior"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                    <p className="text-primary-light text-sm font-medium tracking-[0.3em] uppercase mb-4 animate-fade-in-up">
                        Smart Luxury Hotel
                    </p>
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up-delay-1">
                        Pengalaman Menginap
                        <br />
                        <span className="text-primary-light">Cerdas</span> di Jantung
                        <br />
                        Kota Solo
                    </h1>
                    <p className="text-white/80 text-base md:text-lg leading-relaxed mb-10 max-w-lg animate-fade-in-up-delay-2">
                        Hotel bintang tiga yang menghadirkan perpaduan sempurna antara
                        kenyamanan modern, teknologi pintar, dan keramahan khas Kota Solo.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up-delay-3">
                        <a
                            href="#kamar"
                            id="hero-cta"
                            className="px-8 py-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 text-center"
                        >
                            Lihat Kamar
                        </a>
                        <a
                            href="#tentang"
                            className="px-8 py-4 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300 text-center"
                        >
                            Tentang Kami
                        </a>
                    </div>
                </div>
            </div>

            {/* Booking Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-20">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <div className="bg-white rounded-t-2xl shadow-2xl p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-end">
                            <div>
                                <label className="block text-xs font-medium text-text-secondary tracking-wide uppercase mb-2">
                                    Tipe Kamar
                                </label>
                                <select
                                    id="booking-room-type"
                                    className="w-full px-4 py-3 bg-bg border border-gray-200 rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                >
                                    <option>Superior</option>
                                    <option>Deluxe</option>
                                    <option>Suite</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-secondary tracking-wide uppercase mb-2">
                                    Check-in
                                </label>
                                <input
                                    type="date"
                                    id="booking-checkin"
                                    className="w-full px-4 py-3 bg-bg border border-gray-200 rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-secondary tracking-wide uppercase mb-2">
                                    Check-out
                                </label>
                                <input
                                    type="date"
                                    id="booking-checkout"
                                    className="w-full px-4 py-3 bg-bg border border-gray-200 rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                />
                            </div>
                            <div>
                                <button
                                    id="booking-search"
                                    className="w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                                >
                                    Cari Ketersediaan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
