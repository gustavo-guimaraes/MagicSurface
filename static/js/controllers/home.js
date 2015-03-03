angular.module('MagicApp',['ui.bootstrap','mrhttp']);

angular.module('MagicApp').controller('ModalCtrl', function ($scope, $modal) {

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl'
    });
  };
});

angular.module('MagicApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, MRHttp) {

  $scope.ok = function () {
            var layers;
            $scope.imgs;
            var options = {options:angular.toJson({include_layers:'ALL'})};
            MRHttp.get('http://magicsurfacebr.appspot.com/layer/list',options)
            .success(function(result){
                layers = result.layers;
                pegaImagens(layers[0]);
            })
            .error(function(result){});

    //$modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  var pegaImagens = function(layer){
                var params = {
                    id: layer.id,
                    options: angular.toJson({include_images:'ALL'})
                };

                MRHttp.get('http://magicsurfacebr.appspot.com/layer/get', params)
                .success(function(result){
                    $scope.imgs = result.images;
                })
                .error(function(result){

                });        
            }
});


