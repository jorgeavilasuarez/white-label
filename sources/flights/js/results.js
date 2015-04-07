/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

goog.provide("flights.Results");
goog.require("flights.template.results");
goog.require("goog.dom.query");
goog.require("goog.async.Delay");
goog.require('goog.ui.Popup');
goog.require('goog.net.XhrIo');
goog.require('goog.dom.classes');
goog.require('goog.module.ModuleManager');
goog.require('goog.ui.TwoThumbSlider');
goog.require('goog.ui.AnimatedZippy');
goog.require('goog.ui.Zippy');
goog.require('goog.ui.ZippyEvent');
goog.require('goog.ui.Tooltip');


/** @define {string}  URL_AVAILABILITY Whether logging should be enabled. */
//var URL_AVAILABILITY = "http://localhost:49815/site/availability.ashx";
var URL_AVAILABILITY = "http://www.travelcloud.com.co/site/availability.ashx";
/**
 * Clase que genera los resultados de vuelos
 * @constructor 
 * @param {Object} arrResults objecto resultados
 * @extends  {goog.ui.Component}
 */
flights.Results = function (arrResults, passenger, cortinilla, objSearch) {
    //debugger;
    goog.ui.Component.call(this);
    this.objSearch = objSearch;
    this.arrResults = arrResults;
    this.passenger = passenger;
    this.cortinilla = cortinilla;
    this.arrResults = { "DO_tcAirSearchRSJS": {} };
    this.arrResults["DO_tcAirSearchRSJS"] = { "tcAirSearchRSField": [] };

};
goog.inherits(flights.Results, goog.ui.Component);

flights.Results.prototype.currentFilters_ = [];
flights.Results.prototype.registerLoaded = false;

/**
 * Creates an initial DOM representation for the component.
 * @override
 */
flights.Results.prototype.createDom = function () {
    goog.base(this, 'createDom');

    var element_ = this.getElement();
    this.setId("clusters");
    this.content = flights.template.results.results();
    element_.innerHTML = this.content;

    if (!goog.DEBUG) {
        this.MODULE_RESULTS_CSS = goog.style.installStyles(MODULE_FLIGHTS_RESULTS_CSS);
    }
};

flights.Results.prototype.enterDocument = function () {
    goog.base(this, 'enterDocument');
    this.clusters = goog.dom.getElementByClass(goog.getCssName("clusters"));
};

/**
 * Called when component's element is known to have been removed from the
 * document.
 * @override
 */
flights.Results.prototype.exitDocument = function () {

    goog.base(this, 'exitDocument');
    if (!goog.DEBUG) {
        goog.style.uninstallStyles(this.MODULE_RESULTS_CSS);
    }
    if (typeof this.register !== "undefined") {
        this.register.dispose();
    }
    goog.dom.removeNode(this.objSearch.container);

    for (var c = 0; c < this.toolTips.length; c++) {
        goog.dom.removeNode(this.toolTips[c].getElement());
    }
};

///Seccion Resultados

/**
 * Establece el objeto de resultados que llega desde el servidor
 */
flights.Results.prototype.getObjectResults = function () {
    return this.objResults_
};

/**
 * Obtiene el objeto de resultados que llega desde el servidor
 */
flights.Results.prototype.setObjectResults = function (objResults) {
    this.objResults_ = objResults;
};

/**
 * Dibuja los itinerarios  
 */
flights.Results.prototype.renderFlightsResults = function () {

    //inicializamos el arrego de tooltips de detalles de la tarifa
    this.toolTips = [];
    this.filterOptions_ = [];
    this.currentFilters_ = [];

    var tcAirSearchRSField = this.getObjectResults()["DO_tcAirSearchRSJS"]["tcAirSearchRSField"];

    //ordenamos por precio
    goog.array.sort(tcAirSearchRSField, function (obja, objb) {
        return parseInt(obja.amountCurrencyLocalField) - parseInt(objb.amountCurrencyLocalField);
    });

    //dibujamos cada itinerario y agregamos un idenficador para los filtros
    for (var c = 0, max = tcAirSearchRSField.length; c < max; c++) {

        tcAirSearchRSField[c]["id"] = this.makeId(c);
        tcAirSearchRSField[c]["position"] = c;
        this.renderItineraryUI_(tcAirSearchRSField[c]);
    }

    //obtenemos las opciones de los filtros
    this.filterOptions_ = this.getFilterOptions_(tcAirSearchRSField);

    //agregamos el evento clic del boton de regresar
    this.btnreturnsearch = goog.dom.getElementByClass(goog.getCssName("btnreturnsearch"));
    this.getHandler().listen(this.btnreturnsearch, goog.events.EventType.CLICK, this.onButtonReturnToSearchClick_);

    //dibujamos los filtros
    this.renderFiltersUI_();

    //subimos el scroll hacia los resultados de busqueda
    //window.scrollTo(0, goog.style.getPageOffsetTop(this.getElement()));
   window.scrollTo(0, 0);
};

/**
 * Dibuja un itinerario
 * @private
 */
