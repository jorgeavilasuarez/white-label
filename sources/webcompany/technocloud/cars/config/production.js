{   
    "closure-library":"..\\..\\tools\\third_party\\closure-library\\closure\\goog\\",
    "paths" : ["..\\..\\tools\\third_party\\closure-library\\third_party\\closure\\goog\\"],
        "id": "development",
        "pretty-print":false,
        "debug" : false,
        "mode":"ADVANCED",
        "define": {
            "goog.DEBUG": false,
            "URL_BASE_CONFIG": "http://search.technocloud.com.co/",            
            "URL_SEARCHIE": "http://www.shopcloud.com.co/mvc/Handlers/search.ashx",
            "URL_SEARCHV2": "http://www.shopcloud.com.co/mvc/Handlers/searchV2.ashx"                    
        },
        "modules" :  {
            
            /*MODULOS DE VUELOS*/
            "cars_search": {
                "inputs": [                        
                        "..\\precompiled\\RENAMING_MAP_CARS.js",
                        "..\\..\\loader\\IATAGEN.js",
                        "..\\precompiled\\STYLE_MODULE_CARS_SEARCH_CSS.js",
                        "..\\precompiled\\TPL_cars.js",                            
                        "..\\javascript\\search.js"                            
                ],
                        "deps": []
            },
                "cars_results": {
                    "inputs": [
                            "..\\precompiled\\STYLE_MODULE_CARS_RESULTS_CSS.js",
                            "..\\javascript\\results.js"                        
                    ],
                            "deps": ["cars_search"]
                },                   
                "cars_details": {
                    "inputs": [
                            "..\\precompiled\\STYLE_MODULE_CARS_REGISTER_CSS.js",
                            "..\\javascript\\details.js"                        
                    ],
                            "deps": ["cars_results"]
                },
                "cars_register": {
                    "inputs": [
                            "..\\precompiled\\STYLE_MODULE_CARS_REGISTER_CSS.js",
                            "..\\javascript\\register.js"                        
                    ],
                            "deps": ["cars_results"]
                }            
        },
        "property-map-output-file" : "..\\..\\..\\..\\webcompany\\technocloud\\cars\\js\\propiedades.out",
        "variable-map-output-file" : "..\\..\\..\\..\\webcompany\\technocloud\\cars\\js\\variables.out",
        "module-output-path": "..\\..\\..\\..\\..\\googleapp\\static\\technocloud\\cars\\js\\technocloud_%s.js",
    // For a local HTML page, production_uri happens to have the same value as
    // output_path, but for a production system, they would likely be different.
        "module-production-uri": "http://search.technocloud.com.co/static/cars/js/technocloud_%s.js",
    // This enables an experimental modules feature, and may not be
    // appropriate for most users. Be sure you understand what this does
    // before enabling it: http://plovr.com/options.html#global-scope-name
        "global-scope-name": "__technocloud__",
        "output-wrapper": "// Copyright 2014\n(function(){%output%})();",
        "fingerprint": false
}