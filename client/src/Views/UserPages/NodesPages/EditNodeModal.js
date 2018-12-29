import React, {Component} from 'react';
import Modal from 'react-modal';

class EditNodeModal extends Component {


    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}>
                A component modal
                {JSON.stringify(this.props.nodeToEdit)}
                <button onClick={this.props.closeModal}>Close modal</button>
            </Modal>
        )
    }
}

export default EditNodeModal;