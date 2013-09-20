var gk = (function(gk){
    var utils = gk.utils;
    var VisibilityGraph = new gk.Map("Visibility Graph", "Computes the visibility graph of a set of points and edges");
    
    VisilibilityGraph.canMap = gk.Map.isPoints;
    
    VisibilityGraph.doMap = function(collection){
        /*var points = utils.filter(collection, function(item){
            return !!item.coords;
        }).clone(true);

        var lines = utils.filter(collection, function(item){
            return !!item.slope;
        });

        var result = new gk.Collection();

        for(var i=0; i<lines.length; ++i){
            var endPoints = lines[i].getEndPoints();
            for(var j=0; j<endPoints.length; ++j){
                points.add(endPoints[j]);
            }
        }

        for(var i=0; i<points.length; ++i){
            var ptA = points.get(i);
            for(var j=i+1; j<points.length; ++j){
                var ptB = points.get(j);
                var edge = new gk.Line(ptA, ptB);
                var okay = true;
                for(var k=0; k<lines.length; ++k){
                    var obstacle = lines.get(k);
                    if(utils.intersects(obstacle, edge)){
                        okay = false;
                        break;
                    }
                }
                if(okay){
                    result.add(edge);
                }
            }
        }    
        return result;*/
    }

    gk.registerMap(VisibilityGraph);

    return gk;
})(gk || {});
