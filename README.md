# RobloxServerGrabber
A proof of concept ExpressJS app that grabs Roblox server IP addresses.

## Installation
Download the zipped folder through GitHub, then extract it.

After that, `cd` to the directory and run the following command to install the dependencies needed:
```bash
npm install
```

## Usage
Getting the server up and running is an extremely simple process.

First, create a file named `.env` and place the following into it:
```
NODE_ENV=production
PORT=8000
ROBLOX_COOKIE=YOUR-COOKIE-HERE
```

Replace 'YOUR-COOKIE-HERE' with the Roblox authentication cookie used for the bot. It is recommended to make an alt account for this. Make sure to create the account on the same IP address as the server, see [here](https://devforum.roblox.com/t/ip-changes-invalidate-cookie/1700515).

After that, run the `index.js` file.

To use the bot, send a `GET` request to `server:port/getip` with the URL query parameters 'placeId' and 'limit' (limit is optional).

Example Usages:

`localhost:8000/getip?placeId=1818`

`localhost:8000/getip?placeId=1818&limit=2`

```bash
node index.js
```

If you would like to use a custom cookie, then send the `Authorization` header along with the request. Cookies will get validated.

Example Usage:
```
GET /getip?placeId=1818 HTTP/1.1
Authorization: YOUR-COOKIE-HERE
Host: localhost
```

Example Response:
```json
{
    "servers": [{
        "ip": "ip.v4.add.res",
        "port": 58908,
        "ping": 42,
        "playing": 6,
        "maxPlayers": 8,
        "gameId": "uuid-here"
    }],
    "thumbnailUrl": "https://tr.rbxcdn.com/b717c50234c3d91b0be7dbfc9c588ed4/512/512/Image/Png"
}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)
