var RenderizerType = {"ballAndStick" : 0, "vanDerWaals" : 1, "stick" : 2 , "lines" : 3 } ;
var idMatrix = new PhiloGL.Mat4();
var STICK_RADIUS = 0.2;
var BALLANDSTICK_RADIUS = 0.4;
var BACKBONE_RADIUS = 0.2;
var LIGHT_AMBIENT = {r: 0.2, g: 0.2, b: 0.2};
var LIGHT_DIRECTIONAL = {
    color: {r: 1,g: 1,b: 1},
    direction: {x: -0.2,y: -0.2,z: -1.0}
  };

function Renderizer(){
  this.showAxis = false;
  this.init();
}

Renderizer.prototype.init = function(){
  this.models = [];
}


Renderizer.prototype.setupLight = function(){
  var lights = scene.config.lights;
  lights.enable = true;
  lights.ambient = LIGHT_AMBIENT;
  lights.directional = LIGHT_DIRECTIONAL;

  /*lights.points = [];

  function createLightPoint(x, y, z, r, g, b, spec){
     var l = new Object();
     l.position = { x: x, y: y, z: z };
     l.diffuse = { r: r, g: g, b: b };
     if(spec==true){
        l.specular = { r: 1, g: 1, b: 1 };
     }
     return l;
  }
  var r=g=b=0.2;
  lights.points.push(createLightPoint(5, 10, 0, r, g, b, true));*/
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

  // DA RIMUOVERE
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
    // FINE DA RIMUOVERE

    if(setDistance || setDistance==undefined){
      NScamera.setTarget(this.protein.barycenter());
      NScamera.setDistance(this.protein.maxDistance()*3);
    }

    this.objects = {};
    var q = [5, 10, 15, 20, 25, 30];
    for(var i in q){
      var quality = q[i];
      var sphere = new PhiloGL.O3D.Sphere({nlat: quality, nlong: quality, radius: 1.0 });
      scene.defineBuffers(sphere);
      this.objects['sphere'+quality] = sphere;

      var cylinder = new PhiloGL.O3D.Cylinder({nradial: quality, height: 1.0, topCap: 1, bottomCap: 1, radius: 1.0 });
      scene.defineBuffers(cylinder);
      this.objects['cylinder'+quality] = cylinder;
    }

    this.distObj = [[5,30],[25,25],[50,20],[75,15],[100, 10], [5]];

    this.precalculateMatrix();

    this.render(type);
  }

Renderizer.prototype.renderObject = function(obj, position, color, scale, matrix) {
      var view = camera.view, projection = camera.projection;

      if(matrix!=undefined){
        var object = matrix;
      } else{
        var object = obj.matrix;
      }

      var world = view.mulMat4(object),
          worldInverse = world.invert(),
          worldInverseTranspose = worldInverse.transpose();

      obj.setState(program);

      program.setUniforms({
        objectMatrix: object,
        worldMatrix: world,
        worldInverseMatrix: worldInverse,
        worldInverseTransposeMatrix: worldInverseTranspose,
        translateVertex: position,
        color: color,
        scaleVertex: scale
      });

      gl.drawElements((obj.drawType !== undefined) ? gl.get(obj.drawType) : gl.TRIANGLES, obj.$indicesLength, gl.UNSIGNED_SHORT, 0);
        
      obj.unsetState(program);

      this.numobjects++;
}

Renderizer.prototype.render = function(type){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  this.numobjects = 0;

  if(type == RenderizerType.lines){
    for (var i in protein.bonds){
        this.lines_drawBond(protein.bonds[i]);
    }
  } else {
    this.renderScene();
  }

  this.drawAxis();
  this.drawBackBone();

  $id('objects').innerHTML = this.numobjects;
}

