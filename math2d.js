"use strict";
class Matrix2D {
    constructor() {
        let _m = [
            1, 0, 0,
            0, 1, 0
        ];

        this.asString = function _asString() {
            return `${_m[0]} ${_m[1]} ${_m[2]}\n` +
                `${_m[3]} ${_m[4]} ${_m[5]}\n` +
                "0 0 1";
        };

        this.getPosition = function _getPosition() {
            return { x: _m[2], y: _m[5] };
        };

        this.setPosition = function _setPosition(x, y) {
            _m[2] = x;
            _m[5] = y;
        }

        this.setXBasis = function _setXBasis(v) {
            _m[0] = v.x;
            _m[3] = v.y;
        };

        this.getXBasis = function _getXBasis() {
            return { x: _m[0], y: _m[3] };
        }

        this.setYBasis = function _setYBasis(v) {
            _m[1] = v.x;
            _m[4] = v.y;
        };

        this.getYBasis = function _getYBasis() {
            return { x: _m[1], y: _m[4] };
        }

        this.transform = function _transform(vertex) {
            let result = { x: 0, y: 0 };
            result.x = _m[0] * vertex.x + _m[1] * vertex.y + _m[2];
            result.y = _m[3] * vertex.x + _m[4] * vertex.y + _m[5];
            return result;
        };

        this.setTranslation = function _setTranslation(tx, ty) {
            _m[2] = tx;
            _m[5] = ty;
        };

        this.translate = function _translate(tx, ty) {
            let n = [
                1, 0, tx,
                0, 1, ty
            ];
            _leftMultiplyBy(n);
        }

        this.scale = function _scale(sx, sy) {
            let n = [
                sx, 0, 0,
                0, sy, 0
            ];
            _leftMultiplyBy(n);

        };

        this.setScale = function _setScale(sx, sy) {
            _m[0] = sx;
            _m[4] = sy;
        };

        this.setRotation = function _setRotation(degrees) {
            const radians = degrees * Math.PI / 180.0;
            const cos = Math.cos(radians);
            const sin = Math.sin(radians);
            _m[0] = cos;
            _m[1] = -sin;
            _m[3] = sin;
            _m[4] = cos;
        };

        this.rotate = function _rotate(degrees) {
            const radians = degrees * Math.PI / 180.0;
            const cos = Math.cos(radians);
            const sin = Math.sin(radians);
            let n = [
                cos, -sin, 0,
                sin, cos, 0
            ];
            _leftMultiplyBy(n);
        };

        this.rotateCCWAboutPosition = function _rotateCCWAboutPosition(degrees, position) {
            const radians = degrees * Math.PI / 180.0;
            const cos = Math.cos(radians);
            const sin = Math.sin(radians);
            let n = [
                1, 0, -position.x,
                0, 1, -position.y
            ];
            let m = [
                cos, -sin, 0,
                sin, cos, 0
            ];
            n = _multiply(m, n);
            m = [
                1, 0, position.x,
                0, 1, position.y
            ];
            let r = _multiply(m, n);
            _leftMultiplyBy(r);
        }

        // Returns: []
        this.getMatrix = function _getMatrix() {
            return _m.slice();
        }

        // arr: []
        this.setMatrix = function _setMatrix(arr) {
            _m = arr.slice();
        }

        // mat: Matrix2D
        // Returns: Matrix2D
        this.multiply = function _multiplyMatrices(mat) {
            let m = _m;
            let n = mat.getMatrix();
            let r = _multiply(m, n);
            let resultMatrix = new Matrix2D();
            resultMatrix.setMatrix(r);
            return resultMatrix;
        }

        // Returns: []
        this.getInverse = function _getInverse() {
            let detInv = 1 / _getDeterminant();
            let adj = _getAdjugate();
            let inv = [];
            for (let idx = 0; idx < 6; idx++) {
                inv[idx] = detInv * adj[idx];
            } return inv;
        };

        this.invert = function _invert() {
            _m = this.getInverse();
        };

        function _multiply(m, n) {
            let r = [];
            r[0] = m[0] * n[0] + m[1] * n[3];
            r[1] = m[0] * n[1] + m[1] * n[4];
            r[2] = m[0] * n[2] + m[1] * n[5] + m[2];
            r[3] = m[3] * n[0] + m[4] * n[3];
            r[4] = m[3] * n[1] + m[4] * n[4];
            r[5] = m[3] * n[2] + m[4] * n[5] + m[5];
            return r;
        }

        function _multiplyBy(n) {
            let m = _m.slice();
            _m[0] = m[0] * n[0] + m[1] * n[3];
            _m[1] = m[0] * n[1] + m[1] * n[4];
            _m[2] = m[0] * n[2] + m[1] * n[5] + m[2];
            _m[3] = m[3] * n[0] + m[4] * n[3];
            _m[4] = m[3] * n[1] + m[4] * n[4];
            _m[5] = m[3] * n[2] + m[4] * n[5] + m[5];
        };

        function _leftMultiplyBy(n) {
            let m = _m.slice();
            _m[0] = n[0] * m[0] + n[1] * m[3];
            _m[1] = n[0] * m[1] + n[1] * m[4];
            _m[2] = n[0] * m[2] + n[1] * m[5] + n[2];

            _m[3] = n[3] * m[0] + n[4] * m[3];
            _m[4] = n[3] * m[1] + n[4] * m[4];
            _m[5] = n[3] * m[2] + n[4] * m[5] + n[5];
        };

        function _getDeterminant() {
            // a b c    
            let a = _m[0];
            let b = _m[1];
            // c = m[2];    
            // d e f    
            let d = _m[3];
            let e = _m[4];
            // f = m[5];    
            // g h i    
            // g = 0; h = 0; i = 1;   
            // a(ei − fh) − b(di − fg) + c(dh − eg)    
            return a * e - b * d;
        };

        function _getTransposed() {
            return [
                _m[0], _m[3], 0,
                _m[1], _m[4], 0,
                _m[2], _m[5], 1
            ];
        };

        function _getAdjugate() {
            let t = _getTransposed();
            let a = [];
            a[0] = t[4] * t[8] - t[7] * t[5];
            a[1] = -(t[3] * t[8] - t[6] * t[5]);
            a[2] = t[3] * t[7] - t[6] * t[4];
            a[3] = -(t[1] * t[8] - t[7] * t[2]);
            a[4] = t[0] * t[8] - t[6] * t[2];
            a[5] = -(t[0] * t[7] - t[6] * t[1]);
            a[6] = t[1] * t[5] - t[4] * t[2];
            a[7] = -(t[0] * t[5] - t[3] * t[2]);
            a[8] = t[0] * t[4] - t[3] * t[1];
            return a;
        };
    }
}