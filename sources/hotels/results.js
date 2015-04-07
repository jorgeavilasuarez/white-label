goog.provide("hotels.Results");
goog.require("hotels.template.results");
goog.require("goog.dom.query");
goog.require("goog.async.Delay");
goog.require('goog.ui.Popup');
goog.require('goog.net.XhrIo');
goog.require('goog.dom.classes');

/** @define {string}  URL_AVAILABILITY Whether logging should be enabled. */
var URL_AVAILABILITY = "http://localhost:49935/Handlers/availability.ashx";

/**
 * Clase que genera los resultados de vuelos
 * @constructor 
 * @param {Object} arrResults objecto resultados
 * @extends  {goog.ui.Component}
 */
hotels.Results = function (arrResults, passenger, cortinilla, objSearch) {
    //debugger;
    goog.ui.Component.call(this);
    this.objSearch = objSearch;
    this.arrResults = arrResults;
    this.passenger = passenger;
    this.cortinilla = cortinilla;
    this.arrResults = { "DO_tcAirSearchRSJS": {} };
    this.arrResults["DO_tcAirSearchRSJS"] = { "tcAirSearchRSField": [] };
};
goog.inherits(hotels.Results, goog.ui.Component);

hotels.Results.prototype.filters = {};
hotels.Results.prototype.filters.airlines = ['*'];
hotels.Results.prototype.filters.stops = ['*'];
hotels.Results.prototype.filters.arrivalAirPorts = ['*'];
hotels.Results.prototype.filters.departureAirports = ['*'];
hotels.Results.prototype.filters.arrivalTimes = ['*'];
hotels.Results.prototype.filters.departureTimes = ['*'];
hotels.Results.prototype.filters.amountCurrencys = ['*'];
hotels.Results.prototype.filters.estimatedTimes = ['*'];
hotels.Results.prototype.clusterVisibles = 0;
hotels.Results.prototype.maxClusterVisibles = 0;
hotels.Results.prototype.currentClusterVisible = 0;
hotels.Results.prototype.maxClusterRenderPerScrloll = 1;
hotels.Results.prototype.lastDivVisiblePosition = 0;
hotels.Results.prototype.arrResults = {};

/**
 * Creates an initial DOM representation for the component.
 * @override
 */
hotels.Results.prototype.createDom = function () {
    goog.base(this, 'createDom');

    var element_ = this.getElement();
    //if (typeof (this.objSearch.objRender) === "undefined") {
    //    goog.dom.classes.add(element_, goog.getCssName("ux-common-main-popup"));
    //}

    this.setId("clusters");
    this.contenido = hotels.template.results.results();
    element_.innerHTML = this.contenido;
    if (!goog.DEBUG) {
        this.MODULE_RESULTS_CSS = goog.style.installStyles(MODULE_HOTELS_RESULTS_CSS);
    }
};

hotels.Results.prototype.enterDocument = function () {
    goog.base(this, 'enterDocument');
    this.clusters = goog.dom.getElementByClass(goog.getCssName("clusters"));
    //window.scrollTo(0, 0);    

};

/**
 * Called when component's element is known to have been removed from the
 * document.
 * @override
 */
hotels.Results.prototype.exitDocument = function () {
    goog.base(this, 'exitDocument');
    if (!goog.DEBUG) {
        goog.style.uninstallStyles(this.MODULE_RESULTS_CSS);
    }
    if (typeof this.register !== "undefined") {
        this.register.dispose();
    }
};
/**
 * Dibuja solamente los itinerarios que se nececitan visualizar.
 * @param {type} from
 * @param {type} to
 * @param {type} tcAirSearchRSField
 * @returns {undefined}
 */
