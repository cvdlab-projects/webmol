
    function ProteinReader(){
    	
    }

    ProteinReader.prototype.load = function(jsonPath){
    	var protein = new Protein();
      // read jsonPath file and load Protein structure

      return protein;
    }


    // La seguente parte di codice dovrà essere cancellata. Per ora serve per renderizzare alcuni modelli di proteine in attesa che ci forniscano i file JSON.

    var color = [1,1,1,1];
    var vanDerWaalsRad = 1.0;
    var rad = 0.4;

    ProteinReader.prototype.cysteine = function(){
      var protein = new Protein();
      
      protein.addAtom(new Atom(1, "N", 1.392, 0.899, 0.816,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(2, "CA", 0.232, 0.006, 1.027,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(3, "C", 0.415, -1.253, 0.215,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(4, "O", 0.220, -2.366, 0.676,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(5, "H", 2.312, 0.398, 1.085,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(6, "O", 0.810, -1.089, -1.045,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(7, "H", 1.291, 1.803, 1.401,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(8, "H", 0.164, -0.268, 2.095,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(9, "C", -1.078, 0.721, 0.608,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(10, "S", -0.938, 1.322, -1.109,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(11, "H", -1.851, 1.741, -1.193,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(12, "H", -1.931, 0.027, 0.687,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(13, "H", -1.263, 1.584, 1.268,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(14, "H", 0.893, -1.938, -1.462,color,rad,vanDerWaalsRad));

      protein.addBond(new Bond(0, 1, 1));
      protein.addBond(new Bond(0, 4, 1));
      protein.addBond(new Bond(0, 6, 1));
      protein.addBond(new Bond(1, 2, 1));
      protein.addBond(new Bond(1, 7, 1));
      protein.addBond(new Bond(1, 8, 1));
      protein.addBond(new Bond(2, 3, 1));
      protein.addBond(new Bond(2, 5, 1));
      protein.addBond(new Bond(5, 13, 1));
      protein.addBond(new Bond(8, 9, 1));
      protein.addBond(new Bond(8, 12, 1));
      protein.addBond(new Bond(8, 11, 1));
      protein.addBond(new Bond(9, 10, 1));

      return protein;
    }

    ProteinReader.prototype.arginine = function(){
      var protein = new Protein();
      
      protein.addAtom(new Atom(1, "N", 0.581, 2.180, 1.470,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(2, "CA", 1.400, 0.974, 1.724,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(3, "C", 2.553, 0.934, 0.751,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(4, "O", 3.650, 0.494, 1.053,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(5, "H", 1.188, 3.073, 1.532,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(6, "O", 2.312, 1.415, -0.466,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(7, "H", -0.232, 2.249, 2.180,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(8, "H", 1.812, 1.024, 2.748,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(9, "C", 0.533, -0.310, 1.592,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(10, "H", -0.259, -0.279, 2.357,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(11, "H", 1.164, -1.192, 1.791,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(12, "C", -0.122, -0.449, 0.190,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(13, "H", 0.660, -0.566, -0.578,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(14, "H", -0.697, 0.463, -0.032,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(15, "C", -1.063, -1.684, 0.127,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(16, "H", -0.500, -2.587, 0.412,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(17, "N", -1.627, -1.912, -1.223,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(18, "H", -1.887, -1.564, 0.850,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(19, "C", -2.412, -0.917, -1.640,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(20, "H", -0.851, -2.124, -1.946,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(21, "N", -2.007, 0.046, -2.365,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(22, "N", -3.681, -0.986, -1.248,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(23, "H", -1.047, 0.109, -2.666,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(24, "H", -4.170, -0.044, -1.448,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(25, "H", -4.181, -1.774, -1.789,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(26, "H", 3.098, 1.343, -0.995,color,rad,vanDerWaalsRad));

      protein.addBond(new Bond(0, 1, 1));
      protein.addBond(new Bond(0, 4, 1));
      protein.addBond(new Bond(0, 6, 1));
      protein.addBond(new Bond(1, 2, 1));
      protein.addBond(new Bond(1, 7, 1));
      protein.addBond(new Bond(1, 8, 1));
      protein.addBond(new Bond(2, 3, 1));
      protein.addBond(new Bond(2, 5, 1));
      protein.addBond(new Bond(5, 25, 1));
      protein.addBond(new Bond(8, 9, 1));
      protein.addBond(new Bond(8, 10, 1));
      protein.addBond(new Bond(8, 11, 1));
      protein.addBond(new Bond(11, 12, 1));
      protein.addBond(new Bond(11, 13, 1));
      protein.addBond(new Bond(11, 14, 1));
      protein.addBond(new Bond(14, 15, 1));
      protein.addBond(new Bond(14, 16, 1));
      protein.addBond(new Bond(14, 17, 1));
      protein.addBond(new Bond(16, 18, 1));
      protein.addBond(new Bond(16, 19, 1));
      protein.addBond(new Bond(18, 20, 1));
      protein.addBond(new Bond(18, 21, 1));
      protein.addBond(new Bond(20, 22, 1));
      protein.addBond(new Bond(21, 23, 1));
      protein.addBond(new Bond(21, 24, 1));

      return protein;
    }

    ProteinReader.prototype.tryptophan = function(){
      var protein = new Protein();
      
      protein.addAtom(new Atom(1, "N", 1.029, 2.090, -1.621,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(2, "CA", 1.902, 1.071, -0.996,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(3, "C", 2.935, 0.658, -2.015,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(4, "O", 4.136, 0.718, -1.802,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(5, "H", 0.309, 2.476, -0.914,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(6, "O", 2.461, 0.219, -3.178,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(7, "H", 0.511, 1.680, -2.477,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(8, "H", 2.431, 1.523, -0.141,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(9, "C", 1.104, -0.178, -0.529,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(10, "C", 0.065, 0.091, 0.531,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(11, "H", 1.797, -0.937, -0.132,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(12, "H", 0.591, -0.607, -1.403,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(13, "C", 0.023, 1.075, 1.447,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(14, "C", -1.163, -0.756, 0.751,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(15, "H", 0.759, 1.867, 1.582,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(16, "N", -1.055, 0.948, 2.178,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(17, "C", -1.790, -0.117, 1.803,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(18, "H", -1.311, 1.584, 2.949,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(19, "C", -1.691, -1.902, 0.159,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(20, "C", -2.996, -0.580, 2.328,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(21, "H", -3.484, -0.071, 3.153,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(22, "C", -3.546, -1.727, 1.740,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(23, "H", -4.486, -2.118, 2.116,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(24, "C", -2.904, -2.378, 0.675,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(25, "H", -1.185, -2.399, -0.661,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(26, "H", -3.353, -3.267, 0.242,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(27, "H", 3.185, -0.015, -3.746,color,rad,vanDerWaalsRad));

      protein.addBond(new Bond(0, 1, 1));
      protein.addBond(new Bond(0, 4, 1));
      protein.addBond(new Bond(0, 6, 1));
      protein.addBond(new Bond(1, 2, 1));
      protein.addBond(new Bond(1, 7, 1));
      protein.addBond(new Bond(1, 8, 1));
      protein.addBond(new Bond(2, 3, 2));
      protein.addBond(new Bond(2, 5, 1));
      protein.addBond(new Bond(5, 26, 1));
      protein.addBond(new Bond(8, 9, 1));
      protein.addBond(new Bond(8, 10, 1));
      protein.addBond(new Bond(8, 11, 1));
      protein.addBond(new Bond(9, 12, 2));
      protein.addBond(new Bond(9, 13, 1));
      protein.addBond(new Bond(12, 14, 1));
      protein.addBond(new Bond(12, 15, 1));
      protein.addBond(new Bond(13, 16, 2));
      protein.addBond(new Bond(13, 18, 1));
      protein.addBond(new Bond(15, 16, 1));
      protein.addBond(new Bond(15, 17, 1));
      protein.addBond(new Bond(16, 19, 1));
      protein.addBond(new Bond(18, 24, 1));
      protein.addBond(new Bond(18, 23, 2));
      protein.addBond(new Bond(19, 20, 1));
      protein.addBond(new Bond(19, 21, 2));
      protein.addBond(new Bond(21, 22, 1));
      protein.addBond(new Bond(21, 23, 1));
      protein.addBond(new Bond(23, 25, 1));

      return protein;
    }

    ProteinReader.prototype.alanine = function() {
      var protein = new Protein();

      protein.addAtom(new Atom(1, "N", -1.053, 1.300, 0.614,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(2, "CA", -0.304, 0.032, 0.746,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(3, "C", 0.770, -0.014, -0.311,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(4, "O", 1.952, -0.167, -0.047,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(5, "H", -1.805, 1.385, 1.386,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(6, "O", 0.354, 0.125, -1.567,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(7, "H", -1.522, 1.368, -0.358,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(8, "H", 0.176, 0.013, 1.740,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(9, "C", -1.237, -1.200, 0.610,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(10, "H", -2.007, -1.183, 1.397,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(11, "H", -0.655, -2.129, 0.709,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(12, "H", -1.737, -1.199, -0.371,color,rad,vanDerWaalsRad));
      protein.addAtom(new Atom(13, "H", 1.100, 0.082, -2.154,color,rad,vanDerWaalsRad));
      
      protein.addBond(new Bond(0, 1, 1));
      protein.addBond(new Bond(0, 4, 1));
      protein.addBond(new Bond(0, 6, 1));
      protein.addBond(new Bond(1, 2, 1));
      protein.addBond(new Bond(1, 7, 1));
      protein.addBond(new Bond(1, 8, 1));
      protein.addBond(new Bond(2, 3, 2));
      protein.addBond(new Bond(2, 5, 1));
      protein.addBond(new Bond(5, 12, 1));
      protein.addBond(new Bond(8, 9, 1));
      protein.addBond(new Bond(8, 10, 1));
      protein.addBond(new Bond(8, 11, 1));
      
      return protein;
    }

    ProteinReader.prototype.proteinSample = function() {
      var protein = new Protein();
      var colorArr = [[1,1,1,1], [1,0,1,1], [1,1,0,1],[1,0,0,1], [0,1,0,1], [0,0,1,1]];
      var example_mol = [ [2,2,0],[4,2,0],[6,0,0],[4,-2,0],[2,-2,0],[0,0,0],[0,4,0],[6,4,0],[6,-4,0],[0,-4,0],
      [2,2,5],[4,2,5],[6,0,5],[4,-2,5],[2,-2,5],[0,0,5],[0,4,5],[6,4,5],[6,-4,5],[0,-4,5] ];
      var rad = 0.5;
      var vanDerWaalsRad = 3;
      for(i in example_mol){
        pos = example_mol[i];
        var atom =new Atom(i,"",pos[0],pos[1],pos[2],colorArr[i%colorArr.length],rad,vanDerWaalsRad);
        protein.addAtom(atom);
      }

      var example_bond = [ [0,1,2],[1,2,1],[2,3,3],[3,4,1],[4,5,1],[5,0,1],[0,6,1],[1,7,1],[3,8,1],[4,9,1] ,
      [10,11,2],[11,12,1],[12,13,3],[13,14,1],[14,15,1],[15,10,1],[10,16,1],[11,17,1],[13,18,1],[14,19,1]
      ,[2,13,3],[3,14,1],[4,15,1],[5,10,1],[0,16,1],[1,17,1],[3,18,1],[1,19,1]];
      
      for (i in example_bond){
        var b = example_bond[i];
        var bond = new Bond(b[0], b[1], b[2]);
        protein.addBond(bond);
      }

      return protein;
    }