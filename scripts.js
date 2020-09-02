

const descriptions = [
  {attribute: "defense",
  responses: [
    {value: 1,
    text: ["Seems excited to let guys score so they can get the ball back.", `Sees teammates go to the other end of the court on defense, but doesn't understand that they are supposed to follow them.`, "Seems aware that there is a half court line, but not all that interested in crossing it.", "Could have sworn I overheard them say defense is for suckers."]
    },
    {value: 2,
    text: ["Mediocre defender.", "Average defender."]
    },
    {value: 3,
      text: [`Put this kid in a Florida bar because there's nothing they can't lock down.`, "DPOY Potential."]
    }
  ]
  },
  {attribute: "shooting",
  responses: [
    {value: 1,
    text: ["Couldn't beat Michael Carter-Williams in HORSE.", "I've seen storm troopers shoot better."]
    },
    {value: 2,
    text: ["Cromulent shooter.", `Can't leave them wide open.`]
    },
    {value: 3,
      text: ["Jump shot has more range than Beyonce.", "Jump shot has more range than Johnny Depp.", "Three things in life you can count on; Death, taxes, and this kid's jump shot."]
    }
  ]
  },
  {attribute: "ballhandling",
  responses: [
    {value: 1,
    text: ["Rough handle."]
    },
    {value: 2,
    text: ["Won't turn it over too much.", `Knows their limits with the ball.`]
    },
    {value: 3,
      text: [`Instead of growing up wanting to dribble like Kyrie Irving, kids are going to want to handle like them.`, "Can put the ball on a string."]
    }
  ]
},
{attribute: "passing",
  responses: [
    {value: 1,
    text: ["Shaky passer.", "Court vision needs work."]
    },
    {value: 2,
    text: ["Can make the quick simple pass.", "Not much of a playmaker, but can do the basics."]
    },
    {value: 3,
      text: [`Could open up a boutique with how good they are at threading the needle.`, "Transcendant passer."]
    }
  ]
},
{attribute: "rebounding",
  responses: [
    {value: 1,
    text: ["Allergic to rebounds.", `I know in theory they can get a rebound. But nobody's seen it yet.`]
    },
    {value: 2,
    text: ["Adequate rebounder.", `Can rebound their position.`]
    },
    {value: 3,
      text: ["Gobbles up rebounds.", "Walking double-double.", `Rebounds faster than a Kardashian.`]
    }
  ]
},
{attribute: "hustle",
  responses: [
    {value: 1,
    text: ["Motor runs hot and cold.", `Looks ready to take a nap.`, "Energy level of someone who's been on hold with customer service for the last two hours."]
    },
    {value: 2,
    text: ["Decent worker.", "Doesn't go too fast.", "Decent motor."]
    },
    {value: 3,
      text: ["Will run through a wall.", "Plays like someone insulted his mother."]
    }
  ]
}
]




//declare some variables to shortcut later

const submitButton = document.getElementById("submitButton")
const profile = document.getElementById("profile")
const defense = document.getElementById("defense")
const shooting = document.getElementById("shooting")
const ballhandling = document.getElementById("ballhandling")
const passing = document.getElementById("passing")
const rebounding = document.getElementById("rebounding")
const hustle = document.getElementById("hustle")
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

//hide the slider bars and bring up the scouting report page
function fillProfile () {
  //fill strengths and weaknesses arrays by descriptions
 
  strengthOrWeakness("defense")
  strengthOrWeakness("shooting")
  strengthOrWeakness("passing")
  strengthOrWeakness("rebounding")
  strengthOrWeakness("hustle")
  strengthOrWeakness("ballhandling")
  
//hide the sliders, fill the strenghts and weaknesses divs with text
  document.getElementById("start-form").classList.add("hide")
  document.getElementById("profile").classList.remove("hide")
  if (strengthsArray.length > 0) {
    strengths.innerText = strengthsArray.join(' ')
  }
  if (weaknessesArray.length > 0) {
    weaknesses.innerText = weaknessesArray.join(' ')
  }

  document.getElementById("banner").innerText = "DRAFT PROFILE: " + document.getElementById("name").value.toUpperCase()
  setProfile()
  document.getElementById("comps").innerText = (findComps(myProfile).length > 0) ? findComps(myProfile).map(a => a.Player).join(", ") : "No matching comps."
  document.getElementById("pick-range").innerText = pickRange()
  
}

//function within fillProfile that allows you to grab a random description from the descriptions array
function grabDescription (attributes, values) {
  for (let i=0; i<descriptions.length; i++) {
    if (descriptions[i].attribute == attributes) {
      if (values <= 40) {
        return descriptions[i].responses[0].text[Math.round(Math.random()*(descriptions[i].responses[0].text.length - 1))];
      }
      if (values > 40 && values < 60) {
        return descriptions[i].responses[1].text[Math.round(Math.random()*(descriptions[i].responses[0].text.length - 1))];
      }
      if (values >= 60) {
        return descriptions[i].responses[2].text[Math.round(Math.random()*(descriptions[i].responses[0].text.length - 1))];
      }
    }
  }
}

//used in the fillProfile function to classify each characteristic as a strength or weakness
function strengthOrWeakness (attributes) {
  if (document.getElementById(`${attributes}-slider`).value > 40) {
    strengthsArray.push(grabDescription(attributes, document.getElementById(`${attributes}-slider`).value))
  }
  if (document.getElementById(`${attributes}-slider`).value <= 40) {
    weaknessesArray.push(grabDescription(attributes, document.getElementById(`${attributes}-slider`).value))
  }
}



//comps
let myProfile = {
  name: "", 
}

 function setProfile () {
  myProfile.passing = (document.getElementById("passing-slider").value > 50)
  myProfile.ballhandling = (document.getElementById("ballhandling-slider").value > 50)
  myProfile.shooting = (document.getElementById("shooting-slider").value > 50)
  myProfile.hustle = (document.getElementById("hustle-slider").value > 70)
  myProfile.defense = (document.getElementById("defense-slider").value > 50)
  myProfile.rebounding = (document.getElementById("rebounding-slider").value > 50)
  myProfile.scoring = (document.getElementById("scoring-slider").value > 50)
}


//pick range

function pickRange () {
  let range = parseInt(document.getElementById("passing-slider").value) + parseInt(document.getElementById("ballhandling-slider").value) + parseInt(document.getElementById("shooting-slider").value) + parseInt(document.getElementById("hustle-slider").value) + parseInt(document.getElementById("defense-slider").value) + parseInt(document.getElementById("rebounding-slider").value) + parseInt(document.getElementById("scoring-slider").value)
  if (range > 550 && range < 701) {
    return "Top five."
  }
  if (range > 500 && range < 550) {
    return "Lottery pick."
  }
  if (range > 420 && range < 500) {
    return "Late first round."
  }
  if (range > 350 && range < 420) {
    return "Second round."
  }
  if (range > 250 && range < 350) {
    return "Overseas."
  }
  if (range >= 0 && range < 250) {
    return "Hang up the shoes and start a blogging career."
  }

}