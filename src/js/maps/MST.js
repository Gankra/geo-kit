var gk = (function(gk){
    var utils = gk.utils;
    var filters = gk.filters;
    var Graph = gk.Graph;
    var Map = gk.Map;


    var MST = new Map("MST", "Minimum spanning tree of a graph");
    
    MST.canMap = filters.isGraph;
    
    MST.doMap = function(graph){
        var vetices = graph.vertices.clone;
        var edges = graph.edges.clone();
        var items = utils.sort(edges).items;



        return graph;
    }

    gk.registerMap(MST);

    return gk;
})(gk || {});