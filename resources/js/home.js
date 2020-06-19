
import axios from 'axios';
const Highcharts = require('highcharts');
const moment = require('moment')
// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);

export default function(){
    home().then().catch(console.warn);
};
async function home(){
    try{
        let response = await axios.get('/joins')
        let data = response.data.data;

        let date = moment(data[0].date)
        let now = moment();
        let i = 0; //failsafe for infinite while
        let days = [];
        let months = [];
        let weeks = [];
        let datesHashMap = {};
        data.forEach(item => {
            datesHashMap[item.date] = item.count;
        })
        while (date.isSameOrBefore(now) && i < 5000) {
            i++;
            let date_string = date.format('YYYY-MM-DD');
            let value = datesHashMap[date_string] || null;
            if (value !== null) {
                days.push([date.format('X'),  value])
            }
            date.add(1, 'd');
        }
        response.data.data.map(row => {
            return row.count
        })


        Highcharts.chart('chart', {

            title: {
                text: 'ANZ faf join rate'
            },

            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: 'day %e. %b',
                    week: 'week %e. %b',
                    month: 'month %b \'%y',
                    year: '%Y'
                }
            },

            yAxis: {
                title: {
                    text: 'Number'
                }
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            series: [{
                name: 'Joins per day',
                data: days
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