import jwt from 'jsonwebtoken';
import {User} from '../models/index.js';
export async function auth(req,res,next){try{const token=(req.headers.authorization||'').replace('Bearer ',''); if(!token) return res.status(401).json({message:'Authentication required'}); const p=jwt.verify(token,process.env.JWT_SECRET||'dev-secret'); req.user=await User.findById(p.id).select('-passwordHash'); if(!req.user) throw new Error(); next();}catch(e){res.status(401).json({message:'Invalid or expired session'});}}
export function admin(req,res,next){if(req.user?.role!=='admin') return res.status(403).json({message:'Admin access required'}); next();}
