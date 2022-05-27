// made by recanman
const express = require("express")
const axios = require("axios")
require("dotenv").config()

const app = express()
app.disable("x-powered-by")

function formatCookie(cookie) {
  return `.ROBLOSECURITY=${cookie}; path=/; domain=.roblox.com;`
}

async function getThumbnail(placeId) {
  const res = await axios.get(`https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${placeId}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`).catch(err => {})
  const data = res.data.data

  if (data[0] == undefined) {return}
  if (data[0].state != "Completed") {return}
  return data[0].imageUrl
}

async function getServerInfo(placeId, server, customCookie) {
  const res = await axios.post("https://gamejoin.roblox.com/v1/join-game-instance", {placeId: placeId, isTeleport: false, gameId: server.id, gameJoinAttemptId: server.id}, {
    headers: {
      Referer: `https://www.roblox.com/games/${placeId}/`,
      Origin: "https://roblox.com",
      Cookie: formatCookie(customCookie || process.env.ROBLOX_COOKIE),
      "User-Agent": "Roblox/WinInet"
    }
  }).catch(err => {})

  data = res.data
  if (data.jobId == null || data.joinScript == null) {return}

  return {
    ip: data.joinScript.MachineAddress,
    port: data.joinScript.ServerPort,
    ping: server.ping,
    playing: server.playing,
    maxPlayers: server.maxPlayers,
    gameId: server.id
  }
}

const limits = [10, 25, 50, 100]

function getRealLimit(limit) {
  limits.reduce((prev, curr) => {
    return (Math.abs(curr - limit) < Math.abs(prev - limit) ? curr : prev)
  })
}

app.get("/getip", async (req, res) => {
  var {placeId, limit} = req.query
  placeId = parseInt(placeId)

  if (isNaN(placeId) == true) {return res.status(400).send("Invalid placeid.")}
  var passedLimit = limit

  if (limit != undefined) {
    limit = parseInt(limit)
    if (isNaN(limit) == true) {return res.status(400).send("Invalid limit.")}

    limit = getRealLimit(limit)
  } else {
    limit = 10
    passedLimit = limit
  }

  const customCookie = req.headers.authorization

  if (customCookie != undefined) {
    var valid = true

    const data = await axios.get("https://www.roblox.com/mobileapi/userinfo", {headers: {
      Cookie: formatCookie(customCookie)
    }}).catch(err => {})

    valid = typeof(data.data) == "object"

    if (valid == false) {
      return res.status(400).send("Invalid cookie.")
    }
  }

  var response = {
    servers: [],
    thumbnailUrl: null
  }

  response.thumbnailUrl = await getThumbnail(placeId)

  var servers = await axios.get(`https://games.roblox.com/v1/games/${placeId}/servers/Public?sortOrder=Asc&limit=${limit}`).catch(err => {return res.status(500).send("Failed to get servers.")})
  servers = servers.data

  if (servers.data == undefined || servers.errors != undefined) {return res.status(500).send("Failed to get servers.")}

  var index = 0
  for (const server of servers.data) {
    if (index >= passedLimit) {break}
    index += 1

    const data = await getServerInfo(placeId, server, customCookie)
    response.servers.push(data)
  }

  res.json(response)
})

app.listen(process.env.PORT, () => {
  console.log("Server is ready.")
})
