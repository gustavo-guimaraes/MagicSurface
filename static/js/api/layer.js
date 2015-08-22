angular.module('MagicApp').factory('LayerApi', function(Ajax){
    var url_list_layers = 'http://magicsurfacebr.appspot.com/layer/list';
    var url_get_layers = 'http://magicsurfacebr.appspot.com/layer/get';
    var url_save_layers = 'http://magicsurfacebr.appspot.com/layer/save';

    var options = {
        all: 'ALL'
    };

    var list = function(options){
        return Ajax.get(
            url_list_layers,
            {
                'options': angular.toJson(options)
            }
        )
    };

    var get = function(id, options){
        return Ajax.get(
            url_get_layers,
            {
                'id': id,
                'options': angular.toJson(options)
            }
        )
    };

    var save = function(params){
        return Ajax.post(
            url_save_layers,
            params
        )
    };

    return {
        list: list,
        get: get,
        save: save,
        options: options
    };
});