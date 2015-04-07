java -jar "..\..\..\..\tools\compilers\closure_templates\SoyToJsSrcCompiler.jar" ^
--outputPathFormat "..\precompiled\TPL_FLIGHTS.js" ^
--srcs "..\templates\search.soy" ^
--srcs "..\templates\register.soy" ^
--srcs "..\templates\results.soy" ^
--shouldProvideRequireSoyNamespaces ^
--codeStyle concat ^
--cssHandlingScheme GOOG