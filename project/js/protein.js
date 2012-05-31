  // Protein Class

  function Protein(){
    this.init();
  }

  Protein.prototype.init = function(){
    this.atoms = {};
    this.bonds = [];
  }
 
  Protein.prototype.addAtom = function(id, atom){
    this.atoms[id] = atom;
  }

  Protein.prototype.addBond = function(bond){
    this.bonds.push(bond);
  }

  Protein.prototype.getAtomsArray = function(){
    var atomsarray = [];
    for(var key in this.atoms){
      atomsarray.push(this.atoms[key]);
    }
    return atomsarray;
  }

  Protein.prototype.getAtomsWithKeyChain = function(){
    var atomsChain = {};
    for(var key in this.atoms){
      var atom = this.atoms[key];
      if(atom.chainID!=undefined){
        if(atomsChain[atom.chainID]==undefined)
          atomsChain[atom.chainID] = [];

        atomsChain[atom.chainID].push(atom);
      }
    }
    return atomsChain;
  }

  Protein.prototype.barycenter = function(){
        var atomsarray = this.getAtomsArray();
        var maxx=max(atomsarray,'x');
        var minx=min(atomsarray,'x');

        var maxy=max(atomsarray,'y');
        var miny=min(atomsarray,'y');

        var maxz=max(atomsarray,'z');
        var minz=min(atomsarray,'z');

      return new PhiloGL.Vec3((maxx+minx)/2,(maxy+miny)/2,(maxz+minz)/2);
    }

    Protein.prototype.maxDistance = function(){
        var atomsarray = this.getAtomsArray();
        var maxx=max(atomsarray,'x');
        var maxy=max(atomsarray,'y');
        var maxz=max(atomsarray,'z');
        return Math.max.apply(Math,[maxx,maxy,maxz]);
    }
 

