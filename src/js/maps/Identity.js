var gk = (function(gk){
    var filters = gk.filters;
    var Map = gk.Map;

    var Identity = new Map("Identity", "Returns its input");
    
    //Only accept a collection of 3 points
    Identity.canMap = filters.yes;
    
    //Algorithm from wikipedia, see: http://en.wikipedia.org/wiki/Circumscribed_circle#Cartesian_coordinates
    Identity.doMap = function(collection){
        return collection.clone(true);
    }

    gk.registerMap(Identity);

    return gk;
})(gk || {});
