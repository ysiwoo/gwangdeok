
// ---------- ground: a painted site plan (true metres; x east, z south), traced from a satellite photo ----------
const GS=400,GW=(Math.min(innerWidth,innerHeight)<700?2048:4096),gs=GW/GS;const GX=x=>(x+GS/2)*gs,GZ=z=>(z+GS/2)*gs;
const [gc,g]=canvas(GW,GW);
function rect(x0,z0,x1,z1,c){g.fillStyle=c;g.fillRect(GX(x0),GZ(z0),(x1-x0)*gs,(z1-z0)*gs)}
function poly(pts,c){g.fillStyle=c;g.beginPath();pts.forEach(([x,z],i)=>i?g.lineTo(GX(x),GZ(z)):g.moveTo(GX(x),GZ(z)));g.closePath();g.fill()}
function polyline(pts,w,c,dash){g.strokeStyle=c;g.lineWidth=w*gs;g.lineCap='round';g.lineJoin='round';g.setLineDash(dash?dash.map(d=>d*gs):[]);g.beginPath();pts.forEach(([x,z],i)=>i?g.lineTo(GX(x),GZ(z)):g.moveTo(GX(x),GZ(z)));g.stroke();g.setLineDash([])}
function stadium(r){const{x,z,half}=FIELD;g.beginPath();g.moveTo(GX(x-r),GZ(z-half));g.lineTo(GX(x-r),GZ(z+half));g.arc(GX(x),GZ(z+half),r*gs,Math.PI,0,true);g.lineTo(GX(x+r),GZ(z-half));g.arc(GX(x),GZ(z-half),r*gs,0,Math.PI,true);g.closePath()}
const CANOPIES=[-79,-63,-47,-3,13],CANOPY_AT=z=>CANOPIES.some(c=>Math.abs(z-c)<7)||Math.abs(z+26)<9;
const inPoly=(x,z,P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const[xi,zi]=P[i],[xj,zj]=P[j];if((zi>z)!==(zj>z)&&x<(xj-xi)*(z-zi)/(zj-zi)+xi)c=!c}return c};
const GRASS='#7fa357',LAWN='#93a65c',WOODS='#5f7c46',PAVE='#cfcabf',ASPH='#86888a',BRICKP='#b9775c',SAND='#d8c6a3';
rect(-GS/2,-GS/2,GS/2,GS/2,'#bdb8ac');speckle(g,GW,GW,90000,['#a9a49a','#cbc6bb','#b3ad9f'],.5);
// streets round the campus: north road, east road, south road and the diagonal west street with its red-brick pavement
const street=(pts,w,mark)=>{polyline(pts,w+3,'#c8c4ba');polyline(pts,w,'#4d4f52');polyline(pts,.15,mark||'#e8e6dd',[3,3])};
const westRoad=[[-128,-210],[-128,-120],[-127.5,0],[-121,42],[-108,86],[-96,126],[-89,162],[-85,210]];
[[[-210,-120.5],[210,-120.5]],[[119,-210],[119,210]],[[-210,159],[210,159]]].forEach(r=>street(r,8));street(westRoad,8,'#e8d48a');
const westWalk=[[-119.5,-121],[-119,0],[-112.5,42],[-99.5,86],[-87.5,126],[-80.5,162]];polyline(westWalk,6,'#a85a43');polyline(westWalk,5,'#b36450',[.5,.5]);
// the campus, its wooded edges and lawns
const CAMPUS=[[-116,-116],[114,-116],[114,155],[-77,155],[-84,126],[-96,86],[-109,42],[-115.5,0]];poly(CAMPUS,PAVE);
const WOOD=[[[-116,-116],[-12,-116],[-12,-94],[-116,-94]],
  [[-116,-94],[-104.5,-94],[-104.5,28],[-86.8,31],[-86.8,80],[-84,104],[-65,108],[-65,152],[-77,155],[-84,126],[-96,86],[-109,42],[-115.5,0]],
  [[21,-116],[114,-116],[114,-104],[21,-104]],[[107,-104],[114,-104],[114,58],[107,58]],[[25,58],[114,58],[114,155],[26,155],[25.5,104]]];
WOOD.forEach(p=>poly(p,WOODS));
rect(26,52,46,80,PAVE);rect(28,80,44,84,'#86a95c');
// red clay court in the woods south-east of the field
rect(34,107,50,148,'#9a5b3f');g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=.12*gs;g.strokeRect(GX(35.5),GZ(109),14*gs,37*gs);polyline([[35.5,127.5],[49.5,127.5]],.12,'rgba(255,255,255,.7)');
// field: sand track (no lanes) round an artificial-turf pitch, sand pads at both ends
stadium(FIELD.r+1.2);g.fillStyle='#bfb096';g.fill();stadium(FIELD.r);g.fillStyle=SAND;g.fill();
{g.save();stadium(FIELD.r);g.clip();speckle(g,GW,GW,60000,['#c9b48e','#e6d8bb'],.35);g.restore()}
{const[a0,c0,a1,c1]=FIELD.turf,n=14,h=(c1-c0)/n;for(let i=0;i<n;i++)rect(a0,c0+i*h,a1,c0+(i+1)*h,i%2?'#3f8a3a':'#4a9744');
  const cx=(a0+a1)/2,cz=(c0+c1)/2,L0=a0+1.6,L1=a1-1.6,T0=c0+1.6,T1=c1-1.6;g.strokeStyle='#f4f4ef';g.lineWidth=.14*gs;g.strokeRect(GX(L0),GZ(T0),(L1-L0)*gs,(T1-T0)*gs);
  polyline([[L0,cz],[L1,cz]],.14,'#f4f4ef');g.beginPath();g.arc(GX(cx),GZ(cz),8.5*gs,0,7);g.stroke();
  [[T0,1],[T1,-1]].forEach(([zz,s])=>{g.strokeRect(GX(cx-19),GZ(s>0?zz:zz-15),38*gs,15*gs);g.strokeRect(GX(cx-9),GZ(s>0?zz:zz-5.5),18*gs,5.5*gs)})}
