const canvas = document.querySelector("canvas");

const determinant = (m) =>
    m.length == 1
        ? m[0][0]
        : m.length == 2
        ? m[0][0] * m[1][1] - m[0][1] * m[1][0]
        : m[0].reduce(
              (r, e, i) => r + (-1) ** (i + 2) * e * determinant(m.slice(1).map((c) => c.filter((_, j) => i != j))),
              0
          );

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

const vectorMult = (vec, number) => {
    let result = [];
    for (let i = 0; i < vec.length; i++) {
        result[i] = vec[i] * number;
    }
    return result;
};

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

function hexToRgb(hex, result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)) {
    return result ? result.map((i) => parseInt(i, 16)).slice(1) : null;
}

function draw() {
    const A = [Number(document.querySelector("#pointAX").value), Number(document.querySelector("#pointAY").value)];
    const B = [Number(document.querySelector("#pointBX").value), Number(document.querySelector("#pointBY").value)];
    const C = [Number(document.querySelector("#pointCX").value), Number(document.querySelector("#pointCY").value)];
    const colorA = hexToRgb(document.querySelector("#colorA").value);
    const colorB = hexToRgb(document.querySelector("#colorB").value);
    const colorC = hexToRgb(document.querySelector("#colorC").value);

    var ctx = canvas.getContext("2d");
    ctx.canvas.width = 500;
    ctx.canvas.height = 500;

    ctx.beginPath();

    ctx.moveTo(A[0], A[1]);
    ctx.lineTo(B[0], B[1]);
    ctx.lineTo(C[0], C[1]);
    ctx.lineTo(A[0], A[1]);
    ctx.stroke();

    ctx.closePath();

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
        if (dot[1] >= rectangle.maxY) {
            dot[0] = dot[0] + 1;
            dot[1] = rectangle.minY;
        }
        dot[1]++;
    }
}


document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    draw();
});

