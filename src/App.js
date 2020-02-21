import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import { Calendar } from "@fullcalendar/core";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' 

let calendar;

var today = new Date();
var y = today.getFullYear();
var m = today.getMonth();
var d = today.getDate();

const events = [
  {
    id: 1,
    title: "Call with Dave",
    start: new Date(),
    allDay: true,
    className: "bg-red",
    description:
      "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
  },
]
class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      events: events,
    };
  }
  componentDidMount() {
    this.createCalendar();
  }

  createCalendar = () => {
    calendar = new Calendar(this.refs.calendar, {
      plugins: [interactionPlugin, dayGridPlugin],
      defaultView: "dayGridMonth",
      selectable: true,
      selectHelper: true,
      editable: true,
      events: this.state.events,
      //Add new event
      select: info => {
        this.setState({
          modalAdd: true,
          startDate: info.startStr,
          endDate: info.endStr,
          radios: "bg-info"
        });
      },
      // Edit calendar event action
      eventClick: ({ event }) => {
        this.setState({
          modalChange: true,
          eventId: event.id,
          eventTitle: event.title,
          eventDescription: event.extendedProps.description,
          radios: "bg-info",
          event: event
        });
      }
    });
    calendar.render();
    this.setState({
      currentDate: calendar.view.title
    });
  };

  changeView = newView => {
    calendar.changeView(newView);
    this.setState({
      currentDate: calendar.view.title
    });
  };
  addNewEvent = () => {
    var newEvents = this.state.events;
    newEvents.push({
      title: this.state.eventTitle,
      start: this.state.startDate,
      end: this.state.endDate,
      className: this.state.radios,
      id: this.state.events[this.state.events.length - 1] + 1,
      allDay: false
    });
    calendar.addEvent({
      title: this.state.eventTitle,
      start: this.state.startDate,
      end: this.state.endDate,
      className: this.state.radios,
      id: this.state.events[this.state.events.length - 1] + 1,
      allDay: false
    });
    this.setState({
      modalAdd: false,
      events: newEvents,
      startDate: undefined,
      endDate: undefined,
      radios: "bg-info",
      eventTitle: undefined
    });
  };
  changeEvent = () => {
    var newEvents = this.state.events.map((prop, key) => {
      if (prop.id + "" === this.state.eventId + "") {
        this.state.event.remove();
        calendar.addEvent({
          ...prop,
          title: this.state.eventTitle,
          className: this.state.radios,
          description: this.state.eventDescription
        });
        return {
          ...prop,
          title: this.state.eventTitle,
          className: this.state.radios,
          description: this.state.eventDescription
        };
      } else {
        return prop;
      }
    });
    this.setState({
      modalChange: false,
      events: newEvents,
      radios: "bg-info",
      eventTitle: undefined,
      eventDescription: undefined,
      eventId: undefined,
      event: undefined
    });
  };
  deleteEventSweetAlert = () => {
    this.setState({
      alert: false,
      radios: "bg-info",
      eventTitle: undefined,
      eventDescription: undefined,
      eventId: undefined
    })
  };
  deleteEvent = () => {
    var newEvents = this.state.events.filter(
      prop => prop.id + "" !== this.state.eventId
    );
    this.state.event.remove();
    this.setState({
      modalChange: false,
      events: newEvents,
      radios: "bg-info",
      eventTitle: undefined,
      eventDescription: undefined,
      eventId: undefined,
      event: undefined
    });
  };

  onchangeHandler = (e) => {
    this.setState({[e.target.name]: e.target.value})
    console.log(this.state)
  }

  render() {
    return (
      <div className='demo-app'>
        <h6 className="">
          {this.state.currentDate}
        </h6>
         <div className="calendar" ref="calendar" />
        {
          this.state.modalAdd ?
            <Modal toggle={() => this.setState({ modalAdd: false })} change={this.onchangeHandler } save={this.addNewEvent}/>
          : null
        }
                {
          this.state.modalChange ?
            <Modal toggle={() => this.setState({ modalChange: false })} change={this.onchangeHandler } save={this.changeEvent}/>
          : null
        }
      </div>
    )
  }
  
}

const Modal = ({ toggle, change, save }) => {
    return(
      <div className="modal-body">
      <form className="new-event--form">
          <label className="form-control-label">Event title</label>
          <input
            placeholder="Event Title"
            type="text"
            name="eventTitle"
            onChange={change}
          />
          <input
            placeholder="start"
            type="text"
            name="startDate"
            onChange={change}
          />
                    <input
            placeholder="start"
            type="text"
            name="endDate"
            onChange={change}
          />
          <textarea rows="5" cols="20" name="eventDescription" onChange={change}></textarea>
          <button onClick={toggle}>close</button>
          <button onClick={save}>Add</button>
      </form>
    </div>
    )

}


export default App;
