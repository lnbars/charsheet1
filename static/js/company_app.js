// leaders
function initTools() {
  $('#displayallcheckbox').off().on('click', switchdisplayall);
  $('#printbutton').off().on('click', printsheet);
}
function switchdisplayall() {
  let charlist = $('#characterlist').find('option:selected');
  if(charlist.length > 0){
    let charid = charlist[0].value;
    let charname = charlist[0].text;
    getAttributes(charid, charname);
    getCharacteristics(charid, charname);
  }
}
function printsheet() {
  $('#deletebutton').addClass('dontshow');
  let contents = $('#character').html();
  let title = $('#characternamelabel').text();

  let frame1 = $('<iframe>');
  frame1[0].name = "frame1";
  frame1.css({ "position": "absolute", "top": "-1000000px" });
  $("body").append(frame1);
  let frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
  frameDoc.document.open();
  //Create a new HTML document.
  frameDoc.document.write('<html><head><title>'+title+'</title>');
  frameDoc.document.write('</head><body>');
  //Append the external CSS file.
  frameDoc.document.write('<link href="/static/css/company_app.css" rel="stylesheet" type="text/css" />');
  //Append the DIV contents.
  frameDoc.document.write(contents);
  frameDoc.document.write('</body></html>');
  frameDoc.document.close();
  setTimeout(function () {
    window.frames["frame1"].focus();
    window.frames["frame1"].print();
    frame1.remove();
    $('#deletebutton').removeClass('dontshow');
  }, 500);
}

function getCharacters() {
  $.ajax({
      url: "/characters",
      type: 'get',
  }).done(function(data){
      let characters = JSON.parse(data);
      console.log(characters);
      populateCharacterList(characters);
  }).fail(function(resp) {
      console.log(resp.responseText);
  });

}
function getAttributes(charid, charname) {
  let indata = {"charid":charid};
  $.ajax({
      url: "/attributes",
      type: 'post',
      dataType: 'json',
      data: JSON.stringify(indata),
      contentType: 'application/json',
  }).done(function(data){
      console.log(data);
      let showall = $('#displayallcheckbox').prop('checked');
      displayAttributes(charid, data, showall);
  }).fail(function(resp) {
      console.log(resp.responseText);
  });
}
function getCharacteristics(charid, charname){
  let indata = {"charid":charid};
  $.ajax({
      url: "/characteristics",
      type: 'post',
      dataType: 'json',
      data: JSON.stringify(indata),
      contentType: 'application/json',
  }).done(function(data){
      displayCharacteristics(charid, data);
  }).fail(function(resp) {
      console.log(resp.responseText);
  });
}
function displayCharacteristics(charid, data) {
  console.log("displayCharacteristics ", data);
  let clan = data.find((elem) => elem.attribute == "clan");
  if(clan && clan.value != ''){
    $('#clanname').empty().append(clan.value);
  }
}

