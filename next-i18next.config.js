const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "ar",
    locales: ["ar", "en"],
    localeDetection: false,
    localePath: path.resolve("./public/locales"),
  },
};
