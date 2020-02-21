import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' 


class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      calendarWeekends: true,
      showModal: false,
      calendarEvents: [{ title: 'Event Now', start: new Date(), description: 'This is a cool event' } ]
    };
  }
  calendarComponentRef = React.createRef()

  render() {
    //console.log(this.state.calendarEvents)
    return (
      <div className='demo-app'>
        <div className='demo-app-calendar'>
          <FullCalendar 
            defaultView="dayGridMonth"
            customButtons={{
              upperTitle: {
                text: 'Calendar View',
              }
            }}
            header={{
              left: 'upperTitle prev next today',
              center: 'title',
              right: 'dayGridMonth timeGridWeek timeGridDay listWeek'
            }}
            buttonText={{
              today:    'today',
              prev:    'back',
              next:     'next',
            }}
            plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
            ref={ this.calendarComponentRef }
            weekends={ this.state.calendarWeekends }
            events={ this.state.calendarEvents }
            dateClick={ this.handleDateClick }
            editable={ true }
            />
        </div>
        <Modal open={this.state.showModal} onClose={() => this.setState({showModal: false})}>
          Test Modal
        </Modal>
      </div>
    )
  }

  handleDateClick = (arg) => {
    console.log(arg)
   
      this.setState({  // add new event data
        // calendarEvents: this.state.calendarEvents.concat({ // creates a new array
        //   title: 'New Event3',
        //   start: arg.date,
        //   allDay: false
        // })
        // calendarEvents: this.state.calendarEvents.concat({ // creates a new array
        //   id: 'description',
        //   title: 'New Event3',
        //   start: '2020-02-21T05:00:00+02:00',
        //   end: '2020-02-21T11:30:00+02:00',
        //   description: 'description',
        //   allDay: false
        // }),
        showModal: !this.state.showModal
      })
  }
}

const Modal = ({ children, onClose, open }) =>
  open ?
  ReactDOM.createPortal(
      <div className='modal'>
        <button onClick={onClose} className='modal__close'>close</button>
        {children}
      </div>,
    document.body)
    : null


export default App;
