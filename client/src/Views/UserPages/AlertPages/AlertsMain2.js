import React, {Component} from 'react';

import AlertsApi from '../../../Data/alerts-api'

import Images from "../../../Images";

import CRUDTable,
{
    Fields,
    Field,
    CreateForm,
    UpdateForm,
    DeleteForm,
} from 'react-crud-table';


class AlertsMain2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    DescriptionRenderer = ({ field }) => <textarea {...field} />;

    tasks = [
        {
            'alertId':"19f903e6-5e1d-46b4-b91f-300320fade86",
            "alertName":"Alert Name",
            "highValue":null,
            "lowValue":null,
            "status":null,
            "active":null,
            "createdAt":"2018-10-31T22:50:01.000Z",
            "updatedAt":"2018-10-31T22:50:01.000Z",
            "sensorId":null}
            ];


    SORTERS = {
        NUMBER_ASCENDING: mapper => (a, b) => mapper(a) - mapper(b),
        NUMBER_DESCENDING: mapper => (a, b) => mapper(b) - mapper(a),
        STRING_ASCENDING: mapper => (a, b) => mapper(a).localeCompare(mapper(b)),
        STRING_DESCENDING: mapper => (a, b) => mapper(b).localeCompare(mapper(a)),
    };

    getSorter = (data) => {
        const mapper = x => x[data.field];
        let sorter = this.SORTERS.STRING_ASCENDING(mapper);

        if (data.field === 'id') {
            sorter = data.direction === 'ascending' ?
                this.SORTERS.NUMBER_ASCENDING(mapper) : this.SORTERS.NUMBER_DESCENDING(mapper);
        } else {
            sorter = data.direction === 'ascending' ?
                this.SORTERS.STRING_ASCENDING(mapper) : this.SORTERS.STRING_DESCENDING(mapper);
        }

        return sorter;
    };

    componentDidMount = () => {
        this.getAlerts();
    };

    count = this.tasks.length;

    getAlerts() {
        AlertsApi.getAlerts().then(results => {
            let returnResults = Array.from(results);
            // returnResults = returnResults.sort(this.getSorter(payload.sort));
            this.setState({
                alerts: returnResults,
                loading: false
            });
        });
    }

    service = {
        fetchItems: (payload) => {
            console.log("Payload: " + JSON.stringify(payload));
            AlertsApi.getAlerts().then(results => {
                let returnResults = Array.from(results);
                // returnResults = returnResults.sort(this.getSorter(payload.sort));
                return Promise.resolve(results);
            })
         },
        create: (task) => {
            this.count += 1;
            this.tasks.push({
                ...task,
                id: this.count,
            });
            return Promise.resolve(task);
        },
        update: (data) => {
            const task = this.tasks.find(t => t.id === data.id);
            task.title = data.title;
            task.description = data.description;
            return Promise.resolve(task);
        },
        delete: (data) => {
            const task = this.tasks.find(t => t.id === data.id);
            this.tasks = this.tasks.filter(t => t.id !== task.id);
            return Promise.resolve(task);
        },
    };

    styles = {
        container: { margin: 'auto', width: 'fit-content' },
    };

    render() {
        console.log(this.state.alerts);
        if (this.state.loading) {
            return (
                <div>
                    <h1>Your data is loading</h1>
                    <img src={Images.loadingGif} alt='loading'/>
                </div>
            )
        } else
            return (
            <div style={this.styles.container}>
                <CRUDTable
                    caption="Tasks"
                    // fetchItems={payload => this.service.fetchItems(payload)}
                    items={this.state.alerts}
                >
                    <Fields>
                        <Field
                            name="alertId"
                            label="alertId"
                            hideInCreateForm
                        />
                        <Field
                            name="alertName"
                            label="alertName"
                            placeholder="Title"
                        />
                        <Field
                            name="highValue"
                            label="highValue"
                            render={this.DescriptionRenderer}
                        />
                    </Fields>
                    <CreateForm
                        title="Task Creation"
                        message="Create a new task!"
                        trigger="Create Task"
                        onSubmit={task => this.service.create(task)}
                        submitText="Create"
                        validate={(values) => {
                            const errors = {};
                            if (!values.title) {
                                errors.title = 'Please, provide task\'s title';
                            }

                            if (!values.description) {
                                errors.description = 'Please, provide task\'s description';
                            }

                            return errors;
                        }}
                    />

                </CRUDTable>
            </div>
        )
    }

}

export default AlertsMain2;