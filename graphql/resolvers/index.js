import bcrypt from 'bcryptjs'

import Event from '../../models/event'
import User from '../../models/user'
import Booking from '../../models/booking'

const events = async eventIds => {
  try {
    const events = await Event.find({_id: { $in: eventIds} })
    return events.map(event => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
      }
    })
  } catch (error) {
    throw error
  }
  
}

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      creator: user.bind(this, event.creator)
    };
  } catch (err) {
    throw err;
  }
}

const user = async userId => {
  try {
    const user = await User.findById(userId)
    return { 
        ...user._doc, 
        createdEvents: events.bind(this, user._doc.createdEvents )}
  } catch (error) {
    throw error;
  }
}

export default {
  events:async () => {
    try {
      const events = await Event.find()
      return events.map(event =>{
        return { 
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator)
         }
      })
    } catch (error) {
      throw error
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return {
          ...booking._doc,
          user: user.bind(this,booking._doc.user ),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.createdAt).toISOString()
        }
      })
    } catch (error) {
      throw error
    }
  },
  createEvent: async args => {
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator:'5f71fd39b618544280412b78'
      });
      let createdEvent;
      const result = await event
        .save()
          createdEvent =  {
            ...result._doc, 
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, result._doc.creator) }
         const creator = await User.findById('5f71fd39b618544280412b78')
          if(!creator) {
            throw new Error('User not found.')
          }
          creator.createdEvents.push(event);
          await creator.save();
    
          return createdEvent
    } catch (error) {
      throw error
    }
  }, 
  createUser: async args => {
    try {
      const existingUser= await User.findOne({email: args.userInput.email})
        if(existingUser) {
          throw new Error('User exists already.')
        }
        const hashedPassword = await bcrypt
        .hash(args.userInput.password, 12)
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        })
        const result = await user.save()
        return {...result._doc, password: null }
    } catch (error) {
      throw error
    }    
  },
bookEvent: async args => {
  try {
    const fetchedEvent = await Event.findOne({ _id: args.eventId});
    const booking = new Booking({
      user: '5f71fd39b618544280412b78',
      event: fetchedEvent
    })
    const result = await booking.save();
    return {
      ...result._doc,
      user: user.bind(this,booking._doc.user ),
      event: singleEvent.bind(this, booking._doc.event),
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.createdAt).toISOString()
    }
    
  } catch (error) {
    throw error
  }
},
cancelBooking: async args => {
  try {
    const booking  = await Booking.findById(args.bookingId).populate('event');
    const event = {
      ...booking.event._doc,
      creator: user.bind(this, booking.event._doc.creator)
    }
     await Booking.deleteOne({_id: args.bookingId})
     return event;
  } catch (error) {
    throw error
  }
}

  
} 