flights.Results.prototype.renderItineraryUI_ = function (tcAirSearchRSField) {
    //debugger;
    var cluster = goog.dom.htmlToDocumentFragment(flights.template.results.flights({ tcAirSearchRSField: tcAirSearchRSField }, null));
    goog.dom.appendChild(this.clusters, cluster);

    //agregamos el evento clic para cada link del detalle
    var stopsLinks = goog.dom.getElementsByClass(goog.getCssName("stops-link"), cluster);
    for (var c = 0; c < stopsLinks.length; c++) {
        this.getHandler().listen(stopsLinks[c], goog.events.EventType.CLICK, this.onSelectDetailFlights_);
    }


    //agregamos el evento clic para el boton de seleccionar de cada itinerario
    var buttonsBuy = goog.dom.getElementByClass(goog.getCssName("btn-buy"), cluster);
    this.getHandler().listen(buttonsBuy, goog.events.EventType.CLICK, this.onSeleccionarItineraryClick_);
    var pricesPassenger = goog.dom.getElementsByClass(goog.getCssName("price-passenger"), cluster);

    //tooltip del detalle del precio
    for (var i = 0; i < pricesPassenger.length; i++) {
        var toolTip = new goog.ui.Tooltip(pricesPassenger[i]);
        toolTip.className = goog.getCssName('tooltip');
        toolTip.setShowDelayMs(1);
        toolTip.setHtml(flights.template.results.tooltipPrices({ tcPassengerTypeField: tcAirSearchRSField["tcPassengerTypeField"][i] }, null), true);
        toolTip.attach(pricesPassenger[i]);
        this.toolTips.push(toolTip);
    }
};

/**
 * Actualiza los resultados mostrando unicamente los itinerarios 
 * segun los ids que sean pasados como parametros.
 * @param {Array<Object>} ids
 */
flights.Results.prototype.updateItineraryUI_ = function (ids) {

    goog.array.forEach(goog.dom.query("." + goog.getCssName("clusters") + " ." + goog.getCssName("cluster")), function (obj, index, array) {
        obj.style.display = "none";
    });
    for (c = 0; c < ids.length; c++) {
        goog.dom.getElement(ids[c]).style.display = "block";
    }
    if (ids.length === 0) {
        goog.array.forEach(goog.dom.query("." + goog.getCssName("clusters") + " ." + goog.getCssName("cluster")), function (obj, index, array) {
            obj.style.display = "block";
        });
    }
}

/**
 * Maneja el evento clic del boton cerrar del detalle del vuelo
 * @private
 */
flights.Results.prototype.closeFlightDetailPopup_ = function () {
    this.objPopup.setVisible(false);
};

/**
 * Maneja el evento clic para el link del detalle del vuelo
 * @private
 */
flights.Results.prototype.onSelectDetailFlights_ = function (e) {

    if (typeof (this.popup) === "undefined") {
        this.popup = goog.dom.htmlToDocumentFragment(flights.template.results.popup({}, null));
        goog.dom.appendChild(this.getContentElement(), this.popup);
    }
    //si el popup de detalles no existe lo creamos
    if (typeof (this.objPopup) === "undefined") {
        this.objPopup = new goog.ui.Popup(this.popup);
        this.objPopup.setHideOnEscape(true);
        this.objPopup.setAutoHide(true);
        var margin = new goog.math.Box(0, -300, 0, 0);
        this.objPopup.setMargin(margin);
        //agregamos el evento clic para cerrar el detalle
        this.getHandler().listen(goog.dom.getElementByClass(goog.getCssName("popup-close-button")), goog.events.EventType.CLICK, this.closeFlightDetailPopup_);
    }

    var rph = e.currentTarget.getAttribute("rph");
    var tcairroutefieldindex = e.currentTarget.getAttribute("tcairroutefieldindex");
    var tcFlightSegmentFieldindex = e.currentTarget.getAttribute("tcFlightSegmentFieldindex");

    //buscamos el detalle que se va a mostrar
    var segmentSelected = goog.array.find(this.getObjectResults()["DO_tcAirSearchRSJS"]["tcAirSearchRSField"], function (a, b, c) {
        return this.id === a.id;
    }, { "id": rph });
    var itineraryselected = segmentSelected["tcAirRouteField"][tcairroutefieldindex]["tcAirItineraryField"][tcFlightSegmentFieldindex];
    this.popupContent = goog.dom.getElementByClass(goog.getCssName("popup-inner-content"));
    //pasamos el objeto del detalle para renderizarlo
    this.popupContent.innerHTML = flights.template.results.popupContent({ tcAirItineraryField: itineraryselected }, null);
    this.objPopup.setPosition(new goog.positioning.AnchoredViewportPosition(e.currentTarget, 1));
    this.objPopup.setVisible(true);
};

/**
 * Maneja el evento clic para el boton de regresar
 * @private
 */
flights.Results.prototype.onButtonReturnToSearchClick_ = function () {
    this.dispose();
};

/**
 * Maneja el evento clic cuando selecciona un resultado
 * @private
 */
flights.Results.prototype.onSeleccionarItineraryClick_ = function (e) {
    //debugger;
    this.dataSelected = e.currentTarget.getAttribute("data");
    var parentContainer = goog.dom.getElement(this.dataSelected);
    var checksSeleted = goog.dom.query("input:checked", parentContainer);
    var rphsSelected = new Array();
    this.availability = null;

    for (var i = 0; i < checksSeleted.length; i++) {
        rphsSelected.push(checksSeleted[i].value);
    }

    if (rphsSelected.length === 0) {
        alert("Por favor seleccione una opcion de ida y de regreso.");
        return false;
    }

    this.cortinilla.style.display = "block";
    moduleManager.execOnLoad('flights_register', goog.bind(this.onRegisterLoaded_, this));

    //if (!goog.DEBUG && false) {
    if (true) {
        var jsonpSearch = new goog.net.Jsonp(URL_AVAILABILITY);
        jsonpSearch.setRequestTimeout(-1);
        var sessionField = this.getObjectResults()["DO_tcAirSearchRSJS"]["sessionField"];
        jsonpSearch.send({ "rphs": rphsSelected.join(','), "sessionid": sessionField }, goog.bind(function (obj) {
            this.availability = obj;
            this.showRegisterModule();
        }, this));
    } else {
        this.cortinilla.style.display = "none";
    }

};

