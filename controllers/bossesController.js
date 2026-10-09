const pool = require('../db/connection');


const getHomepage = (req,res) => {
    res.json({
    status: "Success",
    message: "Hello Souls Player"});
};

const getBosses = async (req,res) => {
    try {
        const results = await pool.query('SELECT * FROM bosses');
        const bossData = results.rows
        
        res.status(200).json(bossData);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
        
};

const getBossById = async (req,res) => {
    const bossId  = Number(req.params.id);

    if (!Number.isInteger(bossId) || bossId < 1) {
        return res.status(400).json({ "error": "Invalid Boss Id"})
    }
    
    try {
        const results = await pool.query('SELECT * FROM bosses WHERE id = $1', [ bossId ])
        const bossRows = results.rows

        if (bossRows.length === 0) {
            return res.status(404).json({ "error": "Boss Not Found" })
        };

        const defenceResults = await pool.query('SELECT * FROM boss_defences WHERE boss_id = $1', [ bossId ])
        const defenceRows = defenceResults.rows 
        
        res.json( {
            boss: bossRows[0],
            defences: defenceRows
        } );
        
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error"
        })
    }

};

const addBoss = async (req,res) => {
    //nullish coalescing operator: if req.body exists then use it, if not use empty object
    const body = req.body ?? {};

    const { name, game_id, dlc_id, area, health, picture, souls, phase } = body
    const { defences } = body
    
    if (typeof name !==  'string' || name.trim() == "") {
        return res.status(400).json({ "error": "Invalid boss name" })
    }

     if (!Number.isInteger(game_id) || game_id < 1) {
        return res.status(400).json({ "error": "Invalid game Id"})
    }

    if (typeof area !==  'string' || area.trim() == "") {
        return res.status(400).json({ "error": "Invalid boss area" })
    }

    if (!Number.isInteger(health) || health < 1) {
        return res.status(400).json({ "error": "Invalid boss health"})
    }

    if (typeof picture !==  'string' || picture.trim() == "") {
        return res.status(400).json({ "error": "Invalid boss picture" })
    }

    if (!Number.isInteger(souls) || souls < 1) {
        return res.status(400).json({ "error": "Invalid boss souls"})
    }

    if ((!Number.isInteger(dlc_id) || dlc_id < 1) && dlc_id !== null ) {
        return res.status(400).json({ "error": "Invalid dlc id" })
    }

    if (typeof phase !== 'string' && phase !== null) {
        return res.status(400).json({ "error": "Invalid phase" })
    }

    if (typeof defences !== 'object' || defences === null || Array.isArray(defences)) {
        return res.status(400).json({ "error": "Invalid defences object" })
    }

    const damageTypes = [
        'Physical',
        'Slash',
        'Strike',
        'Thrust',
        'Magic',
        'Fire',
        'Lightning',
        'Poison',
        'Toxic',
        'Bleed'
    ]    

    for (const damageType of damageTypes) {
        if ((!Number.isInteger(defences[damageType]) || defences[damageType] < 0) && defences[damageType] !== 'Immune') {
            return res.status(400).json({ "error": "Invalid defence" })
        }
    }

    try {
        const BossResults = await pool.query(`INSERT into bosses (name, game_id, dlc_id, area, health, picture, souls, phase) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [   name,
                game_id,
                dlc_id,
                area,
                health,
                picture,
                souls,
                phase
            ])
            
            const bossId = BossResults.rows[0].id
            const bossDefences = []

            for (const damageType of damageTypes) {
                let immune = false
                let defenceValue = defences[damageType]
                
                if (defenceValue === 'Immune') {
                    immune = true
                    defenceValue = null
                };
                
                const defenceResults = await pool.query(
                    `INSERT into boss_defences (boss_id, damage_type, defence, is_immune)
                    VALUES ($1, $2, $3, $4) RETURNING *`,
                    [ bossId, damageType, defenceValue, immune ]
                )
                bossDefences.push(defenceResults.rows[0])
            }

        const BossRows = BossResults.rows
        
        res.status(201).json({
            InsertedBoss: BossRows[0],
            InsertedDefences: bossDefences
        
        });
    }
    catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
};


const updateBoss = async (req,res) => {
    //nullish coalescing operator
    const body = req.body ?? {};

    const bossId  = Number(req.params.id);
    const { name, game_id, dlc_id, area, health, picture, souls, phase } = body
    const { defences } = body
    
    if  (!Number.isInteger(bossId) || bossId < 1) {
        return res.status(400).json({ "error": "Invalid Boss Id" })
    };

    if (typeof name !==  'string' || name.trim() == "") {
        return res.status(400).json({ "error": "Invalid boss name" })
    }

     if (!Number.isInteger(game_id) || game_id < 1) {
        return res.status(400).json({ "error": "Invalid game Id"})
    }

    if (typeof area !==  'string' || area.trim() == "") {
        return res.status(400).json({ "error": "Invalid boss area" })
    }

    if (!Number.isInteger(health) || health < 1) {
        return res.status(400).json({ "error": "Invalid boss health"})
    }

    if (typeof picture !==  'string' || picture.trim() == "") {
        return res.status(400).json({ "error": "Invalid boss picture" })
    }

    if (!Number.isInteger(souls) || souls < 1) {
        return res.status(400).json({ "error": "Invalid boss souls"})
    }

    if ((!Number.isInteger(dlc_id) || dlc_id < 1) && dlc_id !== null ) {
        return res.status(400).json({ "error": "Invalid dlc id" })
    }

    if (typeof phase !== 'string' && phase !== null) {
        return res.status(400).json({ "error": "Invalid phase" })
    }

    if (typeof defences !== 'object' || defences === null || Array.isArray(defences)) {
        return res.status(400).json({ "error": "Invalid defences object" })
    }

    const damageTypes = [
        'Physical',
        'Slash',
        'Strike',
        'Thrust',
        'Magic',
        'Fire',
        'Lightning',
        'Poison',
        'Toxic',
        'Bleed'
    ]    

    for (const damageType of damageTypes) {
        if ((!Number.isInteger(defences[damageType]) || defences[damageType] < 0) && defences[damageType] !== 'Immune') {
            return res.status(400).json({ "error": "Invalid defence" })
        }
    }

    try {
        const BossResults = await pool.query(`UPDATE bosses SET name = $1, game_id = $2, dlc_id = $3, area = $4, health = $5,
            picture = $6, souls = $7, phase = $8 WHERE id = $9 RETURNING *`,
            [   name,
                game_id,
                dlc_id,
                area,
                health,
                picture,
                souls,
                phase,
                bossId
            ])
            
            const bossRows = BossResults.rows
            
            if (bossRows.length === 0) {
                return res.status(404).json({ "error": "Could Not Find Boss" })
            };    

        const bossDefences = []

        for (const damageType of damageTypes ) {
            let immune = false
            let defenceValue = defences[damageType]
            
            if (defenceValue === "Immune") {
                immune = true
                defenceValue = null
            }

            const defenceResults = await pool.query(`UPDATE boss_defences SET
                defence = $1, is_immune = $2 WHERE boss_id = $3 AND damage_type = $4 RETURNING *`,
                [ defenceValue, immune, bossId, damageType ]
                
                )
                bossDefences.push(defenceResults.rows[0])
            }
        
        
        res.status(200).json({
            UpdatedBoss: bossRows[0],
            UpdatedDefences: bossDefences
        });
    }
    catch(error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
};

const deleteBoss = async (req,res) => {
    const bossId = Number(req.params.id);
    
    if  (!Number.isInteger(bossId) || bossId < 1) {
        return res.status(400).json({ "error": "Invalid Boss Id" })
    };

    try {
        const defenceResults = await pool.query(`DELETE FROM boss_defences
            WHERE boss_id = $1 RETURNING *`, [ bossId ])

        const BossResults = await pool.query(`DELETE FROM bosses
            WHERE id = $1 RETURNING *`, [ bossId ])

        const bossRows = BossResults.rows

        if (bossRows.length === 0) {
                return res.status(404).json({ "error": "Could Not Find Boss" })
        };

        res.json({
            deletedBoss: bossRows[0],
            deletedDefences: defenceResults.rows
        });
    }
    catch(error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
};

module.exports = { getHomepage, getBosses, getBossById, addBoss, updateBoss,
    deleteBoss
 } ;