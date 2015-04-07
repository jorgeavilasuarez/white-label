goog.provide("hotels.Search");
goog.require("goog.ui.Component");
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.i18n.DateTimeParse');
goog.require('goog.ui.ac');
goog.require('goog.ui.InputDatePicker');
goog.require('goog.i18n.DateTimeSymbols_es_CO');
goog.require('hotels.template.search');
goog.require("goog.dom.forms");
goog.require("goog.net.Jsonp");

goog.require('goog.module.BaseModule');
goog.require('goog.module.ModuleInfo');
goog.require('goog.module.ModuleManager');
goog.require('goog.module.ModuleLoader');

//var moduleManager = goog.module.ModuleManager.getInstance();
//var moduleLoader = new goog.module.ModuleLoader();
//moduleManager.setLoader(moduleLoader);
//moduleLoader.setDebugMode(true);
//moduleManager.setAllModuleInfo(goog.global['PLOVR_MODULE_INFO']);
//moduleManager.setModuleUris(goog.global['PLOVR_MODULE_URIS']);

/**
 * @define {string}  URL_SEARCHIE Whether logging should be enabled. 
 */
var URL_SEARCHIE = "http://localhost:8080/";
/**
 * @define {string}  URL_SEARCHV2 Whether logging should be enabled. 
 */
var URL_SEARCHV2 = "http://localhost:8080/";

var PATTERN = "MM'/'dd'/'yyyy";
var formatter = new goog.i18n.DateTimeFormat(PATTERN);
var parser = new goog.i18n.DateTimeParse(PATTERN);
var token = null;

/**
 * realiza la busqueda de vuelos
 * @constructor 
 * @extends {goog.ui.Component}
 */
hotels.Search = function () {
    goog.ui.Component.call(this);
};

goog.inherits(hotels.Search, goog.ui.Component);
/**
 * Creates an initial DOM representation for the component.
 * @override
 */
hotels.Search.prototype.createDom = function () {
    goog.base(this, 'createDom');
    this.setId("TCSearch");
    this.SetIDs();
    var element_ = this.getElement();
    element_.innerHTML = hotels.template.search.searchForm({ ids: this.ids }, null);
};
hotels.Search.prototype.SetIDs = function () {
    this.ids = this.makeIds({
        frmAir: "frmAir",
        modal_vuelos: "modal_air",
        txtMultiO1: "txtMultiO1",
        txtMultiD1: "txtMultiD1",
        txtDateMultiO1: "txtDateMultiO1",
        txtVDateMultiD1: "txtVDateMultiD1",
        txtMultiO2: "txtMultiO2",
        txtMultiD2: "txtMultiD2",
        txtDateMultiO2: "txtDateMultiO2",
        txtMultiO3: "txtMultiO3",
        txtMultiD3: "txtMultiD3",
        txtDateMultiO3: "txtDateMultiO3",
        txtMultiO4: "txtMultiO4",
        txtMultiD4: "txtMultiD4",
        txtDateMultiO4: "txtDateMultiO4",
        ddlMultiAdults: "ddlMultiAdults",
        ddlMultiChildren: "ddlMultiChildren",
        ddlMultiInfants: "ddlMultiInfants",
        rblMultiStop: "rblMultiStop",
        ddlClassMulti: "ddlClassMulti",
        ddlMultiAge1: "ddlMultiAge1",
        ddlMultiMonths1: "ddlMultiMonths1",
        ddlMultiAge2: "ddlMultiAge2",
        ddlMultiMonths2: "ddlMultiMonths2",
        ddlMultiAge3: "ddlMultiAge3",
        ddlMultiMonths3: "ddlMultiMonths3",
        ddlMultiAge4: "ddlMultiAge4",
        ddlMultiMonths4: "ddlMultiMonths4",
        ddlMultiAge5: "ddlMultiAge5",
        ddlMultiMonths5: "ddlMultiMonths5",
        ddlMultiAge6: "ddlMultiAge6",
        ddlMultiMonths6: "ddlMultiMonths6",
        vuelos: "vuelos",
        autos: "autos",
        hoteles: "hoteles",
        livuelos: "livuelos",
        liautos: "liautos",
        lihoteles: "lihoteles",
        modal_vuelos_0: "modal_vuelos_0",
        modal_vuelos_1: "modal_vuelos_1",
        modal_vuelos_2: "modal_vuelos_2",
        vuelos_solo_ida: "vuelos_solo_ida",
        vuelos_ida_vuelta: "vuelos_ida_vuelta",
        vuelos_ida_vuelta_t: "vuelos_ida_vuelta_t",
        vuelos_multi_destinos: "vuelos_multi_destinos",
        agregarOcultar1: "agregarOcultar1",
        agregarOcultar2: "agregarOcultar2",
        agregarOcultar3: "agregarOcultar3",
        agregarOcultar4: "agregarOcultar4",
        vuelos_multi_destino4: "vuelos_multi_destino4",
        vuelos_multi_destino3: "vuelos_multi_destino3",
        cmbHabitaciones: "cmbHabitaciones",
        lbMultidestino: "lbMultidestino"
    });
};
hotels.Search.prototype.createCortinilla = function () {
    this.dialogo = goog.dom.createDom(goog.dom.TagName.DIV, { "style": "display:none;", "class": goog.getCssName("dialogo") });
    var div1 = goog.dom.createDom(goog.dom.TagName.DIV, { "class": goog.getCssName("ui-widget-overlay"), "style": "display:block;" });
    var div2 = goog.dom.createDom(goog.dom.TagName.DIV, { "class": goog.getCssName("css ui-dialog;"), "style": "display:block;" });
    this.imgCortinilla = goog.dom.createDom(goog.dom.TagName.IMG, { "id": "img_cortinilla", "src": "http://search.technocloud.com.co/static/images/spinners.gif" });
    goog.dom.appendChild(this.dialogo, div1);
    goog.dom.appendChild(this.dialogo, this.imgCortinilla);
    goog.dom.appendChild(div1, div2);
    goog.dom.appendChild(document.body, this.dialogo);
};
hotels.Search.prototype.token = null;
/**
 * Called when component's element is known to be in the document.
 * @override
 */
