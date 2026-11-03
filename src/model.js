
// ---------- static building meshes (one instanced mesh per building · floor · material) ----------
const pickables=[];
const originOf=b=>new THREE.Vector3(b.X0,b.base||0,b.Z0);
function instParts(list,b,sizeFn){const {mat}=matFor(list[0]);const geo=list[0].round?new THREE.CylinderGeometry(.5,.5,1,20):new THREE.BoxGeometry(1,1,1),n=list.length,o=originOf(b);
  const ar=new Float32Array(n*3),as=new Float32Array(n*3);
  const mesh=new THREE.InstancedMesh(geo,mat,n);
  list.forEach((p,i)=>{const q=sizeFn?sizeFn(p):p;dummy.position.set(q.x,q.y,q.z);dummy.rotation.set(0,0,0);dummy.scale.set(q.sx,q.sy,q.sz);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
    ar.set([q.x-o.x,q.y-o.y,q.z-o.z],i*3);as.set([q.sx,q.sy,q.sz],i*3)});
  geo.setAttribute('aRest',new THREE.InstancedBufferAttribute(ar,3));geo.setAttribute('aSize',new THREE.InstancedBufferAttribute(as,3));
  mesh.castShadow=mesh.receiveShadow=true;mesh.userData.b=b;return mesh}
BLD.forEach(b=>{b.groups=new Map();const bk=new Map();
  GEN.parts.forEach(p=>{if(p.b!==b)return;if(b.hip&&(p.k==='roof'||p.k==='para'))return;const k=p.f+'|'+p.m;if(!bk.has(k))bk.set(k,[]);bk.get(k).push(p)});
  bk.forEach((list,k)=>{const f=list[0].f;if(!b.groups.has(f)){const g=new THREE.Group();g.userData.b=b;b.groups.set(f,g);S.add(g)}
    const m=instParts(list,b);b.groups.get(f).add(m);pickables.push(m)})});
