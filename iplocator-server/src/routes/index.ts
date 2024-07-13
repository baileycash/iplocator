import { Request, Response, Router } from "express";
import geo from "../lib/geo";
import logger from "../lib/logger";

const router = Router();

router.get("/", async function (req: Request, res: Response) {
  const { ip: reqIp, whiteList } = req.body;
  let ip = "";

  logger(`Incoming request: ${req.body}`);

  try {
    const ipArr = reqIp.split(".");
    if (ipArr?.length === 4) {
      ip = `${reqIp.split(".")[0]}.1.1.1`;
    } else {
      res.status(400);
      res.send({
        error: "IP address is invalid",
      });
    }
  } catch (e) {
    res.status(500);
    res.send({
      error: "Error parsing IP address",
    });
  }

  if (!ip) {
    res.status(400);
    res.send({
      error: "IP address [ip] not provided",
    });
  }

  if (!Array.isArray(whiteList) || req.body?.whiteList?.length < 1) {
    res.status(400);
    res.send({
      error: "Whitelist [whiteList], if provided, must be a non-empty array",
    });
  }

  try {
    await geo(ip)
      .then((geoRes: any) => {
        let resBody: any = {
          country: geoRes.country.isoCode,
        };
        if (!whiteList) {
          res.status(202);
          res.send({
            ...resBody,
            accessGranted: true,
            message: "Location allowed",
            whiteListProvided: false,
          });
        }
        if (whiteList.includes(geoRes.country.isoCode)) {
          res.status(202);
          res.send({
            country: geoRes.country.isoCode,
            accessGranted: true,
            message: "Location allowed",
            whiteListProvided: true,
          });
        } else if (!whiteList.includes(geoRes.country.isoCode)) {
          res.status(403);
          res.send({
            country: geoRes.country.isoCode,
            accessGranted: false,
            message: "Location forbidden",
            whiteListProvided: true,
          });
        }
        res.status(500);
        res.send({
          country: geoRes.country.isoCode,
          message: "Could not determine authorization",
          accessGranted: false,
          whiteListProvided: false,
        });
      })
      .catch((e: any) => {
        res.status(500);
        if (e.error) {
          if (e.code?.includes("INVALID")) res.status(400);
          else res.status(500);
          res.send({ error: e.code });
        } else {
          logger("error", e);
        }
      });
  } catch (e) {
    res.status(500);
    res.send("Internal Server Error");
  }
});

module.exports = router;
