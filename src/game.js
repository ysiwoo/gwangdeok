
// ---------- breakable buildings: every generated part becomes an instanced chunk ----------
const V3=THREE.Vector3;
const groups={};
GEN.parts.forEach(p=>{const k=p.b.id+'|'+p.m;if(!groups[k])groups[k]={key:k,b:p.b,list:[],dirty:false};groups[k].list.push(p)});
const CH=[];
Object.values(groups).forEach(G=>{const n=G.list.length,o=new V3(G.b.X0,G.b.base||0,G.b.Z0),geo=new THREE.BoxGeometry(1,1,1);
  const ar=new Float32Array(n*3),as=new Float32Array(n*3);G.list.forEach((p,k)=>{ar.set([p.x-o.x,p.y-o.y,p.z-o.z],k*3);as.set([p.sx,p.sy,p.sz],k*3)});
  geo.setAttribute('aRest',new THREE.InstancedBufferAttribute(ar,3));geo.setAttribute('aSize',new THREE.InstancedBufferAttribute(as,3));
  const mesh=new THREE.InstancedMesh(geo,matFor(G.list[0]).mat,n);mesh.castShadow=mesh.receiveShadow=true;mesh.frustumCulled=false;G.mesh=mesh;S.add(mesh);
  G.list.forEach((p,k)=>{const rp=new V3(p.x,p.y,p.z);CH.push({i:CH.length,G,idx:k,part:p,b:p.b,p:rp.clone(),q:new THREE.Quaternion(),s:new V3(p.sx,p.sy,p.sz),rp,rq:new THREE.Quaternion(),v:new V3(),w:new V3(),state:0,nb:[],ground:false,att:[],nk:0,pend:0})})});
const structs=BLD.map(b=>{const s={b,chunks:CH.filter(c=>c.b===b)};s.total=s.chunks.length;b.struct=s;return s});
// contact graph: anything that touches is linked; a chunk falls when nothing links it to the ground
const HC=5,hash=new Map(),hk=(a,b)=>a*10007+b;
CH.forEach(c=>{const hx=c.s.x/2,hz=c.s.z/2;for(let a=Math.floor((c.rp.x-hx)/HC);a<=Math.floor((c.rp.x+hx)/HC);a++)for(let b=Math.floor((c.rp.z-hz)/HC);b<=Math.floor((c.rp.z+hz)/HC);b++){const k=hk(a,b);if(!hash.has(k))hash.set(k,[]);hash.get(k).push(c)}});
function near(x,z,r){const out=new Set();for(let a=Math.floor((x-r)/HC);a<=Math.floor((x+r)/HC);a++)for(let b=Math.floor((z-r)/HC);b<=Math.floor((z+r)/HC);b++){const l=hash.get(hk(a,b));if(l)l.forEach(c=>out.add(c))}return out}
const ov=(a0,a1,b0,b1)=>Math.min(a1,b1)-Math.max(a0,b0);
CH.forEach(c=>{if(c.rp.y-c.s.y/2<GH(c.rp.x,c.rp.z)+.3)c.ground=true;
  near(c.rp.x,c.rp.z,Math.max(c.s.x,c.s.z)/2+1).forEach(d=>{if(d.i<=c.i)return;
    const ox=ov(c.rp.x-c.s.x/2,c.rp.x+c.s.x/2,d.rp.x-d.s.x/2,d.rp.x+d.s.x/2),oy=ov(c.rp.y-c.s.y/2,c.rp.y+c.s.y/2,d.rp.y-d.s.y/2,d.rp.y+d.s.y/2),oz=ov(c.rp.z-c.s.z/2,c.rp.z+c.s.z/2,d.rp.z-d.s.z/2,d.rp.z+d.s.z/2);
    if(ox>-.06&&oy>-.06&&oz>-.06&&((ox>.04)+(oy>.04)+(oz>.04))>=2){c.nb.push(d);d.nb.push(c)}})});
