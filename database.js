const sqlite3 = require("sqlite3");

let db = new sqlite3.Database("zitate.db", (err) => {
    if(err){
        throw err;
    }

    console.log("Connected to SQL");

    db.run(
        `CREATE TABLE zitate(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            msg TEXT NOT NULL,
            created INTEGER
        )`, 
        (err) => {
            if(err){
                return;
            }
        }
    );
});

module.exports = db;
