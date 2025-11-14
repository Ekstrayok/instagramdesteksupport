import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors()); // frontend'in bağlanabilmesi için

const DB_FILE = "users.json";

// Kayıt endpointi
app.post("/save", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Eksik bilgi!" });
    }

    let users = [];
    if (fs.existsSync(DB_FILE)) {
        users = JSON.parse(fs.readFileSync(DB_FILE));
    }

    users.push({
        username,
        password,
        date: new Date().toISOString()
    });

    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));

    res.json({ message: "Bilgiler kaydedildi!" });
});

// Tüm kullanıcıları listele
app.get("/users", (req, res) => {
    if (!fs.existsSync(DB_FILE)) return res.json([]);
    const users = JSON.parse(fs.readFileSync(DB_FILE));
    res.json(users);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend çalışıyor → " + PORT));
