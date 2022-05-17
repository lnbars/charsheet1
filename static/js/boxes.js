class Boxes {
  constructor(character, name, dots, width){
    this.character = character;
    this.name = name;
    this.dots = dots;
    this.width = width;
  }

  makeCircle(isfull) {
    let empty = "static/images/box_empty.png";
    let full = "static/images/box_full.png"
    let imgsrc = isfull ? full : empty;
    let imgclass = isfull ? "circle_full" : "circle_empty";
    let box = $('<img class='+imgclass+' src='+imgsrc+' >');
    return box;
  }

  makeField() {
    let spanid = this.character+'_'+this.name;
    let field = $('<span class="attribute">').attr('id', spanid).attr('name', this.name);
    for(let i=1; i<=this.width; i++){
      field.append(this.makeCircle(i>this.dots));
    }
    return field;
  }
}