hotels.Results.prototype.renderResults = function (from, to) {


    //var window.innerHeight
    // goog.style.getClientPosition(div);
    if (this.currentClusterVisible >= this.maxClusterVisibles) {
        this.getHandler().unlisten(window, goog.events.EventType.SCROLL, this.scrollerListener);
        return;
    }

    //debugger;
    if (this.tcAirSearchRSField.length === 0) {
        this.clusters.innerHTML = '';
    }
    this.clusters = goog.dom.getElementByClass(goog.getCssName("clusters")); //goog.dom.getElement('clusters');
    var _from = this.currentClusterVisible;
    var _to = this.currentClusterVisible + this.maxClusterRenderPerScrloll;
    if (goog.isDef(from)) {
        if (from >= this.currentClusterVisible) {
            _from = this.currentClusterVisible;
        }
    }
    if (goog.isDef(to)) {
        if (to >= this.currentClusterVisible) {
            _to = to;
        }
    }

    //    for (var c = _from; c < _to; c++) {
    //        var field = this.tcAirSearchRSField[c];
    //        var cluster = goog.dom.htmlToDocumentFragment(hotels.template.results.hotels({tcAirSearchRSField: field}, null));
    //        goog.dom.appendChild(this.clusters, cluster);
    //        this.currentClusterVisible++;
    //    }

    //var c = 0;
    var renderAll = to === this.maxClusterVisibles;
    while (this.lastDivVisiblePosition <= (window.innerHeight + goog.dom.getPageScroll().y) || renderAll) {
        //debugger;
        if (this.currentClusterVisible >= this.maxClusterVisibles) {
            break;
        }
        var field = this.tcAirSearchRSField[this.currentClusterVisible];
        var cluster = goog.dom.htmlToDocumentFragment(hotels.template.results.results({ tcAirSearchRSField: field }, null));
        goog.dom.appendChild(this.clusters, cluster);
        this.currentClusterVisible++;
        this.lastDivVisiblePosition = goog.style.getClientPosition(cluster).y;
    }

    /*agregamos el evento click a cada resultado*/
    var buttonsBuy = goog.dom.getElementsByClass(goog.getCssName("btn-buy"));
    for (var i = 0; i < buttonsBuy.length; i++) {
        this.getHandler().listen(buttonsBuy[i], goog.events.EventType.CLICK, this.onSeleccionarClick_);
    }

    var stopsLink = goog.dom.query("." + goog.getCssName("stops-link"));
    for (var i = 0; i < stopsLink.length; i++) {
        this.getHandler().listen(stopsLink[i], goog.events.EventType.CLICK, this.onSelectStops_);
    }


};

hotels.Results.prototype.addEvents = function () {
    //var stopsLink = goog.dom.query("." + goog.getCssName("stops-link"));
    //for (var i = 0; i < stopsLink.length; i++) {
    //    this.getHandler().listen(stopsLink[i], goog.events.EventType.CLICK, this.onSelectStops_);
    //}

    /*agregamos el evento click a cada resultado*/
    var buttonsBuy = goog.dom.getElementsByClass(goog.getCssName("botonImprimirCotizar"));
    for (var i = 0; i < buttonsBuy.length; i++) {
        this.getHandler().listen(buttonsBuy[i], goog.events.EventType.CLICK, this.onBuyClick_);
    }

    /*agregamos el evento click a cada resultado*/
    //debugger;
    var buttonDetails = goog.dom.getElementsByClass(goog.getCssName("detalles"));
    for (var i = 0; i < buttonDetails.length; i++) {
        this.getHandler().listen(buttonDetails[i], goog.events.EventType.CLICK, this.onDetailsClick);
    }

    this.btnreturnsearch = goog.dom.getElementByClass(goog.getCssName("botonNuevaBuscar"));
    this.getHandler().listen(this.btnreturnsearch, goog.events.EventType.CLICK, this.onButtonReturnClick_);

};

hotels.Results.prototype.renderOne = function (tcAirSearchRSField) {
    var cluster = goog.dom.htmlToDocumentFragment(hotels.template.results.result({ tcAirSearchRSField: tcAirSearchRSField }, null));
    goog.dom.appendChild(this.clusters, cluster);

};

hotels.Results.prototype.closePopup = function () {
    this.objPopup.setVisible(false);
};

