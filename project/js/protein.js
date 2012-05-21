  // Protein Class

  function Protein(){
    this.init();
  }

  Protein.prototype.init = function(){
    this.atoms = {};
    this.arratoms = [];
    this.bonds = [];
  }
 
  Protein.prototype.addAtom = function(id, atom){
    this.atoms[id] = atom;
    this.arratoms.push(atom);
  }

  Protein.prototype.addBond = function(bond){
    this.bonds.push(bond);
  }

  Protein.prototype.minRadius = function(){
      var minAtomRadius = 9999;
      for(var i in this.atoms){
        if(this.atoms[i].radius < minAtomRadius){
          minAtomRadius = this.atoms[i].radius;
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

        var maxx=max(this.arratoms,'x');
        var minx=min(this.arratoms,'x');

        var maxy=max(this.arratoms,'y');
        var miny=min(this.arratoms,'y');

        var maxz=max(this.arratoms,'z');
        var minz=min(this.arratoms,'z');

      return new PhiloGL.Vec3((maxx+minx)/2,(maxy+miny)/2,(maxz+minz)/2);
    }

    Protein.prototype.maxDistance = function(){
      var maxx=max(this.arratoms,'x');
        var maxy=max(this.arratoms,'y');
        var maxz=max(this.arratoms,'z');
        return Math.max.apply(Math,[maxx,maxy,maxz]);
    }
 

