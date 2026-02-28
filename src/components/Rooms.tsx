import Image from "next/image";

interface Room {
    name: string;
    price: string;
    image: string;
    features: string[];
    description: string;
}

const rooms: Room[] = [
    {
        name: "Superior",
        price: "Rp 350.000",
        image: "/images/room-superior.png",
        description:
            "Kamar yang dirancang dengan sentuhan minimalis modern, menawarkan kenyamanan esensial bagi Anda yang mengutamakan efisiensi.",
        features: [
            "Tempat tidur queen-size premium",
            "AC dan Smart TV",
            "WiFi berkecepatan tinggi",
            "Kamar mandi dengan shower air panas",
        ],
    },
    {
        name: "Deluxe",
        price: "Rp 500.000",
        image: "/images/room-deluxe.png",
        description:
            "Ruang yang lebih luas dengan fasilitas tambahan untuk pengalaman menginap yang lebih sempurna dan berkesan.",
        features: [
            "Tempat tidur king-size premium",
            "AC, Smart TV, dan meja kerja",
            "WiFi berkecepatan tinggi",
            "Area duduk terpisah",
        ],
    },
    {
        name: "Suite",
        price: "Rp 700.000",
        image: "/images/room-suite.png",
        description:
            "Pengalaman menginap tertinggi dengan ruang tamu terpisah dan fasilitas eksklusif untuk kenyamanan tanpa kompromi.",
        features: [
            "Ruang tidur dan tamu terpisah",
            "Smart TV di setiap ruangan",
            "WiFi premium dan minibar",
            "Kamar mandi mewah dengan bathtub",
        ],
    },
];

export default function Rooms() {
    return (
        <section id="kamar" className="section-padding bg-bg">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-primary text-sm font-medium tracking-[0.3em] uppercase mb-3">
                        Akomodasi
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-text mb-6">
                        Pilihan Kamar untuk
                        <br />
                        Setiap Kebutuhan
                    </h2>
                    <div className="w-16 h-0.5 bg-primary mx-auto mb-6" />
                    <p className="text-text-secondary leading-relaxed">
                        Setiap kamar dirancang dengan perhatian terhadap detail, memadukan
                        estetika modern dengan kenyamanan fungsional untuk memastikan
                        istirahat terbaik Anda.
                    </p>
                </div>

                {/* Room Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {rooms.map((room, index) => (
                        <div
                            key={index}
                            id={`room-card-${room.name.toLowerCase()}`}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1"
                        >
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={room.image}
                                    alt={`Kamar ${room.name} - Loji Hotel Solo`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-primary text-white text-xs font-medium px-4 py-2 rounded-full">
                                    Mulai {room.price}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <h3 className="font-serif text-2xl font-semibold text-text mb-2">
                                    {room.name}
                                </h3>
                                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                                    {room.description}
                                </p>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {room.features.map((feature, fIdx) => (
                                        <li
                                            key={fIdx}
                                            className="flex items-center gap-3 text-sm text-text-secondary"
                                        >
                                            <svg
                                                className="w-4 h-4 text-primary flex-shrink-0"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4.5 12.75l6 6 9-13.5"
                                                />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href="#kontak"
                                    className="block w-full py-3 text-center border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                                >
                                    Pesan Sekarang
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Price Note */}
                <p className="text-center text-text-secondary text-xs mt-8">
                    * Harga dapat berubah sesuai musim dan ketersediaan. Harga belum
                    termasuk pajak dan biaya layanan.
                </p>
            </div>
        </section>
    );
}