hotels.Results.prototype.onDetailsClick = function (e) {

    debugger;
    this.cortinilla.style.display = "block";

    moduleManager.execOnLoad('hotels_details', goog.bind(this.onDetailsLoaded, this));

    //if (typeof (this.popup) === "undefined") {
    //    this.popup = goog.dom.htmlToDocumentFragment(hotels.template.results.popup({}, null));
    //    goog.dom.appendChild(this.getContentElement(), this.popup);
    //}
    //if (typeof (this.objPopup) === "undefined") {
    //    this.objPopup = new goog.ui.Popup(this.popup);
    //    this.objPopup.setHideOnEscape(true);
    //    this.objPopup.setAutoHide(true);
    //    var margin = new goog.math.Box(0, -300, 0, 0);
    //    this.objPopup.setMargin(margin);
    //    this.getHandler().listen(goog.dom.getElementByClass(goog.getCssName("popup-close-button")), goog.events.EventType.CLICK, this.closePopup);
    //}
    //var rph = e.currentTarget.getAttribute("rph");
    //var tcairroutefieldindex = e.currentTarget.getAttribute("tcairroutefieldindex");
    //var tcFlightSegmentFieldindex = e.currentTarget.getAttribute("tcFlightSegmentFieldindex");
    //var segmentSelected = goog.array.find(this.arrResults["DO_tcAirSearchRSJS"]["tcAirSearchRSField"], function (a, b, c) {
    //    return this.id === a.id;
    //}, {"id": rph});
    //var itineraryselected = segmentSelected["tcAirRouteField"][tcairroutefieldindex]["tcAirItineraryField"][tcFlightSegmentFieldindex];
    //this.popupContent = goog.dom.getElementByClass(goog.getCssName("popup-inner-content"));
    //this.popupContent.innerHTML = hotels.template.results.popupContent({tcAirItineraryField: itineraryselected}, null);
    //this.objPopup.setPosition(new goog.positioning.AnchoredViewportPosition(e.currentTarget, 1));
    //this.objPopup.setVisible(true);



};

hotels.Results.prototype.onDetailsLoaded = function (e) {
    debugger;

    this.currentPageScrollY = goog.dom.getPageScroll().y;
    if (typeof this.details !== "undefined") {
        this.details.dispose();
    }
    this.details = new hotels.Details(this);
    this.getElement().style.display = "none";
    //if (this.objSearch.objRender !== null) {
    this.details.render(this.objSearch.objRender);
    //} else {
    //    this.details.render();
    //}
    this.cortinilla.style.display = "none";

};


hotels.Results.prototype.onButtonReturnClick_ = function () {
    this.dispose();
};

hotels.Results.prototype.onLoadFilters_ = function () {
    this.divFilters = goog.dom.getElementByClass(goog.getCssName("filters"));
    this.divFilters.innerHTML = hotels.template.results.filters({ filters: this.filterOptions }, null);
    this.chkInputs = goog.dom.query("." + goog.getCssName("filters") + " " + "input");
    goog.array.forEach(this.chkInputs, function (obj, index, array) {
        this.getHandler().listen(obj, goog.events.EventType.CLICK, this.onClickFilter_);
    }, this);
    //this.btnreturnsearch = goog.dom.getElementByClass(goog.getCssName("botonNuevaBuscar"));
    //this.getHandler().listen(this.btnreturnsearch, goog.events.EventType.CLICK, this.onButtonReturnClick_);
};


hotels.Results.prototype.renderFilters = function () {
    this.divFilters = goog.dom.getElementByClass(goog.getCssName("filters"));
    this.divFilters.innerHTML = hotels.template.results.filters({ filters: this.filterOptions }, null);
    this.chkInputs = goog.dom.query("." + goog.getCssName("filters") + " " + "input");
    goog.array.forEach(this.chkInputs, function (obj, index, array) {
        this.getHandler().listen(obj, goog.events.EventType.CLICK, this.onClickFilter_);
    }, this);
    this.btnreturnsearch = goog.dom.getElementByClass(goog.getCssName("btnreturnsearch"));
    this.getHandler().listen(this.btnreturnsearch, goog.events.EventType.CLICK, this.onButtonReturnClick_);
};

