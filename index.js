
const express = require('express');
const app = express();
const port = 8080;

const bosses = [
    { 
        id: 1,
        name: "Sister Freide",
        game: "Dark Souls 3",
        difficulty: 5
    },
    { 
        id: 2,
        name: "Artorias",
        game: "Dark Souls 1",
        difficulty: 3
    },
    { 
        id: 3,
        name: "Orphan of Kos",
        game: "Bloodborne",
        difficulty: 5
    }
]

app.get('/', (req,res) => {
    res.send("Hello souls player!")
});

app.get('/bosses', (req,res) => {
    const game = (req.query.game)
    
    bossData = bosses.filter(boss => boss.game == game)

    if (!game) {return res.json(bosses)};


    if (game) {
        return res.json(bossData)
    };

});

app.get('/bosses/:id', (req,res) => {
    const bossId  = Number(req.params.id);

    if  (isNaN(bossId)) {
        return res.send("Invalid Boss Id")
    }

    bossData = bosses.find(boss => boss.id === bossId)

    if (!bossData) {
        return res.send("Boss Not Found")

    }

    res.json(bossData) 

    
});




app.listen(port, () => { 
    console.log(`Server is listening at http://localhost:${port}`)
});
