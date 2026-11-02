
// ---------- ground: a painted site plan (true metres; x east, z south) ----------
const GS=390,GW=(Math.min(innerWidth,innerHeight)<700?2048:4096),gs=GW/GS;const GX=x=>(x+GS/2)*gs,GZ=z=>(z+GS/2)*gs;
const [gc,g]=canvas(GW,GW);
const setNew=()=>g.setTransform(1,0,0,1,0,0),setOld=()=>g.setTransform(KX*gs,0,0,KZ*gs,(GS/2)*gs,(GS/2)*gs);
function rect(x0,z0,x1,z1,c){g.fillStyle=c;g.fillRect(GX(x0),GZ(z0),(x1-x0)*gs,(z1-z0)*gs)}
function poly(pts,c){g.fillStyle=c;g.beginPath();pts.forEach(([x,z],i)=>i?g.lineTo(GX(x),GZ(z)):g.moveTo(GX(x),GZ(z)));g.closePath();g.fill()}
function polyline(pts,w,c,dash){g.strokeStyle=c;g.lineWidth=w*gs;g.lineCap='round';g.lineJoin='round';g.setLineDash(dash?dash.map(d=>d*gs):[]);g.beginPath();pts.forEach(([x,z],i)=>i?g.lineTo(GX(x),GZ(z)):g.moveTo(GX(x),GZ(z)));g.stroke();g.setLineDash([])}
// old-unit helpers (drawn through a scaling transform)
function polyO(pts,c){setOld();g.fillStyle=c;g.beginPath();pts.forEach(([x,z],i)=>i?g.lineTo(x,z):g.moveTo(x,z));g.closePath();g.fill();setNew()}
function rectO(x0,z0,x1,z1,c){setOld();g.fillStyle=c;g.fillRect(x0,z0,x1-x0,z1-z0);setNew()}
function lineO(pts,w,c,dash){setOld();g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.setLineDash(dash||[]);g.beginPath();pts.forEach(([x,z],i)=>i?g.lineTo(x,z):g.moveTo(x,z));g.stroke();g.setLineDash([]);setNew()}
function stadiumO(r){g.beginPath();g.moveTo(FIELD.x-r,FIELD.z-FIELD.half);g.lineTo(FIELD.x-r,FIELD.z+FIELD.half);g.arc(FIELD.x,FIELD.z+FIELD.half,r,Math.PI,0,true);g.lineTo(FIELD.x+r,FIELD.z-FIELD.half);g.arc(FIELD.x,FIELD.z-FIELD.half,r,0,Math.PI,true);g.closePath()}
const GRASS='#7fa357',GRASS2='#6f9649',PAVE='#cfcabf';
rect(-GS/2,-GS/2,GS/2,GS/2,'#bdb8ac');speckle(g,GW,GW,90000,['#a9a49a','#cbc6bb','#b3ad9f'],.5);
polyO([[-100,-134],[106,-134],[106,140],[-62,140],[-82,90],[-102,40],[-114,-20],[-116,-110]],PAVE);
[[-108,-134,-14,-69],[24,22,104,134],[92,-134,104,22],[-108,-134,104,-125]].forEach(r=>rectO(...r,GRASS));
polyO([[-62,140],[-82,90],[-102,40],[-112,-20],[-106,-20],[-96,40],[-76,90],[-56,140]],GRASS2);rectO(43,72,61,118,'#8db866');
// field: red track + artificial turf
setOld();stadiumO(FIELD.r+1.5);g.fillStyle='#8a3c2f';g.fill();stadiumO(FIELD.r);g.fillStyle='#b4533f';g.fill();stadiumO(35);g.fillStyle='#3e7d36';g.fill();
for(let i=0;i<14;i++){g.fillStyle=i%2?'#3f8a3a':'#4a9744';g.fillRect(FIELD.x-33,FIELD.z-49+i*7,66,7)}
g.strokeStyle='#f4f4ef';g.lineWidth=.14;g.strokeRect(FIELD.x-33,FIELD.z-49,66,98);g.beginPath();g.moveTo(FIELD.x-33,FIELD.z);g.lineTo(FIELD.x+33,FIELD.z);g.stroke();
g.beginPath();g.arc(FIELD.x,FIELD.z,9,0,7);g.stroke();[-1,1].forEach(s=>{const zz=FIELD.z+s*49;g.strokeRect(FIELD.x-20,s<0?zz:zz-16,40,16);g.strokeRect(FIELD.x-9,s<0?zz:zz-5.5,18,5.5)});
for(let r=37;r<FIELD.r;r+=1.6){stadiumO(r);g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=.08;g.stroke()}setNew();
// roads (old units)
const westRoadO=[[-124,-175],[-122,-110],[-119,-40],[-107,25],[-75,75],[-45,175]];
lineO(westRoadO,11,'#c8c4ba');lineO(westRoadO,8,'#4d4f52');lineO(westRoadO,.15,'#e8d48a',[3,3]);
[[[-175,-140],[175,-140]],[[110,-175],[110,175]],[[-175,148],[175,148]]].forEach(r=>{lineO(r,11,'#c8c4ba');lineO(r,8,'#4d4f52');lineO(r,.15,'#e8e6dd',[3,3])});
lineO([[-6,-140],[-6,-118]],7,'#4d4f52');
// courtyard (between 중학교, 만대관, 덕린관 and 복지관)
rect(-84,-48,-42,6,GRASS);polyline([[-84,-48],[-42,6]],2.2,'#d8c9a2');polyline([[-42,-48],[-84,6]],2.2,'#d8c9a2');polyline([[-63,-48],[-63,6]],1.6,'#d8c9a2');
g.fillStyle='#d8c9a2';g.beginPath();g.arc(GX(-63),GZ(-21),4.5*gs,0,7);g.fill();
// plaza in front of 만대관 and the stands along the track
rect(-20,-131,0.4,6,'#cdcac2');for(let z=-131;z<6;z+=3)polyline([[-20,z],[.4,z]],.06,'#b8b4ab');for(let x=-20;x<.4;x+=3)polyline([[x,-131],[x,6]],.06,'#b8b4ab');
g.fillStyle='#3f7a4a';[[-124,-26.5],[-15.5,2]].forEach(([a,c])=>g.fillRect(GX(.4),GZ(a),1.9*gs,(c-a)*gs));
// road from the plaza round the east end of 덕린관 and up to the gym
const roadN=[[-9,4],[-2,8],[4,12.5],[10,19],[14,28],[17,40],[19.5,54],[20,66]];
polyline(roadN,11,'#c8c4ba');polyline(roadN,8.6,'#8e8f8f');
poly([[14,64],[26,64],[26,96],[14,96]],'#bdb3a1');for(let z=66;z<96;z+=3)polyline([[15,z],[25,z]],.1,'#a99f8c');
// gym plateau and the paved yard round 9동
rect(-46,89,15,138,PAVE);rect(-46,88.6,15,89.6,'#8f8a80');rect(-58,62,9,89,PAVE);rect(-60,40,-56,90,PAVE);
// garden south of 덕린관 (생명의 숲)
rect(-95,31.2,6,35,'#c1beb6');rect(-56,35,3,62,'#86a95c');rect(-56,35,-46,62,GRASS);
polyline([[-50,35],[-44,46],[-30,50],[-12,47],[0,52],[3,60]],1.6,'#d8c9a2');polyline([[-30,50],[-34,60]],1.4,'#d8c9a2');
g.fillStyle='#4d7d96';g.beginPath();g.ellipse(GX(-22),GZ(56),6*gs,3.8*gs,0,0,7);g.fill();g.strokeStyle='#8f8a80';g.lineWidth=.6*gs;g.stroke();
// gate, parking and guard house on the west road
rect(-124,-97,-108,-58,'#7d7f80');for(let z=-96.4;z<-58;z+=2.6){polyline([[-124,z],[-119.5,z]],.12,'#e9e9e2');polyline([[-112.5,z],[-108,z]],.12,'#e9e9e2')}polyline([[-116,-97],[-116,-58]],.12,'#e9e9e2',[2,2]);
polyline([[-128.5,-54],[-108,-54]],7,'#5f6163');
// 체육실동 yard
{const sp=BLD.find(b=>b.id==='sport');const[x0,z0,x1,z1]=wRect(sp,0,0,12.6,8.6);rect(x0,z0,x1,z1,'#86a95c');const[a0,c0,a1,c1]=wRect(sp,0,8.6,14.1,14);rect(Math.min(x0,a0),Math.min(z0,c0),Math.max(x1,a1),Math.max(z1,c1),'#c9c2b4');}
// contact shadow under every building
BLD.forEach(b=>{Object.values(b.plan).length&&b.floors[1].forEach(r=>{const[x0,z0,x1,z1]=wRect(b,r.u0,r.v0,r.u1,r.v1);rect(x0-.8,z0-.8,x1+.8,z1+.8,'#a9a497')})});
speckle(g,GW,GW,160000,['#000','#fff'],.06);
const groundTex=tex(gc);
const groundGeo=new THREE.PlaneGeometry(GS,GS,390,390);groundGeo.rotateX(-Math.PI/2);
{const p=groundGeo.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,GH(p.getX(i),p.getZ(i)));groundGeo.computeVertexNormals()}
const ground=new THREE.Mesh(groundGeo,new THREE.MeshStandardMaterial({map:groundTex,roughness:.95,metalness:0,envMapIntensity:.5}));
ground.receiveShadow=true;S.add(ground);
const far=new THREE.Mesh(new THREE.PlaneGeometry(4000,4000),new THREE.MeshStandardMaterial({color:0xb4ae9f,roughness:1}));far.rotation.x=-Math.PI/2;far.position.y=-.05;far.receiveShadow=true;S.add(far);
{const m=new THREE.Mesh(new THREE.BoxGeometry(61,HILL+.6,.8),new THREE.MeshStandardMaterial({color:0xa7a299,roughness:.9}));m.position.set(-15.5,(HILL+.6)/2-.3,88.8);m.castShadow=m.receiveShadow=true;S.add(m)}