hotels.Search.prototype.enterDocument = function () {
    goog.base(this, 'enterDocument');
    if (!goog.DEBUG) {
        //this.setConfiguration();
        this.onCssLoaded(MODULE_HOTELS_SEARCH_CSS);
    }

    this.createCortinilla();
    this.cortinilla = this.dialogo;
    this.img_cortinilla = this.imgCortinilla;
    //this.txtMultiO1 = goog.dom.getElement(this.ids.txtMultiO1);
    this.txtMultiD1 = goog.dom.getElement(this.ids.txtMultiD1);
    //this.getHandler().listen(this.txtMultiO1, goog.events.EventType.FOCUS, function (e) {
    //    e.currentTarget.value = "";
    //    //e.currentTarget.setSelectionRange(0,   e.currentTarget.value.length)
    //    ////debugger;
    //});
    this.getHandler().listen(this.txtMultiD1, goog.events.EventType.FOCUS, function (e) {
        e.currentTarget.value = "";
        //e.currentTarget.select();
        //e.currentTarget.setSelectionRange(0,   e.currentTarget.value.length)
        ////debugger;
    });
    this.txtFechaMultiO1 = goog.dom.getElement(this.ids.txtDateMultiO1);
    this.txt2VFechaMulti = goog.dom.getElement(this.ids.txtVDateMultiD1);
    //this.txtMultiO1.value = "BOG Bogota (Eldorado) Colombia";
    //this.txtMultiD1.value = "MDE Medellin (José María Cordova) Colombia";
    //    this.txtFechaMultiO1.value = "11/04/2014";
    //    this.txt2VFechaMulti.value = "11/12/2014";


    this.getHandler().listen(this.txtFechaMultiO1, goog.events.EventType.FOCUS, function (e) {
        this.dp_txtFechaMultiO1.showForElement(e.currentTarget);
        ////debugger;
    });
    this.getHandler().listen(this.txt2VFechaMulti, goog.events.EventType.FOCUS, function (e) {
        this.dp_txtFechaMultiO1.showForElement(e.currentTarget);
        ////debugger;
    });
    this.txtFechaMultiO2 = goog.dom.getElement(this.ids.txtDateMultiO2);
    this.txtFechaMultiO3 = goog.dom.getElement(this.ids.txtDateMultiO3);
    this.txtFechaMultiO4 = goog.dom.getElement(this.ids.txtDateMultiO4);
    //debugger;
    this.frmAir = goog.dom.getElement(this.ids.frmAir);
    this.vuelos = goog.dom.getElement(this.ids.vuelos);
    //    this.autos = goog.dom.getElement(this.ids.autos);
    //    this.hoteles = goog.dom.getElement(this.ids.hoteles);
    //this.livuelos = goog.dom.getElement(this.ids.livuelos);
    //    this.liautos = goog.dom.getElement(this.ids.liautos);
    //    this.lihoteles = goog.dom.getElement(this.ids.lihoteles);

    //this.getHandler().listen(this.livuelos, goog.events.EventType.CLICK, goog.bind(this.onClickOnSelectedTab, this));
    //    this.getHandler().listen(this.liautos, goog.events.EventType.CLICK, goog.bind(this.onClickOnSelectedTab, this));
    //    this.getHandler().listen(this.lihoteles, goog.events.EventType.CLICK, goog.bind(this.onClickOnSelectedTab, this));

    this.btn_buscar_ = goog.dom.getElement(this.ids.lbMultidestino);
    this.getHandler().listen(this.btn_buscar_, goog.events.EventType.CLICK, goog.bind(this.onBuscarClick_, this));
    this.setDatePickers();
    //this.modal_vuelos_0 = goog.dom.getElement(this.ids.modal_vuelos_0);
    //this.modal_vuelos_1 = goog.dom.getElement(this.ids.modal_vuelos_1);
    //this.modal_vuelos_2 = goog.dom.getElement(this.ids.modal_vuelos_2);
    //this.tabvuels_solo_ida = goog.dom.getElement(this.ids.vuelos_solo_ida);
    //this.tabvuelos_ida_vuelta = goog.dom.getElement(this.ids.vuelos_ida_vuelta);
    //this.tabvuelos_ida_vuelta_t = goog.dom.getElement(this.ids.vuelos_ida_vuelta_t);
    //this.tabvuelos_multi_destinos = goog.dom.getElement(this.ids.vuelos_multi_destinos);
    this.ddlMultiAdults = goog.dom.getElement(this.ids.ddlMultiAdults);
    this.ddlMultiNinios = goog.dom.getElement(this.ids.ddlMultiChildren);
    this.ddlMultiBebes = goog.dom.getElement(this.ids.ddlMultiInfants);
    this.getHandler().listen(this.ddlMultiNinios, goog.events.EventType.CHANGE, goog.bind(this.onChangedropdownlistMultiEdades, this));
    this.getHandler().listen(this.ddlMultiBebes, goog.events.EventType.CHANGE, goog.bind(this.onChangedropdownlistMultiEdades, this));
    //this.getHandler().listen(this.modal_vuelos_0, goog.events.EventType.CLICK, goog.bind(this.onClickRadiosModalidadVuelos, this));
    //this.getHandler().listen(this.modal_vuelos_1, goog.events.EventType.CLICK, goog.bind(this.onClickRadiosModalidadVuelos, this));
    //this.getHandler().listen(this.modal_vuelos_2, goog.events.EventType.CLICK, goog.bind(this.onClickRadiosModalidadVuelos, this));
    //this.agregarOcultar1 = goog.dom.getElement(this.ids.agregarOcultar1);
    //this.agregarOcultar2 = goog.dom.getElement(this.ids.agregarOcultar2);
    //this.agregarOcultar3 = goog.dom.getElement(this.ids.agregarOcultar3);
    //this.agregarOcultar4 = goog.dom.getElement(this.ids.agregarOcultar4);
    //this.vuelos_multi_destino4 = goog.dom.getElement(this.ids.vuelos_multi_destino4);
    //this.vuelos_multi_destino3 = goog.dom.getElement(this.ids.vuelos_multi_destino3);
    //this.getHandler().listen(this.agregarOcultar1, goog.events.EventType.CLICK, goog.bind(this.onClickAgregarQuitarMultiplesDestinos, this));
    //this.getHandler().listen(this.agregarOcultar2, goog.events.EventType.CLICK, goog.bind(this.onClickAgregarQuitarMultiplesDestinos, this));
    //this.getHandler().listen(this.agregarOcultar3, goog.events.EventType.CLICK, goog.bind(this.onClickAgregarQuitarMultiplesDestinos, this));
    //this.getHandler().listen(this.agregarOcultar4, goog.events.EventType.CLICK, goog.bind(this.onClickAgregarQuitarMultiplesDestinos, this));
    this.cantidad_Habitaciones_Visibles = 1;
    //    this.dropdownlist_Habitaciones_Hoteles = goog.dom.getElement(this.ids.cmbHabitaciones);
    //    this.getHandler().listen(this.dropdownlist_Habitaciones_Hoteles, goog.events.EventType.CHANGE, goog.bind(this.onChangedropdownlist_Habitaciones_Hoteles, this));
    this.onIataCodesLoaded(CITYS);
};
/**
 * Oculta o muestra las habitaciones.
 * @param {object} event 
 */
