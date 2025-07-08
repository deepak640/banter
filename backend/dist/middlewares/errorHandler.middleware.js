"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err);
    // if (err.message) {
    //   // res.statusMessage = err.message;
    // }
    if (err.status && typeof err.status == "number") {
        res
            .status(err.status)
            .json({ status: err.status, message: err.message, err: err });
        return;
    }
    res.status(500).json({ message: err.message, err: err });
    return;
};
exports.errorHandler = errorHandler;
