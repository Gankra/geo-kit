var gk = (function(gk){

    var ConvexHull = new gk.Map("Convex Hull", "Computes the convex hull of a set of points");
    
    ConvexHull.canMap = Map.isPoints;
    
    ConvexHull.doMap = function(collection){
        //TODO: implement this method
    }

    gk.registerMap(ConvexHull);

    return gk;
})(gk || {});
