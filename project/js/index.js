  var $id = function(d) { return document.getElementById(d); };
  var eventHandler = new EventHandler();
  var renderizer = new Renderizer();
  var originRotationOn=true;
  var type = RenderizerType.ballAndStick;


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
  
  function backboneChanged(){
    renderizer.render(type);
  }

  function renderizerTypeChanged(){
    var sel = $id('renderizerType').options;
    for(i=0; i<sel.length; i++){
      if(sel[i].selected){
        type = i;
        renderizer.renderize(protein, i, false);
      }
    }
  }

  function proteinChanged(){
     NScamera.reset();
     var sel = $id('proteinSelected').options;
     for(i=0; i<sel.length; i++){
      if(sel[i].selected){
        if(i==0){
          protein = aminoAcids['ALA'];
          renderizer.renderize(protein, type);
        }
        else if(i==1){
          protein = aminoAcids['ARG'];
          renderizer.renderize(protein, type);
        }
        else if(i==2){
          protein = aminoAcids['CYS'];
          renderizer.renderize(protein, type);
        }
        else if(i==3){
          // protein = aminoAcids['TRP'];
          var creatine = jsonProtein['2CRK'];
          protein = proteinReader.loadProtein(creatine,1);
          renderizer.renderize(protein, type);
        }
        else if(i==4){
          var insuline = jsonProtein['2LGB'];
          protein = proteinReader.loadProtein(insuline,1);
          renderizer.renderize(protein, type);
        }
      }
    }
  }

  function webGLStart() {
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
        var t0 = PhiloGL.Fx.animationTime();
        setInterval(function() {
          var t1 = PhiloGL.Fx.animationTime();
          var fps = (1000/(t1 - t0));
          $id("fps").innerHTML = fps;
          t0 = t1;
        }, 1000 / 60);
        //

        draw();

        function draw() {
          NScamera.update();
          PhiloGL.Fx.requestAnimationFrame(draw);
        }
      }
    });
  }
