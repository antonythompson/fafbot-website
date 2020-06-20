
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
        let response = await axios.get('/guilds')
        let data = response.data.data;
        let select = document.querySelector('select#guilds');
        select.addEventListener('change', async e => {
            let option = document.querySelector('select#guilds option[value="'+e.target.value+'"]');
            await getData(option.value, option.text)
        })
        if (select) {
            select.innerHTML = '';
            let selected_guild
            data.forEach(guild => {
                if (!selected_guild) {
                    selected_guild = guild
                }
                let option = document.createElement('option');
                option.value = guild.guild_id
                option.text = guild.name
                select.appendChild(option);
            })
            await getData(selected_guild.guild_id, selected_guild.name)
        }

    } catch (e) {
        console.log(e);
    }
}

async function getData(guild_id, name){
    let response = await axios.get('/joins', {params: {guild_id}})
    let data = response.data.data;

    let population = [];
    let days = [];
    let months = [];
    let weeks = [];
    let weeksHashMap = {};
    let monthsHashMap = {};
    console.log(data);

    let total = 0;
    let after = moment('2018-01-01')
    data.forEach((item, i)=> {
        total += item.count
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

    Highcharts.chart('chart', {

        title: {
            text: name + ' join rate'
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
}