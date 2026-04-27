
const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());

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

app.post('/bosses', (req,res) => {
    
    if (req.body.name == null || req.body.game == null || req.body.difficulty == null) {
        return res.send("Incomplete Boss Data")
    };
    
    const newBoss = { 
        id: bosses.length + 1,
        name: req.body.name,
        game: req.body.game,
        difficulty: req.body.difficulty
    };


    bosses.push(newBoss);

    res.json(newBoss)
});

app.put('/bosses/:id', (req,res) => {
    const bossId  = Number(req.params.id);
    
    const bossData = bosses.find(boss => boss.id === bossId);

    if (bossData === undefined) {
        return res.send("Could Not Find Boss")
    };

    if (!req.body.name && !req.body.game && !req.body.difficulty ) {
        return res.send("Boss Details Incomplete")
    } else if ( typeof req.body.difficulty === 'string') {
        return res.send("Difficulty Must Be a Number")
    };

    if (req.body.name) { bossData.name = req.body.name }
    if (req.body.game) { bossData.game = req.body.game }
    if (req.body.difficulty) { bossData.difficulty = req.body.difficulty }

    res.json(bossData)
});



app.listen(port, () => { 
    console.log(`Server is listening at http://localhost:${port}`)
});
