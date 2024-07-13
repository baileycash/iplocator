# IP Location Identifier for Access Restriction

## Purpose
This single-endpoint API determines whether or not an IP address is located within a whitelisted region. 
The API integrates with MaxMind's Geolocate client library.

## Setup (Local)

1. Install Node.js version 20
2. Run `npm install`
3. Add `config-local.yaml` file to the `config/` folder with MaxMind Geolocate account number and license key.
   ```
     app:
       geoAcct: #yourAccountNumber
       accountKey: #yourKey
   ```
4. Run `npm run build` then `npm run start`

## Requests

### Minimum Request Requirements
The API requires at least an IP address:
'''
{
    "ip": "192.168.1.1",
}
'''
This assumes all regions are allowed.

### Useful Requests
The API takes at least one parameter:
'''
{
    "ip": "192.168.1.1",
    "whiteList": ["CA", "US"]
}
'''

### Notes
Whitelist, if provided, must be a non-empty array:
'''
{
    "ip": "192.168.1.1",
    "whiteList": []
}
'''

### Successful Response Sample
'''
Status code: 202
{
    "country": "US",
    "accessGranted": true,
    "message": "Location allowed",
    "whiteListProvided": true
}
'''

### Failed Response Sample
'''
Status code: 403
{
    "country": "US",
    "accessGranted": false,
    "message": "Location forbidden",
    "whiteListProvided": true
}
'''

## Future Considerations

### IPv6 Support
Currently the API only supports IPv4 addresses. IPv6 addresses are not accepted by the API's basic validation.

### Local Validation of IP Addresses
In the future, advanced, thorough validation of the requested IP address would be handled by the app, rather than Geolocate.

### Containerization
A starter docker file has been created to explore containerization of the api in the future.

### Deployment
A deployment workflow will need to be defined to deploy the app to the Cloud service of choice. 
Secrets have been defined in GitHub that would be mapped using a value map configuration, to be utilized during deployments.

### Geolocate Integration Cost Reduction
To minimize requests to the geolocate client library, a copy of the Postgres database provided by Geolocate may be stored in scope and queries may be made within the app to the database without having to make requests to Geolocate.
The database may be cached by the app, to be updated using a CRON job or by a cache whose contents would be reset after a fixed number of requests or extended downtime.

### Useful Logging
Basic logging by the app indicates a HTTP method, response code (which needs to be fine tuned), and a response time.
Future logging will add more accurate response codes and request IP.
