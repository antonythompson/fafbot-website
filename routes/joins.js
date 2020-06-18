const express = require('express');
const router = express.Router();
const query = require('./../db');

router.get('/', async function (req, res, next) {
    let sql = `
        SELECT
            count(*) as count,
            max(join_date) as date
        FROM DiscordUsers 
        GROUP BY DATE_FORMAT(join_date, \'%m-%Y\')
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
