"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createId = void 0;
const createId = () => {
    return `${Date.now()}_${Math.random()}`;
};
exports.createId = createId;
