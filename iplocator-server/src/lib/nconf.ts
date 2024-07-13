const nconf = require("nconf");

nconf.env("__").file({
  file: "src/config/config-local.yaml",
  format: require("nconf-yaml"),
});

export default nconf;
