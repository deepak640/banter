"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJwt = exports.generateRefreshJwt = exports.GenerateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("common/config");
const jwt_decode_1 = require("jwt-decode");
const GenerateToken = (obj) => __awaiter(void 0, void 0, void 0, function* () {
    const expiryInSeconds = 100000 * 60; // Set expiry to 10 seconds
    // Get the current time in seconds (UTC) and add 10 seconds for expiration
    const expirationInUtc = Math.floor(Date.now() / 1000) + expiryInSeconds;
    return jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, obj), { exp: expirationInUtc }), config_1.CONFIG.JWT_SECRET);
});
exports.GenerateToken = GenerateToken;
const generateRefreshJwt = (obj) => __awaiter(void 0, void 0, void 0, function* () {
    // const expiryInSeconds = 60; // 7 days or your desired expiry duration
    const expiryInSeconds = 604800 * 60; // 7 days or your desired expiry duration
    // Get the current time in UTC and add the expiration time
    const expirationInUtc = Math.floor(Date.now() / 1000) + expiryInSeconds;
    // Convert UTC time to IST by adding 5 hours and 30 minutes (19800 seconds)
    const expirationInIST = expirationInUtc + 19800;
    return jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, obj), { exp: expirationInIST }), config_1.CONFIG.JWT_SECRET // Use a separate secret for refresh token
    );
});
exports.generateRefreshJwt = generateRefreshJwt;
const decodeJwt = (token) => (0, jwt_decode_1.jwtDecode)(token);
exports.decodeJwt = decodeJwt;