hotels.Search.prototype.onChangedropdownlist_Habitaciones_Hoteles = function (event) {

    var objeto = event.currentTarget;
    var cantidad = parseInt(objeto.value);
    var fila_habitaciones = goog.dom.getElementsByClass("fila");
    for (var c = 0; c < fila_habitaciones.length; c++) {
        fila_habitaciones[c].style.display = "none";
    }

    for (var c = 0; c < cantidad; c++) {
        fila_habitaciones[c].style.display = "block";
    }
};
/**
 * Cambia de tabs
 * @param {object} event 
 */
hotels.Search.prototype.onClickOnSelectedTab = function (event) {
    ////debugger;
    var objeto = event.currentTarget;
    if (objeto.id === this.ids['livuelos']) {
        this.vuelos.style.display = 'block';
        this.autos.style.display = 'none';
        this.hoteles.style.display = 'none';
    } else if (objeto.id === this.ids['liautos']) {
        this.vuelos.style.display = 'none';
        this.autos.style.display = 'block';
        this.hoteles.style.display = 'none';
    } else if (objeto.id === this.ids['lihoteles']) {
        this.vuelos.style.display = 'none';
        this.autos.style.display = 'none';
        this.hoteles.style.display = 'block';
    }
};
/**
 * Agrega u oculta los multiples destinos.
 * @param {object} event 
 */