function populateCharacterList(characters) {
  $('#characterlist').empty();
  // make an add character button
  let addcharbutton = $('<button id="addcharacterbutton">').addClass("charbutton").append("Add character");
  addcharbutton.off().on('click', addCharacter);
  $('#characterlist').append(addcharbutton)
  //let wheight = $(window).height;
  let charlist = $('<select id="characterselect" name="characterselect">').attr('size', 35);
  characters.forEach((character) => {
    let option = $('<option>').attr('value', character.charid).append(character.charname);
    charlist.append(option);
  });
  charlist.off().on('click keyup', selectCharacter);
  $('#characterlist').append(charlist);
}
function addCharacter(event) {
  $.ajax({
      url: "/character/add",
      type: 'get',
  }).done(function(data){
      addCharacterToList(data);
  }).fail(function(resp) {
      console.log(resp.responseText);
  });
}
function addCharacterToList(data) {
  character = JSON.parse(data);
  console.log(character);
  let charlist = $('#characterselect');
  let option = $('<option>').attr('value', character.charid).append(character.charname);
  charlist.append(option);
}
function deleteCharacter(event) {
  if(confirm("Are you sure you want to delete this character?") == true){
  let charlist = $('#characterlist').find('option:selected');
    if(charlist.length > 0){
      let charid = charlist[0].value;
      let charname = charlist[0].text;
      let indata = {"charid":charid};
      $.ajax({
         url: "/character/delete",
         type: 'post',
         dataType: 'json',
         data: JSON.stringify(indata),
         contentType: 'application/json',
      }).done(function(data){
         $('#characterinfo').empty();
         $('#attributes').empty();
         getCharacters();
      }).fail(function(resp) {
         console.log(resp.responseText);
      });
    }
  }
}
function selectCharacter(thischar) {
  let deleteButton = $('<button id="deletebutton" title="Delete this character">').addClass("deletebutton").append("X");
  deleteButton.off().on('click', deleteCharacter);

  let charid = thischar.target.value;
  let charname = thischar.target.text;
  if(!charname){
    charname = $('#characterselect option:selected')[0].text;
  }
  $(document).prop('title', charname);

  let fieldLabel = $('<label>').append("Character Name: ");
  let charnameLabel = $('<label id="characternamelabel">').append(charname);
  charnameLabel.off().on('click', swapTextBox);
  let charnameBox = $('<input id="characternameinput" type="text" class="dontshow">').attr('value', charname);
  charnameBox.off().on('blur keyup', null, charid, updateName);
  let charnameSpan = $('<span>').append(deleteButton).append(fieldLabel).append(charnameLabel).append(charnameBox);
  $('#characterinfo').empty();
  $('#characterinfo').append(charnameSpan);

  // TODO get clan here
  let clanLabel = $('<label>').append("Clan: ");
  let clanValLabel = $('<label id="clanname" class="fieldname">').append("some clan here");
  clanValLabel.off().on('click', swapTextBox);
  let clanDropdown = $('<select id="clanselect" class="dontshow">');
  clanDropdown.append($('<option>')); // add a blank option
  clanlist.forEach((clan) => {
    let opt = $('<option>').attr('value', clan).append(clan);
    clanDropdown.append(opt);
  });
  clanDropdown.off().on('blur change keyup', updateClan);
  let clanSpan = $('<span>').addClass('center').append(clanLabel).append(clanValLabel).append(clanDropdown);
  $('#characterinfo').append(clanSpan);

  // generation label
  let generationLabel = $('<label>').append("Generation: ");
  let generationValue = $('<label id="generation">');
  let generationSpan = $('<span>').addClass('center').append(generationLabel).append(generationValue);
  $('#characterinfo').append(generationSpan);
 
  getAttributes(charid, charname);
  getCharacteristics(charid, charname);
}
function swapTextBox(event){
  // check siblings for "dontshow" in order to swap with them
  if(event.target.nextSibling && event.target.nextSibling.classList.contains("dontshow")){
    event.target.nextSibling.classList.remove("dontshow");
    event.target.nextSibling.focus();
  }
  if(event.target.previousSibling && event.target.previousSibling.classList.contains("dontshow")){
    event.target.previousSibling.classList.remove("dontshow");
    event.target.previousSibling.focus();
  }
  event.target.classList.add("dontshow");
}
function updateClan(event) {
  if(event.which == 27){ // esc
    event.target.value = event.target.defaultValue;
    swapTextBox(event);
  } else {
    let charid = $('#characterselect option:selected')[0].value;
    let value = event.target.value;
    $('#clanname').empty().append(event.target.value);
    swapTextBox(event);
    updateCharacteristic(charid, "clan", value);
  }
}
function updateName(event) {
  if(event.which == 27){ // esc
    event.target.value = event.target.defaultValue;
  } else if (event.which == 13){ // enter
    $('#characternamelabel').empty().append(event.target.value);
    // update app
    updateCharacter(event.data, event.target.value); // charid, charname
    // update char list box
    $('#characterselect option:selected').text(event.target.value);
  } else if(event.which > 0) {
    return;
  }
  swapTextBox(event);
}
function updateCharacter(charid, charname){
  let indata = {"charid":charid, "charname":charname};
  $.ajax({
      url: "/character/update",
      type: 'post',
      dataType: 'json',
      data: JSON.stringify(indata),
      contentType: 'application/json',
  }).done(function(data){
      console.log(data);
  }).fail(function(resp) {
      console.log(resp.responseText);
  });
}

