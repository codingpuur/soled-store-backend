declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      // ... other user properties
    };
  }


//   export interface Routes {
//     '/api/auth': {
//       '/login': {
//         post: { body: { email: string, password: string } }
//       },
//       '/register': {
//         post: { body: { email: string, password: string, name: string } }
//       }
//     },
//     '/api/wallet': {
//       '/balance': {
//         get: {}
//       },
//       '/add': {
//         post: { body: { amount: number } }
//       }
//     },
//     '/api/payment': {
//       '/webhook': {
//         post: { headers: { 'stripe-signature': string }, body: any }
//       }
//     }
//   }
}