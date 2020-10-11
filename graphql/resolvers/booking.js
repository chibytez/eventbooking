/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-const */
/* eslint-disable no-useless-catch */
/* eslint-disable no-shadow */
import Event from '../../models/event';
import Booking from '../../models/booking';
import { transformEvent, transformBooking } from './merge';

export default {
  bookings: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map((booking) => transformBooking(booking));
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent,
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
