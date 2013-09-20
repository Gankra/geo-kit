var gk = (function(gk){
    var utils = gk.utils;
    var Graph = gk.Graph;
    var Set = gk.Set;

    var CompleteGraph = new gk.Map("Complete Graph", "Computes the complete graph of a set of points");
    
    CompleteGraph.canMap = gk.Map.isPoints;
    
    CompleteGraph.doMap = function(collection){
        var graph = new Graph(collection.clone(true), new Set());

        var it = graph.vertices.iterator();
        while(it.hasNext()){
            var ptA = it.next();
            var it2 = graph.vertices.iterator();
            while(it2.hasNext()){
                var ptB = it2.next();
                if(!ptA.equals(ptB)){
                    graph.addEdge(ptA, ptB);
                }
            }
        }

        return graph;
    }

    gk.registerMap(CompleteGraph);

    return gk;
})(gk || {});