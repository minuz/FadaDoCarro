var array = [
    ['Time', 'Speed', 'RPM'],
    ['02:13:03', 0, 875],
    ['02:13:00', 0, 1100],
];

var gaugeOptionsRPM = {
    min: 0,
    max: 10000,
    yellowFrom: 7000,
    yellowTo: 8000,
    redFrom: 8000,
    redTo: 10000,
    minorTicks: 5
};

var gaugeOptionsVel = {
    min: 0,
    max: 280,
    yellowFrom: 200,
    yellowTo: 250,
    redFrom: 250,
    redTo: 280,
    minorTicks: 5
};

var gaugeVel;
var gauge;

var app = (function (app, $) {

    function drawStuff() {
        var options = {
            series: {
                0: {
                    axis: 'Speed',
                    curveType: 'function',
                    color: 'red'
                }, // Bind series 0 to an axis named 'Speed'.
                1: {
                    axis: 'RPM',
                    curveType: 'function',
                    color: 'orange'
                } // Bind series 1 to an axis named 'RPM'.
            },

            curveType: 'function',
            legend: {
                position: 'none',
                alignment: 'center'
            },
            backgroundColor: '#A9A9A9',
            chartArea: {
                width: '100%'
            },
            animation: {
                duration: 1000,
                easing: 'in'
            }
        };
        var button = document.getElementById('botao');
        var ultFeed = '';

        function drawChart() {
            chart.draw(data, options);
        }
        var data = new google.visualization.arrayToDataTable(array);
        var chart = new google.charts.Line(document.getElementById('dual_x_div'));

        button.onclick = function () {
            if (data.getNumberOfRows() > 5) {
                data.removeRow(Math.floor(Math.random() * data.getNumberOfRows()));
            }

            var where = 0;
            while (where < data.getNumberOfRows()) {
                where++;
            }

            var vel = parseInt(document.getElementById('hfVel').value);
            var rpm = parseInt(document.getElementById('hfRpm').value);
            var tempo = document.getElementById('hfTempo').value.toString();

            if (!ultFeed) {
                data.insertRows(where, [
                    [tempo, vel, rpm]
                ]);
                drawChart();
            } else {
                if (ultFeed != tempo) {
                    data.insertRows(where, [
                        [tempo, vel, rpm]
                    ]);
                    drawChart();
                }
            }

            ultFeed = tempo;
        }

        drawChart();
    }

    function drawGauge() {
        gaugeData = new google.visualization.DataTable();
        gaugeData.addColumn('number', 'RPM');
        gaugeData.addRows(2);
        gaugeData.setCell(0, 0, 0);

        gauge = new google.visualization.Gauge(document.getElementById('gauge_div'));
        gauge.draw(gaugeData, gaugeOptionsRPM);
    }

    function changeTemp() {
        var rpm = parseInt(document.getElementById('hfRpm').value);

        gaugeData.setValue(0, 0, rpm);
        gauge.draw(gaugeData, gaugeOptionsRPM);
    }

    function drawGaugeVel() {
        gaugeDataVel = new google.visualization.DataTable();
        gaugeDataVel.addColumn('number', 'Velocidade');
        gaugeDataVel.addRows(2);
        gaugeDataVel.setCell(0, 0, 0);

        gaugeVel = new google.visualization.Gauge(document.getElementById('gauge_vel'));
        gaugeVel.draw(gaugeDataVel, gaugeOptionsVel);
    }

    function changeTempVel() {
        var vel = parseInt(document.getElementById('hfVel').value);

        gaugeDataVel.setValue(0, 0, vel);
        gaugeVel.draw(gaugeDataVel, gaugeOptionsVel);
    }

    function PlotaGrafico() {
        $.get("http://localhost:12162/Dashboard/Consulta", function (data) {
            console.log(data);

            var temp = new Array();
            temp = data.split("$");

            var rpm = temp[0].trim();
            var odo = temp[1].trim();
            var vel = temp[2].trim();
            var tempo = temp[3].trim();

            document.getElementById('divOdo').innerText = odo;
            document.getElementById('hfVel').value = vel;
            document.getElementById('hfRpm').value = rpm;
            document.getElementById('hfTempo').value = tempo;

            changeTemp();
            changeTempVel();
        });
    }

    function chartsInit() {
        google.charts.load('current', {
            'packages': ['gauge']
        });
        google.charts.setOnLoadCallback(drawGauge);

        google.charts.load('current', {
            'packages': ['gauge']
        });
        google.charts.setOnLoadCallback(drawGaugeVel);

        google.charts.load('current', {
            'packages': ['line']
        });
        google.charts.setOnLoadCallback(drawStuff);
    }

    var moduleInit = function () {

        chartsInit();

        // window.setInterval(function () {
        //     PlotaGrafico();
        // }, 200);

        window.setInterval(function () {
            document.getElementById('botao').click();
        }, 400);
    }

    return {
        init: moduleInit
    }
}(window.app = window.app || {}, jQuery));