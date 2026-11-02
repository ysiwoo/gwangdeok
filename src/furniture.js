const FLOOR_COL={class:'#c8a274',office:'#a9a49a',exec:'#8f6d54',health:'#cfd6d8',meeting:'#b9a68a',lab:'#a3aaa9',library:'#b48a5c',computer:'#9aa3ab',cafe:'#cfc8b8',kitchen:'#b9c0c2',dorm:'#c49d72',judo:'#3f7fbf',music:'#b88c5a',art:'#c9c0ad',stair:'#aaa59b',toilet:'#d6dde0',hall:'#bab6ad',conn:'#bdb8ae',exhibit:'#b8aa98',storage:'#a8a296',stage:'#9c7650',seats:'#7d8a80'};
function furnish(b,fl,y0){
  const out=[];const {W,lx}=fl;
  const box=(u,v,y,su,sv,h,c)=>{const [x,z]=W(u,v);out.push({x,y:y0+y+h/2,z,sx:lx?su:sv,sy:h,sz:lx?sv:su,c})};
  fl.rooms.forEach(r=>{
    if(r.t==='void')return;
    const uw=r.u1-r.u0,vw=r.v1-r.v0,uc=(r.u0+r.u1)/2,vc=(r.v0+r.v1)/2;
    if(r.t!=='court')box(uc,vc,0,uw,vw,.04,FLOOR_COL[r.t]||'#bab6ad');
    if(r.t==='court'&&uw*vw<400){box(uc,vc,0,uw,vw,.06,'#c99a5a');return}
    const desks=(rows,cols,ua,ub,va,vb,deskC,chairC)=>{for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){const u=rows>1?ua+(ub-ua)*i/(rows-1):ua,v=cols>1?va+(vb-va)*j/(cols-1):va;
      box(u,v,.69,.46,.62,.05,deskC);box(u,v,0,.36,.52,.69,'#8b8f93');box(u+.44,v,.42,.4,.4,.05,chairC);box(u+.64,v,.45,.05,.38,.42,chairC)}};
    switch(r.t){
      case 'exhibit':for(let u=r.u0+2;u<r.u1-1.5;u+=3)for(let v=r.v0+2;v<r.v1-1.5;v+=3){box(u,v,0,.8,.8,1,'#e9e4d8');box(u,v,1,.7,.7,.5,'#b9d0d8')}box(r.u0+.25,vc,.6,.08,vw-1.5,1.4,'#c94b3c');break;
      case 'storage':if(uw>2.5&&vw>2.5)for(let u=r.u0+.8;u<r.u1-.6;u+=1.6)box(u,r.v0+.4,0,1.2,.5,1.8,'#9a8f7d');break;
      case 'stage':box(uc,vc,0,uw-.2,vw-.2,1.1,'#8a6440');break;
      case 'seats':{const lx2=uw>vw;for(let k=0;k<4;k++){if(lx2)box(uc,r.v0+.6+k*.95,k*.35,uw-.4,.9,.35,'#2f6b4a');else box(r.u0+.6+k*.95,vc,k*.35,.9,vw-.4,.35,'#2f6b4a')}break}
      case 'class':case 'music':
        box(r.u0+.07,vc,1,.06,Math.min(4.2,vw-2),1.2,'#2f5e45');box(r.u0+1.5,vc,0,.7,1.4,.78,'#9a7450');
        if(r.t==='music'){box(r.u0+1.6,r.v0+1.4,0,1.5,.7,1.05,'#1b1b1d');desks(3,5,r.u0+3.4,r.u1-2,r.v0+1.4,r.v1-1.4,'#a07a52','#2f2f33')}
        else desks(5,5,r.u0+3,r.u1-1.9,r.v0+1.2,r.v1-1.2,'#c9a46a','#3d6fa8');
        box(r.u1-.25,vc,0,.4,vw-1.4,1.1,'#7f97a8');break;
      case 'office':for(let u=r.u0+1.6;u<r.u1-1.2;u+=2.4)for(let v=r.v0+1.4;v<r.v1-1;v+=1.6){box(u,v,0,1.3,.75,.74,'#d9d4c8');box(u,v,.74,.35,.06,.32,'#26303a');box(u+.85,v,0,.45,.45,.45,'#3c4044')}
        box(r.u1-.3,vc,0,.45,vw-1,1.9,'#a7acb0');break;
      case 'exec':box(r.u0+2,vc,0,.9,1.8,.76,'#5e3f2a');box(r.u0+2.9,vc,0,.6,.6,.6,'#2b2b2b');box(r.u1-2.4,vc,0,1.1,.8,.4,'#6e5240');box(r.u1-2.4,vc-1.3,0,.8,1.9,.45,'#3f2f27');box(r.u1-2.4,vc+1.3,0,.8,1.9,.45,'#3f2f27');box(r.u0+.25,vc,0,.4,vw-1.6,2,'#7a5a43');break;
      case 'health':[r.v0+1,r.v1-1].forEach(v=>{box(uc,v,0,2,.95,.55,'#d8d8d4');box(uc,v,.55,1.9,.9,.12,'#f1f4f6')});box(r.u0+.6,vc,0,.6,1.2,.76,'#d9d4c8');break;
      case 'meeting':box(uc,vc,0,Math.min(6,Math.max(1.2,uw-3.6)),Math.min(1.4,vw-2.4),.74,'#8e7356');for(let u=uc-Math.min(6,uw-3.6)/2+.4;u<uc+Math.min(6,uw-3.6)/2;u+=1.1)[vc-1.2,vc+1.2].forEach(v=>box(u,v,0,.45,.45,.48,'#3c4044'));break;
      case 'lab':box(r.u0+.07,vc,1,.06,Math.min(4.2,vw-2),1.2,'#2f5e45');for(let i=0;i<3;i++)for(let j=0;j<2;j++){const u=r.u0+3+i*(uw-4.5)/2,v=r.v0+vw*(.3+.4*j);box(u,v,0,1.2,2.4,.86,'#d9d6cf');box(u,v,.86,1.25,2.45,.05,'#2c2f33');box(u+.9,v,0,.35,.35,.62,'#3f6f9a');box(u-.9,v,0,.35,.35,.62,'#3f6f9a')}box(r.u1-.3,vc,0,.5,vw-1,1.9,'#e7e4dc');break;
      case 'library':for(let u=r.u0+1.2;u<r.u0+uw*.55;u+=1.7){box(u,vc,0,.45,vw-2.4,2,'#8a6a45');box(u,vc,1.2,.5,vw-2.4,.06,'#d7cdb8')}for(let u=r.u0+uw*.62;u<r.u1-1.4;u+=2.6)for(let v=r.v0+1.8;v<r.v1-1.4;v+=3.2){box(u,v,0,1.2,2.2,.74,'#b48a5c');[-.9,.9].forEach(dv=>box(u+.9,v+dv,0,.42,.42,.45,'#3d6fa8'))}break;
      case 'computer':for(let u=r.u0+1.5;u<r.u1-1;u+=1.9){box(u,vc,0,.7,vw-1.6,.74,'#e2ded4');for(let v=r.v0+1.2;v<r.v1-1;v+=.85){box(u-.1,v,.74,.06,.5,.36,'#1e2328');box(u+.55,v,0,.4,.4,.46,'#2f2f33')}}break;
      case 'cafe':for(let u=r.u0+1.6;u<r.u1-1.2;u+=2.6){box(u,vc,0,.85,vw-2.4,.74,'#ece8de');[-.75,.75].forEach(du=>box(u+du,vc,0,.35,vw-2.6,.44,'#6f8fa8'))}break;
      case 'kitchen':box(uc,r.v0+.5,0,uw-1,.8,.9,'#b8bec2');box(uc,r.v1-.5,0,uw-1,.8,.9,'#b8bec2');box(uc,vc,0,uw*.5,1.4,.9,'#c9ced2');for(let k=0;k<3;k++)box(r.u0+1.5+k*(uw-3)/2,r.v0+.5,.9,.7,.7,.5,'#8f969b');break;
      case 'dorm':box(r.u0+1.3,r.v0+.6,0,2.1,.95,.5,'#9c7650');box(r.u0+1.3,r.v0+.6,.5,2,.9,.14,'#eef0f2');box(r.u0+1.3,r.v1-.6,0,2.1,.95,.5,'#9c7650');box(r.u0+1.3,r.v1-.6,.5,2,.9,.14,'#e8eef6');
        box(r.u1-.5,r.v0+.7,0,.6,1.1,.74,'#c9a46a');box(r.u1-.5,r.v1-.7,0,.6,1.1,.74,'#c9a46a');break;
      case 'judo':box(uc,vc,.04,uw-1,vw-1,.08,'#d24c3a');box(uc,vc,.06,uw-2.6,vw-2.6,.08,'#3e8e5a');break;
      case 'art':for(let i=0;i<2;i++)for(let j=0;j<2;j++)box(r.u0+uw*(.3+.4*i),r.v0+vw*(.3+.4*j),0,1.8,1.2,.74,'#ddd2bd');for(let k=0;k<4;k++)box(r.u1-1.2,r.v0+1+k*(vw-2)/3,0,.12,.7,1.6,'#a0784f');break;
      case 'toilet':for(let k=0;k<3;k++)box(r.u0+.9,r.v0+1+k*1.3,0,1.6,.05,1.9,'#9fb7c6');box(r.u1-.4,vc,0,.5,vw-1.5,.85,'#e9ecee');break;
      case 'stair':{const n=10,st=(uw-1)/n,half=vw/2;for(let i=0;i<n;i++){box(r.u0+.5+st*(i+.5),r.v0+half/2,0,st,half-.2,(i+1)*fl.fh/2/n,'#bdb8ae');box(r.u1-.5-st*(i+.5),r.v1-half/2,fl.fh/2,st,half-.2,(i+1)*fl.fh/2/n,'#bdb8ae')}box(r.u1-.5,vc,0,1,vw-.4,fl.fh/2,'#b4afa5');break}
      case 'court':{box(uc,vc,0,uw,vw,.06,'#c99a5a');const wl=(u,v,su,sv)=>box(u,v,.06,su,sv,.02,'#f4f1ea');wl(uc,r.v0+4,uw-8,.12);wl(uc,r.v1-4,uw-8,.12);wl(r.u0+4,vc,.12,vw-8);wl(r.u1-4,vc,.12,vw-8);wl(uc,vc,.12,vw-8);
        [r.u0+3,r.u1-3].forEach((u,i)=>{box(u+(i?.3:-.3),vc,0,.2,.2,3.4,'#3b4046');box(u,vc,3.1,.08,1.8,1.05,'#f4f6f7');box(u+(i?-.35:.35),vc,3.05,.45,.45,.04,'#e0562e')});
        box(r.u0+1.6,r.v0+vw*.15,0,2.4,vw*.25,1.1,'#7a5537');break}
    }
  });
  return out;
}
