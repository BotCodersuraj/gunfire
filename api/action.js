let songsDB = [];

export default async function handler(req, res) {
  try {
    const {
      type,
      query,
      title,
      singer,
      writer,
      composer,
      album,
      year,
      genre,
      is_list,
      mode
    } = req.query;

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

    // ADD SONG WITH FULL DETAILS
    if (type === "add") {
      if (!title || !singer) {
        return res.status(400).json({
          success: false,
          message: "Title and Singer required"
        });
      }

      const newSong = {
        id: songsDB.length + 1,
        title,
        singer,
        writer: writer || null,
        composer: composer || null,
        album: album || null,
        year: year ? Number(year) : null,
        genre: genre || null,
        is_list: is_list === "true",
        created_at: Date.now()
      };

      songsDB.push(newSong);

      return res.status(200).json({
        success: true,
        message: "Song added successfully",
        data: newSong
      });
    }

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