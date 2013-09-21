var gk = (function(gk){
    var utils = gk.utils;
    var filters = gk.filters;
    var Set = gk.Set;
    var Edge = gk.LineSegment;
    var Map = gk.Map;


    var VisibilityGraph = new Map("Visibility Graph", "Visibility graph of a set of points and edges");
    
    VisibilityGraph.canMap = filters.containsOnly(filters.any(filters.isPoint, filters.isLineish));
    
    VisibilityGraph.doMap = function(collection){
        var points = utils.filter(new Set(collection), function(item){
            return !!item.coords;
        }).clone(true);

        var lines = utils.filter(new Set(collection), function(item){
            return !!item.slope;
        });

        var result = new gk.Graph();

        var it = lines.iterator();
        while(it.hasNext()){
            var endPoints = it.next().getEndPoints();
            for(var j=0; j<endPoints.length; ++j){
                points.add(endPoints[j]);
            }
        }

        var it = points.iterator();
        while(it.hasNext()){
            var ptA = it.next();
            var it2 = it.clone();
            while(it2.hasNext()){
                var ptB = it2.next();
                var edge = new Edge(ptA, ptB);
                var okay = true;
                var it3 = lines.iterator();
                while(it3.hasNext()){
                    var obstacle = it3.next();
                    if(utils.intersects(obstacle, edge)){
                        var pts = obstacle.getEndPoints();
                        okay = false;
                        //allow it if they share endPoints
                        for(var i=0; i<pts.length; ++i){
                            var pt = pts[i];
                            if(ptA.equals(pt) || ptB.equals(pt)){
                                okay = true;
                                break;
                            }
                        }
                        if(!okay){
                            break;
                        }
                    }
                }
                if(okay){
                    result.add(edge);
                }
            }
        }    
        return result;
    }

    gk.registerMap(VisibilityGraph);

    return gk;
})(gk || {});