// main road from the north gate down the west side of the field to the gym car park
const ROAD=[[1.5,-117],[2.5,-108],[7,-100],[13.5,-94.5],[16.5,-88],[16.5,62],[17.5,72],[18,104]];
polyline(ROAD,8.6,'#9a9c9c');polyline(ROAD,8,ASPH);polyline([[19.6,-86],[19.6,60]],.14,'#f2f1ea');polyline([[13.4,-86],[13.4,60]],.14,'#f2f1ea');polyline([[16.5,-86],[16.5,60]],.12,'#f2f1ea',[2.5,2.5]);
// car parks: west of the main road, north-east lot by the gate, along the north wall of 청운관, round the courtyard and on the gym plateau
const stalls=(x0,z0,x1,z1,alongX,step)=>{for(let t=(alongX?x0:z0);t<=(alongX?x1:z1)+.01;t+=step||2.5)polyline(alongX?[[t,z0],[t,z1]]:[[x0,t],[x1,t]],.1,'#f2f1ea')};
rect(3,-60,12.4,26,ASPH);stalls(3,-60,8.2,26,false);
rect(-12,-100,12.4,-56,ASPH);stalls(-10,-70,10,-64.5,true);stalls(-10,-62,10,-56.5,true);
rect(-102,-93,-10,-76,ASPH);stalls(-100,-93,-14,-88,true);stalls(-100,-81,-14,-76,true);
{g.fillStyle='#6f9a4a';g.beginPath();g.ellipse(GX(-1),GZ(-84),6*gs,4*gs,0,0,7);g.fill()}
rect(-84,-54.5,-27.5,21,ASPH);stalls(-79,-54.5,-41,-49.5,true);stalls(-33,-46,-27.5,0,false);
rect(-5,3,12.4,12,ASPH);rect(5.5,12,12.4,38.5,ASPH);rect(-95,32.6,12.4,38.5,ASPH);polyline([[-93,36.2],[10,36.2]],.12,'#f2f1ea');polyline([[-93,34.6],[10,34.6]],.12,'#f2f1ea',[2,2]);
rect(-86.8,31,-78.6,82,ASPH);
rect(-6,104,25,153,ASPH);stalls(-4,110,23,115.5,true);stalls(-4,124,23,129.5,true);stalls(-4,138,23,143.5,true);
// accessible bays (blue) at the 청운관 and 덕린관 entrances
[[-9,-58,-5.5,-55],[-4,4,-0.5,8]].forEach(([a,b,c,d])=>rect(a,b,c,d,'#4f86c6'));
// courtyard (중정): lawn with brick paths — two diagonals, an east–west path and a ring round the big centre tree
const CC=[-59,-23];rect(-79,-48,-39,2,LAWN);
{g.save();g.beginPath();g.rect(GX(-79),GZ(-48),40*gs,50*gs);g.clip();[[[-79,-48],[-39,2]],[[-39,-48],[-79,2]],[[-79,CC[1]],[-39,CC[1]]]].forEach(p=>polyline(p,2.6,BRICKP));g.restore()}
g.strokeStyle=BRICKP;g.lineWidth=2.4*gs;g.beginPath();g.arc(GX(CC[0]),GZ(CC[1]),7.8*gs,0,7);g.stroke();g.fillStyle='#7c9a4f';g.beginPath();g.arc(GX(CC[0]),GZ(CC[1]),6.6*gs,0,7);g.fill();
g.strokeStyle='#d9d6cc';g.lineWidth=.35*gs;g.strokeRect(GX(-79),GZ(-48),40*gs,50*gs);
// topiary beds either side of the paved forecourt in front of 만대관's entrance
rect(-5,-52,3,-31,'#7f9f52');rect(-5,-11,3,3,'#7f9f52');
// garden south of 덕린관 (생명의 숲): lawn, paths, a rock-lined stream and a small pond
const GARDEN=[[-58,39],[4,39],[4,77],[-58,77]];poly(GARDEN,LAWN);
const STREAM=[[-50,62],[-44,55],[-37,50],[-29,46.5],[-19,43.5],[-9,42],[1,41.5]];
polyline([[-56,42],[-46,48],[-33,53],[-18,51],[-4,56],[2,66]],1.6,'#d8c9a2');polyline([[-33,53],[-37,66],[-42,76]],1.4,'#d8c9a2');polyline([[-18,51],[-14,64],[-10,76]],1.4,'#d8c9a2');
polyline(STREAM,2.6,'#8f8a7a');polyline(STREAM,1.6,'#6f93a3');
g.fillStyle='#5f8798';g.beginPath();g.ellipse(GX(-24),GZ(64),6*gs,3.6*gs,0,0,7);g.fill();g.strokeStyle='#8f8a80';g.lineWidth=.6*gs;g.stroke();
// gym plateau retaining wall line and the 9동 forecourt
rect(-64,102.6,11.5,103.8,'#8f8a80');
// contact shadow under every building
BLD.forEach(b=>{Object.values(b.plan).length&&b.floors[1].forEach(r=>{const[x0,z0,x1,z1]=wRect(b,r.u0,r.v0,r.u1,r.v1);rect(x0-.8,z0-.8,x1+.8,z1+.8,'#a9a497')})});
speckle(g,GW,GW,160000,['#000','#fff'],.06);
const groundTex=tex(gc);
const groundGeo=new THREE.PlaneGeometry(GS,GS,400,400);groundGeo.rotateX(-Math.PI/2);
{const p=groundGeo.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,GH(p.getX(i),p.getZ(i)));groundGeo.computeVertexNormals()}
const ground=new THREE.Mesh(groundGeo,new THREE.MeshStandardMaterial({map:groundTex,roughness:.95,metalness:0,envMapIntensity:.5}));
ground.receiveShadow=true;S.add(ground);
const far=new THREE.Mesh(new THREE.PlaneGeometry(4000,4000),new THREE.MeshStandardMaterial({color:0xb4ae9f,roughness:1}));far.rotation.x=-Math.PI/2;far.position.y=-.05;far.receiveShadow=true;S.add(far);
{const m=new THREE.Mesh(new THREE.BoxGeometry(75.5,HILL+.6,.8),new THREE.MeshStandardMaterial({color:0xa7a299,roughness:.9}));m.position.set(-26.25,(HILL+.6)/2-.3,103.2);m.castShadow=m.receiveShadow=true;S.add(m)}

// ---------- decor ----------
const decorStart=S.children.length;
const instAll=[];
function inst(geo,mat,list,set){const m=new THREE.InstancedMesh(geo,mat,Math.max(1,list.length));m.count=list.length;instAll.push(m);list.forEach((p,i)=>{set(p,dummy);dummy.updateMatrix();m.setMatrixAt(i,dummy.matrix)});m.castShadow=m.receiveShadow=true;S.add(m);return m}
const inRect=(x,z,bb,p)=>x>bb[0]-p&&x<bb[2]+p&&z>bb[1]-p&&z<bb[3]+p;
function nearBuilding(x,z,p){return BLD.some(b=>b.floors[1].concat(b.floors[2]||[]).some(r=>{const w=wRect(b,r.u0,r.v0,r.u1,r.v1);return inRect(x,z,w,p)}))}
// trees: woods, a ginkgo row along the north fence, a zelkova row along the south road, and the gardens
const trees=[];seed=7;
function forestIn(P,n,avoid,s0,s1){const xs=P.map(p=>p[0]),zs=P.map(p=>p[1]);for(let i=0;i<n;i++){const x=rr(Math.min(...xs),Math.max(...xs)),z=rr(Math.min(...zs),Math.max(...zs));
  if(!inPoly(x,z,P)||(avoid&&avoid(x,z))||nearBuilding(x,z,3)||inStadium(x,z,3))continue;trees.push({x,z,s:rr(s0||.85,s1||1.35)})}}
