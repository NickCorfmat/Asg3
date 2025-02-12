class Cube {
  constructor() {
    this.type = "cube";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.textureNum = -1;
  }

  render() {
    var rgba = this.color;

    gl.uniform1i(u_whichTexture, this.textureNum);

    // Pass the color of a point to u_fragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Top face
    drawTriangle3DUV([0, 0, 0, 1, 1, 0, 1, 0, 0], [0, 0, 1, 1, 1, 0]);
    drawTriangle3DUV([0, 0, 0, 0, 1, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1]);

    // drawTriangle3D([0, 0, 0, 1, 1, 0, 1, 0, 0]);
    // drawTriangle3D([0, 0, 0, 0, 1, 0, 1, 1, 0]);

    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.9,
      rgba[1] * 0.9,
      rgba[2] * 0.9,
      rgba[3]
    );

    // Front face
    drawTriangle3D([0, 0, 0, 1, 0, 0, 1, 0, -1]);
    drawTriangle3D([0, 0, 0, 1, 0, -1, 0, 0, -1]);

    // Back face
    drawTriangle3D([0, 1, 0, 1, 1, 0, 1, 1, -1]);
    drawTriangle3D([0, 1, 0, 1, 1, -1, 0, 1, -1]);

    // Left face
    drawTriangle3D([0, 0, 0, 0, 0, -1, 0, 1, -1]);
    drawTriangle3D([0, 0, 0, 0, 1, -1, 0, 1, 0]);

    // Right face
    drawTriangle3D([1, 0, 0, 1, 0, -1, 1, 1, -1]);
    drawTriangle3D([1, 0, 0, 1, 1, -1, 1, 1, 0]);

    // Bottom face
    drawTriangle3D([0, 0, -1, 1, 0, -1, 1, 1, -1]);
    drawTriangle3D([0, 0, -1, 1, 1, -1, 0, 1, -1]);
  }

  renderfast() {
    var rgba = this.color;

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var allverts = [];

    // Cube front
    allverts = allverts.concat([0, 0, 0, 1, 1, 0, 1, 0, 0]);
    allverts = allverts.concat([0, 0, 0, 0, 1, 0, 1, 1, 0]);

    // Top
    allverts = allverts.concat([0, 1, 0, 0, 1, 1, 1, 1, 1]);
    allverts = allverts.concat([0, 1, 0, 1, 1, 1, 1, 1, 0]);

    // Right
    allverts = allverts.concat([1, 1, 0, 1, 1, 1, 1, 0, 0]);
    allverts = allverts.concat([1, 0, 0, 1, 1, 1, 1, 0, 1]);

    // Left
    allverts = allverts.concat([0, 1, 0, 0, 1, 1, 0, 0, 0]);
    allverts = allverts.concat([0, 0, 0, 0, 1, 1, 0, 0, 1]);

    // Bottom
    allverts = allverts.concat([0, 0, 0, 0, 0, 1, 1, 0, 1]);
    allverts = allverts.concat([0, 0, 0, 1, 0, 1, 1, 0, 0]);

    // Back
    allverts = allverts.concat([0, 0, 1, 1, 1, 1, 1, 0, 1]);
    allverts = allverts.concat([0, 0, 1, 0, 1, 1, 1, 1, 1]);

    drawTriangle3D(allverts);
  }
}

function drawCube(matrix, color) {
  gl.enable(gl.DEPTH_TEST);

  var n = 36; // number of vertices

  const vertices = [
    // Front face
    0, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, 0, 1, 0, -1, 0, 0, -1,

    // Back face
    0, 1, 0, 1, 1, 0, 1, 1, -1, 0, 1, 0, 1, 1, -1, 0, 1, -1,

    // Left face
    0, 0, 0, 0, 0, -1, 0, 1, -1, 0, 0, 0, 0, 1, -1, 0, 1, 0,

    // Right face
    1, 0, 0, 1, 0, -1, 1, 1, -1, 1, 0, 0, 1, 1, -1, 1, 1, 0,

    // Top face
    0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0,

    // Bottom face
    0, 0, -1, 1, 0, -1, 1, 1, -1, 0, 0, -1, 1, 1, -1, 0, 1, -1,
  ];

  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);

  gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);

  gl.drawArrays(gl.TRIANGLES, 0, 30);

  gl.uniform4f(
    u_FragColor,
    color[0] * 0.9,
    color[1] * 0.9,
    color[2] * 0.9,
    color[3]
  );

  gl.drawArrays(gl.TRIANGLES, 30, 6);
}
