import { productImages } from "./productImages"

export interface Review {
  name: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Availability {
  status: 'in_stock' | 'out_of_stock' | 'pre_order';
  label: string;
  color: string;
}

export interface Product {
  id: number | string;
  name: string;
  price: number;
  category: string;
  rating: number;
  thumbnail?: string;
  images: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  brand: string;
  description: string;
  features: string[];
  overview: string[];
  colors: string[];
  reviews: Review[]
  specs: Record<string, string>;
  options?: Record<string, string[]>;
  availability?: Availability;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Blog {
  id: number;
  title: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  thumbnail: string;
  image: string;
  excerpt: string;
  content: string;
}

export const categories = ["Monitor", "Keyboard", "Mouse", "Headset", "Mousepad"];

export const products: Product[] = [
  { id: 1,
  name: 'ASUS ROG Swift OLED PG27UCDM',
  price: 15990000,
  category: "Monitor",
  rating: 4.9,
  thumbnail: productImages.p1.thumbnail,
  images: productImages.p1.images,
  isFeatured: true,
  isBestseller: false,
  brand: "Asus",
  description:
    "Monitor gaming premium 27 4K QD-OLED dengan refresh rate 240Hz dan response time ultra cepat 0.03ms. Ideal untuk gamer kompetitif, kreator konten & entertainment dengan visual tajam dan warna kaya.",
  features: [
    "4K UHD 3840×2160 OLED Panel",
    "240Hz Refresh Rate",
    "0.03ms Response Time (GtG)",
    "USB-C 90W Power Delivery",
    "Adaptive Sync & G-SYNC Compatible",
    "DisplayPort 2.1 & HDMI 2.1"
  ],
  overview: [
    "Panel QD-OLED dengan kontras tinggi dan warna kaya untuk visual tak tertandingi.",
    "Refresh rate 240Hz dan input lag rendah cocok untuk gaming FPS & racing.",
    "USB-C dengan 90W PD memungkinkan koneksi laptop serta charging.",
    "HDR 400 True Black memberikan detail highlight dan shadow lebih hidup."
  ],
  colors: ["Black", "Silver", "Gray"],
  specs: {
    Panel: "QD-OLED",
    Resolution: "3840×2160 (4K UHD)",
    RefreshRate: "240Hz",
    ResponseTime: "0.03ms (GtG)",
    Connectivity: "USB-C / HDMI / DisplayPort",
    Ports: "1× DisplayPort 2.1, 2× HDMI 2.1, 1× USB-C (90W PD), 3× USB-A 3.2, 1× Audio Out",
    Size: '27" (26.5" viewable)',
    Weight: "7.62 kg (dengan stand)",
    Dimensions: "610.3 × 549.5 × 218.8 mm (dengan stand)",
    Warranty: "3 Years Official Warranty"
  },
  options: {
    "Refresh Rate": ["60Hz", "120Hz", "144Hz", "240Hz"],
    "Panel": ["QD-OLED"],
    "HDR Mode": ["DisplayHDR 400 True Black"]
  },
  reviews: [
    {
      name: "Aditya",
      rating: 5.0,
      date: "2026-02-14",
      comment: "Warna luar biasa tajam, cocok banget buat gaming & editing!"
    },
    {
      name: "Febri",
      rating: 4.8,
      date: "2026-02-22",
      comment: "Refresh 240Hz bikin gameplay super halus, cuma butuh GPU mumpuni."
    },
  ],
  availability: { status: 'in_stock', label: 'Tersedia', color: 'green' }
},

  {id: 2,
  name: "TitanDisplay Gaming 27R",
  price: 4490000,
  category: "Monitor",
  rating: 4.7,
  thumbnail: productImages.p2.thumbnail,
  images: productImages.p2.images,
  isFeatured: true,
  isBestseller: true,
  brand: "TitanDisplay",
  description:
    "Monitor gaming 27 inci dengan refresh rate tinggi dan response cepat, memberikan visual halus dan pengalaman bermain optimal untuk gamer kompetitif serta penggunaan multimedia.",
  features: [
    "Refresh Rate 165Hz",
    "Response Time 1ms",
    "Adaptive Sync",
    "Panel IPS dengan warna akurat",
    "Desain bezeless modern"
  ],
  overview: [
    "Refresh rate 165Hz memberikan gerakan gambar yang halus tanpa blur saat gameplay cepat.",
    "Response time 1ms membantu kurangi ghosting dan efek blur di game FPS dan racing.",
    "Panel IPS memastikan warna yang konsisten dan sudut pandang luas.",
    "Desain bezel tipis cocok untuk setup multi-monitor."
  ],
  colors: ["Black"],
  specs: {
    Panel: "IPS",
    Resolution: "1920×1080 (Full HD)",
    RefreshRate: "165Hz",
    ResponseTime: "1ms (GtG)",
    Connectivity: "HDMI / DisplayPort",
    Ports: "1× HDMI 2.0, 1× DisplayPort 1.2, 1× Audio Out",
    Size: '27"',
    Weight: "4.1 kg",
    Dimensions: "613 × 459 × 195 mm (dengan stand)",
    Warranty: "1 Year Official Warranty"
  },
  options: {
    "Refresh Rate": ["60Hz", "120Hz", "144Hz", "165Hz"],
    Panel: ["IPS"],
    "Adaptive Sync": ["AMD FreeSync", "NVIDIA G-SYNC Compatible"]
  },
  reviews: [
    {
      name: "Rizal",
      rating: 4.6,
      date: "2026-01-15",
      comment: "Warna cukup akurat dan refresh tinggi bikin main game makin nyaman!"
    },
    {
      name: "Sita",
      rating: 4.8,
      date: "2026-01-25",
      comment: "Harga terjangkau dengan performa yang sangat memuaskan buat game."
    }
  ],
  availability: { status: 'in_stock', label: 'Tersedia', color: 'green' }
},

{id: 3,
  name: "LG UltraGear 24GN600",
  price: 3199000, 
  category: "Monitor",
  rating: 4.7,
  thumbnail: productImages.p3.thumbnail,
  images: productImages.p3.images,
  isFeatured: false,
  isBestseller: true,
  brand: "LG",
  description:
    "Monitor gaming 24\" Full HD dengan refresh rate 144Hz dan response time 1ms untuk pengalaman gaming responsif dan visual halus tanpa blur.",
  features: [
    "Refresh Rate 144Hz",
    "1ms Response Time (GtG)",
    "AMD FreeSync Premium",
    "Panel IPS dengan sudut pandang luas",
    "Desain bezel tipis modern"
  ],
  overview: [
    "Refresh rate 144Hz memberikan pergerakan gambar yang smooth dan minim tearing.",
    "Response time 1ms mengurangi ghosting saat aksi cepat di game FPS dan racing.",
    "Panel IPS memberikan warna akurat dan sudut pandang luas untuk grafis lebih konsisten.",
    "Desain bezel tipis cocok untuk setup multi-monitor atau estetika gaming."
  ],
  colors: ["Black"],
  specs: {
    Panel: "IPS",
    Resolution: "1920×1080 (Full HD)",
    RefreshRate: "144Hz",
    ResponseTime: "1ms (GtG)",
    Connectivity: "HDMI / DisplayPort",
    Ports: "2× HDMI 1.4, 1× DisplayPort 1.2, 1× Audio Out",
    Size: '24"',
    Weight: "3.9 kg (with stand)",
    Dimensions: "540 × 410 × 180 mm (with stand)",
    Warranty: "3 Years Official Warranty"
  },
  options: {
    "Refresh Rate": ["60Hz", "120Hz", "144Hz"],
    Panel: ["IPS"],
    "Adaptive Sync": ["AMD FreeSync Premium"]
  },
  reviews: [
    {
      name: "Arif",
      rating: 4.8,
      date: "2026-01-22",
      comment: "Gaming lancar tanpa blur, warna juga tajam meskipun Full HD."
    },
    {
      name: "Mira",
      rating: 4.6,
      date: "2026-02-01",
      comment: "Refresh 144Hz terasa banget untuk game kompetitif!"
    }
  ],
  availability: { status: 'in_stock', label: 'Tersedia', color: 'green' }
},

{
  id: 4,
  name: "Acer Nitro VG240Y",
  price: 2799000, 
  category: "Monitor",
  rating: 4.6,
  thumbnail: productImages.p4.thumbnail,
  images: productImages.p4.images,
  isFeatured: false,
  isBestseller: true,
  brand: "Acer",
  description:
    "Monitor gaming 23.8\" Full HD dengan panel IPS dan refresh rate hingga 75Hz–144Hz (tergantung varian). Cocok untuk gaming ringan, kerja, dan multimedia dengan desain zero-frame modern.",
  features: [
    "IPS Panel dengan sudut pandang luas",
    "AMD FreeSync Support",
    "ZeroFrame Design (Bezel Tipis)",
    "BlueLightShield & Flickerless",
    "Response Time hingga 1ms (VRB)"
  ],
  overview: [
    "Panel IPS memberikan warna lebih akurat dan konsisten dari berbagai sudut.",
    "Desain ZeroFrame membuat tampilan lebih modern dan cocok untuk setup multi-monitor.",
    "Teknologi BlueLightShield membantu mengurangi kelelahan mata.",
    "Mendukung AMD FreeSync untuk mengurangi screen tearing saat gaming."
  ],
  colors: ["Black"],
  specs: {
    Panel: "IPS",
    Resolution: "1920×1080 (Full HD)",
    RefreshRate: "75Hz (hingga 144Hz pada varian tertentu)",
    ResponseTime: "1ms (VRB)",
    Connectivity: "HDMI / VGA",
    Ports: "2× HDMI 1.4, 1× VGA, 1× Audio Out",
    Size: '23.8"',
    Weight: "3.4 kg (with stand)",
    Dimensions: "540 × 412 × 240 mm (with stand)",
    Warranty: "3 Years Official Warranty"
  },
  options: {
    "Refresh Rate": ["75Hz", "144Hz"],
    "Panel": ["IPS"],
    "Adaptive Sync": ["AMD FreeSync"]
  },
  reviews: [
    {
      name: "Rafi",
      rating: 4.5,
      date: "2026-01-12",
      comment: "Bagus untuk kerja dan gaming ringan, warna IPS-nya enak dilihat."
    },
    {
      name: "Lina",
      rating: 4.7,
      date: "2026-02-03",
      comment: "Desain tipisnya keren banget, cocok buat setup minimalis."
    }
  ],
  availability: { status: 'in_stock', label: 'Tersedia', color: 'green' }
},

{
  id: 5,
  name: "Razer BlackWidow V3",
  price: 2899000, 
  category: "Keyboard",
  rating: 4.7,
  thumbnail: productImages.pK1.thumbnail,
  images: productImages.pK1.images,
  isFeatured: true,
  isBestseller: true,
  brand: "Razer",
  description:
    "Keyboard gaming mekanik dengan switch responsif, RGB Chroma customizable, dan build quality premium — sempurna untuk gaming intensif maupun mengetik sehari-hari.",
  features: [
    "Mechanical Switch Razer Green",
    "Razer Chroma RGB Lighting",
    "Anti-Ghosting Full N-Key Rollover",
    "Dedicated Media Keys",
    "USB Passthrough"
  ],
  overview: [
    "Switch mekanik Razer Green memberikan feedback taktil dan klik yang memuaskan untuk gaming dan mengetik.",
    "RGB Chroma lighting bisa dikustomisasi lewat software untuk efek yang unik.",
    "Anti-ghosting dan full N-Key rollover memastikan semua tombol terdeteksi tanpa error.",
    "Media Keys dan volume roller membuat kontrol audio jadi lebih mudah."
  ],
  colors: ["Black"],
  specs: {
    SwitchType: "Razer Green Mechanical",
    Backlight: "Razer Chroma RGB",
    Layout: "Full Size (104 keys)",
    Connectivity: "USB 2.0 Wired",
    AntiGhosting: "Full N-Key Rollover",
    Size: "445 × 165 × 41 mm",
    Weight: "1.22 kg",
    Warranty: "1 Year Official Warranty"
  },
  options: {
    SwitchType: ["Razer Green", "Razer Yellow (Linear)"],
    Backlight: ["RGB Chroma"],
    Layout: ["Full Size"]
  },
  reviews: [
    {
      name: "Galih",
      rating: 4.8,
      date: "2026-01-15",
      comment: "Typing dan gaming sama-sama nyaman, RGBnya cakep banget!"
    },
    {
      name: "Sari",
      rating: 4.6,
      date: "2026-01-28",
      comment: "Build qualitynya terasa solid dan respons switchnya enak banget."
    }
  ],
  availability: { status: 'in_stock', label: 'Tersedia', color: 'green' }
},

{
  id: 6,
  name: "Corsair K70 RGB MK.2",
  price: 3599000,
  category: "Keyboard",
  rating: 4.8,
  thumbnail: productImages.pK2.thumbnail,
  images: productImages.pK2.images,
  isFeatured: false,
  isBestseller: false,
  brand: "Corsair",
  description:
    "Keyboard gaming mekanik premium dengan switch Cherry MX, pencahayaan RGB yang kaya, serta build aluminium yang kuat — ideal untuk gamer dan produktivitas tinggi.",
  features: [
    "Cherry MX Mechanical Switch",
    "Dynamic RGB Backlighting",
    "Aircraft-Grade Anodized Aluminium Frame",
    "Dedicated Media Keys",
    "USB Passthrough"
  ],
  overview: [
    "Switch Cherry MX memberikan feel mekanik yang konsisten dan presisi untuk gaming dan mengetik.",
    "Backlit RGB dinamis dapat dikustom lewat iCUE untuk efek unik di setiap game.",
    "Frame aluminium tahan lama dengan desain elegan dan profesional.",
    "Media keys memudahkan kontrol audio tanpa harus keluar dari game atau aplikasi."
  ],
  colors: ["Black"],
  specs: {
    SwitchType: "Cherry MX (Red/Blue/Brown opsi)",
    Backlight: "RGB per key",
    Layout: "Full Size (104 keys)",
    Connectivity: "USB 3.0 Wired",
    AntiGhosting: "Full N-Key Rollover",
    Size: "438 × 165 × 40 mm",
    Weight: "1.23 kg",
    Warranty: "2 Years Official Warranty"
  },
  options: {
    "Switch Type": ["Cherry MX Red", "Cherry MX Blue", "Cherry MX Brown"],
    Backlight: ["RGB per key"],
    Layout: ["Full Size"]
  },
  reviews: [
    {
      name: "Fahri",
      rating: 4.9,
      date: "2026-02-01",
      comment: "Build quality aluminium dan RGBnya bikin setupku makin keren!"
    },
    {
      name: "Dewi",
      rating: 4.7,
      date: "2026-02-12",
      comment: "Switch Cherry MX Red enak banget buat gameplay dan mengetik."
    }
  ],
  availability: { status: 'in_stock', label: 'Tersedia', color: 'green' }
},
{
  id: 7,
  name: "Logitech G Pro X Keyboard",
  price: 3299000, 
  category: "Keyboard",
  rating: 4.8,
  thumbnail: productImages.pK3.thumbnail,
  images: productImages.pK3.images,
  isFeatured: true,
  isBestseller: false,
  brand: "Logitech",
  description:
    "Keyboard mekanik pro-gaming dengan switch yang bisa diganti (Hot-Swappable), desain compact tenkeyless, dan RGB LIGHTSYNC yang bisa dikustom buat pengalaman bermain makin maksimal.",
  features: [
    "Hot-Swappable Switch",
    "RGB LIGHTSYNC per Key",
    "Tenkeyless Compact Layout",
    "Pro-Grade Build Quality",
    "Programmable Macro Keys"
  ],
  overview: [
    "Switch bisa diganti tanpa solder, cocok jika kamu ingin custom feel keyboardmu.",
    "RGB LIGHTSYNC mendukung efek visual yang disinkronisasi dengan game dan aplikasi.",
    "Layout tenkeyless membuat keyboard lebih ringkas & mudah dibawa.",
    "Build quality kuat dan respons tombol stabil buat gamer serius."
  ],
  colors: ["Black"],
  specs: {
    SwitchType: "Hot-Swappable (GX Blue / Tactile / Linear)",
    Backlight: "RGB per Key (LIGHTSYNC)",
    Layout: "Tenkeyless (87 keys)",
    Connectivity: "USB Wired",
    AntiGhosting: "Full N-Key Rollover",
    Size: "368 × 150 × 34 mm",
    Weight: "860 g",
    Warranty: "1 Year Official Warranty"
  },
  options: {
    "Switch Type": ["GX Blue (Tactile)", "GX Red (Linear)", "GX Brown (Tactile)"],
    Backlight: ["RGB per Key"],
    Layout: ["Tenkeyless"]
  },
  reviews: [
    {
      name: "Ilham", rating: 4.9, date: "2026-02-05", comment: "Switch hot-swappable bikin aku bisa ganti feel sesuai game yang aku mainin!"
    },
    {
      name: "Maya", rating: 4.7, date: "2026-02-15", comment: "Compact dan buildnya solid, cocok buat gamer yang sering bawa keyboardnya."
    }
  ],
  availability: { status: 'in_stock', label: 'Tersedia', color: 'green' }
},
{
  id: 8,
  name: "SteelSeries Apex 5",
  price: 2399000, 
  category: "Keyboard",
  rating: 4.6,
  thumbnail: productImages.pK4.thumbnail,
  images: productImages.pK4.images,
  isFeatured: false,
  isBestseller: false,
  brand: "SteelSeries",
  description:
    "Keyboard hybrid mekanik-membrane dengan layar OLED cerdas, pencahayaan RGB dinamis, dan build yang nyaman untuk gaming maupun kerja harian.",
  features: [
    "Hybrid Mechanical-Membrane Switch",
    "Smart OLED Display",
    "RGB per Key",
    "Dedicated Media Keys",
    "Aircraft-Grade Aluminum Frame"
  ],
  overview: [
    "Switch hybrid memberikan pengalaman tombol yang nyaman untuk gaming dan mengetik.",
    "OLED Display menampilkan informasi real-time seperti profil, jam, dan preset.",
    "RGB dinamis dapat dikustom untuk efek sesuai kebutuhanmu.",
    "Build frame aluminium membuat keyboard terasa kokoh dan tahan lama."
  ],
  colors: ["Black"],
  specs: {
    SwitchType: "Hybrid Mechanical-Membrane",
    Backlight: "RGB per Key",
    Layout: "Full Size (104 keys)",
    Connectivity: "USB Wired",
    AntiGhosting: "Full N-Key Rollover",
    Size: "444 × 139 × 38 mm",
    Weight: "1.04 kg",
    Warranty: "1 Year Official Warranty"
  },
  options: {
    "Backlight": ["RGB per Key"],
    Layout: ["Full Size"],
    "Display Mode": ["Smart OLED Info"]
  },
  reviews: [
    {
      name: "Rendy", rating: 4.7, date: "2026-02-08", comment: "OLED nya unik banget buat tampilkan info saat main game."
    },
    {
      name: "Nisa", rating: 4.5, date: "2026-02-17", comment: "Buildnya kokoh dan tombolnya responsif buat kerja atau game."
    }
  ],
  availability: { status: 'in_stock', label: 'Tersedia', color: 'green' }
},
{
  id: 9,
  name: "Logitech G502 Hero",
  price: 799000, 
  category: "Mouse",
  rating: 4.7,
  thumbnail: productImages.pM1.thumbnail,
  images: productImages.pM1.images,
  isFeatured: true,
  isBestseller: true,
  brand: "Logitech",
  description:
    "Mouse gaming performa tinggi dengan sensor HERO 25K yang sangat presisi, 11 tombol yang dapat diprogram, serta sistem berat yang dapat disesuaikan untuk pengalaman gaming yang lebih personal.",
  features: [
    "HERO 25K Optical Sensor",
    "11 Programmable Buttons",
    "LIGHTSYNC RGB Lighting",
    "Adjustable Weight System",
    "Onboard Memory Profiles"
  ],
  overview: [
    "Sensor HERO 25K memberikan akurasi tracking hingga 25.600 DPI tanpa smoothing atau acceleration.",
    "11 tombol yang dapat diprogram memungkinkan kontrol game yang lebih fleksibel.",
    "RGB LIGHTSYNC dapat disinkronkan dengan perangkat Logitech G lainnya.",
    "Sistem adjustable weight memungkinkan pengguna menyesuaikan keseimbangan mouse."
  ],
  colors: ["Black"],
  specs: {
    Sensor: "HERO 25K Optical Sensor",
    DPI: "100 – 25,600 DPI",
    Buttons: "11 Programmable Buttons",
    PollingRate: "1000 Hz (1 ms)",
    Connectivity: "USB Wired",
    Weight: "121 g",
    Dimensions: "132 × 75 × 40 mm",
    Lighting: "LIGHTSYNC RGB",
    Warranty: "2 Years Official Warranty"
  },
  options: {
    DPI: ["800", "1600", "3200", "6400", "25600"],
    Lighting: ["RGB LIGHTSYNC"],
    WeightSystem: ["Adjustable Weights (5 × 3.6g)"]
  },
  reviews: [
    {
      name: "Andi",
      rating: 4.8,
      date: "2026-01-20",
      comment: "Sensor presisi banget dan tombolnya banyak, cocok buat FPS."
    },
    {
      name: "Kevin", rating: 4.6, date: "2026-02-03", comment: "Grip nyaman dan bisa atur berat mouse sesuai preferensi."
    }
  ],
  availability: { status: 'in_stock', label: 'Tersedia', color: 'green' }
}
];

export const blogs: Blog[] = [
  {
    id: 1,
    title: "5 Tips Memilih Monitor Gaming yang Tepat untuk Budget Mahasiswa",
    category: "Tips",
    tags: ["monitor", "gaming", "budget", "mahasiswa"],
    author: "Admin TK",
    date: "Oct 12, 2023",
    thumbnail: productImages.pB1.thumbnail,
    image: productImages.pB1.images,
    excerpt: "Memilih monitor gaming tidak harus mahal. Berikut tips cerdas agar kamu mendapatkan pengalaman visual terbaik tanpa menguras kantong.",
    content: "Memilih monitor gaming yang tepat bisa menjadi tantangan tersendiri, terutama bagi mahasiswa yang memiliki budget terbatas. Namun, bukan berarti kamu harus mengorbankan kualitas. Berikut adalah 5 tips yang bisa membantu kamu mendapatkan monitor gaming terbaik sesuai budget. Pertama, perhatikan refresh rate minimal 75Hz. Kedua, pastikan response time di bawah 5ms. Ketiga, pilih panel IPS untuk warna yang akurat. Keempat, ukuran 24 inch sudah cukup untuk kebanyakan setup. Kelima, bandingkan harga di berbagai toko online sebelum membeli."
  },
  {
    id: 2,
    title: "Keyboard Mechanical vs Membrane: Mana yang Lebih Worth It?",
    category: "Review",
    tags: ["keyboard", "mechanical", "membrane", "perbandingan"],
    author: "Tech Team",
    date: "Nov 5, 2023",
    thumbnail: productImages.pB2.thumbnail,
    image: productImages.pB2.Images,
    excerpt: "Perdebatan klasik antara keyboard mechanical dan membrane. Kami breakdown kelebihan dan kekurangan masing-masing.",
    content: "Keyboard mechanical dan membrane memiliki karakteristik yang sangat berbeda. Keyboard mechanical menggunakan switch individual untuk setiap tombol, memberikan feedback yang lebih responsif dan tahan lama. Sementara keyboard membrane menggunakan lapisan membran yang lebih murah untuk diproduksi. Dari segi durabilitas, mechanical keyboard bisa bertahan hingga 50 juta keystroke, sedangkan membrane biasanya hanya 5-10 juta. Namun, membrane keyboard memiliki keunggulan dalam hal harga dan tingkat kebisingan yang lebih rendah."
  },
  {
    id: 3,
    title: "Setup Streaming Budget 5 Juta untuk Pemula",
    category: "Tips",
    tags: ["streaming", "setup", "budget", "pemula"],
    author: "Admin TK",
    date: "Dec 1, 2023",
    thumbnail: productImages.st1.thumbnail,
    image: productImages.st1.images,
    excerpt: "Mulai karir streaming kamu tanpa harus menghabiskan puluhan juta. Ini dia setup lengkap yang bisa kamu rakit dengan budget terjangkau.",
    content: "Memulai streaming tidak harus mahal. Dengan budget 5 juta rupiah, kamu sudah bisa memiliki setup streaming yang cukup baik untuk memulai. Yang kamu butuhkan adalah headset dengan mikrofon yang jernih, webcam HD, dan tentunya koneksi internet yang stabil. Untuk headset, kami merekomendasikan model entry-level yang sudah memiliki noise cancellation. Tambahkan ring light sederhana untuk pencahayaan, dan kamu sudah siap untuk live streaming pertamamu."
  },
  {
    id: 4,
    title: "Trend Peripheral Gaming 2024: Apa yang Harus Kamu Tahu",
    category: "News",
    tags: ["trend", "peripheral", "gaming", "wireless"],
    author: "Tech Team",
    date: "Jan 15, 2024",
    thumbnail: productImages.trd.thumbnail,
    image: productImages.trd.images,
    excerpt: "Dari wireless yang semakin dominan hingga AI-powered peripherals, inilah trend yang akan mengubah cara kamu bermain game.",
    content: "Tahun 2024 membawa banyak inovasi di dunia peripheral gaming. Trend wireless semakin mendominasi dengan latency yang semakin rendah, membuat perbedaan antara wired dan wireless semakin tipis. Selain itu, teknologi AI mulai diintegrasikan ke dalam mouse dan keyboard untuk adaptive sensitivity dan macro yang lebih pintar. Dari segi desain, trend minimalis dengan build quality premium semakin disukai oleh gamer dan content creator. Monitor dengan refresh rate 240Hz dan 360Hz juga semakin terjangkau."
  },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
};
