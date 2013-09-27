var gk = (function(gk){

    function DisjointSets(collection){
        this.items = {};
        this.setId = 0;
        if(collection){
            this.addAll(collection);
        }
    }

    //DisjointSets.prototype = new gk.Collection();
    DisjointSets.prototype.keyName = "uid";
    
    DisjointSets.prototype.add = function(item){
        if(!this.contains(item)){
            this.items[item[this.keyName]] = {
                item: item
              , parent: {
                    setId: ++this.setId
                  , length: 1
                }
            };
        }
    }
    
    DisjointSets.prototype.addAll = function(collection){
        var self = this;
        collection.forEach(function(item){
            self.add(item);
        });
    }
    
    DisjointSets.prototype.contains = function(item){
        return !!this.items[item[this.keyName]];
    }

    DisjointSets.prototype.union = function(item1, item2){
        var set1 = this._getSetNode(item1);
        var set2 = this._getSetNode(item2);

        if(set1.setId == set2.setId){
            return;
        }
        
        var smaller;
        var larger;
        if(set1.length < set2.length){
            smaller = set1;
            larger = set2;
        }else{
            larger = set1;
            smaller = set2;
        }
        smaller.parent = larger;
        larger.length += smaller.length;
    }

    DisjointSets.prototype._getSetNode = function(item){
        var parent = this.items[item[this.keyName]];
        var path = [];

        do{
            path.push(parent);
            parent = parent.parent;
        }while(parent.parent);

        for(var i=0; i<path.length; ++i){
            var node = path[i];
            if(path[i].item){
                path[i].parent = parent;  
            }
        }

        return parent;
    }

    DisjointSets.prototype.doShareSet = function(item1, item2){
        return this._getSetNode(item1).setId == this._getSetNode(item2).setId;
    }

    gk.DisjointSets = DisjointSets;

    return gk;
})(gk || {});