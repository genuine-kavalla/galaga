/**
 *  Generate a variable integer
 * @param {Number} multiplier
 * @param addOn
 * @returns {number}
 */
 var variableInteger = function(multiplier, addOn) {
    var x = Math.floor((Math.random() * multiplier) + addOn);

    if (x > multiplier) {
        return multiplier;
    }
    return x;
};

/**
 * Set the rectangle bounds about an entity.
 * @param entity
 */
var setEntityBounds = function(entity) {
    entity.left = entity.x + entity.xOffset;
    entity.right = entity.left + entity.width;
    entity.top = entity.y + entity.yOffset;
    entity.bottom = entity.top + entity.height;
};

// Quadratic Bezier Curve for 2 Control Points, total 3 points.
function B0_2(t) { return (1 - t) * (1 - t); }
function B1_2(t) { return 2 * (1 - t) * t; }
function B2_2(t) { return t * t; }

// Derivative for Quadratic Bezier Curve
function B0_2_DT(t) { return 2 * (1 - t); }
function B1_2_DT(t) { return 2 * t; }

// Cubic Bezier Curve for 3 Control Points, total 4 points.
function B0_3(t) { return (1 - t) * (1 - t) * (1 - t); }
function B1_3(t) { return 3 * ((1 - t) * (1 - t)) * t; }
function B2_3(t) { return 3 * (1 - t) * (t * t); }
function B3_3(t) { return t * t * t; }

// Derivative for Cubic Bezier Curve
function B0_3_DT(t) { return 3 * ((1 - t) * (1 - t)); }
function B1_3_DT(t) { return 6 * (1 - t) * t; }
function B2_3_DT(t) { return 3 * t * t; }

/**
 * @description Calculate location of point on Bezier curve at time t.
 *
 * Function calculates the x and y value along a Bezier curve at given
 * time 't'. The function accepts a variable number of arguments between
 * 3 and 5. The last argument specified must be the 't' value indicating
 * location along the curve.
 *
 * @param {Point} Point objects used as the control points in the calculation. 2, 3 or 4
 * @param {Number} t Location calculated along the curve. Valid values are:    0 <= t >= 1;
 * @returns {Point} Point on the curve at the given t value
 */
var bezierPoint = function() {
    var t = Array.prototype.slice.call(arguments, arguments.length - 1);
    var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);

    var x = 0;
    var y = 0;

    if (arguments.length === 5) {
        // Calculate a point along a Cubic Bezier Curve
        x = B0_3(t) * args[0].x + B1_3(t) * args[1].x + B2_3(t) * args[2].x + B3_3(t) * args[3].x;
        y = B0_3(t) * args[0].y + B1_3(t) * args[1].y + B2_3(t) * args[2].y + B3_3(t) * args[3].y;
    }
    else if (arguments.length === 4) {
        // Calculate a point along a Quadratic Bezier Curve
        x = B0_2(t) * args[0].x + B1_2(t) * args[1].x + B2_2(t) * args[2].x;
        y = B0_2(t) * args[0].y + B1_2(t) * args[1].y + B2_2(t) * args[2].y;
    }
    else if (arguments.length === 3) {
        x = (1 - t) * args[0].x + t * args[1].x;
        y = (1 - t) * args[0].y + t * args[1].x;
    }
    return new app.Point(x, y);
};

/**
 * @description Calculate the angle tangent to the Bezier Curve
 *
 * Function calculates the angle tangent to the Bezier Curve at given
 * time 't'. The function accepts a variable number of arguments between
 * 3 and 5. The last argument specified must be the 't' value indicating
 * location along the curve.
 *
 * @param {Point} Point objects used as the control points in the calculation. 2, 3 or 4
 * @param {number} t - Angle calculated along the curve. Valid values are:    0 <= t >= 1;
 *
 * @returns {number} angle in Radians, PI / 2 is added to the return value to orient 0 up.
 *
 */