/**
 * Maneja el evento clic cuando selecciona un resultado
 * @private
 */
flights.Results.prototype.showRegisterModule = function () {

    debugger;
    if (typeof this.availability !== "undefined" && this.availability != null && this.registerLoaded) {
        this.cortinilla.style.display = "none";
        try {

            if (this.availability["DO_tcAirSearchRSJS"]["tcErrorField"]["codeField"] === "1") {
                alert(this.availability["DO_tcAirSearchRSJS"]["tcErrorField"]["messageField"]);
                if (typeof (this.register) !== "undefined") {
                    this.register.dispose();
                }
                this.getElement().style.display = "block";
                return false;
            } else {
                this.getElement().style.display = "none";
            }
        } catch (e) {
            this.getElement().style.display = "none";
        }

    }

};


///Seccion Filtros

flights.Results.prototype.setLabel_ = function (type, displayLabel, min, max) {
    displayLabel.innerHTML = 'DESDE: ' + this.filterOptions_[type].values[min].label +
          ' HASTA: ' + this.filterOptions_[type].values[max].label;
};

/**
 * Crea el slider de filtros para los horarios de salida 
 * @private
 * @param {Object} dataSlider datos de inicialización
 */
flights.Results.prototype.setSliderUI_ = function (dataSlider) {

    //debugger;

    //slider element    
    var filterContainerElement = goog.dom.getElement("filter_" + dataSlider.type);
    if (filterContainerElement == null) {

        filterContainerElement = goog.dom.htmlToDocumentFragment(flights.template.results.filterSlider({ filterObject: dataSlider }));
        var ux_common_filters = goog.dom.getElementByClass(goog.getCssName("ux-common-filters"));
        goog.dom.appendChild(ux_common_filters, filterContainerElement);

        var displayLabel = goog.dom.getElementByClass(goog.getCssName("display-label"), filterContainerElement);
        var sliderElement = goog.dom.getElementByClass(goog.getCssName("goog-twothumbslider"), filterContainerElement);
        //slider component
        var slider = new goog.ui.TwoThumbSlider();
        slider.setMoveToPointEnabled(true);
        slider.setMinimum(0);
        slider.setMaximum(dataSlider.values.values.length - 1);
        slider.decorate(sliderElement);
        slider.setModel(dataSlider.type);
        //colocamos el indicador
        this.setLabel_(dataSlider.type, displayLabel, slider.getValue(), (slider.getValue() + slider.getExtent()));
        //evento de cambio en el slider
        slider.addEventListener(goog.ui.Component.EventType.CHANGE, goog.bind(function () {
            debugger;
            //colocamos el indicador
            this.setLabel_(dataSlider.type, displayLabel, slider.getValue(), (slider.getValue() + slider.getExtent()));

        }, this));

        var btnFilterApply = goog.dom.getElementByClass(goog.getCssName('filter-apply'), filterContainerElement);
        var btnFilterRemove = goog.dom.getElementByClass(goog.getCssName('filter-remove'), filterContainerElement);

        //evento clic filtro
        goog.events.listen(btnFilterApply, goog.events.EventType.CLICK, goog.bind(function (event) {
            debugger;
            var maximum = slider.getValue() + slider.getExtent();
            if (slider.getValue() !== slider.getMinimum() || maximum !== slider.getMaximum()) {
                //colocamos el indicador
                this.setLabel_(dataSlider.type, displayLabel, slider.getValue(), (slider.getValue() + slider.getExtent()));
                //removemos el filtro previo
                this.setRemoveAllFilterActive_(event.currentTarget.dataset.type);
                //activamos el rango de filtros
                this.setFilterActiveRange_(event.currentTarget.dataset.type, slider.getValue(), (slider.getValue() + slider.getExtent()));
                btnFilterRemove.style.display = "inline";
                //actualizamos la interfaz gráfica
                this.setUpdateUI_();
            } else {
                //removemos los filtros
                btnFilterRemove.click();
            }

            //return false;
        }, this));

        //maneja el boton que limpia los filtros
        goog.events.listen(btnFilterRemove, goog.events.EventType.CLICK, goog.bind(function (event) {
            event.currentTarget.style.display = "none";
            slider.setValueAndExtent(slider.getMinimum(), slider.getMaximum());
            //removemos el filtro
            this.setRemoveAllFilterActive_(event.currentTarget.dataset.type);
            //actualizamos la interfaz gráfica
            this.setUpdateUI_();
            //return false;
        }, this));

        //acordeon
        var animatedZippy = new goog.ui.AnimatedZippy(
        goog.dom.getElementByClass(goog.getCssName('ux-common-filter-header'), filterContainerElement),
        goog.dom.getElementByClass(goog.getCssName('ux-common-filter-body'), filterContainerElement), dataSlider.expanded);

    } else {
        ///actualizacion
    }

};

/**
 * Crea el slider de filtros para los precios 
 * @private
 */
flights.Results.prototype.setSliderPriceUI_ = function () {
    var dataSlider = {
        type: "amountCurrencys",
        title: "Precios",
        values: this.filterOptions_["amountCurrencys"],
        count: this.filterOptions_["amountCurrencys"].count,
        expanded: true
    };
    this.setSliderUI_(dataSlider)
};

