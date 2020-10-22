"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrontEndError = void 0;
var FrontEndError = /** @class */ (function () {
    function FrontEndError(type, path, message) {
        if (message === void 0) { message = 'No message'; }
        this.type = type;
        this.path = path;
        this.message = message;
    }
    return FrontEndError;
}());
exports.FrontEndError = FrontEndError;
//# sourceMappingURL=modeldata.js.map