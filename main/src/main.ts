import express = require('express');

const router = express();
router.get('/', (req, res) => {
    res.send('Hello world!');
});

router.listen(9898, () => {
    console.log('Running...');
});

export = router;
