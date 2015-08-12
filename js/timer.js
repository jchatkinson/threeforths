var app = angular.module('timerApp', ['angular-progress-arc']);

app.service('timerService', function ($timeout) {
    var ts = this;
    ts.worktime = 20;
    ts.breaktime = 10;
    ts.cycle = 'work';
    ts.cycletime = ts.worktime * 60;
    ts.graphprogress = 1;
    ts.remainingtime = ts.cycletime;
    ts.stopped = true;
    ts.buttonText = 'Start';
    //method to provide timer countdown
    ts.onTimeout = function () {
            if (ts.remainingtime > 0) {
                ts.remainingtime--;
                ts.progress = 1 - ts.remainingtime / ts.cycletime;
                ts.graphprogress = 1 - ts.progress;
                mytimeout = $timeout(ts.onTimeout, 1000);
            } else {
                console.log('time to switch');
                //alert, beep, vibrate as per user options
                ts.switchCycle();
                //play some fun animation here like circle spinning
                mytimeout = $timeout(ts.onTimeout, 1000);
            };
        }
        //method to switch between a pause and normal state
    ts.pauseResumeToggle = function () {
            if (!ts.stopped) {
                $timeout.cancel(mytimeout);
                ts.buttonText = 'Resume';
            } else {
                mytimeout = $timeout(ts.onTimeout, 1000);
                ts.buttonText = 'Pause';
            }
            ts.stopped = !ts.stopped;
        }
        //method to reset the timer
    ts.resetTimer = function () {
        //back to initial conditions with timer stopped
        if (!ts.stopped) {
            $timeout.cancel(mytimeout);
            ts.stopped = !ts.stopped;
        }
        ts.remainingtime = ts.cycletime;
        ts.buttonText = 'Start';
        ts.graphprogress = 1;

        console.log('timer reset')
    };
    //method to end current cycle and begin next one
    ts.switchCycle = function () {
            if (ts.cycle === 'work') {
                ts.cycle = 'relax';
                ts.cycletime = ts.breaktime * 60;
            } else {
                ts.cycle = 'work';
                ts.cycletime = ts.worktime * 60;
            };
            ts.remainingtime = ts.cycletime;
            ts.graphprogress = 1.0;
        }
        //method to update timer on input change
    ts.changeInput = function () {
        if (ts.cycle === 'work') {
            var diff = ts.worktime * 60 - ts.cycletime;
            ts.cycletime = ts.worktime * 60;
        } else {
            var diff = ts.breaktime * 60 - ts.cycletime;
            ts.cycletime = ts.breaktime * 60;
        };
        ts.remainingtime = ts.remainingtime + diff;
        ts.progress = 1 - ts.remainingtime / ts.cycletime;
        ts.graphprogress = 1 - ts.progress;
    }
});

app.controller('timerCtrl', function ($scope, timerService) {
    //import the timer service
    $scope.ts = timerService;
    $scope.showapp = true;
    $scope.switchtoapp = function () {
        $scope.showapp = !$scope.showapp;
    }
});

app.filter('formatTimer', function () {
    return function (input) {
        function z(n) {
            return (n < 10 ? '0' : '') + n;
        }
        var seconds = input % 60;
        var minutes = Math.floor(input / 60);
        var hours = Math.floor(minutes / 60);
        return (z(hours) + ':' + z(minutes) + ':' + z(seconds));
    };
});