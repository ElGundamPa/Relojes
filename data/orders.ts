export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  subtotal: number;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface Address {
  ciudad: string;
  direccion: string;
  barrio?: string;
}

export interface Payment {
  method: "stripe" | "paypal" | "manual";
  id?: string;
  amount?: number;
  currency?: string;
  status?: "pending" | "completed" | "failed";
  createdAt?: string;
}

export interface Shipping {
  carrier?: string;
  trackingNumber?: string;
  sentAt?: string | null;
  estimatedDelivery?: string;
}

export interface OrderStatusHistory {
  status: Order["status"];
  changedAt: string;
  changedBy?: string;
  notes?: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status: "pendiente" | "pagada" | "enviada" | "completada" | "cancelada";
  createdAt: string;
  updatedAt: string;
  address: Address;
  payment?: Payment;
  shipping?: Shipping;
  statusHistory?: OrderStatusHistory[];
}

// Base de datos simulada de órdenes
export const orders: Order[] = [
  {
    "customer": {
      "name": "Ola ola",
      "email": "lolito@lolito.co",
      "phone": "20321519519"
    },
    "items": [
      {
        "productId": "bell-ross-general-20250128-114350",
        "name": "Bell & Ross General 20250128_114350",
        "qty": 1,
        "price": 7450,
        "subtotal": 7450
      }
    ],
    "total": 7465,
    "status": "pagada",
    "address": {
      "ciudad": "Andes",
      "direccion": "street1",
      "barrio": "28001"
    },
    "statusHistory": [
      {
        "status": "pendiente",
        "changedAt": "2025-11-27T20:33:49.304Z",
        "notes": "Orden creada"
      },
      {
        "status": "pagada",
        "changedAt": "2025-12-01T22:18:46.011Z"
      }
    ],
    "id": "order-1764275631213-ufxx8lrea",
    "createdAt": "2025-11-27T20:33:51.213Z",
    "updatedAt": "2025-12-01T22:18:46.011Z"
  },
  {
    "customer": {
      "name": "Ola ola",
      "email": "lolito@lolito.co",
      "phone": "20321519519"
    },
    "items": [
      {
        "productId": "bell-ross-general-20250128-114350",
        "name": "Bell & Ross General 20250128_114350",
        "qty": 1,
        "price": 7450,
        "subtotal": 7450
      }
    ],
    "total": 7465,
    "status": "pendiente",
    "address": {
      "ciudad": "Andes",
      "direccion": "street1",
      "barrio": "28001"
    },
    "statusHistory": [
      {
        "status": "pendiente",
        "changedAt": "2025-11-27T20:33:58.261Z",
        "notes": "Orden creada"
      }
    ],
    "id": "order-1764275638290-ftkkwbc0v",
    "createdAt": "2025-11-27T20:33:58.290Z",
    "updatedAt": "2025-11-27T20:33:58.290Z"
  },
  {
    "customer": {
      "name": "admin",
      "email": "admin@relojes.com",
      "phone": "20321519519"
    },
    "items": [
      {
        "productId": "bell-ross-general-20250128-114350",
        "name": "Bell & Ross General 20250128_114350",
        "qty": 4,
        "price": 7450,
        "subtotal": 29800
      },
      {
        "productId": "tudor-general-20250128-164156",
        "name": "Tudor General 20250128_164156",
        "qty": 1,
        "price": 5750,
        "subtotal": 5750
      },
      {
        "productId": "tudor-general-20250128-164231",
        "name": "Tudor General 20250128_164231",
        "qty": 2,
        "price": 2600,
        "subtotal": 5200
      },
      {
        "productId": "tudor-general-20250128-164244",
        "name": "Tudor General 20250128_164244",
        "qty": 1,
        "price": 4500,
        "subtotal": 4500
      },
      {
        "productId": "tudor-general-20250128-164314",
        "name": "Tudor General 20250128_164314",
        "qty": 1,
        "price": 2500,
        "subtotal": 2500
      },
      {
        "productId": "patek-philippe-dama-20250527-121026",
        "name": "Patek Philippe Dama 20250527_121026",
        "qty": 1,
        "price": 22500,
        "subtotal": 22500
      },
      {
        "productId": "patek-philippe-dama-20250527-121041",
        "name": "Patek Philippe Dama 20250527_121041",
        "qty": 1,
        "price": 39650,
        "subtotal": 39650
      },
      {
        "productId": "patek-philippe-dama-20250527-121603",
        "name": "Patek Philippe Dama 20250527_121603",
        "qty": 1,
        "price": 48450,
        "subtotal": 48450
      }
    ],
    "total": 158365,
    "status": "pendiente",
    "address": {
      "ciudad": "Antioquia",
      "direccion": "street 1",
      "barrio": "28001"
    },
    "statusHistory": [
      {
        "status": "pendiente",
        "changedAt": "2025-11-27T20:46:26.711Z",
        "notes": "Orden creada"
      }
    ],
    "id": "order-1764276387579-49d14xa98",
    "createdAt": "2025-11-27T20:46:27.579Z",
    "updatedAt": "2025-11-27T20:46:27.579Z"
  },
  {
    "customer": {
      "name": "admin",
      "email": "admin@relojes.com",
      "phone": "20321519519"
    },
    "items": [
      {
        "productId": "bell-ross-general-20250128-114350",
        "name": "Bell & Ross General 20250128_114350",
        "qty": 4,
        "price": 7450,
        "subtotal": 29800
      },
      {
        "productId": "tudor-general-20250128-164156",
        "name": "Tudor General 20250128_164156",
        "qty": 1,
        "price": 5750,
        "subtotal": 5750
      },
      {
        "productId": "tudor-general-20250128-164231",
        "name": "Tudor General 20250128_164231",
        "qty": 2,
        "price": 2600,
        "subtotal": 5200
      },
      {
        "productId": "tudor-general-20250128-164244",
        "name": "Tudor General 20250128_164244",
        "qty": 1,
        "price": 4500,
        "subtotal": 4500
      },
      {
        "productId": "tudor-general-20250128-164314",
        "name": "Tudor General 20250128_164314",
        "qty": 1,
        "price": 2500,
        "subtotal": 2500
      },
      {
        "productId": "patek-philippe-dama-20250527-121026",
        "name": "Patek Philippe Dama 20250527_121026",
        "qty": 1,
        "price": 22500,
        "subtotal": 22500
      },
      {
        "productId": "patek-philippe-dama-20250527-121041",
        "name": "Patek Philippe Dama 20250527_121041",
        "qty": 1,
        "price": 39650,
        "subtotal": 39650
      },
      {
        "productId": "patek-philippe-dama-20250527-121603",
        "name": "Patek Philippe Dama 20250527_121603",
        "qty": 1,
        "price": 48450,
        "subtotal": 48450
      }
    ],
    "total": 158365,
    "status": "pendiente",
    "address": {
      "ciudad": "Antioquia",
      "direccion": "street 1",
      "barrio": "28001"
    },
    "statusHistory": [
      {
        "status": "pendiente",
        "changedAt": "2025-11-27T20:46:40.274Z",
        "notes": "Orden creada"
      }
    ],
    "id": "order-1764276400310-awy22fy8s",
    "createdAt": "2025-11-27T20:46:40.310Z",
    "updatedAt": "2025-11-27T20:46:40.310Z"
  },
  {
    "customer": {
      "name": "admin",
      "email": "admin@relojes.com",
      "phone": "20321519519"
    },
    "items": [
      {
        "productId": "bell-ross-general-20250128-114350",
        "name": "Bell & Ross General 20250128_114350",
        "qty": 4,
        "price": 7450,
        "subtotal": 29800
      },
      {
        "productId": "tudor-general-20250128-164156",
        "name": "Tudor General 20250128_164156",
        "qty": 1,
        "price": 5750,
        "subtotal": 5750
      },
      {
        "productId": "tudor-general-20250128-164231",
        "name": "Tudor General 20250128_164231",
        "qty": 2,
        "price": 2600,
        "subtotal": 5200
      },
      {
        "productId": "tudor-general-20250128-164244",
        "name": "Tudor General 20250128_164244",
        "qty": 1,
        "price": 4500,
        "subtotal": 4500
      },
      {
        "productId": "tudor-general-20250128-164314",
        "name": "Tudor General 20250128_164314",
        "qty": 1,
        "price": 2500,
        "subtotal": 2500
      },
      {
        "productId": "patek-philippe-dama-20250527-121026",
        "name": "Patek Philippe Dama 20250527_121026",
        "qty": 1,
        "price": 22500,
        "subtotal": 22500
      },
      {
        "productId": "patek-philippe-dama-20250527-121041",
        "name": "Patek Philippe Dama 20250527_121041",
        "qty": 1,
        "price": 39650,
        "subtotal": 39650
      },
      {
        "productId": "patek-philippe-dama-20250527-121603",
        "name": "Patek Philippe Dama 20250527_121603",
        "qty": 1,
        "price": 48450,
        "subtotal": 48450
      }
    ],
    "total": 158365,
    "status": "pendiente",
    "address": {
      "ciudad": "Antioquia",
      "direccion": "street 1",
      "barrio": "28001"
    },
    "statusHistory": [
      {
        "status": "pendiente",
        "changedAt": "2025-11-27T20:48:16.533Z",
        "notes": "Orden creada"
      }
    ],
    "id": "order-1764276496570-yamiwaz7v",
    "createdAt": "2025-11-27T20:48:16.570Z",
    "updatedAt": "2025-11-27T20:48:16.570Z"
  },
  {
    "customer": {
      "name": "Parchemos",
      "email": "admin@relojes.com",
      "phone": "20321519519"
    },
    "items": [
      {
        "productId": "bell-ross-general-20250128-114350",
        "name": "Bell & Ross General 20250128_114350",
        "qty": 4,
        "price": 7450,
        "subtotal": 29800
      },
      {
        "productId": "tudor-general-20250128-164156",
        "name": "Tudor General 20250128_164156",
        "qty": 1,
        "price": 5750,
        "subtotal": 5750
      },
      {
        "productId": "tudor-general-20250128-164231",
        "name": "Tudor General 20250128_164231",
        "qty": 2,
        "price": 2600,
        "subtotal": 5200
      },
      {
        "productId": "tudor-general-20250128-164244",
        "name": "Tudor General 20250128_164244",
        "qty": 1,
        "price": 4500,
        "subtotal": 4500
      },
      {
        "productId": "tudor-general-20250128-164314",
        "name": "Tudor General 20250128_164314",
        "qty": 1,
        "price": 2500,
        "subtotal": 2500
      },
      {
        "productId": "patek-philippe-dama-20250527-121026",
        "name": "Patek Philippe Dama 20250527_121026",
        "qty": 1,
        "price": 22500,
        "subtotal": 22500
      },
      {
        "productId": "patek-philippe-dama-20250527-121041",
        "name": "Patek Philippe Dama 20250527_121041",
        "qty": 1,
        "price": 39650,
        "subtotal": 39650
      },
      {
        "productId": "patek-philippe-dama-20250527-121603",
        "name": "Patek Philippe Dama 20250527_121603",
        "qty": 1,
        "price": 48450,
        "subtotal": 48450
      }
    ],
    "total": 158365,
    "status": "pendiente",
    "address": {
      "ciudad": "Medellin",
      "direccion": "St 205 24",
      "barrio": "28001"
    },
    "statusHistory": [
      {
        "status": "pendiente",
        "changedAt": "2025-11-27T20:52:23.723Z",
        "notes": "Orden creada"
      }
    ],
    "id": "order-1764276744653-vzbx0jv4f",
    "createdAt": "2025-11-27T20:52:24.653Z",
    "updatedAt": "2025-11-27T20:52:24.653Z"
  },
  {
    "customer": {
      "name": "Prueba",
      "email": "ooo@a.com",
      "phone": "3053203552"
    },
    "items": [
      {
        "productId": "audemars-piguet-dama-20250716-110505",
        "name": "Audemars Piguet Dama 20250716_110505",
        "qty": 1,
        "price": 30750,
        "subtotal": 30750
      }
    ],
    "total": 30765,
    "status": "pendiente",
    "address": {
      "ciudad": "Antioquia",
      "direccion": "st 20",
      "barrio": "28001"
    },
    "statusHistory": [
      {
        "status": "pendiente",
        "changedAt": "2025-12-01T21:40:38.793Z",
        "notes": "Orden creada"
      }
    ],
    "id": "order-1764625240410-ky0zj1pgu",
    "createdAt": "2025-12-01T21:40:40.410Z",
    "updatedAt": "2025-12-01T21:40:40.410Z"
  },
  {
    "customer": {
      "name": "Parchemos",
      "email": "casaverdedisney@gmail.com",
      "phone": "20321519519"
    },
    "items": [
      {
        "productId": "audemars-piguet-dama-20250716-110505",
        "name": "Audemars Piguet Dama 20250716_110505",
        "qty": 1,
        "price": 30750,
        "subtotal": 30750
      }
    ],
    "total": 30765,
    "status": "pendiente",
    "address": {
      "ciudad": "Medellin",
      "direccion": "St 205 24",
      "barrio": "28001"
    },
    "statusHistory": [
      {
        "status": "pendiente",
        "changedAt": "2025-12-01T22:01:35.236Z",
        "notes": "Orden creada"
      }
    ],
    "id": "order-1764626497184-ynp646p5j",
    "createdAt": "2025-12-01T22:01:37.184Z",
    "updatedAt": "2025-12-01T22:01:37.184Z"
  },
  {
    "customer": {
      "name": "Parchemos",
      "email": "casaverdedisney@gmail.com",
      "phone": "20321519519"
    },
    "items": [
      {
        "productId": "audemars-piguet-dama-20250716-110505",
        "name": "Audemars Piguet Dama 20250716_110505",
        "qty": 1,
        "price": 30750,
        "subtotal": 30750
      }
    ],
    "total": 30765,
    "status": "pendiente",
    "address": {
      "ciudad": "Medellin",
      "direccion": "St 205 24",
      "barrio": "28001"
    },
    "statusHistory": [
      {
        "status": "pendiente",
        "changedAt": "2025-12-01T22:03:44.733Z",
        "notes": "Orden creada"
      }
    ],
    "id": "order-1764626626148-2vyfvrxx4",
    "createdAt": "2025-12-01T22:03:46.148Z",
    "updatedAt": "2025-12-01T22:03:46.148Z"
  },
  {
    "customer": {
      "name": "Parchemos",
      "email": "casaverdedisney@gmail.com",
      "phone": "20321519519"
    },
    "items": [
      {
        "productId": "audemars-piguet-dama-20250716-110516",
        "name": "Audemars Piguet Dama 20250716_110516",
        "qty": 1,
        "price": 15300,
        "subtotal": 15300
      }
    ],
    "total": 15315,
    "status": "pendiente",
    "address": {
      "ciudad": "Medellin",
      "direccion": "St 205 24",
      "barrio": "28001"
    },
    "statusHistory": [
      {
        "status": "pendiente",
        "changedAt": "2025-12-01T22:10:22.563Z",
        "notes": "Orden creada"
      }
    ],
    "id": "order-1764627023199-ojfe4xaam",
    "createdAt": "2025-12-01T22:10:23.199Z",
    "updatedAt": "2025-12-01T22:10:23.199Z"
  },
  {
    "customer": {
      "name": "Parchemos",
      "email": "casaverdedisney@gmail.com",
      "phone": "20321519519"
    },
    "items": [
      {
        "productId": "audemars-piguet-dama-20250716-110516",
        "name": "Audemars Piguet Dama 20250716_110516",
        "qty": 1,
        "price": 15300,
        "subtotal": 15300
      }
    ],
    "total": 15315,
    "status": "pendiente",
    "address": {
      "ciudad": "Medellin",
      "direccion": "St 205 24",
      "barrio": "28001"
    },
    "statusHistory": [
      {
        "status": "pendiente",
        "changedAt": "2025-12-01T22:10:38.277Z",
        "notes": "Orden creada"
      }
    ],
    "id": "order-1764627038373-jy603amii",
    "createdAt": "2025-12-01T22:10:38.373Z",
    "updatedAt": "2025-12-01T22:10:38.373Z"
  },
  {
    "customer": {
      "name": "Parchemos",
      "email": "casaverdedisney@gmail.com",
      "phone": "20321519519"
    },
    "items": [
      {
        "productId": "audemars-piguet-dama-20250716-110516",
        "name": "Audemars Piguet Dama 20250716_110516",
        "qty": 1,
        "price": 15300,
        "subtotal": 15300
      }
    ],
    "total": 15315,
    "status": "pendiente",
    "address": {
      "ciudad": "Medellin",
      "direccion": "St 205 24",
      "barrio": "28001"
    },
    "statusHistory": [
      {
        "status": "pendiente",
        "changedAt": "2025-12-01T22:14:14.586Z",
        "notes": "Orden creada"
      }
    ],
    "id": "order-1764627255387-8ck9qncbj",
    "createdAt": "2025-12-01T22:14:15.387Z",
    "updatedAt": "2025-12-01T22:14:15.387Z"
  },
  {
    "customer": {
      "name": "Parchemos",
      "email": "casaverdedisney@gmail.com",
      "phone": "20321519519"
    },
    "items": [
      {
        "productId": "audemars-piguet-dama-20250716-110516",
        "name": "Audemars Piguet Dama 20250716_110516",
        "qty": 1,
        "price": 15300,
        "subtotal": 15300
      }
    ],
    "total": 15315,
    "status": "pendiente",
    "address": {
      "ciudad": "Medellin",
      "direccion": "St 205 24",
      "barrio": "28001"
    },
    "statusHistory": [
      {
        "status": "pendiente",
        "changedAt": "2025-12-01T22:18:11.013Z",
        "notes": "Orden creada"
      }
    ],
    "id": "order-1764627491529-t4ntbetjb",
    "createdAt": "2025-12-01T22:18:11.529Z",
    "updatedAt": "2025-12-01T22:18:11.529Z"
  },
  {
    "customer": {
      "name": "USB conectada (crítico)",
      "email": "loswirios@gmail.com",
      "phone": "20321519519"
    },
    "items": [
      {
        "productId": "montblanc-general-20250716-091326",
        "name": "Montblanc General 20250716_091326",
        "qty": 1,
        "price": 3150,
        "subtotal": 3150
      }
    ],
    "total": 3165,
    "status": "pendiente",
    "address": {
      "ciudad": "Medellin",
      "direccion": "St 205 24",
      "barrio": "28001"
    },
    "statusHistory": [
      {
        "status": "pendiente",
        "changedAt": "2025-12-01T23:10:40.706Z",
        "notes": "Orden creada"
      }
    ],
    "id": "order-1764630641126-l59uh94qo",
    "createdAt": "2025-12-01T23:10:41.126Z",
    "updatedAt": "2025-12-01T23:10:41.126Z"
  },
  {
    "customer": {
      "name": "USB conectada (crítico)",
      "email": "loswirios@gmail.com",
      "phone": "20321519519"
    },
    "items": [
      {
        "productId": "montblanc-general-20250716-091326",
        "name": "Montblanc General 20250716_091326",
        "qty": 1,
        "price": 3150,
        "subtotal": 3150
      }
    ],
    "total": 3165,
    "status": "pendiente",
    "address": {
      "ciudad": "Medellin",
      "direccion": "St 205 24",
      "barrio": "28001"
    },
    "statusHistory": [
      {
        "status": "pendiente",
        "changedAt": "2025-12-01T23:10:47.554Z",
        "notes": "Orden creada"
      }
    ],
    "id": "order-1764630647586-uujyr08bd",
    "createdAt": "2025-12-01T23:10:47.586Z",
    "updatedAt": "2025-12-01T23:10:47.586Z"
  }
];

// Funciones helper
export function getOrderById(id: string): Order | undefined {
  return orders.find((order) => order.id === id);
}

export function getOrdersByStatus(
  status: Order["status"]
): Order[] {
  return orders.filter((order) => order.status === status);
}

export function getAllOrders(): Order[] {
  return orders;
}


