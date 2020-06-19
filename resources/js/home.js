
import axios from 'axios';
const Highcharts = require('highcharts');
const moment = require('moment')
const _ = require('underscore')
// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);

export default function(){
    home().then().catch(console.warn);
};
async function home(){
    try{
        let response = await axios.get('/joins')
        let data = response.data.data;

        // let date = moment(data[0].date).seconds(0).minutes(0).milliseconds(0)
        let now = moment();
        let population = [];
        let days = [];
        let months = [];
        let weeks = [];
        let datesHashMap = {};
        let weeksHashMap = {};
        let monthsHashMap = {};
        console.log(data);
        let week_count = 0;

        let total = 0;
        let after = moment('2018-01-01')
        data.forEach((item, i)=> {
            total += item.count
            // datesHashMap[item.date] = item.count;
            // let date_string = date.format('YYYY-MM-DD');
            let date = moment(item.date);
            if (date.isAfter(after)) {
                let week = date.clone().endOf('week').format('x');
                let month = date.clone().endOf('month').format('x');
                if (!weeksHashMap[week]) {
                    weeksHashMap[week] = item.count;
                } else {
                    weeksHashMap[week] += item.count;
                }
                if (!monthsHashMap[month]) {
                    monthsHashMap[month] = item.count;
                } else {
                    monthsHashMap[month] += item.count;
                }
                days.push([parseInt(date.format('x')),  item.count])
                population.push([parseInt(date.format('x')), total])
            }
        })
        _.each(weeksHashMap, (count, date) => {
            weeks.push([parseInt(date), count])
        })
        _.each(monthsHashMap, (count, date) => {
            months.push([parseInt(date), count])
        })
        console.log({days, weeks, months})
        // console.log({datesHashMap, date}, Date.UTC(date.format('YYYY'), date.format('MM'), date.format('DD')), );
        // let i = 0; //failsafe for infinite while
        // while (date.isSameOrBefore(now) && i < 5000) {
        //     i++;
        //     let date_string = date.format('YYYY-MM-DD');
        //     let value = datesHashMap[date_string] || null;
        //     if (value !== null) {
        //         days.push([parseInt(date.format('x')),  value])
        //     }
        //     date.add(1, 'd');
        // }
        // response.data.data.map(row => {
        //     return row.count
        // })


        Highcharts.chart('chart', {

            title: {
                text: 'ANZ faf join rate'
            },

            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%e. %b',
                    week: '%e. %b',
                    month: '%b \'%y',
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
                name: 'per Day',
                data: days
            },{
                name: 'per Week',
                data: weeks
            },{
                name: 'per Month',
                data: months
            },{
                name: 'Population',
                data: population
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
        console.log(e);
    }
}