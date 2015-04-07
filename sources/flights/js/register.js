/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
goog.provide("flights.Register");
goog.require('flights.template.register');


/**
 * Clase que genera los resultados de vuelos
 * @constructor 
 * @extends  {goog.ui.Component}
 */
flights.Register = function (objResults, availability) {
    this.objResults = objResults;
    goog.ui.Component.call(this);
};

goog.inherits(flights.Register, goog.ui.Component);

/** @define {string}  URL_BOOKING Whether logging should be enabled. */
//var URL_BOOKING = "http://localhost:49815/site/booking.ashx";

var URL_BOOKING = "http://www.travelcloud.com.co/site/booking.ashx";

/** @define {string}  URL_PAY Whether logging should be enabled. */
var URL_PAY = "http://localhost:58243/site/gateway.aspx";

/** @define {string}  URL_CANCEL Whether logging should be enabled. */
var URL_CANCEL = "http://localhost:49815/site/cancel.ashx";


/**
 * Creates an initial DOM representation for the component.
 * @override
 */
flights.Register.prototype.createDom = function () {
    goog.base(this, 'createDom');

    //debugger;
    if (this.objResults.objSearch.objRender === null) {
        goog.dom.classes.add(this.getElement(), goog.getCssName("ux-common-main"));
    }

    this.segmentSelected = goog.array.find(this.objResults.getObjectResults()["DO_tcAirSearchRSJS"]["tcAirSearchRSField"], function (a, b, c) {
        return this.id === a.id;
    }, { "id": this.objResults.dataSelected });

    this.contenido = flights.template.register.register({ segmentSelected: this.segmentSelected });

    this.objResults.getElement().style.display = "none";
};
/**
 * Called when component's element is known to be in the document.
 * @override
 */
flights.Register.prototype.enterDocument = function () {
    goog.base(this, 'enterDocument');
    var elemento = this.getElement();
    elemento.innerHTML = this.contenido;

    if (!goog.DEBUG) {
        this.MODULE_REGISTER_CSS = goog.style.installStyles(MODULE_FLIGHTS_REGISTER_CSS);
    }

    this.btnreturnresults = goog.dom.getElementByClass(goog.getCssName("btnreturnresults"));
    goog.events.listen(this.btnreturnresults, goog.events.EventType.CLICK, goog.bind(function (e) {
        this.objResults.getElement().style.display = "block";
        this.dispose();
    }, this));

    //debugger;

    this.passengerInfo = new Array();
    for (var c = 0; c < this.objResults.passenger.length; c++) {
        for (var d = 0; d < this.objResults.passenger[c].Cant; d++) {
            this.passengerInfo.push({
                PassengerInfoId: this.makeId("PassengerInfo" + d),
                Type: this.objResults.passenger[c].Type,
                TypeDesc: this.objResults.passenger[c].Desc,
                FirstNameId: this.makeId("FistName" + d),
                FirstName: null,
                LastNameId: this.makeId("LastNameId" + d),
                LastName: null,
                DayId: this.makeId("DayId" + d),
                MonthId: this.makeId("MonthId" + d),
                YearId: this.makeId("YearId" + d),
                Day: null,
                Month: null,
                Year: null,
                GenreId: this.makeId("Genre" + d),
                Genre: null,
                DocumentTypeId: this.makeId("DocumentType" + d),
                DocumentType: null,
                DocumentNumberId: this.makeId("DocumentNumber" + d),
                DocumentNumber: null
            });
        }
    }
    //debugger;
    this.passengerInfoDiv = goog.dom.getElementByClass(goog.getCssName("reservaDatosPasajero"));
    this.passengerInfoDiv.innerHTML = flights.template.register.passengerInfo({ passengerInfo: this.passengerInfo });
    this.btnReserve = goog.dom.getElementByClass(goog.getCssName("btnSiguienteVuelosTarjeta"));

    /*subimos el scroll*/
    window.scrollTo(0, goog.style.getPageOffsetTop(this.getElement()));
    this.getHandler().listen(this.btnReserve, goog.events.EventType.CLICK, this.onReserveClick);
    this.chkAgree = goog.dom.getElementByClass(goog.getCssName("ReservaVuelos_cbAcepto"));


};
/**
 * Called when component's element is known to have been removed from the
 * document.
 * @override
 */
flights.Register.prototype.exitDocument = function () {
    goog.base(this, 'exitDocument');

    if (!goog.DEBUG) {
        goog.style.uninstallStyles(this.MODULE_REGISTER_CSS);
    }
};

