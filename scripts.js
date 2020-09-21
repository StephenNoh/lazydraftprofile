//declare some variables to shortcut later

const submitButton = document.getElementById("submitButton")
const profile = document.getElementById("profile")
const defense = document.getElementById("defense")
const shooting = document.getElementById("shooting")
const ballhandling = document.getElementById("ballhandling")
const passing = document.getElementById("passing")
const rebounding = document.getElementById("rebounding")
const strengths = document.getElementById("strengths")
const weaknesses = document.getElementById("weaknesses")
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
  document.getElementById("banner").innerText = "Create your NBA draft profile"
  strengthsArray = []
  weaknessesArray = []
  strengths.innerText = "None."
  weaknesses.innerText = "None."
}

var json;
$.getJSON("players_with_position.json", function(data) {
  json = data;
});

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

  document.getElementById("banner").innerText = "DRAFT PROFILE: " + document.getElementById("name").value.toUpperCase()
  setProfile()
  document.getElementById("high-comps").innerText = (findComps(myProfile, 1).length > 0) ? findComps(myProfile, 1).map(a => a.Player).join(", ") : "No matching comps."
  document.getElementById("low-comps").innerText = (findComps(myProfile, 2).length > 0) ? findComps(myProfile, 2).map(a => a.Player).join(", ") : "No matching comps."
  document.getElementById("pick-range").innerText = pickRange()
  
}

//comps
let myProfile = {
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