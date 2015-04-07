{       


    "closure-library":"..\\..\\..\\..\\tools\\third_party\\closure-library\\closure\\goog\\",
    "paths" : ["..\\..\\..\\..\\tools\\third_party\\closure-library\\third_party\\closure\\goog\\"],
        "id" : "development_hotels",
        "pretty-print" : true,        
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
    // appropriate for most users. Be sure you understand what this does
    // before enabling it: http:\\\\plovr.com\\options.html#global-scope-name        
        "mode" : "WHITESPACE",
        "level" : "VERBOSE",
        "global-scope-name": "__technocloud_hotels__",
        "output-wrapper": "// Copyright 2014\\n(function(){%output%})();"
}