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
  
//hide the sliders, generate comps 
  if (getPosition() == "") {
    $('.alert-primary').removeClass("d-none");
  } 
  else {
    $(".alert-primary").addClass("d-none");
    document.getElementById("start-form").classList.add("hide")
    document.getElementById("profile").classList.remove("hide")

    document.getElementById("banner").innerText = "DRAFT COMPS: " + document.getElementById("name").value.toUpperCase()
    setProfile()
    if (getPosition() == "guard") {
      generatePercentileComps(guard_JSON)
      
    } else if (getPosition() == "wing") {
      generatePercentileComps(wing_JSON)
    
    } else if (getPosition() == "big") {
      generatePercentileComps(big_JSON)
     
    }

    document.getElementById("pick-range").innerText = pickRange()
  }
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
  percentileProfile.positions = getPosition()
}



function getPosition() {
  $selectedPosition = $("#position-select input[type='radio'][name='position-select']:checked");

  if ($selectedPosition.length > 0) {
    return $selectedPosition.val();
  } else {
    return "";
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
  if (range > 450) {
    return "Top five."
  }
  if (range > 400 && range < 451) {
    return "Lottery pick."
  }
  if (range > 330 && range < 401) {
    return "Late first round."
  }
  if (range > 200 && range < 331) {
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
  //sort by composite score
  positional_JSON.sort((a, b) => parseFloat(a.compositeScore) - parseFloat(b.compositeScore));
  fillTable(positional_JSON)
}

//fills the results table 
function fillTable(positional_JSON) {
  // fill first row of table (info inputted on sliders)
  document.getElementById("defense0").innerText = percentileProfile.defense
  document.getElementById("shooting0").innerText = percentileProfile.shooting
  document.getElementById("passing0").innerText = percentileProfile.passing
  document.getElementById("rebounding0").innerText = percentileProfile.rebounding
  document.getElementById("scoring0").innerText = percentileProfile.scoring
  // fill the comp rows for the table
  for (let i = 0; i < 10; i++) {
    //if we want to display results as percentiles
    // document.getElementById(`name${[i+1]}`).innerText = positional_JSON[i].Player
    // document.getElementById(`defense${[i+1]}`).innerText = Math.round(positional_JSON[i].defense_Percentile*100)
    // document.getElementById(`shooting${[i+1]}`).innerText = Math.round(positional_JSON[i].three_Percentile*100)
    // document.getElementById(`passing${[i+1]}`).innerText = Math.round(positional_JSON[i].assist_Percentile*100)
    // document.getElementById(`rebounding${[i+1]}`).innerText = Math.round(positional_JSON[i].rebounding_Percentile*100)
    // document.getElementById(`scoring${[i+1]}`).innerText = Math.round(positional_JSON[i].points_Percentile*100)
    
    //if we want to display results as per 36 stats
    document.getElementById(`name${[i+1]}`).innerText = positional_JSON[i].Player
    document.getElementById(`defense${[i+1]}`).innerText = positional_JSON[i].dbpm
    background(positional_JSON[i].defense_Percentile*100, document.getElementById(`defense${[i+1]}`))
    
    document.getElementById(`shooting${[i+1]}`).innerText = Math.round(positional_JSON[i].three_Percentage*100) + "%"
    background(positional_JSON[i].three_Percentile*100, document.getElementById(`shooting${[i+1]}`))
    
    document.getElementById(`passing${[i+1]}`).innerText = positional_JSON[i].ast_Per36
    background(positional_JSON[i].assist_Percentile*100, document.getElementById(`passing${[i+1]}`))
    
    document.getElementById(`rebounding${[i+1]}`).innerText = positional_JSON[i].reb_Per36
    background(positional_JSON[i].rebounding_Percentile*100, document.getElementById(`rebounding${[i+1]}`))
    
    document.getElementById(`scoring${[i+1]}`).innerText = positional_JSON[i].pts_Per36
    background(positional_JSON[i].points_Percentile*100, document.getElementById(`scoring${[i+1]}`))

    document.getElementById(`similarity${[i+1]}`).innerText = Math.round(((500-positional_JSON[i].compositeScore)/500)*100)
    background(((500-positional_JSON[i].compositeScore)/500)*100, document.getElementById(`similarity${[i+1]}`))
  }
}


//add background color to show percentile
function background(value, css) {
  if (value < 10) {
    $(css).addClass("tenth");
  }
  if (value > 9 && value <20) {
    $(css).addClass("twentieth");
  }
  if (value > 19 && value <30) {
    $(css).addClass("thirtieth");
  }
  if (value > 29 && value <40) {
    $(css).addClass("fortieth");
  }
  if (value > 39 && value <50) {
    $(css).addClass("fiftieth");
  }
  if (value > 49 && value <60) {
    $(css).addClass("sixtieth");
  }
  if (value > 59 && value <70) {
    $(css).addClass("seventieth");
  }
  if (value > 69 && value <80) {
    $(css).addClass("eightieth");
  }
  if (value > 79 && value <90) {
    $(css).addClass("ninetieth");
  }
  if (value > 89 && value <101) {
    $(css).addClass("hundredth");
  }
}