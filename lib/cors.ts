import Cors from 'cors'

// Initialize CORS
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  origin: 'https://life.vercel.app', // Replace with your frontend domain
  credentials: true, // Allow cookies to be sent with requests
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function runCors(req: any, res: any, next: Function) {
  return new Promise((resolve, reject) => {
    cors(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
