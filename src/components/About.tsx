export default function About() {
    const features = [
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                </svg>
            ),
            title: "Lokasi Strategis",
            description:
                "Terletak di pusat Kota Solo, hanya beberapa menit dari Stasiun Solo Balapan, Pura Mangkunegaran, dan kawasan kuliner Galabo.",
        },
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                </svg>
            ),
            title: "Smart Luxury",
            description:
                "Konsep kemewahan cerdas yang memadukan desain minimalis elegan dengan teknologi modern untuk kenyamanan optimal Anda.",
        },
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                </svg>
            ),
            title: "Layanan Prima",
            description:
                "Tim profesional kami siap melayani selama 24 jam dengan standar keramahan dan ketelitian tinggi untuk setiap kebutuhan Anda.",
        },
    ];

    return (
        <section id="tentang" className="section-padding bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-primary text-sm font-medium tracking-[0.3em] uppercase mb-3">
                        Tentang Kami
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-text mb-6">
                        Definisi Baru Menginap
                        <br />
                        di Kota Solo
                    </h2>
                    <div className="w-16 h-0.5 bg-primary mx-auto mb-6" />
                    <p className="text-text-secondary leading-relaxed text-base md:text-lg">
                        Loji Hotel Solo adalah hotel bintang tiga berkonsep Smart Luxury yang
                        berlokasi di Jl. Hasanuddin No. 134, Punggawan, Banjarsari,
                        Surakarta. Dirancang untuk para pelancong modern yang menghargai
                        efisiensi tanpa mengorbankan kenyamanan, kami menghadirkan harmoni
                        antara desain kontemporer, teknologi terkini, dan sentuhan
                        keramahtamahan khas Jawa.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            id={`feature-card-${index}`}
                            className="group p-8 rounded-2xl bg-bg border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                {feature.icon}
                            </div>
                            <h3 className="font-serif text-xl font-semibold text-text mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-text-secondary leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
