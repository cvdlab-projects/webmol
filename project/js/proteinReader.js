    var proteinReader = new ProteinReader();

    function ProteinReader(){}

     ProteinReader.prototype.loadAminoAcids = function(json){
      var protein = new Protein();
      var jsonParse = eval('('+json+')');
      var model = jsonParse["MODEL_1"];
      var strAtom = "r_";
      var i = 1;
      var j = 1;
      var atom = model[strAtom+i];
      while(atom !== undefined){
        if(atom["type"]=="ATOM"){
              protein.addAtom(atom["serial"], new Atom(atom["serial"], atom["element"], atom["name"], atom["x"]/1, atom["y"]/1, atom["z"]/1), atom["resSeq"], atom["resName"]);
        }
        i++;
        atom = model[strAtom+i];
      }

      for(z=1;z<i;z++){
        var conect = jsonParse["CONECT_"+z];
        for (z2=1;z2<=4;z2++){
            if (conect["serial_"+z2] !== "" && conect["serial"] < conect["serial_"+z2]){
                atom1 = model[strAtom + conect["serial"]];
                atom2 = model[strAtom + conect["serial_"+z2]];
                protein.addBond( new Bond(conect["serial"], conect["serial_"+z2], atom1["name"], atom2["name"], 1 ) );
            }
        }
      }
      return protein;
    }

    

     ProteinReader.prototype.loadProtein = function(jsonstr, visual){
        var protein = new Protein();
        
        var models = jsonstr['MODEL'];
        var model = models[visual];
        var atoms = model['ATOM'];
        
        var i = 1;

        var offset = 0;
        var lastResName = "";
        var lastResSeq = 0;
        var indexResSeq = [];
        var admitted = [];

        var peptideListN = {};
        var peptideListC = {};

        function createBonds( lastResName, indexResSeq, admitted, offset){
            var aminoAcid = aminoAcids[lastResName];
            for(var key in aminoAcid.bonds){
                var bond = aminoAcid.bonds[key];
                var idS = bond.idSource;
                var idT = bond.idTarget;
                var nameS = bond.nameSource;
                var nameT = bond.nameTarget;
                var legami = bond.bondType;

              for (varS in admitted) {
                var source = admitted[varS];
                if (nameS === source[1]){
                  for (varT in admitted){
                    var target = admitted[varT];
                    if (nameT === target[1]){
                      var idSoffset = parseInt(source[0]) + parseInt(offset);
                      var idToffset = parseInt(target[0]) + parseInt(offset);
                      protein.addBond( new Bond( idSoffset, idToffset , legami ) );
                    }
                  }
                }
              }
            }
        }

        function createPeptides(peptideListN, peptideListC) {
          for(var k in peptideListN){
            var peptideListNchainID = peptideListN[k];
            var peptideListCchainID = peptideListC[k];
            var i = 0;
            while(peptideListNchainID[i+1] !== undefined && peptideListNchainID[i] !== undefined){
              cur = peptideListNchainID[i+1];
              next = peptideListCchainID[i];

              protein.atoms[cur].isbone = true;
              protein.atoms[next].isbone = true;
              
              protein.addBond( new Bond( cur, next , 1 ) );
              i++;
            }
          }
        }

        function drawHetatm() {
            var hetatm = model['HETATM'];
            for(key in hetatm){
                var heta = hetatm[key];
                
                if (heta['type'] === "HETATM"){
                    
                    var id = heta['serial'];
                    var resSeq = heta['resSeq'];
                    var resName = heta['resName'];
                    var element = heta['element'];
                    var name = heta['name'];
                    var chainID = heta['chainID'];
                    var x = heta['x']/1, y = heta['y']/1, z = heta['z']/1;

                    var atom = new Atom(id, element, name, x, y, z, chainID, resSeq, resName);
                    protein.addAtom(id, atom);
                }
                
            }
        }

        function drawConect(conectList){
            for(source in conectList){
                var targetList = conectList[source];
                for(i in targetList){
                    var target = targetList[i];
                    if(Bond( source, target , 1 ) !== undefined)
                        protein.addBond( new Bond( source, target , 1 ) );
                }
            }
        }

        function countModels(mapModels){
            var count = 0;
            for(key in mapModels)
                count++;
            return count-1;
        }
        
        for (key in atoms) {
            var record = atoms[key];

            if(record['type'] == "ATOM"){
                var id = record['serial'];
                var resSeq = record['resSeq'];
                var resName = record['resName'];
                var element = record['element'];
                var name = record['name'];
                var chainID = record['chainID'];
                var x = record['x']/1, y = record['y']/1, z = record['z']/1;

                if(peptideListN[chainID] == undefined){
                  peptideListN[chainID] = [];
                  peptideListC[chainID] = [];
                }

                if ( name === "N" )
                  peptideListN[chainID].push(id); 
                else if (name === "CA")
                  peptideListC[chainID].push(id);
                
                
                // INIZIO DI UNA NUOVA CATENA DI AMINO ACIDO
                if(resSeq !== lastResSeq){
                    // SE IL LASTRESNAME!="" CERCO E AGGIUNGO I BOND DEL PRECEDENTE AMINOACIDO
                    if(lastResName !== ""){
                        createBonds( lastResName, indexResSeq, admitted, offset);
                    }

                    // REINIZIALIZZO LE VARIABILI CON I RIFERIMENTI DELLA NUOVA CATENA
                    lastResName = resName;
                    indexResSeq = [];
                    admitted = [];
                    lastResSeq = resSeq;
                    offset = id - 1;
                }

                var relativeId = id - offset;
                indexResSeq.push(relativeId);
                admitted.push([relativeId,name]);
                
                var atom = new Atom(id, element, name, x, y, z, chainID, resSeq, resName);
                // alert(id+" "+atom.aminoacid);
                protein.addAtom(id, atom);
            }
      }
          // CREA I BOND PER L'ULTIMA CATENA
          createBonds(lastResName, indexResSeq, admitted, offset);

        // drawHetatm();

          if (jsonstr['CONECT'] !== undefined)
            drawConect(jsonstr['CONECT']);
          
          createPeptides(peptideListN, peptideListC);
          return protein;
    }