hotels.Search.prototype.onClickAgregarQuitarMultiplesDestinos = function (event) {
    var objeto = event.currentTarget;
    if (objeto.id === this.ids.agregarOcultar1) {
        this.vuelos_multi_destino3.style.display = 'block';
        this.agregarOcultar2.style.display = 'block';
        this.agregarOcultar3.style.display = 'block';
        this.agregarOcultar1.style.display = 'none';
    } else if (objeto.id === this.ids.agregarOcultar2) {
        this.vuelos_multi_destino4.style.display = 'block';
        this.agregarOcultar4.style.display = 'block';
        this.agregarOcultar2.style.display = 'none';
        this.agregarOcultar3.style.display = 'none';
    } else if (objeto.id === this.ids.agregarOcultar3) {
        this.agregarOcultar1.style.display = 'block';
        this.vuelos_multi_destino4.style.display = 'none';
        this.vuelos_multi_destino3.style.display = 'none';
        this.agregarOcultar2.style.display = 'none';
        this.agregarOcultar3.style.display = 'none';
    } else if (objeto.id === this.ids.agregarOcultar4) {
        this.agregarOcultar2.style.display = 'block';
        this.agregarOcultar3.style.display = 'block';
        this.vuelos_multi_destino4.style.display = 'none';
        this.agregarOcultar4.style.display = 'none';
    }
};
/**
 * Cambia la modalidad del buscador de vuelos.
 * @param {object} event 
 */
hotels.Search.prototype.onClickRadiosModalidadVuelos = function (event) {

    this.intTabModalidadVuelos = event.currentTarget.id;
    /*IDA Y VUELTA*/
    if (this.intTabModalidadVuelos === this.ids.modal_vuelos_0) {
        this.tabvuels_solo_ida.style.display = "block";
        this.tabvuelos_ida_vuelta.style.display = "block";
        this.tabvuelos_ida_vuelta_t.style.display = "block";
        this.tabvuelos_multi_destinos.style.display = "none";
    }/*SOLO IDA*/
    else if (this.intTabModalidadVuelos === this.ids.modal_vuelos_1) {
        this.tabvuels_solo_ida.style.display = "block";
        this.tabvuelos_ida_vuelta.style.display = "none";
        this.tabvuelos_ida_vuelta_t.style.display = "none";
        this.tabvuelos_multi_destinos.style.display = "none";
    }/*MULTIDESTINOS*/
    else if (this.intTabModalidadVuelos === this.ids.modal_vuelos_2) {
        this.tabvuels_solo_ida.style.display = "block";
        this.tabvuelos_ida_vuelta.style.display = "none";
        this.tabvuelos_ida_vuelta_t.style.display = "none";
        this.tabvuelos_multi_destinos.style.display = "block";
    }
};
/**
 * Inicializa los datepickers del buscador. 
 */