// 복지관: green glazed-tile roof with up-turned corners over the second floor and a tiled skirt round the first floor (roof plan + photos)
{const b=BLD.find(x=>x.id==='bokji');const [c,x]=canvas(256,256);x.fillStyle=shade(b.roof,.75);x.fillRect(0,0,256,256);
  for(let i=0;i<256;i+=16){const gr=x.createLinearGradient(i,0,i+16,0);gr.addColorStop(0,shade(b.roof,.62));gr.addColorStop(.5,shade(b.roof,1.2));gr.addColorStop(1,shade(b.roof,.62));x.fillStyle=gr;x.fillRect(i+1,0,14,256)}
  for(let j=0;j<256;j+=32){x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,j,256,3)}
  const rm=new THREE.MeshStandardMaterial({map:tex(c),roughness:.32,metalness:.2,envMapIntensity:1.1,side:THREE.DoubleSide}),cap=plainMat(0x2c5a50,{roughness:.4});b.extra=[];
  const add=(geo,mat)=>{const m=new THREE.Mesh(geo,mat||rm);m.castShadow=m.receiveShadow=true;m.userData.b=b;S.add(m);pickables.push(m);return m};
  // one roof face swept from an eave line (e0→e1) up to a ridge line (r0→r1); the slope sags a little and the eave curls up at both corners
  function face(e0,e1,r0,r1,curl,ns){const nt=5,pos=[],uv=[],idx=[],L=Math.hypot(e1[0]-e0[0],e1[1]-e0[1]),rise=Math.hypot(r0[0]-e0[0],r0[1]-e0[1],r0[2]-e0[2]);
    for(let j=0;j<=nt;j++)for(let i=0;i<=ns;i++){const s=i/ns,t=j/nt,eu=e0[0]+(e1[0]-e0[0])*s,ev=e0[1]+(e1[1]-e0[1])*s;
      const u=eu+(r0[0]+(r1[0]-r0[0])*s-eu)*t,v=ev+(r0[1]+(r1[1]-r0[1])*s-ev)*t;
      const y=e0[2]+(r0[2]-e0[2])*t-.18*rise/3*Math.sin(Math.PI*t)+curl*Math.pow(Math.abs(2*s-1),3)*(1-t)*(1-t);
      const[X,Z]=toW(b,u,v);pos.push(X,y,Z);uv.push(s*L/2.4,t*rise/2.4)}
    for(let j=0;j<nt;j++)for(let i=0;i<ns;i++){const a=j*(ns+1)+i;idx.push(a,a+1,a+ns+2,a,a+ns+2,a+ns+1)}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();return add(geo)}
  const roof=(f,list)=>{const g=new THREE.Group();list.forEach(m=>{S.remove(m);g.add(m)});S.add(g);b.extra.push({m:g,f})};
  // main roof: long ridge, short steep hips (reads like a 팔작 roof from the ground)
  const o=1.2,y2=7.2-SLAB,H=3.5,u0=-o,u1=47.2+o,v0=3-o,v1=10.8+o,vm=(v0+v1)/2,g=(v1-v0)*.36,yR=y2+H;
  const ridge=add(new THREE.BoxGeometry(1,1,1),cap);{const[x0,z0]=toW(b,u0+g,vm),[x1,z1]=toW(b,u1-g,vm);ridge.position.set((x0+x1)/2,yR+.12,(z0+z1)/2);ridge.scale.set(Math.max(.4,Math.abs(x1-x0)),.32,Math.max(.4,Math.abs(z1-z0)))}
  roof(2,[face([u0,v0,y2],[u1,v0,y2],[u0+g,vm,yR],[u1-g,vm,yR],.9,24),face([u1,v1,y2],[u0,v1,y2],[u1-g,vm,yR],[u0+g,vm,yR],.9,24),
    face([u0,v1,y2],[u0,v0,y2],[u0+g,vm,yR],[u0+g,vm,yR],.9,8),face([u1,v0,y2],[u1,v1,y2],[u1-g,vm,yR],[u1-g,vm,yR],.9,8),ridge]);
  // tiled skirts round the first floor and over the link to the middle school
  const shed=(ua,ub,vIn,vOut,yIn,yOut,curl)=>face([ua,vOut,yOut],[ub,vOut,yOut],[ua,vIn,yIn],[ub,vIn,yIn],curl,16);
  const y1=3.6-SLAB;roof(1,[...[[0,18.1],[26.3,47.2]].map(([a,c2])=>shed(a,c2,3,-1,y1+1.4,y1,.45)),shed(0,47.2,10.8,15.8,y1+1.4,y1,.45)]);
  roof(2,[shed(18.1,26.3,1.5,-.4,y2+.4,y2,.15),shed(18.1,26.3,1.5,3,y2+.4,y2,.15),shed(47.2,56.7,3.4,2,y2+.3,y2,.1),shed(47.2,56.7,3.4,4.8,y2+.3,y2,.1)])}
// ---------- labels ----------
const labelsEl=$('#labels');
BLD.forEach(b=>{const el=document.createElement('div');el.className='lbl';el.textContent=b.n;el.addEventListener('click',()=>showInfo(b));labelsEl.appendChild(el);b.el=el;b.anchor=new THREE.Vector3(b.cx,b.top+3,b.cz)});
const v3=new THREE.Vector3();
function placeLabels(){if(labelsEl.classList.contains('off'))return;const w=stage.clientWidth,h=stage.clientHeight;
  BLD.forEach(b=>{if(cut&&cut.b===b){b.el.style.display='none';return}v3.copy(b.anchor).project(cam);const vis=v3.z<1&&Math.abs(v3.x)<1.1&&Math.abs(v3.y)<1.1;b.el.style.display=vis?'':'none';if(vis)b.el.style.transform=`translate(${(v3.x*.5+.5)*w}px,${(-v3.y*.5+.5)*h}px) translate(-50%,-100%)`})}
// ---------- floor cutaway ----------
const CUT=1.4;const cutCache=new Map();let cut=null;
const furnMat=new THREE.MeshStandardMaterial({roughness:.75,envMapIntensity:.6});
function boxesMesh(list){const m=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),furnMat,Math.max(1,list.length));m.count=list.length;
  list.forEach((o,i)=>{dummy.position.set(o.x,o.y,o.z);dummy.rotation.set(0,0,0);dummy.scale.set(o.sx,o.sy,o.sz);dummy.updateMatrix();m.setMatrixAt(i,dummy.matrix);m.setColorAt(i,col.set(o.c))});m.receiveShadow=true;return m}