structs.forEach(s=>{s.ground=s.chunks.filter(c=>c.ground).length});
// furniture rides on the floor slab beneath it
const furnList=[];
BLD.forEach(b=>floorList(b).forEach(f=>{const pl=b.plan[f];furnish(b,pl,pl.y0+.01).forEach(o=>{o.f=f;o.b=b;furnList.push(o)})}));
const furnMesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({roughness:.75,envMapIntensity:.6}),furnList.length);
furnMesh.receiveShadow=true;furnMesh.frustumCulled=false;
furnList.forEach((o,i)=>{dummy.position.set(o.x,o.y,o.z);dummy.rotation.set(0,0,0);dummy.scale.set(o.sx,o.sy,o.sz);dummy.updateMatrix();o.m=dummy.matrix.clone();furnMesh.setMatrixAt(i,o.m);furnMesh.setColorAt(i,col.set(o.c));
  if(o.f>1){const ys=o.b.plan[o.f].y0;let best=null;near(o.x,o.z,.5).forEach(c=>{if(c.b===o.b&&c.part.k==='slab'&&Math.abs(c.rp.y+c.s.y/2-ys)<.05&&Math.abs(c.rp.x-o.x)<=c.s.x/2+.05&&Math.abs(c.rp.z-o.z)<=c.s.z/2+.05)best=c});
    if(best)best.att.push({inst:furnMesh,i,m:o.m})}});
S.add(furnMesh);
// things fixed to buildings vanish when their chunk breaks loose
function nearestChunk(b,x,y,z,kinds){let best=null,bd=1e9;near(x,z,3).forEach(c=>{if(c.b!==b||(kinds&&!kinds.includes(c.part.k)))return;const d=(c.rp.x-x)**2+(c.rp.y-y)**2+(c.rp.z-z)**2;if(d<bd){bd=d;best=c}});return best}
onB.forEach(o=>{const b=o.userData.onB;const c=nearestChunk(b,o.position.x,o.position.y,o.position.z,['ext','col','roof','slab','para']);if(c)c.att.push({obj:o})});
instAll.forEach(im=>{const L=im.userData.list;if(!L)return;const m=new THREE.Matrix4();L.forEach((p,i)=>{im.getMatrixAt(i,m);const c=p.h?nearestChunk(p.b,p.x,1.5,p.z,['ext']):nearestChunk(p.b,p.x,p.y-.5,p.z,['roof','para']);if(c)c.att.push({inst:im,i,m:m.clone()})})});
// ---------- decor that explosions can knock over ----------
const decor=[];
S.children.slice(decorStart,decorEnd).forEach(o=>{
  if(o.isInstancedMesh){if(o.userData.list)return;for(let i=0;i<o.count;i++){const m=new THREE.Matrix4();o.getMatrixAt(i,m);decor.push({inst:o,i,m,x:m.elements[12],y:m.elements[13],z:m.elements[14],sq:!!o.userData.squash})}}
  else decor.push({obj:o,x:o.position.x,z:o.position.z})});
furnList.forEach((o,i)=>decor.push({inst:furnMesh,i,m:o.m,x:o.x,y:o.y,z:o.z,y3:1}));
const M4=new THREE.Matrix4(),TQ=new THREE.Quaternion(),TV=new V3(),TINY=new V3(1e-4,1e-4,1e-4);
const ZERO=new THREE.Matrix4().compose(new V3(0,-999,0),new THREE.Quaternion(),TINY);
function hitDecor(p,r){const r2=r*r,touched=new Set();let n=0;
  for(const d of decor){if(d.hit)continue;const dx=d.x-p.x,dz=d.z-p.z;if(dx*dx+dz*dz>r2)continue;if(d.y3&&Math.abs(d.y-p.y)>r*.6)continue;d.hit=true;n++;
    if(d.inst){if(d.sq){M4.copy(d.m);const e=M4.elements;e[4]*=.12;e[5]*=.12;e[6]*=.12;e[13]=d.y*.12;d.inst.setMatrixAt(d.i,M4)}else d.inst.setMatrixAt(d.i,ZERO);touched.add(d.inst)}
    else d.obj.visible=false}
  touched.forEach(m=>m.instanceMatrix.needsUpdate=true);if(n)addScore(n*2)}
