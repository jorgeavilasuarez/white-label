{   
    "closure-library":"..\\..\\..\\..\\tools\\third_party\\closure-library\\closure\\goog\\",
    "paths" : ["..\\..\\..\\..\\tools\\third_party\\closure-library\\third_party\\closure\\goog\\"],
        "id": "development",
        "pretty-print":false,
        "debug" : false,
        "mode":"ADVANCED",
        "define": {
            "goog.DEBUG": false,
            "URL_BASE_CONFIG": "http://search.technocloud.com.co/",            
            "URL_SEARCHIE": "http://www.shopcloud.com.co/mvc/Handlers/search.ashx",
            "URL_SEARCHV2": "http://www.shopcloud.com.co/mvc/Handlers/searchV2.ashx",
            "RESULTS_FILTERS": false
        },
        "modules" :  {
            
            /*MODULOS DE VUELOS*/
            "manager": {
                "inputs": [                        
                        "..\\..\\..\\..\\flights\\loader.js"                              
                ],
                        "deps": []
            },
                "flights_search": {
                    "inputs": [                        
                            "..\\precompiled\\RENAMING_MAP_FLIGHTS.js",
                            "..\\..\\..\\..\\loader\\IATAGEN_SATENA.js",
                            "..\\precompiled\\STYLE_MODULE_FLIGHTS_SEARCH_CSS.js",
                            "..\\precompiled\\TPL_FLIGHTS.js",                            
                            "..\\..\\..\\..\\flights\\search.js"                            
                    ],
                            "deps": ["manager"]
                },
                "flights_results": {
                    "inputs": [
                            "..\\precompiled\\STYLE_MODULE_FLIGHTS_RESULTS_CSS.js",
                            "..\\..\\..\\..\\flights\\results.js"                        
                    ],
                            "deps": ["flights_search"]
                },
                "flights_register": {
                    "inputs": [
                            "..\\precompiled\\STYLE_MODULE_FLIGHTS_REGISTER_CSS.js",
                            "..\\..\\..\\..\\flights\\register.js"                        
                    ],
                            "deps": ["flights_results"]
                }            
        },
        "property-map-output-file" : "..\\..\\..\\..\\webcompany\\satena\\flights\\js\\propiedades.out",
        "variable-map-output-file" : "..\\..\\..\\..\\webcompany\\satena\\flights\\js\\variables.out",
        "module-output-path": "..\\..\\..\\..\\webcompany\\satena\\flights\\js\\technocloud_%s.js",
    // For a local HTML page, production_uri happens to have the same value as
    // output_path, but for a production system, they would likely be different.
        "module-production-uri": "js/technocloud_%s.js",
    // This enables an experimental modules feature, and may not be
    // appropriate for most users. Be sure you understand what this does
    // before enabling it: http://plovr.com/options.html#global-scope-name
        "global-scope-name": "__technocloud__",
        "output-wrapper": "// Copyright 2014\n(function(){%output%})();",
        "fingerprint": false
}