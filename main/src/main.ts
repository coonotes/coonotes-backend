/// <reference path="../../typings/express/express.d.ts" />

import express = require('express');

const router = express();
router.get('/', (req, res) => {
    res.send('Hi!');
});

router.listen(9898);

export = router;