// ---------- chunk runtime ----------
const R2=(a,b)=>a+Math.random()*(b-a);
function writeC(c){M4.compose(c.p,c.q,c.s);c.G.mesh.setMatrixAt(c.idx,M4);c.G.dirty=true}
function hideC(c){c.G.mesh.setMatrixAt(c.idx,ZERO);c.G.dirty=true}
function flush(){for(const k in groups){const G=groups[k];if(G.dirty){G.mesh.instanceMatrix.needsUpdate=true;G.dirty=false}}}
let active=[],pending=[],graphDirty=false,graphT=0;
function hideAtt(c){c.att.forEach(a=>{if(a.inst){a.inst.setMatrixAt(a.i,ZERO);a.inst.instanceMatrix.needsUpdate=true}else a.obj.visible=false})}
function detach(c){if(c.state!==0)return false;c.state=1;active.push(c);const st=c.b.struct;st.alive--;if(c.ground)st.groundAlive--;
  c.w.set(R2(-2,2),R2(-2,2),R2(-2,2));hideAtt(c);c.pend=0;graphDirty=true;addScore(c.part.k==='ext'?10:6);return true}
function connectivity(){const seen=new Uint8Array(CH.length),stack=[];for(const c of CH)if(c.state===0&&c.ground){seen[c.i]=1;stack.push(c)}
  while(stack.length){const c=stack.pop();for(const d of c.nb)if(!seen[d.i]&&d.state===0){seen[d.i]=1;stack.push(d)}}
  for(const c of CH)if(c.state===0&&!seen[c.i]&&!c.pend){c.pend=1;pending.push({c,t:R2(.02,.3)})}}
function push(c,ax,ay,az){if(c.state===3)return;if(c.state===0)detach(c);else if(c.state===2){c.state=1;active.push(c)}c.v.x+=ax;c.v.y+=ay;c.v.z+=az;c.w.x+=R2(-4,4);c.w.z+=R2(-4,4)}
function vaporize(c){if(c.state===0)detach(c);c.state=3;hideC(c)}
function explode(p,r,power,up,vap){const r2=r*r;near(p.x,p.z,r+3).forEach(c=>{if(c.state===3)return;const dx=c.p.x-p.x,dy=c.p.y-p.y,dz=c.p.z-p.z,d2=dx*dx+dy*dy+dz*dz;if(d2>r2)return;
  const d=Math.sqrt(d2)||.01;if(vap&&d<vap){vaporize(c);return}const f=1-d/r;push(c,dx/d*power*f+R2(-2,2),up*f+Math.max(0,dy/d)*power*.4*f+R2(0,3),dz/d*power*f+R2(-2,2))});
  for(const c of active){if(c.state!==1&&c.state!==2)continue;const dx=c.p.x-p.x,dy=c.p.y-p.y,dz=c.p.z-p.z,d2=dx*dx+dy*dy+dz*dz;if(d2>r2||d2<1e-4)continue;const d=Math.sqrt(d2),f=1-d/r;c.v.x+=dx/d*power*f*.5;c.v.y+=up*f*.5;c.v.z+=dz/d*power*f*.5}}
function resetAll(){
  CH.forEach(c=>{c.p.copy(c.rp);c.q.copy(c.rq);c.v.set(0,0,0);c.w.set(0,0,0);c.state=0;c.nk=0;c.pend=0;writeC(c);
    c.att.forEach(a=>{if(a.inst){a.inst.setMatrixAt(a.i,a.m);a.inst.instanceMatrix.needsUpdate=true}else a.obj.visible=true})});
  structs.forEach(s=>{s.alive=s.total;s.groundAlive=s.ground;s.falling=false;s.down=false});
  BLD.forEach(b=>{b.row.classList.remove('down');b.barEl.style.width='100%'});
  const touched=new Set();decor.forEach(d=>{if(!d.hit)return;d.hit=false;if(d.inst){d.inst.setMatrixAt(d.i,d.m);touched.add(d.inst)}else d.obj.visible=true});touched.forEach(m=>m.instanceMatrix.needsUpdate=true);
  scorches.forEach(m=>m.visible=false);cloud.visible=false;ring.visible=false;missile.visible=false;nuke=null;quakeT=0;
  active=[];pending=[];fallen=0;score=0;style=0;allDone=false;flush();updateHud(true)}
