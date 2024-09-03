
import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes';

const app = express();
const PORT = 3050;

app.use(express.json());
app.use('/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




