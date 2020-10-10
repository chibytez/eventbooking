/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-const */
/* eslint-disable no-useless-catch */
/* eslint-disable no-shadow */
import DataLoader from 'dataloader';
import Event from '../../models/event';
import User from '../../models/user';
import { dateToString } from '../../helpers/date';

const eventLoader = new DataLoader(eventIds => events(eventIds));

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => transformEvent(event));
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      createdEvents: eventLoader.loadMany.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

const transformEvent = event => ({
  ...event._doc,
  date: dateToString(event._doc.date),
  creator: user.bind(this, event.creator)
});

const transformBooking = booking => ({
  ...booking._doc,
  user: user.bind(this, booking._doc.user),
  event: singleEvent.bind(this, booking._doc.event),
  createdAt: dateToString(booking._doc.createdAt),
  updatedAt: dateToString(booking._doc.createdAt)
});

export { transformEvent, transformBooking };
