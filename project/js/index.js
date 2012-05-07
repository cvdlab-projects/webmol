  var $id = function(d) { return document.getElementById(d); };
  var eventHandler = new EventHandler();
  var proteinReader = new ProteinReader();
  var renderizer = new Renderizer();

  var type = RenderizerType.ballAndStick;

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
          protein = proteinReader.alanine();
          renderizer.renderize(protein, type);
        }
        else if(i==1){
          protein = proteinReader.arginine();
          renderizer.renderize(protein, type);
        }
        else if(i==2){
          protein = proteinReader.cysteine();
          renderizer.renderize(protein, type);
        }
        else if(i==3){
          protein = proteinReader.tryptophan();
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
    protein = proteinReader.load();
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
        onRightClick: function(e, model){
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

        draw();

        function draw() {
          view.id();

          NScamera.step();
          NScamera.feed(view);

          //camera.view.id();
          //camera.view.$mulMat4(mvMatrix);

          view.$invert();

          camera.position = new PhiloGL.Vec3(view[12],view[13],view[14]);
          camera.target = NScamera.center;
          camera.up = new PhiloGL.Vec3(view[4], view[5], view[6]);

          camera.update();

          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

          program.setUniform('worldMatrix', camera.view);
          program.setUniform('projectionMatrix', camera.projection);
          renderizer.render(type);
          PhiloGL.Fx.requestAnimationFrame(draw);
          
        }
      }
    });
  }
