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
        const results = await pool.query('SELECT * FROM bosses WHERE id = $1', [ bossId ])
        const rows = results.rows
        const data = rows
       
        if  (isNaN(bossId)) {
            return res.status(400).json({ "error": "Invalid Boss Id" })
        };
        
        
    
        if (!data) {
            return res.status(404).json({ "error": "Boss Not Found" })
        };
    
        res.json(data);
        
    } catch (error) {
        throw error
    }

};

const addBoss = async (req,res) => {
    if (req.body.name == null || req.body.game == null || req.body.difficulty == null) {
        return res.status(400).json({ "error": "Incomplete Boss Data" })
    };

    const { name, game, difficulty } = req.body
    try {
        const results = await pool.query('INSERT into bosses (name, game, difficulty) VALUES ($1, $2, $3) RETURNING *', [name, game, difficulty])
        const rows = results.rows
        
        res.status(201).json(rows);
    }
    catch (error) {
        throw error
    }
};


const updateBoss = async (req,res) => {
    const bossId  = Number(req.params.id);
    const { name, game, difficulty } = req.body
    
    try {
        const results = await pool.query('UPDATE bosses SET name = $1, game = $2, difficulty = $3 WHERE id = $4 RETURNING *', [
            name,
            game,
            difficulty,
            bossId
        ])

        const rows = results.rows

        if (rows === undefined) {
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
    
        res.json(rows)

    } 
    catch(error) {
        throw error
    }
};

const deleteBoss = async (req,res) => {
    const bossId = Number(req.params.id);
    
    if (isNaN(bossId)) {
        return res.status(400).json({ "error": "Boss ID must be valid"})
    };

    try {
        const results = await pool.query('DELETE FROM bosses where id = $1 RETURNING *', [bossId])
        rows = results.rows
        res.json(rows);
    }
    catch(error) {
        throw error
    }
};



module.exports = { getHomepage, getBoss, getBossById, addBoss, updateBoss,
    deleteBoss
 } ;