/**
 * Crea el filtro para las aerolineas
 * @private
 */
flights.Results.prototype.setFilterAirLineUI_ = function () {

    var dataSlider = {
        type: "airLines",
        title: "Aerolineas",
        values: this.filterOptions_["airLines"].values,
        count: this.filterOptions_["airLines"].count,
        expanded: true
    };
    this.setFilterCheckBoxUI_(dataSlider);
};

/**
 * Crea el filtro checkbox
 * @private
 */
flights.Results.prototype.setFilterCheckBoxUI_ = function (dataSlider) {
    var filterContainerElement = goog.dom.getElement("filter_" + dataSlider.type);

    if (filterContainerElement === null) {

        filterContainerElement = goog.dom.htmlToDocumentFragment(flights.template.results.filterCheckbox({ filterObject: dataSlider }));
        var ux_common_filters = goog.dom.getElementByClass(goog.getCssName("ux-common-filters"));
        goog.dom.appendChild(ux_common_filters, filterContainerElement);

        //acordeon
        var prices = new goog.ui.AnimatedZippy(
        goog.dom.getElementByClass(goog.getCssName('ux-common-filter-header'), filterContainerElement),
        goog.dom.getElementByClass(goog.getCssName('ux-common-filter-body'), filterContainerElement), dataSlider.expanded);

        var checksFilter = goog.dom.getElementsByClass(goog.getCssName("input-filter"), filterContainerElement);
        var all_input = goog.dom.getElementByClass(goog.getCssName("all-input"), filterContainerElement);

        //manejador del evento click para el check de "todas las opciones"
        this.getHandler().listen(all_input, goog.events.EventType.CLICK, goog.bind(this.onClickAllFilterCheckBoxUI_, this, checksFilter, all_input));

        for (var c = 0; c < checksFilter.length; c++) {
            //manejador del evento click del checkbox
            this.getHandler().listen(checksFilter[c], goog.events.EventType.CLICK, goog.bind(this.onClickFilterCheckBoxUI_, this, checksFilter, all_input));
        }
    } else {

        //var all_input = goog.dom.getElement(dataSlider.type + "-all");

        for (var c = 0; c < dataSlider.values.length; c++) {
            var checkFilter = goog.dom.getElement(dataSlider.type + "-" + dataSlider.values[c].value);
            var count = goog.dom.getElement("count_" + dataSlider.values[c].value);
            goog.dom.setTextContent(count, dataSlider.values[c].count);
            checkFilter.disabled = dataSlider.values[c].disabled;
            checkFilter.checked = dataSlider.values[c].checked;
        }
    }
};

/**
 * Manejador del evento click para el check de "todas las opciones"
 * @private
 */
flights.Results.prototype.onClickAllFilterCheckBoxUI_ = function (checksFilter, all_input, event) {

    all_input.checked = true;
    all_input.disabled = true;

    for (var c = 0; c < checksFilter.length; c++) {
        checksFilter[c].checked = false;
    };
    //removemos el filtro
    this.setRemoveAllFilterActive_(all_input.dataset.type);
    //actualizamos la interfaz gráfica
    this.setUpdateUI_();
};

/**
 * Manejador del evento click del checkbox
 * @private
 */
flights.Results.prototype.onClickFilterCheckBoxUI_ = function (checksFilter, all_input, event) {

    //si checkea agregamos filtro
    if (event.currentTarget.checked) {
        this.setFilterActive_(event.currentTarget.dataset.type, event.currentTarget.value, event.currentTarget.value);
        //habilitamos el check de todas las opciones
        all_input.checked = false;
        all_input.disabled = false;
    } else {
        //removemos filtro
        this.removeFilterActive_(event.currentTarget.dataset.type, event.currentTarget.value, event.currentTarget.value);
        //si no hay opciones chequedas habilitamos el check de "todas las opciones"
        var hashOptionChecked = false;
        for (var c = 0; c < checksFilter.length; c++) {
            if (checksFilter[c].checked) {
                hashOptionChecked = true;
            }
        }
        if (!hashOptionChecked) {
            all_input.checked = true;
            all_input.disabled = true;
        }
    }
    //actualizamos la interfaz gráfica
    this.setUpdateUI_();
};


/**
 * Actualiza los resultados y filtros
 * @private
 */
flights.Results.prototype.setUpdateUI_ = function () {
    //realizamos la busqueda segun los filtros
    var ids = this.getSearchForFilterResults_();
    //actualizamos los resultados
    this.updateItineraryUI_(ids);
    //Actualizamos los filtros
    this.renderFiltersUI_();
    //actualizamos la interfaz grafica
    this.updateActiveFiltersUI_();
    //subimos el scroll hacia los resultados de busqueda
    //window.scrollTo(0, goog.style.getPageOffsetTop(this.getElement()));
}

/**
 * Agrega un filtro
 * @private
 */
flights.Results.prototype.setFilterActive_ = function (type, value, label) {
    //debugger;    

    var existType = false;
    for (var c = 0; c < this.currentFilters_.length; c++) {
        if (this.currentFilters_[c].type === type) {
            existType = true;
            var existValue = false;
            for (var i = 0; i < this.currentFilters_[c].values.length; i++) {
                if (this.currentFilters_[c].values[i].value === value) {
                    existValue = true;
                    break;
                }
            }
            //si no existe valor lo agregamos
            if (!existValue) {
                this.currentFilters_[c].values.push({ value: value, label: label });
            }
        }
    }

    //si no existe tipo ni valor los agregamos
    if (existType != null && !existType) {
        var type = { type: type, values: [{ value: value, label: label }] }
        this.currentFilters_.push(type);
    }

};


