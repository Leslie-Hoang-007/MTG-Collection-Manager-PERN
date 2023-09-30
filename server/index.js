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
      cards: cards.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET A CARD
app.get("/cards/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const card = await pool.query("SELECT * FROM cards WHERE id = $1", [id])

    res.json({
      card: card.rows
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// POST - Create Collection
app.post("/collection", async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const collection_name = req.body.collection_name;

    const createCollection = await pool.query("INSERT INTO collection (user_id, collection_name) VALUES ($1,$2)", [user_id, collection_name]);

    res.json({ status: "CREATE COLLECTION SUCCESSFUL" });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});

// DELETE - Collection + CardsInCollection
app.delete("/collection", async (req, res) => {
  try {
    const collection_id = req.body.collection_id;

    const deleteCollection = await pool.query("DELETE FROM collection WHERE collection_id = $1", [collection_id])
    const deleteCardInCollection = await pool.query("DELETE FROM cardincollection WHERE collection_id = $1", [collection_id]);

    res.json({
      status: "DELETE COLLECTION SUCCESSFUL"
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET - Collection Names
app.get('/collection', async (req, res) => {
  try {
    const user_id = req.body.user_id;

    const collectionNames = await pool.query("SELECT * FROM collection WHERE user_id = $1", [user_id]);
    
    res.json({
      collection: collectionNames.rows
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  });

  
// GET - Cards In Collection
app.get('/collection/:collection_name/:collection_id', async (req, res) => {
  try {
      const collection_name = req.params.collection_name;
      const collection_id = req.params.collection_id;

      const CardsInCollection = await pool.query(
        `SELECT *
        FROM collection c
        JOIN cardincollection cc ON c.collection_id = cc.collection_id
        JOIN cards ca ON cc.card_id = ca.card_id
        WHERE
        (
          c.collection_name = $1
        ) AND
        ( c.collection_id = $2)
        `,[collection_name,collection_id]
      );

      // loop through and calculate
      let totalValue = 0;
      let uniquCards=[];
      for (const card of CardsInCollection.rows){
          if(!uniquCards.includes(card.card_id)){
            uniquCards.push(card.card_id);
          };
          if(card.value){
            totalValue += card.value;
          };
      };
      

      res.json({totalCards: CardsInCollection.rows.length, 
      totalValue: totalValue, uniquCards: uniquCards.length, cards:CardsInCollection.rows});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  });
  

// POST - Add CardInCollection
app.post('/cards', async (req, res) => {
try {
  const collection_id = req.body.collection_id;
  const card_id = req.body.card_id;
  const companygradedby_id = req.body.companygradedby_id;
  const grade_id = req.body.grade_id;
  const isfoil = req.body.isfoil;
  const value = req.body.value;

  // SEARCH IF CARDINCOLLECTION ALREADY EXISTS

  
  let query = "INSERT INTO cardincollection (collection_id, card_id, count";
  let paramCounter = 3;
  let paramValues = " VALUES ($1, $2, $3";
  let values = [collection_id, card_id, 1]

  if (companygradedby_id>=0 && grade_id>=0){
    query += ", companygradedby_id, grade_id";
    paramCounter++;
    paramValues += ", $" + paramCounter;
    values.push(companygradedby_id);
    paramCounter++;
    paramValues += ", $" + paramCounter;
    values.push(grade_id);
  }
  if(isfoil){
    query += ", isfoil"
    paramCounter++;
    paramValues += ", $" + paramCounter;
    values.push(isfoil);
  }
  if(value>=0){
    query += ", value"
    paramCounter++;
    paramValues += ", $" + paramCounter;
    values.push(value);
  }

  query +=") " + paramValues + ") RETURNING *"

  const createCardInCollection = await pool.query(query,values);
  
  console.log(companygradedby_id,grade_id);
  console.log(query);
  res.json({status:"CREATE CARDINCOLLECTION SUCCESS", cardstuff: createCardInCollection})

} catch (err) {
  console.error(err.message);
  res.status(500).send('Server Error');
}
});

// DELETE - Card In Collection
  

//
// LISTEN
app.listen(5000, () => {// listen to port 5000
  console.log("server has started on port 5000");
}); 