var chartApp = null;

/**
 * Function for init chart
 */
function init(idDiv, width, height) {
    chartApp = new chart.Chart(idDiv, width, height);

    var values = {
        "Luis": 33,
        "Elena": 24,
        "Alberto": 30,
        "Adrián": 15
    };

    document.getElementById('title').value = 'Age';
    document.getElementById('domain').value = 'People';
    document.getElementById('units').value = 'Years';
    document.getElementById('values').value = JSON.stringify(values, null, '  ');
    document.getElementById('beginRange').value = '0';
    document.getElementById('round').checked = true;
    document.getElementById('doAnimation').checked = true;
}

function setData() {
    var strValues = document.getElementById('values').value;
    var values = null;
    try {
        values = JSON.parse(strValues);
    } catch (e) {
        alert(e);
        return;
    }

    var title = document.getElementById('title').value;
    var domain = document.getElementById('domain').value;
    var units = document.getElementById('units').value;
    var strBeginRange = document.getElementById('beginRange').value;
    var beginRange = null;
    if (strBeginRange.trim() != '') {
        beginRange = Number(strBeginRange);
    }

    var strEndRange = document.getElementById('endRange').value;
    var endRange = null;
    if (strEndRange.trim() != '') {
        endRange = Number(strEndRange);
    }

    var round = document.getElementById('round').checked;
    var roundLabels = document.getElementById('roundLabels').checked;
    var doAnimation = document.getElementById('doAnimation').checked;

    var data = new chart.Data(title, domain, units, values, beginRange, endRange, round, roundLabels, doAnimation);

    // styles
    var font = document.getElementById('font').value;
    if (font.trim() != '') {
        data.setFont(new rock.graphics.Font(font, 16));
        data.setAxisFont(new rock.graphics.Font(font, 14));
        data.setTitleFont(new rock.graphics.Font(font, 20));
    }

    var fontColor = document.getElementById('fontColor').value;
    var rockFontColor = null;
    if (fontColor.trim() != '') {
        rockFontColor = rock.graphics.Color.fromHex(fontColor);
        data.setFontColor(rockFontColor);
        data.setAxisFontColor(rockFontColor);
        data.setTitleColor(rockFontColor);
    }

    var barColor = document.getElementById('barColor').value;
    if (barColor.trim() != '') {
        data.setBarColor(rock.graphics.Color.fromHex(barColor));
    }

    var selectedBarColor = document.getElementById('selectedBarColor').value;
    if (selectedBarColor.trim() != '') {
        data.setSelectedBarColor(rock.graphics.Color.fromHex(selectedBarColor));
    }

    var axisColor = document.getElementById('axisColor').value;
    if (axisColor.trim() != '') {
        data.setAxisLineColor(rock.graphics.Color.fromHex(axisColor));
    }

    var backgroundColor = document.getElementById('backgroundColor').value;
    if (backgroundColor.trim() != '') {
        data.setBackgroundColor(rock.graphics.Color.fromHex(backgroundColor));
    }

    try {
        chartApp.setData(data);
    } catch (e) {
        alert(e.message);
    }

}