var bezierTangent = function() {
    var t = Array.prototype.slice.call(arguments, arguments.length - 1);
    var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
    var dx = 0;
    var dy = 0;

    if (arguments.length === 5) {
        dx = B0_3_DT(t) * (args[1].x - args[0].x) + B1_3_DT(t) * (args[2].x - args[1].x) + B2_3_DT(t) * (args[3].x - args[2].x);
        dy = B0_3_DT(t) * (args[1].y - args[0].y) + B1_3_DT(t) * (args[2].y - args[1].y) + B2_3_DT(t) * (args[3].y - args[2].y);
    }
    else if (arguments.length === 4) {
        dx = B0_2_DT(t) * (args[1].x - args[0].x) + B1_2_DT(t) * (args[2].x - args[1].x);
        dy = B0_2_DT(t) * (args[1].y - args[0].y) + B1_2_DT(t) * (args[2].y - args[1].y);
    }

    return Math.atan2(dy, dx) + (Math.PI / 2);
};


var calculateCurveLength = function(c) {
    var length = 0;
    var diff = 0;
    for (var i = 0; i < c.length; i++) {
        diff = 0;
        if (i < (c.length - 1)) {
            diff = Math.sqrt((c[i].y - c[i + 1].y) * (c[i].y - c[i + 1].y) + (c[i].x - c[i + 1].x) * (c[i].x - c[i + 1].x));
            length += diff;
        }
    }
    console.log(length / 100);
    return length / 100;
};

var calculateBezierCurvePoints = function() {
    var savedArguments = [];
    var points = [];
    for (var t = 0; t <= 1; t = t + 0.02) {
        savedArguments = Array.prototype.slice.call(arguments);
        savedArguments.push(t);
        points.push(bezierPoint.apply(null, savedArguments));
        savedArguments = [];
    }
    var arcLength = polySimplify(points, 0.5);
    // console.log(arcLength);
    return points;
};

var calculateBezierCurveAngles = function() {
    var savedArguments = [];
    var angles = [];
    for (var t = 0; t <= 1; t = t + 0.02) {
        savedArguments = Array.prototype.slice.call(arguments);
        savedArguments.push(t);
        angles.push(bezierTangent.apply(null, savedArguments));
        savedArguments = [];
    }
    return angles;
};

var pushApply = Function.apply.bind([].push);
var sliceCall = Function.call.bind([].slice);

Object.defineProperty(Array.prototype, 'pushArrayMembers', {
    value: function() {
        for (var i = 0; i < arguments.length; i++) {
            var toAdd = arguments[i];
            for (var n = 0; n < toAdd.length; n += 300) {
                pushApply(this, sliceCall(toAdd, n, n + 300));
            }
        }
    }
});

/**
 *
 * @param {Number} r Radius of circle
 * @param {Point} origin Center point of the circle.
 * @param {String} rotationDirection Direction of rotation either 'cw' or 'ccw'
 * @returns {Array|calculateCirclePoints.points}
 */
var calculateCirclePoints = function() {
    var r = arguments[0];
    var origin = arguments[1];
    var rotationDirection = arguments[2] || 'ccw';
    var x = 0;
    var y = 0;
    var points = [];

    if (rotationDirection === 'cw') {
        for (var i = 0; i <= (Math.PI * 2); i += 0.1) {
            x = (origin.x) + r * Math.cos((Math.PI / 2) + i);
            y = (origin.y) + r * Math.sin((Math.PI / 2) + i);
            points.push(new app.Point(x, y));
        }
    }
    else if (rotationDirection === 'ccw') {
        for (var j = 0; j <= (Math.PI * 2); j += 0.1) {
            x = (origin.x) + r * Math.sin(Math.PI * 2 + j);
            y = (origin.y - r) + r * Math.cos(Math.PI * 2 + j);
            points.push(new app.Point(x, y));
        }
    }
    return points;
};

var calculateCircleAngles = function() {
    var r = arguments[0];
    var p = arguments[1];
    var angles = [];

    var startPointX = p[0].x;
    var startPointY = p[0].y;

    for (var i = 0; i < p.length; i++) {
        var deltaX = p[i].x - startPointX;
        var deltaY = p[i].y - startPointY + r;
        angles.push((Math.atan2(deltaY, deltaX)));
    }
    return angles;

};

