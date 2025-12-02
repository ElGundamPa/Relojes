export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// Base de datos simulada de mensajes de contacto
export const contactMessages: ContactMessage[] = [
  {
    "name": "Parchemos",
    "email": "casaverdedisney@gmail.com",
    "subject": "Prueba",
    "message": "Hola, esta es la primera prueba de la seección de contacto",
    "id": "contact-1764623873634-01filzaek",
    "createdAt": "2025-12-01T21:17:53.634Z",
    "read": true
  }
];

