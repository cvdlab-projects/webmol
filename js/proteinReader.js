    // Istanza di un oggetto di tipo ProteinReader
    var proteinReader = new ProteinReader();

    function ProteinReader(){}

    /* Crea un modello 3D di un singolo amminoacido a partire dal corrispettivo json */
    ProteinReader.prototype.loadAminoAcids = function(json){
      var protein = new Protein();
      var jsonParse = eval('('+json+')');
      var model = jsonParse["MODEL_1"];
      var strAtom = "r_";
      var i = 1;
      var j = 1;

      // Parsing del json
      
      // Creazione degli atomi
      var atom = model[strAtom+i];
      while(atom !== undefined){
        if(atom["type"]=="ATOM"){
              protein.addAtom(atom["serial"], new Atom(atom["serial"], atom["element"], atom["name"], atom["x"]/1, atom["y"]/1, atom["z"]/1), atom["resSeq"], atom["resName"]);
        }
        i++;
        atom = model[strAtom+i];
      }
      // Creazione dei legami
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

    /* Conta i modelli di cui è disponibile il corrispettivo json */
    ProteinReader.prototype.countModels = function(jsonstr){
        var mapModels = jsonstr['MODEL'];
        var count = 0;
        for(key in mapModels)
            count++;
        return count-1;
    }

    /* Crea il modello di una proteina completa */
    /* Devono essere passati il json della proteina e il tipo di visualizzazione */
    ProteinReader.prototype.loadProtein = function(jsonstr, visual){
        var protein = new Protein();
        
        var models = jsonstr['MODEL'];
        var model = models[visual];
        var atoms = model['ATOM'];
        
        var i = 1;

        // Variabili temporanee per i valori dell' amminoacido
        var offset = 0;
        var lastResName = "";
        var lastResSeq = 0;
        var indexResSeq = [];
        var admitted = [];

        // Liste d'appoggio per i riferimenti alle sequenze carbonio-azoto dei legami peptidici
        var peptideListN = {};
        var peptideListC = {};

        /* Funzione di supporto per creare i legami dei singoli amminoacidi */
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

        /* Funzione di supporto per creare legami peptidici */
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
        
        /* Funzione di supporto per il disegno degli Hetatoms alla fine del json */
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

        /* Funzione di supporto per il disegno dei legami non-standard presenti nella sezione finale del json */
        function drawConect(conectList){
            for(source in conectList){
                var targetList = conectList[source];
                for(i in targetList){
                    var target = targetList[i];
                    if(protein.atoms[source] !== undefined || protein.atoms[target] !== undefined)
                        protein.addBond( new Bond( source, target , 1 ) );
                }
            }
        }

        for (key in atoms) {
            var record = atoms[key];

            // Parte relativa alla sezione ATOM del PDBe
            if(record['type'] == "ATOM"){
                // Popolo le variabili temporanee
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

                // Popola la catena peptidica
                if ( name === "N" )
                  peptideListN[chainID].push(id); 
                else if (name === "CA")
                  peptideListC[chainID].push(id);
                
                
                // Inizio di una nuova catena di amminoacidi
                // Se LASTRESNAME!="" , cerco e aggiungo i precedenti legami dell'aminoacido
                if(resSeq !== lastResSeq){
                    if(lastResName !== ""){
                        createBonds( lastResName, indexResSeq, admitted, offset);
                    }
                    // Re-inizializzo le variabili con i riferimenti alla nuova catena
                    lastResName = resName;
                    indexResSeq = [];
                    admitted = [];
                    lastResSeq = resSeq;
                    offset = id - 1;
                }
                // Alcuni atomi dell'amminoacido di base possono non esserci nella sotto-sequenza della proteina
                // In tal caso, tengo un id relativo basato sulla proteina per verificare correttezza della struttura
                var relativeId = id - offset;
                indexResSeq.push(relativeId);
                admitted.push([relativeId,name]);
                
                var atom = new Atom(id, element, name, x, y, z, chainID, resSeq, resName);
                protein.addAtom(id, atom);
            }
      }
          // Crea i legami per l'ultima catena
          createBonds(lastResName, indexResSeq, admitted, offset);

          // Se presenti, disegna i Connect non-standard
          if (jsonstr['CONECT'] !== undefined)
            drawConect(jsonstr['CONECT']);
          
          // Disegna i legami peptidici
          createPeptides(peptideListN, peptideListC);

          return protein;
    }
