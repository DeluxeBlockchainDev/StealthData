"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapDocument = void 0;
const wrapDocument = (doc) => ({
    updateOne: {
        filter: { gDate: doc.gDate },
        update: {
            $set: Object.assign({}, doc)
        },
        upsert: true
    },
});
exports.wrapDocument = wrapDocument;
//# sourceMappingURL=utils.js.map