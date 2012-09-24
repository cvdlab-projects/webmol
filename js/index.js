  /*
    Interazione tra le classi del progetto:
    index interagisce con la camera (per gestire il resize della windows e l'aggiornamento della camera al draw), con proteinReader (per caricare la proteina), con renderizer (per renderizzare la scena) ed eventHanlder (per impostare la gestione degli eventi della tastiera e del mouse)
    eventHandler interagisce con animation per animare la camera in caso di reset e con la camera stessa per lo zoom, pan e rotate
    camera interagisce con renderizer per il redraw della scena, con frustumCulling per l'aggiornamento dei piani della frustum
    proteinReader interagisce con atoms e protein poichè costruisce una struttura di proteine data da lista di atomi e legami e utilizza la mappa degli amminoacidi presente in jsonAminoAcids per trarre informazioni sui legami degli amminoacidi nella proteina
    renderizer interagisce direttamente con PhiloGL e data una proteina è in grado di renderizzarla nella scena, di gestire le luci e le trasformazioni degli oggetti
  */


  var $id = function(d) { return document.getElementById(d); };
  var eventHandler = new EventHandler();
  var renderizer = new Renderizer();
  var originRotationOn=true;
  var type = RenderizerType.ballAndStick;

  function httpGet(theUrl)
  {
    $('#spinner').show();

    xmlHttp = new XMLHttpRequest(); 
    
    xmlHttp.open("GET", theUrl, true );

    xmlHttp.onreadystatechange = ProcessRequest;
    xmlHttp.send(null);
  }