Renderizer.prototype.renderScene = function(){
    function getAtomRadius(atom){
        if(type == RenderizerType.ballAndStick)
          return BALLANDSTICK_RADIUS;
        else if(type == RenderizerType.vanDerWaals)
          return atom.vanDerWaalsRadius;
        else if(type == RenderizerType.stick)
          return STICK_RADIUS;
      }
    scene.beforeRender(program);
    
    for(var i in this.protein.atoms){
      var atom = this.protein.atoms[i];
      var position = new PhiloGL.Vec3(atom.x, atom.y, atom.z);
      var color = atom.color;
      var selected = atom==this.protein.selectedAtom || (atom.resSeq!=undefined && this.protein.selectedAtom!=undefined && atom.resSeq==this.protein.selectedAtom.resSeq);
      var radius = getAtomRadius(atom);

      this.sphere(position, color, radius, selected);
    }

    for(var i in this.protein.bonds) {
      var bond = this.protein.bonds[i];
      var atom1 = this.protein.atoms[bond.idSource];
      var atom2 = this.protein.atoms[bond.idTarget];
      var legami = bond.bondType;

      var v1 = new PhiloGL.Vec3(atom1.x, atom1.y, atom1.z);
      var v2 = new PhiloGL.Vec3(atom2.x, atom2.y, atom2.z);
      var mid = v1.add(v2).scale(0.5);
      var sub = v1.sub(v2);
      var hC = Math.pow((Math.pow(sub.x, 2) + Math.pow(sub.y, 2) + Math.pow(sub.z, 2)), 0.5);
      
      function getStickRadius(){
          if(type == RenderizerType.ballAndStick)
            return BALLANDSTICK_RADIUS/8;
          else if(type == RenderizerType.stick)
            return STICK_RADIUS;
        }

      if(type == RenderizerType.ballAndStick){
        this.bond(v1, v2, bond.matrix1, [1,1,1,1], getStickRadius());
      }
      else if(type == RenderizerType.stick){
        this.bond(v1, mid, bond.matrix2, atom1.color, getStickRadius());
        this.bond(mid, v2, bond.matrix3, atom2.color, getStickRadius());
      }
    }
}

Renderizer.prototype.getObject = function(objName, distrad){
  for(var i in this.distObj){
    var arr = this.distObj[i];
    
    if(arr.length>1){
      var dist = arr[0];
      if(distrad<dist){
        var obj = this.objects[objName+arr[1]];
        break;
      }
    } else{
      var obj = this.objects[objName+arr[0]];
    }
  }
  return obj;
}

Renderizer.prototype.sphere = function(position, color, radius, selected){
  if(culling.isSphereInFrustum(position, radius)){
      var scale = [radius, radius, radius];
      var distance = camera.position.distTo(position);

      var obj = this.getObject('sphere', distance/radius);
      
      program.setUniform("enablePicking", selected);
      this.renderObject(obj, position, color, scale);  
   }
}

Renderizer.prototype.bond = function (v1, v2, matrix, color, radius){
    var midpoint = v1.add(v2).scale(0.5);
    var sub = v1.sub(v2);
    var hC = Math.pow((Math.pow(sub.x, 2) + Math.pow(sub.y, 2) + Math.pow(sub.z, 2)), 0.5);
    if(culling.isSphereInFrustum(midpoint, hC/2)){
      var bondDirection = v1.sub(v2).unit();
      var cylinderDirection = new PhiloGL.Vec3(0, 1, 0);
      var angle = Math.acos(bondDirection.dot(cylinderDirection));
      var axis = cylinderDirection.$cross(bondDirection).$unit();
      var distance = camera.position.distTo(midpoint);
      var obj = this.getObject('cylinder', distance/radius);
      this.renderObject(obj, midpoint, color, [radius,hC,radius], matrix);
    }      
}

Renderizer.prototype.cylinderMatrix = function(v1, v2){
  var midpoint = v1.add(v2).scale(0.5);
  var sub = v1.sub(v2);
  var hC = Math.pow((Math.pow(sub.x, 2) + Math.pow(sub.y, 2) + Math.pow(sub.z, 2)), 0.5);
  var bondDirection = v1.sub(v2).unit();
  var cylinderDirection = new PhiloGL.Vec3(0, 1, 0);
  var angle = Math.acos(bondDirection.dot(cylinderDirection));
  var axis = cylinderDirection.$cross(bondDirection).$unit();
  var matrix = new PhiloGL.Mat4();
  matrix.id();
  matrix.$translate(midpoint.x, midpoint.y, midpoint.z);
  matrix.$rotateAxis(angle, axis);
  matrix.$translate(-midpoint.x, -midpoint.y, -midpoint.z);
  return matrix;
}