hotels.Search.prototype.setDatePickers = function () {

    goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_CO;
    var PATTERN = "MM'/'dd'/'yyyy";
    var formatter = new goog.i18n.DateTimeFormat(PATTERN);
    var parser = new goog.i18n.DateTimeParse(PATTERN);
    this.dp_txtFechaMultiO1 = new goog.ui.InputDatePicker(formatter, parser);
    this.dp_txtFechaMultiO1.decorate(this.txtFechaMultiO1);
    this.dp_txtFechaMultiO1.setDate(new Date());
    this.dp_txt2VFechaMulti = new goog.ui.InputDatePicker(formatter, parser);
    this.dp_txt2VFechaMulti.decorate(this.txt2VFechaMulti);
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    this.dp_txt2VFechaMulti.setDate(tomorrow);
    this.dp_txtFechaMultiO2 = new goog.ui.InputDatePicker(formatter, parser);
    this.dp_txtFechaMultiO2.decorate(this.txtFechaMultiO2);
    this.dp_txtFechaMultiO3 = new goog.ui.InputDatePicker(formatter, parser);
    this.dp_txtFechaMultiO3.decorate(this.txtFechaMultiO3);
    this.dp_txtFechaMultiO4 = new goog.ui.InputDatePicker(formatter, parser);
    this.dp_txtFechaMultiO4.decorate(this.txtFechaMultiO4);
    /*
     this.txtCarFechaRecoge = goog.dom.getElement(this.ids['txtCarFechaRecoge']);
     this.dp_txtCarFechaRecoge = new goog.ui.InputDatePicker(formatter, parser);
     this.dp_txtCarFechaRecoge.decorate(this.txtCarFechaRecoge);
     this.txt2CFechaEntrega = goog.dom.getElement(this.ids['txt2CFechaEntrega']);
     this.dp_txt2CFechaEntrega = new goog.ui.InputDatePicker(formatter, parser);
     this.dp_txt2CFechaEntrega.decorate(this.txt2CFechaEntrega);
     this.txtFechaIngreso = goog.dom.getElement(this.ids['txtFechaIngreso']);
     this.dp_txtFechaIngreso = new goog.ui.InputDatePicker(formatter, parser);
     this.dp_txtFechaIngreso.decorate(this.txtFechaIngreso);
     this.txt2HFechaSalida = goog.dom.getElement(this.ids['txt2HFechaSalida']);
     this.dp_txt2HFechaSalida = new goog.ui.InputDatePicker(formatter, parser);
     this.dp_txt2HFechaSalida.decorate(this.txt2HFechaSalida);*/


};
/**
 *  Cuando carga los stilos css.
 *  @param {Object} datos objeto datos.
 */
hotels.Search.prototype.onCssLoaded = function (datos) {
    goog.style.installStyles(datos);
};
/**
 * Se ejecuta cuando carga el archivo de ciudades, para inicializar los autocompletes.
 * @param {object} datos 
 */
hotels.Search.prototype.onIataCodesLoaded = function (datos) {
    //debugger;
    var iata_codes = datos;
    //this.act_xt_Multi_O1 = goog.ui.ac.createSimpleAutoComplete(iata_codes, document.getElementById(this.ids.txtMultiO1), false, false);
    this.ac_txt_Multi_D1 = goog.ui.ac.createSimpleAutoComplete(iata_codes, document.getElementById(this.ids.txtMultiD1), false, false);
    //this.ac_txt_Multi_O2 = goog.ui.ac.createSimpleAutoComplete(iata_codes, document.getElementById(this.ids.txtMultiO2), false, false);
    //this.ac_txt_Multi_D2 = goog.ui.ac.createSimpleAutoComplete(iata_codes, document.getElementById(this.ids.txtMultiD2), false, false);
    //this.ac_txt_Multi_O3 = goog.ui.ac.createSimpleAutoComplete(iata_codes, document.getElementById(this.ids.txtMultiO3), false, false);
    //this.ac_txt_Multi_D3 = goog.ui.ac.createSimpleAutoComplete(iata_codes, document.getElementById(this.ids.txtMultiD3), false, false);
    //this.ac_txt_Multi_O4 = goog.ui.ac.createSimpleAutoComplete(iata_codes, document.getElementById(this.ids.txtMultiO4), false, false);
    //this.ac_txt_Multi_D4 = goog.ui.ac.createSimpleAutoComplete(iata_codes, document.getElementById(this.ids.txtMultiD4), false, false);
    /*
     this.txtCarCiudRecoge = goog.ui.ac.createSimpleAutoComplete(iata_codes, document.getElementById(this.ids['txtCarCiudRecoge']), false, false);
     this.txtCarCiudEntrega = goog.ui.ac.createSimpleAutoComplete(iata_codes, document.getElementById(this.ids['txtCarCiudEntrega']), false, false);
     this.txtCiudadDestino = goog.ui.ac.createSimpleAutoComplete(iata_codes, document.getElementById(this.ids['txtCiudadDestino']), false, false);
     */


};
/**
 * Called when component's element is known to have been removed from the
 * document.
 * @override
 */