/**
 * Agrega un rango de filtros
 * @private
 */
flights.Results.prototype.setFilterActiveRange_ = function (type, from, to) {
    //activamos un rando de filtros
    for (var c = from; c <= to; c++) {
        this.setFilterActive_(type, this.filterOptions_[type].values[c].value);
    }
};


/**
 * Remueve un rango de filtros
 * @private
 */
flights.Results.prototype.setRemoveFilterActiveRange_ = function (type, from, to) {
    //activamos los filtros segun el rango
    for (var c = from; c <= to; c++) {
        this.removeFilterActive_(type, this.filterOptions_[type].values[c].value);
    }
};

/**
 * Remueve todos los filtros segun el tipo
 * @private
 */
flights.Results.prototype.setRemoveAllFilterActive_ = function (type) {

    var indexTypes = [];
    for (var c = 0; c < this.currentFilters_.length; c++) {
        if (this.currentFilters_[c].type === type) {
            indexTypes.push(c);
        }
    }
    //si no hay mas elementos del mismo tipo eliminamos el tipo
    for (var c = 0; c < indexTypes.length; c++) {
        this.currentFilters_.splice(indexTypes[c], 1);
    }
};


/**
 * Remueve un filtro
 * @private
 */
flights.Results.prototype.removeFilterActive_ = function (type, value) {
    //debugger;
    var indexType = null;
    for (var c = 0; c < this.currentFilters_.length; c++) {
        if (this.currentFilters_[c].type === type) {
            indexType = c;
            var indexValue = null;
            for (var i = 0; i < this.currentFilters_[c].values.length; i++) {
                if (this.currentFilters_[c].values[i].value === value) {
                    indexValue = i;
                    break;
                }
            }
            //eliminamos el valor
            this.currentFilters_[c].values.splice(indexValue, 1);
            break;
        }
    }
    //si no hay mas elementos del mismo tipo eliminamos el tipo
    if (indexType != null) {
        if (this.currentFilters_[indexType].values.length === 0) {
            this.currentFilters_.splice(indexType, 1);
        }
    }

};

/**
 * Crea el slider de filtros para las escalas
 * @private
 */
flights.Results.prototype.setFilterScalesUI_ = function () {
    var dataSlider = {
        type: "stops",
        title: "Escalas",
        values: this.filterOptions_["stops"].values,
        count: this.filterOptions_["stops"].count,
        expanded: true
    };
    this.setFilterCheckBoxUI_(dataSlider);
};


/**
 * Crea el slider de filtros para los horarios de llegada 
 * @private
 */
flights.Results.prototype.setSliderArrivalTimeUI_ = function () {
    var dataSlider = {
        type: "arrivalTimes",
        title: "Horario de llegada",
        values: this.filterOptions_["arrivalTimes"],
        count: this.filterOptions_["arrivalTimes"].count,
        expanded: false

    };
    this.setSliderUI_(dataSlider);
};

/**
 * Crea el slider de filtros para los horarios de salida 
 * @private
 */
flights.Results.prototype.setSliderDepartureTimeUI_ = function () {
    var dataSlider = {
        type: "departureTimes",
        title: "Horario de salida",
        values: this.filterOptions_["departureTimes"],
        count: this.filterOptions_["departureTimes"].count,
        expanded: false
    };
    this.setSliderUI_(dataSlider);
};

/**
 * Crea el slider de filtros para los aeropuertos de salida
 * @private
 */
flights.Results.prototype.setFilterDepartureAirportsUI_ = function () {
    var dataSlider = {
        type: "departureAirports",
        title: "Aeropuertos de salida",
        values: this.filterOptions_["departureAirports"].values,
        count: this.filterOptions_["departureAirports"].count,
        expanded: false
    };
    this.setFilterCheckBoxUI_(dataSlider);
};

/**
 * Crea el slider de filtros para los aeropuertos de llegada
 * @private
 */
flights.Results.prototype.setFilterArrivalAirportsUI_ = function () {
    var dataSlider = {
        type: "arrivalAirPorts",
        title: "Aeropuertos de llegada",
        values: this.filterOptions_["arrivalAirPorts"].values,
        count: this.filterOptions_["arrivalAirPorts"].count,
        expanded: false
    };
    this.setFilterCheckBoxUI_(dataSlider);
};

/**
 * Crea el slider de filtros para los MarketingCabin
 * @private
 */
flights.Results.prototype.setFilterMarketingCabinsUI_ = function () {
    var dataSlider = {
        type: "marketingCabins",
        title: "Clases",
        values: this.filterOptions_["marketingCabins"].values,
        count: this.filterOptions_["marketingCabins"].count,
        expanded: true
    };
    this.setFilterCheckBoxUI_(dataSlider);
};

/**
 * Actualiza la interfaz gráfica de los filtros activos
 * @private
 */
flights.Results.prototype.updateActiveFiltersUI_ = function () {

    //debugger;
    var activeFilters = goog.dom.getElementByClass(goog.getCssName("active-filters"));
    var filterContainerElement = flights.template.results.currentFilters({ currentFilters: this.currentFilters_ }, null);
    activeFilters.innerHTML = filterContainerElement;

    var btnRemoveFilters = goog.dom.getElementsByClass(goog.getCssName("btn-remove-filter"));

    //removemos el filtros
    for (var d = 0; d < btnRemoveFilters.length; d++) {
        this.getHandler().listen(btnRemoveFilters[d], goog.events.EventType.CLICK, function (event) {
            var value = event.currentTarget.dataset.value;
            this.removeFilterActive_(event.currentTarget.dataset.type, event.currentTarget.dataset.value);
            //actualizamos la interfaz grafica
            this.updateActiveFiltersUI_();
        });
    }


};

