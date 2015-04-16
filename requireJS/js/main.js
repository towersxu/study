/**
 * Created by Administrator on 15-4-18.
 */
require.config({
    baseUrl: '../js',
    paths:{
 //       jquery:'jquery-2.1.1'
    }
});
require(['jquery'],function($){
    console.log($().jquery);
});