rock.namespace('chart');

/**
 * Charts application
 *
 * @constructor
 * @extends rock.app.Application
 *
 * @author Luis Alberto Jiménez
 */
chart.Chart = function (idDiv, width, height) {
    var initParams = new rock.app.InitApplicationParams(idDiv, width, height, rock.constants.CONTEXT_CANVAS_2D, null);
    rock.super_(this, [initParams]);
};

rock.extends_(chart.Chart, rock.app.Application);

/**
 * @override
 * @see rock.app.Application#start
 */
chart.Chart.prototype.start = function () {
    var mainWindow = new chart.MainWindow(this.windowSystem);
    this.windowSystem.registerWindow(chart.constants.MAIN_WINDOW, mainWindow);
    this.windowSystem.setCurrentWindow(mainWindow);
};

/**
 * Set chart data
 *
 * @param {chart.Data} data
 *            chart data
 */
chart.Chart.prototype.setData = function (data) {
    var mainWindow = this.windowSystem.getWindow(chart.constants.MAIN_WINDOW);
    mainWindow.setData(data);
};
