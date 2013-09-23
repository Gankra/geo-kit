var gk = (function(gk){
    var utils = gk.utils;
    var filters = gk.filters;
    var Graph = gk.Graph;
    var Map = gk.Map;
    var DisjointSets = gk.DisjointSets;

    var Delaunay = new Map("Delaunay Triangulation", "The Delaunay Triangulation of a set of points");
    
    Delaunay.canMap = filters.containsOnly(filters.isPoint);
    
    Delaunay.doMap = function(points){
        var result = new Graph();

        return result;
    }

    gk.registerMap(Delaunay);

    return gk;
})(gk || {});