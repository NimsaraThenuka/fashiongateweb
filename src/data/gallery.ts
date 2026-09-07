export interface GalleryItem {
  id: number;
  tag: 'campaigns' | 'craft' | 'resortwear' | string;
  title: string;
  subtitle: string;
  image: string;
  aspect: 'aspect-[3/4]' | 'aspect-square' | 'aspect-[4/3]';
  description?: string;
  createdAt?: string;
}

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    tag: 'campaigns',
    title: 'The Sands of Kotte',
    subtitle: 'Luxe Linen Resortwear 2026',
    image: 'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&h=1000&fit=crop&auto=format',
    aspect: 'aspect-[3/4]',
    description: 'Captured on golden hour coastal sands, featuring handcrafted natural linen weaves with bespoke tailoring.'
  },
  {
    id: 2,
    tag: 'craft',
    title: 'The Kurunegala Weavers',
    subtitle: 'Handloom Cotton Looming Process',
    image: 'https://images.unsplash.com/photo-1520004481444-7f4137747754?w=800&h=800&fit=crop&auto=format',
    aspect: 'aspect-square',
    description: 'Master artisans weaving intricate botanical patterns on heritage wooden handlooms in Kurunegala.'
  },
  {
    id: 3,
    tag: 'resortwear',
    title: 'Batik Midnight Breeze',
    subtitle: 'Indigo Dye Wrap Dress Campaign',
    image: 'https://images.unsplash.com/photo-1779399147584-6c479647263b?w=800&h=1000&fit=crop&auto=format',
    aspect: 'aspect-[3/4]',
    description: 'Flowing natural silk and cotton infused with organic indigo dyes for effortless sunset silhouettes.'
  },
  {
    id: 4,
    tag: 'campaigns',
    title: 'Mandarin Linen Minimalist',
    subtitle: 'Men\'s Tropical Collection',
    image: 'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=800&h=600&fit=crop&auto=format',
    aspect: 'aspect-[4/3]',
    description: 'Crisp mandarin collars and lightweight breathable textures tailored for warm tropical climates.'
  },
  {
    id: 5,
    tag: 'craft',
    title: 'Hand-dyed Indigo Skeins',
    subtitle: 'Atelier Batik Dye Vats',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=1000&fit=crop&auto=format',
    aspect: 'aspect-[3/4]',
    description: 'Traditional wax-resist dying and fermentation vats yielding deep, authentic midnight blues.'
  },
  {
    id: 6,
    tag: 'resortwear',
    title: 'Seafoam Silk Luxury',
    subtitle: 'Tropical Gown Campaign',
    image: 'https://images.unsplash.com/photo-1776262145095-39d46d047537?w=800&h=800&fit=crop&auto=format',
    aspect: 'aspect-square',
    description: 'Lustrous pastel green silk tailored with fluid drapes for seaside galas and destination soirees.'
  },
  {
    id: 7,
    tag: 'campaigns',
    title: 'Unstructured Summer Tailoring',
    subtitle: 'Sand Linen Blazers',
    image: 'https://images.unsplash.com/photo-1779154137940-a251f8c92b10?w=800&h=1000&fit=crop&auto=format',
    aspect: 'aspect-[3/4]',
    description: 'Deconstructed suiting engineered with unlined shoulders and breathable linen yarns.'
  },
  {
    id: 8,
    tag: 'craft',
    title: 'Natural Cane Weaving',
    subtitle: 'Handcrafted Bags by Rural Artisans',
    image: 'https://images.unsplash.com/photo-1589363358751-ab05797e5629?w=800&h=600&fit=crop&auto=format',
    aspect: 'aspect-[4/3]',
    description: 'Sustainably harvested reed and cane transformed into geometric luxury statement totes.'
  },
  {
    id: 9,
    tag: 'resortwear',
    title: 'Island Kurta Elegance',
    subtitle: 'Pastel Linen Collection',
    image: 'https://images.unsplash.com/photo-1776262145093-ab3f69760686?w=800&h=1000&fit=crop&auto=format',
    aspect: 'aspect-[3/4]',
    description: 'Understated refinement in soft coral and ecru linens, finished with mother-of-pearl buttons.'
  }
];
