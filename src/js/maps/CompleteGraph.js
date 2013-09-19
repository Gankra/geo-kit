var gk = (function(gk){
    var utils = gk.utils;
    var Graph = gk.Graph;
    var Collection = gk.Collection;

    var CompleteGraph = new gk.Map("Complete Graph", "Computes the complete graph of a set of points");
    
    CompleteGraph.canMap = gk.Map.isPoints;
    
    CompleteGraph.doMap = function(collection){
        var graph = new Graph(collection.clone(true), new Collection());

        for(var i=0; i<graph.vertices.length; ++i){
            var ptA = graph.vertices.get(i);
            for(var j=i+1; j<graph.vertices.length; ++j){
                var ptB = graph.vertices.get(j);
                graph.addEdge(ptA, ptB);
            }
        }

        return graph;
    }

    gk.registerMap(CompleteGraph);

    return gk;
})(gk || {});