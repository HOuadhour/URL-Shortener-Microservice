const app = require("./middleware");
const mongoose = require("mongoose");
const { findUrlByNumber, addNewUrl } = require("./db");

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl/new", (req, res) => {
  const error = { error: "Invalid URL" };
  try {
    const url = new URL(req.body.url);
    if (url.protocol.match(/https?:/)) {
      addNewUrl(url.href.toLowerCase().trim())
        .then(doc => {
          res.json({
            original_url: doc.full_url,
            short_url: doc.short_url,
          });
        })
        .catch(() => {
          res.redirect("/");
        });
    } else {
      res.json(error);
    }
  } catch {
    res.json(error);
  }
});

app.get("/api/shorturl/:counter", (req, res) => {
  const { counter } = req.params;
  findUrlByNumber(counter)
    .then(doc => {
      if (doc) res.redirect(doc.full_url);
    })
    .catch(err => {
      res.redirect("/");
    });
});

app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

module.exports = app;
