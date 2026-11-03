
try{await Promise.race([document.fonts.load('800 40px "Gothic A1"'),new Promise(r=>setTimeout(r,2500))])}catch(e){}
const $=s=>document.querySelector(s);
const stage=$('#stage');
const R=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
R.setPixelRatio(Math.min(devicePixelRatio,2));
R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=0.82;
R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
stage.appendChild(R.domElement);
const S=new THREE.Scene();
const pm=new THREE.PMREMGenerator(R);S.environment=pm.fromScene(new RoomEnvironment(),0.04).texture;
const cam=new THREE.PerspectiveCamera(38,1,1,3000);
const C=new OrbitControls(cam,R.domElement);
C.enableDamping=true;C.maxPolarAngle=Math.PI/2.12;C.minDistance=12;C.maxDistance=560;C.autoRotateSpeed=0.45;
function size(){const w=stage.clientWidth,h=stage.clientHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
new ResizeObserver(size).observe(stage);size();
function skyTex(top,mid,bot){const c=document.createElement('canvas');c.width=2;c.height=256;const g=c.getContext('2d');const gr=g.createLinearGradient(0,0,0,256);
  gr.addColorStop(0,top);gr.addColorStop(.6,mid);gr.addColorStop(1,bot);g.fillStyle=gr;g.fillRect(0,0,2,256);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const SKY_DAY=skyTex('#8fb3d6','#c9d9e7','#e2e8ec'),SKY_NIGHT=skyTex('#050a18','#14203a','#2a3448');
S.background=SKY_DAY;S.fog=new THREE.Fog(0xd3dde6,420,1300);
const hemi=new THREE.HemisphereLight(0xdde8f4,0x6f6655,0.55);S.add(hemi);
const sun=new THREE.DirectionalLight(0xfff0dc,3.2);sun.position.set(-130,220,150);sun.castShadow=true;
sun.shadow.mapSize.set(4096,4096);Object.assign(sun.shadow.camera,{left:-200,right:200,top:200,bottom:-200,near:50,far:650});sun.shadow.bias=-0.0004;sun.shadow.normalBias=0.4;sun.shadow.radius=3;
S.add(sun);S.add(sun.target);sun.target.position.set(-20,0,0);
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const rr=(a,b)=>a+rnd()*(b-a);
const sm=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
const tex=(c,rep)=>{const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;if(rep)t.repeat.set(rep[0],rep[1]);return t};
const dataTex=c=>{const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;return t};
const canvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')]};
function speckle(g,w,h,n,cols,a){for(let i=0;i<n;i++){g.globalAlpha=a*rnd();g.fillStyle=cols[(rnd()*cols.length)|0];g.fillRect(rnd()*w,rnd()*h,1+rnd()*2,1+rnd()*2)}g.globalAlpha=1}
const shade=(hex,k)=>{const c=new THREE.Color(hex);c.multiplyScalar(k);return '#'+c.getHexString()};
const col=new THREE.Color(),dummy=new THREE.Object3D();
// site plan in true metres (x east, z south along the campus grid, which runs 10.25° clockwise of true north), traced from a satellite photo
// ---------- terrain ----------
// natural ground from SRTM elevation samples (10 m grid over x,z = -200..200, 0.5 m steps from 40 m above sea level; 42.3 m = the main road),
// flattened under the buildings, sunk 1.5 m for the field (granite stands along its west side), a plateau for the gym and its car park,
// stone retaining walls along the north and west edges, and 만대동산, the wooded hill south-east of the field
const E_GRID='EFHJJJIHGEDDEEEDBBBA@?>>>>>>>=<;976544456|FGHIJJIGFEDDDDDDBBBA?>>>>>>>=;;:876543456|FGHJJJJHFEDDDDDDCBB@?>>>>>=<;::9765432445|HGHJJJJIFDDDDDDDDCA@@?>>>=;:::98643222344|HHIJJJJIFEDDDEFEDBA@@@>=<<;:::87531112244|HJJJJJJIHFEDDEFEDBA@?>=<<<;::986420001233|IJJJJJJJIGEDDEFFEDA?>=<<;::::975320001222|IJJJJJJJJHECDEFEDCA?>=<;;::::976431000121|HHIIIIJJIGDDDEECBBB@><:99:::::87542101220|FGGGHHHIGFDCDDCBBBA?<:76689:::98653112210|EFFFGGFFFEDCBCBBBA?=:7545689:::9764322221|DDEEEEDDDDBAAABA@?=:74334578::::876643222|DDDDDDCBBAA@@@@@>=;7532234579:::987654222|DDDDDDB@@@@@@@@?=;86532224569;;;;97665345|CDDDDCB@@@@@@@@?=:75432234568;<<;:9766678|CDDCBBB@@@@@@?>?=:86432234578;<<;:97689:;|CDDCBBB@@@@@@?>><:8642223468:;<<;98889:;<|CCCCBBBBA@??@>=<;9754322357:;<<<;:99:;<=>|BBBBBBBBA?>>>=;;:8644433469;<<<<;;;:;<=?A|BBBBBBBB@?>==<;98764444568:=>>>===<<<>?@B|BBBBBBBA@?=<<<;9876444458;>?@A@@@?>>?@AAB|BBBBBBBB@?=<;::987544446:=@BBBCBAAAABCCCC|BBBBBBBBB@><;::976544448;=ADDEEDBBCCCDEED|BBBBBBBBBA><<;::97544569;>BEFGHGFFFFEFFFF|BBCDCCCBBB?==<:::865568:<?BFHIIIIIHHHHGGG|BBDDDDDDCA@??=;::98878:<>@CGJKKJJJIIIIIHH|BBDDDDDDCB@@@@><;;;::;<=?ADHKLLLLLLKKJJJI|BCDDDDDDDCBAAA@?>>=>>???@BDGJKKMNONNMLKKK|BCDDDDDDDDCCCBBAAAAABCBBABEGIJKMPPONMLLLL|BCDDDDDDDDEFECCCCDDDEEEDCDEHIJMOPQPNLLLLL|DEEEDDDDDEFFEDDEFFFGGGGEDEGHJLNOQRQONMMML|DFFFEDDDEGGFFFFGHGGHHHHGGGGILMNPRRQONNNNM|EFFFEDEFGHHHGGGHHHHHHHIIIIIKMOQSSRPONNNNN|FGGFFFFGHHHHHHHHIJIIIJJJKLLMOQSTSQPOOONNN|HHHHHGHIIHHHHHHIJJJJJKLKLNOPPQSTSQPPPPONN|HHIIIIIJJJJIIIJJJJJJJLLMNOPQRRSTRQPPPPONN|IIJKJJKLKKKKKLLLKKKJKLMNOPPQRRSTRPPPPPNNN|JJJKLKLMMLLMNNNNMLLLMNOPQQPPQRRSRPPPPPNNN|JKKLLMNNNOOOOOPPNNNMNOPQRRRQRRRRRPONONMNO|KLLLMNOOOPQQPPRRPOOONNPQRRRRRRRRQPOMMLLMN|LLLLMOQQQRSSRQRRRPPPNNPRRRRRRRRRQPOMJIILM'.split('|'),E0=42.3;
const srtm=(x,z)=>{const fx=Math.min(39.999,Math.max(0,(x+200)/10)),fz=Math.min(39.999,Math.max(0,(z+200)/10)),i=fx|0,j=fz|0,a=fx-i,b=fz-j,e=(r,c)=>40+(E_GRID[r].charCodeAt(c)-48)/2;
  return (e(j,i)*(1-a)+e(j,i+1)*a)*(1-b)+(e(j+1,i)*(1-a)+e(j+1,i+1)*a)*b-E0};
const HILL=8,FIELD_Y=-1.5;
const box=(x,z,x0,z0,x1,z1,w)=>sm((x-x0)/w+.5)*sm((x1-x)/w+.5)*sm((z-z0)/w+.5)*sm((z1-z)/w+.5);
const lerp=(a,b,t)=>a+(b-a)*t;
const PADS=[]; // flat pads under small buildings that sit on sloping ground (filled in by the generator)
function GH(x,z){
  let h=srtm(x,z)-3*box(x,z,26,58,150,180,12);                                   // SE woods: take off the tree canopy SRTM sees
  const dWall=z<-93.3&&x<-12?-93.3-z:(x<-104.8&&z<29.5?-104.8-x:(x<-87.4&&z>=29.5&&z<104?-87.4-x:0));
  if(dWall>0)h=Math.min(h,2.6+.35*dWall);                                         // ground behind the retaining walls
  const core=Math.max(box(x,z,-104.8,-93.3,-12,40,1),box(x,z,-12,-92,12.5,40,10),box(x,z,-87.4,29.5,12.5,80,1),box(x,z,-87.4,77,12.5,103.4,1),box(x,z,12.5,-95,29.5,56,3));
  h=lerp(h,0,core);
  h=lerp(h,HILL*sm((z-55)/48),sm((x-11.5)/1.5)*(1-sm((x-24.5)/2))*sm((z-50)/8)*(1-sm((z-104)/2)));   // ramp up the main road
  h=lerp(h,HILL+2.5*sm((z-146)/12),sm((z-102.6)/1.2)*sm((x+66)/4)*(1-sm((x-24)/10)));                  // gym plateau
  const dOut=Math.max(0,Math.hypot(x-FIELD.x,Math.max(0,Math.abs(z-FIELD.z)-FIELD.half))-FIELD.r);
  h=lerp(h,FIELD_Y,(1-sm(dOut/2.5))*sm((x-29.2)/2.2));                            // the field, sunk below the road
  for(const p of PADS)h=lerp(h,p.h,box(x,z,p.x0,p.z0,p.x1,p.z1,3));
  h=lerp(h,7.5,box(x,z,33,106,51,149,3));                                         // red clay court terrace on the hill
  return h*(1-sm((Math.max(Math.abs(x),Math.abs(z))-175)/25))}
// ---------- field: sand track (stadium outline) round an artificial-turf pitch ----------
const FIELD={x:65.75,z:-19.25,r:41.5,half:41.5,turf:[38,-70,101,31]};
function inStadium(x,z,pad){const dx=x-FIELD.x,dz=z-FIELD.z,r=FIELD.r+pad;if(Math.abs(dz)<=FIELD.half)return Math.abs(dx)<r;const cz=dz>0?FIELD.half:-FIELD.half;return dx*dx+(dz-cz)**2<r*r}
