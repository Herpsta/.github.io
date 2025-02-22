// src/core/interfaces/ISystem.js
export default class ISystem {
    init() { throw new Error('init() must be implemented'); }
    update(time, delta) { throw new Error('update() must be implemented'); }
    destroy() { throw new Error('destroy() must be implemented'); }
}