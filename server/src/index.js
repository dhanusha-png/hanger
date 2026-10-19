import 'dotenv/config';
import express from 'express'; import cors from 'cors'; import mongoose from 'mongoose'; import morgan from 'morgan'; import multer from 'multer'; import path from 'path'; import fs from 'fs';
import {User,Product,Order,Service,Review,Quote,Coupon,Content,Notification,Contact} from './models/index.js';
import {auth,admin} from './middleware/auth.js'; import {hash,compare,token} from './utils/auth.js';
import {registerSchema,loginSchema,formatZodErrors} from './utils/validation.js';

const app=express(); const PORT=process.env.PORT||5000; const uploadDir=path.resolve('uploads'); fs.mkdirSync(uploadDir,{recursive:true});
const allowedOrigins=[process.env.CLIENT_URL||'http://localhost:5173','http://localhost:5173','http://127.0.0.1:5173'];
app.use(cors({origin:(origin,cb)=>{if(!origin||allowedOrigins.includes(origin)||process.env.NODE_ENV!=='production')cb(null,true);else cb(null,true);},credentials:true}));
app.use(express.json({limit:'5mb'})); app.use(morgan('dev')); app.use('/uploads',express.static(uploadDir));

const authAttemptMap=new Map();
function authRateLimiter(maxAttempts=20,windowMs=15*60*1000){
  return (req,res,next)=>{
    const ip=req.ip||req.headers['x-forwarded-for']||req.socket.remoteAddress||'unknown';
    const now=Date.now();
    const entry=authAttemptMap.get(ip)||{count:0,resetAt:now+windowMs};
    if(now>entry.resetAt){entry.count=0;entry.resetAt=now+windowMs;}
    entry.count++;
    authAttemptMap.set(ip,entry);
    if(entry.count>maxAttempts){
      const waitMins=Math.ceil((entry.resetAt-now)/60000);
      return res.status(429).json({message:`Too many attempts. Please try again in ${waitMins} minute${waitMins>1?'s':''}.`});
    }
    next();
  };
}

const storage=multer.diskStorage({destination:(_,__,cb)=>cb(null,uploadDir),filename:(_,file,cb)=>cb(null,Date.now()+'-'+file.originalname.replace(/[^a-zA-Z0-9._-]/g,'-'))}); const uploader=multer({storage});
const publicUser=u=>({_id:String(u._id),id:String(u._id),name:u.name,email:u.email,phone:u.phone||'',role:u.role||'customer',city:u.city||'',pincode:u.pincode||'',acceptedTerms:!!u.acceptedTerms,avatar:u.avatar||'',addresses:u.addresses||[],createdAt:u.createdAt,updatedAt:u.updatedAt});
async function optionalAuth(req,_res,next){
  try {
    const raw=(req.headers.authorization||'').replace('Bearer ','');
    if(raw){
      const jwt = (await import('jsonwebtoken')).default;
      const payload=jwt.verify(raw,process.env.JWT_SECRET||'dev-secret');
      req.user=await User.findById(payload.id).select('-passwordHash');
    }
  } catch {}
  next();
}

