rock.namespace('chart');

/**
 * Chart class.
 *
 * @param {rock.window.Window} window
 *            the window where component exists
 *
 * @constructor
 * @extends rock.window.component.Component
 *
 * @author Luis Alberto Jiménez
 */
chart.BarChartComponent = function (window) {
    rock.super_(this, [window]);
    this.width = rock.window.component.Component.AUTO_SIZE;
    this.height = rock.window.component.Component.AUTO_SIZE;

    this.data = null;
    this.validData = false;

    this.addEventListener(rock.constants.ROCK_EVENT_MOUSE_MOVE,
        rock.createEventHandler(this, this.handleOnMouseMove));

    this.backgroundColor = new rock.graphics.Color(245, 245, 255);

    // constants
    this.TOP_AXIS_MARGIN = 10; // %
    this.BOTTOM_AXIS_MARGIN = 15; // %
    this.LEFT_AXIS_MARGIN = 10; // %
    this.RIGHT_AXIS_MARGIN = 10; // %
    this.RANGE_MARGIN = 5; // %
    this.X_AXIS_LABEL = 5; // pixels
    this.Y_AXIS_LABEL = 5; // pixels
    this.DOMAIN_LABEL_MARGIN = 5; // pixels
    this.UNIT_GUIDE_LABEL_MARGIN = 5; // pixels
    this.UNIT_LINE_GUIDES_COUNT = 5;
    this.SELECTED_BAR_LABEL_MARGIN = 5; //pixels
    this.UNIT_GUIDE_LINES_LABEL_DECIMALS = 2;
    this.AUTO_ROUND = 'auto';
    this.ANIMATION_TIME = 500; //milliseconds
    this.INVALID_DATA_MESSAGE = 'Invalid value';

    // configurable labels
    this.title = null;
    this.domain = null;
    this.units = null;

    this.xAxisLabel = null;
    this.yAxisLabel = null;

    // configurable styles
    this.axisLineWidth = 2;
    this.axisLineColor = new rock.graphics.Color(0, 0, 0);

    this.axisLabelFont = new rock.graphics.Font('Arial', 14);
    this.axisLabelColor = new rock.graphics.Color(0, 0, 0);

    this.barColor = new rock.graphics.Color(255, 0, 0);
    this.selectedBarColor = new rock.graphics.Color(150, 0, 0);
    this.domainLabelFont = new rock.graphics.Font('Arial', 12);
    this.domainLabelColor = new rock.graphics.Color(0, 0, 0);

    this.unitLineGuidesWidth = 1;
    this.unitLineGuidesColor = new rock.graphics.Color(0, 0, 0, 128);
    this.unitLineGuidesLabelFont = new rock.graphics.Font('Arial', 12);
    this.unitLineGuidesLabelColor = new rock.graphics.Color(0, 0, 0);

    this.titleFont = new rock.graphics.Font('Arial', 20);
    this.titleColor = new rock.graphics.Color(0, 0, 0);

    this.selectedBarLabelFont = new rock.graphics.Font('Arial', 12);
    this.selectedBarLabelColor = new rock.graphics.Color(0, 0, 0);

    // other configurable values
    this.roundUnitGuideLines = this.AUTO_ROUND;
    this.roundUnitGuideLineLabels = false;

    // computed values needed for drawing the component
    this.axisStartPoint = null;
    this.xAxisEndPoint = null;
    this.yAxisEndPoint = null;

    this.xAxisLabelPosition = null;
    this.yAxisLabelPosition = null;

    this.bars = null;
    this.domainBarLabels = null;
    this.domainBarLabelsPosition = null;

    this.unitLineGuides = null;
    this.unitLineGuidesLabels = null;

    this.titlePosition = null;

    // values needed to compute drawing positions
    this.xAxisSize = null;
    this.yAxisSize = null;
    this.rangeDifference = null;
    this.beginRange = null;
    this.countValues = null;
    this.domainLabels = null;
    this.domainValues = null;

    // selected bar info
    this.currentSelectedBar = null;
    this.selectedBarLabelPosition = null;
    this.selectedBarLabelWidthHeight = null;

    // animation
    this.startAnimationTime = null;
    this.endAnimationTime = null;
    this.currentAnimationTime = null;
    this.isInAnimation = false;
};