// ---------- labels and roster ----------
const labelsEl=$('#labels');
BLD.forEach(b=>{const el=document.createElement('div');el.className='lbl';el.textContent=b.n;labelsEl.appendChild(el);b.el=el;b.anchor=new V3(b.cx,b.top+3,b.cz)});
const v3=new V3();
function placeLabels(){const w=stage.clientWidth,h=stage.clientHeight;
  BLD.forEach(b=>{if(b.struct.down){b.el.style.display='none';return}v3.copy(b.anchor).project(cam);const vis=v3.z<1&&Math.abs(v3.x)<1.1&&Math.abs(v3.y)<1.1;b.el.style.display=vis?'':'none';if(vis)b.el.style.transform=`translate(${(v3.x*.5+.5)*w}px,${(-v3.y*.5+.5)*h}px) translate(-50%,-100%)`})}
const MSG={mandae:'만대관 붕괴! 교장실이 사라졌다',deokrin:'덕린관 붕괴! 오늘 수업 끝',mid:'광덕중 붕괴! 중학생 조기 하교',bokji:'복지관 붕괴! 매점이 문을 닫았다',danjae:'단재관 붕괴! 제2외국어 휴강',
  isan:'이산관 붕괴! 오늘 급식은 매점 빵',gwichon:'귀촌관 붕괴! 3D프린터 대피 완료',gym:'체육관 붕괴! 체육은 운동장에서',sport:'체육실동 붕괴! 공은 무사하다',guard:'수위실 붕괴! 정문 통과 자유',wc:'화장실 붕괴! 급한 사람 비상'};
const roster=$('#roster');
BLD.forEach(b=>{const r=document.createElement('div');r.className='row';r.innerHTML='<span class="nm"></span><span class="bar"><i></i></span>';r.querySelector('.nm').textContent=b.n;roster.appendChild(r);b.row=r;b.barEl=r.querySelector('i')});
// ---------- effects ----------
const dust=[];for(let i=0;i<60;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),new THREE.MeshStandardMaterial({color:0xb9b1a3,transparent:true,opacity:0,depthWrite:false,roughness:1}));m.visible=false;S.add(m);dust.push({m,t:0,life:1,max:5})}
let dustI=0;
function puff(p,size,n,color){for(let j=0;j<n;j++){const d=dust[dustI++%dust.length];d.m.position.set(p.x+R2(-size,size)*.6,Math.max(GH(p.x,p.z)+1,p.y+R2(0,size*.4)),p.z+R2(-size,size)*.6);d.m.material.color.set(color||0xb9b1a3);d.t=0;d.life=R2(1.2,2.2);d.max=size*R2(.5,1);d.m.visible=true}}
const fire=[];for(let i=0;i<6;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),new THREE.MeshBasicMaterial({color:0xffb050,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));m.visible=false;S.add(m);fire.push({m,t:9,max:5})}
let fireI=0;function fireball(p,size){const f=fire[fireI++%fire.length];f.m.position.copy(p);f.t=0;f.max=size;f.m.visible=true}
const scorches=[];for(let i=0;i<40;i++){const m=new THREE.Mesh(new THREE.CircleGeometry(1,28),new THREE.MeshBasicMaterial({color:0x2a2420,transparent:true,opacity:.55,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));m.rotation.x=-Math.PI/2;m.visible=false;S.add(m);scorches.push(m)}
let scI=0;function scorch(p,r){const m=scorches[scI++%scorches.length];m.position.set(p.x,GH(p.x,p.z)+.12,p.z);m.scale.setScalar(r);m.visible=true}
const beamCore=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,1,8,1,true),new THREE.MeshBasicMaterial({color:0xfff2f0}));
const beamGlow=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.4,1,12,1,true),new THREE.MeshBasicMaterial({color:0xff3b2f,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}));
beamCore.visible=beamGlow.visible=false;S.add(beamCore,beamGlow);
const missile=new THREE.Group();{const body=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,8,12),new THREE.MeshStandardMaterial({color:0x5c6165,metalness:.6,roughness:.4}));const nose=new THREE.Mesh(new THREE.ConeGeometry(1.2,3,12),new THREE.MeshStandardMaterial({color:0xc23b2a}));nose.position.y=-5.5;nose.rotation.x=Math.PI;missile.add(body,nose)}
missile.visible=false;S.add(missile);
const ring=new THREE.Mesh(new THREE.RingGeometry(.92,1,96),new THREE.MeshBasicMaterial({color:0xfff1d0,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));
ring.rotation.x=-Math.PI/2;ring.visible=false;S.add(ring);
const cloud=new THREE.Group();const puffs=[];
for(let i=0;i<26;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(1,14,10),new THREE.MeshBasicMaterial({color:0xff8a3d,transparent:true,opacity:1,depthWrite:false}));const stem=i<9;
  puffs.push({m,stem,a:Math.random()*Math.PI*2,r:stem?R2(0,2):R2(.4,1),h:stem?i/9:R2(-.2,.25)});cloud.add(m)}
