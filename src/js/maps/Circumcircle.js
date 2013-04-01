var gk = (function(gk){

    var Circumcircle = new gk.Map("Circumcircle", "Circumcircle of 3 points");
    
    //Only accept a collection of 3 points
    Circumcircle.canMap = function(collection){
        if(collection.length!=3){
            return false;
        }
        for(var item in collection){
            if(!item.coords){
                return false;
            }
        }
        return true;
    };
    
    //Algorithm from wikipedia, see: http://en.wikipedia.org/wiki/Circumscribed_circle#Cartesian_coordinates
    Circumcircle.doMap = function(collection){
        var result = new gk.Collection();
        var a = collection.get(0);
        var b = collection.get(1);
        var c = collection.get(2);
        var D = 2*(a.x*(b.y-c.y) + b.x*(c.y-a.y) + c.x*(a.y-b.y));
        result.add(new gk.Circle(
            new gk.Point(
                ((a.x*a.x + a.y*a.y)*(b.y-c.y) + (b.x*b.x + b.y*b.y)*(c.y-a.y)+(c.x*c.x + c.y*c.y)*(a.y-b.y))/D,
                ((a.x*a.x + a.y*a.y)*(c.x-b.x) + (b.x*b.x + b.y*b.y)*(a.x-c.x)+(c.x*c.x + c.y*c.y)*(b.x-a.x))/D
            ),
            new gk.Point(a.x, a.y)
        ));
        return result;
    }

    gk.registerMap(Circumcircle);

    return gk;
})(gk || {});
