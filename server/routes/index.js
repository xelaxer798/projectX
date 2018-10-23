import nodeData from './nodeData';
import users from './users';
import warnings from './warnings';
import rooms from './rooms';
import nodes from './nodes';
import sensorData from './sensorData';
import sensors from './sensors'
import alerts from './alerts'

const routers = {
    nodeData,
    users,
    warnings,
    rooms,
    nodes,
    sensorData,
    sensors,
    alerts
};
export {
    routers as default,
};
