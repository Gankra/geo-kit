var gk = (function(gk){
    var Edge = gk.LineSegment;

    function Graph(v, e){
        if(e){
            this.vertices = v;
            this.edges = e;    
        }else if(v){
            this.edges = v;
            this.vertices = new gk.Collection();
        }else{
            this.edges = new gk.Collection();
            this.vertices = new gk.Collection();
        }

        for(var i=0; i<this.vertices.length; ++i){
            var vertex = this.vertices.get(i);
            vertex.edges = vertex.edges || []; 
        }

        for(var i=0; i<this.edges.length; ++i){
            var edge = this.edges.get(i);
            var ptA = edge.ptA;
            var ptB = edge.ptB;

            ptA.edges.push(edge);
            ptB.edges.push(edge);

            if(!e){
                this.vertices.add(ptA);
                this.vertices.add(ptB);
            }
        }
    }

    Graph.prototype = new gk.Collection();

    Graph.prototype.__defineGetter__("length", function(){
        return this.vertices.length + this.edges.length;
    });

    Graph.prototype.get = function(i){
        if(i>=this.vertices.length){
            return this.edges.get(i - this.vertices.length);
        }else{
            return this.vertices.get(i);
        }
    }

    Graph.prototype.clear = function(){
        this.vertices = new gk.Collection();
        this.edges = new gk.Collection();
    }
    
    Graph.prototype.add = function(item){
        if(item.coords){
            this.addVertex(item);
        }else{
            this.addEdge(item);
        }
    }

    Graph.prototype.splice = function(){
        throw "TODO: implement Graph.splice";
    }
    
    Graph.prototype.remove = function(item){
        if(item.coords){
            this.removeVertex(item);
        }else if(item.ptA){
            this.removeEdge(item);
        }else{
            for(var i=0; i<item.length; ++i){
                this.remove(item.get(i));
            }
        }
    }
    
    Graph.prototype.contains = function(item){
        return this.vertices.indexOf(item) != -1 && this.edges.indexOf(item) != -1;
    }

    Graph.prototype.addVertex = function(vertex){
        this.vertices.add(vertex);
    }

    Graph.prototype.removeVertex = function(vertex){
        this.vertices.remove(vertex);
        for(var i=0; i<vertex.edges.length; ++i){
            var edge = vertex.edges[i];
            this.edges.remove(edge);
        }
    }

    Graph.prototype.addEdge = function(vertexA, vertexB){
        var edge;
        if(vertexB){
            edge = new Edge(vertexA, vertexB);
        }else{
            edge = vertexA;
        }
        this.edges.add(edge);
        edge.ptA.edges.push(edge);
        edge.ptB.edges.push(edge);
    }

    Graph.prototype.removeEdge = function(edge){
        this.edges.remove(edge);
        var edgesA = edge.ptA.edges;
        var edgesB = edge.ptB.edges;
        edgesA.splice(edgesA.indexOf(edge), 1);
        edgesB.splice(edgesB.indexOf(edge), 1);
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

    gk.Graph = Graph;

    return gk;
})(gk || {});