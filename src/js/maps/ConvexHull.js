var gk = (function(gk){
    var utils = gk.utils;
    var ConvexHull = new gk.Map("Convex Hull", "Computes the convex hull of a set of points");
    
    ConvexHull.canMap = gk.Map.isPoints;
    
    /**
     * Graham's scan
     */
    ConvexHull.doMap = function(collection){
        var hull = [];

        //find lowest point, tie break by x-coord
        var min = utils.maximum(collection, function(a, b){
            if(a.y==b.y){
                return b.x - a.x;
            }else{
                return b.y - a.y;
            }
        });

        hull.push(min);

        //sort points by angle to min (CCW)
        var pts = collection.clone(true);
        pts.remove(min);
        var sortedPts = utils.sort(pts.toArray(), function(a, b){
            return Math.atan2(a.y-min.y, a.x-min.x) - Math.atan2(b.y-min.y, b.x-min.x) ;
        });
        
        //a stupid loop to handle degenerate sized inputs well
        for(var i=0; i<1; ++i){
            hull.push(sortedPts[i]);
        }

        //pop off points until adding the next point would make a left turn
        //then add the next point
        for(var i=1; i<pts.length; ++i){
            var pt = sortedPts[i];
            while(hull.length>2 && utils.isRightTurn(hull[hull.length-2], hull[hull.length-1], pt)){
                hull.pop();
            }
            hull.push(pt);
        }

        //pop off points until the end connects with the start cleanly
        while(hull.length>2 && utils.isRightTurn(hull[hull.length-2], hull[hull.length-1], hull[0])){
            hull.pop();
        }

        var poly = new gk.Set();
        poly.add(new gk.LineSegment(hull[hull.length-1], hull[0]));
        for(var i=0; i<hull.length-1; ++i){
            poly.add(new gk.LineSegment(hull[i], hull[i+1]));
        }

        return new gk.Graph(poly);
    }

    gk.registerMap(ConvexHull);

    return gk;
})(gk || {});