const floorName=(b,f)=>b.gym?(f===1?'1층':'2층 관람석'):(f>1&&b.floors[f].length<=2?'옥탑':f+'층');
function buildCut(b,f){const key=b.id+':'+f;if(cutCache.has(key))return cutCache.get(key);
  const g=new THREE.Group(),pl=b.plan[f],y0=pl.y0;const bk=new Map();
  GEN.parts.forEach(p=>{if(p.b!==b||p.f!==f)return;if(!['ext','part','rail','col','slab'].includes(p.k))return;if(!bk.has(p.m))bk.set(p.m,[]);bk.get(p.m).push(p)});
  bk.forEach(list=>g.add(instParts(list,b,p=>p.k==='ext'||p.k==='part'||p.k==='col'?{x:p.x,z:p.z,sx:p.sx,sz:p.sz,y:y0+CUT/2,sy:CUT}:p)));
  g.add(boxesMesh(furnish(b,pl,y0+.01)));
  const seen=new Map();pl.rooms.forEach(r=>{if(!r.n||r.t==='stair'||r.t==='void'||r.n==='복도')return;const a=(r.u1-r.u0)*(r.v1-r.v0);if(!seen.has(r.n)||seen.get(r.n).a<a)seen.set(r.n,{r,a})});
  const labels=[...seen.values()].map(({r})=>{const[x,z]=toW(b,(r.u0+r.u1)/2,(r.v0+r.v1)/2);return{name:r.n,p:new THREE.Vector3(x,y0+2.2,z)}});
  const res={g,labels,y0};cutCache.set(key,res);return res}
const ZM=new THREE.Matrix4().makeScale(0,0,0);
function clearCut(){if(!cut)return;S.remove(cut.res.g);cut.groups.forEach(gp=>gp.visible=true);
  cut.hidden.forEach(h=>{if(h.inst){h.inst.setMatrixAt(h.i,h.m);h.inst.instanceMatrix.needsUpdate=true}else h.obj.visible=true});
  cut.els.forEach(e=>e.remove());cut=null;document.querySelectorAll('#floors .btn').forEach(x=>x.setAttribute('aria-pressed',x.dataset.f==='0'))}
function showFloor(b,f){clearCut();document.querySelectorAll('#floors .btn').forEach(x=>x.setAttribute('aria-pressed',x.dataset.f===String(f)));if(!f)return;
  const res=buildCut(b,f);S.add(res.g);const groups=[];b.groups.forEach((gp,ff)=>{if(ff>=f){gp.visible=false;groups.push(gp)}});
  const hidden=[];(b.extra||[]).forEach(e=>{if(e.f>=f-1){e.m.visible=false;hidden.push({obj:e.m})}});
  onB.forEach(o=>{if(o.userData.onB===b&&o.visible&&o.position.y>res.y0+.5){o.visible=false;hidden.push({obj:o})}});
  const m4=new THREE.Matrix4();instAll.forEach(im=>{const L=im.userData.list;if(!L)return;let ch=false;L.forEach((p,i)=>{if(p.b!==b)return;if(p.y!==undefined&&p.y<res.y0+.5&&!p.h)return;im.getMatrixAt(i,m4);hidden.push({inst:im,i,m:m4.clone()});im.setMatrixAt(i,ZM);ch=true});if(ch)im.instanceMatrix.needsUpdate=true});
  const els=res.labels.map(l=>{const el=document.createElement('div');el.className='room';el.textContent=l.name;labelsEl.appendChild(el);el._p=l.p;return el});
  cut={b,f,res,groups,hidden,els};
  const [x0,z0,x1,z1]=b.bbox,span=Math.max(x1-x0,z1-z0),tgt=new THREE.Vector3(b.cx,res.y0+1,b.cz),dir=cam.position.clone().sub(C.target).setY(0).normalize(),dist=span*1.05+18;
  tw={fp:cam.position.clone(),ft:C.target.clone(),tp:tgt.clone().addScaledVector(dir,dist*.5).add(new THREE.Vector3(0,dist*.95,0)),tt:tgt,t:0}}
