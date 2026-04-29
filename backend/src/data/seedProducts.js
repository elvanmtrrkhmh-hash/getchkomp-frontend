import Product from '../models/Product.js';

export const seedProducts = async () => {
  try {
    // Check if products already exist
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`✓ Products already seeded (${existingCount} products exist)`);
      return;
    }

    const products = [
      {
        name: 'ASUS ROG Swift OLED PG27UCDM',
        description:
          'Monitor gaming premium 27 4K QD-OLED dengan refresh rate 240Hz dan response time ultra cepat 0.03ms. Ideal untuk gamer kompetitif, kreator konten & entertainment dengan visual tajam dan warna kaya.',
        brand: 'ASUS',
        category: 'Monitor',
        price: 15990000,
        rating: 4.9,
        thumbnail: '/products/asus-rog-1.jpg',
        gallery: [
          '/products/asus-rog-1.jpg',
          '/products/asus-rog-2.jpg',
          '/products/asus-rog-3.jpg',
        ],
        key_features: [
          '4K UHD 3840×2160 OLED Panel',
          '240Hz Refresh Rate',
          '0.03ms Response Time (GtG)',
          'USB-C 90W Power Delivery',
          'Adaptive Sync & G-SYNC Compatible',
          'DisplayPort 2.1 & HDMI 2.1',
        ],
        product_overview: [
          'Panel QD-OLED dengan kontras tinggi dan warna kaya untuk visual tak tertandingi.',
          'Refresh rate 240Hz dan input lag rendah cocok untuk gaming FPS & racing.',
          'USB-C dengan 90W PD memungkinkan koneksi laptop serta charging.',
          'HDR 400 True Black memberikan detail highlight dan shadow lebih hidup.',
        ],
        available_colors: ['Black', 'Silver', 'Gray'],
        featured: true,
        bestseller: false,
        stock: 5,
        specifications: {
          Panel: 'QD-OLED',
          Resolution: '3840×2160 (4K UHD)',
          RefreshRate: '240Hz',
          ResponseTime: '0.03ms (GtG)',
          Connectivity: 'USB-C / HDMI / DisplayPort',
          Ports: '1× DisplayPort 2.1, 2× HDMI 2.1, 1× USB-C (90W PD)',
          Size: '27"',
          Weight: '7.62 kg',
          Warranty: '3 Years',
        },
        reviews: [
          {
            name: 'Aditya',
            rating: 5.0,
            date: '2026-02-14',
            comment: 'Warna luar biasa tajam, cocok banget buat gaming & editing!',
          },
          {
            name: 'Febri',
            rating: 4.8,
            date: '2026-02-22',
            comment: 'Refresh 240Hz bikin gameplay super halus, cuma butuh GPU mumpuni.',
          },
        ],
      },
      {
        name: 'TitanDisplay Gaming 27R',
        description:
          'Monitor gaming 27 inci dengan refresh rate tinggi dan response cepat, memberikan visual halus dan pengalaman bermain optimal untuk gamer kompetitif serta penggunaan multimedia.',
        brand: 'TitanDisplay',
        category: 'Monitor',
        price: 4490000,
        rating: 4.7,
        thumbnail: '/products/titan-27-1.jpg',
        gallery: [
          '/products/titan-27-1.jpg',
          '/products/titan-27-2.jpg',
        ],
        key_features: [
          'Refresh Rate 165Hz',
          'Response Time 1ms',
          'Adaptive Sync',
          'Panel IPS dengan warna akurat',
          'Desain bezeless modern',
        ],
        product_overview: [
          'Refresh rate 165Hz memberikan gerakan gambar yang halus tanpa blur saat gameplay cepat.',
          'Response time 1ms membantu kurangi ghosting dan efek blur di game FPS dan racing.',
          'Panel IPS memastikan warna yang konsisten dan sudut pandang luas.',
          'Desain bezel tipis cocok untuk setup multi-monitor.',
        ],
        available_colors: ['Black'],
        featured: true,
        bestseller: true,
        stock: 15,
        specifications: {
          Panel: 'IPS',
          Resolution: '1920×1080 (Full HD)',
          RefreshRate: '165Hz',
          ResponseTime: '1ms (GtG)',
          Connectivity: 'HDMI / DisplayPort',
          Ports: '1× HDMI 2.0, 1× DisplayPort 1.2, 1× Audio Out',
          Size: '27"',
          Weight: '4.1 kg',
          Warranty: '1 Year',
        },
        reviews: [
          {
            name: 'Rizal',
            rating: 4.6,
            date: '2026-01-15',
            comment:
              'Warna cukup akurat dan refresh tinggi bikin main game makin nyaman!',
          },
          {
            name: 'Sita',
            rating: 4.8,
            date: '2026-01-25',
            comment: 'Harga terjangkau dengan performa yang sangat memuaskan buat game.',
          },
        ],
      },
      {
        name: 'LG UltraGear 24GN600',
        description:
          'Monitor gaming 24" Full HD dengan refresh rate 144Hz dan response time 1ms untuk pengalaman gaming responsif dan visual halus tanpa blur.',
        brand: 'LG',
        category: 'Monitor',
        price: 3199000,
        rating: 4.7,
        thumbnail: '/products/lg-24-1.jpg',
        gallery: ['/products/lg-24-1.jpg', '/products/lg-24-2.jpg'],
        key_features: [
          'Refresh Rate 144Hz',
          '1ms Response Time (GtG)',
          'AMD FreeSync Premium',
          'Panel IPS dengan sudut pandang luas',
          'Desain bezel tipis modern',
        ],
        product_overview: [
          'Refresh rate 144Hz memberikan pergerakan gambar yang smooth dan minim tearing.',
          'Response time 1ms ideal untuk gaming kompetitif dengan input lag minimal.',
          'AMD FreeSync Premium menghilangkan screen tearing dan stuttering.',
          'Ukuran 24" compact cocok untuk desk gaming yang terbatas.',
        ],
        available_colors: ['Black'],
        featured: false,
        bestseller: true,
        stock: 20,
        specifications: {
          Panel: 'IPS',
          Resolution: '1920×1080 (Full HD)',
          RefreshRate: '144Hz',
          ResponseTime: '1ms (GtG)',
          Connectivity: 'HDMI / DisplayPort',
          Size: '24"',
          Weight: '3.5 kg',
          Warranty: '2 Years',
        },
        reviews: [
          {
            name: 'Budi',
            rating: 4.7,
            date: '2026-03-01',
            comment: 'Monitor bagus untuk harga segini, layar jernih dan refresh smooth.',
          },
        ],
      },
      {
        name: 'Corsair K95 RGB Platinum',
        description:
          'Mechanical gaming keyboard dengan switch premium, RGB lighting yang dapat disesuaikan, dan makro untuk performa gaming maksimal.',
        brand: 'Corsair',
        category: 'Keyboard',
        price: 2890000,
        rating: 4.8,
        thumbnail: '/products/corsair-k95-1.jpg',
        gallery: ['/products/corsair-k95-1.jpg'],
        key_features: [
          'Mechanical Switches (Cherry MX)',
          'Per-key RGB Lighting',
          'Customizable Macros',
          'Aluminum Frame',
          'USB Type-C Connection',
        ],
        product_overview: [
          'Switch mekanik Cherry MX memberikan feedback tactile yang presisi.',
          'RGB lighting per-key dengan software customization lengkap.',
          'Programmable macro keys untuk gaming dan produktivitas.',
        ],
        available_colors: ['Black'],
        featured: false,
        bestseller: false,
        stock: 8,
        specifications: {
          SwitchType: 'Cherry MX',
          Lighting: 'Per-key RGB',
          Layout: 'Full Size',
          Material: 'Aluminum + Plastic',
          Connection: 'USB Type-C',
        },
        reviews: [],
      },
      {
        name: 'Razer DeathAdder V3',
        description:
          'Gaming mouse dengan sensor 30K DPI, desain ergonomis, dan butchrome dampening untuk akurasi maksimal.',
        brand: 'Razer',
        category: 'Mouse',
        price: 899000,
        rating: 4.6,
        thumbnail: '/products/razer-deathadder-1.jpg',
        gallery: ['/products/razer-deathadder-1.jpg'],
        key_features: [
          'Focus Pro Sensor (30K DPI)',
          'Ergonomic Right-handed Design',
          'RGB Lighting',
          '8 Programmable Buttons',
          'Wireless with 70-hour Battery',
        ],
        product_overview: [
          'Sensor canggih dengan tracking presisi untuk gaming kompetitif.',
          'Desain ergonomis nyaman untuk sesi gaming panjang.',
        ],
        available_colors: ['Black', 'White'],
        featured: true,
        bestseller: true,
        stock: 30,
        specifications: {
          Sensor: '30K DPI',
          DPI: '100 - 30000',
          Buttons: '8 Programmable',
          Connection: 'Wireless (2.4GHz)',
          BatteryLife: '70 hours',
        },
        reviews: [
          {
            name: 'Chandra',
            rating: 4.6,
            date: '2026-02-10',
            comment: 'Mouse yang responsive, cocok untuk FPS game.',
          },
        ],
      },
      {
        name: 'SteelSeries Arctis 9',
        description:
          'Gaming headset dengan ChatMix teknologi, noise-cancelling mic, dan kenyamanan maksimal untuk gaming marathon.',
        brand: 'SteelSeries',
        category: 'Headset',
        price: 1799000,
        rating: 4.7,
        thumbnail: '/products/steelseries-arctis-1.jpg',
        gallery: ['/products/steelseries-arctis-1.jpg'],
        key_features: [
          'ChatMix Dial Technology',
          'Noise-cancelling Microphone',
          'Wireless 2.4GHz + Bluetooth',
          'Comfortable Memory Foam Ear Cushions',
          '30-hour Battery Life',
        ],
        product_overview: [
          'ChatMix technology mengatur game dan chat audio secara real-time.',
          'Mic noise-cancelling menghilangkan background noise.',
          'Dual connectivity (wireless + Bluetooth) untuk fleksibilitas.',
        ],
        available_colors: ['Black', 'White'],
        featured: false,
        bestseller: false,
        stock: 12,
        specifications: {
          Connection: 'Wireless 2.4GHz + Bluetooth',
          MicrophoneType: 'Noise-cancelling',
          BatteryLife: '30 hours',
          Impedance: '32 Ohms',
          Frequency: '20Hz - 20kHz',
        },
        reviews: [],
      },
    ];

    // Insert all products
    const result = await Product.insertMany(products);
    console.log(`✓ Seeded ${result.length} products successfully`);

    // Log created product IDs
    result.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} (ID: ${product._id})`);
    });

    return result;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
};
