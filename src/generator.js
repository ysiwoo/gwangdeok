
// ---------- plan → geometry generator (shared by the model and the game) ----------
const TW=.3,TP=.15,SLAB=.3,PARA=1.0;
const toW=(b,u,v)=>{switch(b.rot){case'W':return[b.X0+v,b.Z0-u];case'S':return[b.X0-u,b.Z0-v];case'N':return[b.X0+u,b.Z0+v];default:return[b.X0-v,b.Z0+u]}};
const lxOf=b=>b.rot==='S'||b.rot==='N';
const dirW=(b,du,dv)=>{switch(b.rot){case'W':return[dv,-du];case'S':return[-du,-dv];case'N':return[du,dv];default:return[-dv,du]}};
function wRect(b,u0,v0,u1,v1){const[a,c]=toW(b,u0,v0),[d,e]=toW(b,u1,v1);return[Math.min(a,d),Math.min(c,e),Math.max(a,d),Math.max(c,e)]}
const fhOf=(b,f)=>{const a=b.fh||[3.6];return a[Math.min(f-1,a.length-1)]};
const y0Of=(b,f)=>{let y=b.base||0;for(let k=1;k<f;k++)y+=fhOf(b,k);return y};
const floorList=b=>Object.keys(b.floors).map(Number).sort((a,c)=>a-c);
const r3=x=>Math.round(x*1000)/1000;
function grid(lists){const us=new Set(),vs=new Set();lists.forEach(l=>l.forEach(r=>{us.add(r3(r.u0));us.add(r3(r.u1));vs.add(r3(r.v0));vs.add(r3(r.v1))}));
  const U=[...us].sort((a,c)=>a-c),V=[...vs].sort((a,c)=>a-c);return{U,V,nu:U.length-1,nv:V.length-1}}
function cover(g,rooms){const id=new Int32Array(Math.max(0,g.nu*g.nv)).fill(-1);
  rooms.forEach((r,k)=>{for(let j=0;j<g.nv;j++){const vc=(g.V[j]+g.V[j+1])/2;if(vc<r.v0||vc>r.v1)continue;for(let i=0;i<g.nu;i++){const uc=(g.U[i]+g.U[i+1])/2;if(uc>r.u0&&uc<r.u1)id[j*g.nu+i]=k}}});return id}
function rectsOf(g,flag){const out=[],used=new Uint8Array(g.nu*g.nv);
  for(let j=0;j<g.nv;j++)for(let i=0;i<g.nu;i++){const k=j*g.nu+i;if(used[k]||!flag[k])continue;const fv=flag[k];let i1=i;while(i1+1<g.nu&&flag[j*g.nu+i1+1]===fv&&!used[j*g.nu+i1+1])i1++;
    let j1=j;outer:while(j1+1<g.nv){for(let ii=i;ii<=i1;ii++){const kk=(j1+1)*g.nu+ii;if(flag[kk]!==fv||used[kk])break outer}j1++}
    for(let jj=j;jj<=j1;jj++)for(let ii=i;ii<=i1;ii++)used[jj*g.nu+ii]=1;out.push({u0:g.U[i],u1:g.U[i1+1],v0:g.V[j],v1:g.V[j1+1],k:fv})}return out}
// boundary segments of a cell id field
function edges(g,id){const seg=[];
  for(let i=0;i<=g.nu;i++)for(let j=0;j<g.nv;j++){const a=i>0?id[j*g.nu+i-1]:-1,c=i<g.nu?id[j*g.nu+i]:-1;if(a!==c)seg.push({ax:'u',at:g.U[i],s0:g.V[j],s1:g.V[j+1],a,c})}
  for(let j=0;j<=g.nv;j++)for(let i=0;i<g.nu;i++){const a=j>0?id[(j-1)*g.nu+i]:-1,c=j<g.nv?id[j*g.nu+i]:-1;if(a!==c)seg.push({ax:'v',at:g.V[j],s0:g.U[i],s1:g.U[i+1],a,c})}
  return seg}
function merge(seg,keyOf){const m=new Map();seg.forEach(s=>{const k=s.ax+'|'+s.at+'|'+keyOf(s);if(!m.has(k))m.set(k,[]);m.get(k).push(s)});const out=[];
  m.forEach(l=>{l.sort((a,c)=>a.s0-c.s0);let cur=null;l.forEach(s=>{if(cur&&Math.abs(cur.s1-s.s0)<1e-6)cur.s1=s.s1;else{if(cur)out.push(cur);cur={...s}}});if(cur)out.push(cur)});return out}
