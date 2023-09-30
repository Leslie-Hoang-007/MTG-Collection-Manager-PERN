const express = require("express");
const app = express(); // takes express library and run it
const cors = require("cors");
const pool = require("./db");

// MIDDLEWARE
app.use(cors());// app.use to create middleware
app.use(express.json());// get data from client side from req.body objext

// APIS
// GET ALL CARDS

app.get("/cards", async (req, res) => {
  try {
    // const allCards = await pool.query("SELECT * From cards Limit 100");

    const page = req.body.page;
    const limit = req.body.limit;
    const skip = (page - 1) * limit;
    const searchName = req.body.search;

    const searchSet = req.body.set_name;
    const sortBy = req.body.sortBy;


    // SQL SELECT
    let query = `SELECT * FROM cards`;

    let count = `SELECT COUNT(*) FROM cards`;

    // ADD WHERE FOR searchName 
    if (searchName) {
      query += " WHERE name LIKE '%" + searchName + "%'";
      count += " WHERE name LIKE '%" + searchName + "%'";

    }

    // ADD WHERE for searchSet
    if (searchSet) {
      if (searchName) {
        query += ` AND `;
        count += ` AND `;
      } else {
        query += ` WHERE `;
        count += ` WHERE `;
      }
      query += " set_name LIKE '%" + searchSet + "%'";
      count += " set_name LIKE '%" + searchSet + "%'";
    }


    // COUNT TOTAL CARDS FROM SEARCH 
    const totalCards = await pool.query(count);

    // Add ORDER BY CLASUE FOR SORTING
    if (sortBy === "name-asc") {
      query += `
        ORDER BY name ASC
      `;
    } else if (sortBy === "name-desc") {
      query += `
        ORDER BY name DESC
      `;
    } else if (sortBy === "price-high") {
      query += `
        ORDER BY "prices.usd" DESC NULLS LAST
      `;
    } else if (sortBy === "price-low") {
      query += `
        ORDER BY "prices.usd" ASC NULLS FIRST
      `;
    }

    // Add LIMIT AND OFFSET CLAUSE FOR PAGINATION
    query += " LIMIT " + limit + " OFFSET " + skip;

    // RUN QUERY 
    const cards = await pool.query(query);

    // RESPOND WITH CARDS AND TOTAL ROW COUNT
    res.json({
      totalCards: totalCards.rows[0].count,
      cards: cards,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET A CARD
app.get("/cards/:id", async (req, res)=>{
  try {
    const id = req.params.id;

    const card = await pool.query("SELECT * FROM cards WHERE id = $1", [id])

    res.json({
      card: card
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// POST - Create Collection

app.post("/collection", async(req, res)=>{
  try {
    const user_id = req.body.user_id;
    const collection_name = req.body.collection_name;

    const createCollection = await pool.query("INSERT INTO collection (user_id, collection_name) VALUES ($1,$2)", [user_id,collection_name]);

    res.json({status: "CREATE COLLECTION SUCCESSFUL"});

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});

// LISTEN
app.listen(5000, () => {// listen to port 5000
  console.log("server has started on port 5000");
}); 