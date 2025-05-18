const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let customers = {};
let businesses = {};

app.get('/customers', (req, res) => {
  const { businessId } = req.query;
  const result = Object.values(customers).filter(c => c.businessId === businessId);
  res.json(result);
});

app.patch('/stamp/:id', (req, res) => {
  const id = req.params.id;
  const delta = req.body.delta;
  customers[id].stampCount = Math.max(0, (customers[id].stampCount || 0) + delta);
  res.json(customers[id]);
});

app.delete('/stamp/:id', (req, res) => {
  if (customers[id]) customers[id].stampCount = 0;
  res.sendStatus(204);
});

app.get('/business/:bizId', (req, res) => {
  const bizId = req.params.bizId;
  const business = Object.values(businesses).find(b => b.bizId === bizId);
  res.json(business || {});
});

app.get('/stamp/:businessId/:userId', (req, res) => {
  const key = `${req.params.businessId}_${req.params.userId}`;
  res.json(customers[key] || { stampCount: 0 });
});

// ✅ 스탬프 자동 추가 API (접속 시 호출용)
app.post('/stamp-auto', (req, res) => {
  const { businessId, userId } = req.body;
  const key = `${businessId}_${userId}`;
  customers[key] = customers[key] || { stampCount: 0, businessId, userId };
  customers[key].stampCount += 1;
  res.json({ stampCount: customers[key].stampCount });
});

app.listen(3000, () => console.log('API server running on port 3000'));