// ---------- decor ----------
const decorStart=S.children.length;
const instAll=[];
function inst(geo,mat,list,set){const m=new THREE.InstancedMesh(geo,mat,Math.max(1,list.length));m.count=list.length;instAll.push(m);list.forEach((p,i)=>{set(p,dummy);dummy.updateMatrix();m.setMatrixAt(i,dummy.matrix)});m.castShadow=m.receiveShadow=true;S.add(m);return m}
const inRect=(x,z,bb,p)=>x>bb[0]-p&&x<bb[2]+p&&z>bb[1]-p&&z<bb[3]+p;
function nearBuilding(x,z,p){return BLD.some(b=>b.floors[1].concat(b.floors[2]||[]).some(r=>{const w=wRect(b,r.u0,r.v0,r.u1,r.v1);return inRect(x,z,w,p)}))}
// trees
const trees=[];seed=7;
function forest(x0,x1,z0,z1,n,avoid){for(let i=0;i<n;i++){const x=rr(x0,x1),z=rr(z0,z1);if(avoid&&avoid(x,z))continue;if(nearBuilding(x,z,3)||inStadium(x,z,3))continue;trees.push({x,z,s:rr(.85,1.35)})}}
forest(-118,-17,-146,-78,170,(x,z)=>x<-106&&z>-100);
forest(28,110,27,146,200,(x,z)=>(x>46&&x<66&&z>80&&z<131)||(x<27&&z<100)||(x<30&&z<70));
forest(99,112,-142,24,36);
forest(-55,1,37,61,22,(x,z)=>(x+22)**2/40+(z-56)**2/18<1.4||(x>-31&&x<-14&&z<48));
forest(-60,-48,92,138,12);forest(17,28,100,150,12);
forest(-130,-126,-40,60,8);
[[-27,40.5,0xb8432e],[-19,44,0xd2742a],[-23,47.5,0x5d8c36],[-17.5,38.5,0xc95a2a],[-29,46,0x6b9a3f]].forEach(([x,z,c])=>trees.push({x,z,s:.75,c}));
trees.push({x:-63,z:-21,s:1.5});[[-80,-44],[-46,-44],[-80,2],[-46,2]].forEach(([x,z])=>trees.push({x,z,s:.9}));
const trunkI=new THREE.InstancedMesh(new THREE.CylinderGeometry(.22,.32,1,6),new THREE.MeshStandardMaterial({color:0x5b4636,roughness:1}),trees.length);
const blobs=[];trees.forEach(t=>{const n=3+((rnd()*3)|0);for(let j=0;j<n;j++){const a=rnd()*6.28,r=rr(.6,1.6)*t.s;blobs.push({x:t.x+Math.cos(a)*r,z:t.z+Math.sin(a)*r,y:GH(t.x,t.z)+(3.4+rr(0,1.8))*t.s,s:rr(1.6,2.4)*t.s,c:t.c})}});
const crownGeo=new THREE.IcosahedronGeometry(1,2);
{const p=crownGeo.attributes.position;for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i);v.multiplyScalar(1+(Math.sin(v.x*7)+Math.cos(v.y*9)+Math.sin(v.z*8))*.05);p.setXYZ(i,v.x,v.y,v.z)}crownGeo.computeVertexNormals()}
const crownI=new THREE.InstancedMesh(crownGeo,new THREE.MeshStandardMaterial({roughness:.95,envMapIntensity:.4}),blobs.length);
const greens=[0x4f7d2f,0x5d8c36,0x3f6d2a,0x6b9a3f,0x557f31];
trees.forEach((t,i)=>{const gy=GH(t.x,t.z);dummy.position.set(t.x,gy+1.7*t.s,t.z);dummy.rotation.set(0,0,0);dummy.scale.set(t.s,3.4*t.s,t.s);dummy.updateMatrix();trunkI.setMatrixAt(i,dummy.matrix)});
blobs.forEach((b,i)=>{dummy.position.set(b.x,b.y,b.z);dummy.rotation.set(rnd(),rnd(),rnd());dummy.scale.set(b.s,b.s*.9,b.s);dummy.updateMatrix();crownI.setMatrixAt(i,dummy.matrix);crownI.setColorAt(i,col.set(b.c||greens[(rnd()*greens.length)|0]).multiplyScalar(rr(.85,1.1)))});
[trunkI,crownI].forEach(m=>{m.castShadow=true;m.receiveShadow=true;instAll.push(m);S.add(m)});
// cloud-pruned pines and rocks
const pines=[];seed=61;for(let x=-50;x<=-4;x+=3.4)pines.push({x,z:36.4,s:rr(.85,1.1)});
[[-80,-44],[-46,-44],[-80,2],[-46,2]].forEach(([x,z])=>pines.push({x:x+2.5,z:z+2.5,s:1}));
for(let z=-52;z<=-2;z+=5.5)if(Math.abs(z+21)>6&&Math.abs(z+40)>5)pines.push({x:-11.6,z,s:rr(.8,1)});
pines.push({x:-7,z:-3,s:1.75});[[-9,-6],[-9,0],[-4.6,-36.5],[-4.4,-40],[-4.8,-43.5]].forEach(([x,z])=>pines.push({x,z,s:.85}));
const pads=[];pines.forEach(p=>{const n=4+((rnd()*3)|0);p.n=n;for(let j=0;j<n;j++){const a=j*2.3+rnd(),r=(j===n-1?0:.75*(1-j/n))*p.s;pads.push({x:p.x+Math.cos(a)*r,z:p.z+Math.sin(a)*r,y:GH(p.x,p.z)+(1.1+j*.8)*p.s,s:(1.05-j*.13)*p.s})}});
inst(new THREE.CylinderGeometry(.09,.15,1,6),new THREE.MeshStandardMaterial({color:0x5b4636,roughness:1}),pines,(p,d)=>{const h=(1.1+(p.n-1)*.8)*p.s;d.position.set(p.x,GH(p.x,p.z)+h/2,p.z);d.rotation.set(0,0,0);d.scale.set(p.s,h,p.s)});
{const pm3=inst(new THREE.SphereGeometry(1,14,8),new THREE.MeshStandardMaterial({roughness:.9}),pads,(p,d)=>{d.position.set(p.x,p.y,p.z);d.rotation.set(0,rnd()*3,0);d.scale.set(p.s*1.15,p.s*.48,p.s*1.15)});pads.forEach((p,i)=>pm3.setColorAt(i,col.set(0x2d5a2a).multiplyScalar(rr(.85,1.15))))}
const rocks=[];seed=71;for(let x=-31;x<=-15;x+=rr(.9,1.6))rocks.push({x,z:37.6+rr(-.3,.3),s:rr(.45,.9)});for(let i=0;i<14;i++)rocks.push({x:rr(-30,-16),z:rr(39,47),s:rr(.4,1.1)});
inst(new THREE.DodecahedronGeometry(1,0),new THREE.MeshStandardMaterial({color:0xa9a59c,roughness:.95,flatShading:true}),rocks,(p,d)=>{d.position.set(p.x,p.s*.3,p.z);d.rotation.set(rnd(),rnd()*3,rnd());d.scale.set(p.s*1.2,p.s*.7,p.s)});
// text planes
function textTex(lines,W,H,bg,fg,size,weight){const [c,x]=canvas(W,H);if(bg){x.fillStyle=bg;x.fillRect(0,0,W,H)}x.fillStyle=fg;x.textAlign='center';x.textBaseline='middle';
  lines.forEach(l=>{x.font=(l.w||weight||800)+' '+(l.s||size)+'px "Gothic A1",sans-serif';x.fillStyle=l.c||fg;x.fillText(l.t,W/2,l.y*H)});return tex(c)}
