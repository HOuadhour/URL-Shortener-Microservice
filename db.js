const mongoose = require("mongoose");
const { getCounter, updateCounter } = require("./counter");

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: { type: Number, required: true },
});

const URLModel = mongoose.model("URLModel", urlSchema);

function findUrl(url) {
  return URLModel.findOne({ original_url: url }).exec();
}

function findUrlByNumber(number) {
  return URLModel.findOne({ short_url: number }).exec();
}

function addNewUrl(href) {
  const url = new URLModel();
  const counter = getCounter();
  // check if url already exists or not
  return findUrl(href).then(doc => {
    if (!doc) {
      url.original_url = href;
      url.short_url = counter.value;
      url.save().then(() => updateCounter(counter));
      return url;
    }
    return doc;
  });
}

module.exports = {
  findUrlByNumber,
  addNewUrl,
};