function placeRooms(){if(!cut)return;const w=stage.clientWidth,h=stage.clientHeight;cut.els.forEach(el=>{v3.copy(el._p).project(cam);const vis=v3.z<1&&Math.abs(v3.x)<1.05&&Math.abs(v3.y)<1.05;el.style.display=vis?'':'none';if(vis)el.style.transform=`translate(${(v3.x*.5+.5)*w}px,${(-v3.y*.5+.5)*h}px) translate(-50%,-50%)`})}
// ---------- info card ----------
function showInfo(b){if(cut&&cut.b!==b)clearCut();$('#info').hidden=false;const nm=$('#info-name');nm.innerHTML='';nm.append(b.n);
  const fl=floorList(b);const above=fl.filter(f=>!(f>1&&b.floors[f].length<=2)).length;const sm2=document.createElement('small');sm2.textContent=b.dong+' · 지상 '+above+'층';nm.append(sm2);
  $('#info-desc').textContent=b.desc;$('#info-src').textContent=b.src;
  const fe=$('#floors');fe.innerHTML='';[[0,'외관'],...fl.map(f=>[f,floorName(b,f)])].forEach(([f,t])=>{const bt=document.createElement('button');bt.type='button';bt.className='btn';bt.dataset.f=f;bt.textContent=t;
    bt.setAttribute('aria-pressed',(cut&&cut.b===b?cut.f:0)===f);bt.addEventListener('click',()=>showFloor(b,f));fe.appendChild(bt)})}
$('#info-x').addEventListener('click',()=>{$('#info').hidden=true;clearCut()});
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();let downAt=null;
R.domElement.addEventListener('pointerdown',e=>{downAt=[e.clientX,e.clientY];tw=null});
R.domElement.addEventListener('pointerup',e=>{if(!downAt||Math.hypot(e.clientX-downAt[0],e.clientY-downAt[1])>6)return;const r=R.domElement.getBoundingClientRect();
  ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(ndc,cam);const h=ray.intersectObjects(pickables,false).find(h=>h.object.visible&&h.object.parent&&h.object.parent.visible!==false);if(h&&h.object.userData.b)showInfo(h.object.userData.b)});
// ---------- views ----------
const VIEWS={all:[[160,170,250],[-10,0,15]],top:[[-8,440,22],[-8,0,15]],front:[[40,24,-4],[-14,8,-21]],road:[[17,6,62],[16,4,-90]],facade:[[70,9,-21],[-15,9,-21]],
  court:[[-150,70,-100],[-59,4,-23]],garden:[[0,45,112],[-28,4,55]],gym:[[60,45,190],[-28,14,128]],field:[[190,75,-150],[66,0,-19]]};
let tw=null;
function go(name){const [p,t]=VIEWS[name];tw={fp:cam.position.clone(),ft:C.target.clone(),tp:new THREE.Vector3(...p),tt:new THREE.Vector3(...t),t:0}}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));
cam.position.set(...VIEWS.all[0]);C.target.set(...VIEWS.all[1]);
let night=false;
function setNight(on){night=on;$('#b-night').setAttribute('aria-pressed',on);S.background=on?SKY_NIGHT:SKY_DAY;S.fog.color.set(on?0x1a2333:0xd3dde6);
  sun.color.set(on?0x9db4ff:0xfff0dc);sun.intensity=on?.35:3.2;hemi.intensity=on?.12:.55;R.toneMappingExposure=on?1.05:.82;nightMats.forEach(m=>m.emissiveIntensity=on?(m===bulbMat?6:1.3):0)}
$('#b-night').addEventListener('click',()=>setNight(!night));
$('#b-labels').addEventListener('click',e=>{const off=labelsEl.classList.toggle('off');e.currentTarget.setAttribute('aria-pressed',!off)});
$('#b-spin').addEventListener('click',e=>{C.autoRotate=!C.autoRotate;e.currentTarget.setAttribute('aria-pressed',C.autoRotate)});
addEventListener('keydown',e=>{if(e.key==='n'||e.key==='N')setNight(!night)});
const clock=new THREE.Clock();
function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05);
  if(tw){tw.t=Math.min(1,tw.t+dt/1.4);const k=sm(tw.t);cam.position.lerpVectors(tw.fp,tw.tp,k);C.target.lerpVectors(tw.ft,tw.tt,k);if(tw.t>=1)tw=null}
  C.update();R.render(S,cam);placeLabels();placeRooms()}
loop();
</script>