function plane(t,w,h,x,y,z,ry,glow){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:t,transparent:true,roughness:.7,emissiveMap:glow?t:null,emissive:glow?0xffffff:0x000000,emissiveIntensity:0}));
  m.position.set(x,y,z);m.rotation.y=ry;S.add(m);if(glow)nightMats.push(m.material);return m}
// plaza: 구령대, flags, motto stone island and oval bed
{const stone=plainMat(0xbdb6a8,{roughness:.9}),lawn=plainMat(0x5f9a45,{roughness:.95});
 const pl=new THREE.Mesh(new THREE.CylinderGeometry(4.6,4.7,.5,40),[stone,lawn,stone]);pl.position.set(-7,.25,-3);pl.receiveShadow=true;pl.castShadow=true;S.add(pl);
 const fl=[];for(let i=0;i<64;i++){const a=i/64*Math.PI*2;fl.push({x:-7+Math.cos(a)*4.1,z:-3+Math.sin(a)*4.1,c:i%8<4?0xd8423a:0xf3f0ea})}
 const fm=inst(new THREE.SphereGeometry(.32,8,6),plainMat(0xffffff,{roughness:.8}),fl,(p,d)=>{d.position.set(p.x,.62,p.z);d.rotation.set(0,0,0);d.scale.set(1,.8,1)});fl.forEach((p,i)=>fm.setColorAt(i,col.set(p.c)));
 const ov=new THREE.Mesh(new THREE.CylinderGeometry(1,1,.5,32),[stone,lawn,stone]);ov.scale.set(3.4,1,6.2);ov.position.set(-4.6,.25,-40);ov.receiveShadow=true;S.add(ov);
 const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(1,1),new THREE.MeshStandardMaterial({color:0xb7b3aa,roughness:.85,flatShading:true}));rock.scale.set(.55,1.1,1.6);rock.position.set(-4.4,1.5,-3);rock.castShadow=true;S.add(rock);
 plane(textTex([{t:'더불어 사는 사람',y:.5}],512,96,null,'#3b3a36',64),2.6,.5,-3.78,1.75,-3,Math.PI/2);
 const base2=new THREE.Mesh(new THREE.BoxGeometry(.9,.5,2.2),plainMat(0x6f6b63,{roughness:.6}));base2.position.set(-4.1,.75,-3);S.add(base2);
 const [fc,fx]=canvas(192,128);fx.fillStyle='#fff';fx.fillRect(0,0,192,128);fx.save();fx.translate(96,64);fx.rotate(-.59);fx.fillStyle='#cd2e3a';fx.beginPath();fx.arc(0,0,32,Math.PI,0);fx.fill();fx.fillStyle='#0047a0';fx.beginPath();fx.arc(0,0,32,0,Math.PI);fx.fill();
 fx.fillStyle='#cd2e3a';fx.beginPath();fx.arc(-16,0,16,0,Math.PI*2);fx.fill();fx.fillStyle='#0047a0';fx.beginPath();fx.arc(16,0,16,0,Math.PI*2);fx.fill();fx.restore();
 fx.fillStyle='#111';[[34,24,-.98],[158,24,.98],[34,104,.98],[158,104,-.98]].forEach(([x,y,r])=>{fx.save();fx.translate(x,y);fx.rotate(r);for(let k=-1;k<=1;k++)fx.fillRect(-14,k*7-2,28,4.5);fx.restore()});
 const flagT=tex(fc),[sc,sx]=canvas(64,48);sx.fillStyle='#f6f6f2';sx.fillRect(0,0,64,48);sx.fillStyle='#2f7d4f';sx.beginPath();sx.arc(32,24,12,0,7);sx.fill();const schT=tex(sc);
 [[-1.4,-13,flagT],[-1.4,-11,schT],[-1.4,-9,schT]].forEach(([x,z,t],i)=>{const h=i?9:10.5;const pole=new THREE.Mesh(new THREE.CylinderGeometry(.06,.08,h,8),plainMat(0xd9dcdf,{metalness:.7,roughness:.3}));pole.position.set(x,h/2,z);pole.castShadow=true;S.add(pole);
   const f=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.2),new THREE.MeshStandardMaterial({map:t,side:THREE.DoubleSide,roughness:.8}));f.position.set(x,h-.7,z-.95);f.rotation.y=Math.PI/2;f.castShadow=true;S.add(f)});
 const st=new THREE.Group(),wood=plainMat(0x8a5a3a,{roughness:.7}),wh=plainMat(0xefebe2,{roughness:.7}),rf=new THREE.MeshStandardMaterial({color:0x4d6f93,roughness:.55,metalness:.2,side:THREE.DoubleSide});
 const deck=new THREE.Mesh(new THREE.BoxGeometry(6,1.3,10),plainMat(0xb9b4aa,{roughness:.85}));deck.position.y=.65;st.add(deck);
 for(let k=0;k<3;k++){const stp=new THREE.Mesh(new THREE.BoxGeometry(.6,1.3-(k+1)*.33,5),plainMat(0xc9c4ba,{roughness:.85}));stp.position.set(3.3+k*.6,(1.3-(k+1)*.33)/2,0);st.add(stp)}
 [[-2.4,-4.4],[2.4,-4.4],[-2.4,4.4],[2.4,4.4]].forEach(([a,b2])=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.4,3.2,.4),wh);p.position.set(a,1.3+1.6,b2);st.add(p)});
 const tri=new THREE.Shape();tri.moveTo(-3.6,0);tri.lineTo(3.6,0);tri.lineTo(0,1.9);tri.closePath();
 const roof=new THREE.Mesh(new THREE.ExtrudeGeometry(tri,{depth:11,bevelEnabled:false}),rf);roof.position.set(0,4.5,-5.5);st.add(roof);
 [-5.5,5.5].forEach(z=>{const tr=new THREE.Mesh(new THREE.ShapeGeometry(tri),wood);tr.position.set(0,4.5,z+(z<0?-.02:.02));st.add(tr)});
 const beam=new THREE.Mesh(new THREE.BoxGeometry(5.2,.35,9.2),wood);beam.position.y=4.4;st.add(beam);
 const sign=plane(textTex([{t:'광덕고등학교',y:.5}],512,96,'#2f6b4a','#ffffff',58),3.6,.6,0,0,0,Math.PI/2);S.remove(sign);sign.position.set(2.62,4.4,0);st.add(sign);
 st.position.set(-2.6,0,-21);st.traverse(o=>{o.castShadow=true;o.receiveShadow=true});S.add(st)}