Renderizer.prototype.precalculateMatrix = function(){
  for(var i in this.protein.bonds) {
    var bond = this.protein.bonds[i];
    var atom1 = this.protein.atoms[bond.idSource];
    var atom2 = this.protein.atoms[bond.idTarget];
    var legami = bond.bondType;

    var v1 = new PhiloGL.Vec3(atom1.x, atom1.y, atom1.z);
    var v2 = new PhiloGL.Vec3(atom2.x, atom2.y, atom2.z);
    var midpoint = v1.add(v2).scale(0.5);

    bond.matrix1 = this.cylinderMatrix(v1, v2);
    bond.matrix2 = this.cylinderMatrix(v1, midpoint);
    bond.matrix3 = this.cylinderMatrix(midpoint, v2);
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
    program.setUniform('scaleVertex', [1,1,1]);
    program.setUniform('translateVertex', [0,0,0]);
    program.setUniform('matrixRotation', idMatrix);
    program.setUniform('worldMatrix', camera.view);
    program.setUniform('projectionMatrix', camera.projection);
    program.setUniform('enableLights', false);
    gl.drawArrays(gl.LINES, 0, 2);
    program.setUniform('enableLights', true);
}

Renderizer.prototype.drawBackBone = function(){
  var colorsChain = {};
  colorsChain['A'] = [0,0,1,1];
  colorsChain['B'] = [0,1,0,1];
  colorsChain['C'] = [1,0,0,1];
  colorsChain['D'] = [1,1,0,1];

  var atomsChain = this.protein.getAtomsWithKeyChain();
  for(var key in atomsChain){
    var atoms = atomsChain[key];

    var backbonePoints = [];
    for(var x in atoms){
      var atom = atoms[x];
      
      if(atom.isbone == true){
        backbonePoints.push(new PhiloGL.Vec3(atom.x, atom.y, atom.z));
      }
    }

    for(var x = 0; x < backbonePoints.length ; x++){
      var p1 = backbonePoints[x];
      var color = colorsChain[key];
      var radius = BACKBONE_RADIUS;
      this.sphere(p1, color, radius);

      if(backbonePoints.length>x+1){
        var p2 = backbonePoints[x+1];
        if(backbonePoints.length>x+2){
           var direction = p1.sub(p2).unit();
           var p3 = backbonePoints[x+2];
           var sb = p2.sub(p3).unit();
           var dist = direction.distTo(sb);
           if(Math.abs(dist)<=BACKBONE_RADIUS){
              p2 = p3;
              x++;
           }
        }
        var matrix = this.cylinderMatrix(p1, p2);
        this.bond(p1, p2, matrix, color, radius);
      }
    }
  }
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






// Funzioni del vecchio Renderizer


Renderizer.prototype.drawAtom = function(atom, radius){
    var atomSphere = new PhiloGL.O3D.Sphere({
            pickable: true,
            nlat: 15,
            nlong: 15,
            radius: radius,
            colors: atom.color,
            uniforms: {
              'color': atom.color,
              'scaleVertex': [1, 1, 1]
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

    //this.maxDistance=Math.max(atom.x+radius, Math.max(atom.y+radius, Math.max(atom.z+radius, this.maxDistance)) );
}

Renderizer.prototype.drawBond = function(v1, v2, col, numeroLegami, radius){
    
    var sub = v1.sub(v2);
    var hC = Math.pow((Math.pow(sub.x, 2) + Math.pow(sub.y, 2) + Math.pow(sub.z, 2)), 0.5);
    var midpoint = v1.add(v2).scale(0.5);
    
    for(l = 1; l<=numeroLegami; l++){
      var bond = new PhiloGL.O3D.Cylinder({
        radius: radius,
        nradial: 15,
        height: hC,
        topCap: 1,
        bottomCap: 1,
        colors: col,
        uniforms: {
              'color': col,
              'scaleVertex': [1, 1, 1]
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

// BALL AND STICK VISUALIZATION

Renderizer.prototype.ballandstick_drawAtom = function(atom){
    this.drawAtom(atom, BALLANDSTICK_RADIUS);
  }

  Renderizer.prototype.ballandstick_drawBond = function(bond) {
    var atom1 = this.protein.atoms[bond.idSource];
    var atom2 = this.protein.atoms[bond.idTarget];
    var legami = bond.bondType;

    var v1 = new PhiloGL.Vec3(atom1.x, atom1.y, atom1.z);
    var v2 = new PhiloGL.Vec3(atom2.x, atom2.y, atom2.z);

    var color = [1,1,1,1];
    var radius = BALLANDSTICK_RADIUS/8;
    this.drawBond(v1, v2, color, legami, radius);
  }

// BALL AND STICK VISUALIZATION END
  

// STICK VISUALIZATION

Renderizer.prototype.stick_drawAtom = function(atom){
    this.drawAtom(atom, BALLANDSTICK_RADIUS);
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

