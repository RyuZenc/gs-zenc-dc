"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Events {
    constructor(events) {
        this.events = events;
    }
    run(...args) {
        console.log(args);
        throw new Error('Not implemented');
    }
}
exports.default = Events;
//# sourceMappingURL=Events.js.map