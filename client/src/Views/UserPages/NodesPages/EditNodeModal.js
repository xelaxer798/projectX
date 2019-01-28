import React, {Component} from 'react';
import Modal from 'react-modal';
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";

class EditNodeModal extends Component {


    render() {
        const node = this.props.nodeToEdit;
        return (
            <Modal
                isOpen={this.props.isOpen}>
                {JSON.stringify(node)}
                <button className="btn-primary btn-xs" onClick={this.props.closeModal}>Close modal</button>
                <Form ref={c => {
                    this.form = c
                }} onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="small-12 medium-2 columns">
                            <label>
                                Node Id
                                <Input
                                    placeholder="Node Id"
                                    type="text"
                                    disabled="true"
                                    value={node.nodeId}
                                    name="nodeId"
                                />
                            </label>
                        </div>
                        <div className="small-12 medium-3 columns">
                            <label>
                                Node Name*
                                <Input
                                    placeholder="Node Name"
                                    type="text"
                                    name="nodeName"
                                    style={{ width: "250px" }}
                                    value={node.nodeName}
                                />
                            </label>
                        </div>
                        <div className="small-12 medium-2 columns">
                            <label>
                                Last Updated
                                <Input
                                    placeholder="Last Updated"
                                    type="text"
                                    disabled="true"
                                    value={node.updatedAt}
                                    name="lastUpdated"
                                />
                            </label>
                        </div>
                    </div>
                </Form>
            </Modal>
        )
    }
}

export default EditNodeModal;