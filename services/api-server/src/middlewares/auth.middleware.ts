// import { NextFunction, Request, Response } from 'express';
// import { verifyToken } from '../utils/jwt';

// export function requireAuth(req: Request, res: Response, next: NextFunction) {
//   const header = req.headers.authorization;
//   const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

//   if (!token || !verifyToken(token)) {
//     return res.status(401).json({ success: false, message: 'Unauthorized' });
//   }

//   return next();
// }
