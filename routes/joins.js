const express = require('express');
const router = express.Router();
const query = require('./../db');

router.get('/', async function (req, res, next) {
    let guild_id = req.query.guild_id || null
    if (guild_id !== null) {
        console.log(guild_id)
        let sql = `
        SELECT
            count(*) as count,
            max(DATE_FORMAT(join_date, \'%Y-%m-%d\')) as date
        FROM GuildJoins  
        WHERE guild_id = ?
        GROUP BY DATE_FORMAT(join_date, \'%Y-%m-%d\')
        ORDER BY DATE_FORMAT(join_date, \'%Y-%m-%d\')
    `;

        try{
            let result = await query(sql, [guild_id]);
            res.json({data: result.rows})
        } catch (e) {
            res.status(500)
            res.json({ error: e })
        }
    } else {
        res.status(400)
        res.json({ error: 'No guild selected' })
    }
});

module.exports = router;
