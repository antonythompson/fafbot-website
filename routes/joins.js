const express = require('express');
const router = express.Router();
const query = require('./../db');

router.get('/', async function (req, res, next) {
    let sql = `
        SELECT
            count(*) as count,
            max(DATE_FORMAT(join_date, \'%Y-%m-%d\')) as date
        FROM DiscordUsers 
        GROUP BY DATE_FORMAT(join_date, \'%Y-%m-%d\')
        ORDER BY DATE_FORMAT(join_date, \'%Y-%m-%d\')
    `;

    try{
        let result = await query(sql);
        res.json({data: result.rows})
    } catch (e) {
        res.status(500)
        res.json({ error: e })
    }
});

module.exports = router;
