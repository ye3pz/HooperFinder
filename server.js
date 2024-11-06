require("dotenv").config();
const express = require('express');
/*using express framework to manage back end server
creating a new instance (running copy) of the express framework
 */
const path = require('path');
/*
path is Node.js native utility module.
require is Node.js global function that allows you to extract contents from module.exports object inside some file.
*/
const port = 8080;
//port number that server is listening on//
const cors = require('cors');
//enabling cors to conect backend and frontend//
var Sqrl = require("squirrelly")
//squirrelly library used for templates
const app = express();
const fs = require('fs');
// The Node.js file system module allows you to work with the file system on your computer. To include the File System module
const MarkovChain = require('simple-markov-chain');
const { stringify } = require('querystring');
const { ERROR } = require("sqlite3");
//NPM package to easily create and use Markov chains 
const chain = new MarkovChain()


const sqlite3 = require('sqlite3').verbose()
// verbose provides additional details as to what the computer is doing and what drivers and software it is loading during startup 
let sql;

const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {if (err) return console.error(err.message);});
module.exports = db;
// creating database amd connecting it

//sql = `CREATE TABLE players(id,first_name,last_name,height,weight)`
//db.run(sql);

//Drop Table
//db.run(`DROP TABLE players`);

//

/*nsert Data 

sql =  `INSERT INTO players(id,first_name,last_name,height,weight) VALUES(?,?,?,?,?)`;
db.run(sql, [23,"lebron","james","6'9","260"], (err)=>{
  if(err) console.error(err.message)
})
  */

/*Delete Data
sql =  `DELETE FROM  users WHERE weight=?`;
db.run(sql, ["260"], (err)=>{
  if(err) console.error(err.message)
})
*/

 /* sql = `SELECT first_name,last_name,weight,height FROM players WHERE first_name LIKE ? AND last_name LIKE ?`
var a = "Kevin"
var o = "Durant"
var m = [a,o ]
db.all(sql, m, (err,data) => {
  if(err){ 
    reject (err)
 }
 else{
  console.log(data)
 }


})
*/

  
app.use(express.urlencoded({ extended: true}))

app.set("view engine", "squirrelly")
app.set("views", "views")
// key value pair
app.use(cors());
app.use(express.static('public'))
app.use('/player_images' ,express.static('player_images'))
app.use(express.static(path.join(__dirname + '/public/exStyles')))
app.use(express.static(path.join(__dirname + '/publlic/BBScript')))
app.get('', function (req, res, next) {
   /*
   Middleware functions are functions that have access 
   to the request object (req), the response object (res), 
   and the next function in the application’s request-response cycle.
   requests passes through this function
   */
  res.sendFile(__dirname + '/public/hoops.html')
  if (req.url === '/favicon.ico') {
    res.end();
} 



// Ends request for favicon without counting

const json = fs.readFileSync('count.json', 'utf-8');
const obj = JSON.parse(json);
// Reads count.json and converts to JS object
if (req.query.type == 'pageview') { 
obj.pageviews = obj.pageviews+1;
}
if (req.query.type == 'team-pageview') { 
  obj.teamPageViews = obj.teamPageViews+1;
  }
  if (req.query.type == 'game-pageview') { 
    obj.gamePageViews = obj.gamePageViews+1;
    }
  if (req.query.type === 'visit-pageview') {
    obj.visits = obj.visits+1;
    obj.pageviews = obj.pageviews+1;
}
if (req.query.type === 'team-visit-pageview') {
  obj.teamVisits = obj.teamVisits+1;
  obj.teamPageViews = obj.teamPageViews+1;
}
if (req.query.type === 'game-visit-pageview') {
  obj.gameVisits = obj.gameVisits+1;
  obj.gamePageViews = obj.gamePageViews+1;
}
// Updates pageviews and visits (conditional upon URL param value)

const newJSON = JSON.stringify(obj);
// Converts result to JSON

fs.writeFileSync('count.json', newJSON);
// Writes result to file 

var totalviews = obj.pageviews + obj.teamPageViews + obj.gamePageViews
var playerPageCount = obj.pageviews/totalviews
var teamPageCount = obj.teamPageViews/totalviews
var gamePageCount = obj.gamePageViews/totalviews

const chain = new MarkovChain()
// creating a markov chain
chain.addTransition(playerPageCount, teamPageCount) // Transition from state 'a' to state 'b'
chain.addTransition(playerPageCount, gamePageCount) // Transition from state 'a' to state 'c'
chain.addTransition(playerPageCount, playerPageCount)
chain.addTransition(teamPageCount, playerPageCount)
chain.addTransition(teamPageCount, gamePageCount)
chain.addTransition(teamPageCount, teamPageCount)
chain.addTransition(gamePageCount, playerPageCount)
chain.addTransition(gamePageCount, teamPageCount)
chain.addTransition(gamePageCount, gamePageCount)


chain.generateState(playerPageCount) // 50% chance to return 'b', 50% chance to return 'c'
chain.generateState() // Will take last generated state as base state => either 'b' or 'c' => will return 'a'
chain.generateState() // Last generated state was 'a' => 50% chance for 'b', 50% chance for 'c'




})

