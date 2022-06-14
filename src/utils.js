function addPrototypes() {
    Math.getRandomIntFromInterval = (start, end) =>
        Math.floor(Math.random() * (end - start)) + start;

    Math.toClosestInInterval = (value, start, end) =>
        Math.max(start, Math.min(end, value));

    Math.scaleOntoInterval = (value, minThreshold, maxThreshold, startInterval, endInterval) => {
        const thresholdDistance = maxThreshold - minThreshold;
        const newValue = (value - minThreshold) / thresholdDistance;
        return Math.toClosestInInterval(newValue, startInterval, endInterval);
    }
}

module.exports = addPrototypes;