// neighbourhood houses (traced in the old units, then placed at true scale)
const houses=[];seed=21;
function addHouses(x0,x1,z0,z1,n,avoid){for(let i=0;i<n;i++){const ox=rr(x0,x1),oz=rr(z0,z1);if(avoid&&avoid(ox,oz))continue;const [x,z]=ko(ox,oz);
  const w=rr(7,13),d=rr(7,12);if(houses.some(h=>Math.abs(h.x-x)<(h.w+w)/2+1.5&&Math.abs(h.z-z)<(h.d+d)/2+1.5))continue;if(nearBuilding(x,z,8)||(x>-130&&x<-104&&z>-100&&z<-36))continue;
  houses.push({x,z,w,d,h:rr(5,11),ry:rr(-.08,.08),pitch:rnd()<.45,wall:['#e9e4d8','#d8cfc0','#c7b49d','#a8735c','#e3dfd6'][(rnd()*5)|0],roof:['#2f9c84','#3aa58a','#4bb39a','#7d8a92','#a04f3b','#3f8f78','#6c6f73'][(rnd()*7)|0]})}}
addHouses(-170,-121,-170,170,240,(x,z)=>x>-141+(z+110)*0.12&&z>-110||x>-137&&z<=-110||Math.abs(z+140)<8);
addHouses(-170,-60,95,170,90,(x,z)=>x>-93+(z-75)*0.4||Math.abs(z-148)<8);
addHouses(117,170,-170,170,170,(x,z)=>Math.abs(z+140)<8||Math.abs(z-148)<8);
addHouses(-120,170,-170,-147,90,(x,z)=>Math.abs(x-110)<8);
addHouses(-40,170,155,170,40,(x,z)=>Math.abs(x-110)<8);
{const [c,x]=canvas(64,64);x.fillStyle='#fff';x.fillRect(0,0,64,64);x.fillStyle='#55697c';[[8,10],[36,10],[8,38],[36,38]].forEach(([a,b])=>x.fillRect(a,b,18,14));x.fillStyle='#c9c4ba';x.fillRect(0,30,64,3);
  const wt=tex(c);const wallI=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({map:wt,roughness:.9}),houses.length);
  const roofs=houses.filter(h=>h.pitch),flats=houses.filter(h=>!h.pitch);
  const prism=new THREE.CylinderGeometry(1,1,1,3,1);prism.rotateZ(Math.PI/2);prism.rotateX(Math.PI/6);prism.scale(1,.5,1);
  const roofI=new THREE.InstancedMesh(prism,plainMat(0xffffff,{roughness:.7}),roofs.length),capI=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),plainMat(0xffffff,{roughness:.85}),flats.length);
  houses.forEach((h,i)=>{dummy.position.set(h.x,h.h/2,h.z);dummy.rotation.set(0,h.ry,0);dummy.scale.set(h.w,h.h,h.d);dummy.updateMatrix();wallI.setMatrixAt(i,dummy.matrix);wallI.setColorAt(i,col.set(h.wall))});
  roofs.forEach((h,i)=>{dummy.position.set(h.x,h.h+1.4,h.z);dummy.rotation.set(0,h.ry,0);dummy.scale.set(h.w+.6,2.8,(h.d+.6)/1.73);dummy.updateMatrix();roofI.setMatrixAt(i,dummy.matrix);roofI.setColorAt(i,col.set(h.roof))});
  flats.forEach((h,i)=>{dummy.position.set(h.x,h.h+.2,h.z);dummy.rotation.set(0,h.ry,0);dummy.scale.set(h.w+.3,.4,h.d+.3);dummy.updateMatrix();capI.setMatrixAt(i,dummy.matrix);capI.setColorAt(i,col.set(h.roof))});
  wallI.userData.squash=1;[wallI,roofI,capI].forEach(m=>{m.castShadow=m.receiveShadow=true;instAll.push(m);S.add(m)})}