hotels.Results.prototype.onClickFilter_ = function (e) {
    //debugger;
    var hashChecked = false;
    var checkAll = goog.dom.query("input[name='" + e.currentTarget.name + "'][value='*']")[0];
    /*Verificamos que haya por lo menos unos chequeado*/
    var checks = goog.dom.query("input[name='" + e.currentTarget.name + "']");
    for (var c = 0; c < checks.length; c++) {
        if (checks[c].checked) {
            hashChecked = true;
            break;
        }
    }
    /*si no hay ninguno chqueado , chequeamos la opcion de todos*/
    if (!hashChecked) {
        checkAll.checked = true;
        checkAll.disabled = true;
    } else {
        checkAll.checked = false;
        checkAll.disabled = false;
    }

    /*si el chequeado es la opcion de todos , deschequeamos los demas */
    if (e.currentTarget.value === "*") {
        e.currentTarget.disabled = true;
        e.currentTarget.checked = true;
        for (c = 0; c < checks.length; c++) {
            if (checks[c].value !== "*") {
                checks[c].checked = false;
            }
        }
    }

    var delay = new goog.async.Delay(goog.bind(function () {

        /*renderizamos todos los resultados para hacer el filtro*/
        this.renderResults(0, this.maxClusterVisibles);
        var checks = goog.dom.query("input[name='" + e.currentTarget.name + "']");
        var arrayFilter = null;
        if (e.currentTarget.name === "airlines") {
            arrayFilter = this.filters.airlines;
        }
        else if (e.currentTarget.name === "stops") {
            arrayFilter = this.filters.stops;
        } else if (e.currentTarget.name === "departureAirports") {
            arrayFilter = this.filters.departureAirports;
        }
        else if (e.currentTarget.name === "arrivalAirPorts") {
            arrayFilter = this.filters.arrivalAirPorts;
        }
        else if (e.currentTarget.name === "amountCurrencys") {
            arrayFilter = this.filters.amountCurrencys;
        }
        else if (e.currentTarget.name === "arrivalTimes") {
            arrayFilter = this.filters.arrivalTimes;
        }
        else if (e.currentTarget.name === "departureTimes") {
            arrayFilter = this.filters.departureTimes;
        }
        else if (e.currentTarget.name === "estimatedTimes") {
            arrayFilter = this.filters.estimatedTimes;
        }

        goog.array.clear(arrayFilter);
        goog.array.forEach(checks, function (obj, index, array) {
            if (obj.checked) {
                goog.array.insert(arrayFilter, obj.value);
            }
        }, this);
        var ids = this.Filters();
        goog.array.forEach(goog.dom.query("." + goog.getCssName("clusters") + " ." + goog.getCssName("cluster")), function (obj, index, array) {
            obj.style.display = "none";
        });
        for (c = 0; c < ids.length; c++) {
            goog.dom.getElement(ids[c]).style.display = "block";
        }

    }, this), 100);
    delay.start();
};
/**
 * click boton buscar
 */
hotels.Results.prototype.onBuyClick_ = function (e) {

    this.cortinilla.style.display = "block";
    //var rphSelected = e.currentTarget.getAttribute("data");
    //this.segmentSelected = goog.array.find(this.arrResults["DO_tcAirSearchRSJS"]["tcAirSearchRSField"], function (a, b, c) {
    //    return this.id === a.id;
    //}, { "id": rphSelected });

    moduleManager.execOnLoad('hotels_register', goog.bind(this.onRegisterLoaded_, this));

    //var jsonpSearch = new goog.net.Jsonp(URL_AVAILABILITY);
    //jsonpSearch.setRequestTimeout(-1);
    //jsonpSearch.send({ rphs: rphSelected, sessionid: "asdf1asd1f23sd123ff1asd23f" }, goog.bind(function (obj) {
    //    debugger;
    //    this.cortinilla.style.display = "none";

    //    if (obj.result === "error") {
    //        alert(obj.message);
    //        if (typeof (this.register) !== "undefined") {
    //            this.register.dispose();
    //        }
    //    } else {
    //        this.getElement().style.display = "none";
    //    }
    //}, this));
};
/**
 * 
 * @returns {undefined}
 */
