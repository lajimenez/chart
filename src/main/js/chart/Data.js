rock.namespace('chart');

/**
 * Charts data
 *
 * @param {String} title
 * @param {String} domain
 * @param {String} units
 * @param {Object} values
 *          key/value pair as an object (key represents the name in domain and value, oh surprise, the value :)
 * @param {Number} [beginRange]
 *          lowest value of the range showed in graph. If the value is greater than min value passed, beginRange will be ignored
 * @param {Number} [endRange]
 *          greatest value of the range showed in graph. If the value is lower than max value passed, endRange will be ignored
 * @param {Boolean | 'auto'} [roundUnitGuideLines]
 *          the unit values in guide lines must be rounded (it will round the value).
 *          'auto' let the system to automatic select best option
 * @param {Boolean} [roundUnitGuideLineLabels]
 *          the unit values labels in guide lines must be rounded (it will ONLY round the label).
 * @param {Boolean} [doStartAnimation]
 *          you can decide if you want the start animation
 * @constructor
 *
 * @author Luis Alberto Jiménez
 */
chart.Data = function (title, domain, units, values, beginRange, endRange,
                       roundUnitGuideLines, roundUnitGuideLineLabels, doStartAnimation) {
    this.title = title;
    this.domain = domain;
    this.units = units;
    this.values = values;
    this.beginRange = beginRange;
    this.endRange = endRange;
    this.roundUnitGuideLines = roundUnitGuideLines;
    this.roundUnitGuideLineLabels = roundUnitGuideLineLabels;
    this.doStartAnimation = doStartAnimation;

    // Style info
    this.backgroundColor = null;
    this.font = null;
    this.fontColor = null;
    this.axisFont = null;
    this.axisFontColor = null;
    this.barColor = null;
    this.selectedBarColor = null;
    this.axisLineColor = null;
    this.titleFont = null;
    this.titleColor = null;
};

/**
 * Get the value
 */
chart.Data.prototype.getTitle = function () {
    return this.title;
};

/**
 * Set the value
 * @param title the value
 */
chart.Data.prototype.setTitle = function (title) {
    this.title = title;
};

/**
 * Get the value
 */
chart.Data.prototype.getUnits = function () {
    return this.units;
};

/**
 * Set the value
 * @param units the value
 */
chart.Data.prototype.setUnits = function (units) {
    this.units = units;
};

/**
 * Get the value
 */
chart.Data.prototype.getDomain = function () {
    return this.domain;
};

/**
 * Set the value
 * @param domain the value
 */
chart.Data.prototype.setDomain = function (domain) {
    this.domain = domain;
};

/**
 * Get the value
 */
chart.Data.prototype.getValues = function () {
    return this.values;
};

/**
 * Set the value
 * @param values the value
 */
chart.Data.prototype.setValues = function (values) {
    this.values = values;
};

/**
 * Get the value
 */
chart.Data.prototype.getBeginRange = function () {
    return this.beginRange;
};

/**
 * Set the value
 * @param beginRange the value
 */
chart.Data.prototype.setBeginRange = function (beginRange) {
    this.beginRange = beginRange;
};

/**
 * Get the value
 */
chart.Data.prototype.getEndRange = function () {
    return this.endRange;
};

/**
 * Set the value
 * @param endRange the value
 */
chart.Data.prototype.setEndRange = function (endRange) {
    this.endRange = endRange;
};

/**
 * Get the value
 */
chart.Data.prototype.getRoundUnitGuideLines = function () {
    return this.roundUnitGuideLines;
};

/**
 * Set the value
 * @param roundUnitGuideLines the value
 */
chart.Data.prototype.setRoundUnitGuideLines = function (roundUnitGuideLines) {
    this.roundUnitGuideLines = roundUnitGuideLines;
};

/**
 * Get the value
 */
chart.Data.prototype.getRoundUnitGuideLineLabels = function() {
    return this.roundUnitGuideLineLabels;
};

/**
 * Set the value
 * @param roundUnitGuideLineLabels the value
 */
chart.Data.prototype.setRoundUnitGuideLineLabels = function(roundUnitGuideLineLabels) {
    this.roundUnitGuideLineLabels = roundUnitGuideLineLabels;
};

/**
 * Get the value
 */
chart.Data.prototype.getDoStartAnimation = function () {
    return this.doStartAnimation;
};

/**
 * Set the value
 * @param doStartAnimation the value
 */
chart.Data.prototype.setDoStartAnimation = function (doStartAnimation) {
    this.doStartAnimation = doStartAnimation;
};

/**
 * Get the value
 */
chart.Data.prototype.getBackgroundColor = function () {
    return this.backgroundColor;
};

/**
 * Set the value
 * @param backgroundColor the value
 */
chart.Data.prototype.setBackgroundColor = function (backgroundColor) {
    this.backgroundColor = backgroundColor;
};

/**
 * Get the value
 */
chart.Data.prototype.getFont = function () {
    return this.font;
};

/**
 * Set the value
 * @param font the value
 */
chart.Data.prototype.setFont = function (font) {
    this.font = font;
};

/**
 * Get the value
 */
chart.Data.prototype.getFontColor = function () {
    return this.fontColor;
};

/**
 * Set the value
 * @param fontColor the value
 */
chart.Data.prototype.setFontColor = function (fontColor) {
    this.fontColor = fontColor;
};

/**
 * Get the value
 */
chart.Data.prototype.getAxisFont = function () {
    return this.axisFont;
};

/**
 * Set the value
 * @param axisFont the value
 */
chart.Data.prototype.setAxisFont = function (axisFont) {
    this.axisFont = axisFont;
};

/**
 * Get the value
 */
chart.Data.prototype.getAxisFontColor = function () {
    return this.axisFontColor;
};

/**
 * Set the value
 * @param axisFontColor the value
 */
chart.Data.prototype.setAxisFontColor = function (axisFontColor) {
    this.axisFontColor = axisFontColor;
};

/**
 * Get the value
 */
chart.Data.prototype.getBarColor = function () {
    return this.barColor;
};

/**
 * Set the value
 * @param barColor the value
 */
chart.Data.prototype.setBarColor = function (barColor) {
    this.barColor = barColor;
};

/**
 * Get the value
 */
chart.Data.prototype.getSelectedBarColor = function () {
    return this.selectedBarColor;
};

/**
 * Set the value
 * @param selectedBarColor the value
 */
chart.Data.prototype.setSelectedBarColor = function (selectedBarColor) {
    this.selectedBarColor = selectedBarColor;
};

/**
 * Get the value
 */
chart.Data.prototype.getAxisLineColor = function () {
    return this.axisLineColor;
};

/**
 * Set the value
 * @param axisLineColor the value
 */
chart.Data.prototype.setAxisLineColor = function (axisLineColor) {
    this.axisLineColor = axisLineColor;
};

/**
 * Get the value
 */
chart.Data.prototype.getTitleFont = function () {
    return this.titleFont;
};

/**
 * Set the value
 * @param titleFont the value
 */
chart.Data.prototype.setTitleFont = function (titleFont) {
    this.titleFont = titleFont;
};

/**
 * Get the value
 */
chart.Data.prototype.getTitleColor = function () {
    return this.titleColor;
};

/**
 * Set the value
 * @param titleColor the value
 */
chart.Data.prototype.setTitleColor = function (titleColor) {
    this.titleColor = titleColor;
};