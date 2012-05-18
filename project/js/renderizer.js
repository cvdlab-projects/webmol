var RenderizerType = {"ballAndStick" : 0, "vanDerWaals" : 1, "stick" : 2 ,"lines" : 3 } ;

function Renderizer(){
  this.showAxis = false;
  this.quality = 30;
	this.init();
}

Renderizer.prototype.init = function(){
	this.models = [];
  this.maxDistance = 0;
}

Renderizer.prototype.clear = function(){
    for(i in this.models){
      scene.remove(this.models[i]);
    }
    this.init();
  }

Renderizer.prototype.renderize = function(protein, type, setDistance){
  this.clear();
  this.protein = protein;

  if(type == RenderizerType.ballAndStick){
    for(i in protein.atoms){
      this.ballandstick_drawAtom(protein.atoms[i]);
    }
    for (i in protein.bonds){
      this.ballandstick_drawBond(protein.bonds[i]);
      }
    } 
  else if(type == RenderizerType.vanDerWaals){
    for(i in protein.atoms){
      this.vanderwaals_drawAtom(protein.atoms[i]);
    }
    } 
  else if(type == RenderizerType.stick){
    for(i in protein.atoms){
      this.stick_drawAtom(protein.atoms[i]);
    }
    for (i in protein.bonds){
      this.stick_drawBond(protein.bonds[i]);
      }
    } 
  else if(type == RenderizerType.lines){
    for (i in protein.bonds){
      this.lines_drawBond(protein.bonds[i]);
      }
    }
  for(i in this.models){
      scene.add(this.models[i]);
    }
    

    if(setDistance || setDistance==undefined){
      NScamera.setTarget(this.protein.barycenter());
      if(this.maxDistance!=0)
        NScamera.setDistance(this.maxDistance*3);
      else
        NScamera.setDistance(this.protein.maxDistance()*3);
    }
  }

Renderizer.prototype.render = function(type){
  if(type == RenderizerType.lines){
    for (i in protein.bonds){
        this.lines_drawBond(protein.bonds[i]);
    }
  }

  this.drawAxis();
  scene.render();
}

Renderizer.prototype.drawAtom = function(atom, radius){
    var atomSphere = new PhiloGL.O3D.Sphere({
            pickable: true,
            nlat: this.quality,
            nlong: this.quality,
            radius: radius,
            colors: atom.color,
            uniforms: {
              'color': atom.color
            }
        });

    atomSphere.atom = atom;
    atomSphere.radius=radius;
    atomSphere.colors = atom.color;
    atomSphere.position = {
      x: atom.x,
      y: atom.y,
      z: atom.z
    };

    atomSphere.update();
    this.models.push(atomSphere);

    this.maxDistance=Math.max(atom.x+radius, Math.max(atom.y+radius, Math.max(atom.z+radius, this.maxDistance)) );
}

Renderizer.prototype.drawBond = function(v1, v2, col, numeroLegami, radius){
    
    var sub = v1.sub(v2);
    var hC = Math.pow((Math.pow(sub.x, 2) + Math.pow(sub.y, 2) + Math.pow(sub.z, 2)), 0.5);
    var midpoint = v1.add(v2).scale(0.5);
    
    for(l = 1; l<=numeroLegami; l++){
      var bond = new PhiloGL.O3D.Cylinder({
        radius: radius,
        nradial: this.quality,
        height: hC,
        topCap: 1,
        bottomCap: 1,
        colors: col,
        uniforms: {
              'color': col
            }
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

Renderizer.prototype.drawLine = function(p1, p2, color, width){
  program.setBuffers({
    'line': {
      attribute: 'position',
      value: new Float32Array([p1.x,p1.y,p1.z,  p2.x,p2.y,p2.z]),
      size: 3
      }
    });
    if(width==undefined)
      var width = 1;

    gl.lineWidth(width);
    program.setUniform('color', color);
    program.setUniform('nolights', true);
    gl.drawArrays(gl.LINES, 0, 2);
    program.setUniform('nolights', false);
}

Renderizer.prototype.drawAxis = function(){
  if(this.showAxis){
    var c = NScamera.center;
    var orig = new PhiloGL.Vec3(c[0], c[1], c[2]);
    var xAxis = new PhiloGL.Vec3(1, 0, 0);
    var yAxis = new PhiloGL.Vec3(0, 1, 0);
    var zAxis = new PhiloGL.Vec3(0, 0, 1);
    
    var width = 2;
    this.drawLine(orig, orig.add(xAxis), [1,0,0,1], width);
    this.drawLine(orig, orig.add(yAxis), [0,1,0,1], width);
    this.drawLine(orig, orig.add(zAxis), [0,0,1,1], width);
  }
}

// BALL AND STICK VISUALIZATION

Renderizer.prototype.ballandstick_drawAtom = function(atom){
    this.drawAtom(atom, atom.radius);
  }

  Renderizer.prototype.ballandstick_drawBond = function(bond) {
    var atom1 = this.protein.atoms[bond.idSource];
    var atom2 = this.protein.atoms[bond.idTarget];
    var legami = bond.bondType;

    var v1 = new PhiloGL.Vec3(atom1.x, atom1.y, atom1.z);
    var v2 = new PhiloGL.Vec3(atom2.x, atom2.y, atom2.z);

    var color = [1,1,1,1];
    var radius = this.protein.minRadius()/8;
    this.drawBond(v1, v2, color, legami, radius);
  }

// BALL AND STICK VISUALIZATION END
  

// STICK VISUALIZATION

Renderizer.prototype.stick_drawAtom = function(atom){
    this.drawAtom(atom, atom.radius);
  }

  Renderizer.prototype.stick_drawBond = function(bond) {
    var atom1 = this.protein.atoms[bond.idSource];
    var atom2 = this.protein.atoms[bond.idTarget];
    var legami = bond.bondType;

    var v1 = new PhiloGL.Vec3(atom1.x, atom1.y, atom1.z);
    var v2 = new PhiloGL.Vec3(atom2.x, atom2.y, atom2.z);
    var midpoint = v1.add(v2).scale(0.5);
    this.drawBond(v1,midpoint,atom1.color,1,atom1.radius);
    this.drawBond(midpoint,v2,atom2.color,1,atom2.radius);
  }

// STICK VISUALIZATION END

// VANDERWAALS VISUALIZATION

Renderizer.prototype.vanderwaals_drawAtom = function(atom){
    this.drawAtom(atom, atom.vanDerWaalsRadius);
  }

// VANDERWAALS VISUALIZATION END

// LINES VISUALIZATION

Renderizer.prototype.lines_drawBond = function(bond) {
  
    var atom1 = this.protein.atoms[bond.idSource];
    var atom2 = this.protein.atoms[bond.idTarget];
    var legami = bond.bondType;

    var v1 = new PhiloGL.Vec3(atom1.x, atom1.y, atom1.z);
    var v2 = new PhiloGL.Vec3(atom2.x, atom2.y, atom2.z);
    var midpoint = v1.add(v2).scale(0.5);

    this.drawLine(v1, midpoint, atom1.color);
    this.drawLine(midpoint, v2, atom2.color);
}

// LINES VISUALIZATION END

  