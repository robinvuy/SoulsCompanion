
const express = require('express');
const app = express();
const port = 8080;

const bosses = [
    { 
        id: 1,
        name: "Sister Friede",
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
    },
    { 
        id: 4,
        name: "Crystal Sage",
        game: "Dark Souls 3",
        difficulty: 2
    },
    { 
        id: 5,
        name: "Pinwheel",
        game: "Dark Souls 1",
        difficulty: 1
    },{ 
        id: 6,
        name: "Cleric Beast",
        game: "Bloodborne",
        difficulty: 2
    }
]

app.get('/', (req,res) => {
    res.send("Hello souls player!")
});

app.get('/bosses', (req,res) => {
    const game = (req.query.game);
    const difficulty = (req.query.difficulty);
    const sort = (req.query.sort);
    let bossData = bosses;

    if (game) {
        bossData = bossData.filter(boss => boss.game === game)
    };
    
    if (difficulty) {
        bossData = bossData.filter(boss => boss.difficulty == difficulty)
    };
    
    if (sort) {
        bossData = [...bossData].sort((a, b) => (b.difficulty - a.difficulty))
    };

        
    return res.json(bossData);
});

app.get('/bosses/:id', (req,res) => {
    const bossId  = Number(req.params.id);

    if  (isNaN(bossId)) {
        return res.send("Invalid Boss Id")
    };

    bossData = bosses.find(boss => boss.id === bossId)

    if (!bossData) {
        return res.send("Boss Not Found")

    }

    res.json(bossData) 

    
});




app.listen(port, () => { 
    console.log(`Server is listening at http://localhost:${port}`)
});
