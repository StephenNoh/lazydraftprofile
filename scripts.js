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
  removeBackground()
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

    document.getElementById("banner").innerText = "TOP 10 NBA COMPS: " + document.getElementById("name").value.toUpperCase()
    setProfile()
    if (getPosition() == "guard") {
      generatePercentileComps(guard_JSON)
      
    } else if (getPosition() == "wing") {
      generatePercentileComps(wing_JSON)
    
    } else if (getPosition() == "big") {
      generatePercentileComps(big_JSON)
     
    }

    // document.getElementById("pick-range").innerText = pickRange()
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


//pick range (taking out for now, too buggy)

// function pickRange () {
//   let range = 0;
//   let values = [parseInt(document.getElementById("passing-slider").value), parseInt(document.getElementById("shooting-slider").value), parseInt(document.getElementById("defense-slider").value), parseInt(document.getElementById("rebounding-slider").value), parseInt(document.getElementById("scoring-slider").value)]
//   for (let i = 0; i < values.length; i++) {
//     if (values[i] > 85) {
//       range += values[i]*1.75
//     }
//     else {
//       range += values[i]
//     }
//   }
//   if (range > 450) {
//     return "Top five."
//   }
//   if (range > 400 && range < 451) {
//     return "Lottery pick."
//   }
//   if (range > 330 && range < 401) {
//     return "Late first round."
//   }
//   if (range > 200 && range < 331) {
//     return "Second round."
//   }
//   if (range > 150 && range < 201) {
//     return "Overseas."
//   }
//   if (range >= 0 && range < 151) {
//     return "Undrafted."
//   }

// }

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
  projectStats(positional_JSON)
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


//reset classes in table when the back button is hit
function removeBackground () {
  $('.tenth').removeClass('tenth');
  $('.twentieth').removeClass('twentieth');
  $('.thirtieth').removeClass('thirtieth');
  $('.fortieth').removeClass('fortieth');
  $('.fiftieth').removeClass('fiftieth');
  $('.sixtieth').removeClass('sixtieth');
  $('.seventieth').removeClass('seventieth');
  $('.eightieth').removeClass('eightieth');
  $('.ninetieth').removeClass('ninetieth');
  $('.hundredth').removeClass('hundredth');
}

// project stats for user 
function projectStats (positional_JSON) {
  //find a player in our JSON that is within 3% of the value that our user submitted, then convert that percentage into dbpm/assist per 36/rebounds per 36, etc.
  document.getElementById("defense11").innerText = positional_JSON.find(player => Math.abs(player.defense_Percentile*100 - document.getElementById("defense-slider").value) < 3).dbpm
  document.getElementById("passing11").innerText = positional_JSON.find(player => Math.abs(player.assist_Percentile*100 - document.getElementById("passing-slider").value) < 3).ast_Per36
  document.getElementById("name11").innerText = document.getElementById("name").value + " projections"
  //for edge case where defensive bigs shooting is set to below 19, because there are no bigs in our database with percentile shooting 1-18% due to weird data distribution
  if (positional_JSON == big_JSON && document.getElementById("shooting-slider").value < 19) {
    document.getElementById("shooting11").innerText = "0%"
  }
  else {
  document.getElementById("shooting11").innerText = Math.round(positional_JSON.find(player => Math.abs(player.three_Percentile*100 - document.getElementById("shooting-slider").value) < 3).three_Percentage*100) + "%"
  }
  
  document.getElementById("rebounding11").innerText = positional_JSON.find(player => Math.abs(player.rebounding_Percentile*100 - document.getElementById("rebounding-slider").value) < 3).reb_Per36
  document.getElementById("scoring11").innerText = positional_JSON.find(player => Math.abs(player.points_Percentile*100 - document.getElementById("scoring-slider").value) < 3).pts_Per36
  //set background color of our user
  background(parseInt(document.getElementById("defense-slider").value), document.getElementById("defense11"))
  background(document.getElementById("passing-slider").value, document.getElementById("passing11"))
  background(document.getElementById("shooting-slider").value, document.getElementById("shooting11"))
  background(document.getElementById("rebounding-slider").value, document.getElementById("rebounding11"))
  background(document.getElementById("scoring-slider").value, document.getElementById("scoring11"))
  background(100, document.getElementById("similarity11"))
}

function presets(num) {
  const presetValues = [
    [20, 50, 95, 75, 90, "LaMelo Ball", "guard"],
    [30, 45, 40, 55, 90, "Anthony Edwards", "guard"],
    [80, 45, 85, 50, 85, "Killian Hayes", "guard"],
    [70, 45, 80, 80, 85, "Deni Avdija", "wing"], 
    [50, 35, 20, 85, 95, "James Wiseman", "big"], 
    [90, 30, 70, 80, 60, "Onyeka Okongwu", "big"], 
    [20, 90, 30, 80, 90, "Obi Toppin", "big"], 
    [55, 90, 90, 75, 35, "Tyrese Haliburton", "guard"], 
    [90, 20, 75, 90, 50, "Isaac Okoro", "guard"], 
    [90, 80, 30, 60, 40, "Devin Vassell", "wing"]
  ]
  document.getElementById("defense-slider").value = presetValues[num][0]
  document.getElementById("shooting-slider").value = presetValues[num][1]
  document.getElementById("passing-slider").value = presetValues[num][2]
  document.getElementById("rebounding-slider").value = presetValues[num][3]
  document.getElementById("scoring-slider").value = presetValues[num][4]
  document.getElementById("name").value = presetValues[num][5]
  document.getElementById(`position-select-${presetValues[num][6]}`).checked = true

}