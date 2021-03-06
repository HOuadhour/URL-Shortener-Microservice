const app = require("./middleware");
const mongoose = require("mongoose");
const { findUrlByNumber, addNewUrl } = require("./db");

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl/new", (req, res) => {
  const error = { error: "Invalid URL" };
  try {
    let url = new URL(req.body.url);
    if (url.protocol.match(/https?:/i)) {
      url = url.toString().trim();
      url = url.endsWith("/") ? url.slice(0, -1) : url;
      addNewUrl(url)
        .then(doc => {
          res.json({
            original_url: doc.original_url,
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

app.get("/api/shorturl/:short_url", (req, res) => {
  const { short_url } = req.params;
  findUrlByNumber(short_url)
    .then(doc => {
      if (doc) res.redirect(doc.original_url);
      else {
        res.json({ error: "url not found in db" });
      }
    })
    .catch(err => {
      res.json({ error: "url not found in db" });
    });
});

app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

module.exports = app;