forestIn(WOOD[0],150);forestIn(WOOD[1],120);forestIn(WOOD[2],30);forestIn(WOOD[3],24);
forestIn(WOOD[4],300,(x,z)=>(x>32&&x<52&&z>105&&z<150)||(x>25&&x<47&&z<82));
forestIn(GARDEN,26,(x,z)=>Math.abs(z-(62-(x+50)*.36))<2.5||(x+24)**2/40+(z-64)**2/16<1.3,.7,1.1);
for(let x=24;x<=104;x+=6)if(!nearBuilding(x,-108.5,2.5))trees.push({x,z:-108.5,s:rr(1,1.2),c:0xd6ae38});
for(let x=-60;x<=110;x+=8)if(x<-8||x>27)trees.push({x,z:152.5,s:rr(.9,1.1)});
[[0.5,-8,0x8a3b3b],[4.5,-42,0x93403a],[-1,-46,0x7a3a34],[-44,47,0xc9622e],[-30,72,0xb8432e],[-12,47,0xd2742a],[-50,68,0xc95a2a]].forEach(([x,z,c])=>trees.push({x,z,s:.9,c}));
trees.push({x:CC[0],z:CC[1],s:1.9,c:0x3f6a2c});
const trunkI=new THREE.InstancedMesh(new THREE.CylinderGeometry(.22,.32,1,6),new THREE.MeshStandardMaterial({color:0x5b4636,roughness:1}),trees.length);
const blobs=[];trees.forEach(t=>{const n=3+((rnd()*3)|0);for(let j=0;j<n;j++){const a=rnd()*6.28,r=rr(.6,1.6)*t.s;blobs.push({x:t.x+Math.cos(a)*r,z:t.z+Math.sin(a)*r,y:GH(t.x,t.z)+(3.4+rr(0,1.8))*t.s,s:rr(1.6,2.4)*t.s,c:t.c})}});
const crownGeo=new THREE.IcosahedronGeometry(1,2);
{const p=crownGeo.attributes.position;for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i);v.multiplyScalar(1+(Math.sin(v.x*7)+Math.cos(v.y*9)+Math.sin(v.z*8))*.05);p.setXYZ(i,v.x,v.y,v.z)}crownGeo.computeVertexNormals()}
const crownI=new THREE.InstancedMesh(crownGeo,new THREE.MeshStandardMaterial({roughness:.95,envMapIntensity:.4}),blobs.length);
const greens=[0x4f7d2f,0x5d8c36,0x3f6d2a,0x6b9a3f,0x557f31,0x8a8a36];
trees.forEach((t,i)=>{const gy=GH(t.x,t.z);dummy.position.set(t.x,gy+1.7*t.s,t.z);dummy.rotation.set(0,0,0);dummy.scale.set(t.s,3.4*t.s,t.s);dummy.updateMatrix();trunkI.setMatrixAt(i,dummy.matrix)});
blobs.forEach((b,i)=>{dummy.position.set(b.x,b.y,b.z);dummy.rotation.set(rnd(),rnd(),rnd());dummy.scale.set(b.s,b.s*.9,b.s);dummy.updateMatrix();crownI.setMatrixAt(i,dummy.matrix);crownI.setColorAt(i,col.set(b.c||greens[(rnd()*greens.length)|0]).multiplyScalar(rr(.85,1.1)))});
[trunkI,crownI].forEach(m=>{m.castShadow=true;m.receiveShadow=true;instAll.push(m);S.add(m)});
// cloud-pruned pines: both sides of the main road, along 덕린관's south wall, in front of 만대관 and 청운관, round the courtyard
const pines=[];seed=61;
for(let z=-84;z<=58;z+=6.5){pines.push({x:11.6,z,s:rr(.85,1.05)});if(!CANOPY_AT(z))pines.push({x:21.3,z,s:rr(.85,1.05)})}
for(let x=-92;x<=2;x+=4.6)pines.push({x,z:31.9,s:rr(.7,.9)});
for(let i=0;i<16;i++)pines.push({x:rr(-4,2),z:i%2?rr(-50,-33):rr(-9,1),s:rr(.75,1.15)});
[[-7,-70],[-3,-66],[-7,-60.5],[-3,-74]].forEach(([x,z])=>pines.push({x,z,s:.95}));
[[-66,-30],[-52,-30],[-66,-16],[-52,-16]].forEach(([x,z])=>pines.push({x,z,s:.95}));
for(let z=-45;z<=-1;z+=5.5)pines.push({x:-37.6,z,s:rr(.75,.95)});
for(let x=-76;x<=-42;x+=6)pines.push({x,z:1.2,s:rr(.7,.9)});
const pads=[];pines.forEach(p=>{const n=4+((rnd()*3)|0);p.n=n;for(let j=0;j<n;j++){const a=j*2.3+rnd(),r=(j===n-1?0:.75*(1-j/n))*p.s;pads.push({x:p.x+Math.cos(a)*r,z:p.z+Math.sin(a)*r,y:GH(p.x,p.z)+(1.1+j*.8)*p.s,s:(1.05-j*.13)*p.s})}});
inst(new THREE.CylinderGeometry(.09,.15,1,6),new THREE.MeshStandardMaterial({color:0x5b4636,roughness:1}),pines,(p,d)=>{const h=(1.1+(p.n-1)*.8)*p.s;d.position.set(p.x,GH(p.x,p.z)+h/2,p.z);d.rotation.set(0,0,0);d.scale.set(p.s,h,p.s)});
{const pm3=inst(new THREE.SphereGeometry(1,14,8),new THREE.MeshStandardMaterial({roughness:.9}),pads,(p,d)=>{d.position.set(p.x,p.y,p.z);d.rotation.set(0,rnd()*3,0);d.scale.set(p.s*1.15,p.s*.48,p.s*1.15)});pads.forEach((p,i)=>pm3.setColorAt(i,col.set(0x3f5c27).multiplyScalar(rr(.8,1.2))))}
// clipped round shrubs (boxwood) lining the courtyard paths, the 만대관 garden and the garden paths
const shrubs=[];seed=83;
const alongLine=(a,b,step,off)=>{const L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.floor(L/step);for(let i=1;i<n;i++){const t=i/n,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t,nx=-(b[1]-a[1])/L,nz=(b[0]-a[0])/L;[-1,1].forEach(s=>shrubs.push({x:x+nx*off*s,z:z+nz*off*s,s:rr(.55,.85)}))}};
[[[-79,-48],[-39,2]],[[-39,-48],[-79,2]],[[-79,CC[1]],[-39,CC[1]]]].forEach(([a,b])=>alongLine(a,b,3.4,2.1));
for(let k=0;k<shrubs.length;k++){const s=shrubs[k];if(Math.hypot(s.x-CC[0],s.z-CC[1])<9.5||s.x<-78.4||s.x>-39.6||s.z<-47.4||s.z>1.4){shrubs.splice(k,1);k--}}
for(let i=0;i<40;i++)shrubs.push({x:rr(-4.6,2.6),z:i%2?rr(-51,-32):rr(-10,2),s:rr(.6,1.2)});
for(let i=0;i<30;i++){const x=rr(-56,2),z=rr(40,46);if(!nearBuilding(x,z,1))shrubs.push({x,z,s:rr(.5,.9)})}
inst(new THREE.SphereGeometry(1,12,8),new THREE.MeshStandardMaterial({color:0x466f32,roughness:.95}),shrubs,(p,d)=>{d.position.set(p.x,GH(p.x,p.z)+p.s*.55,p.z);d.rotation.set(0,0,0);d.scale.set(p.s,p.s*.85,p.s)});
// rocks along the stream
const rocks=[];seed=71;for(let i=0;i<STREAM.length-1;i++){const[a,c]=[STREAM[i],STREAM[i+1]];for(let t=0;t<1;t+=.2){const x=a[0]+(c[0]-a[0])*t,z=a[1]+(c[1]-a[1])*t;[-1,1].forEach(s=>rocks.push({x:x+rr(-.3,.3),z:z+s*rr(1.2,1.7),s:rr(.4,.85)}))}}
inst(new THREE.DodecahedronGeometry(1,0),new THREE.MeshStandardMaterial({color:0xa9a59c,roughness:.95,flatShading:true}),rocks,(p,d)=>{d.position.set(p.x,p.s*.3,p.z);d.rotation.set(rnd(),rnd()*3,rnd());d.scale.set(p.s*1.2,p.s*.7,p.s)});
// text planes
function textTex(lines,W,H,bg,fg,size,weight){const [c,x]=canvas(W,H);if(bg){x.fillStyle=bg;x.fillRect(0,0,W,H)}x.fillStyle=fg;x.textAlign='center';x.textBaseline='middle';
  lines.forEach(l=>{x.font=(l.w||weight||800)+' '+(l.s||size)+'px "Gothic A1",sans-serif';x.fillStyle=l.c||fg;x.fillText(l.t,W/2,l.y*H)});return tex(c)}