rock.extends_(chart.BarChartComponent, rock.window.component.Component);

chart.BarChartComponent.prototype.handleOnMouseMove = function (event) {
    if (!this.validData) {
        return;
    }

    var point = new rock.geometry.Point2(event.getX(), event.getY());
    var bars = this.bars;
    var i, rect, countValues = this.countValues;
    var currentBar = -1;
    for (i = 0; i < countValues; i++) {
        rect = bars[i];
        if (rect.intersectWithPoint(point)) {
            currentBar = i;
            break;
        }
    }

    if (currentBar != this.currentSelectedBar) {
        this.currentSelectedBar = currentBar;
        this.computeSelectedBarLabel();
        this.window.redraw();
    }
};

chart.BarChartComponent.prototype.roundIfNecessary = function (value, type) {
    if (this.roundUnitGuideLines) {
        if (type === 'FLOOR') {
            return Math.floor(value);
        } else if (type === 'CEIL') {
            return Math.ceil(value);
        } else {
            return Math.round(value);
        }
    } else {
        return value;
    }
};

chart.BarChartComponent.prototype.computeSelectedBarLabel = function () {
    var currentSelectedBar = this.currentSelectedBar;
    var bar = this.bars[currentSelectedBar];
    var value = this.domainValues[currentSelectedBar];
    if (rock.util.JsUtils.isNullOrUndefined(bar)) {
        return;
    }
    var textWidth = rock.util.TextUtils.measureTextWidth(value, this.selectedBarLabelFont);
    var textHeight = rock.util.TextUtils.measureTextHeight(value, this.selectedBarLabelFont);

    var labelX = bar.getXMax() - ((bar.getXMax() - bar.getXMin()) / 2) - textWidth / 2;
    var labelY = bar.getYMin() - this.SELECTED_BAR_LABEL_MARGIN - textHeight;

    this.selectedBarLabelPosition = new rock.geometry.Point2(labelX, labelY);
    this.selectedBarLabelWidthHeight = {
        "width": textWidth,
        "height": textHeight
    };
};

chart.BarChartComponent.prototype.computeCommonValues = function (data) {
    var property, value, rangeDifference, rangeMargin, beginRange = null, endRange = null;
    var values = data.getValues();
    var countValues = 0;
    var domainValues = [];
    var domainLabels = [];
    for (property in values) {
        if (!values.hasOwnProperty(property)) {
            continue;
        }
        value = values[property];
        if (!rock.util.JsUtils.isNumerical(value)) {
            throw new rock.error.RockError(this.INVALID_DATA_MESSAGE);
        }
        value = parseFloat(value);

        if (beginRange == null) {
            beginRange = value;
            endRange = value;
        }

        if (value < beginRange) {
            beginRange = value;
        }

        if (value > endRange) {
            endRange = value;
        }
        domainLabels.push(property);
        domainValues.push(value);
        countValues++;
    }

    var dataEndRange = data.getEndRange();
    if (!rock.util.JsUtils.isNullOrUndefined(dataEndRange) && dataEndRange > endRange) {
        endRange = dataEndRange;
    }

    var dataBeginRange = data.getBeginRange();
    if (!rock.util.JsUtils.isNullOrUndefined(dataBeginRange) && dataBeginRange < beginRange && dataBeginRange < endRange) {
        beginRange = dataBeginRange;
    }

    rangeDifference = endRange - beginRange;
    if (this.roundUnitGuideLines === this.AUTO_ROUND) {
        if (rangeDifference < (2 * this.UNIT_LINE_GUIDES_COUNT + 2)) {
            this.roundUnitGuideLines = false;
        } else {
            this.roundUnitGuideLines = true;
        }
    }

    rangeMargin = (this.RANGE_MARGIN * rangeDifference) / 100;
    if (rock.util.JsUtils.isNullOrUndefined(dataBeginRange)) {
        beginRange = beginRange - rangeMargin;
    }
    if (rock.util.JsUtils.isNullOrUndefined(dataEndRange)) {
        endRange = endRange + rangeMargin;
    }

    endRange = this.roundIfNecessary(endRange, 'CEIL');
    beginRange = this.roundIfNecessary(beginRange, 'FLOOR');

    this.rangeDifference = endRange - beginRange;
    this.beginRange = beginRange;
    this.countValues = countValues;
    this.domainLabels = domainLabels;
    this.domainValues = domainValues;
    this.currentSelectedBar = -1;
};