hotels.Results.prototype.onRegisterLoaded_ = function () {
    debugger;
    /*ajustamos el scroll a los resultados*/
    var pageOffsetTop = goog.style.getPageOffsetTop(this.getElement());
    this.cortinilla.style.display = "none";
    this.getElement().style.display = "none";
    if (typeof this.register !== "undefined") {
        this.register.dispose();
    }
    this.register = new hotels.Register(this);
    //if (this.objSearch.objRender !== null) {
    this.register.render(this.objSearch.objRender);
    //} else {
    //    this.register.render();
    //}
    window.scrollTo(0, pageOffsetTop);

};
/**
 * 
 * @param {type} arrResults
 * @returns {undefined}
 */
hotels.Results.prototype.setResultados = function (arrResults) {
    //debugger;
    this.arrResults = arrResults;
};

hotels.Results.prototype.setFilterOptions = function (objtcAirSearchRSField) {

    var airLines = new Array();
    var stops = new Array();
    var arrivalAirPorts = new Array();
    var departureAirports = new Array();
    var arrivalTimes = new Array();
    var departureTimes = new Array();
    var amountCurrencys = new Array();
    var estimatedTimes = new Array();
    var metaData = new Array();
    var obMetaData = {};
    obMetaData.city = "";
    obMetaData.code = "";
    goog.array.forEach(objtcAirSearchRSField, function (obj, indexTcAirSearchRSField, array) {
        var tcAirRouteField = obj["tcAirRouteField"];
        var amountCurrencyShowField = obj["amountCurrencyShowField"];
        /*amountCurrencyShowField*/

        amountCurrencys.push(amountCurrencyShowField);
        goog.array.forEach(tcAirRouteField, function (obj, index, array) {
            var tcAirItineraryField = obj['tcAirItineraryField'];
            arrivalAirPorts.push(obj['airportDestField']);
            departureAirports.push(obj['airportField']);
            goog.array.forEach(tcAirItineraryField, function (obj, index, array) {

                var tcFlightSegmentField = obj["tcFlightSegmentField"];
                var stopNameField = obj["stopNameField"];
                /*stops*/
                stops.push(stopNameField);
                goog.array.forEach(tcFlightSegmentField, function (obj, index, array) {
                    //debugger;
                    /*airlines*/
                    var airLineOperatedField = obj["airLineOperatedField"];
                    airLines.push(airLineOperatedField);
                    /*arrivalAirPortField*/
                    var arrivalAirPortField = obj["arrivalAirPortField"];
                    arrivalAirPorts.push(arrivalAirPortField);
                    /*departureAirportField*/
                    var departureAirportField = obj["departureAirportField"];
                    departureAirports.push(departureAirportField);
                    /*arrivalTimeField*/
                    var arrivalTimeField = obj["arrivalTimeField"];
                    arrivalTimes.push(arrivalTimeField);
                    /*arrivalTimeField*/
                    var departureTimeField = obj["departureTimeField"];
                    departureTimes.push(departureTimeField);
                    /*estimatedTimeField*/
                    var estimatedTimeField = obj["estimatedTimeField"];
                    estimatedTimes.push(estimatedTimeField);
                });
            });
        });
    });
    var airPorts = goog.array.concat(arrivalAirPorts, departureAirports);
    goog.array.removeDuplicates(airPorts);
    for (c = 0; c < airPorts.length; c++) {
        for (d = 0; d < CITYS.length; d++) {
            if (airPorts[c] === CITYS[d].substring(0, 3)) {
                metaData.push({
                    city: CITYS[d].split(/\s/g)[1],
                    code: airPorts[c],
                    airport: CITYS[d].match(/\s\((.*)\)\s/g)[0].replace("(", "").replace(")", "").replace(/\s/g, "")
                });
                break;
            }
        }
    }
    for (var c = 0; c < objtcAirSearchRSField.length; c++) {
        var tcAirRouteField = objtcAirSearchRSField[c]["tcAirRouteField"];
        for (var i = 0; i < tcAirRouteField.length; i++) {
            var tcAirItineraryField = objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'];
            for (var k = 0; k < tcAirItineraryField.length; k++) {
                var tcFlightSegmentField = objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]['tcFlightSegmentField'];
                for (var s = 0; s < tcFlightSegmentField.length; s++) {
                    for (var l = 0; l < metaData.length; l++) {
                        //debugger;
                        /*tcAirRouteField*/
                        if (objtcAirSearchRSField[c]["tcAirRouteField"][i]["airportField"] === metaData[l].code) {
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]["airportNameField"] = metaData[l].airport;
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]["cityField"] = metaData[l].city === null ? "" : metaData[l].city;
                        }
                        if (objtcAirSearchRSField[c]["tcAirRouteField"][i]["airportDestField"] === metaData[l].code) {
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]["airportNameDestField"] = metaData[l].airport;
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]["cityDestField"] = metaData[l].city;
                        }
                        /*tcAirItineraryField*/
                        if (objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["arrivalAirPortField"] === metaData[l].code) {
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["arrivalAirPortNameField"] = metaData[l].airport;
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["arrivalCityField"] = metaData[l].city;
                        }
                        if (objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["departureAirportField"] === metaData[l].code) {
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["departureAirportNameField"] = metaData[l].airport;
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["departureCityField"] = metaData[l].city;
                        }
                        /*tcFlightSegmentField*/
                        if (objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["tcFlightSegmentField"][s]["arrivalAirPortField"] === metaData[l].code) {
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["tcFlightSegmentField"][s]["arrivalAirPortNameField"] = metaData[l].airport;
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["tcFlightSegmentField"][s]["arrivalCityNameField"] = metaData[l].city;
                        }
                        if (objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["tcFlightSegmentField"][s]["departureAirportField"] === metaData[l].code) {
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["tcFlightSegmentField"][s]["departureAirportNameField"] = metaData[l].airport;
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["tcFlightSegmentField"][s]["departureCityField"] = metaData[l].city;
                        }
                    }
                }
            }
        }
    }

    var objAirLines = this.getObjectValuesAndCount(airLines);
    var objStops = this.getObjectValuesAndCount(stops);
    var objArrivalAirPorts = this.getObjectValuesAndCount(arrivalAirPorts);
    var objDepartureAirports = this.getObjectValuesAndCount(departureAirports);
    var objArrivalTimes = this.getObjectValuesAndCount(arrivalTimes);
    var objDepartureTimes = this.getObjectValuesAndCount(departureTimes);
    var objAmountCurrencys = this.getObjectValuesAndCount(amountCurrencys);
    var objEstimatedTimes = this.getObjectValuesAndCount(estimatedTimes);
    for (var c = 0; c < objArrivalAirPorts.length; c++) {
        for (var d = 0; d < metaData.length; d++) {
            if (metaData[d].code === objArrivalAirPorts[c].value) {
                objArrivalAirPorts[c] = { count: objArrivalAirPorts[c].count, id: metaData[d].code, label: metaData[d].city + " " + metaData[d].airport };
            }
        }
    }
    for (var c = 0; c < objDepartureAirports.length; c++) {
        for (var d = 0; d < metaData.length; d++) {
            if (metaData[d].code === objDepartureAirports[c].value) {
                objDepartureAirports[c] = { count: objDepartureAirports[c].count, id: metaData[d].code, label: metaData[d].city + " " + metaData[d].airport };
            }
        }
    }
    this.filterOptions = {
        airLines: objAirLines,
        stops: objStops,
        arrivalAirPorts: objArrivalAirPorts,
        departureAirports: objDepartureAirports,
        arrivalTimes: objArrivalTimes,
        departureTimes: objDepartureTimes,
        amountCurrencys: objAmountCurrencys,
        estimatedTimes: objEstimatedTimes,
        metaData: metaData
    };
    return this.filterOptions;
};

