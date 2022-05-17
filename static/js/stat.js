class Stat {
  constructor(character, name, dots, width, callback){
    this.character = character;
    this.name = name;
    this.dots = dots;
    this.width = width;
    this.callback = callback;
  }

  makeCircle(isfull) {
    let empty = "static/images/circle_empty.png";
    let full = "static/images/circle_full.png"
    let imgsrc = isfull ? full : empty;
    let imgclass = isfull ? "circle_full" : "circle_empty";
    let circle = $('<img class='+imgclass+' src='+imgsrc+' >');
    circle.off().on('click', this.callback, this.switch_fill);
    return circle;
  }
  switch_fill(thiscircle) {
    function fill_off(mycircle) {
      mycircle.className = "circle_empty";
      mycircle.src = "static/images/circle_empty.png";
      let nextsib = mycircle.nextSibling;
      if(nextsib) {
        fill_off(nextsib);
      }
    }
    function fill_on(mycircle) {
      mycircle.className = "circle_full";
      mycircle.src = "static/images/circle_full.png";
      let prevsib = mycircle.previousSibling;
      if(prevsib) {
        fill_on(prevsib);
      }
    }
    if(thiscircle.target.className == "circle_full") {
      fill_off(thiscircle.target);
    } else {
      fill_on(thiscircle.target);
    }
    console.log(thiscircle);
    let parts = thiscircle.target.parentNode.id.split('_');
    let mspan = $(thiscircle.target.parentNode).children("img.circle_full");
    //console.log(parts[0], parts[1], mspan.length);
    thiscircle.data(parts[0], parts[1], mspan.length);
  }

  makeField() {
    let spanid = this.character+'_'+this.name;
    let field = $('<span class="attribute center">').attr('id', spanid).attr('name', this.name);
    //let label = $('<label>').append(this.name+": ");
    //field.append(label);
    for(let i=1; i<=this.width; i++){
      field.append(this.makeCircle(i<=this.dots));
    }
    return field;
  }
}