var calculateControlPoints = function(type, direction) {
    // type - Triangular
    var startPoint;
    var endPoint;
    var cp = [];
    // two arguments indicate start and end points are the same.
    if (arguments.length === 3) {
        startPoint = arguments[2];
        endPoint = arguments[2];
    }
    else if (arguments.length === 4) {
        startPoint = arguments[2];
        endPoint = arguments[3];
        // console.log('End Point = ' + endPoint.toString());
    }

    if (type === 'triangle' && direction === 'cw') {
        // point is the current location of the entity.
        // end points will be equal.
        cp.push(startPoint);
        cp.push(new app.Point(startPoint.x - 400, 700));
        cp.push(new app.Point(startPoint.x + 400, 700));
        cp.push(endPoint);
    }
    else if (type === 'triangle' && direction === 'ccw') {
        cp.push(startPoint);
        cp.push(new app.Point(startPoint.x + 400, 700));
        cp.push(new app.Point(startPoint.x - 400, 700));
        cp.push(endPoint);

    }
    else if (type === 'sideentry' && direction === 'left') {
        cp.push(startPoint);
        cp.push(new app.Point(700, 700));
        cp.push(new app.Point(300, 200));
        cp.push(endPoint);
    }
    else if (type === 'sideentry' && direction === 'right') {
        cp.push(startPoint);
        cp.push(new app.Point(200, 700));
        cp.push(new app.Point(100, 200));
        cp.push(endPoint);
    }

    return cp;
};

var calculateLoopPoints = function() {
    var startPoint = arguments[0];
    var points = [];
    var ang = [];
    var cp1 = null;
    var cp2 = null;
    var cp3 = null;
    var cp4 = null;

    // quadratic curve - starts at currentPoint
    cp1 = new app.Point(startPoint.x - 300, startPoint.y + 300);
    cp2 = new app.Point(startPoint.x, startPoint.y + 300);
    points.pushArrayMembers(calculateBezierCurvePoints(startPoint, cp1, cp2));
    ang.pushArrayMembers(calculateBezierCurveAngles(startPoint, cp1, cp2));

    // loop (circle)
    var cirPoints = [];
    cirPoints.pushArrayMembers(calculateCirclePoints(50, cp2, 'ccw'));
    points.pushArrayMembers(cirPoints);
    ang.pushArrayMembers(calculateCircleAngles(50, cirPoints));

    // quadratic curve - stops at currentPoint
    cp3 = new app.Point(startPoint.x + 300, startPoint.y + 300);
    points.pushArrayMembers(calculateBezierCurvePoints(cp2, cp3, startPoint));
    ang.pushArrayMembers(calculateBezierCurveAngles(cp2, cp3, startPoint));

    return [points, ang];
};

/**
 * Grabbed snippet of code from: http://www.html5gamedevs.com/topic/1828-how-to-calculate-fps-in-plain-javascript/
 * @type {{startTime: number, frameNumber: number, getFPS: Function}}
 */
var fps = {
    startTime : 0,
    frameNumber : 0,
    getFPS : function() {
        this.frameNumber++;
        var d = new Date().getTime();
        var currentTime = (d - this.startTime) / 1000;
        var result = Math.floor((this.frameNumber / currentTime));

        if (currentTime > 1) {
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }
        return result;

    }
};


