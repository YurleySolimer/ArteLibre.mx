const pool = require("../database");

var saveArtist = async (newArtista) => {
  //Save a new artist in DB
  const artist = await pool.query("INSERT INTO artistas SET ? ", newArtista);
  return artist;
};

var getNotableArtist = async () => {
  //Get a completed artist where is notable
  const artist = await pool.query(
    "SELECT * FROM usuarioArtista WHERE destacar =? LIMIT 1",
    ["Si"]
  );
  return artist;
};

var getVisits = async (id) => {
  //Get profile visits
  const visits = await pool.query(
    "SELECT visitas FROM artistas WHERE user_id =?",
    [id]
  );
  return visits;
};

var getArtistStripe = async (id) => {
  //Get stripe info
  const artist = await pool.query(
    "SELECT * FROM artistStripe WHERE id_user =? LIMIT 1",
    [id]
  );
  return artist;
};

var getDataArtist = async (id) => {
  //Get data
  const artist = await pool.query("select * from artistas	where user_id =?", [
    id,
  ]);
  return artist;
};

var updateArtist = async (data, id) => {
  //
  const artist = await pool.query("UPDATE artistas SET ? WHERE user_id=? ", [
    data,
    id,
  ]);
  return artist;
};

var getArtistId = async (id) => {
  //
  const artist = await pool.query
  ("SELECT id FROM artistas WHERE user_id =?", [id]);
  return artist;
};


var saveArtistStripe = async (id) => {
  //
  const artist = await pool.query("INSERT INTO artistStripe SET?", [id]);
  return artist;
};


module.exports = {
  saveArtist,
  getNotableArtist,
  getVisits,
  getArtistStripe,
  getDataArtist,
  updateArtist,
  getArtistId,
  saveArtistStripe
};
