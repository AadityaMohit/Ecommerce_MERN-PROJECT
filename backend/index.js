const express = require('express')
const connectToMongo = require('./db');
const app = express()
var cors = require('cors');

const port = 5000
connectToMongo();

 
app.use(cors());
app.use(express.json());

app.use('/images', express.static('./images'));
app.use('/api/auth',require('./routes/auth'))
app.use('/api/products',require('./routes/Products'))
app.use('/api/messages', require('./routes/message'));




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})