var polySimplify = function(V, tol) {
    // V ... [[x1,y1],[x2,y2],...] polyline
    // tol  ... approximation tolerance
    // ==============================================
    // Copyright 2002, softSurfer (www.softsurfer.com)
    // This code may be freely used and modified for any purpose
    // providing that this copyright notice is included with it.
    // SoftSurfer makes no warranty for this code, and cannot be held
    // liable for any real or imagined damage resulting from its use.
    // Users of this code must verify correctness for their application.
    // http://softsurfer.com/Archive/algorithm_0205/algorithm_0205.htm
    var sum = function(u, v) {return [u[0] + v[0], u[1] + v[1]];}
    var diff = function(u, v) {return [u[0] - v[0], u[1] - v[1]];}
    var prod = function(u, v) {return [u[0] * v[0], u[1] * v[1]];}
    var dot = function(u, v) {return u[0] * v[0] + u[1] * v[1];}
    var norm2 = function(v) {return v[0] * v[0] + v[1] * v[1];}
    var norm = function(v) {return Math.sqrt(norm2(v));}
    var d2 = function(u, v) {return norm2(diff(u, v));}
    var d = function(u, v) {return norm(diff(u, v));}

    var simplifyDP = function(tol, v, j, k, mk) {
        //  This is the Douglas-Peucker recursive simplification routine
        //  It just marks vertices that are part of the simplified polyline
        //  for approximating the polyline subchain v[j] to v[k].
        //  mk[] ... array of markers matching vertex array v[]
        if (k <= j + 1) { // there is nothing to simplify
            return;
        }
        // check for adequate approximation by segment S from v[j] to v[k]
        var maxi = j;          // index of vertex farthest from S
        var maxd2 = 0;         // distance squared of farthest vertex
        var tol2 = tol * tol;  // tolerance squared
        S = [v[j], v[k]];  // segment from v[j] to v[k]
        u = diff(S[1], S[0]);   // segment direction vector
        var cu = norm2(u, u);     // segment length squared
        // test each vertex v[i] for max distance from S
        // compute using the Feb 2001 Algorithm's dist_Point_to_Segment()
        // Note: this works in any dimension (2D, 3D, ...)
        var  w;           // vector
        var Pb;                // point, base of perpendicular from v[i] to S
        var b;
        var cw;
        var dv2;        // dv2 = distance v[i] to S squared
        for (var i = j + 1; i < k; i++) {
            // compute distance squared
            w = diff(v[i], S[0]);
            cw = dot(w, u);
            if (cw <= 0) {
                dv2 = d2(v[i], S[0]);
            } else if (cu <= cw) {
                dv2 = d2(v[i], S[1]);
            } else {
                b = cw / cu;
                Pb = [S[0][0] + b * u[0], S[0][1] + b * u[1]];
                dv2 = d2(v[i], Pb);
            }
            // test with current max distance squared
            if (dv2 <= maxd2) {
                continue;
            }
            // v[i] is a new max vertex
            maxi = i;
            maxd2 = dv2;
        }
        if (maxd2 > tol2) {      // error is worse than the tolerance
            // split the polyline at the farthest vertex from S
            mk[maxi] = 1;      // mark v[maxi] for the simplified polyline
            // recursively simplify the two subpolylines at v[maxi]
            simplifyDP(tol, v, j, maxi, mk);  // polyline v[j] to v[maxi]
            simplifyDP(tol, v, maxi, k, mk);  // polyline v[maxi] to v[k]
        }
        // else the approximation is OK, so ignore intermediate vertices
        return;
    }

    var n = V.length;
    var sV = [];
    var i;
    var k;
    var m;
    var pv;               // misc counters
    var tol2 = tol * tol;          // tolerance squared
    vt = [];                       // vertex buffer, points
    mk = [];                       // marker buffer, ints

    // STAGE 1.  Vertex Reduction within tolerance of prior vertex cluster
    vt[0] = V[0];              // start at the beginning
    for (i = k = 1, pv = 0; i < n; i++) {
        if (d2(V[i], V[pv]) < tol2) {
            continue;
        }
        vt[k++] = V[i];
        pv = i;
    }
    if (pv < n - 1) {
        vt[k++] = V[n - 1];      // finish at the end
    }

    // STAGE 2.  Douglas-Peucker polyline simplification
    mk[0] = mk[k - 1] = 1;       // mark the first and last vertices
    simplifyDP(tol, vt, 0, k - 1, mk);

    // copy marked vertices to the output simplified polyline
    for (i = m = 0; i < k; i++) {
        if (mk[i]) {
            sV[m++] = vt[i];
        }
    }
    return sV;
}
