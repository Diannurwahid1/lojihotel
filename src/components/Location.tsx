export default function Location() {
    const landmarks = [
        { name: "Stasiun Solo Balapan", distance: "5 menit berkendara" },
        { name: "Pura Mangkunegaran", distance: "7 menit berkendara" },
        { name: "Kawasan Kuliner Galabo", distance: "10 menit berkendara" },
        { name: "Pusat Perbelanjaan Solo", distance: "8 menit berkendara" },
        { name: "Bandara Adi Soemarmo", distance: "20 menit berkendara" },
    ];

    return (
        <section id="kontak" className="section-padding bg-bg">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-primary text-sm font-medium tracking-[0.3em] uppercase mb-3">
                        Lokasi & Kontak
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-text mb-6">
                        Temukan Kami di
                        <br />
                        Jantung Kota Solo
                    </h2>
                    <div className="w-16 h-0.5 bg-primary mx-auto mb-6" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Map */}
                    <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] lg:h-full min-h-[400px]">
                        <iframe
                            title="Lokasi Loji Hotel Solo"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.1!2d110.82!3d-7.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMzQnMTIuMCJTIDExMMKwNDknMTIuMCJF!5e0!3m2!1sid!2sid!4v1234567890"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                    {/* Info */}
                    <div className="space-y-8">
                        {/* Address */}
                        <div>
                            <h3 className="font-serif text-xl font-semibold text-text mb-4">
                                Alamat
                            </h3>
                            <p className="text-text-secondary leading-relaxed">
                                Jl. Hasanuddin No. 134, Punggawan, Banjarsari,
                                <br />
                                Surakarta (Solo) 57139, Jawa Tengah, Indonesia
                            </p>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="font-serif text-xl font-semibold text-text mb-4">
                                Hubungi Kami
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-text-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                    <span>(0271) 123-4567</span>
                                </div>
                                <div className="flex items-center gap-3 text-text-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                    <span>info@lojihotelsolo.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-text-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Check-in: 14:00 | Check-out: 12:00</span>
                                </div>
                            </div>
                        </div>

                        {/* Landmarks */}
                        <div>
                            <h3 className="font-serif text-xl font-semibold text-text mb-4">
                                Landmark Terdekat
                            </h3>
                            <ul className="space-y-3">
                                {landmarks.map((landmark, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                                    >
                                        <span className="text-text text-sm font-medium">
                                            {landmark.name}
                                        </span>
                                        <span className="text-text-secondary text-sm">
                                            {landmark.distance}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