function updateGeneration(gendots){
  let gen = 13;
  if(gendots){
    gen = gen-gendots;
  }
  $('#generation').empty().append(parseInt(gen)+"th");
}
function updateCharacteristic(charid, attribute, value){
  let indata = {"charid":charid, "attribute":attribute.toLowerCase(), "value":value};
  $.ajax({
      url: "/characteristic/update",
      type: 'post',
      dataType: 'json',
      data: JSON.stringify(indata),
      contentType: 'application/json',
  }).done(function(data){
      console.log(data);
  }).fail(function(resp) {
      console.log(resp.responseText);
  });
}
function updateAttributes(charid, fieldname, dots) {
  if(fieldname == "generation"){ // maybe refactor this, or allow multuple functions to be passed to stat
    updateGeneration(dots);
  }
  console.log("updating stat ", charid, fieldname.toLowerCase(), dots);
  let indata = {"charid":charid, "attribute":fieldname.toLowerCase(), "dots":dots};
  $.ajax({
      url: "/attribute/update",
      type: 'post',
      dataType: 'json',
      data: JSON.stringify(indata),
      contentType: 'application/json',
  }).done(function(data){
      console.log(data);
  }).fail(function(resp) {
      console.log(resp.responseText);
  });
}
function addField(div, character, fieldname, defaultdots, width, attribute, callbackfunction) {
  let dots = defaultdots;
  if(attribute) {
    dots = attribute.dots;
  }
  let newstat = new Stat(character, fieldname, dots, width, callbackfunction);
  let newfield = newstat.makeField();
  let label = $('<label>').append(fieldname);
  if(fieldname.startsWith("path")) {
    label.addClass("indentedlabel");
  }
  let tdA = $('<td class="fieldname">').append(label);
  let tdB = $('<td>').addClass('center').append(newfield);
  div.append(tdA).append(tdB);
}
function makeFancyHeader(name, width, tdclass, addTR = true){
  let attrSpan = $('<span class="headerspan">').append(name);
  let tdAttr = $('<td>').attr('colspan', width).addClass(tdclass).append(attrSpan);
  if(addTR) {
    let trAttr = $('<tr>').append(tdAttr);
    return trAttr;
  } else {
    return tdAttr;
  }
}
function makeTypeRow(typeArray, colspan) {
  let trRow = $('<tr>');
  typeArray.forEach((type) => {
    let typeTd = $('<td>').attr('colspan', colspan).addClass("typeheader").append(type);
    trRow.append(typeTd);
  });
  return trRow;
}
// get a possibly existing row
function getRow(tbl, currentrow, lentocheck, tablelen, startpos) {
  let rowTR = $('<tr>');
  if(currentrow < lentocheck) {
    rowTR = $(tbl[0].rows[tablelen+currentrow]);
  } else {
    for(let i=0; i<startpos; i++){
      rowTR.append( $('<td>') ); // add cells as placeholders
    }
    tbl.append(rowTR); // since it is new it is not in the table
  }
  return rowTR;
}
function displayAttributes(charid, attributes, showall) {
  let maxdots = 8; 
  // Generation
  let gendots = attributes.find((elem) => elem.attribute == "generation");
  updateGeneration(gendots ? gendots.dots : 0);

  // Attributes
  $('#attributes').empty();
  let tbl = $('<table id="attributetable" class="attributetable">');

  tbl.append( makeFancyHeader("Attributes", 6, "headertd spacer") );
  tbl.append( makeTypeRow(["Physical", "Social", "Mental"], 2) );

  attributeArray.forEach((rowElem) => {
    let rowTR = $('<tr>');
    rowElem.forEach((attributeElem) => {
      addField(rowTR, charid, attributeElem, 1, maxdots, attributes.find((elem) => elem.attribute == attributeElem), updateAttributes );
    });
    tbl.append(rowTR);
  });

  // Abilities
  tbl.append( makeFancyHeader("Abilities", 6, "headertd spacer") );
  tbl.append( makeTypeRow(["Talents", "Skills", "Knowledges"], 2) );

  abilityArray.forEach((rowElem) => {
    let rowTR = $('<tr>');
    rowElem.forEach((attributeElem) => {
      addField(rowTR, charid, attributeElem, 0, maxdots, attributes.find((elem) => elem.attribute == attributeElem), updateAttributes );
    });
    tbl.append(rowTR);
  });

  // Advantages
  tbl.append( makeFancyHeader("Advantages", 6, "headertd spacer") );
  tbl.append( makeTypeRow(["Disciplines", "Backgrounds", "Virtues"], 2) );

  let advantagesStartRow = tbl[0].rows.length;
  console.log("TABLE LENGTH", tbl[0].rows.length);

  // disciplines
  let disciplinesrow = 0;
  disciplines.forEach((attributeElem) => {
    let discipline = attributes.find((elem) => elem.attribute == attributeElem);
    if(discipline ||  showall) {
      let rowTR = $('<tr>');
      addField(rowTR, charid, attributeElem, 0, maxdots, discipline, updateAttributes );
      tbl.append(rowTR);
      disciplinesrow++;
    }
  });

  // backgrounds
  let backgroundsrow = 0;
  backgrounds.forEach((attributeElem) => {
    let background = attributes.find((elem) => elem.attribute == attributeElem);
    if((background && background.dots > 0) || showall) {
      let rowTR = getRow(tbl, backgroundsrow ,disciplinesrow, advantagesStartRow, 2);
      addField(rowTR, charid, attributeElem, 0, maxdots, background, updateAttributes );
      backgroundsrow++;
    }
  });

  // Humanity
    // add some spacing
  for(let i=backgroundsrow; i<3; i++) { // only if needed though
    let rowTR = getRow(tbl, backgroundsrow, disciplinesrow, advantagesStartRow, 2);
    rowTR.append( $('<td>').append("&nbsp;") );
    rowTR.append( $('<td>').append("&nbsp;") );
    backgroundsrow++;
  }
  let rowTR = getRow(tbl, backgroundsrow, disciplinesrow, advantagesStartRow, 2);
  rowTR.append( $('<td>').append("&nbsp;") );
  rowTR.append( $('<td>').append("&nbsp;") );
  backgroundsrow++;
  let humanityrow = backgroundsrow;
  rowTR = getRow(tbl, backgroundsrow, disciplinesrow, advantagesStartRow, 2);
  rowTR.append( makeFancyHeader("Humanity", 2, "headertdsmall", false) );
  backgroundsrow++;

  rowTR = getRow(tbl, backgroundsrow, disciplinesrow, advantagesStartRow, 2);
  let humanity = attributes.find((elem) => elem.attribute == "humanity");
  let humanitydots = humanity ? humanity.dots : 0;
  let humanityStat = new Stat(charid, "humanity", humanitydots, 10, updateAttributes);
  let humanityTd = $('<td>').addClass('center').attr('colspan', 2).append(humanityStat.makeField()); 
  rowTR.append(humanityTd);
  backgroundsrow++;

  rowTR = getRow(tbl, backgroundsrow, disciplinesrow, advantagesStartRow, 2);
  rowTR.append( $('<td>').append("&nbsp;") );
  rowTR.append( $('<td>').append("&nbsp;") );
  backgroundsrow++;
  rowTR = getRow(tbl, backgroundsrow, disciplinesrow, advantagesStartRow, 2);
  rowTR.append( makeFancyHeader("Willpower", 2, "headertdsmall", false) );
  backgroundsrow++;

  rowTR = getRow(tbl, backgroundsrow, disciplinesrow, advantagesStartRow, 2);
  let willpower = attributes.find((elem) => elem.attribute == "willpower");
  let willpowerdots = willpower ? willpower.dots : 0;
  let willpowerStat = new Stat(charid, "willpower", willpowerdots, 10, updateAttributes);
  let willpowerTd = $('<td>').addClass('center').attr('colspan', 2).append(willpowerStat.makeField()); 
  rowTR.append(willpowerTd);
  backgroundsrow++;
  rowTR = getRow(tbl, backgroundsrow, disciplinesrow, advantagesStartRow, 2);
  let willpowerBoxes = new Boxes(charid, "willpowerboxes", 10, 10);
  let willpowerBoxesTd = $('<td>').addClass('center').attr('colspan', 2).append(willpowerBoxes.makeField()); 
  rowTR.append(willpowerBoxesTd);
  backgroundsrow++;

  rowTR = getRow(tbl, backgroundsrow, disciplinesrow, advantagesStartRow, 2);
  rowTR.append( $('<td>').append("&nbsp;") );
  rowTR.append( $('<td>').append("&nbsp;") );
  backgroundsrow++;
  rowTR = getRow(tbl, backgroundsrow, disciplinesrow, advantagesStartRow, 2);
  rowTR.append( makeFancyHeader("Bloodpool", 2, "headertdsmall", false) );
  backgroundsrow++;
  let poolsize = bloodpoolsize[(gendots ? gendots.dots : 0)];
  for(let i=poolsize; i > 0; i -= 10){
    rowTR = getRow(tbl, backgroundsrow, disciplinesrow, advantagesStartRow, 2);
    let bloodpoolBoxes = new Boxes(charid, "bloodpoolboxes", Math.min(i, 10), 10);
    let bloodpoolBoxesTd = $('<td>').addClass('center').attr('colspan', 2).append(bloodpoolBoxes.makeField()); 
    rowTR.append(bloodpoolBoxesTd);
    backgroundsrow++;
  }
  rowTR = getRow(tbl, backgroundsrow, disciplinesrow, advantagesStartRow, 2);
  let perturn = $('<td>').addClass('center').attr('colspan', 2).append("Points Per Turn: ").append(bloodperturn[(gendots ? gendots.dots : 0)]);
  rowTR.append(perturn);
  backgroundsrow++;

  // virtues
  let virtuesrow = 0;
  virtues.forEach((attributeElem) => {
    let rowTR = getRow(tbl, virtuesrow, Math.max(disciplinesrow, backgroundsrow), advantagesStartRow, 4);
    let virtue = attributes.find((elem) => elem.attribute == attributeElem);
    addField(rowTR, charid, attributeElem, 0, 5, virtue, updateAttributes );
    virtuesrow++;
  });

  // health
  virtuesrow = Math.max(virtuesrow+1, humanityrow);
  rowTR = getRow(tbl, virtuesrow, Math.max(disciplinesrow, backgroundsrow), advantagesStartRow, 4);
  rowTR.append( makeFancyHeader("Health", 2, "headertdsmall", false) );
  virtuesrow++;
  for(let i=0; i<healthname.length; i++){
    rowTR = getRow(tbl, virtuesrow, Math.max(disciplinesrow, backgroundsrow), advantagesStartRow, 4);
    rowTR.append( $('<td>').addClass('alignright').append(healthname[i])  );
    let healthBox = new Boxes(charid, "healthbox", 1, 1);
    let penaltyspan = $('<span>').addClass("penaltyspan").attr('name', "penaltyspan").append(healthpenalty[i]);
    let healthBoxTd = $('<td>').addClass('center').append(penaltyspan).append(healthBox.makeField()); 
    rowTR.append(healthBoxTd);
    virtuesrow++;
  }

  // add all of it to the attributes div
  $('#attributes').append(tbl);
}
const bloodpoolsize = [10, 11, 12, 13, 14, 15, 20, 30, 40, 50, 100];
const bloodperturn = [1, 1, 1, 1, 2, 3, 4, 6, 8, 10, 20];
const healthname = ["Bruised", "Hurt", "Injured", "Wounded", "Mauled", "Crippled", "Incapacitated"];
const healthpenalty = ["&nbsp;&nbsp; ", "-1", "-1", "-2", "-2", "-5", "--"];

