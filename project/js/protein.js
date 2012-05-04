  // Protein Class

  function Protein(){
    this.init();
  }

  Protein.prototype.init = function(){
    this.atoms = [];
    this.bonds = [];
  }
 
  Protein.prototype.addAtom = function(atom){
    this.atoms.push(atom);
  }

  Protein.prototype.addBond = function(bond){
    this.bonds.push(bond);
  }

  Protein.prototype.minRadius = function(){
      var minAtomRadius = this.atoms[1].radius;
      for(i in this.atoms){
        if(this.atoms[i].radius < this.minAtomRadius){
          this.minAtomRadius = this.atoms[i].radius;
        }
      }
      return minAtomRadius;
    }
function max(array,prop){
      var values = array.map(function (el){
        return el[prop];
      });
      return Math.max.apply(Math,values);
    }
function min(array,prop){
      var values = array.map(function (el){
        return el[prop];
      });
      return Math.min.apply(Math,values);
    }
  Protein.prototype.barycenter = function(){
    
        var maxx=max(this.atoms,'x');
        var minx=min(this.atoms,'x');

        var maxy=max(this.atoms,'y');
        var miny=min(this.atoms,'y');

        var maxz=max(this.atoms,'z');
        var minz=min(this.atoms,'z');

      return vec3.create([(maxx+minx)/2,(maxy+miny)/2,(maxz+minz)/2]);
    }
    Protein.prototype.maxDistance = function(){
      var maxx=max(this.atoms,'x');
        var maxy=max(this.atoms,'y');
        var maxz=max(this.atoms,'z');
        return Math.max.apply(Math,[maxx,maxy,maxz]);
    }
 

