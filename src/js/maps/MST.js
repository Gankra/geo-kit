var gk = (function(gk){
    var utils = gk.utils;
    var filters = gk.filters;
    var Graph = gk.Graph;
    var Map = gk.Map;
    var DisjointSets = gk.DisjointSets;


    var MST = new Map("MST", "Minimum spanning tree of a graph or set of points");
    
    MST.canMap = filters.any(filters.isGraph, filters.containsOnly(filters.isPoint));
    
    MST.doMap = function(graph){
        if(!graph.vertices){
            graph = gk.getMap("Complete Graph").doMap(graph);
        }
        var vertices = graph.vertices.clone();
        var edges = graph.edges.clone();
        var sortedEdges = utils.sort(edges.toArray(), function(a, b){
            return a.length-b.length;
        });
        var forest = new DisjointSets(vertices);
        var result = new Graph();

        for(var i=0; i<sortedEdges.length; ++i){
            var edge = sortedEdges[i];
            if(!forest.doShareSet(edge.ptA, edge.ptB)){
                forest.union(edge.ptA, edge.ptB);
                result.add(edge.clone(true));
            }
        }

        return result;
    }

    gk.registerMap(MST);

    return gk;
})(gk || {});