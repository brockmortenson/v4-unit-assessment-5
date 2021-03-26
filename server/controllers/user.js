const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res) => {
        const { username, password } = req.body;
        const profilePic = `https://robohash.org/${username}.png`;
        const db = req.app.get('db');
        try {
            const [ existingUser ] = await db.find_user_by_username(username);

            if (existingUser) {
                return res.status(409).send('Username already taken')
            }

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const createdUser = await db.create_user([username, hash, profilePic]);
            const user = createdUser[0];

            req.session.user = {
                profilePic: user.profilePic,
                username: user.username,
                id: user.id
            };

            /* not sure if you can do it this way or if you have to do it how i wrote it above */
            // const [ createdUser ] = await db.create_user(username, hash, profilePic);

            // req.session.user = createdUser;

            return res.status(201).send(req.session.user);

        } catch(err) {
            console.log(err)
            return res.sendStatus(500)
        }
    },
    login: async (req, res) => {
        const { username, password } = req.body;
        const db = req.app.get('db');
        const foundUser = await db.find_user_by_username([username]);
        const user = foundUser[0];

        if (!user) {
            return res.status(401).send('User not found')
        }

        const isAuthenticated = bcrypt.compareSync(password, user.hash);

        if (!isAuthenticated) {
            return res.status(403).send('Incorrect username or password')
        }

        req.session.user = {
            username: user.username,
            id: user.id
        };

        return res.status(200).send(req.session.user);
    },
    logout: async (req, res) => {
        req.session.destroy();
        return res.sendStatus(200);
    },
    getUser: async (req, res) => {
        const user = await req.app.get('db').find_user_by_username([req.session.user.id]);
        return res.status(200).send(user);
    }
}