flights.Register.prototype.onReserveClick = function () {
    //debugger;

    for (var c = 0; c < this.passengerInfo.length; c++) {
        var info = this.passengerInfo[c];
        var firstName = goog.dom.getElement(info.FirstNameId);
        var lastName = goog.dom.getElement(info.LastNameId);
        var documentNumber = goog.dom.getElement(info.DocumentNumberId);
        var documentType = goog.dom.getElement(info.DocumentTypeId);

        if (goog.string.isEmpty(firstName.value)) {
            firstName.focus();
            return false;
        }
        if (goog.string.isEmpty(lastName.value)) {
            lastName.focus();
            return false;
        }
        if (goog.string.isEmpty(documentNumber.value)) {
            documentNumber.focus();
            return false;
        }

        var day = goog.dom.getElement(info.DayId);
        var month = goog.dom.getElement(info.MonthId);
        var year = goog.dom.getElement(info.YearId);
        var genre = goog.dom.getElement(info.GenreId);

        this.passengerInfo[c].FirstName = firstName.value;
        this.passengerInfo[c].LastName = lastName.value;
        this.passengerInfo[c].DocumentNumber = documentNumber.value;
        this.passengerInfo[c].DocumentType = documentType.value;
        this.passengerInfo[c].Day = day.value;
        this.passengerInfo[c].Month = month.value;
        this.passengerInfo[c].Year = year.value;
        this.passengerInfo[c].Genre = genre.value;

        /*save data of passenger*/
        this.objResults.availability["DO_tcAirSearchRSJS"]["tcAirSearchRSField"][0]["tcPassengerFareUnitField"][c]["dateBirthField"] = this.passengerInfo[c].Year + "-" + this.passengerInfo[c].Month + "-" + this.passengerInfo[c].Day;
        this.objResults.availability["DO_tcAirSearchRSJS"]["tcAirSearchRSField"][0]["tcPassengerFareUnitField"][c]["documentField"] = this.passengerInfo[c].DocumentNumber;
        this.objResults.availability["DO_tcAirSearchRSJS"]["tcAirSearchRSField"][0]["tcPassengerFareUnitField"][c]["firstNameField"] = this.passengerInfo[c].FirstName;
        this.objResults.availability["DO_tcAirSearchRSJS"]["tcAirSearchRSField"][0]["tcPassengerFareUnitField"][c]["genderField"] = this.passengerInfo[c].Genre;
        this.objResults.availability["DO_tcAirSearchRSJS"]["tcAirSearchRSField"][0]["tcPassengerFareUnitField"][c]["firstSurnameField"] = this.passengerInfo[c].LastName;
        this.objResults.availability["DO_tcAirSearchRSJS"]["tcAirSearchRSField"][0]["tcPassengerFareUnitField"][c]["typeDocumentField"] = this.passengerInfo[c].DocumentType;
        this.objResults.availability["DO_tcAirSearchRSJS"]["tcAirSearchRSField"][0]["tcPassengerFareUnitField"][c]["typePassengerField"] = this.passengerInfo[c].Type;

    }

    //var txtNameContact = goog.dom.getElementByClass(goog.getCssName("txtNameContact"));
    var txtMailPersonal = goog.dom.getElementByClass(goog.getCssName("txtMailPersonal"));
    var txtTelefono = goog.dom.getElementByClass(goog.getCssName("txtTelefono"));
    var txtCiudad = goog.dom.getElementByClass(goog.getCssName("txtCiudad"));
    //var txtCountry = goog.dom.getElementByClass(goog.getCssName("txtCountry"));
    var txtCelular = goog.dom.getElementByClass(goog.getCssName("txtCelular"));
    var txtLastNameContact = goog.dom.getElementByClass(goog.getCssName("txtLastNameContact"));


    //this.passengerInfo[0].FirstName = firstName.value;
    //this.passengerInfo[0].LastName = lastName.value;
    /*save data from contact*/
    this.objResults.availability['DO_tcAirSearchRSJS']['tcAirSearchRSField'][0]['tcContactField']['emailField'] = txtMailPersonal.value;
    this.objResults.availability['DO_tcAirSearchRSJS']['tcAirSearchRSField'][0]['tcContactField']['celField'] = txtCelular.value;
    this.objResults.availability['DO_tcAirSearchRSJS']['tcAirSearchRSField'][0]['tcContactField']['cityField'] = txtCiudad.value;
    //this.objResults.availability['DO_tcAirSearchRSJS']['tcAirSearchRSField'][0]['tcContactField']['countryField'] = txtCountry.value;
    this.objResults.availability['DO_tcAirSearchRSJS']['tcAirSearchRSField'][0]['tcContactField']['phoneField'] = txtTelefono.value;
    this.objResults.availability['DO_tcAirSearchRSJS']['tcAirSearchRSField'][0]['tcContactField']['firstNameField'] = this.passengerInfo[0].FirstName; //txtNameContact.value;
    this.objResults.availability['DO_tcAirSearchRSJS']['tcAirSearchRSField'][0]['tcContactField']['firstSurnameField'] = this.passengerInfo[0].LastName; //txtLastNameContact.value;

    if (goog.string.isEmpty(txtMailPersonal.value)) {
        txtMailPersonal.focus();
        return false;
    }
    if (goog.string.isEmpty(txtCiudad.value)) {
        txtCiudad.focus();
        return false;
    }
    if (goog.string.isEmpty(txtCelular.value)) {
        txtCelular.focus();
        return false;
    }
    if (!this.chkAgree.checked) {
        alert("Debe aceptar los terminos y condiciones");
        return false;
    }
    /*send data*/
    if (true) {
        this.objResults.cortinilla.style.display = "block";
        var qd = new goog.Uri.QueryData();
        qd.add('DO_tcAirSearchRSJS', goog.json.serialize(this.objResults.availability["DO_tcAirSearchRSJS"]));
        goog.net.XhrIo.send(URL_BOOKING, goog.bind(function (obj) {
            this.objResults.cortinilla.style.display = "none";
            debugger;
            try {
                this.booking = obj.currentTarget.getResponseJson();
                if (this.booking["DO_tcAirSearchRSJS"]["tcErrorField"]["codeField"] === "1") {
                    alert(this.booking["DO_tcAirSearchRSJS"]["tcErrorField"]["messageField"]);
                    return false;
                } else {

                    /*BLOQUEAMOS LOS CONTROLES*/
                    var inputs = goog.dom.query("." + goog.getCssName("panelIzquierdoReservaVuelos") + " input ," + "." + goog.getCssName("panelIzquierdoReservaVuelos") + " select");
                    for (var c = 0; c < inputs.length; c++) {
                        inputs[c].disabled = true;
                    }
                    /* MOSTRAMOS EL RECORD EN EL TITULO */
                    var title = goog.dom.getElementByClass(goog.getCssName("titleRegister"));
                    title.style.color = "red";
                    title.innerHTML = "Su reserva fue confirmada con el record: " + this.booking["DO_tcAirSearchRSJS"]["tcRecordIdField"]["pNRField"];

                    /*MOSTRAMOS LOS BOTONES DE PAGAR Y CANCELAR*/
                    var contenedorCondicionesVuelosTarjeta = goog.dom.getElementByClass(goog.getCssName("contenedorCondicionesVuelosTarjeta"));
                    contenedorCondicionesVuelosTarjeta.innerHTML = flights.template.register.buttonspayandcancel();
                    //add event buttons pay and cancel
                    this.getHandler().listen(document.getElementById("btnPay"), goog.events.EventType.CLICK, this.onPayClick);
                    this.getHandler().listen(document.getElementById("btnCancel"), goog.events.EventType.CLICK, this.onCancelClick);

                }
            } catch (e) {

            }

        }, this), "POST", qd.toString());
    } else {
    }

};

