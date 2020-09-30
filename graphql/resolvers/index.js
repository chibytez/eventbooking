import authResolver from './auth';
import eventResolver from './event';
import bookingResolver from './booking';

const rootResolver = {
  ...authResolver,
  ...eventResolver,
  ...bookingResolver
};

export default rootResolver;