hotels.Search.prototype.exitDocument = function () {
    //this.setDisplayChild("block");
    goog.base(this, 'exitDocument');
};
/**
 * click boton buscar de vuelos.
 * @param {Object} event evento click.
 */
hotels.Search.prototype.onBuscarClick_ = function (event) {


    //if (goog.string.isEmpty(this.txtMultiO1.value)) {
    //    this.txtMultiO1.focus();
    //    return false;
    //}

    if (goog.string.isEmpty(this.txtMultiD1.value)) {
        this.txtMultiD1.focus();
        return false;
    }

    //if (this.txtMultiO1.value === this.txtMultiD1.value) {
    //    alert("Seleccione destinos diferentes");
    //    return false;
    //}

    if (goog.string.isEmpty(this.txtFechaMultiO1.value)) {
        this.txtFechaMultiO1.focus();
        this.dp_txtFechaMultiO1.showForElement(this.txtFechaMultiO1);
        return false;
    }

    //if (!this.modal_vuelos_1.checked) {
    //    if (goog.string.isEmpty(this.txt2VFechaMulti.value)) {
    //        this.txt2VFechaMulti.focus();
    //        this.dp_txt2VFechaMulti.showForElement(this.txt2VFechaMulti);
    //        return false;
    //    }
    //}

    //if (this.dp_txtFechaMultiO1.getDate().date > this.dp_txt2VFechaMulti.getDate().date) {
    //    alert("La fecha de regreso no puede ser menor");
    //    return false;
    //}

    this.dataResults = null;
    this.token = '';
    this.cortinilla.style.display = "block";
    var dataMapForm = goog.dom.forms.getFormDataMap(this.frmAir);
    var keys = dataMapForm.getKeys();
    var dataPayload = new Object();
    for (c = 0; c < keys.length; c++) {
        dataPayload[keys[c]] = dataMapForm.get(keys[c])[0];
    }
    //debugger;
    this.passenger = [
        { Type: "Adulto", Cant: parseInt(this.ddlMultiAdults.value) },
        { Type: "Niño", Cant: parseInt(this.ddlMultiNinios.value) },
        { Type: "Baby", Cant: parseInt(this.ddlMultiBebes.value) }
    ];
    this.searchParams = dataPayload;


    if (typeof (window["EventSource"]) !== "undefined") {
        //this.Searchhotels(dataPayload);
        //debugger;
        this.SearchhotelsIE(dataPayload);
    } else {
        this.SearchhotelsIE(dataPayload);
    }
};
/**
 * oculta o muestra los dropdownlist de edades de niños e infantes.
 * @param {object} event 
 */
hotels.Search.prototype.onChangedropdownlistMultiEdades = function (event) {
    var objeto = event.currentTarget;
    var strnombre = objeto.name;
    if (strnombre === this.ddlMultiNinios.name) {
        this.ocultarEdadesNinos();
    }
    else if (strnombre === this.ddlMultiBebes.name) {
        this.ocultarEdadesBebes();
    }
};
/**
 * Oculta edades de los niños. 
 */
hotels.Search.prototype.ocultarEdadesNinos = function () {
    try {
        var Campo = this.ids.ddlMultiChildren;
        var Selec = document.getElementById(Campo).value;
        var k = 1;
        var i = 1;
        while (k <= 6) {
            var dato = this.getId() + ".ddlMultiAge" + k;
            var filaEdad = document.getElementById(dato);
            filaEdad.style.display = "none";
            k++;
        }

        while (i <= Selec) {
            var dato = this.getId() + ".ddlMultiAge" + i;
            var filaEdad = document.getElementById(dato);
            if (filaEdad.style.display === "none") {
                filaEdad.style.display = "";
            }
            i++;
        }

    } catch (ex) {
    }
};
/**
 * Oculta edades de los bebes. 
 */
