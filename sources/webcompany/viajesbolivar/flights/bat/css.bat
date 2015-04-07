java -jar "..\..\..\..\tools\compilers\closure-stylesheets\closure-stylesheets.jar" ^
--allowed-unrecognized-property column-count  ^
--allowed-unrecognized-property moz-opacity  ^
--allowed-unrecognized-property outline-offset  ^
--allowed-unrecognized-property -webkit-overflow-scrolling  ^
--allowed-unrecognized-property -ms-overflow-style  ^
--allowed-unrecognized-property user-select  ^
--allowed-unrecognized-property -moz-osx-font-smoothing  ^
--allowed-unrecognized-property -o-box-sizing ^
--allowed-unrecognized-property -webkit-box-orient ^
--allowed-non-standard-function progid:DXImageTransform.Microsoft.gradient ^
--allowed-unrecognized-property widows  ^
--allowed-unrecognized-property column-count  ^
--allowed-unrecognized-property outline-offset  ^
--allowed-unrecognized-property -webkit-overflow-scrolling  ^
--allowed-unrecognized-property -ms-overflow-style  ^
--allowed-unrecognized-property -ms-border-radius ^
--allowed-unrecognized-property -o-border-radius ^
--allowed-unrecognized-property user-select  ^
--allowed-unrecognized-property -moz-osx-font-smoothing  ^
--allowed-non-standard-function progid:DXImageTransform.Microsoft.gradient ^
--allowed-non-standard-function progid:DXImageTransform.Microsoft.Alpha ^
--allowed-non-standard-function color-stop ^
--allowed-non-standard-function Alpha  ^
--output-renaming-map-format CLOSURE_COMPILED ^
--rename CLOSURE ^
--output-renaming-map "..\precompiled\RENAMING_MAP_FLIGHTS.js" ^
--output-file "..\precompiled\STYLE"  ^
--vendor WEBKIT ^
MODULE_FLIGHTS_SEARCH_CSS:"..\..\..\..\tools\third_party\closure-library\closure\goog\css\autocomplete.css" ^
MODULE_FLIGHTS_SEARCH_CSS:"..\..\..\..\tools\third_party\closure-library\closure\goog\css\common.css" ^
MODULE_FLIGHTS_SEARCH_CSS:"..\..\..\..\tools\third_party\closure-library\closure\goog\css\datepicker.css" ^
MODULE_FLIGHTS_SEARCH_CSS:"..\..\..\..\tools\third_party\closure-library\closure\goog\css\inputdatepicker.css" ^
MODULE_FLIGHTS_SEARCH_CSS:"..\..\..\..\tools\third_party\closure-library\closure\goog\css\popupdatepicker.css" ^
MODULE_FLIGHTS_SEARCH_CSS:"..\css\colors.css" ^
MODULE_FLIGHTS_SEARCH_CSS:"..\..\..\..\flights\css\search.css" ^
MODULE_FLIGHTS_RESULTS_CSS:"..\..\..\..\flights\css\results.css" ^
MODULE_FLIGHTS_REGISTER_CSS:"..\..\..\..\flights\css\register.css"