export interface PenthouseLot {
  id: string;
  name: string;
  lotNumber: string;
  sizeSqM: number;
  ceilingHeight: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  floor: number;
  status: 'available' | 'reserved' | 'sold';
  highlights: string[];
  description: string;
  blueprintImg: string;
  indoorImg: string;
}

export interface PanoramicView {
  id: string;
  title: string;
  description: string;
  image: string;
}
