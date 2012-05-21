	function Animation(){
		
	}

	Animation.prototype.goToDistance = function(_to, _from){
		  var fx = new PhiloGL.Fx({
		    duration: 1000,
		    transition: PhiloGL.Fx.Transition.Quad.easeOut,
		    onCompute: function(delta) {
		      var from = this.opt.from, to = this.opt.to;
		      NScamera.distance = PhiloGL.Fx.compute(from, to, delta);
		    }
		  });

		  fx.start({
              from: _to,
              to: _from
            });
		}

	  Animation.prototype.goToRotationQuatCoord = function(_to, _coord){
	    var fx = new PhiloGL.Fx({
	        duration: 500,
	        transition: PhiloGL.Fx.Transition.Quad.easeOut,
	        onCompute: function(delta) {
	          var from = this.opt.from, to = this.opt.to, coord = this.opt.coord;
	          NScamera.rot[coord] = PhiloGL.Fx.compute(from, to, delta);
	        }
	      });

	      fx.start({
	        from: NScamera.rot[_coord],
	        to: _to,
	        coord: _coord
	      });
	   }

	  Animation.prototype.goToCenterCoord = function(_to, _coord){
	    var fx = new PhiloGL.Fx({
	        duration: 1000,
	        transition: PhiloGL.Fx.Transition.Quad.easeOut,
	        onCompute: function(delta) {
	          var from = this.opt.from, to = this.opt.to, coord = this.opt.coord;
	          NScamera.center[coord] = PhiloGL.Fx.compute(from, to, delta);
	        }
	      });

	      fx.start({
	        from: NScamera.center[_coord],
	        to: _to,
	        coord: _coord
	      });
	   }

	  Animation.prototype.resetRotation = function(){
		this.goToRotationQuatCoord(0, 0);
	    this.goToRotationQuatCoord(0, 1);
	    this.goToRotationQuatCoord(0, 2);
	    this.goToRotationQuatCoord(1, 3);
	  }

	  Animation.prototype.goToCenter = function(vec){
		this.goToCenterCoord(vec.x, 0);
	    this.goToCenterCoord(vec.y, 1);
	    this.goToCenterCoord(vec.z, 2);
	  }