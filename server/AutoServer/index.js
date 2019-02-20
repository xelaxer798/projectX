import checkNodes from './checkNodes';
import autoAlerts from './autoAlerts/index'
import updateWeatherNodes from './updateWeatherNodes'

const AutoServer = {
    checkNodes,
    autoAlerts,
    updateWeatherNodes
};

export {
    AutoServer as default,
};
