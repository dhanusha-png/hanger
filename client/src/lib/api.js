const BASE=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
export async function api(path,opts={}){const token=localStorage.getItem('token');const headers={'Content-Type':'application/json',...(opts.headers||{})};if(token)headers.Authorization=`Bearer ${token}`;const r=await fetch(BASE+path,{...opts,headers});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||'Request failed');return d;}
export const img=(u)=>{if(!u)return'/media/hanger-1.jpg';if(u.startsWith('http'))return u;if(u.startsWith('/uploads'))return (import.meta.env.VITE_API_ORIGIN||'http://localhost:5000')+u;return u};

export async function uploadFiles(files){const token=localStorage.getItem('token');const fd=new FormData();[...files].forEach(f=>fd.append('files',f));const r=await fetch(BASE+'/uploads',{method:'POST',headers:token?{Authorization:`Bearer ${token}`}:{},body:fd});const d=await r.json();if(!r.ok)throw new Error(d.message||'Upload failed');return d.files;}
