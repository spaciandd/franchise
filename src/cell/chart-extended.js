import React from 'react'
import ReactDOM from 'react-dom'

import CJS from 'chart.js'

import _ from 'lodash'

function truncateLabel(value) {
    if (value.length > 13) {
        return value.substr(0, 10) + '...'
    }
    return value
}

var CHART_COLORS = [
    'black',
    'silver',
    'gray',
    'white',
    'maroon',
    'red',
    'purple',
    'fuchsia',
    'green',
    'lime',
    'olive',
    'yellow',
    'navy',
    'blue',
    'teal',
    'aqua',
    'antiquewhite',
    'aquamarine',
    'azure',
    'beige',
    'bisque',
    'blanchedalmond',
    'blueviolet',
    'brown',
    'burlywood',
    'cadetblue',
    'chartreuse',
    'chocolate',
    'coral',
    'cornflowerblue',
    'cornsilk',
    'crimson',
    'cyan',
    'aqua',
    'darkblue',
    'darkcyan',
    'darkgoldenrod',
    'darkgray',
    'darkgreen',
    'darkgrey',
    'darkkhaki',
    'darkmagenta',
    'darkolivegreen',
    'darkorange',
    'darkorchid',
    'darkred',
    'darksalmon',
    'darkseagreen',
    'darkslateblue',
    'darkslategray',
    'darkslategrey',
    'darkturquoise',
    'darkviolet',
    'deeppink',
    'deepskyblue',
    'dimgray',
    'dimgrey',
    'dodgerblue',
    'firebrick',
    'floralwhite',
    'forestgreen',
    'gainsboro',
    'ghostwhite',
    'gold',
    'goldenrod',
    'greenyellow',
    'grey',
    'honeydew',
    'hotpink',
    'indianred',
    'indigo',
    'ivory',
    'khaki',
    'lavender',
    'lavenderblush',
    'lawngreen',
    'lemonchiffon',
    'lightblue',
    'lightcoral',
    'lightcyan',
    'lightgoldenrodyellow',
    'lightgray',
    'lightgreen',
    'lightgrey',
    'lightpink',
    'lightsalmon',
    'lightseagreen',
    'lightskyblue',
    'lightslategray',
    'lightslategrey',
    'lightsteelblue',
    'lightyellow',
    'limegreen',
    'linen',
    'magenta',
    'fuchsia',
    'mediumaquamarine',
    'mediumblue',
    'mediumorchid',
    'mediumpurple',
    'mediumseagreen',
    'mediumslateblue',
    'mediumspringgreen',
    'mediumturquoise',
    'mediumvioletred',
    'midnightblue',
    'mintcream',
    'mistyrose',
    'moccasin',
    'navajowhite',
    'oldlace',
    'olivedrab',
    'orangered',
    'orchid',
    'palegoldenrod',
    'palegreen',
    'paleturquoise',
    'palevioletred',
    'papayawhip',
    'peachpuff',
    'peru',
    'pink',
    'plum',
    'powderblue',
    'rosybrown',
    'royalblue',
    'saddlebrown',
    'salmon',
    'sandybrown',
    'seagreen',
    'seashell',
    'sienna',
    'skyblue',
    'slateblue',
    'slategray',
    'slategrey',
    'snow',
    'springgreen',
    'steelblue',
    'tan',
    'thistle',
    'tomato',
    'turquoise',
    'violet',
    'wheat',
    'whitesmoke',
    'yellowgreen',
]

// function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
// }
// shuffleArray(CHART_COLORS)

/* base class for all chartjs visualizers */
class ChartVisualizer extends React.Component {
    static test(result) {
        // return result.columns.length === 1

        return result.values[0].some((k) => !isNaN(+k)) && result.values.length > 1
    }
}

export class DoughnutChartVisualizer extends ChartVisualizer {
    static key = 'doughnut-chart'
    static desc = 'Doughnut Chart'
    static icon = <i className="fa fa-pie-chart" aria-hidden="true" />