app.get('/api/health',(_,res)=>res.json({ok:true,db:mongoose.connection.readyState===1}));
app.post('/api/auth/register',authRateLimiter(15),async(req,res)=>{
  try{
    const parsed=registerSchema.safeParse(req.body);
    if(!parsed.success){
      return res.status(400).json({message:'Please resolve the validation errors.',errors:formatZodErrors(parsed.error)});
    }
    const {name,email,phone,password,city,pincode,acceptedTerms}=parsed.data;
    const existing=await User.findOne({email});
    if(existing){
      return res.status(409).json({message:'An account with this email already exists.',errors:{email:'Email is already registered'}});
    }
    const passwordHash=await hash(password);
    const u=await User.create({name,email,phone,passwordHash,role:'customer',city:city||'',pincode:pincode||'',acceptedTerms:!!acceptedTerms});
    res.status(201).json({token:token(u._id,'7d'),user:publicUser(u)});
  }catch(e){
    console.error('Register error:',e);
    res.status(500).json({message:e.message||'Server error during registration'});
  }
});
app.post('/api/auth/login',authRateLimiter(25),async(req,res)=>{
  try{
    const parsed=loginSchema.safeParse(req.body);
    if(!parsed.success){
      return res.status(400).json({message:'Invalid email or password format.',errors:formatZodErrors(parsed.error)});
    }
    const {email,password,rememberMe}=parsed.data;
    const u=await User.findOne({email});
    if(!u||!(await compare(password,u.passwordHash||''))){
      return res.status(401).json({message:'Invalid email or password.'});
    }
    const expiry=rememberMe?'30d':'7d';
    res.json({token:token(u._id,expiry),user:publicUser(u)});
  }catch(e){
    console.error('Login error:',e);
    res.status(500).json({message:e.message||'Server error during login'});
  }
});
app.get('/api/auth/me',auth,(req,res)=>res.json({user:publicUser(req.user)}));
app.post('/api/auth/logout',(_req,res)=>res.json({ok:true,message:'Logged out successfully'}));
app.put('/api/auth/profile',auth,async(req,res)=>{const allowed=['name','phone','city','pincode','avatar','addresses'];Object.assign(req.user,Object.fromEntries(Object.entries(req.body).filter(([k])=>allowed.includes(k))));await req.user.save();res.json({user:publicUser(req.user)});});
app.post('/api/auth/avatar',auth,uploader.single('file'),async(req,res)=>{if(!req.file)return res.status(400).json({message:'No image selected'});req.user.avatar='/uploads/'+req.file.filename;await req.user.save();res.json({user:publicUser(req.user)});});
app.post('/api/uploads',auth,admin,uploader.array('files',10),(req,res)=>res.json({files:req.files.map(f=>'/uploads/'+f.filename)}));
app.get('/api/products',async(req,res)=>{const q={};if(req.query.category)q.category=req.query.category;if(req.query.featured==='true')q.isFeatured=true;q.isActive=true;res.json(await Product.find(q).sort({isFeatured:-1,createdAt:-1}));});
app.get('/api/products/:slug',async(req,res)=>{const p=await Product.findOne({slug:req.params.slug,isActive:true});if(!p)return res.status(404).json({message:'Product not found'});const reviews=await Review.find({product:p._id,approved:true}).sort({createdAt:-1}).limit(30);res.json({product:p,reviews});});
app.post('/api/products/:id/reviews',auth,async(req,res)=>{const p=await Product.findById(req.params.id);if(!p)return res.status(404).json({message:'Product not found'});const purchased=await Order.exists({user:req.user._id,'items.product':p._id,status:'delivered'});const r=await Review.create({...req.body,user:req.user._id,product:p._id,name:req.user.name,avatar:req.user.avatar,verified:!!purchased});const agg=await Review.aggregate([{$match:{product:p._id,approved:true}},{$group:{_id:null,avg:{$avg:'$rating'},count:{$sum:1}}}]);await Product.findByIdAndUpdate(p._id,{rating:agg[0]?.avg||0,reviewCount:agg[0]?.count||0});res.status(201).json(r);});
app.get('/api/reviews',async(req,res)=>res.json(await Review.find({approved:true}).populate('product','name slug').sort({createdAt:-1}).limit(50)));
app.post('/api/orders',optionalAuth,async(req,res)=>{try{const b=req.body;const ownerId=req.user ? req.user._id : (b.userId&&mongoose.Types.ObjectId.isValid(b.userId)?b.userId:undefined);const items=b.items||[];if(!items.length)return res.status(400).json({message:'Cart is empty'});const ids=items.map(i=>i.product);const ps=await Product.find({_id:{$in:ids},isActive:true});const map=new Map(ps.map(p=>[String(p._id),p]));let subtotal=0,installationTotal=0;const finalItems=items.map(i=>{const p=map.get(String(i.product));if(!p)throw new Error('Product unavailable');const qty=Math.max(1,Number(i.qty)||1);const ip=i.installation?Number(i.installationPrice)||0:0;subtotal+=p.price*qty;installationTotal+=ip*qty;return {product:p._id,name:p.name,image:p.images?.[0]?.url,price:p.price,qty,installation:i.installation,installationPrice:ip};});const shipping=subtotal>=3000?0:99;const o=await Order.create({user:ownerId||undefined,items:finalItems,customer:b.customer,address:b.address,subtotal,installationTotal,shipping,total:subtotal+installationTotal+shipping,paymentMethod:b.paymentMethod,paymentStatus:b.paymentMethod==='razorpay_demo'?'paid':'pending',status:'confirmed',tracking:[{status:'confirmed',note:'Order placed successfully',at:new Date()}]});res.status(201).json({order:o});}catch(e){res.status(400).json({message:e.message});}});
app.get('/api/orders',auth,async(req,res)=>res.json(await Order.find({user:req.user._id}).populate('items.product','slug').sort({createdAt:-1})));
app.get('/api/orders/:id',auth,async(req,res)=>{const q=req.user.role==='admin'?{_id:req.params.id}:{_id:req.params.id,user:req.user._id};const o=await Order.findOne(q).populate('items.product','slug');if(!o)return res.status(404).json({message:'Order not found'});res.json(o);});
app.post('/api/services',async(req,res)=>res.status(201).json(await Service.create(req.body)));
app.get('/api/services',auth,async(req,res)=>res.json(await Service.find(req.user.role==='admin'?{}:{user:req.user._id}).sort({createdAt:-1})));
app.post('/api/quotes',async(req,res)=>res.status(201).json(await Quote.create(req.body)));
app.post('/api/contact',async(req,res)=>{try{const {name,email,phone,requirement,message}=req.body;if(!name||!email||!message)return res.status(400).json({message:'Name, email, and message are required'});const c=await Contact.create({name,email,phone,requirement,message,status:'New'});res.status(201).json({message:'Thank you. Your enquiry has been received.',contact:c});}catch(e){res.status(500).json({message:e.message});}});
app.get('/api/notifications',auth,async(req,res)=>res.json(await Notification.find({user:req.user._id}).sort({createdAt:-1}).limit(50)));
app.post('/api/chat',optionalAuth,async(req,res)=>{const message=String(req.body.message||'').trim();const m=message.toLowerCase();let reply;if(/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(m)){reply='👋 Hello! Welcome to HangerHome. How can I help you today? Would you like to view Products, explore Services, or check your Account?';}else if(m.includes('shoe'))reply='We offer a range of premium shoe rack solutions, including multi-tier organizers, slim entryway cabinets, and compact corner units. You can open Products → Shoe Racks to explore and compare!';else if(m.includes('hanger')||m.includes('product'))reply='Our catalog features precision-engineered ceiling-mounted clothes drying hangers, foldable wall hangers, and heavy-duty drying solutions. You can browse all 20 products in our catalog with specs, pricing, and installation availability.';else if(m.includes('install')||m.includes('repair')||m.includes('fix')||m.includes('service'))reply='We provide end-to-end professional services: Hanger Installation, Repair & Fixing, Custom Hanger Making, Maintenance, and Shoe Rack Assembly. Visit our Services page to book or request a custom quote.';else if(m.includes('cod')||m.includes('cash'))reply='Yes! Cash on Delivery (COD) is available at checkout across supported delivery areas.';else if(m.includes('razorpay')||m.includes('payment'))reply='Online payments are available via Razorpay with Instant Confirmation, UPI, cards, and net banking.';else if(m.includes('order')){if(req.user){const orders=await Order.find({user:req.user._id}).sort({createdAt:-1}).limit(3).select('_id status total createdAt');reply=orders.length?`You have ${orders.length} recent order${orders.length>1?'s':''}. ${orders.map(o=>`Order #${String(o._id).slice(-6).toUpperCase()} is ${o.status} for ₹${Number(o.total||0).toLocaleString('en-IN')}.`).join(' ')}`:'I could not find any orders on your account yet. You can shop from Products and your orders will appear in Account → My Orders.';}else reply='I can explain how orders work, but I can only access order details after you sign in. Open Login → My Orders to view your own order status.';}else if(m.includes('contact')||m.includes('phone')||m.includes('whatsapp')||m.includes('enquiry'))reply='You can reach us directly through our Contact page or WhatsApp. We also accept custom solution requests and site measurement bookings.';else if(m.includes('return')||m.includes('refund'))reply='We prioritize customer satisfaction. If you encounter any issue with your product or installation, our support team will promptly resolve it.';else reply='I can assist you with products, pricing, installation services, shoe racks, orders, custom solutions, and website navigation. Would you like to view Products, Services, or Contact us?';res.json({reply});});
// Admin API
app.get('/api/admin/stats',auth,admin,async(_,res)=>{const [products,orders,customers,services,contacts,revenue]=await Promise.all([Product.countDocuments(),Order.countDocuments(),User.countDocuments({role:'customer'}),Service.countDocuments(),Contact.countDocuments(),Order.aggregate([{$match:{paymentStatus:'paid'}},{$group:{_id:null,total:{$sum:'$total'}}}])]);res.json({products,orders,customers,services,contacts,revenue:revenue[0]?.total||0});});
app.get('/api/admin/products',auth,admin,async(_,res)=>res.json(await Product.find().sort({createdAt:-1})));
app.post('/api/admin/products',auth,admin,async(req,res)=>res.status(201).json(await Product.create(req.body)));
app.put('/api/admin/products/:id',auth,admin,async(req,res)=>res.json(await Product.findByIdAndUpdate(req.params.id,req.body,{new:true})));
app.delete('/api/admin/products/:id',auth,admin,async(req,res)=>{await Product.findByIdAndDelete(req.params.id);res.json({ok:true});});
app.get('/api/admin/orders',auth,admin,async(_,res)=>res.json(await Order.find().populate('user','name email phone').sort({createdAt:-1})));
app.put('/api/admin/orders/:id',auth,admin,async(req,res)=>{const o=await Order.findById(req.params.id);if(!o)return res.status(404).json({message:'Not found'});if(req.body.status){o.status=req.body.status;o.tracking.push({status:req.body.status,note:req.body.note||'',at:new Date()});}if(req.body.paymentStatus)o.paymentStatus=req.body.paymentStatus;await o.save();res.json(o);});
app.get('/api/admin/services',auth,admin,async(_,res)=>res.json(await Service.find().sort({createdAt:-1})));
app.put('/api/admin/services/:id',auth,admin,async(req,res)=>res.json(await Service.findByIdAndUpdate(req.params.id,req.body,{new:true})));
app.get('/api/admin/quotes',auth,admin,async(_,res)=>res.json(await Quote.find().sort({createdAt:-1})));
app.put('/api/admin/quotes/:id',auth,admin,async(req,res)=>res.json(await Quote.findByIdAndUpdate(req.params.id,req.body,{new:true})));
app.get('/api/admin/contacts',auth,admin,async(req,res)=>{const q={};if(req.query.status)q.status=req.query.status;res.json(await Contact.find(q).sort({createdAt:-1}));});
app.put('/api/admin/contacts/:id',auth,admin,async(req,res)=>res.json(await Contact.findByIdAndUpdate(req.params.id,req.body,{new:true})));
app.get('/api/admin/customers',auth,admin,async(_,res)=>res.json(await User.find({role:'customer'}).select('-passwordHash').sort({createdAt:-1})));
app.get('/api/admin/reviews',auth,admin,async(_,res)=>res.json(await Review.find().populate('product','name').sort({createdAt:-1})));
app.put('/api/admin/reviews/:id',auth,admin,async(req,res)=>res.json(await Review.findByIdAndUpdate(req.params.id,req.body,{new:true})));
app.get('/api/content/:key',async(req,res)=>{const c=await Content.findOne({key:req.params.key});res.json(c?.value||{});});
app.put('/api/admin/content/:key',auth,admin,async(req,res)=>res.json(await Content.findOneAndUpdate({key:req.params.key},{key:req.params.key,value:req.body},{upsert:true,new:true})));
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({message:err.message||'Server error'});});
async function start(){await mongoose.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/hanger_commerce');console.log('MongoDB connected');app.listen(PORT,()=>console.log(`API running on http://localhost:${PORT}`));}
start().catch(e=>{console.error('MongoDB connection failed:',e.message);process.exit(1);});
