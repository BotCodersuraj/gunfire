const express = require("express");
const app = express();

let songsDB = [];

app.get("/api/action", (req, res) => {

    const { type, query, title, is_list, mode } = req.query;

    if (type === "search") {
        const results = songsDB.filter(song =>
            song.title.toLowerCase().includes(query?.toLowerCase())
        );

        return res.json({
            success: true,
            mode: mode || 0,
            results
        });
    }

    if (type === "add") {
        if (!title) {
            return res.json({ success: false, message: "No title provided" });
        }

        const newSong = {
            id: songsDB.length + 1,
            title,
            is_list: is_list === "true"
        };

        songsDB.push(newSong);

        return res.json({
            success: true,
            message: "Song added",
            data: newSong
        });
    }

    res.json({ success: false, message: "Invalid action" });
});

app.listen(3000, () => console.log("API running on port 3000"));