/**
 * Seed data for rooms
 */
import prisma from './lib/prisma';

async function main() {
    console.log('Seeding database...');

    // Clear existing rooms
    await prisma.room.deleteMany();

    // Create rooms matching the Mimpi Bungalow theme
    const rooms = await prisma.room.createMany({
        data: [
            {
                name: 'Standard Bungalow',
                slug: 'standard-bungalow',
                type: 'standard',
                price: 950000,
                priceUsd: 65,
                description: 'A cozy retreat wrapped in natural bamboo and warm wood tones. Fall asleep to the gentle rustle of palm trees outside your window.',
                features: [
                    'Queen-size bed with premium linens',
                    'Air conditioning & ceiling fan',
                    'Garden view private terrace',
                    'Ensuite bathroom with rain shower',
                ],
                image: '/images/room-superior.png',
                rating: '4.7',
                maxGuests: 2,
                totalRooms: 8,
            },
            {
                name: 'Deluxe Bungalow',
                slug: 'deluxe-bungalow',
                type: 'deluxe',
                price: 1600000,
                priceUsd: 110,
                description: 'Wake up to panoramic ocean views from your private balcony. Spacious interiors blend Balinese craftsmanship with modern luxury.',
                features: [
                    'King-size bed with ocean view',
                    'AC, Smart TV & mini bar',
                    'Private balcony with lounger',
                    'Outdoor shower & soaking tub',
                ],
                image: '/images/room-deluxe.png',
                rating: '4.8',
                maxGuests: 3,
                totalRooms: 5,
            },
            {
                name: 'Suite Bungalow',
                slug: 'suite-bungalow',
                type: 'suite',
                price: 2700000,
                priceUsd: 185,
                description: 'The ultimate island escape with a private plunge pool and direct beach access. Where luxury meets the untouched beauty of Bali.',
                features: [
                    'Separate bedroom & living area',
                    'Private plunge pool & deck',
                    'Direct beach access',
                    'Premium bath amenities & bathrobe',
                ],
                image: '/images/room-suite.png',
                rating: '4.9',
                maxGuests: 4,
                totalRooms: 3,
            },
        ],
    });

    console.log(`Created ${rooms.count} rooms`);
    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
