import { PenthouseLot, PanoramicView } from './types';

export const PENTHOUSE_LOTS: PenthouseLot[] = [
  {
    id: 'lot-17',
    lotNumber: 'Lot 17',
    name: 'The Horizon Residence',
    sizeSqM: 342,
    ceilingHeight: '4.2m',
    bedrooms: 3,
    bathrooms: 4,
    price: '$14,800,000',
    floor: 17,
    status: 'available',
    highlights: [
      'Panoramic Glass Living Room',
      'Custom Volcanic Stone Hearth',
      'Private Elevator Access',
      'Calacatta Gold Spa Bathroom'
    ],
    description: 'This magnificent residence is situated on the 17th floor, featuring a high-fashion double-height salon that captures the shimmering Manhattan skyline. Fully integrated Lutron ambient modes wrap a sanctuary curated for the elite collector.',
    blueprintImg: '/src/assets/images/architectural_plan_1781316177866.jpg',
    indoorImg: '/src/assets/images/master_suite_1781316163910.jpg'
  },
  {
    id: 'lot-19',
    lotNumber: 'Lot 19',
    name: 'The Obsidian Triplex',
    sizeSqM: 450,
    ceilingHeight: '4.5m',
    bedrooms: 4,
    bathrooms: 5,
    price: '$21,200,000',
    status: 'available',
    floor: 19,
    highlights: [
      'Heated Stainless Sky-Pool',
      'Private Wellness Hammam',
      '270° Panoramic Solarium',
      'Floating Oak Spiral Staircase'
    ],
    description: 'A monument of architectural precision. Stretching across three full levels, the Obsidian Triplex crowns the Zorge 9 tower with a private cantilevered deck and pool that floats seamlessly above the clouds.',
    blueprintImg: '/src/assets/images/architectural_plan_1781316177866.jpg',
    indoorImg: '/src/assets/images/hero_penthouse_1781316127919.jpg'
  },
  {
    id: 'lot-21',
    lotNumber: 'Lot 21',
    name: 'The Grand Zenith Manor',
    sizeSqM: 610,
    ceilingHeight: '4.8m',
    bedrooms: 5,
    bathrooms: 6,
    price: '$34,500,000',
    status: 'reserved',
    floor: 21,
    highlights: [
      '360° Perimeter Terrace',
      'Obsidian-lined Wine Cave',
      '24-Seat Banquet Gallery',
      'Retractable Observatory Roof'
    ],
    description: 'The ultimate crown jewel of the estate. Offering unparalleled 360-degree views, the Grand Zenith Manor defines ultra-luxury living. Every single finish has been crafted by master artisans from Carrara and Prague.',
    blueprintImg: '/src/assets/images/architectural_plan_1781316177866.jpg',
    indoorImg: '/src/assets/images/marble_bathroom_1781316152303.jpg'
  }
];

export const PANORAMAS: PanoramicView[] = [
  {
    id: 'pan-1',
    title: 'The Hudson Dusk View',
    description: 'Looking West over the river as the city ignites with brilliant amber outlines.',
    image: '/src/assets/images/terrace_view_1781316141618.jpg'
  },
  {
    id: 'pan-2',
    title: 'East River Meridian',
    description: 'The golden rays striking the steel and glass architecture of New York.',
    image: '/src/assets/images/hero_penthouse_1781316127919.jpg'
  }
];
