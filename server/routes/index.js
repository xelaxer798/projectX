import nodeData from './nodeData';
import users from './users';
import warnings from './warnings';
import rooms from './rooms';
import nodes from './nodes';
import sensorData from './sensorData';
import sensors from './sensors'
import alerts from './alerts'
import sensorErrors from './sensorErrors';
import webCamImages from './webCamImages';
import crops from './crops'

const routers = {
    nodeData,
    users,
    warnings,
    rooms,
    nodes,
    sensorData,
    sensors,
    alerts,
    sensorErrors,
    webCamImages,
    crops
};
export {
    routers as default,
};
