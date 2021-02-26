"use strict";
class RotateAnimation {
    constructor(object, degreesPerSecond = 45) {
        let _object = object;
        let _degreesPerSecond = degreesPerSecond;
        const ONE_SECOND = 1000;

        this.update = function _update(elapsedTimeMS) {
            let deltaDegrees = (_degreesPerSecond * elapsedTimeMS) / ONE_SECOND;
            _object.orientation.rotate(deltaDegrees);
        };
    }
};

class HoverAnimation {
    constructor(object, amt, offset = 0, speed = 1.0) {
        let _object = object;
        let _amt = amt;
        const ONE_SECOND = 1000;
        let _totalTime = 0;
        let _offset = offset;
        let _speed = speed;

        this.update = function _update(elapsedTimeMS) {
            _totalTime += elapsedTimeMS;
            let deltaAmt = Math.sin((_totalTime / (ONE_SECOND * _speed)) + _offset) * _amt;
            console.log(deltaAmt);
            _object.orientation.translate(0, deltaAmt);
        };
    }
};

class RotateAboutCenterAnimation {
    constructor(object, degreesPerSecond = 45) {
        let _object = object;
        let _degreesPerSecond = degreesPerSecond;
        const ONE_SECOND = 1000;

        this.update = function _update(elapsedTimeMS) {
            let deltaDegrees = (_degreesPerSecond * elapsedTimeMS) / ONE_SECOND;
            let position = _object.orientation.getPosition();
            _object.orientation.rotateCCWAboutPosition(deltaDegrees, position);
        };
    }
};

class ForwardThenTurnAroundAnimation {
    constructor(object, distanceToMove, moveSpeed, turnSpeed) {
        const States = { MovingForward: 0, TurningAround: 1 };
        const ONE_SECOND = 1000;
        const DEGREES_TO_TURN = 180;
        let _object = object;
        let _currentState = States.MovingForward;
        let _distanceToMove = distanceToMove;
        let _moveSpeed = moveSpeed;
        let _turnSpeed = turnSpeed;
        let _distanceMoved = 0;
        let _angleTurned = 0;
        this.update = function _update(elapsedTimeMS) {
            switch (_currentState) {
                case States.MovingForward: {
                    let delta = (_moveSpeed * elapsedTimeMS) / ONE_SECOND;
                    let distanceCheck = _distanceMoved + delta;
                    // Check if it is time to change state
                    if (distanceCheck >= _distanceToMove) {
                        // Adjust delta if needed
                        delta = _distanceToMove - _distanceMoved;
                        _currentState = States.TurningAround;
                        _distanceMoved = 0;
                    }
                    else {
                        _distanceMoved += delta;
                    }
                    let yBasis = object.orientation.getYBasis();
                    let tx = yBasis.x * delta;
                    let ty = yBasis.y * delta;
                    object.orientation.translate(tx, ty);
                    break;
                }
                case States.TurningAround: {
                    let delta = (_turnSpeed * elapsedTimeMS) / ONE_SECOND;
                    let angleCheck = _angleTurned + delta;
                    // Check if it is time to change state
                    if (angleCheck >= DEGREES_TO_TURN) {
                        // Adjust delta if needed
                        delta = DEGREES_TO_TURN - _angleTurned;
                        _currentState = States.MovingForward;
                        _angleTurned = 0;
                    }
                    else {
                        _angleTurned += delta;
                    }
                    let position = object.orientation.getPosition();
                    object.orientation.rotateCCWAboutPosition(delta, position);
                    break;
                }
            }
        };
    }
};

class ForwardStrafingTurnAround {
    constructor(object, distanceToMove, moveSpeed, turnSpeed) {
        const States = { MovingForward: 0, StrafingRight: 1, TurningAround: 2 };
        const ONE_SECOND = 1000;
        const DEGREES_TO_TURN = 180;
        let _object = object;
        let _currentState = States.MovingForward;
        let _distanceToMove = distanceToMove;
        let _moveSpeed = moveSpeed;
        let _turnSpeed = turnSpeed;
        let _distanceMoved = 0;
        let _angleTurned = 0;
        this.update = function _update(elapsedTimeMS) {
            switch (_currentState) {
                case States.MovingForward: {
                    let delta = (_moveSpeed * elapsedTimeMS) / ONE_SECOND;
                    let distanceCheck = _distanceMoved + delta;
                    // Check if it is time to change state
                    if (distanceCheck >= _distanceToMove) {
                        // Adjust delta if needed
                        delta = _distanceToMove - _distanceMoved;
                        _currentState = States.StrafingRight;
                        _distanceMoved = 0;
                    }
                    else {
                        _distanceMoved += delta;
                    }
                    let yBasis = object.orientation.getYBasis();
                    let tx = yBasis.x * delta;
                    let ty = yBasis.y * delta;
                    object.orientation.translate(tx, ty);
                    break;
                }
                case States.StrafingRight: {
                    let delta = (_moveSpeed * elapsedTimeMS) / ONE_SECOND;
                    let distanceCheck = _distanceMoved + delta;
                    // Check if it is time to change state
                    if (distanceCheck >= _distanceToMove) {
                        // Adjust delta if needed
                        delta = _distanceToMove - _distanceMoved;
                        _currentState = States.TurningAround;
                        _distanceMoved = 0;
                    }
                    else {
                        _distanceMoved += delta;
                    }
                    let xBasis = object.orientation.getXBasis();
                    let tx = xBasis.x * delta;
                    let ty = xBasis.y * delta;
                    object.orientation.translate(tx, ty);
                    break;
                }
                case States.TurningAround: {
                    let delta = (_turnSpeed * elapsedTimeMS) / ONE_SECOND;
                    let angleCheck = _angleTurned + delta;
                    // Check if it is time to change state
                    if (angleCheck >= DEGREES_TO_TURN) {
                        // Adjust delta if needed
                        delta = DEGREES_TO_TURN - _angleTurned;
                        _currentState = States.MovingForward;
                        _angleTurned = 0;
                    }
                    else {
                        _angleTurned += delta;
                    }
                    let position = object.orientation.getPosition();
                    object.orientation.rotateCCWAboutPosition(delta, position);
                    break;
                }
            }
        };
    }
};