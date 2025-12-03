// Here we have a simple config module that exports one variable called JWT_SECRET.
// If process.env.JWT_SECRET has a value, this value is what will be exported.
// If not, then the hard-coded string "SUPER SECRET KEY" will be used instead.

const { JWT_SECRET = "SUPER SECRET KEY" } = process.env;

module.exports = { JWT_SECRET };
