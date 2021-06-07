"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Badwords {
    constructor(badword) {
        this.badword = badword;
    }
    addBadowrd(text) {
        this.badword.push(text);
    }
    removeBadword(searchable) {
        this.badword.splice(this.badword.indexOf(searchable), 1);
    }
    hasBadword(searchable) {
        return this.badword.includes(searchable);
    }
    getBadword(text) {
        return this.badword
            .filter(word => {
            const regex = new RegExp(`\\b${word.replace(/(\W)/g, '\\$1')}\\b`, 'gi');
            return regex.test(text);
        });
    }
}
exports.default = Badwords;
//# sourceMappingURL=Badword.js.map