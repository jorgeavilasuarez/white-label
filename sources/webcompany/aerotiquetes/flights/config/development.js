{          
    "closure-library":"..\\..\\..\\..\\tools\\third_party\\closure-library\\closure\\goog\\",
"paths" : ["..\\..\\..\\..\\tools\\third_party\\closure-library\\third_party\\closure\\goog\\"],
    "id" : "development_flights",
    "pretty-print" : true,        
    "modules" :  {
        /*MODULOS DE VUELOS*/
        "manager": {
            "inputs": [                                                
                    "..\\..\\..\\..\\flights\\js\\loader.js"
            ],
                    "deps": []
        },
        "flights_search": {
            "inputs": [                        
                    "..\\..\\..\\..\\loader\\IATAGEN.js",
                    "..\\precompiled\\STYLE_MODULE_FLIGHTS_SEARCH_CSS.js",
                    "..\\precompiled\\TPL_FLIGHTS.js",                            
                    "..\\..\\..\\..\\flights\\js\\search.js"                            
            ],
                    "deps": ["manager"]
        },
        "flights_results": {
            "inputs": [
                    "..\\precompiled\\STYLE_MODULE_FLIGHTS_RESULTS_CSS.js",
                    "..\\..\\..\\..\\flights\\js\\results.js"                        
            ],
                    "deps": ["flights_search"]
        },
        "flights_register": {
            "inputs": [
                    "..\\precompiled\\STYLE_MODULE_FLIGHTS_REGISTER_CSS.js",
                    "..\\..\\..\\..\\flights\\js\\register.js"                        
            ],
                    "deps": ["flights_results"]
        }            
    },
    // appropriate for most users. Be sure you understand what this does
    // before enabling it: http:\\\\plovr.com\\options.html#global-scope-name        
        "mode" : "WHITESPACE",
        "level" : "VERBOSE",
        "global-scope-name": "__technocloud_flights__",
        "output-wrapper": "// Copyright 2014\\n(function(){%output%})();"
}
