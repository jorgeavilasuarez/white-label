{                


        
    "closure-library":"..\\..\\tools\\third_party\\closure-library\\closure\\goog\\",
    "paths" : ["..\\..\\tools\\third_party\\closure-library\\third_party\\closure\\goog\\"],
        "id" : "development_cars",
        "pretty-print" : true,        
        "modules" :  {
            /*MODULOS DE VUELOS*/
            "cars_search": {
                "inputs": [                        
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
    // appropriate for most users. Be sure you understand what this does
    // before enabling it: http:\\\\plovr.com\\options.html#global-scope-name        
        "mode" : "WHITESPACE",
        "level" : "VERBOSE",
        "global-scope-name": "__technocloud_cars__",
        "output-wrapper": "// Copyright 2014\\n(function(){%output%})();"
}