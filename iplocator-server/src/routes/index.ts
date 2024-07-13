import { Request, Response, Router } from "express";
import geo from "../lib/geo";

const router = Router();

router.get("/", async function (req: Request, res: Response) {
  const { ip: reqIp, whiteList } = req.body;
  let ip = "";

  try {
    const ipArr = reqIp.split(".");
    if (ipArr?.length === 4) {
      ip = `${reqIp.split(".")[0]}.1.1.1`;
    } else {
      res.status(400);
      res.send({
        message: "IP address is invalid",
      });
    }
  } catch (e) {
    res.status(500);
    res.send({
      message: "Error parsing IP address",
    });
  }

  if (!ip) {
    res.status(400);
    res.send({
      message: "IP address [ip] not provided",
    });
  }

  if (!Array.isArray(whiteList) || req.body?.whiteList?.length < 1) {
    res.status(400);
    res.send({
      message: "Whitelist [whiteList], if provided, must be a non-empty array",
    });
  }

  try {
    await geo(ip)
      .then((geoRes: any) => {
        if (geoRes.error) {
          res.status(500);
          res.send(geoRes.error);
        }
        let resBody: any = {
          country: geoRes.country.isoCode,
        };
        if (!whiteList) {
          res.status(202);
          res.send({
            ...resBody,
            message: "Location allowed",
            accessGranted: true,
            whiteListProvided: false,
          });
        }
        if (whiteList.includes(geoRes.country.isoCode)) {
          res.status(202);
          res.send({
            country: geoRes.country.isoCode,
            message: "Location allowed",
            accessGranted: true,
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
        res.send(e);
      });
  } catch (e) {
    res.status(500);
    res.send("Internal Server Error");
  }
});

module.exports = router;