// distant apartment towers
{const [c,x]=canvas(128,512);x.fillStyle='#eeece6';x.fillRect(0,0,128,512);
 for(let f=0;f<32;f++){const y=f*16;x.fillStyle='#d6d3cb';x.fillRect(0,y+12,128,4);for(let k=0;k<4;k++){x.fillStyle=rnd()<.15?'#c9d3dc':'#7f93a6';x.fillRect(6+k*31,y+3,22,8)}}
 x.fillStyle='#d9534a';x.fillRect(0,0,128,10);const at=tex(c);const apts=[];seed=91;
 [[-60,-350],[30,-340],[120,-320],[-180,-320],[-320,-225],[-350,-85],[-340,75],[-300,225],[320,-245],[350,-75],[330,115],[280,280],[160,350],[-130,340],[10,365],[-245,320],[245,-350]].forEach(([x0,z0])=>{for(let k=0;k<3;k++)apts.push({x:x0+rr(-45,45),z:z0+rr(-30,30),h:rr(55,95),w:rr(16,22),d:rr(11,14),ry:rr(-.25,.25)})});
 const am=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({map:at,roughness:.8}),apts.length);
 apts.forEach((a,i)=>{dummy.position.set(a.x,a.h/2,a.z);dummy.rotation.set(0,a.ry,0);dummy.scale.set(a.w,a.h,a.d);dummy.updateMatrix();am.setMatrixAt(i,dummy.matrix)});am.userData.squash=1;instAll.push(am);S.add(am)}
