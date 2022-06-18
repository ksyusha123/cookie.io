function addPrototypes() {
    Math.toClosestInInterval = (value, start, end) =>
        Math.max(start, Math.min(end, value));

    Math.scaleOntoInterval = (value, minThreshold, maxThreshold, startInterval, endInterval) => {
        const thresholdDistance = maxThreshold - minThreshold;
        const intervalLength = endInterval - startInterval;
        const newValue = (value - minThreshold) / thresholdDistance * intervalLength + startInterval;
        return Math.toClosestInInterval(newValue, startInterval, endInterval);
    }

    Math.getRandomIntFromInterval = (start, end) =>
        Math.floor(Math.scaleOntoInterval(Math.random(), 0, 1, start, end));
}

module.exports = addPrototypes;