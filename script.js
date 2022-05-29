function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
}

const canvas = document.querySelector("canvas");
canvas.addEventListener("mousedown", function (e) {
    getCursorPosition(canvas, e);
});

const determinant = (m) =>
    m.length == 1
        ? m[0][0]
        : m.length == 2
        ? m[0][0] * m[1][1] - m[0][1] * m[1][0]
        : m[0].reduce(
              (r, e, i) => r + (-1) ** (i + 2) * e * determinant(m.slice(1).map((c) => c.filter((_, j) => i != j))),
              0
          );

// const test1 = [[3]]                      // 3
// const test2 = [[3,-2],[7,4]]             // 26
// const test3 = [[1,3,7],[2,-1,4],[5,0,2]] // 81

// console.log(determinant(test1))
// console.log(determinant(test2))
// console.log(determinant(test3))

const vectorSum = (vecA, vecB) => {
    if (vecA.length != vecB.length) {
        return null;
    }
    let result = [];
    for (let i = 0; i < vecA.length; i++) {
        result[i] = vecA[i] + vecB[i];
    }
    return result;
};

// console.log(vectorSum([3,-2],[7,4]));

const vectorMult = (vec, number) => {
    let result = [];
    for (let i = 0; i < vec.length; i++) {
        result[i] = vec[i] * number;
    }
    return result;
};

// console.log(vectorMult([3,-2], 1/3));

const getColor = (A, B, C, colorA, colorB, colorC, dot) => {
    let color = [];
    let matrices = [];
    let x = dot[0];
    let y = dot[1];

    matrices[0] = [
        [A[0], B[0], C[0]],
        [A[1], B[1], C[1]],
        [1, 1, 1],
    ];

    matrices[1] = [
        [x, B[0], C[0]],
        [y, B[1], C[1]],
        [1, 1, 1],
    ];

    matrices[2] = [
        [x, A[0], C[0]],
        [y, A[1], C[1]],
        [1, 1, 1],
    ];

    matrices[3] = [
        [x, A[0], B[0]],
        [y, A[1], B[1]],
        [1, 1, 1],
    ];

    let sum = vectorSum(
        vectorMult(colorA, determinant(matrices[1])),
        vectorSum(vectorMult(colorB, determinant(matrices[2])), vectorMult(colorC, determinant(matrices[3])))
    );

    color = vectorMult(sum, -1 / determinant(matrices[0]));

    color = color.map((x) => Math.abs(x));
    color = color.map((x) => Math.round(x));
    return color;
};

function area(x1, y1, x2, y2, x3, y3) {
    return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
}

function isInside(x1, y1, x2, y2, x3, y3, x, y) {
    let A = area(x1, y1, x2, y2, x3, y3);
    let A1 = area(x, y, x2, y2, x3, y3);
    let A2 = area(x1, y1, x, y, x3, y3);
    let A3 = area(x1, y1, x2, y2, x, y);
    return A == A1 + A2 + A3;
}

const A = [400, 400];
const B = [100, 400];
const C = [250, 100];
const colorA = [1, 255, 1];
const colorB = [255, 1, 1];
const colorC = [1, 1, 255];
// const dot = [3, 2];

// console.log(getColor(A, B, C, colorA, colorB, colorC, dot));

var ctx = canvas.getContext("2d");
ctx.canvas.width = 500;
ctx.canvas.height = 500;

var v1 = { x: 400, y: 400 };
var v2 = { x: 100, y: 400 };
var v3 = { x: 200, y: 100 };

var radius = 180;

ctx.beginPath();

ctx.moveTo(A[0], A[1]);
ctx.lineTo(B[0], B[1]);
ctx.lineTo(C[0], C[1]);
ctx.lineTo(A[0], A[1]);
ctx.stroke();

ctx.closePath();
// ctx.fillStyle = "rgb(255, 0, 0)";
// ctx.fillRect(100,100,10,10);

let rectangle = {
    minX: Math.min(A[0], B[0], C[0]),
    minY: Math.min(A[1], B[1], C[1]),
    maxX: Math.max(A[0], B[0], C[0]),
    maxY: Math.max(A[1], B[1], C[1]),
};

let dot = [rectangle.minX, rectangle.minY];
while (dot[0] <= rectangle.maxX) {
    if (isInside(A[0], A[1], B[0], B[1], C[0], C[1], dot[0], dot[1])) {
        let color = getColor(A, B, C, colorA, colorB, colorC, dot);
        ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        ctx.fillRect(dot[0], dot[1], 1, 1);
    }
    if (dot[1] >= rectangle.maxY){
        dot[0] = dot[0] + 1;
        dot[1] = rectangle.minY;
    }
    dot[1]++;
    // dot = [dot[0] + 1, dot[1] + 1];
}
