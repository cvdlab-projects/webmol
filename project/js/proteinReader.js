
    function ProteinReader(){
    	
    }

    ProteinReader.prototype.load = function(jsonPath){
    	var protein = new Protein();
      // read jsonPath file and load Protein structure
      return protein;
    }

    ProteinReader.prototype.proteinSample = function() {
      var protein = new Protein();
      var colorArr = [[1,1,1,1], [1,0,1,1], [1,1,0,1],[1,0,0,1], [0,1,0,1], [0,0,1,1]];
      var example_mol = [ [2,2,0],[4,2,0],[6,0,0],[4,-2,0],[2,-2,0],[0,0,0],[0,4,0],[6,4,0],[6,-4,0],[0,-4,0] ];
      var radius = 0.5;
      var vanDerWaalsRadius = 2;
      for(i in example_mol){
        pos = example_mol[i];
        var atom =new Atom(i,"",pos[0],pos[1],pos[2],colorArr[i%colorArr.length],radius,vanDerWaalsRadius);
        protein.addAtom(atom);
      }

      var example_bond = [ [0,1,2],[1,2,1],[2,3,3],[3,4,1],[4,5,1],[5,0,1],[0,6,1],[1,7,1],[3,8,1],[4,9,1] ];
      
      for (i in example_bond){
        var b = example_bond[i];
        var bond = new Bond(b[0], b[1], b[2]);
        protein.addBond(bond);
      }

      return protein;

      /*var example_mol = [ [2,2,0],[4,2,0],[6,0,0],[4,-2,0],[2,-2,0],[0,0,0],[0,4,0],[6,4,0],[6,-4,0],[0,-4,0] ];
      //var example_bond = [ [0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,3],[5,0,2],[0,6,2],[1,7,2],[3,8,2],[4,9,1] ];
      var example_bond = [ [0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,0,1],[0,6,1],[1,7,1],[3,8,1],[4,9,1] ];
      var colorArr = [[1,1,1,1], [1,0,1,1], [1,1,0,1],[1,0,0,1], [0,1,0,1], [0,0,1,1]];
      for(i=0; i<example_mol.length; i++){
        
        atom=this.drawAtom(example_mol[i][0],example_mol[i][1],example_mol[i][2],0.5,colorArr[i%colorArr.length]);
        
      }
      this.computeBarycenter();
      this.computeMinRadius();

      
      for (i in example_bond){
        var triple = example_bond[i];
        var atom1 = this.atoms[triple[0]];
        var atom2 = this.atoms[triple[1]];

        var v1 = new PhiloGL.Vec3(atom1.position.x, atom1.position.y, atom1.position.z);
        var v2 = new PhiloGL.Vec3(atom2.position.x, atom2.position.y, atom2.position.z);
        var midpoint = v1.add(v2).scale(0.5);
        var color1 = [atom1.colors[0],atom1.colors[1],atom1.colors[2],1];
        var color2 = [atom2.colors[0],atom2.colors[1],atom2.colors[2],1];
        this.createBond(v1,midpoint,color1,1);
        this.createBond(midpoint,v2,color2,1);
      }*/

    }


  //TODO: da riscrivere con la nuova architettura
  ProteinReader.prototype.randomize = function(numberOfAtoms) {
    this.clear();

    var colorArr = [[1,1,1,1], [1,0,1,1], [1,1,0,1],[1,0,0,1], [0,1,0,1], [0,0,1,1]];
    for(i=0; i<numberOfAtoms; i++){
        
        atom=this.drawAtom(0,0,0,((i+1)/60+0.5),colorArr[i%colorArr.length]);
        this.randomizePosition(atom);
        
      }
      this.computeBarycenter();
      this.computeMinRadius();

      var arrayBond = [[1,2,1],[2,3,1],[3,6,1],[9,1,1],[1,5,1],[6,4,3],[8,7,2],[7,9,2],[0,2,2]];
      for (i in arrayBond){
        var triple = arrayBond[i];
        var atom1 = this.atoms[triple[0]];
        var atom2 = this.atoms[triple[1]];

        var v1 = new PhiloGL.Vec3(atom1.position.x, atom1.position.y, atom1.position.z);
        var v2 = new PhiloGL.Vec3(atom2.position.x, atom2.position.y, atom2.position.z);
        var midpoint = v1.add(v2).scale(0.5);
        var color1 = [atom1.colors[0],atom1.colors[1],atom1.colors[2],1];
        var color2 = [atom2.colors[0],atom2.colors[1],atom2.colors[2],1];
        this.createBond(v1,midpoint,color1,1);
        this.createBond(midpoint,v2,color2,1);
      }
  }

Protein.prototype.randomizePosition = function(atom){
    var max = 50;
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