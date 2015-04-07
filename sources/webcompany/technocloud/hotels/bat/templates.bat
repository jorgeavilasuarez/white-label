java -jar "..\..\..\..\tools\compilers\closure_templates\SoyToJsSrcCompiler.jar" ^
--outputPathFormat "..\precompiled\TPL_HOTELS.js" ^
--srcs "..\templates\search.soy" ^
--srcs "..\templates\register.soy" ^
--srcs "..\templates\results.soy" ^
--srcs "..\templates\details.soy" ^
--shouldProvideRequireSoyNamespaces ^
--codeStyle concat ^
--cssHandlingScheme GOOG