function plane(t,w,h,x,y,z,ry,glow){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:t,transparent:true,roughness:.7,emissiveMap:glow?t:null,emissive:glow?0xffffff:0x000000,emissiveIntensity:0}));
  m.position.set(x,y,z);m.rotation.y=ry;S.add(m);if(glow)nightMats.push(m.material);return m}
const white=plainMat(0xf4f4ef,{roughness:.5}),steel=plainMat(0xd9dcdf,{metalness:.7,roughness:.3}),cladWood=plainMat(0xb06a3c,{roughness:.6}),brownRoof=new THREE.MeshStandardMaterial({color:0x5a3f33,roughness:.55,metalness:.25,side:THREE.DoubleSide});
// motto stone island in the garden
{const stone=plainMat(0xbdb6a8,{roughness:.9}),lawn=plainMat(0x5f9a45,{roughness:.95}),I=[-4,71];
 const pl=new THREE.Mesh(new THREE.CylinderGeometry(3.4,3.5,.5,40),[stone,lawn,stone]);pl.position.set(I[0],.25,I[1]);pl.receiveShadow=true;pl.castShadow=true;S.add(pl);
 const fl=[];for(let i=0;i<48;i++){const a=i/48*Math.PI*2;fl.push({x:I[0]+Math.cos(a)*3,z:I[1]+Math.sin(a)*3,c:i%8<4?0xd8423a:0xf3f0ea})}
 const fm=inst(new THREE.SphereGeometry(.3,8,6),plainMat(0xffffff,{roughness:.8}),fl,(p,d)=>{d.position.set(p.x,.62,p.z);d.rotation.set(0,0,0);d.scale.set(1,.8,1)});fl.forEach((p,i)=>fm.setColorAt(i,col.set(p.c)));
 const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(1,1),new THREE.MeshStandardMaterial({color:0xb7b3aa,roughness:.85,flatShading:true}));rock.scale.set(.55,1.1,1.6);rock.position.set(I[0]+.9,1.5,I[1]);rock.castShadow=true;S.add(rock);
 plane(textTex([{t:'더불어 사는 사람',y:.5}],512,96,null,'#3b3a36',64),2.6,.5,I[0]+1.52,1.75,I[1],Math.PI/2);
 const base2=new THREE.Mesh(new THREE.BoxGeometry(.9,.5,2.2),plainMat(0x6f6b63,{roughness:.6}));base2.position.set(I[0]+1.2,.75,I[1]);S.add(base2)}
// 구령대 (podium) beside the track: green-tiled deck, steel rails, wood-clad posts and a curved roof; flagpoles behind it
{const P=new THREE.Group(),tile=plainMat(0x3f7f73,{roughness:.6});
 const deck=new THREE.Mesh(new THREE.BoxGeometry(6,1.2,10),tile);deck.position.y=.6;P.add(deck);
 for(let k=0;k<3;k++){const stp=new THREE.Mesh(new THREE.BoxGeometry(.5,1.2-(k+1)*.3,4.4),plainMat(0xc9c4ba,{roughness:.85}));stp.position.set(3.25+k*.5,(1.2-(k+1)*.3)/2,0);P.add(stp)}
 [[-3,0,.04,10],[0,-5,6,.04],[0,5,6,.04]].forEach(([x,z,sx,sz])=>{const r=new THREE.Mesh(new THREE.BoxGeometry(sx||.04,.05,sz),steel);r.position.set(x,2.2,z);P.add(r)});
 [[-2.6,-4.6],[2.6,-4.6],[-2.6,4.6],[2.6,4.6]].forEach(([a,b])=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,3.6,10),cladWood);p.position.set(a,1.2+1.8,b);P.add(p)});
 const rg=new THREE.CylinderGeometry(9,9,11,32,1,true,-.36,.72);const roof=new THREE.Mesh(rg,brownRoof);roof.rotation.x=Math.PI/2;roof.position.set(0,-3.9,0);P.add(roof);
 const fas=new THREE.Mesh(new THREE.BoxGeometry(.12,.35,11),plainMat(0xd8423a));fas.position.set(3.2,4.62,0);P.add(fas);
 P.position.set(24.6,0,-21);P.traverse(o=>{o.castShadow=true;o.receiveShadow=true});S.add(P);
 const [fc,fx]=canvas(192,128);fx.fillStyle='#fff';fx.fillRect(0,0,192,128);fx.save();fx.translate(96,64);fx.rotate(-.59);fx.fillStyle='#cd2e3a';fx.beginPath();fx.arc(0,0,32,Math.PI,0);fx.fill();fx.fillStyle='#0047a0';fx.beginPath();fx.arc(0,0,32,0,Math.PI);fx.fill();
 fx.fillStyle='#cd2e3a';fx.beginPath();fx.arc(-16,0,16,0,Math.PI*2);fx.fill();fx.fillStyle='#0047a0';fx.beginPath();fx.arc(16,0,16,0,Math.PI*2);fx.fill();fx.restore();
 fx.fillStyle='#111';[[34,24,-.98],[158,24,.98],[34,104,.98],[158,104,-.98]].forEach(([x,y,r])=>{fx.save();fx.translate(x,y);fx.rotate(r);for(let k=-1;k<=1;k++)fx.fillRect(-14,k*7-2,28,4.5);fx.restore()});
 const flagT=tex(fc),[sc,sx]=canvas(64,48);sx.fillStyle='#f6f6f2';sx.fillRect(0,0,64,48);sx.fillStyle='#2f7d4f';sx.beginPath();sx.arc(32,24,12,0,7);sx.fill();const schT=tex(sc);
 [[21.2,-29.5,flagT],[21.2,-31.5,schT],[21.2,-33.5,schT]].forEach(([x,z,t],i)=>{const h=i?9:10.5;const pole=new THREE.Mesh(new THREE.CylinderGeometry(.06,.08,h,8),steel);pole.position.set(x,h/2,z);pole.castShadow=true;S.add(pole);
   const f=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.2),new THREE.MeshStandardMaterial({map:t,side:THREE.DoubleSide,roughness:.8}));f.position.set(x,h-.7,z-.95);f.rotation.y=Math.PI/2;f.castShadow=true;S.add(f)})}
