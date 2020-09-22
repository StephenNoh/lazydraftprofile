//declare some variables to shortcut later

const submitButton = document.getElementById("submitButton")
const profile = document.getElementById("profile")
const defense = document.getElementById("defense")
const shooting = document.getElementById("shooting")
const ballhandling = document.getElementById("ballhandling")
const passing = document.getElementById("passing")
const rebounding = document.getElementById("rebounding")
const backButton = document.getElementById("back-button")



//event listeners for buttons
submitButton.addEventListener("click", fillProfile)
backButton.addEventListener("click", goBack)


//make the go back button work
function goBack () {
  document.getElementById("start-form").classList.remove("hide")
  document.getElementById("profile").classList.add("hide")
  document.getElementById("banner").innerText = "Find NBA Comps"
}

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

//comparePositions function

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
  if (getPositions() == "guard") {
    document.getElementById("comps").innerText = (generatePercentileComps(guard_JSON))
  }
  if (getPositions() == "wing") {
    document.getElementById("comps").innerText = (generatePercentileComps(wing_JSON))
  }
  if (getPositions() == "big") {
    document.getElementById("comps").innerText = (generatePercentileComps(big_JSON))
  }
  
  document.getElementById("pick-range").innerText = pickRange()
  
}

//comps
//percentile comp profile -- we will use this for the new comps algorithm
let percentileProfile = {
  name: "", 
}


 function setProfile () {
  percentileProfile.passing = (document.getElementById("passing-slider").value)
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
  let range = 0;
  let values = [parseInt(document.getElementById("passing-slider").value), parseInt(document.getElementById("shooting-slider").value), parseInt(document.getElementById("defense-slider").value), parseInt(document.getElementById("rebounding-slider").value), parseInt(document.getElementById("scoring-slider").value)]
  for (let i = 0; i < values.length; i++) {
    if (values[i] > 85) {
      range += values[i]*1.75
    }
    else {
      range += values[i]
    }
  }
  if (range > 430) {
    return "Top five."
  }
  if (range > 360 && range < 431) {
    return "Lottery pick."
  }
  if (range > 280 && range < 361) {
    return "Late first round."
  }
  if (range > 200 && range < 281) {
    return "Second round."
  }
  if (range > 150 && range < 201) {
    return "Overseas."
  }
  if (range >= 0 && range < 151) {
    return "Undrafted."
  }

}

//function to generate a composite score between user (userObject) and any player (playerObject) in the json array


//adds a weight to each characteristic 
function characteristicGap (userProp, playerProp) {
  //adds a coefficient weight so that if difference is huge (more than 1/3 of a bar), adds more to composite score and comparison ranking drops
  if (Math.abs(parseFloat(userProp)-parseFloat(playerProp)*100) > 17) {
    return 3*Math.abs(parseFloat(userProp)-parseFloat(playerProp)*100)
  }
  else {
  //returns a non-weighted value if there's not much of a gap
    return Math.abs(parseFloat(userProp)-parseFloat(playerProp)*100)
  }
}

//calculates composite score
function generateCompositeScore (userObject, playerObject) {
  return (
    characteristicGap(userObject.passing, playerObject.assist_Percentile) +
    characteristicGap(userObject.shooting, playerObject.three_Percentile) +
    characteristicGap(userObject.scoring, playerObject.points_Percentile) +
    characteristicGap(userObject.rebounding, playerObject.rebounding_Percentile) +
    characteristicGap(userObject.defense, playerObject.defense_Percentile) 
  )
}

//let's add the composite score as a property to each player in our json
function addCompositeScoreProperty (player) {
  player.compositeScore = generateCompositeScore(percentileProfile, player)
}


//now let's apply the functions to the jsons (either guard_JSON, wing_JSON, or big_JSON, depending on what our user selects), sort the jsons (ascending) by composite score value, and return the top 10 closest comps
function generatePercentileComps (positional_JSON) {
  positional_JSON.forEach(player => addCompositeScoreProperty(player))
  positional_JSON.sort((a, b) => parseFloat(a.compositeScore) - parseFloat(b.compositeScore));
  //we can change slice here to return as many results as we want
  return positional_JSON.slice(0,10).map(a =>a.Player).join(", ")
}