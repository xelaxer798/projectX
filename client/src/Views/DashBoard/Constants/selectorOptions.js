const selectorOptions = {
    buttons: [
        {
            step: 'minute',
            stepmode: 'backward',
            count: 30,
            label: '30m'
        },
        {
            step: 'hour',
            stepmode: 'backward',
            count: 1,
            label: '1h'
        },
        {
            step: 'hour',
            stepmode: 'backward',
            count: 6,
            label: '6h'
        },
        {
            step: 'hour',
            stepmode: 'backward',
            count: 12,
            label: '12h'
        }, {
            step: 'day',
            stepmode: 'backward',
            count: 1,
            label: '1d'
        }, {
            step: 'day',
            stepmode: 'backward',
            count: 7,
            label: '1w'
        }, {
            step: 'month',
            stepmode: 'backward',
            count: 1,
            label: '1m'
        }, {
            step: 'month',
            stepmode: 'backward',
            count: 6,
            label: '6m'
        }, {
            step: 'year',
            stepmode: 'todate',
            count: 1,
            label: 'YTD'
        }, {
            step: 'year',
            stepmode: 'backward',
            count: 1,
            label: '1y'
        }, {
            step: 'all',
            label: 'all'
        }],
};
export default selectorOptions;