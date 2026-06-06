import { supabase } from './supabase';

export type HeroSlide = {
  id: string;
  headline: string;
  subheadline: string;
  cta_text: string;
  cta_url: string;
  bg_color: string;
  text_align: string;
  display_order: number;
  active: boolean;
  image_url?: string;
  video_url?: string;
  page?: string;
};

// Fallback slides (in DB format) used when Supabase is unavailable
export const fallbackSlides: HeroSlide[] = [
  {
    id: 'fallback-1',
    headline: 'ONE HEEL,\nENDLESS\nLOOKS',
    subheadline: 'Crafted for comfort. Styled for impact.',
    cta_text: 'SHOP NOW',
    cta_url: '/shop/heels',
    bg_color: '#2d3748',
    text_align: 'left',
    display_order: 1,
    active: true,
    image_url: 'https://cdn.shopify.com/s/files/1/0961/1286/9690/files/75.png?v=1767179583',
  },
  {
    id: 'fallback-2',
    headline: 'MULTI-STYLE\nCLIP-ONS',
    subheadline: 'Transform any heel in seconds — your style, your rules.',
    cta_text: 'EXPLORE CLIP-ONS',
    cta_url: '/shop/clips',
    bg_color: '#e8e4de',
    text_align: 'center',
    display_order: 2,
    active: true,
    image_url: 'https://cdn.shopify.com/s/files/1/0961/1286/9690/files/133.png?v=1767705234',
  },
];

export async function getHeroSlidesFromDB(page = 'home'): Promise<HeroSlide[]> {
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('active', true)
      .eq('page', page)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      // fallback: try without page filter
      const { data: all } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });
      return (all && all.length > 0) ? all as HeroSlide[] : fallbackSlides;
    }
    return data as HeroSlide[];
  } catch {
    return fallbackSlides;
  }
}
