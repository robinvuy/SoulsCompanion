
const express = require('express');
const bossesRoutes = require('./routes/bossesRoutes');
const cors = require("cors")



const app = express();
const port = 8080;

app.use(cors())

app.use(express.json());

app.use('/', bossesRoutes);

    


app.listen(port, () => { 
    console.log(`Server is listening at http://localhost:${port}`)
});