function ProcessRequest() 
{
    if ( xmlHttp.readyState == 4 && xmlHttp.status == 200 ) 
    {
        if ( xmlHttp.responseText == "Not found" ) 
        {
             alert("Protein Not Found");
        }
        else
        {
            json = eval('('+xmlHttp.responseText+')');
            protein = proteinReader.loadProtein(json,1);
            addSelectModel();
            renderizer.renderize(protein, type);
        }     
        $('#spinner').hide();
               
    } else if ( xmlHttp.readyState == 4 && xmlHttp.status != 200 )  {
      $('#spinner').hide();
      alert("Protein Not Found. Error Code: "+xmlHttp.status);
    }
  }

  // Funzion per scaricare le proteine, cambiare la variabile site per puntare ad altri repository
  function downloadProtein(){
    var site = "http://cvdlab-bio.github.com/webmol/proteine/";
    var url = site + document.getElementById('idProtein').value + ".json";
    httpGet(url);
  }

  /* Funzione che permette di reimpostare la camera e il viewport quando viene ridimensionata la finestra */
  function resizeWindow()
  {
  var cont=canvas.parentNode;
  if ((canvas.width!=cont.clientWidth)||(canvas.height!=cont.clientHeight)) {
    canvas.width=cont.clientWidth;
    canvas.height=cont.clientHeight;
    }
    camera.aspect=canvas.width/canvas.height;
    gl.viewport(0, 0, canvas.width, canvas.height);
    camera.update();
    culling.updatePlanes(camera.position, camera.target, camera.up);
    renderizer.renderize(protein, type, false);
  }
  
  // Invocata sulla spunta della visualizzazione della backbone (disegna o rimuove la backbone con un redraw)
  function backboneChanged(){
    renderizer.render(type);
  }

  // Invocata quando viene cambiato il tipo di renderizzazione (ridisegna la scena col nuovo tipo di renderizzazione)
  function renderizerTypeChanged(){
    var sel = $id('renderizerType').options;
    for(i=0; i<sel.length; i++){
      if(sel[i].selected){
        type = i;
        renderizer.renderize(protein, i, false);
      }
    }
  }

  // Gestisce la rimozione dei modelli della proteina dalla combobox
  function removeSelectModel(){
    elSel = document.getElementById('modelSelected');
      var y;
      for (y = elSel.length - 1; y>=0; y--) {
          elSel.remove(y);
      }
  }

  // Gestisce l'aggiunta dei modelli della proteina dalla combobox
  function addSelectModel(){
    removeSelectModel();
    for (i=1; i<=proteinReader.countModels(json);i++){
      var elOptNew = document.createElement('option');
      elOptNew.text = 'Model_' + i;
      elOptNew.value = 'model_' + i;
      elSel.add(elOptNew, null);
    }
  }

  // Invocata quando viene cambiata la proteina da visualizzare
  function proteinChanged(){
     NScamera.reset();
     var sel = $id('proteinSelected').options;
     for(i=0; i<sel.length; i++){
      if(sel[i].selected){
        if(i==0){
          protein = aminoAcids['ALA'];
          renderizer.renderize(protein, type);
          removeSelectModel();
        }
        else if(i==1){
          protein = aminoAcids['ARG'];
          renderizer.renderize(protein, type);
          removeSelectModel();
        }
        else if(i==2){
          protein = aminoAcids['CYS'];
          renderizer.renderize(protein, type);
          removeSelectModel();
        }
      }
    }
  }

  // Invocata quando viene cambiato il modello della proteina da visualizzare
    function modelChanged(){
      //alert($id('modelSelected').selectedIndex+1);
          protein = proteinReader.loadProtein(insuline,$id('modelSelected').selectedIndex+1);
          renderizer.renderize(protein, type);
  }

  // Invocata quando viene cambiato il colore dello sfondo
  function changeBackColor(){
 
    renderizer.render(type,$id('colorId').value);
    document.body.style.background=$id('colorId').value;
  }

  // Inizializza l'ambiente WebGL e PhiloGL impostando shaders, camera, eventi etc.
  function webGLStart() {
var dm = document.getElementById('infoAtom'); 
  dm.addEventListener('dragstart',drag_start,false); 
  document.body.addEventListener('dragover',drag_over,false); 
  document.body.addEventListener('drop',drop,false); 
    
    PhiloGL('webMolCanvas', {
      program: {
      from: 'ids',
      vs: 'shader-vs',
      fs: 'shader-fs'
    },
      events: {
        onClick: function(e){
          var cX = e.x + canvas.width/2;
          var cY = canvas.height/2 - e.y;
          var model = scene.pick(cX, cY);
          //var model = renderizer.pick(cX, cY);
          eventHandler.onClick(e, model);
        },
        onDragStart: function(e) {
          eventHandler.onDragStart(e);
        },
        onDragMove: function(e) {
          eventHandler.onDragMove(e);
        },
        onKeyDown: function(e) {
          eventHandler.onKeyDown(e);
        }, 
        onMouseWheel: function(e) {
          eventHandler.onMouseWheel(e);
        }
      },
      onError: function() {
        alert("There was an error creating the app.");
      },
      onLoad: function(app) {
        gl = app.gl,
            program = app.program,
            scene = app.scene,
            canvas = app.canvas,
            camera = app.camera,
            view = new PhiloGL.Mat4(),
            culling = new FrustumCulling(camera);

        var element = $id('webMolCanvas')[0];

        var cont=canvas.parentNode;
        if ((canvas.width!=cont.clientWidth)||(canvas.height!=cont.clientHeight)) {
            canvas.width=cont.clientWidth;
            canvas.height=cont.clientHeight;
        }
        camera.aspect=canvas.width/canvas.height;
        gl.viewport(0, 0, canvas.width, canvas.height);
        camera.update();
 


        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.viewport(0, 0, canvas.width, canvas.height);
        


        proteinChanged();
        renderizer.setupLight();

        // SHOW FPS
        /*
        var t0 = PhiloGL.Fx.animationTime();
        setInterval(function() {
          var t1 = PhiloGL.Fx.animationTime();
          var fps = (1000/(t1 - t0));
          $id("fps").innerHTML = fps;
          t0 = t1;
        }, 1000 / 60);
        //
        */

        draw();

        function draw() {
          NScamera.update();
          PhiloGL.Fx.requestAnimationFrame(draw);
        }
      }
    });
  }
