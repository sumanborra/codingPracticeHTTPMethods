const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const dbPath = path.join(__dirname, 'cricketTeam.db')

const app = express()
app.use(express.json())
let db = null
const initilizingDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, function () {
      console.log('Server Running at http://localhost:3000/players/')
    })
  } catch (e) {
    console.log(`Server error ${e.message}`)
    process.exit(1)
  }
}
initilizingDatabase() 
app.get('/players/', async (request, response) => {
  const query = `SELECT * FROM cricket_team`
  const playersData = await db.all(query)
  response.send(playersData)
})
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const query = `INSERT INTO cricket_team(player_name,jersey_number,role)
  VALUES('${playerName}','${jerseyNumber}','${role}');`
  const dbResponse = await db.run(query)
  response.send('Player Added to Team')
  //const playerId = dbResponse.lastID
  //response.send({playerId: playerId})
})
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const query = `SELECT * FROM cricket_team WHERE player_id = ${playerId}`
  const playerDetails = await db.get(query)
  response.send(playerDetails)
})
app.put('/players/:playerId/', async (request, response) => {
  const playerId = request.params
  const details = request.body
  const {playerName, jerseyNumber, role} = details
  console.log(playerId)
  console.log(playerName)
  const query = `UPDATE
      cricket_team
    SET
    player_name='${playerName}',
    jersey_number =${jerseyNumber},
    role = '${role}'
     WHERE player_id=${playerId};`
  await db.run(query)
  response.send('Player Details Updated')
})
