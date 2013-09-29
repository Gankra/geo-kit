/**
 * Primitive Maps produce primitives, rather than complex composite structures
 */

var gk = (function(gk){
    var Map = gk.Map;
    var filters = gk.filters;
    var utils = gk.utils;
    var Set = gk.Set;
    var StrictSet = gk.StrictSet;
    var Point = gk.Point;
    var Line = gk.Line;
    var Ray = gk.Ray;
    var LineSegment = gk.LineSegment;
    var Circle = gk.Circle;

    function registerPrimitiveMap(name, description, fn, filter){
        var map = new Map(name, description);
        map.canMap = filter;
        map.doMap = fn;
        gk.registerMap(map);
    }

    function makeSetOf(item){
        var result = new Set();
        result.add(item);
        return result;
    }

    registerPrimitiveMap(
        "Line Segment from Points"
      , "Line Segment with the given endpoints" 
      , function(collection){
            var it = collection.iterator();
            return makeSetOf(new LineSegment(it.next().clone(), it.next().clone()));
        }
      , filters.all(filters.lengthEquals(2), filters.containsOnly(filters.isPoint))
    );

    registerPrimitiveMap(
        "Ray from Points"
      , "Ray starting at the first point and heading towards the second" 
      , function(collection){
            var it = collection.iterator();
            return makeSetOf(new Ray(it.next().clone(), it.next().clone()));
        }
      , filters.all(filters.lengthEquals(2), filters.containsOnly(filters.isPoint))
    );

    registerPrimitiveMap(
        "Line from Points"
      , "Line passing through the given points" 
      , function(collection){
            var it = collection.iterator();
            return makeSetOf(new Line(it.next().clone(), it.next().clone()));
        }
      , filters.all(filters.lengthEquals(2), filters.containsOnly(filters.isPoint))
    );

    registerPrimitiveMap(
        "Circle from Points"
      , "Circle centered at the first point with second point on radius" 
      , function(collection){
            var it = collection.iterator();
            return makeSetOf(new Circle(it.next().clone(), it.next().clone()));
        }
      , filters.all(filters.lengthEquals(2), filters.containsOnly(filters.isPoint))
    );

    registerPrimitiveMap(
        "Intersection Points"
      , "All intersections of Lineish objects" 
      , function(collection){
            var result = new StrictSet();
            var it = collection.iterator();
            while(it.hasNext()){
                var line1 = it.next();
                var it2 = it.clone();
                while(it2.hasNext()){
                    var line2 = it2.next();
                    var intersectionPt = line1.intersection(line2);
                    if(utils.isIntersection(line1, line2, intersectionPt)){
                        result.add(intersectionPt);
                    }
                }
            }
            return result;
        }
      , filters.containsOnly(filters.isLineish)
    );

    registerPrimitiveMap(
        "Circle Center Points"
      , "Center Points of Circles" 
      , function(collection){
            var result = new StrictSet();
            var it = collection.iterator();
            while(it.hasNext()){
                result.add(it.next().ptA);
            }
            return result;
        }
      , filters.containsOnly(filters.isCircle)
    );

    registerPrimitiveMap(
        "Projected Point"
      , "Projection of a Point onto a Lineish Object" 
      , function(collection){
            var result = new Set();
            var it = collection.iterator();
            var obj1 = it.next();
            var pt, line;
            if(filters.isPoint(obj1)){
                pt = obj1;
                line = it.next();
            }else{
                pt = it.next();
                line = obj1;
            }
            if(line.hasProjection(pt)){
                result.add(line.projection(pt));
            }

            return result;
        }
      , filters.all(
            filters.lengthEquals(2)
          , filters.containsAny(filters.isPoint)
          , filters.containsAny(filters.isLineish)
        )
    );

    return gk;
})(gk || {});