chart.BarChartComponent.prototype.computeAxisLine = function () {
    var height = this.computedHeight;
    var width = this.computedWidth;
    var xLeftAxisMargin = Math.round((this.LEFT_AXIS_MARGIN * width) / 100);
    var xRightAxisMargin = Math.round((this.RIGHT_AXIS_MARGIN * width) / 100);
    var yTopAxisMargin = Math.round((this.TOP_AXIS_MARGIN * height) / 100);
    var yBottomAxisMargin = Math.round((this.BOTTOM_AXIS_MARGIN * height) / 100);
    this.axisStartPoint = new rock.geometry.Point2(xLeftAxisMargin, height - yBottomAxisMargin);
    this.xAxisEndPoint = new rock.geometry.Point2(width - xRightAxisMargin, height - yBottomAxisMargin);
    this.yAxisEndPoint = new rock.geometry.Point2(xLeftAxisMargin, yTopAxisMargin);
    this.xAxisSize = this.xAxisEndPoint.getX() - this.axisStartPoint.getX();
    this.yAxisSize = this.axisStartPoint.getY() - this.yAxisEndPoint.getY();
};

chart.BarChartComponent.prototype.computeAxisLabels = function () {
    var axisStartPoint = this.axisStartPoint;
    var yAxisEndPoint = this.yAxisEndPoint;

    var domain = this.domain;
    var xAxisLabelX = this.computedWidth / 2 - rock.util.TextUtils.measureTextWidth(domain, this.axisLabelFont) / 2;
    var xAxisLabelY = axisStartPoint.getY() + this.DOMAIN_LABEL_MARGIN +
        rock.util.TextUtils.measureTextHeight(domain, this.domainLabelFont) + this.X_AXIS_LABEL;
    this.xAxisLabelPosition = new rock.geometry.Point2(Math.round(xAxisLabelX), Math.round(xAxisLabelY));
    this.xAxisLabel = domain;

    var units = this.units;
    var yAxisLabelX = yAxisEndPoint.getX() - rock.util.TextUtils.measureTextWidth(units, this.axisLabelFont) / 2;
    var yAxisLabelY = yAxisEndPoint.getY() - rock.util.TextUtils.measureTextHeight(units, this.axisLabelFont) -
        this.Y_AXIS_LABEL - (rock.util.TextUtils.measureTextHeight('00', this.unitLineGuidesLabelFont) / 2);
    this.yAxisLabelPosition = new rock.geometry.Point2(Math.round(yAxisLabelX), Math.round(yAxisLabelY));
    this.yAxisLabel = units;
};

chart.BarChartComponent.prototype.computeBarsAndDomainLabels = function () {
    var axisStartPoint = this.axisStartPoint;
    var xAxisSize = this.xAxisSize;
    var yAxisSize = this.yAxisSize;
    var rangeDifference = this.rangeDifference;
    var beginRange = this.beginRange;
    var countValues = this.countValues;
    var domainLabels = this.domainLabels;
    var domainValues = this.domainValues;

    var bars = [];
    // We want half bar width as margin and between bars
    var barUnit = xAxisSize / (countValues * 3 + 1);
    var xMin, xMax, yMin, yMax = axisStartPoint.getY(), barHeight, barDifference, i;
    for (i = 0; i < countValues; i++) {
        xMin = axisStartPoint.getX() + barUnit + i * barUnit * 3;
        xMax = xMin + barUnit * 2;
        barDifference = domainValues[i] - beginRange;
        barHeight = yAxisSize * barDifference / rangeDifference;
        yMin = axisStartPoint.getY() - barHeight;
        bars.push(new rock.geometry.Rectangle(Math.round(xMin), Math.round(yMin), Math.round(xMax), Math.round(yMax)));
    }
    this.bars = bars;

    var domainLabelFont = this.domainLabelFont;
    var domainBarLabelsPosition = [];
    var xLabel, domainLabel, halfTextWidth;
    var yLabel = axisStartPoint.getY() + this.DOMAIN_LABEL_MARGIN;
    for (i = 0; i < countValues; i++) {
        domainLabel = domainLabels[i];
        xLabel = axisStartPoint.getX() + 2 * barUnit + i * barUnit * 3;
        // We center the text
        halfTextWidth = rock.util.TextUtils.measureTextWidth(domainLabel, domainLabelFont) / 2;
        domainBarLabelsPosition.push(new rock.geometry.Point2(Math.round(xLabel - halfTextWidth), Math.round(yLabel)));
    }
    this.domainBarLabels = domainLabels;
    this.domainBarLabelsPosition = domainBarLabelsPosition;
};