// wave-roofed shelters with benches and flower planters between the road and the track
{const wg=new THREE.PlaneGeometry(5.2,12,1,36);wg.rotateX(-Math.PI/2);const p=wg.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setY(i,.55*Math.cos(z/12*Math.PI*2*1.5)+x*.12)}wg.computeVertexNormals();
 const [sc2,sx2]=canvas(64,256);sx2.fillStyle='#5a3f33';sx2.fillRect(0,0,64,256);for(let j=0;j<256;j+=10){sx2.fillStyle='#4a3229';sx2.fillRect(0,j,64,3)}const wm=new THREE.MeshStandardMaterial({map:tex(sc2),roughness:.5,metalness:.3,side:THREE.DoubleSide});
 const planter=plainMat(0x6b4a32,{roughness:.8}),bench=plainMat(0x7a5a3a,{roughness:.8});const bloom=[];
 CANOPIES.forEach(cz=>{const G=new THREE.Group();const r=new THREE.Mesh(wg,wm);r.position.y=3.3;G.add(r);
   [-5,-1,3,5.6].forEach(z=>[-1.9,1.9].forEach(x=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,3.3,8),cladWood);c.position.set(x,1.65,z*.95);G.add(c)}));
   [-3,3].forEach(z=>{const bn=new THREE.Mesh(new THREE.BoxGeometry(1.4,.45,3.4),bench);bn.position.set(.6,.25,z);G.add(bn)});
   const pb=new THREE.Mesh(new THREE.BoxGeometry(1,.7,6),planter);pb.position.set(-3.2,.35,0);G.add(pb);for(let k=0;k<14;k++)bloom.push({x:22.4+rr(-.4,.4),z:cz+rr(-2.8,2.8),c:[0xf2f0ea,0xe25b7a,0xf2c230][k%3]});
   G.position.set(25.6,0,cz);G.traverse(o=>{o.castShadow=true;o.receiveShadow=true});S.add(G)});
 const bm=inst(new THREE.SphereGeometry(.32,8,6),plainMat(0xffffff,{roughness:.8}),bloom,(q,d)=>{d.position.set(q.x,.85,q.z);d.rotation.set(0,0,0);d.scale.set(1,.8,1)});bloom.forEach((q,i)=>bm.setColorAt(i,col.set(q.c)))}
// field goals and basketball hoops on the north sand pad
{const[a0,c0,a1,c1]=FIELD.turf,cx=(a0+a1)/2;[[c0+1.6,-1],[c1-1.6,1]].forEach(([gz,s])=>{const gp=new THREE.Group();
  [-3.66,3.66].forEach(x=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,2.44,8),white);p.position.set(x,1.22,0);gp.add(p)});
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,7.32,8),white);bar.rotation.z=Math.PI/2;bar.position.y=2.44;gp.add(bar);
  const net=new THREE.Mesh(new THREE.PlaneGeometry(7.32,2.44),new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.25,side:THREE.DoubleSide}));net.position.set(0,1.22,s*1.2);net.rotation.x=s*.4;gp.add(net);
  gp.position.set(cx,0,gz);gp.traverse(o=>o.castShadow=true);S.add(gp)});
 [[52,-92],[80,-92]].forEach(([x,z])=>{const h=new THREE.Group();const p=new THREE.Mesh(new THREE.CylinderGeometry(.1,.12,3.4,8),plainMat(0x3d6f9e));p.position.y=1.7;h.add(p);
  const bd=new THREE.Mesh(new THREE.BoxGeometry(1.8,1.05,.06),white);bd.position.set(0,3.4,.5);h.add(bd);const ring=new THREE.Mesh(new THREE.TorusGeometry(.23,.02,6,16),plainMat(0xe0632a));ring.rotation.x=Math.PI/2;ring.position.set(0,3.05,.8);h.add(ring);
  h.position.set(x,0,z);h.traverse(o=>o.castShadow=true);S.add(h)})}
// north gate over the main road, with the guard house beside it
{const gb=plainMat(0x6e4a36,{roughness:.8}),G=new THREE.Group();[[11.4,-97.6],[21.6,-97.6]].forEach(([x,z])=>{const p=new THREE.Mesh(new THREE.BoxGeometry(1.2,6,1.2),gb);p.position.set(x,3,z);G.add(p)});
 const beam=new THREE.Mesh(new THREE.BoxGeometry(11.4,.9,.7),gb);beam.position.set(16.5,5.6,-97.6);G.add(beam);G.traverse(o=>o.castShadow=true);S.add(G);
 plane(textTex([{t:'광덕중·고등학교',y:.5}],1024,96,'#f2efe6','#2b3a33',60),9.4,.7,16.5,5.6,-97.2,0);
 const kiosk=new THREE.Mesh(new THREE.BoxGeometry(.5,2.2,1.4),white);kiosk.position.set(16.5,1.1,-93);kiosk.castShadow=true;S.add(kiosk)}
// stone retaining walls: along the north car park and beside the lane west of 단재관
{const [c,x]=canvas(256,64);x.fillStyle='#6f6c60';x.fillRect(0,0,256,64);seed=303;for(let i=0;i<70;i++){x.fillStyle=shade('#8a8676',rr(.85,1.12));const w=rr(14,30),h=rr(9,16);x.beginPath();x.ellipse(rr(0,256),rr(0,64),w/2,h/2,rr(-.3,.3),0,7);x.fill()}
 const wt=tex(c);[[-56,-93.3,88,.6,2.6],[-87.1,55.5,.6,49,2.8]].forEach(([wx,wz,sx,sz,h])=>{const t=wt.clone();t.needsUpdate=true;t.repeat.set(Math.max(sx,sz)/8,1);const m=new THREE.Mesh(new THREE.BoxGeometry(sx,h,sz),new THREE.MeshStandardMaterial({map:t,roughness:.95}));m.position.set(wx,h/2,wz);m.castShadow=m.receiveShadow=true;S.add(m)})}
// bike shed on the north side of 청운관 and a shaded picnic shelter in the garden
{const st=plainMat(0x5c6266,{metalness:.5,roughness:.5}),sh=new THREE.Group();const r=new THREE.Mesh(new THREE.BoxGeometry(10,.12,2.6),plainMat(0x9fb3b6,{roughness:.3,metalness:.2}));r.position.y=2.4;sh.add(r);
 [-4.8,0,4.8].forEach(x=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.12,2.4,.12),st);p.position.set(x,1.2,-1.2);sh.add(p)});sh.position.set(-62.5,0,-69.6);sh.traverse(o=>o.castShadow=true);S.add(sh);
 const pg=new THREE.Group(),net=new THREE.Mesh(new THREE.BoxGeometry(8,.06,4.4),new THREE.MeshStandardMaterial({color:0x2f5a46,roughness:.9,transparent:true,opacity:.85}));net.position.y=2.6;pg.add(net);
 [[-3.8,-2.1],[3.8,-2.1],[-3.8,2.1],[3.8,2.1],[0,-2.1],[0,2.1]].forEach(([x,z])=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.15,2.6,.15),plainMat(0x5b4636));p.position.set(x,1.3,z);pg.add(p)});
 [-2.4,0,2.4].forEach(x=>{const t=new THREE.Mesh(new THREE.BoxGeometry(1.6,.75,1.8),plainMat(0x7a5236,{roughness:.8}));t.position.set(x,.38,0);pg.add(t)});pg.position.set(-46,0,44.5);pg.traverse(o=>o.castShadow=true);S.add(pg)}
