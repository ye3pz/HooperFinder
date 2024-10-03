


const options = {
	method : 'GET',
    headers : {
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	},

}
const pageviewsCount = document.getElementById('pageviews-count');
const visitsCount = document.getElementById('visits-count');
const teamPageviewsCount = document.getElementById('team-pageviews-count');
const teamVisitsCount = document.getElementById('team-visits-count');
const gamePageviewsCount = document.getElementById('game-pageviews-count');
const gameVisitsCount = document.getElementById('game-visits-count');
// gettting views and visits on each pahe and putting them as variables


 const iD = document.getElementById('navPlayer')
 const teamID = document.getElementById('navTeam')
 const gameID = document.getElementById('navGame')

 var path = window.location.pathname;
var page = path.split("/").pop();
//getting page name

 
    if(page == "hoops.html"){ 
     if (sessionStorage.getItem('visit') === null) {
  // New visit and pageview
      updateCounter('type=visit-pageview');
} else {
  // Pageview
  updateCounter('type=pageview');
}
    }
    if(page == "Teams.html"){ 
    if (sessionStorage.getItem('visit') === null) {
 // New visit and pageview
     updateCounter('type=team-visit-pageview');
} else {
 // Pageview
 updateCounter('type=team-pageview');
}
    }
  if(page == "Games.html")
    if (sessionStorage.getItem('visit') === null) {
 // New visit and pageview
     updateCounter('type=game-visit-pageview');
} else {
 // Pageview
 updateCounter('type=game-pageview');
}



 
function updateCounter(type) {

  fetch('http://127.0.0.1:8080?'+ type) // Dynamic request with URL parameter 
  // will be accessed thorugh req.query.type
    .then(res => res.json())
    .then(data => {
      pageviewsCount.textContent = data.pageviews; // Display pageviews to user
      visitsCount.textContent = data.visits; // Display visits to user
      //text content currently not displayed 
    })

}





sessionStorage.setItem('visit', 'x');
// 'visit' item persists in storage for the remainder of the user session

