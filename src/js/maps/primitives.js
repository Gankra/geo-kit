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
    var Box = gk.Box;
    var LineSegment = gk.LineSegment;
    var Circle = gk.Circle;

    function registerPrimitiveMap(name, description, fn, filter, icon){
        var map = new Map(name, description);
        map.canMap = filter;
        map.doMap = fn;
        map.primitive = true;
        gk.registerMap(map);
        $(function(){
            gk.makeButton("gk-primitive-map-menu", function(){
                gk.doMap(name);  
            }, name, icon);
        });
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
      , "points-to-edge"
    );

    registerPrimitiveMap(
        "Ray from Points"
      , "Ray starting at the first point and heading towards the second" 
      , function(collection){
            var it = collection.iterator();
            return makeSetOf(new Ray(it.next().clone(), it.next().clone()));
        }
      , filters.all(filters.lengthEquals(2), filters.containsOnly(filters.isPoint))
      , "points-to-ray"
    );

    registerPrimitiveMap(
        "Line from Points"
      , "Line passing through the given points" 
      , function(collection){
            var it = collection.iterator();
            return makeSetOf(new Line(it.next().clone(), it.next().clone()));
        }
      , filters.all(filters.lengthEquals(2), filters.containsOnly(filters.isPoint))
      , "points-to-line"
    );

    registerPrimitiveMap(
        "Circle from Points"
      , "Circle centered at the first point with second point on radius" 
      , function(collection){
            var it = collection.iterator();
            return makeSetOf(new Circle(it.next().clone(), it.next().clone()));
        }
      , filters.all(filters.lengthEquals(2), filters.containsOnly(filters.isPoint))
      , "points-to-circle"
    );

    registerPrimitiveMap(
        "Box from Points"
      , "Box with corners at the two given points" 
      , function(collection){
            var it = collection.iterator();
            return makeSetOf(new Box(it.next().clone(), it.next().clone()));
        }
      , filters.all(filters.lengthEquals(2), filters.containsOnly(filters.isPoint))
      , "points-to-box"
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
      , "intersection-points"
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
      , "circle-center-point"
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
      , "projection-point"
    );

    return gk;
})(gk || {});