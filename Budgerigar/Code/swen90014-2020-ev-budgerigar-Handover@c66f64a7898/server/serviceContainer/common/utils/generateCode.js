const MAX = 999999;
const MIN = 100000;

module.exports = function() {
    return Math.floor(Math.random() * (MAX - MIN + 1) + MIN);
} 