hotels.Results.prototype.getObjectValuesAndCount = function (arraySearch) {

    var objReturn = new Array();
    for (var c = 0; c < arraySearch.length; c++) {
        var count = 0;
        var value = arraySearch[c];
        var exist = false;
        /*Verificamos que exista para no recorrer de nuevo todo*/
        for (var k = 0; k < objReturn.length; k++) {
            if (value === objReturn[k].value) {
                exist = true;
            }
        }

        if (!exist) {
            for (var i = 0; i < arraySearch.length; i++) {
                if (arraySearch[c] === arraySearch[i]) {
                    count++;
                }
            }
            objReturn.push({ value: arraySearch[c], count: count });
        }
    }
    return objReturn;
};

hotels.Results.prototype.setFilterResults = function (objtcAirSearchRSField) {

    var filterResults = new Array();
    goog.array.forEach(objtcAirSearchRSField, function (obj, index, array) {

        var filterResult = {};
        filterResult.rph = 0;
        filterResult.id = 0;
        filterResult.airLines = new Array();
        filterResult.stops = new Array();
        filterResult.arrivalAirPorts = new Array();
        filterResult.departureAirports = new Array();
        filterResult.arrivalTimes = new Array();
        filterResult.departureTimes = new Array();
        filterResult.amountCurrencys = new Array();
        filterResult.estimatedTimes = new Array();
        var tcAirRouteField = obj["tcAirRouteField"];
        var amountCurrencyShowField = obj["amountCurrencyShowField"];
        var rPHField = obj["rPHField"];
        var id = obj["id"];
        /*amountCurrencyShowField*/
        filterResult.amountCurrencys.push(amountCurrencyShowField);
        /*rPHField*/
        filterResult.rph = rPHField;
        filterResult.id = id;
        goog.array.forEach(tcAirRouteField, function (obj, index, array) {

            var tcAirItineraryField = obj['tcAirItineraryField'];
            goog.array.forEach(tcAirItineraryField, function (obj, index, array) {

                var tcFlightSegmentField = obj["tcFlightSegmentField"];
                var stopNameField = obj["stopNameField"];
                /*stops*/
                filterResult.stops.push(stopNameField);
                goog.array.forEach(tcFlightSegmentField, function (obj, index, array) {
                    /*airlines*/
                    var airLineOperatedField = obj["airLineOperatedField"];
                    filterResult.airLines.push(airLineOperatedField);
                    /*arrivalAirPortField*/
                    var arrivalAirPortField = obj["arrivalAirPortField"];
                    filterResult.arrivalAirPorts.push(arrivalAirPortField);
                    /*departureAirportField*/
                    var departureAirportField = obj["departureAirportField"];
                    filterResult.departureAirports.push(departureAirportField);
                    /*arrivalTimeField*/
                    var arrivalTimeField = obj["arrivalTimeField"];
                    filterResult.arrivalTimes.push(arrivalTimeField);
                    /*arrivalTimeField*/
                    var departureTimeField = obj["departureTimeField"];
                    filterResult.departureTimes.push(departureTimeField);
                    /*estimatedTimeField*/
                    var estimatedTimeField = obj["estimatedTimeField"];
                    filterResult.estimatedTimes.push(estimatedTimeField);
                });
            });
        });
        filterResults.push(filterResult);
    });
    this.filterResults = filterResults;
    return filterResults;
};

