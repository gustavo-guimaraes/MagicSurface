angular.module('MagicApp').factory('ImageLayerApi', function(Ajax){
    var url_save_layers = 'http://magicsurfacebr.appspot.com/image_layer/save';
    var url_get_layers = 'http://magicsurfacebr.appspot.com/image_layer/get';

    var options = {
        all: 'ALL'
    };

    var get = function(){
        return Ajax.get(
            url_get_layers
        )
    };

    var save = function(params){
        return Ajax.post(
            url_save_layers,
            params
        )
    };

    return {
        get: get,
        save: save,
        options: options
    };
});