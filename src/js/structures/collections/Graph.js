var gk = (function(gk){
    var Edge = gk.LineSegment;
    var StrictSet = gk.StrictSet;

    function Graph(v, e){
        this.vertices = new StrictSet();
        this.edges = new StrictSet();
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

    Graph.prototype._clear = function(){
        this.vertices = new StrictSet();
        this.edges = new StrictSet();
    }
    
    Graph.prototype.add = function(item){
        if(gk.filters.isPoint(item)){
            this.addVertex(item);
        }else{
            this.addEdge(item);
        }
    }
    
    Graph.prototype.remove = function(item){
        if(gk.filters.isPoint(item)){
            this.removeVertex(item);
        }else if(item.ptA){
            this.removeEdge(item);
        }
    }
    
    Graph.prototype.contains = function(item){
        return this.vertices.contains(item) || this.edges.contains(item);
    }

    Graph.prototype.addVertex = function(vertex){
        if(!this.vertices.contains(vertex)){
            this.vertices.add(vertex);
            vertex.edges = vertex.edges || new StrictSet();
            this._registerAddition(vertex);
        } 
    }

    Graph.prototype.removeVertex = function(vertex){
        this.vertices.remove(vertex);
        var edges = vertex.edges.toArray();
        var self = this;
        edges.forEach(function(edge){
            self.removeEdge(edge);
        });
        this._registerRemoval(vertex);
    }

    Graph.prototype.addEdge = function(vertexA, vertexB){
        var edge;
        if(vertexB){
            edge = new Edge(vertexA, vertexB);
        }else{
            edge = vertexA;
        }

        if(!this.edges.contains(edge)){
            this.addVertex(edge.ptA);
            this.addVertex(edge.ptB);
            
            edge.ptA = this.vertices.getMatch(edge.ptA);
            edge.ptB = this.vertices.getMatch(edge.ptB);
            
            this.edges.add(edge);
            edge.ptA.edges.add(edge);
            edge.ptB.edges.add(edge);
            this._registerAddition(edge);
        }
    }

    Graph.prototype.removeEdge = function(edge){
        this.edges.remove(edge);
        edge.ptA.edges.remove(edge);
        edge.ptB.edges.remove(edge);
        gk.emit(this, gk.getDefaultEvent(gk.EVENT_UPDATED));
        this._registerRemoval(edge);
    }

    Graph.prototype.clone = function(deep){
        if(deep){
            return new Graph(this.vertices.clone(deep), this.edges.clone(deep));
        }else{
            return new Graph(this.vertices.clone(), this.edges.clone());
        }
    }

    Graph.prototype._replaceItems = function(graph, src){
        this.vertices = graph.vertices;
        this.edges = graph.edges;
    }

    Graph.prototype.iterator = function(_vIt, _eIt){
        var vIt = _vIt || this.vertices.iterator();
        var eIt = _eIt || this.edges.iterator();
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
          , clone: function(){
                return self.iterator(_vIt, _eIt);
            }
        }
    }

    gk.Graph = Graph;

    return gk;
})(gk || {});