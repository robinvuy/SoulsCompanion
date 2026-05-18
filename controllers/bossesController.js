const bosses = require('../data/bossesData');
const pool = require('../db/connection');


const getHomepage = (req,res) => {
    res.json({
    status: "Success",
    message: "Hello Souls Player"});
};

const getBoss = async (req,res) => {
    const game = (req.query.game);
    const difficulty = (req.query.difficulty);
    const sort = (req.query.sort);

    try {
        const results = await pool.query('SELECT * FROM bosses');
        const rows = results.rows
        let bossData = rows
        if (game) {
            bossData = bossData.filter(boss => boss.game === game)
        }; 
        
        if (difficulty) {
            bossData = bossData.filter(boss => boss.difficulty == difficulty)
        };
        
        if (sort) {
            bossData = [...bossData].sort((a, b) => (b.difficulty - a.difficulty))
        };
        
        res.status(200).json(bossData);

    } catch (error) {
        throw error
    }
        
};

const getBossById = async (req,res) => {
    const bossId  = Number(req.params.id);

    try {
        const results = await pool.query(`SELECT * FROM bosses WHERE id = ${bossId}`)
        const rows = results.rows
        const data = rows
       
        if  (isNaN(bossId)) {
            return res.status(400).json({ "error": "Invalid Boss Id" })
        };
        
        
        const bossData = data.find(boss => boss.id === bossId)
    
        if (!bossData) {
            return res.status(404).json({ "error": "Boss Not Found" })
        };
    
        res.json(bossData);
        
    } catch (error) {
        throw error
    }

};

const addBoss = (req,res) => {
    if (req.body.name == null || req.body.game == null || req.body.difficulty == null) {
        return res.status(400).json({ "error": "Incomplete Boss Data" })
    };

    const bossIds = bosses.map( boss => boss.id);
    const maxId = Math.max(...bossIds)

    const newBoss = { 
        id: (maxId + 1),
        name: req.body.name,
        game: req.body.game,
        difficulty: req.body.difficulty
    };

    bosses.push(newBoss);

    res.status(201).json(newBoss);
};

const updateBoss = (req,res) => {
    const bossId  = Number(req.params.id);
    
    const bossData = bosses.find(boss => boss.id === bossId);

    if (bossData === undefined) {
        return res.status(404).json({ "error": "Could Not Find Boss" })
    };

    if (!req.body.name && !req.body.game && !req.body.difficulty ) {
        return res.status(400).json({ "error": "Boss Details Incomplete" })
    }; 
    
    if (req.body.difficulty !== undefined) {
        if (typeof req.body.difficulty !== 'number') {
            return res.status(400).json({ "error": "Difficulty Must Be a Number" })
        }
        if (req.body.difficulty < 1) {
            return res.status(400).json({ "error": "Difficulty Must Be Higher than 0" })
        }
    };   


    if (req.body.name) { bossData.name = req.body.name }
    if (req.body.game) { bossData.game = req.body.game }
    if (req.body.difficulty !== undefined) { bossData.difficulty = req.body.difficulty }

    res.json(bossData)
};

const deleteBoss = (req,res) => {
    const bossId = Number(req.params.id);

    if (isNaN(bossId)) {
        return res.status(400).json({ "error": "Boss ID must be valid"})
    };

    const bossIndex = bosses.findIndex(boss => boss.id === bossId);

    if (bossIndex === -1) {
        return res.status(404).json({ "error": "Boss Does Not Exist" })
    };

    const deletedBoss = bosses.splice(bossIndex, 1);

    res.json(deletedBoss[0]);
};



module.exports = { getHomepage, getBoss, getBossById, addBoss, updateBoss,
    deleteBoss
 } ;