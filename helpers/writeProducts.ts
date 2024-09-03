import fs from 'fs-extra';
import { ProductsData} from '../dataStructure/product';

export const writeProducts = async (products: ProductsData,filePath:string): Promise<void> => {
    try {
      await fs.writeFile(filePath, JSON.stringify(products, null, 2));
    } catch (error) {
      throw new Error('Error writing to products file');
    }
  };

  