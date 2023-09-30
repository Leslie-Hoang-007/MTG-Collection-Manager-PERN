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


// GET - All Cards In Collection + Collection Data
app.get('/collection/:collection_id', async (req, res) => {
  try {

    const collection_id = req.params.collection_id;
    // console.log(collection_id);
    const CardsInCollection = await pool.query(
      `SELECT *
        FROM collection c
        JOIN cardincollection cc ON c.collection_id = cc.collection_id
        JOIN cards ca ON cc.card_id = ca.id
        WHERE
          c.collection_id = $1
        `, [collection_id]
    );

    // loop through and calculate
    let totalValue = 0;
    let uniquCards = [];
    for (const card of CardsInCollection.rows) {
      if (!uniquCards.includes(card.card_id)) {
        uniquCards.push(card.card_id);
      };
      if (card.value) {
        totalValue += card.value;
      };
    };


    res.json({
      totalCards: CardsInCollection.rows.length,
      totalValue: totalValue, uniquCards: uniquCards.length, cards: CardsInCollection.rows
    });
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
    let searchQueryCardInCollection = "SELECT * FROM cardincollection WHERE collection_id = $1 AND card_id = $2"
    let searchQueryCounter = 2;
    let searchValues = [collection_id, card_id]

    if (companygradedby_id >= 0 && grade_id >= 0) {
      searchQueryCounter++;
      searchQueryCardInCollection += " AND companygradedby_id = $" + searchQueryCounter + " AND grade_id = $";
      searchValues.push(companygradedby_id);
      searchQueryCounter++;
      searchQueryCardInCollection += searchQueryCounter;
      searchValues.push(grade_id);
    }
    if (isfoil) {
      searchQueryCounter++;
      searchQueryCardInCollection += " AND isfoil = $" + searchQueryCounter;
      searchValues.push(isfoil);
    }
    if (value >= 0) {
      searchQueryCounter++;
      searchQueryCardInCollection += " AND value = $" + searchQueryCounter
      searchValues.push(value);
    }

    const searchCardInCollection = await pool.query(searchQueryCardInCollection, searchValues);

    if (searchCardInCollection.rows.length > 0) {
      const cardincollection_id = searchCardInCollection.rows[0].cardincollection_id;
      const updateCount = searchCardInCollection.rows[0].count + 1
      const updateQuery = "UPDATE cardincollection SET count = $1 WHERE cardincollection_id = $2";

      await pool.query(updateQuery, [updateCount, cardincollection_id]);
      res.json({ status: "CARD ALREADY EXIST UPDATED COUNT" });
    } else
    // ELSE CREATE CardInCollection
    {
      let query = "INSERT INTO cardincollection (collection_id, card_id, count";
      let paramCounter = 3;
      let paramValues = " VALUES ($1, $2, $3";
      let values = [collection_id, card_id, 1]

      if (companygradedby_id >= 0 && grade_id >= 0) {
        query += ", companygradedby_id, grade_id";
        paramCounter++;
        paramValues += ", $" + paramCounter;
        values.push(companygradedby_id);
        paramCounter++;
        paramValues += ", $" + paramCounter;
        values.push(grade_id);
      }
      if (isfoil) {
        query += ", isfoil"
        paramCounter++;
        paramValues += ", $" + paramCounter;
        values.push(isfoil);
      }
      if (value >= 0) {
        query += ", value"
        paramCounter++;
        paramValues += ", $" + paramCounter;
        values.push(value);
      }

      query += ") " + paramValues + ") RETURNING *"

      await pool.query(query, values);

      console.log(companygradedby_id, grade_id);
      console.log(query);
      res.json({ status: "CREATE CARDINCOLLECTION SUCCESS" });
    };
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server Error');
  }
});

// DELETE - A Card In Collection
app.delete('/cards', async (req, res) => {
  try {

    const cardincollection_id = req.body.cardincollection_id;

    const searchCardCount = "SELECT * FROM cardincollection WHERE cardincollection_id = $1";

    const cardCount = await pool.query(searchCardCount, [cardincollection_id]);

    if (cardCount.rows[0].count >1){
      const newCount = cardCount.rows[0].count -1;
      await pool.query("UPDATE cardincollection SET count = $1 WHERE cardincollection_id = $2", [newCount,cardincollection_id]);
      res.json({status: "MULTIPLE CARDS DECREASED COUNT"});
    }else if (cardCount.rows[0].count = 1){

      const query = "DELETE FROM cardincollection WHERE cardincollection_id = $1";

      await pool.query(query, [cardincollection_id]);
      res.json({ status: "DELETE CARD IN COLLECTION SUCCESSFUL" });
    }else{
      res.json({ status: "CARD DOES NOT EXIST" });

    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Interal Server Error' })
  }
});

// UPDATE CARD IN COLLECTION 

// app.put('/collection', async (req, res) => {
//   try {

//     const { username, password } = req.body;

//     // search for existing username 
//     const querySearchUser = "SELECT * FROM users WHERE username = $1"
//     const resultSearch = await pool.query(querySearchUser, [username]);

//     if (resultSearch.rows.length > 0) {
//       const storedPassword = resultSearch.rows[0].password;
//       if (storedPassword == password){
//         res.json({ status: "LOGIN SUCCESSFUL" });
//       }else{
//         res.json({ status: "INVALID PASSWORD" });
//       }
//     } else {
//       res.json({ status: "ACCOUNT DOES NOT EXIST" });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'Interal Server Error' })
//   }
// });
// ############## USER LOGIN AND REGISTRATION ########################

// POST - REGISTE USER
app.post('/register', async (req, res) => {
  try {

    const { username, email, password } = req.body;

    // search for existing username 
    const querySearchUser = "SELECT * FROM users WHERE username = $1"
    const resultSearch = await pool.query(querySearchUser, [username]);

    if (resultSearch.rows.length > 0) {
      res.json({ status: "ACCOUNT UERNAME ALREADY EXISTS" });
    } else {
      const queryCreateUser = "INSERT INTO users(username,email,password) VALUES ($1,$2,$3) RETURNING *"
      const user = await pool.query(queryCreateUser,[username,email,password]);
      await pool.query("INSERT INTO collection (user_id,wishlist) VALUES ($1,$2)",[user.rows[0].user_id, false])
      await pool.query("INSERT INTO collection (user_id,wishlist) VALUES ($1,$2)",[user.rows[0].user_id, true])

      res.json({ status: "ACCOUNT CREATION SUCCESSFUL" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Interal Server Error' })
  }
});

// POST - LOGIN
app.post('/login', async (req, res) => {
  try {

    const { username, password } = req.body;

    // search for existing username 
    const querySearchUser = "SELECT * FROM users WHERE username = $1"
    const resultSearch = await pool.query(querySearchUser, [username]);

    if (resultSearch.rows.length > 0) {
      const storedPassword = resultSearch.rows[0].password;
      if (storedPassword == password){
        res.json({ status: "LOGIN SUCCESSFUL" });
      }else{
        res.json({ status: "INVALID PASSWORD" });
      }
    } else {
      res.json({ status: "ACCOUNT DOES NOT EXIST" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Interal Server Error' })
  }
});




// LISTEN
app.listen(5000, () => {// listen to port 5000
  console.log("server has started on port 5000");
}); 