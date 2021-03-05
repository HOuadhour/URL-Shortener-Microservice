const fs = require("fs");
const file = "./counter.json";

const getCounter = () => {
  const data = fs.readFileSync(file, "utf-8");
  return JSON.parse(data);
};

const updateCounter = (counter) => {
  counter.value++;
  fs.writeFileSync(file, JSON.stringify(counter), "utf-8");
  return counter.value;
};

module.exports = {
  getCounter,
  updateCounter,
};