// main gate pillars and barrier (the guard house itself comes from its drawing)
{const gw=plainMat(0xece8df,{roughness:.8}),gb=plainMat(0x74402f,{roughness:.9});
 [-57.4,-50.6].forEach(z=>{const p=new THREE.Mesh(new THREE.BoxGeometry(1.1,2.6,1.1),gb);p.position.set(-125.6,1.3,z);p.castShadow=true;S.add(p);const cap=new THREE.Mesh(new THREE.BoxGeometry(1.3,.18,1.3),gw);cap.position.set(-125.6,2.69,z);S.add(cap)});
 plane(textTex([{t:'광덕중·고등학교',y:.5}],512,96,'#f2efe6','#2b3a33',54),2.6,.5,-126.17,1.8,-57.4,-Math.PI/2);
 const [bc,bx2]=canvas(128,8);for(let i=0;i<8;i++){bx2.fillStyle=i%2?'#ffffff':'#d8423a';bx2.fillRect(i*16,0,16,8)}
 const post=new THREE.Mesh(new THREE.BoxGeometry(.4,1.1,.4),plainMat(0xe0b23a,{roughness:.6}));post.position.set(-117,.55,-57.2);S.add(post);
 const arm=new THREE.Mesh(new THREE.BoxGeometry(.12,.12,6.4),new THREE.MeshStandardMaterial({map:tex(bc),roughness:.5}));arm.position.set(-117,1,-54);S.add(arm)}
