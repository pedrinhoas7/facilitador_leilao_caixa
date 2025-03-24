export interface Address {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }
  
  export interface Property {
    id: string;
    name: string;
    price: number;
    lat: number;
    lng: number;
    description: string;
    image?: string; // Armazenar a imagem como URL
    size: string;
    type: string;
    images: string[]; // URLs das imagens adicionais
    address: Address;
    bedrooms: number;
    bathrooms: number;
    parking: number;
    pool: boolean;
    garden: boolean;
    condominio: number;
    venda: boolean;
    aluguel: boolean;
    iptu: number;
    gym: boolean;
    heating: boolean;
    airConditioning: boolean;
    laundryArea: boolean;
    kitchenCabinets: boolean;
    bedroomCabinets: boolean;
    ensuiteBathroom: boolean;
    barbecue: boolean;
    internet: boolean;
    furnished: boolean;
    swimmingPool: boolean;
    doorman24h: boolean;
    serviceRoom: boolean;
    partyRoom: boolean;
    cableTv: boolean;
    balcony: boolean;
    walledArea: boolean;
    gatedCommunity: boolean;
    elevator: boolean;
    petsAllowed: boolean;
    electronicGate: boolean;
    reception: boolean;
    security24h: boolean;
  }
  