hotels.Search.prototype.ocultarEdadesBebes = function () {
    try {
        var Campo = this.ids.ddlMultiInfants;
        var Selec = document.getElementById(Campo).value;
        var k = 1;
        var i = 1;
        while (k <= 6) {
            var dato = this.getId() + ".ddlMultiMonths" + k;
            var filaEdad = document.getElementById(dato);
            filaEdad.style.display = "none";
            k++;
        }

        while (i <= Selec) {
            var dato = this.getId() + ".ddlMultiMonths" + i;
            var filaEdad = document.getElementById(dato);
            if (filaEdad.style.display === "none") {
                filaEdad.style.display = "";
            }
            i++;
        }

    } catch (ex) {
    }
};


hotels.Search.prototype.createContainer = function (e) {
    this.container = goog.dom.createDom(goog.dom.TagName.DIV, { "class": goog.getCssName("container_general") });
    //var div1 = goog.dom.createDom(goog.dom.TagName.DIV, { "class": goog.getCssName("ui-widget-overlay"), "style": "display:block;" });
    //var div2 = goog.dom.createDom(goog.dom.TagName.DIV, { "class": goog.getCssName("css ui-dialog;"), "style": "display:block;" });
    //this.imgCortinilla = goog.dom.createDom(goog.dom.TagName.IMG, { "id": "img_cortinilla", "src": "http://search.technocloud.com.co/static/images/spinners.gif" });
    //goog.dom.appendChild(this.dialogo, div1);
    //goog.dom.appendChild(this.dialogo, this.imgCortinilla);
    //goog.dom.appendChild(div1, div2);
    goog.dom.appendChild(document.body, this.container);
    return this.container;
};

/**
 *  @param {Object} e objeto.
 */
hotels.Search.prototype.OnModuleResultsLoaded = function (e) {
    //debugger;

    debugger;
    if (typeof (this.objresultados) !== "undefined") {
        this.objresultados.dispose();
    }
    var widget_app_technocloud = goog.dom.getElement("widget_app_technocloud");
    var data_selector = widget_app_technocloud.getAttribute("data-target");
    //debugger;

    this.objRender = goog.dom.getElement(data_selector);
    if (this.objRender === null) {
        this.objRender = this.createContainer();
    }
    //debugger;
    /*instaciamos los resultados*/
    this.objresultados = new hotels.Results(null, this.passenger, this.cortinilla, this);
    //if (this.objRender !== null) {
    //this.setDisplayChild("none");
    this.objresultados.render(this.objRender);
    //} else {
    //    this.objresultados.render();
    //}


    /*renderizamos el objecto de los resultados*/
    for (var c = 0, max = 20; c < max; c++) {

        //tcAirSearchRSField[c]["id"] = this.makeId(c);
        //tcAirSearchRSField[c]["position"] = c;
        this.objresultados.renderOne(null);
    }

    this.objresultados.addEvents();

    this.cortinilla.style.display = "none";
    if (goog.DEBUG) {
        this.cortinilla.style.display = "none";
    } else {
        //this.objresultados.getContentElement().style.display = "none";
    }

    /*ajustamos el scroll a los resultados*/
    //window.scrollTo(0, goog.style.getPageOffsetTop(this.objresultados.getElement()));

    //this.cortinilla.style.display = "none";
    //    this.objresultados = new hotels.Results(this.dataResults);
    //    this.objresultados.render();
};
/**
 * Busca vuelos
 * @param {type} token
 * @returns {undefined}
 */
hotels.Search.prototype.Searchhotels = function (strDataForm) {
    var queryData = goog.Uri.QueryData.createFromMap(strDataForm);
    var urlSearch = new goog.Uri(URL_SEARCHV2);
    urlSearch.setQueryData(queryData);
    var source = new EventSource(urlSearch.toString());
    this.count = 0;

    source.onmessage = goog.bind(function (event) {

        this.cortinilla.style.display = "none";
        if (event.data === "") {
            event.currentTarget.close();
            alert("No se encontraron resultados para la busqueda intente de nuevo");
            this.cortinilla.style.display = "none";
            return false;
        }
        if (event.data === "EOF") {
            event.currentTarget.close();
            this.objresultados.setFilterOptions(this.objresultados.arrResults["DO_tcAirSearchRSJS"]["tcAirSearchRSField"]);
            this.objresultados.renderFilters();
            this.objresultados.setFilterResults(this.objresultados.arrResults["DO_tcAirSearchRSJS"]["tcAirSearchRSField"]);
            this.count = 0;
            this.objresultados.addEvents();
            return false;
        }
        var tcAirSearchRSField = JSON.parse(event.data);
        tcAirSearchRSField["id"] = this.makeId(this.count);
        tcAirSearchRSField["position"] = this.count;
        this.objresultados.renderOne(tcAirSearchRSField);

        this.objresultados.arrResults["DO_tcAirSearchRSJS"]["tcAirSearchRSField"].push(tcAirSearchRSField);
        this.count++;
        if (this.count !== 0) {
            this.objresultados.getContentElement().style.display = "block";
        }
    }, this);

    moduleManager.execOnLoad('hotels_results', goog.bind(this.OnModuleResultsLoaded, this));
};