cloud.visible=false;S.add(cloud);
// ---------- audio ----------
let AC=null,noiseBuf=null,muted=false,laserOsc=null;
function audio(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();const len=AC.sampleRate*2;noiseBuf=AC.createBuffer(1,len,AC.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1}catch(e){AC=null}}
  if(AC&&AC.state==='suspended')AC.resume()}
function boom(size,dur){if(!AC||muted)return;const t=AC.currentTime,s=AC.createBufferSource();s.buffer=noiseBuf;s.loop=dur>1.9;
  const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(1400/size+120,t);f.frequency.exponentialRampToValueAtTime(40,t+dur);
  const g2=AC.createGain();g2.gain.setValueAtTime(Math.min(.9,.35*size),t);g2.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g2);g2.connect(AC.destination);s.start(t);s.stop(t+dur)}
function thwack(){if(!AC||muted)return;const t=AC.currentTime,o=AC.createOscillator(),g2=AC.createGain();o.type='triangle';o.frequency.setValueAtTime(320,t);o.frequency.exponentialRampToValueAtTime(70,t+.18);
  g2.gain.setValueAtTime(.5,t);g2.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(g2);g2.connect(AC.destination);o.start(t);o.stop(t+.22);boom(.6,.35)}
function laserSound(on){if(!AC)return;if(on&&!muted&&!laserOsc){const o=AC.createOscillator(),g2=AC.createGain(),l=AC.createOscillator(),lg=AC.createGain();o.type='sawtooth';o.frequency.value=180;l.frequency.value=22;lg.gain.value=40;l.connect(lg);lg.connect(o.frequency);g2.gain.value=.06;o.connect(g2);g2.connect(AC.destination);o.start();l.start();laserOsc={o,l,g2}}
  if(!on&&laserOsc){const t=AC.currentTime;laserOsc.g2.gain.setTargetAtTime(0,t,.03);laserOsc.o.stop(t+.15);laserOsc.l.stop(t+.15);laserOsc=null}}
// ---------- score, rank, HUD ----------
let score=0,style=0,lastHit=0,fallen=0,allDone=false,clockT=0;
const RANKS=['D','C','B','A','S','SS','SSS'];
const rankIdx=()=>Math.min(6,Math.floor(style*7));
function addScore(n){score+=Math.round(n*(1+rankIdx()*.5));style=Math.min(1,style+n*.00035);lastHit=clockT}
const toastEl=$('#toast');let toastTimer=0;
function toast(html){toastEl.innerHTML=html;toastEl.classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove('on'),2300)}
const TOTAL=CH.length;
function updateHud(force){
  const gone=structs.reduce((a,s)=>a+(s.total-s.alive),0);$('#pct').textContent=Math.round(gone/TOTAL*100);
  structs.forEach(s=>{const b=s.b;b.barEl.style.width=Math.round(s.alive/s.total*100)+'%';
    if(!s.down&&s.alive/s.total<.45){s.down=true;fallen++;b.row.classList.add('down');if(!force){const m=MSG[b.id];toast('<b>'+m.split('!')[0]+'!</b>'+m.split('!').slice(1).join('!'));addScore(100)}}});
  $('#fallen').textContent=fallen;$('#score').textContent=score.toLocaleString('ko-KR');
  $('#rank').textContent=RANKS[rankIdx()];$('#meter').style.width=Math.round((style*7%1)*100)+'%';
  if(!force&&!allDone&&fallen===BLD.length){allDone=true;setTimeout(()=>toast('<b>전교 휴교!</b> 광덕고가 사라졌어요'),2400)}}
