  var $id = function(d) { return document.getElementById(d); };
  var eventHandler = new EventHandler();
  var proteinReader = new ProteinReader();
  var renderizer = new Renderizer();

  function renderizerTypeChanged(){
    var sel = $id('renderizerType').options;
    for(i=0; i<sel.length; i++){
      if(sel[i].selected){
        renderizer.renderize(protein, i);
      }
    }
  }

  function renderizerProtein(){
    protein = proteinReader.proteinSample();
    renderizer.renderize(protein, RenderizerType.ballAndStick);
  }

  function webGLStart() {
    PhiloGL('webMolCanvas', {
      events: {
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
            camera = app.camera

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.viewport(0, 0, canvas.width, canvas.height);

        renderizerProtein();

        draw();

        function draw() {
          var mvMatrix = new PhiloGL.Mat4();
          mvMatrix.id();

          NScamera.step();
          NScamera.feed(mvMatrix);
          
          mvMatrix.$transpose();

          camera.projection = new PhiloGL.Mat4().perspective(camera.fov, camera.aspect, camera.near, camera.far);
          
          camera.view.set(mvMatrix[0],mvMatrix[1],mvMatrix[2],mvMatrix[3],
                          mvMatrix[4],mvMatrix[5],mvMatrix[6],mvMatrix[7],
                          mvMatrix[8],mvMatrix[9],mvMatrix[10],mvMatrix[11],
                          mvMatrix[12],mvMatrix[13],mvMatrix[14],mvMatrix[15]);

          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

          var lights = scene.config.lights;
          lights.enable = $id('lighting').checked;
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

          scene.render();
          PhiloGL.Fx.requestAnimationFrame(draw);
          
        }
      }
    });
  }
