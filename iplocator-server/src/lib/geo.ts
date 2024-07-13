import { WebServiceClient } from "@maxmind/geoip2-node";
import config from "./nconf";

const client = new WebServiceClient(
  config.get("app:geoAcct"),
  config.get("app:accountKey"),
  { host: "geolite.info" }
);

export default async (ip: string) => {
  return client.country(ip);
};
