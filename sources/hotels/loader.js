/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
goog.provide("manager.Loader");
goog.require('goog.History');
goog.require('goog.module.BaseModule');
goog.require('goog.module.ModuleInfo');
goog.require('goog.module.ModuleManager');
goog.require('goog.module.ModuleLoader');

var moduleManager = goog.module.ModuleManager.getInstance();
var moduleLoader = new goog.module.ModuleLoader();
moduleManager.setLoader(moduleLoader);
moduleLoader.setDebugMode(true);
moduleManager.setAllModuleInfo(goog.global['PLOVR_MODULE_INFO']);
moduleManager.setModuleUris(goog.global['PLOVR_MODULE_URIS']);

/** @define {string}  URL_BASE_CONFIG Whether logging should be enabled. */
var URL_BASE_CONFIG = "http://localhost:8080/";

/** @define {boolean} */
var ENABLE_DEBUG = true;

/**
 * realiza la busqueda de vuelos
 * @constructor 
 * @extends {goog.ui.Component}
 */
manager.Loader = function() {    
    moduleManager.execOnLoad('hotels_search', goog.bind(this.OnModuleSearchLoaded, this));
};


manager.Loader.prototype.OnModuleSearchLoaded = function() {

    if (typeof(this.objSearch) !== "undefined") {
        this.objSearch.dispose();
    }
};


moduleManager.setLoaded('manager');

var objSearch = new manager.Loader();