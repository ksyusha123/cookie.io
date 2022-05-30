function addPrototypes() {
    Math.getRandomIntFromInterval = (start, end) =>
        Math.floor(Math.random() * (end - start)) + start;
}

module.exports = addPrototypes;