/**
 * Dibuja la interfaz gráfica de los filtros.
 */
flights.Results.prototype.renderFiltersUI_ = function () {
    this.divFilters = goog.dom.getElementByClass(goog.getCssName("filters"));
    filterContainerElement = goog.dom.getElementByClass(goog.getCssName("filters-container"));

    if (filterContainerElement === null) {
        filterContainerElement = goog.dom.htmlToDocumentFragment(flights.template.results.filters(null, null));
        goog.dom.appendChild(this.divFilters, filterContainerElement);
        //this.divFilters.innerHTML = filterContainerElement.outerHTML;
    }

    //filtro escalas
    this.setFilterScalesUI_();
    //clases
    this.setFilterMarketingCabinsUI_();
    //filtro aerolineas
    this.setFilterAirLineUI_();
    //slider de precios
    this.setSliderPriceUI_();
    //slider de horario de llegada
    this.setSliderArrivalTimeUI_();
    //slider de horario de salida
    this.setSliderDepartureTimeUI_();
    //aeropuertos de salida
    this.setFilterDepartureAirportsUI_();
    //aeropuertos de llegada
    this.setFilterArrivalAirportsUI_();
};


/**
 * Maneja el evento de carga del modulo de registro 
 */
flights.Results.prototype.onRegisterLoaded_ = function () {

    if (typeof this.register !== "undefined") {
        this.register.dispose();
    }
    this.register = new flights.Register(this);
    if (this.objSearch.objRender !== null) {
        this.register.render(this.objSearch.objRender);
    } else {
        this.register.render();
    }
    this.registerLoaded = true;

    this.showRegisterModule();
};



/**
 * Obtiene las descripciones de aeropuertos y ciudades
 */
flights.Results.prototype.getMetaData_ = function (obj) {

    for (var key in obj) {
        for (d = 0; d < CITYS.length; d++) {

            var index = this.metaData.indexOf(obj[key]);

            if (key === CITYS[d].substring(0, 3)) {
                var data = {
                    city: CITYS[d].split(/\s/g)[1],
                    code: key,
                    airport: CITYS[d].match(/\s\((.*)\)\s/g)[0].replace("(", "").replace(")", "").replace(/\s/g, "")
                };

                this.metaData.push(data);
                obj[key].label = data.airport;

                break;
            }

        }
    }
}


/**
 * Obtiene las descripciones de aeropuertos y ciudades
 */
flights.Results.prototype.setAirport_ = function (obj) {

    if (this.metaData.indexOf(obj[c]) !== -1) {
        return;
    }

    for (var key in obj) {
        for (d = 0; d < CITYS.length; d++) {
            if (key === CITYS[d].substring(0, 3)) {
                this.metaData.push({
                    city: CITYS[d].split(/\s/g)[1],
                    code: key,
                    airport: CITYS[d].match(/\s\((.*)\)\s/g)[0].replace("(", "").replace(")", "").replace(/\s/g, "")
                });
                break;
            }
        }
    }
}


/**
 * Agrega las descripciones de aeropuertos y ciudades
 */
flights.Results.prototype.setMetada_ = function (objtcAirSearchRSField) {

    for (var c = 0; c < objtcAirSearchRSField.length; c++) {
        var tcAirRouteField = objtcAirSearchRSField[c]["tcAirRouteField"];
        for (var i = 0; i < tcAirRouteField.length; i++) {
            var tcAirItineraryField = objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'];
            for (var k = 0; k < tcAirItineraryField.length; k++) {
                var tcFlightSegmentField = objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]['tcFlightSegmentField'];
                for (var s = 0; s < tcFlightSegmentField.length; s++) {
                    for (var l = 0; l < this.metaData.length; l++) {

                        /*tcAirRouteField*/
                        if (objtcAirSearchRSField[c]["tcAirRouteField"][i]["airportField"] === this.metaData[l].code) {
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]["airportNameField"] = this.metaData[l].airport;
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]["cityField"] = this.metaData[l].city === null ? "" : this.metaData[l].city;
                        }
                        if (objtcAirSearchRSField[c]["tcAirRouteField"][i]["airportDestField"] === this.metaData[l].code) {
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]["airportNameDestField"] = this.metaData[l].airport;
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]["cityDestField"] = this.metaData[l].city;
                        }
                        /*tcAirItineraryField*/
                        if (objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["arrivalAirPortField"] === this.metaData[l].code) {
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["arrivalAirPortNameField"] = this.metaData[l].airport;
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["arrivalCityField"] = this.metaData[l].city;
                        }
                        if (objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["departureAirportField"] === this.metaData[l].code) {
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["departureAirportNameField"] = this.metaData[l].airport;
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["departureCityField"] = this.metaData[l].city;
                        }
                        /*tcFlightSegmentField*/
                        if (objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["tcFlightSegmentField"][s]["arrivalAirPortField"] === this.metaData[l].code) {
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["tcFlightSegmentField"][s]["arrivalAirPortNameField"] = this.metaData[l].airport;
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["tcFlightSegmentField"][s]["arrivalCityNameField"] = this.metaData[l].city;
                        }
                        if (objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["tcFlightSegmentField"][s]["departureAirportField"] === this.metaData[l].code) {
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["tcFlightSegmentField"][s]["departureAirportNameField"] = this.metaData[l].airport;
                            objtcAirSearchRSField[c]["tcAirRouteField"][i]['tcAirItineraryField'][k]["tcFlightSegmentField"][s]["departureCityField"] = this.metaData[l].city;
                        }
                    }
                }
            }
        }
    }

}

