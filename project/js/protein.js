  // Protein Class

  function Protein(){
    this.init();
  }

  Protein.prototype.init = function(){
    this.atoms = new Array();
    this.bonds = new Array();
    this.barycenter = new PhiloGL.Vec3(0,0,0);
    this.minAtomRadius = 0;
  }

  Protein.prototype.renderize = function(){
    for(i in this.atoms){
      scene.add(this.atoms[i]);
    }
    for(i in this.bonds){
      scene.add(this.bonds[i]);
    }
  }

  Protein.prototype.clear = function(){
    for(i in this.atoms){
      scene.remove(this.atoms[i]);
    }
    for(i in this.bonds){
      scene.remove(this.bonds[i]);
    }
    this.init();
  }

  Protein.prototype.createBond = function(i, j, numeroLegami){
    var atom1 = this.atoms[i];
    var atom2 = this.atoms[j];

    var v1 = new PhiloGL.Vec3(atom1.position.x, atom1.position.y, atom1.position.z);
    var v2 = new PhiloGL.Vec3(atom2.position.x, atom2.position.y, atom2.position.z);
    var sub = v1.sub(v2);
    var hC = Math.pow((Math.pow(sub.x, 2) + Math.pow(sub.y, 2) + Math.pow(sub.z, 2)), 0.5);
    var midpoint = v1.add(v2).scale(0.5);

    var radius = this.minAtomRadius/4;
    var bondDistance = radius*2;

    for(l = 1; l<=numeroLegami; l++){
      var bond = new PhiloGL.O3D.Cylinder({
        radius: radius,
        nradial: 30,
        height: hC,
        topCap: 1,
        bottomCap: 1,
        colors: [1, 1, 1, 1]
      });

      bond.matrix.$translate(midpoint.x, midpoint.y, midpoint.z);

      var bondDirection = v1.sub(v2).unit();
      var cylinderDirection = new PhiloGL.Vec3(0, 1, 0);
      var angle = Math.acos(bondDirection.dot(cylinderDirection));
      var axis = cylinderDirection.$cross(bondDirection).$unit();
      bond.matrix.$rotateAxis(angle, axis);
      if(numeroLegami>=2){
        if(l==1){
          bond.matrix.$translate(bondDistance, bondDistance, bondDistance);
        }
        if(l==2){
          bond.matrix.$translate(-bondDistance, -bondDistance, -bondDistance);
        }
      }
      this.bonds.push(bond);
    }
  }

  Protein.prototype.randomizePosition = function(atom){
    var max = 12;
    var mid = (max-1)/2;
    x = Math.floor(Math.random()*max)-mid;
    y = Math.floor(Math.random()*max)-mid;
    z = Math.floor(Math.random()*max)-mid;

    atom.position = {
      x: x,
      y: y,
      z: z
    }
    atom.update();
  }

  Protein.prototype.computeBarycenter = function(){
      var xc=0, yc=0, zc=0, sumRad=0;
      for(curr in this.atoms){
        xc+=this.atoms[curr].position.x*this.atoms[curr].radius;
        yc+=this.atoms[curr].position.y*this.atoms[curr].radius;
        zc+=this.atoms[curr].position.z*this.atoms[curr].radius;
        sumRad+=this.atoms[curr].radius;
      }
      this.barycenter = new PhiloGL.Vec3(xc/sumRad,yc/sumRad,zc/sumRad);
    }

  Protein.prototype.computeMinRadius = function(){
      this.minAtomRadius = this.atoms[1].radius;
      for(i in this.atoms){
        if(this.atoms[i].radius < this.minAtomRadius){
          this.minAtomRadius = this.atoms[i].radius;
        }
      }
    }

  Protein.prototype.randomize = function(numberOfAtoms) {
    this.clear();

  	var colorArr = [[1,1,1,1], [1,0,1,1], [1,1,0,1],[1,0,0,1], [0,1,0,1], [0,0,1,1]];
  	for(i=0; i<numberOfAtoms; i++){
        var atom = new PhiloGL.O3D.Sphere({
            nlat: 30,
            nlong: 30,
            radius: (i+1)/60 + 0.5,
            colors: colorArr[i%colorArr.length]
        });
        atom.radius=(i+1)/60 + 0.5;

        this.randomizePosition(atom);
        this.atoms.push(atom);
      }
      this.computeBarycenter();
      this.computeMinRadius();

      var arrayBond = [[1,2,1],[2,3,1],[3,6,1],[9,1,1],[1,5,1],[6,4,3],[8,7,2],[7,9,2],[0,2,2]];
      for (i in arrayBond){
        var triple = arrayBond[i];
        this.createBond(triple[0], triple[1], triple[2]);
      }
  }