chart.BarChartComponent.prototype.computeUnitLabelsAndGuideReferenceLine = function () {
    var axisStartPoint = this.axisStartPoint;
    var xAxisSize = this.xAxisSize;
    var yAxisSize = this.yAxisSize;
    var rangeDifference = this.rangeDifference;
    var beginRange = this.beginRange;
    var unitLineGuidesCount = this.UNIT_LINE_GUIDES_COUNT;
    var unitLineGuidesDifference = rangeDifference / unitLineGuidesCount;
    var unitLineGuidesLabelFont = this.unitLineGuidesLabelFont;
    var unitLineGuides = [];
    var unitLineGuidesLabels = [];
    var unitLineX = axisStartPoint.getX();
    var roundUnitGuideLines = this.roundUnitGuideLines;
    var unitLineGuide, unitLineGuideLabel, unitLineGuideLabelValue, unitLineGuideLabelWidth, unitLineGuideLabelHeight,
        beginUnitLineGuidePoint, endUnitLineGuidePoint, unitLineHeight, unitLineY, currentUnitLineGuidesDifference, i;

    for (i = 0; i <= unitLineGuidesCount; i++) {
        // lines
        currentUnitLineGuidesDifference = this.roundIfNecessary(i * unitLineGuidesDifference);
        unitLineHeight = yAxisSize * currentUnitLineGuidesDifference / rangeDifference;
        unitLineY = Math.round(axisStartPoint.getY() - unitLineHeight);
        beginUnitLineGuidePoint = new rock.geometry.Point2(unitLineX, unitLineY);
        endUnitLineGuidePoint = new rock.geometry.Point2(unitLineX + xAxisSize, unitLineY);
        unitLineGuide = {
            'beginPoint': beginUnitLineGuidePoint,
            'endPoint': endUnitLineGuidePoint

        };
        unitLineGuides.push(unitLineGuide);

        // labels
        unitLineGuideLabelValue = beginRange + currentUnitLineGuidesDifference;
        var decimalsInLabel = this.UNIT_GUIDE_LINES_LABEL_DECIMALS;
        if (!roundUnitGuideLines) {
            if (this.roundUnitGuideLineLabels) {
                decimalsInLabel = 0;
            }
            unitLineGuideLabelValue =
                rock.util.JsUtils.round(unitLineGuideLabelValue, decimalsInLabel);
        }
        unitLineGuideLabelWidth = rock.util.TextUtils.
            measureTextWidth(unitLineGuideLabelValue, unitLineGuidesLabelFont);
        unitLineGuideLabelHeight = rock.util.TextUtils.
            measureTextHeight(unitLineGuideLabelValue, unitLineGuidesLabelFont);
        unitLineGuideLabel = {
            'value': unitLineGuideLabelValue,
            'position': new rock.geometry.Point2(
                Math.round(unitLineX - this.UNIT_GUIDE_LABEL_MARGIN - unitLineGuideLabelWidth),
                Math.round(unitLineY - (unitLineGuideLabelHeight / 2)))
        };
        unitLineGuidesLabels.push(unitLineGuideLabel);
    }
    // Remove first line so it will be the x axis
    unitLineGuides.shift();
    this.unitLineGuides = unitLineGuides;
    this.unitLineGuidesLabels = unitLineGuidesLabels;
};

