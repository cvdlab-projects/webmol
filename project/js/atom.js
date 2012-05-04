  // Atom Class

  function Atom(id, name, x, y, z, color, radius, vanDerWaalsRadius){
    this.id = id;
	this.name = name;
	this.x = x;
	this.y = y;
	this.z = z;
	this.color = color;
	this.radius = radius;
	this.vanDerWaalsRadius = vanDerWaalsRadius;
  }

  // Bond Class

  function Bond(idS, idT, bondT){
    this.idSource = idS; 
	this.idTarget = idT;
	this.bondType = bondT;
  }