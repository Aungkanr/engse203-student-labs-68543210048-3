const os = require('os');

const name = "อังคาร สกุลบุญดี";
const studentId = " 68543210048-3 ";
const osPlatform = "linux"; // ใช้ WSL รันระบบเป็นลินุกซ์
const nodeVersion = process.version;

console.log(`Hello ${name} (${studentId}) | OS: ${osPlatform} | Node: ${nodeVersion}`);