const fs = require('fs');
const { readFileSync } = fs;
function parseGLB(filepath) {
  const buffer = readFileSync(filepath);
  const jsonChunk = buffer.subarray(20, 20 + buffer.readUInt32LE(12));
  return JSON.parse(jsonChunk.toString("utf8"));
}
const gltf = parseGLB("public/balcony.glb");
console.log(gltf.nodes.map(n => n.name));
