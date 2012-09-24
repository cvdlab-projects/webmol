  /* Classe per rappresentare la struttura di una proteina */

  function Protein(){
    this.init();
  }

  /* Inizializza le strutture dati della proteina (una mappa per gli atomi ed un array per i legami) */
  Protein.prototype.init = function(){
    this.atoms = {};
    this.bonds = [];
  }
 
  /* Funzione per aggiungere un atomo alla proteina */
  Protein.prototype.addAtom = function(id, atom){
    this.atoms[id] = atom;
  }

  /* Funzione per aggiungere un legame alla proteina */
  Protein.prototype.addBond = function(bond){
    this.bonds.push(bond);
  }

  /* Funzione che restituisce l'array di atomi a partire dalla mappa */
  Protein.prototype.getAtomsArray = function(){
    var atomsarray = [];
    for(var key in this.atoms){
      atomsarray.push(this.atoms[key]);
    }
    return atomsarray;
  }

  /* Funzione che restituisce una mappa di atomi dove la chiave è la chainID della proteina a cui appartiene l'atomo */
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

  /* Funzione che restituisce un punto che è il baricentro della proteina */
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

    /* Funzione che restituisce la massima distanza raggiunta nello spazio dalla proteina rispetto a tutti gli assi */
    Protein.prototype.maxDistance = function(){
        var atomsarray = this.getAtomsArray();

        var maxx=max(atomsarray,'x');
        var minx=min(atomsarray,'x');

        var maxy=max(atomsarray,'y');
        var miny=min(atomsarray,'y');

        var maxz=max(atomsarray,'z');
        var minz=min(atomsarray,'z');

        return Math.max.apply(Math,[maxx-minx,maxy-miny,maxz-minz]);
    }
 

