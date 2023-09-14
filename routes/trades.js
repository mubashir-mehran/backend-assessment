const express = require("express");
const router = express.Router();

const app = express();
const port = 8000;

app.use(bodyParser.json());

const trades = [];

let tradeIdCounter = 1;

class Trade {
  constructor(data) {
    this.id = tradeIdCounter++;
    this.data = data;
  }
}

app.post("/trades", (req, res) => {
  try {
    const tradeData = req.body;

    if ("id" in tradeData) {
      return res
        .status(400)
        .json({ error: 'Trade object should not contain an "id" property.' });
    }

    const newTrade = new Trade(tradeData);

    trades.push(newTrade);

    res.status(201).json(newTrade);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get("/trades", (req, res) => {
  try {
    const { type, user_id } = req.query;

    let filteredTrades = trades;

    if (type) {
      filteredTrades = filteredTrades.filter((trade) => trade.type === type);
    }

    if (user_id) {
      filteredTrades = filteredTrades.filter(
        (trade) => trade.user_id === user_id
      );
    }

    filteredTrades.sort((a, b) => a.id - b.id);

    res.status(200).json(filteredTrades);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get("/trades/:id", (req, res) => {
  try {
    const tradeId = parseInt(req.params.id);

    const matchingTrade = trades.find((trade) => trade.id === tradeId);

    if (matchingTrade) {
      res.status(200).json(matchingTrade);
    } else {
      res.status(404).send("ID not found");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app
  .route("/trades/:id")
  .delete((req, res) => {
    res.status(405).send("Not Allowed to Delete");
  })
  .put((req, res) => {
    res.status(405).send("Not Allowed To Update");
  });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = router;