$('#total').textContent=BLD.length;
const flashEl=$('#flash');
function flash(a,ms){flashEl.style.transition='none';flashEl.style.opacity=a;requestAnimationFrame(()=>{flashEl.style.transition='opacity '+(ms||400)+'ms ease-out';flashEl.style.opacity=0})}
// ---------- tools ----------
let tool='bomb',shake=0,quakeT=0,laserOn=false,laserScreen=null,nuke=null,frame=0;
const HINTS={bomb:'누른 곳에 폭탄을 떨어뜨려요',bat:'건물을 눌러 배트로 한 방 날려요',laser:'누른 채로 그어서 건물을 잘라요 · 회전은 우클릭 드래그',quake:'아무 곳이나 눌러 지진을 일으켜요',nuke:'누른 곳에 핵폭탄이 떨어져요'};
function setTool(t){tool=t;document.querySelectorAll('.tool').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tool===t?'true':'false'));$('#hint').textContent=HINTS[t];
  C.mouseButtons.LEFT=t==='laser'?null:THREE.MOUSE.ROTATE;C.touches.ONE=t==='laser'?null:THREE.TOUCH.ROTATE}
document.querySelectorAll('.tool').forEach(b=>b.addEventListener('click',()=>{audio();setTool(b.dataset.tool)}));
$('#reset').addEventListener('click',()=>{resetAll();toast('다시 지었어요')});
$('#mute').addEventListener('click',e=>{muted=!muted;e.currentTarget.textContent=muted?'소리 꺼짐':'소리 켜짐';e.currentTarget.setAttribute('aria-pressed',muted);if(muted)laserSound(false)});
const HOME=[[150,170,240],[-25,0,5]];let tw=null;
$('#home').addEventListener('click',()=>{tw={fp:cam.position.clone(),ft:C.target.clone(),tp:new V3(...HOME[0]),tt:new V3(...HOME[1]),t:0}});
let night=false;
function setNight(on){night=on;$('#night').setAttribute('aria-pressed',on);S.background=on?SKY_NIGHT:SKY_DAY;S.fog.color.set(on?0x1a2333:0xd3dde6);
  sun.color.set(on?0x9db4ff:0xfff0dc);sun.intensity=on?.35:3.2;hemi.intensity=on?.12:.55;R.toneMappingExposure=on?1.05:.82;nightMats.forEach(m=>m.emissiveIntensity=on?(m===bulbMat?6:1.3):0)}
$('#night').addEventListener('click',()=>setNight(!night));
addEventListener('keydown',e=>{const m={'1':'bomb','2':'bat','3':'laser','4':'quake','5':'nuke'};if(m[e.key])setTool(m[e.key]);if(e.key==='r'||e.key==='R'){resetAll();toast('다시 지었어요')}if(e.key==='n'||e.key==='N')setNight(!night)});
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
const pickList=[...Object.values(groups).map(G=>G.mesh),ground];
function hitAt(cx,cy){const r=R.domElement.getBoundingClientRect();ndc.set((cx-r.left)/r.width*2-1,-(cy-r.top)/r.height*2+1);ray.setFromCamera(ndc,cam);
  const h=ray.intersectObjects(pickList,false)[0];return h?h.point.clone():null}
let down=null;
R.domElement.addEventListener('pointerdown',e=>{audio();tw=null;down={x:e.clientX,y:e.clientY,b:e.button,id:e.pointerId};
  if(tool==='laser'&&e.button===0&&e.isPrimary){laserOn=true;laserScreen=[e.clientX,e.clientY];laserSound(true)}});
addEventListener('pointermove',e=>{if(laserOn&&e.isPrimary)laserScreen=[e.clientX,e.clientY]});
function endLaser(){if(laserOn){laserOn=false;laserSound(false);beamCore.visible=beamGlow.visible=false}}
addEventListener('pointerup',e=>{if(down&&e.pointerId===down.id&&down.b===0&&tool!=='laser'&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<7){const p=hitAt(e.clientX,e.clientY);if(p)fire_(p)}
  if(e.isPrimary)endLaser();down=null});