hotels.Results.prototype.Filters = function () {
    //debugger;
    var ids = new Array();
    for (c = 0; c < this.filterResults.length; c++) {

        var hashAirline = false;
        var hashStop = false;
        var hasArrivalAirPort = false;
        var hasDepartureAirport = false;
        var hasArrivalTimeField = false;
        var hasDepartureTimeField = false;
        var hasEstimatedTimeField = false;
        var hasAmountCurrencyShowField = false;
        /*airLines*/
        for (d = 0; d < this.filterResults[c].airLines.length; d++) {
            if (goog.array.contains(this.filters.airlines, this.filterResults[c].airLines[d]) ||
                    goog.array.contains(this.filters.airlines, '*')) {
                hashAirline = true;
            }
        }
        /*stops*/
        for (d = 0; d < this.filterResults[c].stops.length; d++) {
            if (goog.array.contains(this.filters.stops, this.filterResults[c].stops[d]) ||
                    goog.array.contains(this.filters.stops, '*')) {
                hashStop = true;
            }
        }
        /*arrivalAirPorts*/
        for (d = 0; d < this.filterResults[c].arrivalAirPorts.length; d++) {
            if (goog.array.contains(this.filters.arrivalAirPorts, this.filterResults[c].arrivalAirPorts[d]) ||
                    goog.array.contains(this.filters.arrivalAirPorts, '*')) {
                hasArrivalAirPort = true;
            }
        }
        /*departureAirports*/
        for (d = 0; d < this.filterResults[c].departureAirports.length; d++) {
            if (goog.array.contains(this.filters.departureAirports, this.filterResults[c].departureAirports[d]) ||
                    goog.array.contains(this.filters.departureAirports, '*')) {
                hasDepartureAirport = true;
            }
        }
        /*arrivalTimes*/
        for (d = 0; d < this.filterResults[c].arrivalTimes.length; d++) {
            if (goog.array.contains(this.filters.arrivalTimes, this.filterResults[c].arrivalTimes[d]) ||
                    goog.array.contains(this.filters.arrivalTimes, '*')) {
                hasArrivalTimeField = true;
            }
        }
        /*departureTimes*/
        for (d = 0; d < this.filterResults[c].departureTimes.length; d++) {
            if (goog.array.contains(this.filters.departureTimes, this.filterResults[c].departureTimes[d]) ||
                    goog.array.contains(this.filters.departureTimes, '*')) {
                hasDepartureTimeField = true;
            }
        }
        /*amountCurrencys*/
        for (d = 0; d < this.filterResults[c].amountCurrencys.length; d++) {
            if (goog.array.contains(this.filters.amountCurrencys, this.filterResults[c].amountCurrencys[d]) ||
                    goog.array.contains(this.filters.amountCurrencys, '*')) {
                hasAmountCurrencyShowField = true;
            }
        }

        /*estimatedTimes*/
        for (d = 0; d < this.filterResults[c].estimatedTimes.length; d++) {
            if (goog.array.contains(this.filters.estimatedTimes, this.filterResults[c].estimatedTimes[d]) ||
                    goog.array.contains(this.filters.estimatedTimes, '*')) {
                hasEstimatedTimeField = true;
            }
        }
        if (hashAirline &&
                hashStop &&
                hasArrivalAirPort &&
                hasDepartureAirport &&
                hasArrivalTimeField &&
                hasDepartureTimeField &&
                hasEstimatedTimeField &&
                hasAmountCurrencyShowField) {
            /*add rph*/
            ids.push(this.filterResults[c].id);
        }
    }
    return ids;
};

hotels.Results.prototype.orderResults = function (e) {
    //debugger;
    var arrayOrder = goog.array.sort(this.filterResults, function (ob1, obj2) {

        //debugger;
    });
};

hotels.Results.prototype.setConfiguration = function () {

    var widget_app_technocloud = goog.dom.getElement("widget_app_technocloud");
    var data_width = widget_app_technocloud.getAttribute("data-width");
    var data_top = widget_app_technocloud.getAttribute("data-top");

    var objStyle = {
        width: data_width,
        top: data_top
    };
    var ux_common_main = goog.getCssName("ux-common-main");
    var style = "." + ux_common_main + "{";
    style += goog.style.toStyleAttribute(objStyle);
    style += "}";

    this.CONFIGURATION = goog.style.installStyles(style);
};

/**
 * Registramos el modulo.
 */
moduleManager.setLoaded('hotels_results');