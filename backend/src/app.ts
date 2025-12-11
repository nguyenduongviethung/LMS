import express from 'express';
import { prisma } from './prisma/client';

const app = express();
app.use(express.json());

app.get('/health', async (req, res) => {
  const now = await prisma.$queryRaw`SELECT NOW();`;
  res.json({ status: 'ok', time: now });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
