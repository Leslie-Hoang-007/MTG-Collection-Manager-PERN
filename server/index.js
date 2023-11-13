const express = require("express");
const app = express(); // takes express library and run it
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

// MIDDLEWARE
app.use(cors());// app.use to create middleware
app.use(express.json());// get data from client side from req.body objext

// LOGS 

const logData = async function (data, req, res, next) {
  try {

    let { user_id, log, card_id, cardincollection_id,admin } = data;
    const date = new Date();
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
    const date_time = new Intl.DateTimeFormat('en-US', options).format(date);
    // Use await to wait for the database query to complete
    const result = await pool.query(
      "INSERT INTO logs (user_id, log, date_time, card_id, cardincollection_id,admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [user_id, log, date_time, card_id, cardincollection_id,admin]
    );

    // console.log(result.rows[0]); // Log the query result
    next();
  } catch (error) {
    console.error("Error logging action:", error);
    next(error); // Pass the error to the error handling middleware, if any.
  }
};

// APIS

// GET A CARD
app.get("/api/cards/:id", async (req, res) => {
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


// GET SETS
app.get("/api/sets", async (req, res) => {
  try {

    const sets = await pool.query("SELECT * FROM sets");

    res.json({
      sets: sets.rows
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});


// GET ALL CARDS

app.get("/api/cards", async (req, res) => {
  try {
    // const allCards = await pool.query("SELECT * From cards Limit 100");

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;
    const searchName = req.query.search;

    const searchSet = req.query.set_name;
    const sortBy = req.query.sortBy;

    // console.log(req.query);

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


// POST - All Cards In Collection + Collection Data
app.post('/api/collection', async (req, res) => {
  try {

    const page = parseInt(req.body.page);
    const limit = parseInt(req.body.limit);
    const skip = (page - 1) * limit;
    const searchName = req.body.search;

    const searchSet = req.body.set_name;
    const sortBy = req.body.sortBy;


    const collection_id = req.body.collection_id;
    // console.log(req.body);



    // const CardsInCollection = await pool.query(
    //   `SELECT *
    //     FROM collection c
    //     JOIN cardincollection cc ON c.collection_id = cc.collection_id
    //     JOIN cards ca ON cc.card_id = ca.id
    //     WHERE
    //       c.collection_id = $1
    //     `, [collection_id]
    // );

    let query = "SELECT * FROM collection c JOIN cardincollection cc ON c.collection_id = cc.collection_id JOIN cards ca ON cc.card_id = ca.id WHERE c.collection_id = $1";
    let count = "SELECT COUNT(*) FROM collection c JOIN cardincollection cc ON c.collection_id = cc.collection_id JOIN cards ca ON cc.card_id = ca.id WHERE c.collection_id = $1";

    // ADD WHERE FOR searchName 
    if (searchName) {
      query += " AND ca.name LIKE '%" + searchName + "%'";
      count += " AND ca.name LIKE '%" + searchName + "%'";

    }

    // ADD WHERE for searchSet
    if (searchSet) {

      query += " AND ca.set_name LIKE '%" + searchSet + "%'";
      count += " AND ca.set_name LIKE '%" + searchSet + "%'";
    }


    // COUNT TOTAL CARDS FROM SEARCH 
    const totalCards = await pool.query(count, [collection_id]);

    // Add ORDER BY CLASUE FOR SORTING
    if (sortBy === "name-asc") {
      query += `
        ORDER BY ca.name ASC
      `;
    } else if (sortBy === "name-desc") {
      query += `
        ORDER BY ca.name DESC
      `;
    } else if (sortBy === "price-high") {
      query += `
        ORDER BY ca."prices.usd" DESC NULLS LAST
      `;
    } else if (sortBy === "price-low") {
      query += `
        ORDER BY ca."prices.usd" ASC NULLS FIRST
      `;
    }

    // // Add LIMIT AND OFFSET CLAUSE FOR PAGINATION
    query += " LIMIT " + limit + " OFFSET " + skip;

    // RUN QUERY 
    const CardsInCollection = await pool.query(query, [collection_id]);



    // loop through and calculate
    let totalValue = 0;
    let uniquCards = [];
    // let totalCount =0;// ##### ADD LATTER
    for (const card of CardsInCollection.rows) {
      if (!uniquCards.includes(card.card_id)) {
        uniquCards.push(card.card_id);
      };
      if (card.value) {
        totalValue += card.value * card.count;
      };
    };


    res.json({
      totalCards: totalCards.rows[0].count,
      totalValue: totalValue, uniquCards: uniquCards.length, cards: CardsInCollection.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// GET - A CardInCollection
app.get("/api/collection", async (req, res) => {
  try {
    const id = req.query.cardincollection_id;
    // console.log(id);

    let card = await pool.query("SELECT * FROM cardincollection cc JOIN cards c ON cc.card_id = c.id WHERE cc.cardincollection_id = $1", [id])
    if (card.rows[0].grade_id) {
      card = await pool.query("SELECT * FROM cardincollection cc JOIN cards c ON cc.card_id = c.id JOIN grades g ON cc.grade_id = g.grade_id WHERE cc.cardincollection_id = $1", [id])
    }

    res.json({
      card: card.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// POST - Add CardInCollection
app.post('/api/cards', async (req, res) => {
  try {

    const user_id = req.body.user_id;
    const collection_id = req.body.collection_id;
    const card_id = req.body.card_id;
    const companygradedby_id = req.body.companygradedby_id;
    const grade_id = req.body.grade_id;
    const isfoil = req.body.isfoil;
    const count = req.body.count;
    const value = req.body.value;



    // SELECT CARD
    let searchCard = "SELECT * FROM cards WHERE id = $1";
    const card = await pool.query(searchCard, [card_id]);

    // LOG
    let logFront = "";
    let logBack = "";
    logBack += card.rows[0].name + " - " + card.rows[0].set_name + "(Card #" + card.rows[0].collector_number + ") ";

    // SEARCH IF CARDINCOLLEC;TION ALREADY EXISTS
    let searchQueryCardInCollection = "SELECT * FROM cardincollection cc JOIN cards ca ON cc.card_id = ca.id WHERE cc.collection_id = $1 AND cc.card_id = $2"
    let searchQueryCounter = 2;
    let searchValues = [collection_id, card_id]

    if (isfoil) {
      searchQueryCounter++;
      searchQueryCardInCollection += " AND isfoil = $" + searchQueryCounter;
      searchValues.push(isfoil);
      logBack += "Foil ";
    } else {
      logBack += "Non-foil ";
    }
    if (companygradedby_id && grade_id) {
      searchQueryCounter++;
      searchQueryCardInCollection += " AND companygradedby_id = $" + searchQueryCounter + " AND grade_id = $";
      searchValues.push(companygradedby_id);
      searchQueryCounter++;
      searchQueryCardInCollection += searchQueryCounter;
      searchValues.push(grade_id);
      logBack += "- " + grade_id + " - ";
    }
    if (value) {
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

      // LOGS ACTION
      logFront += "Increased the quantity of ";

      logBack += "from " + searchCardInCollection.rows[0].count + " to " + updateCount + ".";

      const log = logFront + logBack;
      const data = ({
        user_id: user_id,
        log: log,
        card_id: card.id,
        cardincollection_id: cardincollection_id
      });

      logData(data, req, res, () => {
        res.json({ status: "CARD ALREADY EXIST UPDATED COUNT" });
      });


    } else
    // ELSE CREATE CardInCollection
    {

      let query = "INSERT INTO cardincollection (collection_id, card_id";
      let paramCounter = 2;
      let paramValues = " VALUES ($1, $2";
      let values = [collection_id, card_id];

      if (companygradedby_id && grade_id) {
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
      if (value) {
        query += ", value"
        paramCounter++;
        paramValues += ", $" + paramCounter;
        values.push(value);
      }
      if (count) {
        query += ", count"
        paramCounter++;
        paramValues += ", $" + paramCounter;
        values.push(count);
      }

      query += ") " + paramValues + ") RETURNING *"

      const results = await pool.query(query, values);

      // console.log(companygradedby_id, grade_id);
      console.log(results.rows[0]);

      // LOG
      logFront += "Added ";
      logBack += "to collection.";
      const log = logFront + logBack;
      const data = ({
        user_id: user_id,
        log: log,
        card_id: card.id,
        cardincollection_id: results.rows[0].cardincollection_id
      });

      logData(data, req, res, () => {

        res.json({ status: "CREATE CARDINCOLLECTION SUCCESS" });
      });

    };
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server Error');
  }
});

// DELETE - A Card In Collection
app.delete('/api/cards', async (req, res) => {
  try {

    let logFront = "";
    let logBack = "";
    const { user_id, cardincollection_id } = req.body;
    const searchCard = "SELECT * FROM cardincollection cc JOIN cards c ON cc.card_id = c.id WHERE cc.cardincollection_id = $1";
    const card = await pool.query(searchCard, [cardincollection_id]);
    // console.log(card.rows[0]);

    logBack += card.rows[0].name + " - " + card.rows[0].set_name + "(Card #" + card.rows[0].collector_number + ") ";

    if (card.rows[0].count > 1) {
      const newCount = card.rows[0].count - 1;
      await pool.query("UPDATE cardincollection SET count = $1 WHERE cardincollection_id = $2", [newCount, cardincollection_id]);
      logFront += "Decreased the quantity of ";

      logBack += "from " + card.rows[0].count + " to " + newCount + ".";
      const log = logFront + logBack;
      const data = ({
        user_id: user_id,
        log: log,
        cardincollection_id: cardincollection_id
      });
      logData(data, req, res, () => {

        res.json({ status: "MULTIPLE CARDS DECREASED COUNT" });
      });


    } else if (card.rows[0].count = 1) {

      const query = "DELETE FROM cardincollection WHERE cardincollection_id = $1";

      await pool.query(query, [cardincollection_id]);

      logFront += "Deleted ";
      logBack += "from collection."
      const log = logFront + logBack;
      const data = ({
        user_id: user_id,
        log: log,
        card_id: card.rows[0].id
      });

      logData(data, req, res, () => {

        res.json({ status: "DELETE CARD IN COLLECTION SUCCESSFUL" });
      });

    } else {
      res.json({ status: "CARD DOES NOT EXIST" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Interal Server Error' })
  }
});

// UPDATE CARD IN COLLECTION 

app.put('/api/collection', async (req, res) => {
  try {

    const { cardincollection_id, collection_id, card_id, companygradedby_id, grade_id, isfoil, count, value } = req.body;
    // console.log(cardincollection_id, collection_id,card_id,companygradedby_id,grade_id,isfoil,count,value);
    // Search
    // const card = await pool.query("SELECT * FROM cardincollection WHERE carcincollection_id = "+ cardincollection_id);
    // console.log("exists");

    // // Search if card already exist with same values and increment count 
    // let searchQuery = "SELECT * FROM cardincollection WHERE collection_id = $1 AND card_id = $2 ";
    // let searchQueryCounter = 2;
    // let searchvalues = [collection_id, card_id];

    // if (companygradedby_id >= 0 && grade_id >= 0) {
    //   searchQueryCounter++;
    //   searchQueryCardInCollection += " AND companygradedby_id = $" + searchQueryCounter + " AND grade_id = $";
    //   searchValues.push(companygradedby_id);
    //   searchQueryCounter++;
    //   searchQueryCardInCollection += searchQueryCounter;
    //   searchValues.push(grade_id);
    // }
    // if (isfoil) {
    //   searchQueryCounter++;
    //   searchQueryCardInCollection += " AND isfoil = $" + searchQueryCounter;
    //   searchValues.push(isfoil);
    // }
    // if (value >= 0) {
    //   searchQueryCounter++;
    //   searchQueryCardInCollection += " AND value = $" + searchQueryCounter
    //   searchValues.push(value);
    // }

    // const exist = await pool.query(searchQuery, searchValues);

    // if (exist.rows.length >0){
    //   const count = exist.rows[0].count + 1;
    //   await pool.query("UPDATE FROM cardincollection SET count = $1 WHERE cardincollection_id = $2"
    //   , [count, card]
    //   );
    // }

    // console.log(req.body);
    // UPDATE
    let query = "UPDATE cardincollection SET"
    let numberOfParams = 0;
    let params = [];
    if (companygradedby_id && grade_id) {
      if (companygradedby_id == 888 || grade_id == 888) {
        numberOfParams++;
        query += " companygradedby_id = $" + numberOfParams + " , grade_id = $";
        params.push(null);
        numberOfParams++;
        query += numberOfParams;
        params.push(null);
      } else {
        numberOfParams++;
        query += " companygradedby_id = $" + numberOfParams + " , grade_id = $";
        params.push(companygradedby_id);
        numberOfParams++;
        query += numberOfParams;
        params.push(grade_id);
      }

    }
    if (isfoil) {
      numberOfParams++;
      if (numberOfParams == 1) {
        query += " isfoil = $" + numberOfParams;
      } else {
        query += ", isfoil = $" + numberOfParams;
      }
      params.push(isfoil);
    }
    if (value) {
      numberOfParams++;
      if (numberOfParams == 1) {
        query += " value = $" + numberOfParams
      } else {
        query += ", value = $" + numberOfParams
      }
      params.push(value);
    }
    if (count >= 1) {
      numberOfParams++;
      if (numberOfParams == 1) {
        query += " count = $" + numberOfParams
      } else {
        query += ", count = $" + numberOfParams
      }
      params.push(count);
    }

    console.log(query);
    numberOfParams++;
    query += " WHERE cardincollection_id = $" + numberOfParams;
    console.log(query);
    params.push(cardincollection_id);
    // console.log(query,params);
    await pool.query(query, params);

    res.json({ staus: "CARDINCOLLECTION UPDATED SUCCESS" })

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Interal Server Error' })
  }
});


// ############## USER LOGIN AND REGISTRATION ########################

// POST - REGISTE USER
app.post('/api/register', async (req, res) => {
  try {

    const { username, email, password } = req.body;

    // search for existing email
    const querySearchUser = "SELECT * FROM users WHERE email = $1"
    const resultSearch = await pool.query(querySearchUser, [email]);

    if (resultSearch.rows.length > 0) {
      res.json({ status: "EMAIL ADDRESS IN USE" });
    } else {
      const queryCreateUser = "INSERT INTO users(username,email,password) VALUES ($1,$2,$3) RETURNING *"
      const user = await pool.query(queryCreateUser, [username, email, password]);
      // console.log(user);

      // CREATE WISHLIST AND COLLECTION
      const collection = await pool.query("INSERT INTO collection (user_id,wishlist) VALUES ($1,$2) RETURNING *", [user.rows[0].user_id, false])
      const wishlist = await pool.query("INSERT INTO collection (user_id,wishlist) VALUES ($1,$2) RETURNING *", [user.rows[0].user_id, true])

      res.json({ status: "ACCOUNT CREATION SUCCESSFUL", user_id: user.rows[0].user_id, collection_id: collection.rows[0].collection_id, wishlist_id: wishlist.rows[0].collection_id });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Interal Server Error' })
  }
});

// POST - LOGIN
app.post('/api/login', async (req, res) => {
  try {

    const { email, password } = req.body;

    // search for existing username 
    const querySearchUser = "SELECT * FROM users WHERE email = $1";

    const resultSearch = await pool.query(querySearchUser, [email]);
    if (resultSearch.rows.length > 0) {
      const storedPassword = resultSearch.rows[0].password;
      if (storedPassword == password) {
        const collection_id = await pool.query("SELECT collection_id FROM collection WHERE wishlist = false AND user_id = $1", [resultSearch.rows[0].user_id]);
        const wishlist_id = await pool.query("SELECT collection_id FROM collection WHERE wishlist = true AND user_id = $1", [resultSearch.rows[0].user_id]);

        const log = resultSearch.rows[0].username + "Logged in successfully";

        const data = ({
          user_id: resultSearch.rows[0].user_id,
          log: log,
          admin:true
        });

        logData(data, req, res, () => {
          res.json({
            status: "LOGIN SUCCESSFUL", user_id: resultSearch.rows[0].user_id,
            collection_id: collection_id.rows[0].collection_id,
            wishlist_id: wishlist_id.rows[0].collection_id
          });
        });
       
      } else {
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


// POST - LOGIN
app.put('/api/logout', async (req, res) => {
  try {
    const { user_id } = req.body;
    console.log(user_id);
    // search for existing username 
    const querySearchUser = "SELECT * FROM users WHERE user_id = $1";

    const resultSearch = await pool.query(querySearchUser, [user_id]);
    console.log(resultSearch.rows[0]);
    const log = resultSearch.rows[0].username + " Logged out successfully";

        const data = ({
          user_id: resultSearch.rows[0].user_id,
          log: log,
          admin:true
        });

        logData(data, req, res, () => {
          res.json({
            status: "LOGOUT SUCCESSFUL", user_id: user_id
            
          });
        });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Interal Server Error' })
  }
});


// DASHBOARD 
app.post('/api/dashboard', async (req, res) => {
  try {
    const user_id = req.body.user_id;

    // console.log(collection_id);
    const CardsInCollection = await pool.query(
      `SELECT *
        FROM collection c
        JOIN cardincollection cc ON c.collection_id = cc.collection_id
        JOIN cards ca ON cc.card_id = ca.id
        WHERE
          c.wishlist= false
          AND
          c.user_id = $1
        `, [user_id]
    );

    // loop through and calculate
    let totalValue = 0;
    let uniquCards = [];
    let totalCount = 0;
    for (const card of CardsInCollection.rows) {
      totalCount += card.count;
      if (!uniquCards.includes(card.card_id)) {
        uniquCards.push(card.card_id);
      };
      if (card.value) {
        totalValue += card.value * card.count;
      };
    };
    res.json({
      totalCards: totalCount,
      totalValue: totalValue,
      uniqueCards: uniquCards.length,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GRADES
app.get('/api/grade', async (req, res) => {
  try {
    const company = await pool.query("SELECT * FROM companygradedby");
    const grades = await pool.query("SELECT * FROM grades");
    res.json({
      companygradedby: company.rows,
      grades: grades.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const port = process.env.PORT;
// LISTEN
app.listen(port, () => {// listen to port 5000
  console.log("server has started on port 5000");
}); 