const express = require('express');
const router = express.Router();
const query = require('./../db');

router.get('/', async function (req, res, next) {
    let sql = `
        SELECT
            count(*) as count,
            DATE_FORMAT(CURDATE(), \'%Y-%m-%d\') as date
        FROM DiscordUsers 
        GROUP BY DATE_FORMAT(CURDATE(), \'%m-%d-%Y\')
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
