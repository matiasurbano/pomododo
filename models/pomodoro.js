"use strict";
const EventEmitter = require('events');
const moment = require('moment');

class Pomodoro extends EventEmitter {
  constructor(duration, attributes, callback) {
    super();
    this.timerDuration = duration;
    this.ticksInterval = 1000;
    this.callback = callback;
    this.loop = (attributes && attributes.loop) ? attributes.loop : 0;
    this.started = false;
    this.stopped = false; // If stop() is called this variable will be used to finish the paused duration once it's started again.
    this.timer;
    this.tick;
    this.startTick;
    this.endTick;

    if (attributes.start) {
      if (attributes.wait > 0) {
        var self = this;
        setTimeout(function() {
          if (attributes.executeAfterWait) {
            callback();
          }
          self.start();
        }, attributes.wait);
      } else {
        this.start();
      }
    }
  }


  start() {
    if (!this.started) {
  
        var self = this;
  
        // Takes care of restarts. If the timer has been stopped, this will make sure the leftover duration is executed.
        if (this.stopped) {
            setTimeout(function () {
                self._handleCallbacks();
                return self.start();
            }, this.getRemainingDuration());
  
            this.stopped = false;
            return true;
        }
  
        this._handleTimerStart();
  
        this.updateStartEndTickFromDuration(self.timerDuration);
        this.started = true;
  
        return true;
    }
  
    return false;
  }
  
  stop() {
    if (this.started) {
        this.clearTimer();
        this.updateStartEndTickFromDuration(this.getRemainingDuration());
        this.started = false;
        this.stopped = true;
        return true;
    }
  
    return false;
  }
  
  clearTimer() {
    if (this.tick) 
      clearInterval(this.tick);

    
    if (this.timer) {
        this.timer = this.loop ? clearInterval(this.timer) : clearTimeout(this.timer);
  
        return true;
    }
  
    return false;
  }
  
  updateStartEndTickFromDuration(duration) {
    this.startTick = Date.now();
    this.endTick = this.startTick + duration;
  
    return true;
  }
  
  duration() {
    if (arguments.length > 0) {
        this.timerDuration = moment.duration(arguments[0], arguments[1]).asMilliseconds();
  
        this._handleRunningDurationChange();
  
        return true;
    }
  
    return false;
  }
  
  getDuration() {
    return this.timerDuration;
  }
  
  getRemainingDuration() {
    if (this.startTick && this.endTick) {
        return this.stopped ? this.endTick.ins - this.startTick : this.endTick - Date.now();
    }
    return 0;
  }

  getRemainingDurationInSeconds() {
    if (this.startTick && this.endTick) {
        const duration = moment.duration(this.endTick - Date.now(), 'milliseconds');
        // if (duration.seconds() !== 0)
        duration.add(1, 'second')

        return duration.asMilliseconds();
    }
  
    return 0;
  }
  
  isStopped() {
    return this.stopped;
  }
  
  isStarted() {
    return this.started;
  }

  // Internal Method(s)
  _handleCallbacks() {
    this.clearTimer();
    this.callback()
  }

  _handleTimerStart() {
    var self = this;
  
    if (this.loop) {
        this.timer = setInterval(function () {
            self.updateStartEndTickFromDuration(self.timerDuration);
            return self._handleCallbacks();
        }, this.timerDuration);
    } else {
        this.tick = setInterval(function () {
          self.emit('tick', self.getRemainingDurationInSeconds());
        }, this.ticksInterval);
        this.timer = setTimeout(function () {
            self.started = false;
            self.emit('tick', self.getRemainingDurationInSeconds());
            return self._handleCallbacks();
        }, this.timerDuration);
    }

  }
  
  _handleRunningDurationChange() {
    var self = this;
  
    if (this.started) {
        setTimeout(function() {
            if (self.started) {
                self.clearTimer();
                self._handleTimerStart();
            }
        }, this.getRemainingDuration());
    }
  }
  
}

module.exports = Pomodoro;
