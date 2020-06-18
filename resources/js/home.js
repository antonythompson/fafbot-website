
import axios from 'axios';
const Highcharts = require('highcharts');
// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);

export default function(){
    home().then().catch(console.warn);
};
async function home(){
    try{
        let response = await axios.get('/joins')
        Highcharts.chart('chart', {

            title: {
                text: 'ANZ faf join rate'
            },
            yAxis: {
                title: {
                    text: 'Number'
                }
            },

            xAxis: {
                accessibility: {
                    rangeDescription: 'Day'
                }
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },

            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 2010
                }
            },

            series: [{
                name: 'Joins',
                data: response.data.data.map(row => {
                    return row.count
                })
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }

        });
    } catch (e) {

    }
}