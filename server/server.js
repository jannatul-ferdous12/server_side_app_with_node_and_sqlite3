// const express = require("express") //es5
import express from 'express';
import 'dotenv/config';

import userRouter from './router.js'; 

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // app.use

app.get('/', (_, res) => {
  res.json({
    msg: 'hello!',
  });
});

app.use("/api/user", userRouter);

app.listen(port, () =>
  console.log(`Server running on port http://localhost:${port} 🔥`)
);
