rock.namespace('chart');

/**
 * Window containing chart component
 *
 * @param {rock.window.WindowSystem} windowSystem
 *          the window system

 *
 * @constructor
 * @extends {rock.window.Window}
 *
 * @author Luis Alberto Jiménez
 */
chart.MainWindow = function (windowSystem) {
    rock.super_(this, arguments);
    this.barChartComponent = null;
    this.backgroundColor = new rock.graphics.Color(245, 245, 255);
    this.addComponents();
};

rock.extends_(chart.MainWindow, rock.window.Window);

chart.MainWindow.prototype.addComponents = function () {
    var barChartComponent = new chart.BarChartComponent(this);
    barChartComponent.setId('barChart');
    barChartComponent.setX(0);
    barChartComponent.setY(0);
    this.addComponent(barChartComponent);
    this.barChartComponent = barChartComponent;
};

/**
 * Set chart data
 *
 * @param {chart.Data} data
 *            chart data
 */
chart.MainWindow.prototype.setData = function (data) {
    this.barChartComponent.setData(data);
};