/**
 * Obtiene el objeto con las opciones de los filtros
 * @param {Object} objtcAirSearchRSField
 * @returns {Object}
 */
flights.Results.prototype.getFilterOptions_ = function (objtcAirSearchRSField) {
    //debugger;
    var airLines = {};
    var stops = {};
    var arrivalAirPorts = {};
    var departureAirports = {};
    var arrivalTimes = {};
    var departureTimes = {};
    var amountCurrencys = {};
    var estimatedTimes = {};
    var estimatedArrivalTimes = {};
    var estimatedDepartureTimes = {};
    var marketingCabinFields = {};
    this.metaData = new Array();
    var obMetaData = {};
    obMetaData.city = "";
    obMetaData.code = "";

    function getFilterValues(objFilter, id, idItinerary, value, label) {
        if (typeof objFilter[id] === "undefined") {
            objFilter[id] = {};
            objFilter[id].value = value;
            objFilter[id].label = label;
            objFilter[id].disabled = false;
            objFilter[id].checked = false;
            objFilter[id].clusters = new Array();
            objFilter[id].clusters.push(idItinerary);
        } else {
            if (objFilter[id].clusters.indexOf(idItinerary) === -1) {
                objFilter[id].clusters.push(idItinerary);
            }
        }
    }

    goog.array.forEach(objtcAirSearchRSField, function (obj, indexTcAirSearchRSField, array) {
        var tcAirRouteField = obj["tcAirRouteField"];
        var amountCurrencyShowField = obj["amountCurrencyShowField"];
        var id = obj["amountCurrencyLocalField"];
        idItinerary = obj['id'];

        /*amountCurrencyShowField*/
        getFilterValues(amountCurrencys, id, idItinerary, id, amountCurrencyShowField);

        goog.array.forEach(tcAirRouteField, function (obj, index, array) {

            var tcAirItineraryField = obj['tcAirItineraryField'];

            getFilterValues(arrivalAirPorts, obj['airportDestField'], idItinerary, obj['airportDestField'], obj['airportDestField']);
            getFilterValues(departureAirports, obj['airportField'], idItinerary, obj['airportField'], obj['airportField']);

            goog.array.forEach(tcAirItineraryField, function (obj, index, array) {

                var tcFlightSegmentField = obj["tcFlightSegmentField"];
                var stopNameField = obj["stopNameField"];
                /*stops*/
                getFilterValues(stops, stopNameField, idItinerary, stopNameField, stopNameField);

                goog.array.forEach(tcFlightSegmentField, function (obj, index, array) {
                    //debugger;

                    /*airlines*/
                    var airLineOperatedField = obj["airLineOperatedField"];
                    getFilterValues(airLines, airLineOperatedField, idItinerary, airLineOperatedField, airLineOperatedField);

                    /*arrivalAirPortField*/
                    var arrivalAirPortField = obj["arrivalAirPortField"];
                    getFilterValues(arrivalAirPorts, arrivalAirPortField, idItinerary, arrivalAirPortField, arrivalAirPortField);

                    /*departureAirportField*/
                    var departureAirportField = obj["departureAirportField"];
                    getFilterValues(departureAirports, departureAirportField, idItinerary, departureAirportField, departureAirportField);

                    /*arrivalTimeField*/
                    var arrivalTimeField = obj["arrivalTimeField"];
                    getFilterValues(arrivalTimes, arrivalTimeField, idItinerary, arrivalTimeField, arrivalTimeField);

                    /*arrivalTimeField*/
                    var departureTimeField = obj["departureTimeField"];
                    getFilterValues(departureTimes, departureTimeField, idItinerary, departureTimeField, departureTimeField);

                    /*estimatedTimeField*/
                    var estimatedTimeField = obj["estimatedTimeField"];
                    getFilterValues(estimatedTimes, estimatedTimeField, idItinerary, estimatedTimeField, estimatedTimeField);

                    //marketingCabinField
                    var marketingCabinField = obj["marketingCabinField"];
                    getFilterValues(marketingCabinFields, marketingCabinField, idItinerary, marketingCabinField, marketingCabinField);
                });
            });
        });
    });

    //obtenemos las descripciones de aeropuertos y ciudades
    this.getMetaData_(arrivalAirPorts);
    this.getMetaData_(departureAirports);
    //agregramos las descripciones de aeropuertos y ciudades
    this.setMetada_(objtcAirSearchRSField);
    //obtemeso los valores de los filtros con las cantidades
    this.setObjectValuesAndCount_(airLines);
    this.setObjectValuesAndCount_(stops);
    this.setObjectValuesAndCount_(arrivalAirPorts);
    this.setObjectValuesAndCount_(departureAirports);
    this.setObjectValuesAndCount_(arrivalTimes);
    this.setObjectValuesAndCount_(departureTimes);
    this.setObjectValuesAndCount_(amountCurrencys);
    this.setObjectValuesAndCount_(estimatedTimes);
    this.setObjectValuesAndCount_(marketingCabinFields);
    //textos para tipos de cabina
    this.setCabinType_(marketingCabinFields);


    return {
        "airLines": airLines,
        "stops": stops,
        "arrivalAirPorts": arrivalAirPorts,
        "departureAirports": departureAirports,
        "arrivalTimes": arrivalTimes,
        "departureTimes": departureTimes,
        "amountCurrencys": amountCurrencys,
        "estimatedTimes": estimatedTimes,
        "marketingCabins": marketingCabinFields
    };
};

