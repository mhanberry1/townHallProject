(function(module){
  var mapController = {};

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
// Turns state variable with dashes into the state name
  function parseState(string){
    var nameArray = string.split('-').map(function(name){
      return capitalizeFirstLetter(name);
    });
    return nameArray.join(' ');
  }

  mapController.webGlsupported = function(ctx, next){
    if (!mapboxgl.supported()) {
      mapView.webGL = false;
      ctx.webGL = false;
      mapView.noWebGlMapinit();
    } else {
      ctx.webGL = true;
      mapView.webGL = true;
      mapView.webGlinit(ctx.parentBB);
    }
    next();
  };

  mapController.getState = function(ctx, next){
    ///convert state name to necessary coordinates for mapbox url
    var stateName = $.grep(stateData, function(e){
      return e.Name === parseState(ctx.params.stateName);
    });
    ctx.params.stateName = stateName;
    if (stateName.length > 0) {
      var stateUsps = stateName[0]['USPS'];
      ctx.stateUPSP = stateUsps;
      stateView.state = ctx.stateUPSP;
      next();
    } else {
      page('/');
    }
  };

  mapController.setBounds = function(ctx, next) {
    if (ctx.stateUPSP) {
      var bbox = bboxes[ctx.stateUPSP];
      var padding = 1;
      var expandedbb = [bbox[0] - padding, bbox[1] - padding, bbox[2] + padding, bbox[3] + padding];
      stateView.stateCoords = expandedbb;
      ctx.stateCoords = expandedbb;
      ctx.parentBB = expandedbb;
      ctx.bounds = new mapboxgl.LngLatBounds(ctx.stateCoords);
    } else {
      ctx.parentBB = [-128.8, 23.6, -65.4, 50.2];
      ctx.bounds = new mapboxgl.LngLatBounds([-128.8, 23.6], [-65.4, 50.2]);
    }
    next();
  };

  mapController.setMap = function(ctx, next){
    if (ctx.webGL) {
      var style = null;
      if (ctx.stateUPSP) {
        style = 'mapbox://styles/townhallproject/cjbqzhc4b8c1x2trz43dk8spj';

      }
      ctx.map = mapView.setMap(style, ctx.parentBB, ctx.bounds);
    }
    next();
  };

  mapController.readData = function(ctx, next) {
    if (!ctx.webGL) {
      mapView.readData(false);
      return next();
    }
    ctx.map.on('load', function() {
      mapView.backSpaceHack();
      mapView.makeZoomToNationalButton();
      mapView.addDistrictListener();
      mapView.addPopups();
      mapView.addLayer();
      mapView.readData(true);
      TownHall.isMap = true;
      next();
    });
  };

  mapController.readStateData = function(ctx, next) {
    if (!ctx.webGL) {
      mapView.readStateData(false);
      return next();
    }
    ctx.map.on('load', function() {
      mapView.backSpaceHack();
      mapView.makeZoomToNationalButton(ctx.stateUPSP);
      mapView.addDistrictListener();
      mapView.addPopups();
      mapView.addLayer();
      mapView.readStateData(true, ctx.stateUPSP);
      TownHall.isMap = true;
      next();
    });
  };

  mapController.maskCountry = function(ctx, next) {
    stateView.maskCountry(ctx.map, ctx.stateUPSP);
    next();
  };

  mapController.reset = function(ctx, next) {
    stateView.stateCoords = undefined;
    next();
  };

  module.mapController = mapController;
})(window);