chart.BarChartComponent.prototype.computeTitle = function () {
    var title = this.title;
    var titleX = this.computedWidth / 2 - rock.util.TextUtils.measureTextWidth(title, this.titleFont) / 2;
    var titleY = this.yAxisEndPoint.getY() / 2 - rock.util.TextUtils.measureTextHeight(title, this.titleFont) / 2;
    this.titlePosition = new rock.geometry.Point2(Math.round(titleX), Math.round(titleY));
};

chart.BarChartComponent.prototype.computeBarChart = function (data) {
    // the order is important!
    this.computeCommonValues(data);
    this.computeAxisLine();
    this.computeAxisLabels();
    this.computeBarsAndDomainLabels();
    this.computeUnitLabelsAndGuideReferenceLine();
    this.computeTitle();
};

chart.BarChartComponent.prototype.getBarHeight = function (maxBarHeight) {
    var totalTimeDifference = this.endAnimationTime - this.startAnimationTime;
    var currentTimeDifference = this.currentAnimationTime - this.startAnimationTime;
    if (this.isInAnimation) {
        return (currentTimeDifference * maxBarHeight) / totalTimeDifference;
    } else {
        return maxBarHeight;
    }
};

chart.BarChartComponent.prototype.drawBarsAndDomainLabels = function (graphicsEngine) {
    var i, barRect, countValues, barColor, barHeight, barDifference;
    var bars = this.bars;
    var currentSelectedBar = this.currentSelectedBar;
    countValues = bars.length;
    var domainLabelFont = this.domainLabelFont, domainLabelColor = this.domainLabelColor;

    for (i = 0; i < countValues; i++) {
        barRect = bars[i];
        barColor = this.barColor;
        if (i === currentSelectedBar) {
            barColor = this.selectedBarColor;
        }
        barHeight = this.getBarHeight(barRect.getYMax() - barRect.getYMin());
        barDifference = (barRect.getYMax() - barRect.getYMin()) - barHeight;
        graphicsEngine.drawRectangle(barRect.getXMin(), barRect.getYMin() + barDifference,
            barRect.getXMax() - barRect.getXMin(), barHeight, barColor);
    }

    var domainBarLabels = this.domainBarLabels;

    var domainBarLabelsPosition = this.domainBarLabelsPosition;
    var domainBarLabel, domainBarLabelPosition;

    for (i = 0; i < countValues; i++) {
        domainBarLabel = domainBarLabels[i];
        domainBarLabelPosition = domainBarLabelsPosition[i];
        graphicsEngine.drawText(domainBarLabel, domainBarLabelPosition.getX(), domainBarLabelPosition.getY(),
            domainLabelFont, domainLabelColor);
    }
};

chart.BarChartComponent.prototype.drawLabelSelectedBar = function (graphicsEngine) {
    var currentSelectedBar = this.currentSelectedBar;
    if (currentSelectedBar == -1) {
        return;
    }

    var margin = 2;
    var selectedBarLabelPosition = this.selectedBarLabelPosition;
    var selectedBarLabelWidthHeight = this.selectedBarLabelWidthHeight;

    graphicsEngine.drawRectangle(
        selectedBarLabelPosition.getX() - margin, selectedBarLabelPosition.getY(),
        selectedBarLabelWidthHeight.width + (2 * margin), selectedBarLabelWidthHeight.height,
        this.backgroundColor);
    graphicsEngine.drawText(this.domainValues[currentSelectedBar],
        selectedBarLabelPosition.getX(), selectedBarLabelPosition.getY(),
        this.selectedBarLabelFont, this.selectedBarLabelColor);

};

