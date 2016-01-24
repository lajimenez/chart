// Load all scripts
function loadChart(sourcePath) {
    var scriptsToLoad = [
        'constants.js',
        'Data.js',
        'BarChartComponent.js',
        'MainWindow.js',
        'Chart.js'
    ];

    var i;
    for (i = 0; i < scriptsToLoad.length; i++) {
        document.write('<script src="' + sourcePath + scriptsToLoad[i] + '"><\/script>');
    }
}