// field goals and stands
const white=plainMat(0xf4f4ef,{roughness:.5});
[-1,1].forEach(s=>{const [gx,gz]=ko(FIELD.x,FIELD.z+s*49);const gp=new THREE.Group();
  [-3.66,3.66].forEach(x=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,2.44,8),white);p.position.set(x,1.22,0);gp.add(p)});
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,7.32,8),white);bar.rotation.z=Math.PI/2;bar.position.y=2.44;gp.add(bar);
  const net=new THREE.Mesh(new THREE.PlaneGeometry(7.32,2.44),new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.25,side:THREE.DoubleSide}));net.position.set(0,1.22,s*1.2);net.rotation.x=s*.4;gp.add(net);
  gp.position.set(gx,0,gz);gp.traverse(o=>o.castShadow=true);S.add(gp)});
{const gm=plainMat(0x3f7a4a,{roughness:.8});for(let k=0;k<3;k++){const w=1.9-k*.6;[[-124,-26.5],[-15.5,2]].forEach(([z0,z1])=>{const s2=new THREE.Mesh(new THREE.BoxGeometry(w,.32+k*.32,z1-z0),gm);s2.position.set(.4+w/2,(.32+k*.32)/2,(z0+z1)/2);s2.castShadow=s2.receiveShadow=true;S.add(s2)})}}
// cars and street lamps
const cars=[];seed=31;
for(let z=-110;z<-2;z+=6.5)if(rnd()<.45&&Math.abs(z+21)>8&&Math.abs(z+40)>8)cars.push({x:-17.5,z,ry:0});
for(let i=0;i<14;i++){const t=rnd();const a=westRoadO[Math.min(4,(t*5)|0)],b=westRoadO[Math.min(5,((t*5)|0)+1)];const f=(t*5)%1;const [x,z]=ko(a[0]+(b[0]-a[0])*f+(rnd()<.5?-2:2),a[1]+(b[1]-a[1])*f);cars.push({x,z,ry:Math.atan2(b[0]-a[0],b[1]-a[1])})}
for(let i=0;i<10;i++)cars.push({x:110*KX+(rnd()<.5?-2:2),z:rr(-170,170),ry:0});
for(let z=-95.1;z<-59;z+=2.6){if(rnd()<.6)cars.push({x:-121.8,z,ry:Math.PI/2});if(rnd()<.6)cars.push({x:-110.2,z,ry:Math.PI/2})}
{const bodyI=new THREE.InstancedMesh(new THREE.BoxGeometry(1.8,.8,4.3),new THREE.MeshStandardMaterial({roughness:.35,metalness:.5,envMapIntensity:1}),cars.length);
  const cabI=new THREE.InstancedMesh(new THREE.BoxGeometry(1.6,.6,2.3),new THREE.MeshStandardMaterial({color:0x26303a,roughness:.2,metalness:.6}),cars.length);
  const cc=[0xf1f1f1,0x1f2226,0x8e959c,0xc8ccd0,0x2c4a7a,0x8a2a24,0xf1f1f1];
  cars.forEach((c,i)=>{dummy.position.set(c.x,.75,c.z);dummy.rotation.set(0,c.ry,0);dummy.scale.set(1,1,1);dummy.updateMatrix();bodyI.setMatrixAt(i,dummy.matrix);bodyI.setColorAt(i,col.set(cc[(rnd()*cc.length)|0]));
    dummy.position.y=1.45;dummy.translateZ(-.2);dummy.updateMatrix();cabI.setMatrixAt(i,dummy.matrix)});
  [bodyI,cabI].forEach(m=>{m.castShadow=true;instAll.push(m);S.add(m)})}
