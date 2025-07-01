"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenderPipe = void 0;
const common_1 = require("@nestjs/common");
let GenderPipe = class GenderPipe {
    transform(value, metadata) {
        if (!value) {
            return;
        }
        const allowed = ['m', 'f'];
        if (value && allowed.includes(value.toLowerCase())) {
            return value.toLowerCase();
        }
        throw new common_1.BadRequestException('Gender must be "m" or "f"');
    }
};
exports.GenderPipe = GenderPipe;
exports.GenderPipe = GenderPipe = __decorate([
    (0, common_1.Injectable)()
], GenderPipe);
//# sourceMappingURL=gender.pipe.js.map