    render() {
        let { result, view } = this.props

        let label_index =
            result.columns.map((k, i) => i).find((i) => isNaN(+result.values[0][i])) || 0
        let numeric_col_indices = result.columns
            .map((k, i) => i)
            .filter((k) => !isNaN(+result.values[0][k]) && k != label_index)

        let valid_row_indicies = result.values
            .map((v, i) => [v, i])
            .filter(([v, i]) => numeric_col_indices.every((index) => v[index] != null))
            .map(([v, i]) => i)

        const labels = valid_row_indicies.map((index) => result.values[index][label_index])

        const color = (r, alpha) => 'hsla(' + r * 255 + ', 100%, 50%, ' + alpha + ')'

        const datasets = numeric_col_indices.map((j, i) => {
            const r = i / numeric_col_indices.length
            const data = valid_row_indicies.map((index) => result.values[index][j])

            return {
                borderColor: color(r, 0.4),
                backgroundColor: CHART_COLORS,
                pointBorderColor: 'transparent',
                pointBackgroundColor: 'transparent',
                pointHoverBackgroundColor: color(r, 0.4),
                fill: data.every((d) => d >= 0) && (i ? '-1' : 'start'),
                label: result.columns[j],
                // stack: 'stack1',
                data,
            }
        })

        const options = {
            animation: false,
            tooltips: {
                mode: 'index',
                intersect: true,
            },
            legend: {
                position: 'right',
            },
            maintainAspectRatio: false,
            responsive: true,
        }

        return (
            <div style={{ flex: 1, overflow: 'auto' }} className="chart-container">
                <Chart
                    type="doughnut"
                    options={options}
                    data={{
                        labels,
                        datasets,
                    }}
                />
            </div>
        )
    }
}

export class RadarChartVisualizer extends ChartVisualizer {
    static key = 'radar-chart'
    static desc = 'Radar Chart'
    static icon = <i className="fa fa-bullseye" aria-hidden="true" />

    render() {
        let { result, view } = this.props

        let label_index =
            result.columns.map((k, i) => i).find((i) => isNaN(+result.values[0][i])) || 0
        let numeric_col_indices = result.columns
            .map((k, i) => i)
            .filter((k) => !isNaN(+result.values[0][k]) && k != label_index)

        let valid_row_indicies = result.values
            .map((v, i) => [v, i])
            .filter(([v, i]) => numeric_col_indices.every((index) => v[index] != null))
            .map(([v, i]) => i)

        const labels = valid_row_indicies.map((index) => result.values[index][label_index])

        const color = (r, alpha) => 'hsla(' + r * 255 + ', 100%, 50%, ' + alpha + ')'

        const datasets = numeric_col_indices.map((j, i) => {
            const r = i / numeric_col_indices.length
            const data = valid_row_indicies.map((index) => result.values[index][j])

            return {
                borderColor: color(r, 0.4),
                backgroundColor: color(r, 0.2),
                pointBorderColor: 'transparent',
                pointBackgroundColor: 'transparent',
                pointHoverBackgroundColor: color(r, 0.4),
                fill: data.every((d) => d >= 0) && (i ? '-1' : 'start'),
                label: result.columns[j],
                // stack: 'stack1',
                data,
            }
        })

        const options = {
            animation: false,
            tooltips: {
                mode: 'index',
                intersect: true,
            },
            legend: {
                position: 'right',
            },
            maintainAspectRatio: false,
            responsive: true,
        }

        return (
            <div style={{ flex: 1, overflow: 'auto' }} className="chart-container">
                <Chart
                    type="radar"
                    options={options}
                    data={{
                        labels,
                        datasets,
                    }}
                />
            </div>
        )
    }
}

export class BubbleChartVisualizer extends ChartVisualizer {
    static key = 'bubble-chart'
    static desc = 'Bubble Chart'
    static icon = <i className="fa fa-circle" aria-hidden="true" />

