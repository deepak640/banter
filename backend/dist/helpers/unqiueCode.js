"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueCode = void 0;
const generateUniqueCode = () => {
    const code = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    return code.substring(code.length - 4);
};
exports.generateUniqueCode = generateUniqueCode;