chart.BarChartComponent.prototype.drawUnitLabelsAndGuideReferenceLine = function (graphicsEngine) {
    var unitLineGuides = this.unitLineGuides;
    var unitLineGuidesLabels = this.unitLineGuidesLabels;
    var unitLineGuide, unitLineGuidesLabel;
    var unitLineGuidesCount = unitLineGuides.length;
    var unitLineGuidesLabelsCount = unitLineGuidesLabels.length;
    var i;

    for (i = 0; i < unitLineGuidesCount; i++) {
        unitLineGuide = unitLineGuides[i];
        graphicsEngine.drawLine(unitLineGuide.beginPoint.getX(), unitLineGuide.beginPoint.getY(),
            unitLineGuide.endPoint.getX(), unitLineGuide.endPoint.getY(),
            this.unitLineGuidesWidth, this.unitLineGuidesColor);
    }

    for (i = 0; i < unitLineGuidesLabelsCount; i++) {
        unitLineGuidesLabel = unitLineGuidesLabels[i];
        graphicsEngine.drawText(unitLineGuidesLabel.value, unitLineGuidesLabel.position.getX(),
            unitLineGuidesLabel.position.getY(), this.unitLineGuidesLabelFont, this.unitLineGuidesLabelColor);
    }
};

chart.BarChartComponent.prototype.drawAxisLine = function (graphicsEngine) {
    var axisStartPoint = this.axisStartPoint;
    var xAxisEndPoint = this.xAxisEndPoint;
    var yAxisEndPoint = this.yAxisEndPoint;
    var axisLineWidth = this.axisLineWidth;
    var axisLineColor = this.axisLineColor;
    graphicsEngine.drawLine(axisStartPoint.getX(), axisStartPoint.getY(),
        xAxisEndPoint.getX(), xAxisEndPoint.getY(),
        axisLineWidth, axisLineColor);
    graphicsEngine.drawLine(axisStartPoint.getX(), axisStartPoint.getY(),
        yAxisEndPoint.getX(), yAxisEndPoint.getY(),
        axisLineWidth, axisLineColor);
};

chart.BarChartComponent.prototype.drawAxisLabels = function (graphicsEngine) {
    var xAxisLabelPosition = this.xAxisLabelPosition;
    var yAxisLabelPosition = this.yAxisLabelPosition;
    var axisLabelFont = this.axisLabelFont;
    var axisLabelColor = this.axisLabelColor;
    graphicsEngine.drawText(this.xAxisLabel, xAxisLabelPosition.getX(), xAxisLabelPosition.getY(),
        axisLabelFont, axisLabelColor);
    graphicsEngine.drawText(this.yAxisLabel, yAxisLabelPosition.getX(), yAxisLabelPosition.getY(),
        axisLabelFont, axisLabelColor);
};

chart.BarChartComponent.prototype.drawTitle = function (graphicsEngine) {
    graphicsEngine.drawText(this.title, this.titlePosition.getX(), this.titlePosition.getY(),
        this.titleFont, this.titleColor)
};

chart.BarChartComponent.prototype.draw = function (graphicsEngine) {
    if (!this.validData) {
        return;
    }
    // background
    graphicsEngine.drawRectangle(this.x, this.y, this.computedWidth, this.computedHeight, this.backgroundColor);

    // the order is important!
    this.drawBarsAndDomainLabels(graphicsEngine);
    this.drawUnitLabelsAndGuideReferenceLine(graphicsEngine);
    this.drawLabelSelectedBar(graphicsEngine);
    this.drawAxisLine(graphicsEngine);
    this.drawAxisLabels(graphicsEngine);
    this.drawTitle(graphicsEngine);
};

chart.BarChartComponent.prototype.animate = function () {
    this.currentAnimationTime = new Date().getTime();
    if (this.currentAnimationTime > this.endAnimationTime) {
        rock.timer.stop();
        rock.timer.unregisterTimerFunction(this.animate);
        this.isInAnimation = false;
    }

    this.window.redraw();
};

