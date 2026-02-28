"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Beranda", href: "#beranda" },
        { label: "Tentang", href: "#tentang" },
        { label: "Kamar", href: "#kamar" },
        { label: "Fasilitas", href: "#fasilitas" },
        { label: "Kontak", href: "#kontak" },
    ];

    return (
        <nav
            id="navbar"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "bg-white/95 backdrop-blur-md shadow-lg"
                    : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div
                            className={`text-2xl font-serif font-bold tracking-wide transition-colors duration-300 ${scrolled ? "text-primary" : "text-white"
                                }`}
                        >
                            LOJI
                        </div>
                        <div
                            className={`hidden sm:block text-xs tracking-[0.3em] uppercase transition-colors duration-300 ${scrolled ? "text-text-secondary" : "text-white/80"
                                }`}
                        >
                            Hotel Solo
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-primary relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${scrolled ? "text-text" : "text-white/90"
                                    }`}
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="#kamar"
                            className="ml-2 px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                        >
                            Reservasi
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        id="mobile-menu-toggle"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`block w-6 h-0.5 transition-all duration-300 ${mobileOpen
                                    ? "rotate-45 translate-y-2 bg-text"
                                    : scrolled
                                        ? "bg-text"
                                        : "bg-white"
                                }`}
                        />
                        <span
                            className={`block w-6 h-0.5 transition-all duration-300 ${mobileOpen
                                    ? "opacity-0"
                                    : scrolled
                                        ? "bg-text"
                                        : "bg-white"
                                }`}
                        />
                        <span
                            className={`block w-6 h-0.5 transition-all duration-300 ${mobileOpen
                                    ? "-rotate-45 -translate-y-2 bg-text"
                                    : scrolled
                                        ? "bg-text"
                                        : "bg-white"
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-500 overflow-hidden ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-4 space-y-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="block py-3 text-text text-sm font-medium tracking-wide hover:text-primary transition-colors duration-300"
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#kamar"
                        onClick={() => setMobileOpen(false)}
                        className="block mt-3 px-6 py-3 bg-primary text-white text-sm font-medium rounded-lg text-center hover:bg-primary-dark transition-all duration-300"
                    >
                        Reservasi
                    </a>
                </div>
            </div>
        </nav>
    );
}
