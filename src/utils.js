function addPrototypes() {
    Math.toClosestInInterval = (value, start, end) =>
        Math.max(start, Math.min(end, value));

    Math.scaleOntoInterval = (value, minThreshold, maxThreshold, startInterval, endInterval) => {
        const thresholdDistance = maxThreshold - minThreshold;
        const intervalLength = endInterval - startInterval;
        const newValue = (value - minThreshold) / thresholdDistance * intervalLength + startInterval;
        return Math.toClosestInInterval(newValue, startInterval, endInterval);
    }

    Math.getRandomFromInterval = (start, end) =>
        Math.scaleOntoInterval(Math.random(), 0, 1, start, end);

    Math.getRandomIntFromInterval = (start, end) =>
        Math.floor(Math.getRandomFromInterval(start, end));
}

function range(start, stop, step = 1) {
    return Array.from({length: (stop - start) / step + 1}, (_, i) => start + (i * step));
}

function zip(a, b) {
    return Array.from(a).map((element, index) => [element, b[index]]);
}

module.exports = {addPrototypes, range, zip};