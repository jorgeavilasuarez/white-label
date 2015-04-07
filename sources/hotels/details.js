goog.provide("hotels.Details");
goog.require('hotels.template.details');


/**
 * Clase que genera los detalles de hoteles
 * @constructor 
 * @extends  {goog.ui.Component}
 */
hotels.Details = function (objResults) {
    this.objResults = objResults;
    goog.ui.Component.call(this);
};

goog.inherits(hotels.Details, goog.ui.Component);

/**
 * Creates an initial DOM representation for the component.
 * @override
 */
hotels.Details.prototype.createDom = function () {
    goog.base(this, 'createDom');

    //if (typeof (this.objResults.objSearch.objRender) === "undefined") {

    //    goog.dom.classes.add(this.getElement(), goog.getCssName("ux-common-main-popup"));
    //}

    this.contenido = hotels.template.details.details({ segmentSelected: null });
};
/**
 * Called when component's element is known to be in the document.
 * @override
 */
hotels.Details.prototype.enterDocument = function () {
    goog.base(this, 'enterDocument');
    var elemento = this.getElement();
    elemento.innerHTML = this.contenido;

    if (!goog.DEBUG) {
        this.MODULE_DETAILS_CSS = goog.style.installStyles(MODULE_DETAILS_CSS);
    }

    this.btnreturnresults = goog.dom.getElementByClass(goog.getCssName("botonCotizar2"));
    goog.events.listen(this.btnreturnresults, goog.events.EventType.CLICK, goog.bind(this.onReturnClick_, this));


    this.btnBuy = goog.dom.getElementByClass(goog.getCssName("btnBuy"));
    goog.events.listen(this.btnBuy, goog.events.EventType.CLICK, goog.bind(this.onBuyClick_, this));

    ///*subimos el scroll*/
    window.scrollTo(0, goog.style.getPageOffsetTop(this.getElement()));


};
/**
 * Called when component's element is known to have been removed from the
 * document.
 * @override
 */
hotels.Details.prototype.exitDocument = function () {
    goog.base(this, 'exitDocument');

    if (!goog.DEBUG) {
        goog.style.uninstallStyles(this.MODULE_DETAILS_CSS);
    }
};

hotels.Details.prototype.onReturnClick_ = function () {
    this.objResults.getElement().style.display = "block";
    window.scroll(0, this.objResults.currentPageScrollY);
    this.dispose();
};

hotels.Details.prototype.onBuyClick_ = function () {
    this.objResults.onBuyClick_();
    this.dispose();
};


/**
 * Registramos el modulo.
 */
moduleManager.setLoaded('hotels_details');