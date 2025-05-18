const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let businesses = {};
let customers = {};
let nfcRegistry = {};

// 예시: NFC ID로 비즈니스 찾기
app.get('/nfc/:nfcId', (req, res) => {
  const nfcId = req.params.nfcId;
  res.json({ businessId: nfcRegistry[nfcId] || null });
});

// 비즈니스 정보 가져오기
app.get('/business/:id', (req, res) => {
  res.json(businesses[req.params.id] || {});
});

// 고객의 스탬프 수 가져오기
app.get('/stamp/:businessId/:userId', (req, res) => {
  const key = `${req.params.businessId}-${req.params.userId}`;
  res.json(customers[key] || { stampCount: 0 });
});

// 스탬프 추가 또는 감소
app.patch('/stamp/:customerKey', (req, res) => {
  const { delta } = req.body;
  const key = req.params.customerKey;
  customers[key] = customers[key] || { stampCount: 0 };
  customers[key].stampCount += delta;
  res.json(customers[key]);
});

// 스탬프 리셋
app.delete('/stamp/:customerKey', (req, res) => {
  delete customers[req.params.customerKey];
  res.sendStatus(204);
});

app.listen(3000, () => console.log('API running on port 3000'));