addEventListener('pointercancel',()=>{endLaser();down=null});
function fire_(p){
  if(tool==='bomb'){explode(p,11,28,13);hitDecor(p,9);puff(p,9,7);fireball(p,7);scorch(p,7);flash(.3,350);boom(1.2,1.2);shake=Math.max(shake,1.3)}
  else if(tool==='bat'){const d=new V3(p.x-cam.position.x,0,p.z-cam.position.z).normalize();
    near(p.x,p.z,9).forEach(c=>{if(c.state===3)return;const dx=c.p.x-p.x,dy=c.p.y-p.y,dz=c.p.z-p.z,dd=dx*dx+dy*dy+dz*dz;if(dd>64)return;const f=1-Math.sqrt(dd)/8;push(c,d.x*48*f+R2(-4,4),12*f+R2(0,6),d.z*48*f+R2(-4,4))});
    hitDecor(p,5);puff(p,4,3);thwack();shake=Math.max(shake,.6)}
  else if(tool==='quake'){quakeT=4.5;boom(.7,4.5);toast('<b>지진 발생!</b> 책상 밑으로')}
  else if(tool==='nuke'){if(nuke)return;nuke={p:p.clone().setY(GH(p.x,p.z)),t:0,hit:false};missile.position.set(p.x,320,p.z);missile.visible=true}}
// ---------- simulation ----------
const UP=new V3(0,1,0),q2=new THREE.Quaternion();
function beam(p){const o=TV.set(p.x+70,280,p.z-50);const dir=new V3().subVectors(p,o);const len=dir.length();q2.setFromUnitVectors(UP,dir.normalize());
  [beamCore,beamGlow].forEach(m=>{m.visible=true;m.position.copy(o).addScaledVector(dir,len/2);m.quaternion.copy(q2);m.scale.set(1,len,1)});beamGlow.material.opacity=.4+Math.random()*.3}
