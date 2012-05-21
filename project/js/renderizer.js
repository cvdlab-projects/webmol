var RenderizerType = {"ballAndStick" : 0, "vanDerWaals" : 1, "stick" : 2 ,"lines" : 3 } ;
var idMatrix = new PhiloGL.Mat4();
var STICK_RADIUS = 0.2;

function Renderizer(){
  this.showAxis = false;
  this.quality = 15;
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

    if(type==RenderizerType.vanDerWaals)
      this.distObj = [[5,30],[10,25],[15,20],[30,15],[10]];
    else
      this.distObj = [[1,30],[5,25],[10,20],[15,15],[10]];

    this.render(type);
  }



Renderizer.prototype.renderObject = function(obj, position, color, scale, theta, axis) {
      var view = camera.view,
          projection = camera.projection;
      
      if(theta!=undefined && axis!=undefined){
        obj.matrix.id();
        obj.matrix.$translate(position.x, position.y, position.z);
        obj.matrix.$rotateAxis(theta, axis);
        position = new PhiloGL.Vec3(0, 0, 0);
      }

      var object = obj.matrix,
          world = view.mulMat4(object),
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
        scaleVertex: scale,
        angleRotationVertex: theta,
        axisRotationVertex: axis
      });

      gl.drawElements((obj.drawType !== undefined) ? gl.get(obj.drawType) : gl.TRIANGLES, obj.$indicesLength, gl.UNSIGNED_SHORT, 0);
        
      obj.unsetState(program);

      this.numobjects++;
}

Renderizer.prototype.render = function(type){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  this.numobjects = 0;
  this.drawAxis();

  if(type == RenderizerType.lines){
    for (i in protein.bonds){
        this.lines_drawBond(protein.bonds[i]);
    }
  } else {
    function getAtomRadius(atom){
      if(type == RenderizerType.ballAndStick)
        return atom.radius;
      else if(type == RenderizerType.vanDerWaals)
        return atom.vanDerWaalsRadius;
      else if(type == RenderizerType.stick)
        return STICK_RADIUS;
    }

    if(1==0){
      scene.render();
    } else{
      scene.beforeRender(program);
      
      for(var i in this.protein.atoms){
        var atom = this.protein.atoms[i];
        var position = new PhiloGL.Vec3(atom.x, atom.y, atom.z);
        var radius = getAtomRadius(atom);

        if(culling.isSphereInFrustum(position, radius)){
          var scale = [radius, radius, radius];
          var color = atom.color;
          var distance = camera.position.distTo(position);

              var obj;
          for(var i in this.distObj){
            var arr = this.distObj[i];
            
            if(arr.length>1){
              var dist = arr[0];
              if(distance<dist){
                obj = this.objects['sphere'+arr[1]];
                break;
              }
            } else{
              obj = this.objects['sphere'+arr[0]];
            }
          }
          
          program.setUniform("enablePicking", atom.selected);
          this.renderObject(obj, position, color, scale);
          
        }
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
        
        if(culling.isSphereInFrustum(mid, hC/2)){
          if(type == RenderizerType.ballAndStick){
            this.bond(v1, v2, [1,1,1,1]);
          }
          else if(type == RenderizerType.stick){
            this.bond(v1, mid, atom1.color);
            this.bond(mid, v2, atom2.color);
          }
        }
      }
    }
  }
  $id('objects').innerHTML = this.numobjects;
}
Renderizer.prototype.bond = function (v1, v2, color){
        function getStickRadius(){
            if(type == RenderizerType.ballAndStick)
              return this.protein.minRadius()/8;
            else if(type == RenderizerType.stick)
              return STICK_RADIUS;
          }

        var radius = getStickRadius();
        var midpoint = v1.add(v2).scale(0.5);
        var sub = v1.sub(v2);
        var hC = Math.pow((Math.pow(sub.x, 2) + Math.pow(sub.y, 2) + Math.pow(sub.z, 2)), 0.5);
        
        var bondDirection = v1.sub(v2).unit();
        var cylinderDirection = new PhiloGL.Vec3(0, 1, 0);
        var angle = Math.acos(bondDirection.dot(cylinderDirection));
        var axis = cylinderDirection.$cross(bondDirection).$unit();
        this.renderObject(this.objects['cylinder15'], midpoint, color, [radius,hC,radius], angle, axis);
      }

Renderizer.prototype.drawAtom = function(atom, radius){
    var atomSphere = new PhiloGL.O3D.Sphere({
            pickable: true,
            nlat: this.quality,
            nlong: this.quality,
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
    program.setUniform('matrixRotation', idMatrix);
    program.setUniform('scaleVertex', [1,1,1]);
    program.setUniform('worldMatrix', camera.view);
    program.setUniform('projectionMatrix', camera.projection);
    program.setUniform('enableLights', false);
    gl.drawArrays(gl.LINES, 0, 2);
    program.setUniform('enableLights', true);
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