const OPEN=t=>t==='hall'||t==='conn';
const DOORISH=t=>t==='hall'||t==='conn'||t==='stair';
// local box → world box
function lbox(b,u0,u1,v0,v1,y0,y1){const[x0,z0,x1,z1]=wRect(b,u0,v0,u1,v1);return{x:(x0+x1)/2,z:(z0+z1)/2,y:(y0+y1)/2,sx:x1-x0,sz:z1-z0,sy:y1-y0}}
function splitLen(a,b,step){const n=Math.max(1,Math.round((b-a)/step));return Array.from({length:n+1},(_,i)=>a+(b-a)*i/n)}
function extStyle(b,f,t){if(b.gym)return'gym';if(t==='conn')return'ribbon';if(b.ribbonTop&&f===b.ribbonTop)return'ribbon';if(b.blankBelow&&f<=b.blankBelow)return'blank';if(t==='storage'||t==='void')return'blank';return'win'}
const GEN={parts:[],plans:{},solar:[],labels:{}};
function genBuilding(b){
  const fl=floorList(b),parts=GEN.parts,P=(o)=>{o.b=b;parts.push(o);return o};
  b.plan={};let bb=[1e9,1e9,-1e9,-1e9],topY=0;
  fl.forEach((f,fi)=>{
    const rooms=b.floors[f],y0=y0Of(b,f),fh=fhOf(b,f),wallTop=y0+fh-SLAB;topY=Math.max(topY,y0+fh);
    const g=grid([rooms]),id=cover(g,rooms);b.plan[f]={rooms,g,id,y0,fh,W:(u,v)=>toW(b,u,v),lx:lxOf(b)};
    rooms.forEach(r=>{const w=wRect(b,r.u0,r.v0,r.u1,r.v1);bb=[Math.min(bb[0],w[0]),Math.min(bb[1],w[1]),Math.max(bb[2],w[2]),Math.max(bb[3],w[3])]});
    const seg=edges(g,id).map(s=>{const ra=s.a>=0?rooms[s.a]:null,rc=s.c>=0?rooms[s.c]:null;
      if(!ra||!rc){const inside=ra||rc;s.kind='ext';s.out=ra?1:-1;s.style=extStyle(b,f,inside.t);return s}
      if(ra.n===rc.n&&ra.t===rc.t)return null;if(OPEN(ra.t)&&OPEN(rc.t))return null;
      if(ra.t==='void'||rc.t==='void'){if(ra.t==='void'&&rc.t==='void')return null;s.kind='rail';return s}
      s.kind='part';s.door=(DOORISH(ra.t)&&!DOORISH(rc.t))||(DOORISH(rc.t)&&!DOORISH(ra.t));return s}).filter(Boolean);
    const ms=merge(seg,s=>s.kind==='ext'?'e'+s.out+s.style:s.kind==='rail'?'r':'p'+Math.min(s.a,s.c)+'_'+Math.max(s.a,s.c));
    ms.forEach(s=>{
      if(s.kind==='ext'){const step=b.bay*2;const cuts=splitLen(s.s0,s.s1,step);
        for(let k=0;k<cuts.length-1;k++){const a=cuts[k],c=cuts[k+1];const w=s.ax==='u'?(s.out>0?[s.at-TW,s.at]:[s.at,s.at+TW]):null,h=s.ax==='v'?(s.out>0?[s.at-TW,s.at]:[s.at,s.at+TW]):null;
          const bx=s.ax==='u'?lbox(b,w[0],w[1],a,c,y0,wallTop):lbox(b,a,c,h[0],h[1],y0,wallTop);const n=s.ax==='u'?dirW(b,s.out,0):dirW(b,0,s.out);
          P({...bx,k:'ext',f,m:s.style,nx:n[0],nz:n[1],lu:s.ax==='u'?s.at-s.out*.5:(a+c)/2,lv:s.ax==='u'?(a+c)/2:s.at-s.out*.5,len:c-a})}}
      else if(s.kind==='rail'){const bx=s.ax==='u'?lbox(b,s.at-.05,s.at+.05,s.s0,s.s1,y0,y0+1.1):lbox(b,s.s0,s.s1,s.at-.05,s.at+.05,y0,y0+1.1);P({...bx,k:'rail',f,m:'rail'})}
      else{const L=s.s1-s.s0;let gaps=[];if(s.door&&L>=2.2)gaps=L>=6?[[s.s0+.6,s.s0+1.6],[s.s1-1.6,s.s1-.6]]:[[s.s0+.5,s.s0+1.4]];
        let pieces=[[s.s0,s.s1]];gaps.forEach(([g0,g1])=>{pieces=pieces.flatMap(([a,c])=>g1<=a||g0>=c?[[a,c]]:[[a,g0],[g1,c]].filter(p=>p[1]-p[0]>.05))});
        pieces.forEach(([a,c])=>{const cuts=splitLen(a,c,5);for(let k=0;k<cuts.length-1;k++){const bx=s.ax==='u'?lbox(b,s.at-TP/2,s.at+TP/2,cuts[k],cuts[k+1],y0,wallTop):lbox(b,cuts[k],cuts[k+1],s.at-TP/2,s.at+TP/2,y0,wallTop);P({...bx,k:'part',f,m:'part'})}})}});
    // floor slab (floors above ground)
    if(fi>0){const flag=new Int32Array(id.length);for(let k=0;k<id.length;k++)flag[k]=id[k]>=0&&rooms[id[k]].t!=='void'?1:0;
      rectsOf(g,flag).forEach(r=>{splitLen(r.u0,r.u1,6.5).forEach((a,ia,A)=>{if(ia===A.length-1)return;splitLen(r.v0,r.v1,6.5).forEach((c,ic,C)=>{if(ic===C.length-1)return;
        P({...lbox(b,a,A[ia+1],c,C[ic+1],y0-SLAB,y0),k:'slab',f,m:'slab'})})})})}
    // roof over whatever the next floor does not cover
    const up=b.floors[fl[fi+1]]||[];const g2=grid([rooms,up]),i1=cover(g2,rooms),i2=cover(g2,up);
    const flag=new Int32Array(i1.length);for(let k=0;k<i1.length;k++)flag[k]=i1[k]>=0&&i2[k]<0?(rooms[i1[k]].t==='conn'?2:1):0;
    {const rr=rectsOf(g2,flag),yT=y0+fh;
      rr.forEach(r=>{splitLen(r.u0,r.u1,6.5).forEach((a,ia,A)=>{if(ia===A.length-1)return;splitLen(r.v0,r.v1,6.5).forEach((c,ic,C)=>{if(ic===C.length-1)return;
        P({...lbox(b,a,A[ia+1],c,C[ic+1],yT-SLAB,yT),k:'roof',f,m:r.k===2?'glassroof':'roof:'+b.roof})})});
        if(b.solar&&r.k===1&&!up.length&&(r.u1-r.u0)>4.4&&(r.v1-r.v0)>4.4)GEN.solar.push({b,r,y:yT})});
      if(!b.gym&&!b.hip){const rid=new Int32Array(flag.length);for(let k=0;k<flag.length;k++)rid[k]=flag[k]?1:(i2[k]>=0?2:-1);
        edges(g2,rid).forEach(s=>{if(!((s.a===1&&s.c===-1)||(s.c===1&&s.a===-1)))return;const out=s.a===1?1:-1;
          const bx=s.ax==='u'?lbox(b,out>0?s.at-TW:s.at,out>0?s.at:s.at+TW,s.s0,s.s1,yT,yT+PARA):lbox(b,s.s0,s.s1,out>0?s.at-TW:s.at,out>0?s.at:s.at+TW,yT,yT+PARA);
          if(bx.sx*bx.sz>1e-4)P({...bx,k:'para',f,m:'para'})})}}
  });
  b.bbox=bb;b.top=topY;b.cx=(bb[0]+bb[2])/2;b.cz=(bb[1]+bb[3])/2;
}
BLD.forEach(genBuilding);
// building-specific extras from the drawings
{const m=BLD.find(b=>b.id==='mandae');[25,30,35,40,45,50,55].forEach(u=>{const[x,z]=toW(m,u,21.9);GEN.parts.push({b:m,k:'col',f:1,m:'col',round:true,x,z,y:(3*3.6-SLAB)/2,sx:.9,sz:.9,sy:3*3.6-SLAB})});
 const g=BLD.find(b=>b.id==='gwichon');[[36.1,.4],[43.8,.4],[52.5,.4],[36.1,14.8],[43.8,14.8],[48.3,14.8],[52.8,14.8],[59.1,14.8]].forEach(([u,v])=>{const[x,z]=toW(g,u,v);GEN.parts.push({b:g,k:'col',f:1,m:'col',x,z,y:(3.6-SLAB)/2,sx:.6,sz:.6,sy:3.6-SLAB})});
 const gy=BLD.find(b=>b.id==='gym');{const[x0,z0,x1,z1]=wRect(gy,-1.8,-1.8,46.8,36.8);const yT=y0Of(gy,3);
   GEN.parts.push({b:gy,k:'roof',f:2,m:'roof:'+gy.roof,x:(x0+x1)/2,z:(z0+z1)/2,y:yT+.2,sx:x1-x0,sz:z1-z0,sy:.4});
   const[a0,c0,a1,c1]=wRect(gy,-5.25,8.6,0,26.4);GEN.parts.push({b:gy,k:'slab',f:1,m:'slab',x:(a0+a1)/2,z:(c0+c1)/2,y:gy.base+.15,sx:a1-a0,sz:c1-c0,sy:.3});
   const[e0,f0,e1,f1]=wRect(gy,-4.5,8.6,0,26.4);GEN.parts.push({b:gy,k:'roof',f:1,m:'roof:'+gy.roof,x:(e0+e1)/2,z:(f0+f1)/2,y:gy.base+4.2,sx:e1-e0,sz:f1-f0,sy:.3});
   [[-4.2,9],[-4.2,17.5],[-4.2,26]].forEach(([u,v])=>{const[x,z]=toW(gy,u,v);GEN.parts.push({b:gy,k:'col',f:1,m:'col',x,z,y:gy.base+2.05,sx:.4,sz:.4,sy:4.1})})}
}