/**
 * A cabin is either Premium First (P), First (F), Premium Business (J), Business (C), Premium Economy (S) or Economy (Y)
 * @param {Object} arraySearch
 * @returns {Object}
 */
flights.Results.prototype.setCabinType_ = function (marketingCabinFields) {
    for (var c = 0; c < marketingCabinFields.values.length; c++) {
        switch (marketingCabinFields.values[c].value) {
            case "P":
                marketingCabinFields.values[c].label = "Primera Premiun";
                break;
            case "F":
                marketingCabinFields.values[c].label = "Primera";
                break;
            case "J":
                marketingCabinFields.values[c].label = "Negocios Premium";
                break;
            case "C":
                marketingCabinFields.values[c].label = "Economica Premium";
                break;
            case "Y":
                marketingCabinFields.values[c].label = "Economica";
                break;

            default:

        }

    }

};

/**
 * Obtiene las opciones de cada filtro
 * @param {Object} arraySearch
 * @returns {Object}
 */
flights.Results.prototype.setObjectValuesAndCount_ = function (obj) {
    var values = new Array();
    var count = 0;
    for (var key in obj) {
        obj[key].count = obj[key].clusters.length;
        values.push(obj[key]);
        count += obj[key].count;
    }
    obj.count = count;
    obj.values = values;
};

/**
 * Obtiene un arreglo con los ids que cumplen con las condiciones de los filtros
 * @returns {Array<string>}
 */
flights.Results.prototype.getSearchForFilterResults_ = function () {

    //debugger;

    var idsFilters = new Array();
    //almacenamos los ids
    for (c = 0; c < this.currentFilters_.length; c++) {
        var tmpArray = [];
        for (var d = 0; d < this.currentFilters_[c].values.length; d++) {
            var value = this.currentFilters_[c].values[d].value;
            if (typeof this.filterOptions_[this.currentFilters_[c].type][value] !== "undefined") {
                tmpArray = goog.array.concat(tmpArray, this.filterOptions_[this.currentFilters_[c].type][value].clusters);
                this.filterOptions_[this.currentFilters_[c].type][value].checked = true;
            } else {
                this.filterOptions_[this.currentFilters_[c].type][value].checked = false;
            }
        }
        idsFilters.push({ type: this.currentFilters_[c].type, values: tmpArray });
    }

    //comparamos el primer arreglo con los demas
    var idsFound = new Array();
    for (var k = 0; k < idsFilters.length; k++) {
        for (var n = 0; n < idsFilters[k].values.length; n++) {
            var value = idsFilters[k].values[n];
            var founded = 0;
            for (var m = 0; m < idsFilters.length; m++) {
                if (idsFilters[m].values.indexOf(value) !== -1) {
                    founded++;
                }
            }
            if (founded >= idsFilters.length && idsFound.indexOf(value) === -1) {
                idsFound.push(value);
            }
        }
    }

    //si no hay filtros activos deschequeamos todo y retornamos un arreglo vacio
    if (this.currentFilters_.length === 0) {
        for (var key in this.filterOptions_) {
            for (var i = 0; i < this.filterOptions_[key].values.length; i++) {
                this.filterOptions_[key].values[i].checked = false;
                this.filterOptions_[key].values[i].disabled = false;
                this.filterOptions_[key].values[i].count = this.filterOptions_[key].values[i].clusters.length;
            }
        }
        return new Array();
    }

    //deschequeamos todas las opciones y bloqueamos los checks    
    for (var key in this.filterOptions_) {
        for (var i = 0; i < this.filterOptions_[key].values.length; i++) {
            this.filterOptions_[key].values[i].checked = false;
            this.filterOptions_[key].values[i].disabled = true;
            this.filterOptions_[key].values[i].count = 0;
        }
    }

    //chequeamos las opciones , que cumplen con las condiciones
    for (var c = 0; c < this.currentFilters_.length; c++) {
        var typeFilter = this.currentFilters_[c].type;
        for (var k = 0; k < this.currentFilters_[c].values.length; k++) {
            var value = this.currentFilters_[c].values[k].value;
            for (var i = 0; i < this.filterOptions_[typeFilter].values.length; i++) {
                if (this.filterOptions_[typeFilter].values[i].value === value) {
                    this.filterOptions_[typeFilter].values[i].checked = true;
                }
            }
        }
    }

    //deshabilitamos las opciones que no tengan clusters asociados segun los filtros
    for (var c = 0; c < idsFound.length; c++) {
        var idCluster = idsFound[c];
        for (var keyFilter in this.filterOptions_) {
            for (var i = 0; i < this.filterOptions_[keyFilter].values.length; i++) {
                if (this.filterOptions_[keyFilter].values[i].clusters.indexOf(idCluster) !== -1) {
                    this.filterOptions_[keyFilter].values[i].disabled = false;
                    this.filterOptions_[keyFilter].values[i].count++;// = this.filterOptions_[keyFilter].values[i].clusters.length;
                }
            }
        }
    }

    return idsFound;
};

/**
 * Registramos el modulo.
 */
moduleManager.setLoaded('flights_results');