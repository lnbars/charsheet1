const disciplinelist = {
  "animalism":[{"dots":1, "name":"feral whispers", "attribute":"manipulation", "ability":"animal ken", "difficulty":"5-8", "cost":""}
             , {"dots":2, "name":"beckoning", "attribute":"charisma", "ability":"survival", "difficulty":"6", "cost":""}
             , {"dots":3, "name":"quell the beast", "attribute":"manipulation", "ability":"intimidation/empathy", "difficulty":"7", "cost":""}
             , {"dots":4, "name":"subsume the spirit", "attribute":"manipulation", "ability":"animal ken", "difficulty":"8", "cost":""}
             , {"dots":5, "name":"drawing out the beast", "attribute":"manipulation", "ability":"self-control", "difficulty":"8", "cost":""}
              ],
  "auspex":[{"dots":1, "name":"heightened senses", "attribute":"", "ability":"", "difficulty":"", "cost":""}
             , {"dots":2, "name":"aura perception", "attribute":"perception", "ability":"empathy", "difficulty":"8", "cost":""}
             , {"dots":3, "name":"spirit's touch", "attribute":"perception", "ability":"empathy", "difficulty":"5-9", "cost":""}
             , {"dots":4, "name":"telepathy", "attribute":"intelligence", "ability":"subterfuge", "difficulty":"target's willpower", "cost":""}
             , {"dots":5, "name":"psychic projection", "attribute":"perception", "ability":"occult", "difficulty":"7-10", "cost":"1 willpower"}
              ],
  "chimerstry":[{"dots":1, "name":"ignis fatuus", "attribute":"", "ability":"", "difficulty":"", "cost":"1 willpower"}
             , {"dots":2, "name":"fata morgana", "attribute":"", "ability":"", "difficulty":"", "cost":"1 willpower + 1 blood"}
             , {"dots":3, "name":"apparition", "attribute":"", "ability":"", "difficulty":"", "cost":"1 blood"}
             , {"dots":4, "name":"permanency", "attribute":"", "ability":"", "difficulty":"", "cost":"1 blood"}
             , {"dots":5, "name":"horrid reality", "attribute":"manipulation", "ability":"subterfuge", "difficulty":"target's perception + self-control", "cost":"2 willpower"}
              ],
  "dementation":[{"dots":1, "name":"passion", "attribute":"charisma", "ability":"empathy", "difficulty":"target's humanity", "cost":""}
             , {"dots":2, "name":"haunting", "attribute":"manipulation", "ability":"subterfuge", "difficulty":"target's perception + self-control", "cost":"1 blood"}
             , {"dots":3, "name":"eyes of chaos", "attribute":"perception", "ability":"occult", "difficulty":"5-9", "cost":""}
             , {"dots":4, "name":"voice of madness", "attribute":"manipulation", "ability":"empathy", "difficulty":"7", "cost":"1 blood"}
             , {"dots":5, "name":"total insanity", "attribute":"manipulation", "ability":"intimidation", "difficulty":"target's willpower", "cost":"1 blood"}
              ],
  "dominate":[{"dots":1, "name":"command", "attribute":"manipulation", "ability":"intimidation", "difficulty":"target's permanent willpower", "cost":""}
             , {"dots":2, "name":"mesmerize", "attribute":"manipulation", "ability":"leadership", "difficulty":"target's permanent willpower", "cost":""}
             , {"dots":3, "name":"forgetful mind", "attribute":"wits", "ability":"subterfuge", "difficulty":"target's willpower", "cost":""}
             , {"dots":4, "name":"conditioning", "attribute":"charisma", "ability":"leadership", "difficulty":"target's permanent willpower", "cost":""}
             , {"dots":5, "name":"possession", "attribute":"charisma", "ability":"intimidation", "difficulty":"7", "cost":"1 willpower"}
              ],
  "sepulchre path":[{"dots":1, "name":"insight", "attribute":"perception", "ability":"occult", "difficulty":"8 or 10", "cost":""}
             , {"dots":2, "name":"summon soul", "attribute":"perception", "ability":"occult", "difficulty":"7", "cost":""}
             , {"dots":3, "name":"compel soul", "attribute":"manipulation", "ability":"occult", "difficulty":"target's willpower", "cost":""}
             , {"dots":4, "name":"haunting", "attribute":"manipulation", "ability":"occult", "difficulty":"target's willpower", "cost":""}
             , {"dots":5, "name":"torment", "attribute":"stamina", "ability":"empathy", "difficulty":"target's willpower", "cost":""}
              ],
  "bone path":[{"dots":1, "name":"tremens", "attribute":"dexterity", "ability":"occult", "difficulty":"6", "cost":"1 blood"}
             , {"dots":2, "name":"apprentice's brooms", "attribute":"wits", "ability":"occult", "difficulty":"7", "cost":"1 willpower + 1 blood"}
             , {"dots":3, "name":"shambling hordes", "attribute":"wits", "ability":"occult", "difficulty":"8", "cost":"1 willpower + 1 blood per zombie"}
             , {"dots":4, "name":"soul stealing", "attribute":"willpower", "ability":"", "difficulty":"6, contested with target's willpower", "cost":"1 willpower"}
             , {"dots":5, "name":"daemonic possession", "attribute":"", "ability":"", "difficulty":"", "cost":""}
              ],
  "ash path":[{"dots":1, "name":"shroudsight", "attribute":"perception", "ability":"alertness", "difficulty":"7", "cost":""}
             , {"dots":2, "name":"lifeless tongues", "attribute":"perception", "ability":"occult", "difficulty":"6", "cost":"1 willpower"}
             , {"dots":3, "name":"dead hand", "attribute":"wits", "ability":"occult", "difficulty":"7", "cost":"1 willpower + 1 blood per turn"}
             , {"dots":4, "name":"ex nihilo", "attribute":"stamina", "ability":"occult", "difficulty":"8", "cost":"2 willpower + 2 blood"}
             , {"dots":4, "name":"ex nihilo return", "attribute":"stamina", "ability":"occult", "difficulty":"6", "cost":"1 willpower"}
             , {"dots":5, "name":"shroud mastery", "attribute":"willpower", "ability":"", "difficulty":"9", "cost":"2 willpower"}
              ],
  "obfuscate":[{"dots":1, "name":"cloak of shadows", "attribute":"", "ability":"", "difficulty":"", "cost":""}
             , {"dots":2, "name":"unseen presence", "attribute":"wits", "ability":"stealth", "difficulty":"5-9, only roll if you do something to give yourself away", "cost":""}
             , {"dots":3, "name":"mask of a 1000 faces", "attribute":"manipulation", "ability":"performance", "difficulty":"7", "cost":""}
             , {"dots":4, "name":"vanish from the mind's eye", "attribute":"charisma", "ability":"stealth", "difficulty":"viewer's wits + alertness", "cost":""}
             , {"dots":5, "name":"cloak of the gathering", "attribute":"", "ability":"", "difficulty":"", "cost":""}
              ],
  "obtenebration":[{"dots":1, "name":"shadow play", "attribute":"", "ability":"", "difficulty":"", "cost":"1 blood"}
             , {"dots":2, "name":"shroud of night", "attribute":"manipulation", "ability":"occult", "difficulty":"7", "cost":""}
             , {"dots":3, "name":"arms of the abyss", "attribute":"manipulation", "ability":"occult", "difficulty":"7", "cost":"1 blood"}
             , {"dots":4, "name":"black metamorphosis", "attribute":"manipulation", "ability":"courage", "difficulty":"7", "cost":"2 blood points"}
             , {"dots":5, "name":"tenebrous form", "attribute":"", "ability":"", "difficulty":"", "cost":"3 blood points"}
              ],
  "presence":[{"dots":1, "name":"awe", "attribute":"charisma", "ability":"performance", "difficulty":"7", "cost":""}
             , {"dots":2, "name":"dread gaze", "attribute":"charisma", "ability":"intimidation", "difficulty":"target's wits + courage", "cost":""}
             , {"dots":3, "name":"entrancement", "attribute":"appearance", "ability":"empathy", "difficulty":"target's permanent willpower", "cost":""}
             , {"dots":4, "name":"summon", "attribute":"charisma", "ability":"subterfuge", "difficulty":"4-8", "cost":""}
             , {"dots":5, "name":"majesty", "attribute":"", "ability":"", "difficulty":"", "cost":"1 willpower"}
              ],
  "protean":[{"dots":1, "name":"eyes of the beast", "attribute":"", "ability":"", "difficulty":"", "cost":""}
             , {"dots":2, "name":"feral claws", "attribute":"", "ability":"", "difficulty":"", "cost":"1 blood"}
             , {"dots":3, "name":"earth meld", "attribute":"", "ability":"", "difficulty":"", "cost":"1 blood"}
             , {"dots":4, "name":"shape of the beast", "attribute":"", "ability":"", "difficulty":"", "cost":"1 blood"}
             , {"dots":5, "name":"mist form", "attribute":"", "ability":"", "difficulty":"", "cost":"1 blood"}
              ],
  "quietus":[{"dots":1, "name":"silence of death", "attribute":"", "ability":"", "difficulty":"", "cost":"1 blood"}
             , {"dots":2, "name":"scorpion's touch", "attribute":"willpower", "ability":"", "difficulty":"6", "cost":"1 or more blood"}
             , {"dots":3, "name":"dagon's call", "attribute":"stamina", "ability":"", "difficulty":"target's permanent willpower, contested by them using stamina vs your willpower", "cost":"1 willpower per turn"}
             , {"dots":4, "name":"baal's caress", "attribute":"", "ability":"", "difficulty":"", "cost":"1 blood per hit"}
             , {"dots":5, "name":"taste of death", "attribute":"stamina", "ability":"athletics", "difficulty":"6", "cost":"each blood point does 2 aggravated damage"}
              ],
  "serpentis":[{"dots":1, "name":"eyes of the serpent", "attribute":"", "ability":"", "difficulty":"", "cost":""}
             , {"dots":2, "name":"tongue of the asp", "attribute":"", "ability":"", "difficulty":"", "cost":""}
             , {"dots":3, "name":"skin of the adder", "attribute":"", "ability":"", "difficulty":"", "cost":"1 blood + 1 willpower"}
             , {"dots":4, "name":"form of the cobra", "attribute":"", "ability":"", "difficulty":"", "cost":"1 blood"}
             , {"dots":5, "name":"heart of darkness", "attribute":"", "ability":"", "difficulty":"", "cost":""}
              ],
  "path of blood":[{"dots":1, "name":"taste of blood", "attribute":"willpower", "ability":"", "difficulty":"4", "cost":"1 blood"}
             , {"dots":2, "name":"blood rage", "attribute":"willpower", "ability":"", "difficulty":"5", "cost":"1 blood"}
             , {"dots":3, "name":"blood of potency", "attribute":"willpower", "ability":"", "difficulty":"6", "cost":"1 blood"}
             , {"dots":4, "name":"theft of vitae", "attribute":"willpower", "ability":"", "difficulty":"7", "cost":"1 blood"}
             , {"dots":5, "name":"cauldron of blood", "attribute":"willpower", "ability":"", "difficulty":"8", "cost":"1 blood"}
              ],
  "lure of flames":[{"dots":1, "name":"", "attribute":"willpower", "ability":"", "difficulty":"4", "cost":"1 blood"}
             , {"dots":2, "name":"", "attribute":"willpower", "ability":"", "difficulty":"5", "cost":"1 blood"}
             , {"dots":3, "name":"", "attribute":"willpower", "ability":"", "difficulty":"6", "cost":"1 blood"}
             , {"dots":4, "name":"", "attribute":"willpower", "ability":"", "difficulty":"7", "cost":"1 blood"}
             , {"dots":5, "name":"", "attribute":"willpower", "ability":"", "difficulty":"8", "cost":"1 blood"}
              ],
  "movement of the mind":[{"dots":1, "name":"", "attribute":"willpower", "ability":"", "difficulty":"4", "cost":"1 blood"}
             , {"dots":2, "name":"", "attribute":"willpower", "ability":"", "difficulty":"5", "cost":"1 blood"}
             , {"dots":3, "name":"", "attribute":"willpower", "ability":"", "difficulty":"6", "cost":"1 blood"}
             , {"dots":4, "name":"", "attribute":"willpower", "ability":"", "difficulty":"7", "cost":"1 blood"}
             , {"dots":5, "name":"", "attribute":"willpower", "ability":"", "difficulty":"8", "cost":"1 blood"}
              ],
  "path of conjuring":[{"dots":1, "name":"summon the simple form", "attribute":"willpower", "ability":"", "difficulty":"4", "cost":"1 blood + 1 willpower per turn"}
             , {"dots":2, "name":"permanency", "attribute":"willpower", "ability":"", "difficulty":"5", "cost":"3 blood"}
             , {"dots":3, "name":"magic of the smith", "attribute":"willpower", "ability":"", "difficulty":"6", "cost":"5 blood"}
             , {"dots":4, "name":"reverse conjuration", "attribute":"willpower", "ability":"", "difficulty":"7", "cost":"1 blood"}
             , {"dots":5, "name":"power over life", "attribute":"willpower", "ability":"", "difficulty":"8", "cost":"10 blood"}
              ],
  "hands of destruction":[{"dots":1, "name":"decay", "attribute":"willpower", "ability":"", "difficulty":"4", "cost":"1 blood"}
             , {"dots":2, "name":"gnarl wood", "attribute":"willpower", "ability":"", "difficulty":"5", "cost":"1 blood"}
             , {"dots":3, "name":"acidic touch", "attribute":"willpower", "ability":"", "difficulty":"6", "cost":"1 blood"}
             , {"dots":4, "name":"atrophy", "attribute":"willpower", "ability":"", "difficulty":"7", "cost":"1 blood"}
             , {"dots":5, "name":"turn to dust", "attribute":"willpower", "ability":"", "difficulty":"8", "cost":"1 blood"}
              ],
  "vicissitude":[{"dots":1, "name":"malleable vissage", "attribute":"intelligence", "ability":"body crafts", "difficulty":"6", "cost":"1 blood"}
             , {"dots":2, "name":"fleshcraft", "attribute":"dexterity", "ability":"body crafts", "difficulty":"5-9", "cost":""}
             , {"dots":3, "name":"bonecraft", "attribute":"strength", "ability":"body crafts", "difficulty":"7", "cost":""}
             , {"dots":4, "name":"horrid form", "attribute":"", "ability":"", "difficulty":"", "cost":"2 blood"}
             , {"dots":5, "name":"blood form", "attribute":"", "ability":"", "difficulty":"", "cost":""}
              ],
//  "":[{"dots":1, "name":"", "attribute":"", "ability":"", "difficulty":"", "cost":""}
//             , {"dots":2, "name":"", "attribute":"", "ability":"", "difficulty":"", "cost":""}
//             , {"dots":3, "name":"", "attribute":"", "ability":"", "difficulty":"", "cost":""}
//             , {"dots":4, "name":"", "attribute":"", "ability":"", "difficulty":"", "cost":""}
//             , {"dots":5, "name":"", "attribute":"", "ability":"", "difficulty":"", "cost":""}
//              ],
}

