  var $id = function(d) { return document.getElementById(d); };
  var eventHandler = new EventHandler();
  var renderizer = new Renderizer();
  var originRotationOn=true;
  var type = RenderizerType.ballAndStick;

  function quality(){
    if($id('low').checked){
      renderizer.quality = 10;
      renderizer.renderize(protein, type, false);
    } else if($id('mid').checked){
      renderizer.quality = 15;
      renderizer.renderize(protein, type, false);
    } else if($id('high').checked){
      renderizer.quality = 30;
      renderizer.renderize(protein, type, false);
    }
    else if($id('max').checked){
      renderizer.quality = 50;
      renderizer.renderize(protein, type, false);
    }
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
          protein =  aminoAcids['ALA'];
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
          protein = aminoAcids['TRP'];
          renderizer.renderize(protein, type);
        }
      }
    }
  }

  function onResize( element, callback ){
    var elementHeight = element.height,
        elementWidth = element.width;
    setInterval(function(){
        if( element.height !== elementHeight || element.width !== elementWidth ){
          elementHeight = element.height;
          elementWidth = element.width;
          callback();
        }
    }, 300);
  }

  function renderizerProtein(){
    protein = aminoAcids['ALA'];
    renderizer.renderize(protein, type);
  }

  function webGLStart() {
    PhiloGL('webMolCanvas', {
      program: {
      from: 'ids',
      vs: 'shader-vs',
      fs: 'shader-fs'
    },
      events: {
        picking: true,
        onClick: function(e, model){
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
            view = new PhiloGL.Mat4();

        var element = $id('webMolCanvas')[0];
        onResize( canvas, function(){ gl.viewport(0,0,canvas.width,canvas.height); } );

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.viewport(0, 0, canvas.width, canvas.height);
        
        renderizerProtein();

        var lights = scene.config.lights;
          lights.enable = 1;
          lights.ambient = {
            r: 0.2,
            g: 0.2,
            b: 0.2
          };
          lights.directional = {
            color: {
              r: 0.8,
              g: 0.8,
              b: 0.8
            },
            direction: {
              x: 0.0,
              y: 0.0,
              z: -1.0
            }
          };

        draw();

        function draw() {
          view.id();

          NScamera.step();
          NScamera.feed(view);

          //camera.view.id();
          //camera.view.$mulMat4(mvMatrix);

          view.$invert();

          NScamera.update();

          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

          program.setUniform('worldMatrix', camera.view);
          program.setUniform('projectionMatrix', camera.projection);
          renderizer.render(type);
          PhiloGL.Fx.requestAnimationFrame(draw);
        }
      }
    });
  }
