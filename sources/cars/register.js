goog.provide("cars.Register");
goog.require('cars.template.register');


/**
 * Clase que genera los resultados de vuelos
 * @constructor 
 * @extends  {goog.ui.Component}
 */
cars.Register = function (objResults) {
    this.objResults = objResults;
    goog.ui.Component.call(this);
};

goog.inherits(cars.Register, goog.ui.Component);

/**
 * Creates an initial DOM representation for the component.
 * @override
 */
cars.Register.prototype.createDom = function () {
    goog.base(this, 'createDom');

    //if (typeof (this.objResults.objSearch.objRender) === "undefined") {

    //    goog.dom.classes.add(this.getElement(), goog.getCssName("ux-common-main-popup"));
    //}

    this.contenido = cars.template.register.register({segmentSelected: this.objResults.segmentSelected});
};
/**
 * Called when component's element is known to be in the document.
 * @override
 */
cars.Register.prototype.enterDocument = function () {
    goog.base(this, 'enterDocument');
    var elemento = this.getElement();
    elemento.innerHTML = this.contenido;

    if (!goog.DEBUG) {
        this.MODULE_REGISTER_CSS = goog.style.installStyles(MODULE_CARS_REGISTER_CSS);
    }

    this.btnreturnresults = goog.dom.getElementByClass(goog.getCssName("btnreturnresults"));
    goog.events.listen(this.btnreturnresults, goog.events.EventType.CLICK, goog.bind(function (e) {
        this.objResults.getElement().style.display = "block";
        this.dispose();
    }, this));


    //this.objResults.searchParams;
    //debugger;

    //this.passengerInfo = new Array();
    //for (var c = 0; c < this.objResults.passenger.length; c++) {
    //    for (var d = 0; d < this.objResults.passenger[c].Cant; d++) {
    //        this.passengerInfo.push({
    //            PassengerInfoId: this.makeId("PassengerInfo" + d),
    //            Type: this.objResults.passenger[c].Type,
    //            FirstNameId: this.makeId("FistName" + d),
    //            FirstName: null,
    //            LastNameId: this.makeId("LastNameId" + d),
    //            LastName: null,
    //            DayId: this.makeId("DayId" + d),
    //            MonthId: this.makeId("MonthId" + d),
    //            YearId: this.makeId("YearId" + d),
    //            Day: null,
    //            Month: null,
    //            Year: null,
    //            GenreId: this.makeId("Genre" + d),
    //            Genre: null,
    //            DocumentTypeId: this.makeId("DocumentType" + d),
    //            DocumentType: null,
    //            DocumentNumberId: this.makeId("DocumentNumber" + d),
    //            DocumentNumber: null
    //        });
    //    }
    //}
    ////debugger;
    //this.passengerInfoDiv = goog.dom.getElementByClass(goog.getCssName("reservaDatosPasajero"));
    //this.passengerInfoDiv.innerHTML = cars.template.register.passengerInfo({passengerInfo: this.passengerInfo});
    //this.btnReserve = goog.dom.getElementByClass(goog.getCssName("btnSiguienteVuelosTarjeta"));

    ///*subimos el scroll*/
    //window.scrollTo(0, 0);
    this.getHandler().listen(this.btnReserve, goog.events.EventType.CLICK, this.onReserveClick);
    this.chkAgree = goog.dom.getElementByClass(goog.getCssName("reserve_car"));


//    if (window.location.hostname === "new.aviatur.com") {
//        var contenedor = goog.dom.getElementByClass(goog.getCssName("reserva-container"));
//        goog.dom.classes.add(contenedor, goog.getCssName("newaviaturcom"));
//    }

};
/**
 * Called when component's element is known to have been removed from the
 * document.
 * @override
 */
cars.Register.prototype.exitDocument = function () {
    goog.base(this, 'exitDocument');

    if (!goog.DEBUG) {
        goog.style.uninstallStyles(this.MODULE_REGISTER_CSS);
    }
};

cars.Register.prototype.onReserveClick = function () {
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
    }

    var txtMailPersonal = goog.dom.getElementByClass(goog.getCssName("txtMailPersonal"));
    var txtTelefono = goog.dom.getElementByClass(goog.getCssName("txtTelefono"));
    var txtCiudad = goog.dom.getElementByClass(goog.getCssName("txtCiudad"));
    var txtCelular = goog.dom.getElementByClass(goog.getCssName("txtCelular"));

    if (goog.string.isEmpty(txtMailPersonal.value)) {
        txtMailPersonal.focus();
        return false;
    }
//    if (goog.string.isEmpty(txtTelefono.value)) {
//        txtTelefono.focus();
//        return false;
//    }
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
};


/**
 * Registramos el modulo.
 */
moduleManager.setLoaded('cars_register');