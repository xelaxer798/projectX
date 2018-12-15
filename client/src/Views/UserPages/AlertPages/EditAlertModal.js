import React, {Component} from 'react';
import Modal from 'react-modal';

class EditAlertModal extends Component {


    render() {
        return (
            <Modal
            isOpen={this.props.isOpen}>
                A component modal
                <button onClick={this.props.closeModal}>Close modal</button>
            </Modal>
        )
    }
}

export default EditAlertModal;