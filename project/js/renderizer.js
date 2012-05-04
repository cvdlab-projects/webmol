var RenderizerType = {"ballAndStick" : 0, "vanDerWaals" : 1, "stick" : 2 } ;

function Renderizer(){
	this.init();
}

Renderizer.prototype.init = function(){
	this.models = [];
}

Renderizer.prototype.clear = function(){
    for(i in this.models){
      scene.remove(this.models[i]);
    }
    this.init();
  }

Renderizer.prototype.renderize = function(protein, type){
  this.clear();
  this.protein = protein;

  if(type == RenderizerType.ballAndStick){
    for(i in protein.atoms){
      this.ballandstick_drawAtom(protein.atoms[i]);
    }
    for (i in protein.bonds){
      this.ballandstick_drawBond(protein.bonds[i]);
      }
    } else if(type == RenderizerType.vanDerWaals){
    for(i in protein.atoms){
      this.vanderwaals_drawAtom(protein.atoms[i]);
    }
    for (i in protein.bonds){
      this.vanderwaals_drawBond(protein.bonds[i]);
      }
    } else if(type == RenderizerType.stick){
    for(i in protein.atoms){
      this.stick_drawAtom(protein.atoms[i]);
    }
    for (i in protein.bonds){
      this.stick_drawBond(protein.bonds[i]);
      }
    } 

  for(i in this.models){
      scene.add(this.models[i]);
    }
    NScamera.setTarget(this.protein.barycenter()); 
  }

Renderizer.prototype.createBond = function(v1, v2, col, numeroLegami, radius){
    
    var sub = v1.sub(v2);
    var hC = Math.pow((Math.pow(sub.x, 2) + Math.pow(sub.y, 2) + Math.pow(sub.z, 2)), 0.5);
    var midpoint = v1.add(v2).scale(0.5);
    
    for(l = 1; l<=numeroLegami; l++){
      var bond = new PhiloGL.O3D.Cylinder({
        radius: radius,
        nradial: 30,
        height: hC,
        topCap: 1,
        bottomCap: 1,
        colors: col
      });
    
      bond.matrix.$translate(midpoint.x, midpoint.y, midpoint.z);
      var bondDirection = v1.sub(v2).unit();
      var cylinderDirection = new PhiloGL.Vec3(0, 1, 0);
      var angle = Math.acos(bondDirection.dot(cylinderDirection));
      var axis = cylinderDirection.$cross(bondDirection).$unit();
      bond.matrix.$rotateAxis(angle, axis);
      if(numeroLegami>=2){
      	var bondDistance = radius*2;
        if(l==1){
          bond.matrix.$translate(bondDistance, 0, 0);
        }
        if(l==2){
          bond.matrix.$translate(-bondDistance, 0, 0);
        }
      }
      this.models.push(bond);
    }
  }

Renderizer.prototype.createAtom = function(atom, radius){
    var atomSphere = new PhiloGL.O3D.Sphere({
            nlat: 30,
            nlong: 30,
            radius: radius,
            colors: atom.color
        });

    atomSphere.radius=radius;
    atomSphere.colors = atom.color;
    atomSphere.position = {
      x: atom.x,
      y: atom.y,
      z: atom.z
    };
    atomSphere.update();
    this.models.push(atomSphere);
}

// BALL AND STICK VISUALIZATION

Renderizer.prototype.ballandstick_drawAtom = function(atom){
    this.createAtom(atom, atom.radius);
  }

  Renderizer.prototype.ballandstick_drawBond = function(bond) {
    var atom1 = this.protein.atoms[bond.idSource];
    var atom2 = this.protein.atoms[bond.idTarget];
    var legami = bond.bondType;

    var v1 = new PhiloGL.Vec3(atom1.x, atom1.y, atom1.z);
    var v2 = new PhiloGL.Vec3(atom2.x, atom2.y, atom2.z);

    var color = [1,1,1,1];
    var radius = this.protein.minRadius()/8;
    this.createBond(v1, v2, color, legami, radius);
  }

// BALL AND STICK VISUALIZATION END
  

// STICK VISUALIZATION

Renderizer.prototype.stick_drawAtom = function(atom){
    this.createAtom(atom, atom.radius);
  }

  Renderizer.prototype.stick_drawBond = function(bond) {
    var atom1 = this.protein.atoms[bond.idSource];
    var atom2 = this.protein.atoms[bond.idTarget];
    var legami = bond.bondType;

    var v1 = new PhiloGL.Vec3(atom1.x, atom1.y, atom1.z);
    var v2 = new PhiloGL.Vec3(atom2.x, atom2.y, atom2.z);
    var midpoint = v1.add(v2).scale(0.5);
    this.createBond(v1,midpoint,atom1.color,1,atom1.radius);
    this.createBond(midpoint,v2,atom2.color,1,atom2.radius);
  }

// STICK VISUALIZATION END


// VANDERWAALS VISUALIZATION

Renderizer.prototype.vanderwaals_drawAtom = function(atom){
    this.createAtom(atom, atom.vanDerWaalsRadius);
  }

  Renderizer.prototype.vanderwaals_drawBond = function(bond) {
    // Van Der Waals non deve disegnare i legami
  }

// VANDERWAALS VISUALIZATION END

  