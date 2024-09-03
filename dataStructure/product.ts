export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock:Stock ;
    tags: string[];
    rating: number;
    manufacturer? : Manufacturer;
    deleted: boolean;
  }
   
export type Stock = {
    available: number;
    reserved: number;
    location: string;
  }

  
export type Address = {
  street?: string;
  city?: string;
 
};

export type Manufacturer = {
  name?: string;
  address?: Address;
};
export interface ProductsData {
    products: Product[];
  }
  
  