//sends suggested names for searchbar that match names in the database
app.get('/get_data', function(request, response, next){
  
  var search_query = request.query.search_query;

  if (search_query.indexOf(" ") > 0) { 
    var index = search_query.indexOf(" ") 
    var first = search_query.slice(0, index); // Gets the first name
    var last = search_query.slice(index + 1);  // Gets the last name

    var sql = `
    SELECT first_name,last_name FROM players
    WHERE first_name LIKE '${first}%'
    AND last_name LIKE '${last}%'
    LIMIT 10
    `;
    }
    else { 
  var sql = `
  SELECT first_name,last_name FROM players
  WHERE first_name LIKE '%${search_query}%' 
  LIMIT 10
  `;
    }

  db.all(sql, function(error, data){
    //all vallues thar match query
    console.log(response.json.data)
    console.log(data)
    return response.json(data);
  });

});


async function logPlayer(input) {
  var lastName;
  var firstName = input;
  var fullName = firstName;
  if (input.indexOf(" ") > 0) { 
    //if theres a space in input, split it into two parts  
    console.log("split happened")
    var splitName = input.split(" ");
    firstName = splitName[0];
    lastName =splitName[1];
    fullName = firstName + " " + lastName ;
    }
    // handles if the user puts the players first name and lastname

  var players = []
  // initialize an array of players
  console.log("Promise starts")
  return new Promise((resolve, reject) => {
    //making databse call asynchonous
    if(fullName != firstName){
      sql = `SELECT first_name,last_name,weight,height FROM players WHERE CONCAT(first_name,last_name) LIKE ?`
      fullName =  firstName + lastName
      }
    else {
          sql = `SELECT first_name,last_name,weight,height FROM players WHERE first_name LIKE ?`
          console.log("else sql --->");
          fullName = input
          console.log("First Name ---> " + fullName)
        }
    db.all(sql, [fullName], (err,data) => {
        if(err){ 
          reject (err)
      }
        
    console.log("db length --> " + data.length)
    if(data.length> 0) {
      console.log("Got data from DB")
      for (var player in data) {  
        console.log("for loop ")
        players.push((data[player]))
            }
      console.log("Player array in if =" + players)
      resolve(players)
          } 
    else {
      console.log("else")
      resolve(apiCall(input))
    }
    console.log("after else --->")
  })
    console.log("after DB.all")
  } 
  ) 

}


async function apiCall(input) {
  console.log("API call happened")
  var headers = {
  Authorization: process.env.BBALL_API_KEY
  // API KEY//
    };
  const options = {
  method: 'GET',

  headers : headers
  }

  var lastName;
  console.log(input)
  playerName = input.toLowerCase()
  var fullName = playerName;
  if (playerName.indexOf(" ") > 0) {   
    console.log("split happened")
    var splitName = playerName.split(" ");
    playerName = splitName[0];
    lastName =splitName[1];
    fullName = playerName + " " + lastName ;
    }
    
    
  
 const apiUrl = "https://api.balldontlie.io/v1/players?search=" + playerName;
 //API with query parameter attached to the end
 var players = []
 
  if(!process.env.BBALL_API_KEY){
    throw new ERROR("NO API_key entered")
  }
 const response = await fetch(apiUrl,options)
 const json =  await response.json();

 for (var player in json.data)   { 
    // json data is in form of array so we loop through the array
    if(fullName != playerName & lastName == json.data[player].last_name){
      //in case iser inputs first and last name to look for a specific person
      console.log(json.data[player])
      sql =  `INSERT INTO players(id,first_name,last_name,height,weight) VALUES(?,?,?,?,?)`;
      db.run(sql, [json.data[player].id,json.data[player].first_name ,
        json.data[player].last_name,json.data[player].height,json.data[player].weight], (err)=>{
          if (err){
            console.log(err.message)
          }
        }) 
        // caching data into database
    return (json.data[player].id,json.data[player].first_name ,
    json.data[player].last_name,json.data[player].height,json.data[player].weight)
    
    }
  
    else { 
      sql =  `INSERT INTO players(id,first_name,last_name,height,weight) VALUES(?,?,?,?,?)`;
      db.all(sql, [json.data[player].id,json.data[player].first_name ,
        json.data[player].last_name,json.data[player].height,json.data[player].weight], (err)=>{
          if (err){
            console.log(err.message)
        }
  
      }) 
    // caching data into database
 // return (json.data)
  //returning json data with multiple players
}
}
return (json.data)
}







app.post('/api/search', async (req, res) => {
  const playerInput = req.body.playerInput;
  // searchbar request input 
  console.log("app.post input ----> " +playerInput)
  if(playerInput === 'undefined'){
    // The parameter is missing, example response...
    return "enter name";
  }
  var playerName = playerInput;
  playerName = playerName.trim()
// getting input from html search bar input and assigning a variable to it. Also trimming any whitespace
  
  res.render("player-info",  {data: await logPlayer(playerName) })})
  //rendering data ontp a tempplate
  app.listen(port, () =>{
    console.log(`app is listening on port: ${process.env.PORT}`)
      })

   const local_file = "https://localhost:8080"
   //url local file link since im lazy
   