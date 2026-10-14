import { handleChat } from '../../server/chat.mjs';

export default request => handleChat(request);
export const config = { path: '/api/chat', rateLimit: { windowLimit: 12, windowSize: 60, aggregateBy: ['ip', 'domain'] } };
