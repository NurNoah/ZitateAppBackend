const express = require("express");
const app = express();
const cors = require("cors");
const db = require('./database.js');

app.use(cors());
app.use(express.json());

const HTTP_PORT = 8000;

app.listen(HTTP_PORT, () => {
    console.log('Server running on ' + HTTP_PORT)
})

app.get("/api", (req, res) => {
    res.json({ message: "OK" });
});

app.get("/api/zitate", (req, res) => {
    let sql = "SELECT * FROM zitate";
    let params = [];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: "success",
            data: rows,
        })
    });
});

app.get("/api/zitate/:id", (req, res) => {
    let sql = "SELECT * FROM zitate WHERE id = ?";
    let params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: "success",
            data: row,
        })
    });

});

app.post("/api/zitate", (req, res) => {
    let errors = [];

    if (!req.body.name) {
        errors.push("No name given")
    }

    if (!req.body.msg) {
        errors.push("No message given")
    }

    if (errors.length) {
        res.status(400).json({ error: errors, })
    }

    let data = {
        name: req.body.name,
        msg: req.body.msg,
        created: Date.now(),
    };

    let sql = "INSERT INTO zitate (name, msg, created) VALUES (?,?,?)";
    let params = [data.name, data.msg, data.created];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: data,
            id: this.lastID,
        })
    })
});

app.patch("/api/zitate/:id", (req, res) => {
    let data = {
        name: req.body.name,
        msg: req.body.msg,
    };

    let sql = `UPDATE zitate SET
    name = COALESCE(?, name),
    msg = COALESCE(?, msg)
    WHERE id = ?`;

    let params = [data.name, data.msg, req.params.id]

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: data,
            changes: this.changes,
        });
    });
});

app.delete("/api/zitate/:id", (req, res) => {
    let sql = "DELETE FROM zitate WHERE id = ?";
    let params = [req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            changes: this.changes,
        })
    });
});

app.use((req, res) => {
    res.status(404).json({
        message: "404, gibts net"
    })
});