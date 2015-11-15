import express = require('express');
import {SharedConnectionRepository} from "./infr/Repository";
import {UserRepository} from "./domain/user/UserRepository";
import {CreateNewUser} from "./domain/user/User";
import {User} from "./domain/user/User";

const router = express();
router.get('/', (req, res) => {
    res.send('Hello world!');
});

router.listen(9898, () => {
    console.log('Running...');

    SharedConnectionRepository.connect().then(function() {
        const user = CreateNewUser("testUser", "valid@email.com", "testPassword");
        const repo = new UserRepository();

        repo.save(user);
    });
});

export = router;
