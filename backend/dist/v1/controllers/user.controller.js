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
exports.getUserById = exports.updateById = exports.getAllUser = exports.loginUser = exports.RegisterUser = void 0;
const user_model_1 = require("models/user.model");
const bcrypt_1 = require("helpers/bcrypt");
const jwt_1 = require("helpers/jwt");
const unqiueCode_1 = require("helpers/unqiueCode");
const mongoose_1 = __importDefault(require("mongoose"));
const { BlobServiceClient } = require("@azure/storage-blob");
const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_URI);
const containerClient = blobServiceClient.getContainerClient("uploads"); // Replace with your container name
const RegisterUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        let user, encryptedPassword;
        req.body.hashId = `user-${(0, unqiueCode_1.generateUniqueCode)()}`;
        user = yield user_model_1.User.findOne({ email }).exec();
        if (user) {
            throw new Error("User already exists");
        }
        encryptedPassword = yield (0, bcrypt_1.encryptPassword)(password);
        user = new user_model_1.User(Object.assign(Object.assign({}, req.body), { password: encryptedPassword }));
        yield user.save();
        res.status(201).json({
            message: "User registered successfully",
            user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.RegisterUser = RegisterUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        let Existuser, checkPassword, JWTtoken;
        Existuser = yield user_model_1.User.findOne({ email }).lean();
        if (!Existuser) {
            throw new Error("User does not exist");
        }
        checkPassword = yield (0, bcrypt_1.comparePassword)(Existuser.password, password);
        if (!checkPassword) {
            throw new Error("Invalid password");
        }
        JWTtoken = yield (0, jwt_1.GenerateToken)(Existuser);
        res.status(200).json({
            success: true,
            user: {
                _id: Existuser._id,
                hashId: Existuser.hashId,
            },
            token: JWTtoken,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.loginUser = loginUser;
const getAllUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pipeline = [];
        pipeline.push({
            $match: {
                _id: {
                    $ne: typeof req.query.userId === "string"
                        ? new mongoose_1.default.Types.ObjectId(req.query.userId)
                        : null,
                },
            },
        });
        const user = yield user_model_1.User.aggregate(pipeline);
        res.status(200).json({
            message: "User fetched successfully",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUser = getAllUser;
const updateById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let updateData = req.body;
        if (req.file) {
            const photo = req.file;
            const blobName = `profile-${Date.now()}.jpg`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            // Upload the file to Azure Blob Storage
            yield blockBlobClient.upload(photo.buffer, photo.size);
            updateData.photo = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerClient.containerName}/${blobName}`;
        }
        console.log(updateData, "||new");
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, updateData, {
            new: true,
        });
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.updateById = updateById;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield user_model_1.User.findById(id).lean();
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            message: "User fetched successfully",
            data: user,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.getUserById = getUserById;
