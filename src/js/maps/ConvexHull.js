var gk = (function(gk){

    var ConvexHull = new gk.Map("Convex Hull", "Computes the convex hull of a set of points");
    
    ConvexHull.canMap = function(collection){
        for(var i=0; i<collection.length; ++i){
            if(!collection.get(i).coords){
                return false;
            }
        }
        return true;
    };
    
    ConvexHull.doMap = function(collection){
        //TODO: implement this method
    }

    gk.registerMap(ConvexHull);

    return gk;
})(gk || {});
