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
            "URL_SEARCHV2": "http://www.shopcloud.com.co/mvc/Handlers/searchV2.ashx"                    
        },
        "modules" :  {            
            
            /*MODULOS DE HOTELES*/
            "manager": {
                "inputs": [                                                
                        "..\\..\\..\\..\\hotels\\loader.js"
                ],
                        "deps": []
            },
            "hotels_search": {
                "inputs": [                        
                        "..\\precompiled\\RENAMING_MAP_HOTELS.js",
                        "..\\..\\..\\..\\loader\\IATAGEN.js",
                        "..\\precompiled\\STYLE_MODULE_HOTELS_SEARCH_CSS.js",
                        "..\\precompiled\\TPL_HOTELS.js",                            
                        "..\\..\\..\\..\\hotels\\search.js"                            
                ],
                        "deps": ["manager"]
            },
                "hotels_results": {
                    "inputs": [
                            "..\\precompiled\\STYLE_MODULE_HOTELS_RESULTS_CSS.js",
                            "..\\..\\..\\..\\hotels\\results.js"                        
                    ],
                            "deps": ["hotels_search"]
                },                   
                "hotels_details": {
                    "inputs": [
                            "..\\precompiled\\STYLE_MODULE_HOTELS_REGISTER_CSS.js",
                            "..\\..\\..\\..\\hotels\\details.js"                        
                    ],
                            "deps": ["hotels_results"]
                },
                "hotels_register": {
                    "inputs": [
                            "..\\precompiled\\STYLE_MODULE_HOTELS_REGISTER_CSS.js",
                            "..\\..\\..\\..\\hotels\\register.js"                        
                    ],
                            "deps": ["hotels_results"]
                }            
        },
        "property-map-output-file" : "..\\..\\..\\..\\webcompany\\technocloud\\hotels\\js\\propiedades.out",
        "variable-map-output-file" : "..\\..\\..\\..\\webcompany\\technocloud\\hotels\\js\\variables.out",
        "module-output-path": "..\\..\\..\\..\\..\\googleapp\\static\\technocloud\\hotels\\js\\technocloud_%s.js",

    // For a local HTML page, production_uri happens to have the same value as
    // output_path, but for a production system, they would likely be different.
        "module-production-uri": "http://search.technocloud.com.co/static/technocloud/hotels/js/technocloud_%s.js",
    // This enables an experimental modules feature, and may not be
    // appropriate for most users. Be sure you understand what this does
    // before enabling it: http://plovr.com/options.html#global-scope-name
        "global-scope-name": "__technocloud__",
        "output-wrapper": "// Copyright 2014\n(function(){%output%})();",
        "fingerprint": false
}