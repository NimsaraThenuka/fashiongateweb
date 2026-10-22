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

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [];
