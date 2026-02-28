export default function Footer() {
    const quickLinks = [
        { label: "Beranda", href: "#beranda" },
        { label: "Tentang Kami", href: "#tentang" },
        { label: "Kamar", href: "#kamar" },
        { label: "Fasilitas", href: "#fasilitas" },
        { label: "Kontak", href: "#kontak" },
    ];

    return (
        <footer className="bg-[#1A1A2E] text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl font-serif font-bold tracking-wide">
                                LOJI
                            </span>
                            <span className="text-xs tracking-[0.3em] uppercase text-white/60">
                                Hotel Solo
                            </span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mb-6">
                            Hotel bintang tiga berkonsep Smart Luxury di jantung Kota Solo.
                            Menghadirkan perpaduan sempurna antara kenyamanan modern dan
                            keramahtamahan khas Jawa.
                        </p>
                        <div className="flex gap-4">
                            {/* Instagram */}
                            <a
                                href="#"
                                aria-label="Instagram"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                            {/* Facebook */}
                            <a
                                href="#"
                                aria-label="Facebook"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                </svg>
                            </a>
                            {/* TripAdvisor */}
                            <a
                                href="#"
                                aria-label="TripAdvisor"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-sm tracking-[0.2em] uppercase mb-6">
                            Navigasi
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-white/60 text-sm hover:text-primary transition-colors duration-300"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-sm tracking-[0.2em] uppercase mb-6">
                            Informasi Kontak
                        </h3>
                        <div className="space-y-4 text-white/60 text-sm">
                            <p>
                                Jl. Hasanuddin No. 134, Punggawan,
                                <br />
                                Banjarsari, Surakarta 57139
                            </p>
                            <p>Telepon: (0271) 123-4567</p>
                            <p>Email: info@lojihotelsolo.com</p>
                            <p>
                                Check-in: 14:00
                                <br />
                                Check-out: 12:00
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/40 text-xs">
                        2026 Loji Hotel Solo. Seluruh hak cipta dilindungi.
                    </p>
                    <div className="flex gap-6">
                        <a
                            href="#"
                            className="text-white/40 text-xs hover:text-white/70 transition-colors duration-300"
                        >
                            Kebijakan Privasi
                        </a>
                        <a
                            href="#"
                            className="text-white/40 text-xs hover:text-white/70 transition-colors duration-300"
                        >
                            Syarat & Ketentuan
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
