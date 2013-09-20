var gk = (function(gk){
    var utils = gk.utils;
    var filters = gk.filters;
    var Graph = gk.Graph;
    var Set = gk.Set;
    var Map = gk.Map;

    var CompleteGraph = new Map("Complete Graph", "Complete graph of a set of points");
    
    CompleteGraph.canMap = filters.containsOnly(filters.isPoint);
    
    CompleteGraph.doMap = function(collection){
        var graph = new Graph(collection.clone(true), new Set());

        var it = graph.vertices.iterator();
        while(it.hasNext()){
            var ptA = it.next();
            var it2 = it.clone();
            while(it2.hasNext()){
                var ptB = it2.next();
                graph.addEdge(ptA, ptB);
            }
        }

        return graph;
    }

    gk.registerMap(CompleteGraph);

    return gk;
})(gk || {});