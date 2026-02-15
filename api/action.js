let songsDB = [];

export default async function handler(req, res) {
  try {
    const { type, query, title, is_list, mode } = req.query;

    // SEARCH SONG
    if (type === "search") {
      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Query missing"
        });
      }

      const results = songsDB.filter(song =>
        song.title.toLowerCase().includes(query.toLowerCase())
      );

      return res.status(200).json({
        success: true,
        mode: mode || 0,
        total: results.length,
        results
      });
    }

    // ADD SONG
    if (type === "add") {
      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title missing"
        });
      }

      const newSong = {
        id: songsDB.length + 1,
        title: title,
        is_list: is_list === "true",
        created_at: Date.now()
      };

      songsDB.push(newSong);

      return res.status(200).json({
        success: true,
        message: "Song added",
        data: newSong
      });
    }

    // DEFAULT RESPONSE
    return res.status(400).json({
      success: false,
      message: "Invalid action type"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}