flights.Register.prototype.onPayClick = function () {
    var sessionField = this.booking["DO_tcAirSearchRSJS"]["sessionField"];
    window.location.href = URL_PAY + "?sessionid=" + sessionField;
};

flights.Register.prototype.onCancelClick = function () {
    /*send data*/
    if (true) {
        this.objResults.cortinilla.style.display = "block";
        var qd = new goog.Uri.QueryData();
        qd.add('DO_tcAirSearchRSJS', goog.json.serialize(this.booking["DO_tcAirSearchRSJS"]));
        goog.net.XhrIo.send(URL_CANCEL, goog.bind(function (obj) {
            this.objResults.cortinilla.style.display = "none";
            //debugger;
            try {
                this.booking = obj.currentTarget.getResponseJson();
                if (this.booking["DO_tcAirSearchRSJS"]["tcErrorField"]["codeField"] === "1") {
                    alert(this.booking["DO_tcAirSearchRSJS"]["tcErrorField"]["messageField"]);
                    return false;
                } else {

                    alert("Reserva cancelada");
                    this.objResults.getElement().style.display = "block";
                    this.dispose();
                }
            } catch (e) {

            }

        }, this), "POST", qd.toString());
    } else {
    }
};

/**
 * Registramos el modulo.
 */
moduleManager.setLoaded('flights_register');