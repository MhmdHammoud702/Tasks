import memjs from 'memjs';

const memcached = memjs.Client.create("localhost:11211");

export default memcached;