hotels.Search.prototype.SearchhotelsIE = function (strDataForm) {

    //var jsonpSearch = new goog.net.Jsonp(URL_SEARCHIE);
    //jsonpSearch.setRequestTimeout(-1);

    //jsonpSearch.send(strDataForm, goog.bind(function (obj) {

    //    this.objresultados.arrResults = obj;
    //    this.cortinilla.style.display = "none";

    //    if (this.objresultados.arrResults["DO_tcAirSearchRSJS"]["tcAirSearchRSField"] === null) {
    //        alert("No se encontraron resultados para la busqueda intente de nuevo");
    //        return false;
    //    }

    //    this.objresultados.getContentElement().style.display = "block";
    //    var tcAirSearchRSField = this.objresultados.arrResults["DO_tcAirSearchRSJS"]["tcAirSearchRSField"];
    //for (var c = 0, max = 20; c < max; c++) {

    //    //tcAirSearchRSField[c]["id"] = this.makeId(c);
    //    //tcAirSearchRSField[c]["position"] = c;
    //    this.objresultados.renderOne(null);
    //}
    //    this.objresultados.setFilterOptions(tcAirSearchRSField);
    //    this.objresultados.renderFilters();
    //    this.objresultados.setFilterResults(tcAirSearchRSField);
    //    this.objresultados.addEvents();

    //}, this));
    moduleManager.execOnLoad('hotels_results', goog.bind(this.OnModuleResultsLoaded, this));
};

hotels.Search.prototype.setConfiguration = function () {

    var widget_app_technocloud = goog.dom.getElement("widget_app_technocloud");
    var data_width = widget_app_technocloud.getAttribute("data-width");
    var data_top = widget_app_technocloud.getAttribute("data-top");
    var data_bg_color = widget_app_technocloud.getAttribute("data-bg-color");
    var data_text_color = widget_app_technocloud.getAttribute("data-text-color");

    /* COLORES */
    var strStyle = "." + goog.getCssName("background-color") + "{    " +
            "background-color: " + data_bg_color + " !important;" +
            " }" +
            "." + goog.getCssName("border-color") + "{" +
            "    border: 1px solid " + data_bg_color + " !important;" +
            "}" +
            "." + goog.getCssName("label-color") + "{" +
            "    color: " + data_text_color + " !important;" +
            "}" +
            "." + goog.getCssName("goog-date-picker") + "{" +
            "    background-color: " + data_bg_color + " !important;" +
            "    border: 1px solid " + data_text_color + " !important;" +
            "}" +
            "." + goog.getCssName("goog-date-picker") + "{" +
            "    background: " + data_bg_color + " !important;" +
            "}" +
            "." + goog.getCssName("goog-date-picker") + " th {" +
            "    font-size: .9em;" +
            "    color: " + data_text_color + " !important;" +
            "}" +
            "." + goog.getCssName("goog-date-picker") + " button {" +
            "    color: " + data_text_color + " !important;" +
            "    font-size: 20px;" +
            "    text-transform: uppercase;" +
            "}" +
            "." + goog.getCssName("text-color") + "{    " +
            "    color: " + data_text_color + " !important;" +
            "}" +
            "." + goog.getCssName("ux-common-main") + "{    " +
            "    width:" + data_width + " !important;" +
            "    top:" + data_top + " !important;" +
            "}";

    this.CONFIGURATION = goog.style.installStyles(strStyle);
};

hotels.Search.prototype.setDisplayChild = function (display) {
    if (typeof (this.objRender) !== "undefined") {
        for (var c = 0; c < this.objRender.childNodes.length; c++) {
            if (typeof (this.objRender.childNodes[c].style) !== "undefined") {
                this.objRender.childNodes[c].style.display = display;
            }
        }
    }
};


/**
 * Registramos el modulo.
 */
moduleManager.setLoaded('hotels_search');


this.objSearch = new hotels.Search();
this.objSearch.renderBefore(goog.dom.getElement("widget_app_technocloud"));