chart.BarChartComponent.prototype.updateStyles = function (data) {
    var backgroundColor = data.getBackgroundColor();
    if (!rock.util.JsUtils.isNullOrUndefined(backgroundColor)) {
        this.backgroundColor = backgroundColor;
    }

    var font = data.getFont();
    if (!rock.util.JsUtils.isNullOrUndefined(font)) {
        this.axisLabelFont = font;
    }

    var fontColor = data.getFontColor();
    if (!rock.util.JsUtils.isNullOrUndefined(fontColor)) {
        this.axisLabelColor = fontColor;
    }

    var axisFont = data.getAxisFont();
    if (!rock.util.JsUtils.isNullOrUndefined(axisFont)) {
        this.domainLabelFont = axisFont;
        this.selectedBarLabelFont = axisFont;
        this.unitLineGuidesLabelFont = axisFont;
    }

    var axisFontColor = data.getAxisFontColor();
    if (!rock.util.JsUtils.isNullOrUndefined(axisFontColor)) {
        this.domainLabelColor = axisFontColor;
        this.selectedBarLabelColor = axisFontColor;
        this.unitLineGuidesLabelColor = axisFontColor;
    }

    var barColor = data.getBarColor();
    if (!rock.util.JsUtils.isNullOrUndefined(barColor)) {
        this.barColor = barColor;
    }

    var selectedBarColor = data.getSelectedBarColor();
    if (!rock.util.JsUtils.isNullOrUndefined(selectedBarColor)) {
        this.selectedBarColor = selectedBarColor;
    }

    var axisLineColor = data.getAxisLineColor();
    if (!rock.util.JsUtils.isNullOrUndefined(axisLineColor)) {
        this.axisLineColor = axisLineColor;
        this.unitLineGuidesColor =
            new rock.graphics.Color(axisLineColor.getRed(), axisLineColor.getGreen(), axisLineColor.getBlue(), 128);
    }

    var titleFont = data.getTitleFont();
    if (!rock.util.JsUtils.isNullOrUndefined(titleFont)) {
        this.titleFont = titleFont;
    }

    var titleColor = data.getTitleColor();
    if (!rock.util.JsUtils.isNullOrUndefined(titleColor)) {
        this.titleColor = titleColor;
    }
};

chart.BarChartComponent.prototype.updateSize = function () {
    if (this.width === rock.window.component.Component.AUTO_SIZE) {
        this.computedWidth = this.window.getWindowSystem().getWidth();
    } else {
        this.computedWidth = this.width;
    }

    if (this.height === rock.window.component.Component.AUTO_SIZE) {
        this.computedHeight =  this.window.getWindowSystem().getHeight();
    } else {
        this.computedHeight = this.height;
    }
};

chart.BarChartComponent.prototype.updateComponent = function () {
    this.updateSize();

    var data = this.data;
    var roundUnitGuideLines = data.getRoundUnitGuideLines();
    if (rock.util.JsUtils.isNullOrUndefined(roundUnitGuideLines)) {
        roundUnitGuideLines = this.AUTO_ROUND;
    }
    this.roundUnitGuideLines = roundUnitGuideLines;

    var roundUnitGuideLineLabels = data.getRoundUnitGuideLineLabels();
    if (!rock.util.JsUtils.isNullOrUndefined(roundUnitGuideLineLabels)) {
        this.roundUnitGuideLineLabels = roundUnitGuideLineLabels;
    }

    this.title = data.getTitle();
    this.domain = data.getDomain();
    this.units = data.getUnits();
    this.updateStyles(data);
    this.computeBarChart(data);
};

chart.BarChartComponent.prototype.startDrawing = function () {
    var data = this.data;
    var doStartAnimation = data.getDoStartAnimation();
    if (rock.util.JsUtils.isNullOrUndefined(doStartAnimation)) {
        doStartAnimation = true;
    }
    if (doStartAnimation) {
        this.startAnimationTime = new Date().getTime();
        this.endAnimationTime = this.startAnimationTime + this.ANIMATION_TIME;
        this.isInAnimation = true;
        rock.timer.registerTimerFunction(this, this.animate, []);
        rock.timer.start();
    } else {
        this.window.redraw();
    }
};

/**
 * Set chart data
 *
 * @param {chart.Data} data
 *            chart data
 */
chart.BarChartComponent.prototype.setData = function (data) {
    if (rock.isNullOrUndefined(data) || !rock.instanceof_(data, chart.Data)) {
        return;
    }

    this.data = data;
    this.validData = true;
    this.updateComponent();
    this.startDrawing();
};