// neighbourhood houses
const houses=[];seed=21;
const roadX=z=>{for(let i=0;i<westRoad.length-1;i++){const[a,b]=[westRoad[i],westRoad[i+1]];if(z>=a[1]&&z<=b[1])return a[0]+(b[0]-a[0])*(z-a[1])/(b[1]-a[1])}return -128};
function addHouses(x0,x1,z0,z1,n,avoid){for(let i=0;i<n;i++){const x=rr(x0,x1),z=rr(z0,z1);if(avoid&&avoid(x,z))continue;
  const w=rr(7,13),d=rr(7,12);if(houses.some(h=>Math.abs(h.x-x)<(h.w+w)/2+1.5&&Math.abs(h.z-z)<(h.d+d)/2+1.5))continue;if(inPoly(x,z,CAMPUS)||nearBuilding(x,z,8))continue;
  houses.push({x,z,w,d,h:rr(5,11),ry:rr(-.08,.08),pitch:rnd()<.45,wall:['#e9e4d8','#d8cfc0','#c7b49d','#a8735c','#e3dfd6'][(rnd()*5)|0],roof:['#2f9c84','#3aa58a','#4bb39a','#7d8a92','#a04f3b','#3f8f78','#6c6f73','#3d6fb5'][(rnd()*8)|0]})}}
const nearStreet=(x,z)=>Math.abs(z+120.5)<9||Math.abs(x-119)<9||Math.abs(z-159)<9;
addHouses(-200,-118,-200,200,330,(x,z)=>x>roadX(z)-9||nearStreet(x,z));
addHouses(-200,-55,-200,-126,70,nearStreet);
addHouses(125,200,-200,200,160,nearStreet);
addHouses(-90,200,166,200,70,nearStreet);
{const [c,x]=canvas(64,64);x.fillStyle='#fff';x.fillRect(0,0,64,64);x.fillStyle='#55697c';[[8,10],[36,10],[8,38],[36,38]].forEach(([a,b])=>x.fillRect(a,b,18,14));x.fillStyle='#c9c4ba';x.fillRect(0,30,64,3);
  const wt=tex(c);const wallI=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({map:wt,roughness:.9}),houses.length);
  const roofs=houses.filter(h=>h.pitch),flats=houses.filter(h=>!h.pitch);
  const prism=new THREE.CylinderGeometry(1,1,1,3,1);prism.rotateZ(Math.PI/2);prism.rotateX(Math.PI/6);prism.scale(1,.5,1);
  const roofI=new THREE.InstancedMesh(prism,plainMat(0xffffff,{roughness:.7}),roofs.length),capI=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),plainMat(0xffffff,{roughness:.85}),flats.length);
  houses.forEach((h,i)=>{dummy.position.set(h.x,h.h/2,h.z);dummy.rotation.set(0,h.ry,0);dummy.scale.set(h.w,h.h,h.d);dummy.updateMatrix();wallI.setMatrixAt(i,dummy.matrix);wallI.setColorAt(i,col.set(h.wall))});
  roofs.forEach((h,i)=>{dummy.position.set(h.x,h.h+1.4,h.z);dummy.rotation.set(0,h.ry,0);dummy.scale.set(h.w+.6,2.8,(h.d+.6)/1.73);dummy.updateMatrix();roofI.setMatrixAt(i,dummy.matrix);roofI.setColorAt(i,col.set(h.roof))});
  flats.forEach((h,i)=>{dummy.position.set(h.x,h.h+.2,h.z);dummy.rotation.set(0,h.ry,0);dummy.scale.set(h.w+.3,.4,h.d+.3);dummy.updateMatrix();capI.setMatrixAt(i,dummy.matrix);capI.setColorAt(i,col.set(h.roof))});
  wallI.userData.squash=1;[wallI,roofI,capI].forEach(m=>{m.castShadow=m.receiveShadow=true;instAll.push(m);S.add(m)})}
// the high-rise apartment blocks north and north-east of the school (positions from the satellite photo)
{const [c,x]=canvas(128,512);x.fillStyle='#f0ece2';x.fillRect(0,0,128,512);seed=91;
 for(let f=0;f<32;f++){const y=f*16;x.fillStyle='#d9d5cb';x.fillRect(0,y+12,128,4);for(let k=0;k<4;k++){x.fillStyle=rnd()<.15?'#c9d3dc':'#7f93a6';x.fillRect(6+k*31,y+3,22,8)}}
 x.fillStyle='#9c6b4e';x.fillRect(0,0,128,10);x.fillStyle='#e4d6c2';x.fillRect(0,0,6,512);x.fillRect(122,0,6,512);const at=tex(c);
 const apts=[[-68,-157],[18,-154],[86,-157],[164,-164],[-18,-214],[64,-218],[136,-218],[189,-382],[214,-339],[229,-296],[246,-257],[268,-196],[314,-207],[357,-257],[371,-221],[314,-93],[336,-54],[357,-14]]
   .map(([ax,az])=>({x:ax,z:az,h:rr(70,84),w:rr(30,36),d:rr(15,18),ry:-.55+rr(-.08,.08)}));
 const am=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({map:at,roughness:.8}),apts.length);
 apts.forEach((a,i)=>{dummy.position.set(a.x,a.h/2,a.z);dummy.rotation.set(0,a.ry,0);dummy.scale.set(a.w,a.h,a.d);dummy.updateMatrix();am.setMatrixAt(i,dummy.matrix)});am.userData.squash=1;instAll.push(am);S.add(am)}