const attributeArray = [["strength", "charisma", "perception"]
 , ["dexterity", "manipulation", "intelligence"]
 , ["stamina", "appearance", "wits"]];

const abilityArray = [
   ["alertness", "animal ken", "academics"]
 , ["athletics", "crafts", "computer"]
 , ["brawl", "drive", "finance"]
 , ["dodge", "etiquette", "investigation"]
 , ["empathy", "firearms", "law"]
 , ["expression", "melee", "linguistics"]
 , ["intimidation", "performance", "medicine"]
 , ["leadership", "security", "occult"]
 , ["streetwise", "stealth", "politics"]
 , ["subterfuge", "survival", "science"]
];

const backgrounds = [ "allies", "contacts", "fame", "generation", "herd", "influence", "mentor", "resources", "retainers", "status" ];

const virtues = ["conscience", "self-control", "courage"];

const clanlist = ["brujah", "gangrel", "malkavian", "nosferatu", "toreador", "tremere", "ventrue"
 , "lasombre", "tzimisce", "assamite", "followers of set", "giovanni", "ravnos", "caitif"];

const disciplines = [ "animalism", "auspex", "celerity", "chimerstry", "dementation", "dominate", "fortitude", "koldunism"
, "path of earth", "path of fire", "path of spirit", "path of water", "path of wind", "necromancy", "path of sepulchre", "path of bone", "path of ash"
, "obfuscate", "obtenebration", "potence", "presence", "protean", "quietus", "serpentis", "thaumaturgy", "path of blood", "path of flames", "path of movement"
, "path of conjuring", "path of destruction", "vicissitude"];

//////////////////////////////////////////////////////////////
$( document ).ready(function() {
  getCharacters();
  initTools();
})

