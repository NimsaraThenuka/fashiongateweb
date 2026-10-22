export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'women' | 'men' | 'kids' | 'accessories' | 'new';
  subcategory: string;
  image: string;
  images: string[];
  description: string;
  sizeFit?: string;
  sizes: string[];
  colors: string[];
  rating: number;
  reviews: number;
  badge?: 'new' | 'sale' | 'trending' | 'limited';
  stockQuantity?: number;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Printed Slevless Long dress',
    price: 4590,
    originalPrice: 22000,
    category: 'women',
    subcategory: 'dresses',
    image: 'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556615/1_1.png_zo0tna.jpg',
    images: [
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556615/1_1.png_zo0tna.jpg',
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556615/17.png_izvo20.jpg',
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556619/Group_7.png_rxkdgl.jpg',
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556620/Group_10.png_kn241l.jpg',
    ],
    description: 'A printed sleeveless long dress (maxi dress) is a light, floor-length outfit featuring patterns like florals or abstracts.',
    sizeFit: 'Designed for a relaxed, comfortable silhouette with a breezy drape. If you prefer a closer fit, consider sizing down one size.',
    sizes: ['Free Size'],
    colors: ['Standard'],
    rating: 5,
    reviews: 1,
    badge: 'new',
    stockQuantity: 15,
    inStock: true,
  },
  {
    id: 2,
    name: 'Printed Slevless Long dress',
    price: 5590,
    category: 'women',
    subcategory: 'dresses',
    image: 'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556616/9.png_alwvjr.jpg',
    images: [
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556616/9.png_alwvjr.jpg',
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556616/8.png_jyob5q.jpg',
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556619/Group_6.png_xtiah5.jpg',
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556619/Group_5.png_pdz6cg.jpg',
    ],
    description: 'A printed sleeveless long dress (maxi dress) is a light, floor-length outfit featuring patterns like florals or abstracts.',
    sizes: ['XS', 'M'],
    colors: ['Standard'],
    rating: 5,
    reviews: 1,
    badge: 'new',
    stockQuantity: 15,
    inStock: true,
  },
  {
    id: 3,
    name: 'Long sleeve printed shirts',
    price: 2290,
    category: 'men',
    subcategory: 'shirts',
    image: 'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556617/12.png_jamxt8.jpg',
    images: [
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556617/12.png_jamxt8.jpg',
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556617/11.png_su3mnq.jpg',
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556617/Group_1.png_byn690.jpg',
    ],
    description: 'A long-sleeve printed shirt is a garment with full-length sleeves and a decorative pattern, graphic, or design (such as florals, abstracts, tonal prints, or logos) printed onto the fabric.',
    sizes: ['M', 'L', 'XL'],
    colors: ['White', 'grey'],
    rating: 5,
    reviews: 1,
    badge: 'new',
    stockQuantity: 15,
    inStock: true,
  },
  {
    id: 4,
    name: 'Sleevless Tshirt',
    price: 2190,
    category: 'women',
    subcategory: 'dresses',
    image: 'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556615/3.png_v52k4t.jpg',
    images: [
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556615/3.png_v52k4t.jpg',
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556614/2.png_pxbpjv.jpg',
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556616/5.png_mdhyay.jpg',
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556615/4.png_aqq007.jpg',
    ],
    description: 'A sleeveless shirt is any garment manufactured without sleeves or with its sleeves cut off. It keeps the arms free and provides airflow, making it a popular choice for hot weather, athletic training, casual wear, or as an underlayer.',
    sizes: ['Free Size'],
    colors: ['Dark blue', 'Black', 'brown'],
    rating: 5,
    reviews: 1,
    badge: 'new',
    stockQuantity: 15,
    inStock: true,
  },
  {
    id: 5,
    name: 'White pants',
    price: 1950,
    category: 'women',
    subcategory: 'dresses',
    image: 'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556614/2.png_pxbpjv.jpg',
    images: [
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556614/2.png_pxbpjv.jpg',
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556615/3.png_v52k4t.jpg',
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556615/4.png_aqq007.jpg',
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556616/5.png_mdhyay.jpg',
    ],
    description: 'With adjustable elastic in the waist.\nWhite pants are trousers, jeans, or shorts in shades of white, cream, or ecru. They are popular wardrobe pieces for warm weather, resort wear, and clean, bright outfits, coming in styles like wide-leg, chinos, or denim.',
    sizes: ['Free Size'],
    colors: ['white'],
    rating: 5,
    reviews: 1,
    badge: 'trending',
    stockQuantity: 15,
    inStock: true,
  },
  {
    id: 6,
    name: 'casual short frock',
    price: 1700,
    category: 'women',
    subcategory: 'dresses',
    image: 'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556616/27.png_lbxtgj.jpg',
    images: [
      'https://res.cloudinary.com/dyp247eoh/image/upload/v1792556616/27.png_lbxtgj.jpg',
    ],
    description: 'A casual short frock is a relaxed, everyday one-piece dress with a hemline that falls above the knee or at mid-thigh. Built for comfort and ease of movement, these dresses are commonly worn for daily errands, warm weather, or casual gatherings',
    sizes: ['Free Size'],
    colors: ['white'],
    rating: 5,
    reviews: 1,
    badge: 'limited',
    stockQuantity: 15,
    inStock: true,
  },
];

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'women', label: "Women's" },
  { id: 'men', label: "Men's" },
  { id: 'kids', label: "Kids'" },
  { id: 'accessories', label: 'Accessories' },
  { id: 'new', label: 'New Arrivals' },
];
