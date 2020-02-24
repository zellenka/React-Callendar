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

const events = [
  // {
  //   id: 1,
  //   title: "Call with Dave",
  //   start: new Date(),
  //   allDay: true,
  //   className: "bg-red",
  //   description:
  //     "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
  // },
  // {
  //   id: 2,
  //   title: "Call with Dave2",
  //   start: new Date(),
  //   allDay: true,
  //   className: "bg-red",
  //   description:
  //     "Nullam id dolor id nibh ultricies vehicula ut id elit."
  // },
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
        this.setState({
          modalChange: true,
          eventId: event.id,
          eventTitle: event.title,
          description: event.extendedProps.eventDescription,
          event: event
        });
        
      },
      dateClick: (info) => {
        this.setState({
          modalAdd: true,
          element: info.dateStr,
          coordinates: {
            top: info.jsEvent.pageY - 117,
            left: info.dayEl.offsetLeft + 70
          }
        });
      }
    });

    calendar.render();

  };
  changeView = newView => {
    calendar.changeView(newView);
    this.setState({
      currentDate: calendar.view.title
    });
  };
  addNewEvent = (e) => {
    e.preventDefault()

    const newEvent = {
      title: this.state.eventTitle,
      description: this.state.eventDescription,
      start: this.state.startDate,
      id:this.state.events.length
    }

    this.setState(()=>({
      events: this.state.events.concat(newEvent),
      modalAdd: false
    }));

    calendar.addEvent({
      title: newEvent.title,
      start: newEvent.start,
      id: newEvent.id,
      eventDescription: newEvent.description,
      allDay: false
    });

    //console.log(this.state, calendar)
  };
  changeEvent = (e) => {

    e.preventDefault()

    var newEvents = this.state.events.map((prop, key) => {
      if (prop.id + "" === this.state.eventId + "") {

        calendar.getEventById(this.state.eventId).remove();
        
        this.state.event.remove();

        calendar.addEvent({
          title: this.state.eventTitle,
          start: this.state.startDate,
          id: this.state.events.length,
          description :this.state.eventDescription,
          allDay: false,
        });
      } else {
        return prop;
      }
    });

    this.setState({
      modalChange: false
    })
  };
  deleteEvent = (e) => {
    e.preventDefault()
    var newEvents = this.state.events.filter(
      prop => prop.id + "" !== this.state.eventId
    );
    this.state.event.remove();
    this.setState({
      modalChange: false,
      events: newEvents,
      eventTitle: undefined,
      eventDescription: undefined,
      eventId: undefined,
      event: undefined
    });
  };
  onchangeHandler = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }
  closeHandler = () => {
    this.setState({
      modalAdd: false,
      modalChange: false
    })
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
            <ModalAdd
            toggle={() => this.setState({ modalAdd: false })}
            change={this.onchangeHandler }
            save={this.addNewEvent}
            coored={this.state.coordinates}
            />
          : null
        }
        {
          this.state.modalChange ?
            // <ModalChange 
            //   toggle={() => this.setState({ modalChange: false })} 
            //   change={this.onchangeHandler } 
            //   save={this.changeEvent}
            //   deleteEvent={this.deleteEvent}
            // />
            <div className="modal-body">
            <form className="block-form">
                <label className="form-control-label">Event title</label>
                <input
                  placeholder="Event Title"
                  type="text"
                  name="eventTitle"
                  value={this.state.eventTitle}
                  onChange={this.onchangeHandler}
                />
                <input
                  placeholder="start"
                  type="datetime-local"
                  name="startDate"
                  //value="2020-02-25T01:00"
                  value={this.state.startDate}
                  onChange={this.onchangeHandler}
                />
                <textarea rows="5" cols="20" 
                name="description" 
                onChange={this.onchangeHandler} 
                value={this.state.description}
                />
                  
                <div className="buttons-form">
                  <button onClick={this.deleteEvent} className="button-form buttons__cancel">Discart</button>
                  <button onClick={this.changeEvent} className="button-form ">Edit</button>  
                </div>
            </form>
            <button className="modal-close" onClick={() => this.setState({ modalAdd: false })}>X</button>
          </div>
          : null
        }
      </div>
    )
  }
  
}

const ModalAdd = ({ toggle, change, save, coored }) => {
    return ReactDOM.createPortal(
      <div className="modal-body" style={{top: coored.top + 'px', left: coored.left + 'px'}}>
        <form className="block-form" onSubmit={save}>
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
            <button onClick={toggle} className="button-form buttons__cancel">Close</button>
            <button className="button-form buttons__save">Save</button>
          </div>
      </form>
      <button class="modal-close" onClick={toggle}>X</button>
    </div>,
     document.querySelector('.fc-view'))

}

const ModalChange = ({ toggle, change, save, deleteEvent }) => {
  return(
    <div className="modal-body">
    <form className="block-form">
        <label className="form-control-label">Event title</label>
        <input
          placeholder="Event Title"
          type="text"
          name="eventTitle"
          //value={this.state.eventTitle}
          onChange={change}
        />
        <input
          placeholder="start"
          type="datetime-local"
          name="startDate"
          //value="2020-02-25T01:00"
          //value={this.state.startDate}
          onChange={change}
        />
        <textarea rows="5" cols="20" 
        name="eventDescription" 
        onChange={change} 
        //value={this.state.eventDescription}
        />
          
        <div className="buttons-form">
          <button onClick={deleteEvent} className="button-form buttons__cancel">Discart</button>
          <button onClick={save} className="button-form ">Edit</button>  
        </div>
    </form>
    <button className="modal-close" onClick={toggle}>X</button>
  </div>
  )

}

export default App;
