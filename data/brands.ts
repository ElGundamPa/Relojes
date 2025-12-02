import { Brand } from "./products";

export interface BrandData extends Brand {
  description?: string;
  logo?: string | null;
  collections?: Collection[];
  active?: boolean;
  totalProducts?: number;
}

export interface Collection {
  id: string;
  brand: string;
  name: string;
  slug: string;
  totalProducts: number;
  description?: string;
  image?: string;
  subCollections?: SubCollection[];
  active?: boolean;
}

export interface SubCollection {
  id: string;
  name: string;
  slug: string;
  collectionId: string;
  description?: string;
  active?: boolean;
}

// Se genera automáticamente desde /public/products/
export const brandsData: BrandData[] = [
  {
    "name": "Audemars Piguet",
    "slug": "audemars-piguet",
    "image": "",
    "count": 127,
    "description": "",
    "logo": null,
    "active": true,
    "totalProducts": 127
  },
  {
    "name": "Bell & Ross",
    "slug": "bell-ross",
    "image": "",
    "count": 4,
    "description": "",
    "logo": null,
    "active": true,
    "totalProducts": 4
  },
  {
    "name": "fondo",
    "slug": "fondo",
    "image": "",
    "count": 0,
    "description": "",
    "logo": null,
    "active": true,
    "totalProducts": 0
  },
  {
    "name": "Montblanc",
    "slug": "montblanc",
    "image": "",
    "count": 35,
    "description": "",
    "logo": null,
    "active": true,
    "totalProducts": 35
  },
  {
    "name": "Omega",
    "slug": "omega",
    "image": "",
    "count": 126,
    "description": "",
    "logo": null,
    "active": true,
    "totalProducts": 126
  },
  {
    "name": "Patek Philippe",
    "slug": "patek-philippe",
    "image": "",
    "count": 72,
    "description": "",
    "logo": null,
    "active": true,
    "totalProducts": 72
  },
  {
    "name": "Richard Mille",
    "slug": "richard-mille",
    "image": "",
    "count": 27,
    "description": "",
    "logo": null,
    "active": true,
    "totalProducts": 27
  },
  {
    "name": "Rolex",
    "slug": "rolex",
    "image": "",
    "count": 274,
    "description": "",
    "logo": null,
    "active": true,
    "totalProducts": 274
  },
  {
    "name": "Tissot",
    "slug": "tissot",
    "image": "",
    "count": 82,
    "description": "",
    "logo": null,
    "active": true,
    "totalProducts": 82
  },
  {
    "name": "Tudor",
    "slug": "tudor",
    "image": "",
    "count": 6,
    "description": "",
    "logo": null,
    "active": true,
    "totalProducts": 6
  },
  {
    "name": "Vacheron",
    "slug": "vacheron",
    "image": "",
    "count": 2,
    "description": "",
    "logo": null,
    "active": true,
    "totalProducts": 2
  }
];
