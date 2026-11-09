import { IkeaCategory } from '../interfaces/ikea-category.interface';

/**
 * Fallback top-level Canadian categories used when
 * catalog-products-slim.json is unavailable (currently 404).
 * IDs are verified against the product-list-page endpoint.
 */
export const IKEA_CANADA_FALLBACK_CATEGORIES: IkeaCategory[] = [
  {
    id: 'fu001',
    name: 'Furniture',
    url: '/ca/en/cat/all-furniture-fu001/',
  },
  {
    id: 'fu003',
    name: 'Sofas',
    url: '/ca/en/cat/sofas-fu003/',
  },
  {
    id: 'fu002',
    name: 'Tables & chairs',
    url: '/ca/en/cat/tables-chairs-fu002/',
  },
  {
    id: 'fu004',
    name: 'Tables & desks',
    url: '/ca/en/cat/tables-desks-fu004/',
  },
  {
    id: 'fu006',
    name: 'Armchairs & accent chairs',
    url: '/ca/en/cat/armchairs-accent-chairs-fu006/',
  },
  {
    id: 'st001',
    name: 'Storage furniture',
    url: '/ca/en/cat/storage-furniture-st001/',
  },
  {
    id: 'st002',
    name: 'Bookcases & shelving units',
    url: '/ca/en/cat/bookcases-shelving-units-st002/',
  },
  {
    id: 'st006',
    name: 'Wall organization',
    url: '/ca/en/cat/wall-organization-st006/',
  },
  {
    id: 'li002',
    name: 'Lighting',
    url: '/ca/en/cat/lighting-li002/',
  },
];