const GRAV=24;
function step(dt){
  clockT+=dt;
  if(laserOn&&laserScreen){const p=hitAt(laserScreen[0],laserScreen[1]);if(p){beam(p);explode(p,4.5,8,6,1.9);if(frame%3===0)hitDecor(p,3);if(frame%4===0)puff(p,3,1,0xffb39a);if(frame%10===0)scorch(p,2.2);shake=Math.max(shake,.25)}else beamCore.visible=beamGlow.visible=false}
  if(quakeT>0){quakeT-=dt;shake=Math.max(shake,1.1);
    for(let j=0;j<14;j++){const c=CH[(Math.random()*CH.length)|0];if(c.state===0&&(c.ground||Math.random()<.2))push(c,R2(-3,3),R2(1,4),R2(-3,3));else if(c.state===2)push(c,R2(-4,4),R2(2,5),R2(-4,4))}
    if(frame%12===0)puff({x:R2(-100,40),y:0,z:R2(-70,120)},5,1)}
  if(nuke){nuke.t+=dt;const n=nuke;
    if(!n.hit){const y=320-n.t/0.9*320;missile.position.y=Math.max(n.p.y+4,y);if(y<=n.p.y+4){n.hit=true;n.t=0;missile.visible=false;flash(1,1800);boom(3,4);shake=4;scorch(n.p,70);
      ring.visible=true;cloud.visible=true;cloud.position.copy(n.p);CH.forEach(c=>c.nk=0);toast('<b>핵폭탄 투하!</b>')}}
    else{const RR=Math.min(260,n.t*130);ring.position.set(n.p.x,n.p.y+1,n.p.z);ring.scale.setScalar(Math.max(1,RR));ring.material.opacity=Math.max(0,.8-n.t/2.2);
      if(RR<260){const r2=RR*RR;for(const c of CH){if(c.nk||c.state===3)continue;const dx=c.p.x-n.p.x,dz=c.p.z-n.p.z,d2=dx*dx+dz*dz;if(d2>r2)continue;c.nk=1;const d=Math.sqrt(d2)||1,f=Math.max(.15,1-d/260);
        if(d<18)vaporize(c);else push(c,dx/d*50*f+R2(-5,5),28*f+R2(0,10),dz/d*50*f+R2(-5,5))}hitDecor(n.p,RR*.9)}
      const ct=n.t;puffs.forEach(o=>{const m=o.m;if(o.stem){m.position.set(Math.cos(o.a)*o.r,Math.min(1,ct/3)*90*o.h,Math.sin(o.a)*o.r);m.scale.setScalar(6+ct*1.2)}
        else{const capY=Math.min(105,10+ct*32);m.position.set(Math.cos(o.a)*o.r*(10+ct*6),capY+o.h*30,Math.sin(o.a)*o.r*(10+ct*6));m.scale.setScalar(Math.min(28,8+ct*6))}
        const heat=Math.max(0,1-ct/2.5);m.material.color.setRGB(.55+.45*heat,.5+.05*heat,.47-.25*heat);m.material.opacity=ct<6?1:Math.max(0,1-(ct-6)/4)});
      if(ct>10){cloud.visible=false;ring.visible=false;nuke=null}}}
  graphT+=dt;if(graphDirty&&graphT>.12){graphDirty=false;graphT=0;connectivity()}
  for(let k=pending.length-1;k>=0;k--){const e=pending[k];e.t-=dt;if(e.t<=0){pending.splice(k,1);e.c.pend=0;if(e.c.state===0){detach(e.c);e.c.v.set(R2(-1,1),-1,R2(-1,1))}}}
  structs.forEach(s=>{if(!s.falling&&s.ground&&s.groundAlive/s.ground<.4)s.falling=true;
    if(s.falling&&s.alive>0){for(let t=0;t<60&&t<s.total;t++){const c=s.chunks[(Math.random()*s.total)|0];if(c.state===0&&Math.random()<.5){detach(c);c.v.set(R2(-1.5,1.5),R2(-2,0),R2(-1.5,1.5))}}}});
  const next=[];
  for(const c of active){if(c.state!==1)continue;
    c.v.y-=GRAV*dt;c.p.addScaledVector(c.v,dt);
    const wl=c.w.length();if(wl>1e-4){TQ.setFromAxisAngle(TV.copy(c.w).multiplyScalar(1/wl),wl*dt);c.q.premultiply(TQ)}
    const q=c.q,hy=.5*(Math.abs(2*(q.x*q.y+q.w*q.z))*c.s.x+Math.abs(1-2*(q.x*q.x+q.z*q.z))*c.s.y+Math.abs(2*(q.y*q.z-q.w*q.x))*c.s.z),gh=GH(c.p.x,c.p.z);
    if(c.p.y-hy<gh){c.p.y=gh+hy;if(c.v.y<0)c.v.y*=-.22;c.v.x*=.78;c.v.z*=.78;c.w.multiplyScalar(.72);
      if(Math.abs(c.v.x)+Math.abs(c.v.y)+Math.abs(c.v.z)<1.3&&wl<1.5){c.state=2;c.v.set(0,0,0);writeC(c);continue}}
    if(c.p.y<-60||Math.abs(c.p.x)>700||Math.abs(c.p.z)>700){c.state=3;hideC(c);continue}
    writeC(c);next.push(c)}
  active=next;flush();
  if(clockT-lastHit>1.2)style=Math.max(0,style-dt*.09);
  dust.forEach(d=>{if(!d.m.visible)return;d.t+=dt;const k2=d.t/d.life;if(k2>=1){d.m.visible=false;d.m.material.opacity=0;return}d.m.scale.setScalar(1+d.max*Math.sqrt(k2));d.m.position.y+=dt*2;d.m.material.opacity=.65*(1-k2)});
  fire.forEach(f=>{if(!f.m.visible)return;f.t+=dt;const k2=f.t/.45;if(k2>=1){f.m.visible=false;return}f.m.scale.setScalar(f.max*(.4+k2));f.m.material.opacity=1-k2});
}
const clock=new THREE.Clock();
cam.position.set(...HOME[0]);C.target.set(...HOME[1]);
function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),1/30);frame++;step(dt);
  if(tw){tw.t=Math.min(1,tw.t+dt/1.4);const k=sm(tw.t);cam.position.lerpVectors(tw.fp,tw.tp,k);C.target.lerpVectors(tw.ft,tw.tt,k);if(tw.t>=1)tw=null}
  C.update();shake*=Math.pow(.04,dt);const ox=(Math.random()-.5)*shake,oy=(Math.random()-.5)*shake,oz=(Math.random()-.5)*shake;
  cam.position.x+=ox;cam.position.y+=oy;cam.position.z+=oz;R.render(S,cam);cam.position.x-=ox;cam.position.y-=oy;cam.position.z-=oz;
  placeLabels();if(frame%8===0)updateHud(false)}
resetAll();setTool('bomb');$('#loading').hidden=true;loop();
setTimeout(()=>toast('건물을 눌러서 부숴 보세요'),600);
</script>
