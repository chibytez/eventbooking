import React, { Component } from 'react';

import Backdrop from '../components/Backdrop/Backdrop'
import Modal from '../components/modal/Modal';
import './events.css';
class EventPage extends Component {
  state = {
    creating: false
  };

  startCreateEventHandler = () => {
    this.setState({
      creating:true 
    })
  }

  modalCancelHandler = () => {
    this.setState({
      creating: false
    })
  }

  modalConfirmHandler = () => {
    this.setState({
      creating: false
    })
  }

  render() {
    return (
      <>
        {this.state.creating && <Backdrop/> }
        {this.state.creating &&<Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler}  onConfirm={this.modalConfirmHandler}>
          <p>Modal content</p>
        </Modal>}
        <div className="events-control">
          <p>Create your own events</p>
          <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
        </div>
      </>
    );
  }
}

export default EventPage;
