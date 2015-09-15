angular.module('MagicApp').directive('player', ['$sce', function ($sce) {
            'use strict';
            return {
                restrict: 'E',
                scope: {
                    video: '='
                },
                link: function (scope, element, attrs) {
                    var video = element.find('video');
                    element.addClass('player');
                    scope.playing = false;
                    scope.trustSrc = function(src) {
                        return $sce.trustAsResourceUrl(src);
                    }
                    
                    video.on('timeupdate', function (e) {
                        scope.$apply(function () {
                            scope.percent = (video[0].currentTime / video[0].duration) * 100;
                        });
                    });

                    scope.frame = function (num) {
                        if (video[0].readyState !== 0) {
                            video[0].currentTime += num;
                        }
                    };

                    scope.toggle = function () {
                        if (video[0].paused === true) {
                            video[0].play();
                            scope.playing = true;
                        } else {
                            video[0].pause();
                            scope.playing = false;
                        }
                    };
                },
                template: '<a ng-click="toggle()"><video>' +
                    '<source ng-src="{{ trustSrc(video.link) }}" type="video/mp4" />' +
                    '</video>' +
                    '</a>'
            };
        }]);