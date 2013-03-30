var gk = (function(gk){

    var ConvexHull = new Map("Convex Hull", "Computes the convex hull of a set of points");
    
    ConvexHull.canMap = function(collection){
        for(var item in collection){
            if(!item.coords){
                return false;
            }
        }
        return true;
    });
    
    ConvexHull.doMap = function(collection){
        //TODO: implement this method
    }

    gk.registerMap(ConvexHull);

    return gk;
})(gk || {});