const lamps=[];for(let z=-110;z<=0;z+=20)if(Math.abs(z+21)>6)lamps.push({x:-.4,z});
[[-40,37],[-20,35.8],[2,35.8],[22,72],[22,86],[-30,92],[0,92],[-95,-50],[-98,0],[-88,40],[12,16],[16,32],[-63,-30],[-63,-12]].forEach(([x,z])=>lamps.push({x,z}));
inst(new THREE.CylinderGeometry(.08,.1,6,6),plainMat(0x50555a,{metalness:.6,roughness:.4}),lamps,(p,d)=>{d.position.set(p.x,GH(p.x,p.z)+3,p.z);d.rotation.set(0,0,0);d.scale.set(1,1,1)});
const bulbMat=new THREE.MeshStandardMaterial({color:0xeeeeee,emissive:0xffd59a,emissiveIntensity:0});nightMats.push(bulbMat);
inst(new THREE.SphereGeometry(.32,10,8),bulbMat,lamps,(p,d)=>{d.position.set(p.x,GH(p.x,p.z)+6.1,p.z);d.rotation.set(0,0,0);d.scale.set(1,1,1)});
const decorEnd=S.children.length;
// ---------- things fixed to buildings (signs, banners, clock, canopies, solar panels, AC units, downpipes) ----------
const onB=[];const att=(o,b)=>{o.userData.onB=b;onB.push(o);return o};
{const d=BLD.find(b=>b.id==='deokrin'),m=BLD.find(b=>b.id==='mandae');const ex=d.X0+.06;
 att(plane(textTex([{t:'덕린관',y:.5}],512,160,null,'#f3e4bf',118),4.2,1.3,ex,4*3.6-1.5,29,Math.PI/2,true),d);
 att(plane(textTex([{t:'꿈을 키우는',y:.17,s:64},{t:'광덕',y:.31,s:120},{t:'함께 배우고',y:.52,s:52,w:600,c:'#26324a'},{t:'모두가 성장하는',y:.62,s:52,w:600,c:'#26324a'},{t:'행복한 광덕인',y:.72,s:52,w:600,c:'#26324a'},{t:'광덕고등학교',y:.92,s:44,c:'#ffffff'}],256,720,'#f2c230','#1d4f9c',64),3.4,9.4,ex,7.6,27.2,Math.PI/2),d);
 att(plane(textTex([{t:'더불어',y:.3,s:70},{t:'사는',y:.42,s:70},{t:'사람',y:.54,s:70},{t:'光德',y:.8,s:60,c:'#2f7d4f'}],256,640,'#f7f5ef','#203a6b',70),2.8,7.2,ex,7.2,23.4,Math.PI/2),d);
 const[mx,mz]=toW(m,21,22.5);att(plane(textTex([{t:'만대관',y:.5}],512,160,null,'#f3e4bf',118),3.2,.75,mx+.08,4*3.6-.75,mz,Math.PI/2,true),m);
 const[cx,cz]=toW(m,38,22.5);const ck=new THREE.Mesh(new THREE.CircleGeometry(.62,32),plainMat(0xf7f5ef,{roughness:.4}));ck.rotation.y=Math.PI/2;ck.position.set(cx+.07,4*3.6-.8,cz);S.add(ck);att(ck,m);
 const rim=new THREE.Mesh(new THREE.RingGeometry(.58,.66,32),plainMat(0x2f3a40));rim.rotation.y=Math.PI/2;rim.position.set(cx+.08,4*3.6-.8,cz);S.add(rim);att(rim,m);
 const cm=plainMat(0xe9e6df,{roughness:.6});const cn=new THREE.Mesh(new THREE.BoxGeometry(7,.3,3.2),cm);cn.position.set(-7.5,3.2,16.9);cn.castShadow=true;S.add(cn);att(cn,d);
 [-3.2,3.2].forEach(dx=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,3.2,8),cm);p.position.set(-7.5+dx,1.6,15.6);S.add(p);att(p,d)});
 const bk=BLD.find(b=>b.id==='bokji');const[q0,w0,q1,w1]=wRect(bk,2,14.8,45.2,15.9);const can=new THREE.Mesh(new THREE.BoxGeometry(q1-q0,.25,w1-w0),cm);can.position.set((q0+q1)/2,3.2,(w0+w1)/2);can.castShadow=true;S.add(can);att(can,bk)}
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
