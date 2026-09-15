import { RoomScene, FurnitureItem, PlanElement } from '../types';
import indianKitchenImg from '../assets/images/foryn_indian_kitchen_1_1786438839476.jpg';
import indianWardrobeImg from '../assets/images/foryn_indian_wardrobe_1_1786438855628.jpg';
import indianLivingImg from '../assets/images/foryn_indian_living_1_1786438872133.jpg';
import classicKitchenImg from '../assets/images/foryn_kitchen_render_1786438263781.jpg';

export interface ProjectCardData {
  id: string;
  title: string;
  client: string;
  timeAgo: string;
  designCount: number;
  thumbnail: string;
  status: 'Draft' | 'In Production' | 'Approved';
}

export interface DesignCardData {
  id: string;
  title: string;
  projectName: string;
  timeAgo: string;
  thumbnail: string;
  type: '2D Layout' | '3D Render' | 'Production Sheet';
}

export const ROOM_SCENES: RoomScene[] = [
  {
    id: 'indian-kitchen-1',
    name: 'Indian Parallel Modular Kitchen',
    tagline: 'Teakwood Cabinets, Quartz Counter, Built-in Auto-Clean Chimney & Spice Pullouts',
    image: indianKitchenImg,
    renderTime: '0.3s (Foryn Cloud GPU)',
    style: 'Modern Indian Modular',
    lightingTemp: 3200,
    hotspots: [
      {
        id: 'hs-chimney',
        x: 48,
        y: 28,
        title: 'Foryn AirJet 90cm Hood Chimney',
        category: 'Kitchen Appliances',
        material: 'Black Toughened Glass & SS Baffle Filter',
        price: 34900,
        dimensions: '900 x 500 x 600 mm',
        description: 'Auto-clean heat thermal cleaning chimney with gesture control and 1500 m³/hr suction.',
        badge: 'Indian Cooking Ready',
        colorOptions: ['#0F172A', '#334155', '#475569']
      },
      {
        id: 'hs-spicerack',
        x: 65,
        y: 52,
        title: 'Brass Spice & Tandem Box Drawer',
        category: 'Hardware & Fittings',
        material: 'Soft-Close Blumotion SS 304 Pullout',
        price: 18500,
        dimensions: '300 x 500 x 600 mm',
        description: 'Multi-tier oil and masala container organizer with anti-slip magnetic matting.',
        badge: 'Heavy Load'
      },
      {
        id: 'hs-counter',
        x: 35,
        y: 68,
        title: 'Silq Quartz Countertop',
        category: 'Surfaces',
        material: 'Stain-Proof Engineered Quartz Slab',
        price: 68000,
        dimensions: '3000 x 650 x 20 mm',
        description: 'Heat resistant up to 250°C, non-porous surface impervious to turmeric & curry stains.',
        badge: 'Stain Proof'
      }
    ]
  },
  {
    id: 'indian-wardrobe-1',
    name: 'Luxury Indian Sliding Wardrobe',
    tagline: 'Floor-to-Ceiling Fluted Glass, Rattan Wicker Inlay, Integrated Vanity & Locker',
    image: indianWardrobeImg,
    renderTime: '0.4s (Foryn Cloud GPU)',
    style: 'Contemporary Indo-Modern',
    lightingTemp: 2900,
    hotspots: [
      {
        id: 'hs-wardrobe-door',
        x: 38,
        y: 45,
        title: 'Fluted Glass Sliding Door',
        category: 'Storage & Wardrobes',
        material: 'Champagne Gold Aluminium Frame & Fluted Toughened Glass',
        price: 125000,
        dimensions: '2800 x 2400 x 600 mm',
        description: 'Smooth soft-closing bi-passing sliding system with internal motion-sensor LED strips.',
        badge: 'Premium Finish',
        colorOptions: ['#D97706', '#1E293B', '#78350F']
      },
      {
        id: 'hs-vanity',
        x: 72,
        y: 55,
        title: 'Floating Vanity Dressing Unit',
        category: 'Dressing & Mirrors',
        material: 'Teak Veneer with LED Backlit Arched Mirror',
        price: 42000,
        dimensions: '1200 x 400 x 850 mm',
        description: 'Velvet lined jewellery drawers, hairdryer socket & touch-dimmable warm halo mirror.',
        badge: 'Custom Made'
      }
    ]
  },
  {
    id: 'indian-living-1',
    name: 'Royal Indian Living & Jhula Niche',
    tagline: 'Solid Teak Jhula Swing, Italian Marble Flooring & Brass Inlay Feature Wall',
    image: indianLivingImg,
    renderTime: '0.5s (Foryn Cloud GPU)',
    style: 'Modern Indian Luxury',
    lightingTemp: 3500,
    hotspots: [
      {
        id: 'hs-jhula',
        x: 45,
        y: 58,
        title: 'Royal Teakwood Jhula Swing',
        category: 'Seating & Swings',
        material: 'Handcrafted Burma Teak & Solid Brass Chains',
        price: 85000,
        dimensions: '1500 x 650 x 1800 mm',
        description: 'Traditional Indian ceiling suspended swing with plush velvet cushioning and brass carvings.',
        badge: 'Heritage Craft',
        colorOptions: ['#78350F', '#B45309', '#1E293B']
      },
      {
        id: 'hs-marble',
        x: 30,
        y: 82,
        title: 'Statuario Marble & Brass Inlay',
        category: 'Flooring',
        material: 'Imported Italian White Marble',
        price: 145000,
        dimensions: '20 sq. meters',
        description: 'High-gloss mirror polished marble floor with laser-cut geometric brass strip borders.',
        badge: 'Luxury Finish'
      }
    ]
  },
  {
    id: 'kitchen-classic',
    name: 'Minimalist Island Kitchen',
    tagline: 'Calacatta Quartz Island, Oak Wood Overhead Cabinets & Built-in Oven Suite',
    image: classicKitchenImg,
    renderTime: '0.4s (Foryn Cloud GPU)',
    style: 'Modern Minimalist',
    lightingTemp: 4000,
    hotspots: [
      {
        id: 'hs-stool-1',
        x: 42,
        y: 72,
        title: 'Milo Yellow Bar Stool',
        category: 'Seating',
        material: 'Molded Polypropylene & Brushed Chrome',
        price: 18500,
        dimensions: '420 x 440 x 820 mm',
        description: 'Ergonomic counter height swivel stool.',
        badge: 'Best Seller'
      }
    ]
  }
];

