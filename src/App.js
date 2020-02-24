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

// var today = new Date();
// var y = today.getFullYear();
// var m = today.getMonth();
// var d = today.getDate();

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
  {
    id: 2,
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
      selectHelper: false,
      editable: true,
      header: {
        left: "today, prev, next",
        center: "title",
        right: "month, agendaWeek",
        eventLimit: true
      },
      events: this.state.events,
      // Edit calendar event action
      eventClick: ({ event }) => {
        // this.setState({
        //   modalChange: true,
        //   eventId: event.id,
        //   eventTitle: event.title,
        //   eventDescription: event.extendedProps.description,
        //   radios: "bg-info",
        //   event: event
        // });

        let eventToPass = this.state.events.filter(function(el){
          return +el.id === +event.id
        })
        this.setState({
          modalChange: true,
          eventToPass: eventToPass[0]
          // coordinates: {
          //   top: info.jsEvent.pageY,
          //   left: info.jsEvent.pageX
          // }
        });
        
      },
      dateClick: (info) => {
        this.setState({
          modalAdd: true,
          coordinates: {
            top: info.jsEvent.pageY,
            left: info.jsEvent.pageX
          }
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
       <div className="calendar-block_top">
         <div className="calendar-head">Calendar View</div>
       <div className="buttons-wrapper">
                  <button
                    className="fc-button fc-button-primary"
                    data-calendar-view="month"
                    onClick={() => this.changeView("dayGridMonth")}
                    
                  >
                    Month
                  </button>
                  <button
                    className="fc-button fc-button-primary"
                    data-calendar-view="basicWeek"
                    onClick={() => this.changeView("dayGridWeek")}
                  >
                    Week
                  </button>
                  <button
                    className="fc-button fc-button-primary"
                    data-calendar-view="basicDay"
                    onClick={() => this.changeView("dayGridDay")}
                  >
                    Day
                  </button>
                  <button
                    className="fc-button fc-button-primary"
                    data-calendar-view="basicDay"
                    onClick={() => this.changeView("agendaDay")}
                  >
                    AgendaDay
                  </button>
                </div>
       </div>
         <div className="calendar" ref="calendar" />
        {
          this.state.modalAdd ?
            <ModalAdd toggle={() => this.setState({ modalAdd: false })} change={this.onchangeHandler } save={this.addNewEvent} coordinates={this.state.coordinates}/>
          : null
        }
                {
          this.state.modalChange ?
            <ModalChange 
              toggle={() => this.setState({ modalChange: false })} 
              change={this.onchangeHandler } save={this.changeEvent} 
              coordinates={this.state.coordinates}
              eventToPass={this.state.eventToPass}
            />
          : null
        }
      </div>
    )
  }
  
}

const ModalAdd = ({ toggle, change, save, coordinates }) => {
    return(
      <div className="modal-body" style={{top: coordinates.top + 'px', left: coordinates.left + 'px'}}>
      <form className="block-form">
          <label className="form-control-label">Event title</label>
          <input
            placeholder="Event Title"
            type="text"
            name="eventTitle"
            onChange={change}
          />
          <input
            placeholder="start"
            type="datetime-local"
            name="startDate"
            onChange={change}
          />
          <textarea rows="5" cols="20" name="eventDescription" onChange={change}></textarea>
          <div className="buttons-form">
            <button onClick={toggle} className="button-form buttons__cancel">close</button>
            <button onClick={save} className="button-form buttons__cancel">Save</button>
          </div>
      </form>
    </div>
    )

}

const ModalChange = ({ toggle, change, save, coordinates, eventToPass }) => {
  console.log(eventToPass.start.toISOString().slice(0, -5))
  return(
    <div className="modal-body" style={{top: coordinates.top + 'px', left: coordinates.left + 'px'}}>
    <form className="block-form">
        <label className="form-control-label">Event title</label>
        <input
          placeholder="Event Title"
          type="text"
          name="eventTitle"
          value={eventToPass.title}
          onChange={change}
        />
        <input
          placeholder="start"
          type="datetime-local"
          name="startDate"
          //value="2020-02-25T01:00"
          value={eventToPass.start.toISOString().slice(0, -5)}
          onChange={change}
        />
        <textarea rows="5" cols="20" name="eventDescription" onChange={change} value={eventToPass.description}></textarea>
        <div className="buttons-form">
          <button className="button-form buttons__cancel">Discart</button>
          <button onClick={save} className="button-form buttons__cancel">Edit</button>  
        </div>
    </form>
  </div>
  )

}

export default App;
