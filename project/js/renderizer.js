var RenderizerType = {"ballAndStick" : 0, "vanDerWaals" : 1, "stick" : 2 , "lines" : 3, "backBone": 4 } ;
var idMatrix = new PhiloGL.Mat4();
var STICK_RADIUS = 0.2;
var BALLANDSTICK_RADIUS = 0.4;
var BACKBONE_RADIUS = 0.6;
var LIGHT_AMBIENT = {r: 0.2, g: 0.2, b: 0.2};
var LIGHT_DIRECTIONAL = {
    color: {r: 0.8,g: 0.8,b: 0.8},
    direction: {x: 0,y: 0,z: -1.0}
  };
var colorsChain = {};
colorsChain['A'] = [0,0,1,1];
colorsChain['B'] = [0,1,0,1];
colorsChain['C'] = [1,0,0,1];
colorsChain['D'] = [1,1,0,1];



function Renderizer(){
  this.showAxis = false;
  this.init();
}

Renderizer.prototype.init = function(){
  this.models = [];
  this.objmodels = {};
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
    }

    for(i in this.models){
      scene.add(this.models[i]);
    }
    // FINE DA RIMUOVERE

    if(setDistance || setDistance==undefined){
      var barycenter = this.protein.barycenter();
      NScamera.setTarget(barycenter);
      NScamera.setDistance((this.protein.maxDistance())*1.5);
    }

    this.objects = {};
    var q = [5, 10, 20, 30];
    for(var i in q){
      var quality = q[i];
      var sphere = new PhiloGL.O3D.Sphere({nlat: quality, nlong: quality, radius: 1.0 });
      scene.defineBuffers(sphere);
      this.objects['sphere'+quality] = sphere;

      var cylinder = new PhiloGL.O3D.Cylinder({nradial: quality, height: 1.0, radius: 1.0 });
      scene.defineBuffers(cylinder);
      this.objects['cylinder'+quality] = cylinder;
    }

    this.distObj = [[5,30],[75,20],[150, 10], [5]];

    this.precalculateMatrix();

    this.createScene();

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

      this.numobjects++;
}

Renderizer.prototype.render = function(type,color){
  

  if(color)
    gl.clearColor(hexToR(color)/255.0,hexToG(color)/255.0,hexToB(color)/255.0,1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  this.numobjects = 0;

  this.objmodels = {};

  if(type == RenderizerType.backBone || ($id('viewBackBone').checked && type != RenderizerType.vanDerWaals))
    this.drawBackBone();

  if(type == RenderizerType.lines){
    for (var i in protein.bonds){
        this.lines_drawBond(protein.bonds[i]);
    }
  } else if(type != RenderizerType.backBone){
    this.createScene();
  }

  this.renderScene();

  this.drawAxis();

  //$id('objects').innerHTML = this.numobjects;
}

Renderizer.prototype.renderScene = function(){
    scene.beforeRender(program);
    // Method for pseudo-instancing (set buffer once per object to render)
    for(var objname in this.objmodels){
      var obj = this.objects[objname];
      obj.setState(program);

      var objs = this.objmodels[objname];
      for(var x in objs){
        var args = objs[x];
        var sel = args[4];
        if(sel) program.setUniform("enablePicking", true);
        this.renderObject(obj, args[0], args[1], args[2], args[3]);  
        if(sel) program.setUniform("enablePicking", false);
      }

      obj.unsetState(program);
    }
}

Renderizer.prototype.createScene = function(){
    function getAtomRadius(atom){
        if(type == RenderizerType.ballAndStick)
          return BALLANDSTICK_RADIUS;
        else if(type == RenderizerType.vanDerWaals)
          return atom.vanDerWaalsRadius;
        else if(type == RenderizerType.stick)
          return STICK_RADIUS;

      }
    
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
        var objname = objName+arr[1];
        var obj = this.objects[objname];
        break;
      }
    } else{
      var objname = objName+arr[0];
      var obj = this.objects[objname];
    }
  }
  return [objname, obj];
}

Renderizer.prototype.sphere = function(position, color, radius, selected){
  if(culling.isSphereInFrustum(position, radius)){
      var scale = [radius, radius, radius];
      var distance = camera.position.distTo(position);

      var iobj = this.getObject('sphere', distance/radius);
      var objname = iobj[0];
      var obj = iobj[1];

      if(this.objmodels[objname]==undefined)
        this.objmodels[objname] = [];
      this.objmodels[objname].push([position, color, scale, undefined, selected]);
   }
}

Renderizer.prototype.bond = function (v1, v2, matrix, color, radius){
    var midpoint = v1.add(v2).scale(0.5);
    var sub = v1.sub(v2);
    var hC = Math.pow((Math.pow(sub.x, 2) + Math.pow(sub.y, 2) + Math.pow(sub.z, 2)), 0.5);
    if(culling.isSphereInFrustum(midpoint, hC/2)){
      var scale = [radius,hC,radius];
      var distance = camera.position.distTo(midpoint);

      var iobj = this.getObject('cylinder', distance/radius);
      var objname = iobj[0];
      var obj = iobj[1];

      if(this.objmodels[objname]==undefined)
        this.objmodels[objname] = [];
      this.objmodels[objname].push([midpoint, color, scale, matrix, false]);
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

    function getBackboneRadius(){
      if(type == RenderizerType.ballAndStick)
        return BALLANDSTICK_RADIUS/2;
      else if(type == RenderizerType.stick)
        return STICK_RADIUS + 0.1;
      else if(type == RenderizerType.lines)
        return 0.1;
      else if(type == RenderizerType.backBone)
        return BACKBONE_RADIUS;
    }

    for(var x = 0; x < backbonePoints.length ; x++){
      var p1 = backbonePoints[x];
      var color = colorsChain[key];
      var radius = getBackboneRadius();
      this.sphere(p1, color, radius);

      if(backbonePoints.length>x+1){
        var p2 = backbonePoints[x+1];
        if(backbonePoints.length>x+2){
           var direction = p1.sub(p2).unit();
           var p3 = backbonePoints[x+2];
           var sb = p2.sub(p3).unit();
           var dist = direction.distTo(sb);
           if(Math.abs(dist)<=radius){
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
}

// BALL AND STICK VISUALIZATION
Renderizer.prototype.ballandstick_drawAtom = function(atom){
  this.drawAtom(atom, BALLANDSTICK_RADIUS);
}
// BALL AND STICK VISUALIZATION END

// STICK VISUALIZATION

Renderizer.prototype.stick_drawAtom = function(atom){
  this.drawAtom(atom, BALLANDSTICK_RADIUS);
}
// STICK VISUALIZATION END

// VANDERWAALS VISUALIZATION

Renderizer.prototype.vanderwaals_drawAtom = function(atom){
  this.drawAtom(atom, atom.vanDerWaalsRadius);
}
// VANDERWAALS VISUALIZATION END