export const CATALOG_ITEMS: FurnitureItem[] = [
  {
    id: 'cat-in-1',
    name: 'Teakwood Jhula Swing',
    category: 'Furniture',
    price: 85000,
    dimensions: '1500 x 650 mm',
    material: 'Burma Teak & Brass',
    iconName: 'Armchair',
    color: '#78350F',
    thumbnail: indianLivingImg
  },
  {
    id: 'cat-in-2',
    name: 'Fluted Glass Sliding Wardrobe',
    category: 'Furniture',
    price: 125000,
    dimensions: '2800 x 2400 mm',
    material: 'Fluted Glass & Aluminium',
    iconName: 'Layers',
    color: '#D97706',
    thumbnail: indianWardrobeImg
  },
  {
    id: 'cat-in-3',
    name: 'AirJet 90cm Auto-Clean Chimney',
    category: 'Kitchen',
    price: 34900,
    dimensions: '900 x 500 mm',
    material: 'Toughened Glass & SS',
    iconName: 'Square',
    color: '#1E293B',
    thumbnail: indianKitchenImg
  },
  {
    id: 'cat-in-4',
    name: 'Backlit Mandir Puja Niche',
    category: 'Decor',
    price: 48000,
    dimensions: '900 x 450 x 1800 mm',
    material: 'Corian Stone & Warm LED',
    iconName: 'Sparkles',
    color: '#F59E0B',
    thumbnail: indianLivingImg
  },
  {
    id: 'cat-in-5',
    name: 'Italian Statuario Marble Slab',
    category: 'Materials',
    price: 450,
    dimensions: 'per sq.ft.',
    material: 'Natural Italian Marble',
    iconName: 'Layers',
    color: '#E2E8F0',
    thumbnail: classicKitchenImg
  }
];

export const INITIAL_PLAN_ELEMENTS: PlanElement[] = [
  { id: 'el-1', name: 'Parallel Kitchen Counter', x: 60, y: 60, width: 240, height: 90, rotation: 0, color: '#1E293B', type: 'Counter', price: 68000 },
  { id: 'el-2', name: 'Auto-Clean Chimney Unit', x: 120, y: 60, width: 100, height: 45, rotation: 0, color: '#334155', type: 'Appliance', price: 34900 },
  { id: 'el-3', name: 'Teakwood Jhula Swing', x: 380, y: 140, width: 150, height: 80, rotation: 0, color: '#78350F', type: 'Furniture', price: 85000 },
  { id: 'el-4', name: 'Sliding 4-Door Wardrobe', x: 360, y: 300, width: 220, height: 75, rotation: 0, color: '#D97706', type: 'Storage', price: 125000 }
];

export const MOCK_PROJECTS: ProjectCardData[] = [];

export const MOCK_DESIGNS: DesignCardData[] = [];
