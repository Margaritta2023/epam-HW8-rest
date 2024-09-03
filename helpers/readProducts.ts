import fs from 'fs-extra';
import {ProductsData} from '../dataStructure/product';


export  const readProducts = async (filePath:string): Promise<ProductsData> => {
    try {
      const data = await fs.readFile(filePath, { encoding: "utf8"});
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Error reading products file');
    }
  };

  