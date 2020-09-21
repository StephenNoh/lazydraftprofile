//declare some variables to shortcut later

const submitButton = document.getElementById("submitButton")
const profile = document.getElementById("profile")
const defense = document.getElementById("defense")
const shooting = document.getElementById("shooting")
const ballhandling = document.getElementById("ballhandling")
const passing = document.getElementById("passing")
const rebounding = document.getElementById("rebounding")
const backButton = document.getElementById("back-button")
let strengthsArray = []; 
let weaknessesArray = [];


//event listeners for buttons
submitButton.addEventListener("click", fillProfile)
backButton.addEventListener("click", goBack)


//make the go back button work
function goBack () {
  document.getElementById("start-form").classList.remove("hide")
  document.getElementById("profile").classList.add("hide")
  document.getElementById("banner").innerText = "Find NBA Comps"
}

//old json
var json;
$.getJSON("players_with_position.json", function(data) {
  json = data;
});

//new jsons. declare guard, wing, big jsons
let guard_JSON;
$.getJSON("guards_percentiles.json", function(data) {
  guard_JSON = data;
});

let wing_JSON;
$.getJSON("wings_percentiles.json", function(data) {
  wing_JSON = data;
});

let big_JSON;
$.getJSON("bigs_percentiles.json", function(data) {
  big_JSON = data;
});

//old findcomps function

function findComps(profile, tier) {
  players = json.find(a => a["tier"] == tier)["players"]
  return players.filter(function(v, i) {
    positionMatch = comparePositions(v.Pos, profile.positions);
    return (positionMatch && v.shooting == profile.shooting && v.ballhandling == profile.ballhandling && v.defense == profile.defense && v.passing == profile.passing && v.rebounding == profile.rebounding && v.scoring == profile.scoring)
  })
}

function comparePositions(playerPosition, positionList) {
  if (positionList.length > 0) {
    return (new RegExp(positionList.join("|")).test(playerPosition));
  } else {
    return true;
  }
}

//hide the slider bars and bring up the scouting report page
function fillProfile () {
  
//hide the sliders, fill the strenghts and weaknesses divs with text
  document.getElementById("start-form").classList.add("hide")
  document.getElementById("profile").classList.remove("hide")

  document.getElementById("banner").innerText = "DRAFT COMPS: " + document.getElementById("name").value.toUpperCase()
  setProfile()
  document.getElementById("high-comps").innerText = (findComps(myProfile, 1).length > 0) ? findComps(myProfile, 1).map(a => a.Player).join(", ") : "No matching comps."
  document.getElementById("low-comps").innerText = (findComps(myProfile, 2).length > 0) ? findComps(myProfile, 2).map(a => a.Player).join(", ") : "No matching comps."
  document.getElementById("pick-range").innerText = pickRange()
  
}

//comps
let myProfile = {
  name: "", 
}
//percentile comp profile -- we will use this for the new comps algorithm
let percentileProfile = {
  name: "", 
}


 function setProfile () {
  myProfile.passing = (document.getElementById("passing-slider").value > 50)
  myProfile.ballhandling = (document.getElementById("ballhandling-slider").value > 50)
  myProfile.shooting = (document.getElementById("shooting-slider").value > 50)
  myProfile.defense = (document.getElementById("defense-slider").value > 50)
  myProfile.rebounding = (document.getElementById("rebounding-slider").value > 50)
  myProfile.scoring = (document.getElementById("scoring-slider").value > 50)
  myProfile.positions = getPositions()
  percentileProfile.passing = (document.getElementById("passing-slider").value)
  percentileProfile.ballhandling = (document.getElementById("ballhandling-slider").value)
  percentileProfile.shooting = (document.getElementById("shooting-slider").value)
  percentileProfile.defense = (document.getElementById("defense-slider").value)
  percentileProfile.rebounding = (document.getElementById("rebounding-slider").value)
  percentileProfile.scoring = (document.getElementById("scoring-slider").value)
  percentileProfile.positions = getPositions()
}



function getPositions() {
  $selectedPositions = $("#position-select").find("input:checked");
  if ($selectedPositions.length > 0) {
    return $selectedPositions.map(function(idx, element) {
      return $(element).val();
    }).get();
  } else {
    return [];
  }
}


//pick range

function pickRange () {
  let range = parseInt(document.getElementById("passing-slider").value) + parseInt(document.getElementById("ballhandling-slider").value) + parseInt(document.getElementById("shooting-slider").value) + parseInt(document.getElementById("defense-slider").value) + parseInt(document.getElementById("rebounding-slider").value) + parseInt(document.getElementById("scoring-slider").value)
  if (range > 550 && range < 710) {
    return "Top five."
  }
  if (range > 500 && range < 560) {
    return "Lottery pick."
  }
  if (range > 420 && range < 501) {
    return "Late first round."
  }
  if (range > 350 && range < 421) {
    return "Second round."
  }
  if (range > 250 && range < 351) {
    return "Overseas."
  }
  if (range >= 0 && range < 251) {
    return "Undrafted."
  }

}

//function to generate a composite score between user (userObject) and any player (playerObject) in the json array
function generateCompositeScore (userObject, playerObject) {
  return (
    Math.abs(parseFloat(userObject.passing)-parseFloat(playerObject.assist_Percentile)*100) +
    Math.abs(parseFloat(userObject.ballhandling)-parseFloat(playerObject.turnover_Percentile)*100) +
    Math.abs(parseFloat(userObject.shooting)-parseFloat(playerObject.three_Percentile)*100) +
    Math.abs(parseFloat(userObject.scoring)-parseFloat(playerObject.points_Percentile)*100) +
    Math.abs(parseFloat(userObject.rebounding)-parseFloat(playerObject.rebounding_Percentile)*100) +
    Math.abs(parseFloat(userObject.defense)-parseFloat(playerObject.defense_Percentile)*100)
  );
}

//let's add the composite score as a property in our json
function addCompositeScoreProperty (player) {
  player.compositeScore = generateCompositeScore(percentileProfile, player)
}


//now let's apply the functions to the jsons, sort the jsons by the composite score value, and return the names of the three players with the lowest player score (TODO)