// cars: the car parks are full on a school day
const cars=[];seed=31;
for(let z=-58.8;z<25;z+=2.5)if(rnd()<.75)cars.push({x:5.8,z,ry:Math.PI/2});
for(let x=-8.8;x<10;x+=2.5){if(rnd()<.7)cars.push({x,z:-67.2,ry:0});if(rnd()<.6)cars.push({x,z:-59.2,ry:0})}
for(let x=-98.8;x<-14;x+=2.5){if(rnd()<.7)cars.push({x,z:-90.4,ry:0});if(rnd()<.55)cars.push({x,z:-78.6,ry:0})}
for(let x=-77.8;x<-41;x+=2.5)if(rnd()<.75)cars.push({x,z:-52,ry:0});
for(let z=-44.8;z<0;z+=2.5)if(rnd()<.7)cars.push({x:-30.2,z,ry:Math.PI/2});
[-27.5,-24.8,-17.2,-14.5].forEach(z=>{if(rnd()<.8)cars.push({x:-.5,z,ry:Math.PI/2})});
for(let x=-2.8;x<23;x+=2.5)[112.8,126.8,140.8].forEach(z=>{if(rnd()<.7)cars.push({x,z,ry:0,y:HILL})});
for(let i=0;i<14;i++){const z=rr(-180,190),x=roadX(z)+(rnd()<.5?-2:2);cars.push({x,z,ry:0})}
for(let i=0;i<10;i++)cars.push({x:119+(rnd()<.5?-2:2),z:rr(-180,180),ry:0});
for(let i=0;i<10;i++)cars.push({x:rr(-180,180),z:-120.5+(rnd()<.5?-2:2),ry:Math.PI/2});
{const bodyI=new THREE.InstancedMesh(new THREE.BoxGeometry(1.8,.8,4.3),new THREE.MeshStandardMaterial({roughness:.35,metalness:.5,envMapIntensity:1}),cars.length);
  const cabI=new THREE.InstancedMesh(new THREE.BoxGeometry(1.6,.6,2.3),new THREE.MeshStandardMaterial({color:0x26303a,roughness:.2,metalness:.6}),cars.length);
  const cc=[0xf1f1f1,0x1f2226,0x8e959c,0xc8ccd0,0x2c4a7a,0x8a2a24,0xf1f1f1,0xf1f1f1,0x1f2226];
  cars.forEach((c,i)=>{const y=c.y||0;dummy.position.set(c.x,y+.75,c.z);dummy.rotation.set(0,c.ry,0);dummy.scale.set(1,1,1);dummy.updateMatrix();bodyI.setMatrixAt(i,dummy.matrix);bodyI.setColorAt(i,col.set(cc[(rnd()*cc.length)|0]));
    dummy.position.y=y+1.45;dummy.translateZ(-.2);dummy.updateMatrix();cabI.setMatrixAt(i,dummy.matrix)});
  [bodyI,cabI].forEach(m=>{m.castShadow=true;instAll.push(m);S.add(m)})}
// street lamps
const lamps=[];for(let z=-80;z<=60;z+=20)lamps.push({x:12.6,z:z+3});
for(let x=-88;x<=8;x+=16)lamps.push({x,z:38.9});
[[-80,-49],[-38,-49],[-80,1.5],[-38,1.5],[-56,-79],[-30,-79],[-90,-79],[0,108],[20,108],[0,148],[20,148],[-50,60],[-20,70],[-82,40],[-82,70],[30,-100],[60,-100]].forEach(([x,z])=>lamps.push({x,z}));
inst(new THREE.CylinderGeometry(.08,.1,6,6),plainMat(0x50555a,{metalness:.6,roughness:.4}),lamps,(p,d)=>{d.position.set(p.x,GH(p.x,p.z)+3,p.z);d.rotation.set(0,0,0);d.scale.set(1,1,1)});
const bulbMat=new THREE.MeshStandardMaterial({color:0xeeeeee,emissive:0xffd59a,emissiveIntensity:0});nightMats.push(bulbMat);
inst(new THREE.SphereGeometry(.32,10,8),bulbMat,lamps,(p,d)=>{d.position.set(p.x,GH(p.x,p.z)+6.1,p.z);d.rotation.set(0,0,0);d.scale.set(1,1,1)});
const decorEnd=S.children.length;
// ---------- things fixed to buildings (signs, banners, clock, canopies, solar panels, AC units, downpipes) ----------
const onB=[];const att=(o,b)=>{o.userData.onB=b;onB.push(o);return o};
{const d=BLD.find(b=>b.id==='deokrin'),m=BLD.find(b=>b.id==='mandae'),j=BLD.find(b=>b.id==='mid');const ex=d.X0+.06;
 att(plane(textTex([{t:'덕린관',y:.5}],512,160,null,'#f3e4bf',118),4.2,1.3,ex,4*3.6-1.5,29,Math.PI/2,true),d);
 att(plane(textTex([{t:'고등학교',y:.06,s:44,c:'#26324a'},{t:'수상 · 진학',y:.16,s:40,w:600,c:'#26324a'},{t:'SKY · 의치한',y:.28,s:40,w:600,c:'#26324a'},{t:'중학교',y:.46,s:44,c:'#26324a'},{t:'수상',y:.56,s:40,w:600,c:'#26324a'},{t:'학교법인 만대학원',y:.84,s:30,w:600,c:'#ffffff'},{t:'광덕중·고등학교',y:.92,s:44,c:'#ffffff'}],256,720,'#dfe3f2','#26324a',44),3.4,9.4,ex,7.6,25.8,Math.PI/2),d);
 const[mx,mz]=toW(m,21,22.5);att(plane(textTex([{t:'만대관',y:.5}],512,160,null,'#f3e4bf',118),3.2,.75,mx+.08,4*3.6-.75,mz,Math.PI/2,true),m);
 const[cx,cz]=toW(m,38,22.5);const ck=new THREE.Mesh(new THREE.CircleGeometry(.62,32),plainMat(0xf7f5ef,{roughness:.4}));ck.rotation.y=Math.PI/2;ck.position.set(cx+.07,4*3.6-.8,cz);S.add(ck);att(ck,m);
 const rim=new THREE.Mesh(new THREE.RingGeometry(.58,.66,32),plainMat(0x2f3a40));rim.rotation.y=Math.PI/2;rim.position.set(cx+.08,4*3.6-.8,cz);S.add(rim);att(rim,m);
 const[bx,bz]=toW(m,12,21);att(plane(textTex([{t:'민족혼이 살아',y:.12,s:54},{t:'숨 쉬는 학교',y:.24,s:54},{t:'이제 세계로!',y:.4,s:44,c:'#ffffff'},{t:'미래로!',y:.5,s:44,c:'#f2c230'},{t:'글로벌 인재양성',y:.66,s:30,w:600,c:'#ffffff'},{t:'광덕고등학교',y:.92,s:34,c:'#ffffff'}],256,560,'#1f4f9c','#f2c230',54),2.4,5.3,bx+.06,9.2,bz,Math.PI/2),m);
 const jx=j.X0+.06;att(plane(textTex([{t:'꿈이 이루어지는 광덕중학교',y:.25,s:44,w:600,c:'#f3e4bf'},{t:'청운관',y:.68,s:120}],720,220,null,'#f3e4bf',120),3.4,1.05,jx,13.4,-62.4,Math.PI/2,true),j);
 att(plane(textTex([{t:'조롱보다',y:.14,s:44,w:600,c:'#3a4b2c'},{t:'존중을,',y:.25,s:84,c:'#d23f6f'},{t:'편견보다',y:.4,s:44,w:600,c:'#3a4b2c'},{t:'배려를,',y:.51,s:84,c:'#7a3fa8'},{t:'비방보다',y:.66,s:44,w:600,c:'#3a4b2c'},{t:'이해를',y:.77,s:84,c:'#2f7d4f'}],256,720,'#f4f6e8','#3a4b2c',44),3.2,8.6,jx,8.6,-57.6,Math.PI/2),j);
 const cm=plainMat(0xe9e6df,{roughness:.6});const cn=new THREE.Mesh(new THREE.BoxGeometry(7,.3,3.2),cm);cn.position.set(-7.5,3.2,16.9);cn.castShadow=true;S.add(cn);att(cn,d);
 [-3.2,3.2].forEach(dx=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,3.2,8),cm);p.position.set(-7.5+dx,1.6,15.6);S.add(p);att(p,d)});
 const jc=new THREE.Mesh(new THREE.BoxGeometry(2.6,.3,5),cm);jc.position.set(-8.7,3.4,-62);jc.castShadow=true;S.add(jc);att(jc,j)}
