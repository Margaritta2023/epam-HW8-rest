import { ProductsData} from '../dataStructure/product';


export const generateId = (data: ProductsData): string => {
    return (data.products.length > 0 ? Math.max(...data.products.map(p => parseInt(p.id))) + 1 : 1).toString();
  };
  

  