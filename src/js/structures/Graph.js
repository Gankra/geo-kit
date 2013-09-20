var gk = (function(gk){
    var Edge = gk.LineSegment;
    var Set = gk.Set;

    function Graph(v, e){
        this.vertices = new Set();
        this.edges = new Set();
        var vertices;
        var edges;
        if(v){
            this.addAll(v);
        }
        if(e){
            this.addAll(e);  
        }
    }

    Graph.prototype = new gk.Collection();

    Graph.prototype.emptyInstance = function(){
        return new Graph();
    }

    Graph.prototype.__defineGetter__("length", function(){
        return this.vertices.length + this.edges.length;
    });

    Graph.prototype.clear = function(){
        this.vertices = new Set();
        this.edges = new Set();
    }
    
    Graph.prototype.add = function(item){
        if(item.coords){
            this.addVertex(item);
        }else{
            this.addEdge(item);
        }
    }
    
    Graph.prototype.remove = function(item){
        if(item.coords){
            this.removeVertex(item);
        }else if(item.ptA){
            this.removeEdge(item);
        }
    }
    
    Graph.prototype.contains = function(item){
        return this.vertices.contains(item) || this.edges.contains(item);
    }

    Graph.prototype.addVertex = function(vertex){
        this.vertices.add(vertex);
        vertex.edges = vertex.edges || new Set();
    }

    Graph.prototype.removeVertex = function(vertex){
        this.vertices.remove(vertex);
        var edges = vertex.edges.toArray();
        var self = this;
        edges.forEach(function(edge){
            self.removeEdge(edge);
        });
    }

    Graph.prototype.addEdge = function(vertexA, vertexB){
        var edge;
        if(vertexB){
            edge = new Edge(vertexA, vertexB);
        }else{
            edge = vertexA;
        }

        this.addVertex(edge.ptA);
        this.addVertex(edge.ptB);

        this.edges.add(edge);

        edge.ptA.edges.add(edge);
        edge.ptB.edges.add(edge);
    }

    Graph.prototype.removeEdge = function(edge){
        this.edges.remove(edge);
        edge.ptA.edges.remove(edge);
        edge.ptB.edges.remove(edge);
    }

    Graph.prototype.clone = function(deep){
        if(deep){
            return new Graph(this.vertices.clone(deep), this.edges.clone(deep));
        }else{
            return new Graph(this.vertices.clone(), this.edges.clone());
        }
    }

    Graph.prototype.replaceItems = function(graph, src){
        this.vertices = graph.vertices;
        this.edges = graph.edges;
        gk.emit(this, {
            event: gk.EVENT_REPLACED
        });
    }

    Graph.prototype.iterator = function(){
        var vIt = this.vertices.iterator();
        var eIt = this.edges.iterator();
        return {
            hasNext: function(){
                return vIt.hasNext() || eIt.hasNext();
            }
          , next: function(){
                if(vIt.hasNext()){
                    return vIt.next();
                }else{
                    return eIt.next();
                }
            }
        }
    }

    gk.Graph = Graph;

    return gk;
})(gk || {});