// glass curtain walls over 덕린관's two courtyard-side homebase blocks (stone-clad ground floor, glazing above)
{const d=BLD.find(b=>b.id==='deokrin');const [c,x]=canvas(256,256);x.fillStyle='#8fc1c4';x.fillRect(0,0,256,256);
 const gr=x.createLinearGradient(0,0,0,256);gr.addColorStop(0,'rgba(255,255,255,.4)');gr.addColorStop(1,'rgba(40,90,95,.18)');x.fillStyle=gr;x.fillRect(0,0,256,256);
 x.fillStyle='#d9dcdc';for(let i=0;i<=256;i+=32)x.fillRect(i-2,0,4,256);for(let j=0;j<=256;j+=64)x.fillRect(0,j-3,256,6);x.fillStyle='rgba(255,255,255,.5)';for(let j=40;j<256;j+=64)x.fillRect(0,j,256,2);
 const gt=tex(c),stone=plainMat(0xd8d0c0,{roughness:.8});
 [[25,44.6],[55.2,75.3]].forEach(([u0,u1])=>{const[x0,z0]=toW(d,u1,18.2),[x1]=toW(d,u0,18.2);const w=x1-x0,zf=z0-.12;
   const sb=new THREE.Mesh(new THREE.BoxGeometry(w+.2,3.6,.3),stone);sb.position.set((x0+x1)/2,1.8,zf);S.add(sb);att(sb,d);
   const t=gt.clone();t.needsUpdate=true;t.repeat.set(w/6,1.6);const gp=new THREE.Mesh(new THREE.BoxGeometry(w+.2,3*3.6+.6,.3),new THREE.MeshStandardMaterial({map:t,roughness:.18,metalness:.15,envMapIntensity:1,emissiveMap:t,emissive:0xffffff,emissiveIntensity:0}));
   nightMats.push(gp.material);gp.position.set((x0+x1)/2,3.6+(3*3.6+.6)/2,zf);S.add(gp);att(gp,d)})}
// accent cladding from the photos: an ochre panel strip beside 덕린관's north-east corner, copper panels on 만대관's south end
{const d=BLD.find(b=>b.id==='deokrin'),m=BLD.find(b=>b.id==='mandae'),ochre=plainMat(0xd9a441,{roughness:.5,metalness:.15}),copper=plainMat(0xb4693a,{roughness:.45,metalness:.35});
 const slab=(mat,x,z,sx,sz,b)=>{const p=new THREE.Mesh(new THREE.BoxGeometry(sx,4*3.6-.4,sz),mat);p.position.set(x,(4*3.6-.4)/2,z);p.castShadow=p.receiveShadow=true;S.add(p);att(p,b)};
 slab(ochre,3.7,21.05,3,.3,d);[-14.6,-11.4,-8.2].forEach(x=>slab(copper,x,toW(m,10,0)[1]+.15,1.3,.3,m))}
const solarList=[],acList=[],pipeList=[];
GEN.solar.forEach(({b,r,y})=>{const[x0,z0,x1,z1]=wRect(b,r.u0,r.v0,r.u1,r.v1);for(let z=z0+2.2;z<z1-2;z+=2.6)for(let x=x0+2.2;x<x1-1.6;x+=1.15)solarList.push({b,x:x+.5,z:z+.8,y:y+.55})});
seed=505;BLD.forEach(b=>{if(b.hip)return;const top=floorList(b).filter(f=>b.floors[f].length>2).pop();const rs=b.floors[top];const n=Math.max(2,Math.round(rs.reduce((a,r)=>a+(r.u1-r.u0)*(r.v1-r.v0),0)/260));
  for(let k=0;k<n;k++){const r=rs[(rnd()*rs.length)|0];const[x0,z0,x1,z1]=wRect(b,r.u0,r.v0,r.u1,r.v1);if(x1-x0<3||z1-z0<3)continue;const x=rr(x0+1.2,x1-1.2),z=rr(z0+1.2,z1-1.2);
    if(solarList.some(s=>Math.abs(s.x-x)<1.4&&Math.abs(s.z-z)<1.8))continue;acList.push({b,x,z,y:y0Of(b,top)+fhOf(b,top),s:rr(.9,1.5)})}});
const floorsAt=(b,u,v)=>{let top=0;floorList(b).forEach(f=>{const p=b.plan[f];if(p.rooms.some(r=>u>r.u0&&u<r.u1&&v>r.v0&&v<r.v1&&r.t!=='void'))top=f});return top};
GEN.parts.forEach((p,i)=>{if(p.k!=='ext'||p.f!==1||p.b.gym||p.len<3||i%3)return;const nf=floorsAt(p.b,p.lu,p.lv);if(nf<2)return;
  const h=y0Of(p.b,nf)+fhOf(p.b,nf)+.6;const t=p.nx?[0,1]:[1,0];const off=.22;pipeList.push({b:p.b,x:p.x+p.nx*(Math.abs(p.nx)*(p.sx/2)+off)+t[0]*(p.sx/2-.4),z:p.z+p.nz*(Math.abs(p.nz)*(p.sz/2)+off)+t[1]*(p.sz/2-.4),h})});
{const [c,x]=canvas(64,96);x.fillStyle='#1d2b44';x.fillRect(0,0,64,96);x.strokeStyle='#5a6f8f';x.lineWidth=1.5;for(let i=0;i<=64;i+=16){x.beginPath();x.moveTo(i,0);x.lineTo(i,96);x.stroke()}for(let j=0;j<=96;j+=16){x.beginPath();x.moveTo(0,j);x.lineTo(64,j);x.stroke()}
  x.strokeStyle='#c9ced6';x.lineWidth=3;x.strokeRect(1,1,62,94);
  const sm1=inst(new THREE.BoxGeometry(1.05,.06,1.75),new THREE.MeshStandardMaterial({map:tex(c),roughness:.3,metalness:.4,envMapIntensity:1.2}),solarList,(p,d)=>{d.position.set(p.x,p.y,p.z);d.rotation.set(-.26,0,0);d.scale.set(1,1,1)});sm1.userData.list=solarList;
  const legs=solarList.filter((p,i)=>i%2===0);const sm2=inst(new THREE.BoxGeometry(1.0,.5,.12),plainMat(0x9ea4a8,{metalness:.6,roughness:.5}),legs,(p,d)=>{d.position.set(p.x,p.y-.3,p.z+.75);d.rotation.set(0,0,0);d.scale.set(1,1,1)});sm2.userData.list=legs}
{const am=inst(new THREE.BoxGeometry(1,1,1),plainMat(0xdcdcd8,{roughness:.6}),acList,(p,d)=>{d.position.set(p.x,p.y+p.s*.4,p.z);d.rotation.set(0,0,0);d.scale.set(p.s*1.6,p.s*.8,p.s*1.1)});am.userData.list=acList}
{const pm=inst(new THREE.CylinderGeometry(.13,.13,1,8),plainMat(0x7a2f26,{roughness:.55,metalness:.2}),pipeList,(p,d)=>{d.position.set(p.x,p.h/2,p.z);d.rotation.set(0,0,0);d.scale.set(1,p.h,1)});pm.userData.list=pipeList}
