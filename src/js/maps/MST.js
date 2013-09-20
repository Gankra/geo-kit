var gk = (function(gk){
    var utils = gk.utils;
    var Graph = gk.Graph;

    var MST = new gk.Map("MST", "Computes the minimum spanning tree of a graph");
    
    CompleteGraph.canMap = function(collection){
        return !!collection.vertices;
    };
    
    CompleteGraph.doMap = function(graph){
        var vetices = graph.vertices.clone;
        var edges = graph.edges.clone();
        var items = utils.sort(edges).items;



        return graph;
    }

    gk.registerMap(CompleteGraph);

    return gk;
})(gk || {});