    render() {
        let { result, view } = this.props

        let label_index =
            result.columns.map((k, i) => i).find((i) => isNaN(+result.values[0][i])) || 0
        let numeric_col_indices = result.columns
            .map((k, i) => i)
            .filter((k) => !isNaN(+result.values[0][k]) && k != label_index)

        let valid_row_indicies = result.values
            .map((v, i) => [v, i])
            .filter(([v, i]) => numeric_col_indices.every((index) => v[index] != null))
            .map(([v, i]) => i)

        const labels = valid_row_indicies.map((index) => result.values[index][label_index])

        const color = (r, alpha) => 'hsla(' + r * 255 + ', 100%, 50%, ' + alpha + ')'

        const datasets = numeric_col_indices.map((j, i) => {
            const r = i / numeric_col_indices.length
            const data = valid_row_indicies.map((index) => result.values[index][j])

            return {
                borderColor: color(r, 0.4),
                backgroundColor: color(r, 0.2),
                pointBorderColor: 'transparent',
                pointBackgroundColor: 'transparent',
                pointHoverBackgroundColor: color(r, 0.4),
                fill: data.every((d) => d >= 0) && (i ? '-1' : 'start'),
                label: result.columns[j],
                // stack: 'stack1',
                data,
            }
        })

        const options = {
            animation: false,
            tooltips: {
                mode: 'index',
                intersect: true,
            },
            legend: {
                position: 'right',
            },
            maintainAspectRatio: false,
            responsive: true,
        }

        return (
            <div style={{ flex: 1, overflow: 'auto' }} className="chart-container">
                <Chart
                    type="bubble"
                    options={options}
                    data={{
                        labels,
                        datasets,
                    }}
                />
            </div>
        )
    }
}

export class HistogramChartVisualizer extends ChartVisualizer {
    static key = 'histogram-chart'
    static desc = 'Histogram Chart'
    static icon = <i className="fa fa-signal" aria-hidden="true" />

    render() {
        let { result, view } = this.props

        // result.values is rows of [v1,v2,v3]

        let label_index =
            result.columns.map((k, i) => i).find((i) => isNaN(+result.values[0][i])) || 0
        let numeric_col_indices = result.columns
            .map((k, i) => i)
            .filter((k) => !isNaN(+result.values[0][k]) && k != label_index)

        let valid_row_indicies = result.values
            .map((v, i) => [v, i])
            .filter(([v, i]) => numeric_col_indices.every((index) => v[index] != null))
            .map(([v, i]) => i)

        const labels = valid_row_indicies.map((index) => result.values[index][label_index])

        const color = (r, alpha) => 'hsla(' + r * 255 + ', 100%, 50%, ' + alpha + ')'

        const datasets = numeric_col_indices.map((j, i) => {
            const r = i / numeric_col_indices.length
            const data = valid_row_indicies.map((index) => result.values[index][j])

            return {
                borderColor: color(r, 0.4),
                backgroundColor: color(r, 0.2),
                hoverBackgroundColor: color(r, 0.4),
                // pointBorderColor: 'transparent',
                // pointBackgroundColor: 'transparent',
                // pointHoverBackgroundColor: color(r, .4),
                fill: data.every((d) => d >= 0) && (i ? '-1' : 'start'),
                label: result.columns[j],
                stack: 'stack1',
                data,
            }
        })

        const options = {
            animation: false,
            tooltips: {
                mode: 'index',
                intersect: true,
            },
            scales: {
                xAxes: [
                    {
                        display: false,
                        barPercentage: 1.3,
                        ticks: {
                            max: 3,
                            callback: truncateLabel,
                        },
                        gridLines: {
                            drawOnChartArea: false,
                        },
                    },
                    {
                        display: true,
                        ticks: {
                            autoSkip: false,
                            max: 4,
                        },
                        gridLines: {
                            drawOnChartArea: false,
                        },
                    },
                ],
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                        gridLines: {
                            drawOnChartArea: false,
                        },
                    },
                ],
            },
            maintainAspectRatio: false,
            responsive: true,
        }

        // select "name", "population", "area" * 100 from "geo_states" limit 10
        return (
            <div style={{ flex: 1, overflow: 'auto' }} className="chart-container">
                <Chart
                    type="bar"
                    options={options}
                    data={{
                        labels,
                        datasets,
                    }}
                />
            </div>
        )
    }
}

class Chart extends React.Component {
    componentDidUpdate() {
        // console.log('updated chart')
        const { type, data, options } = this.props
        Object.assign(this.data, { type, data, options })
        this.c.update()
        this.c.resize()
    }

    componentDidMount() {
        const ctx = this.canvas.getContext('2d')
        const { type, data, options } = this.props
        this.data = { type, data, options }
        this.c = new CJS(ctx, this.data)
    }
    render() {
        return <canvas ref={(e) => (this.canvas = e)} className="chart" />
    }
}
