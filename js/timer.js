var app = angular.module('timerApp', ['angular-progress-arc']);

app.controller('timerCtrl', function ($scope, $timeout) {
    $scope.worktime = 10;
    $scope.breaktime = 5;
    $scope.cycle = 'work';
    $scope.cycletime = $scope.worktime * 60;
    $scope.graphprogress = 1;
    $scope.remainingtime = $scope.cycletime;
    $scope.stopped = true;
    $scope.buttonText = 'Start';

    $scope.onTimeout = function () {
        if ($scope.remainingtime > 0) {
            $scope.remainingtime--;
            $scope.progress = 1 - $scope.remainingtime / $scope.cycletime;
            $scope.graphprogress = 1 - $scope.progress;
            mytimeout = $timeout($scope.onTimeout, 1000);
        } else {
            console.log('time to switch');
            //alert, beep, vibrate as per user options
            $scope.switchCycle();
            //play some fun animation here like circle spinning
            mytimeout = $timeout($scope.onTimeout, 1000);
        };
    }

    //var mytimeout = $timeout($scope.onTimeout, 1000);

    $scope.pauseResumeToggle = function () {
        if (!$scope.stopped) {
            $timeout.cancel(mytimeout);
            $scope.buttonText = 'Resume';
        } else {
            mytimeout = $timeout($scope.onTimeout, 1000);
            $scope.buttonText = 'Pause';
        }
        $scope.stopped = !$scope.stopped;
    }

    $scope.resetTimer = function () {
        //back to initial conditions with timer stopped
        if (!$scope.stopped) {
            $timeout.cancel(mytimeout);
            $scope.stopped = !$scope.stopped;
        }
        $scope.remainingtime = $scope.cycletime;
        $scope.buttonText = 'Start';
        $scope.graphprogress = 1;

        console.log('timer reset')
    };

    $scope.switchCycle = function () {
        if ($scope.cycle === 'work') {
            $scope.cycle = 'relax';
            $scope.cycletime = $scope.breaktime * 60;
        } else {
            $scope.cycle = 'work';
            $scope.cycletime = $scope.worktime * 60;
        };
        $scope.remainingtime = $scope.cycletime;
        $scope.graphprogress = 1.0;
    }

    $scope.changeInput = function () {
        if ($scope.cycle === 'work') {
            var diff = $scope.worktime * 60 - $scope.cycletime;
            $scope.cycletime = $scope.worktime * 60;
        } else {
            var diff = $scope.breaktime * 60 - $scope.cycletime;
            $scope.cycletime = $scope.breaktime * 60;
        };
        $scope.remainingtime = $scope.remainingtime + diff;
        $scope.progress = 1 - $scope.remainingtime / $scope.cycletime;
        $scope.graphprogress = 1 - $scope.progress;
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