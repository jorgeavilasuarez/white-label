java -jar "..\..\..\..\tools\compilers\closure_templates\SoyToJsSrcCompiler.jar" ^
--outputPathFormat "..\precompiled\TPL_FLIGHTS.js" ^
--srcs "..\..\..\..\flights\templates\search.soy" ^
--srcs "..\..\..\..\flights\templates\register.soy" ^
--srcs "..\..\..\..\flights\templates\results.soy" ^
--shouldProvideRequireSoyNamespaces ^
--codeStyle concat ^
--cssHandlingScheme GOOG