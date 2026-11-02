
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
// the earlier site sketch was traced from the satellite at a slightly smaller scale; the drawings fix the true scale
const KX=1.078,KZ=1.109,ko=(x,z)=>[x*KX,z*KZ];
// ---------- terrain: the gym stands on a ~4 m plateau, reached by a ramp east of 9동 ----------
const HILL=4;
const plateau=(x,z)=>sm((z-88.6)/1.4)*(1-sm((z-141)/8))*sm((x+46)/5)*(1-sm((x-15)/2));
const rampF=(x,z)=>sm((z-66)/28)*(1-sm((z-141)/8))*sm((x-13)/1.5)*(1-sm((x-27)/2));
const GH=(x,z)=>HILL*Math.max(plateau(x,z),rampF(x,z));
// ---------- field (traced earlier in the old units) ----------
const FIELD={x:47,z:-42,r:43.5,half:29};
function inStadiumOld(x,z,pad){const dx=x-FIELD.x,dz=z-FIELD.z,r=FIELD.r+pad;if(Math.abs(dz)<=FIELD.half)return Math.abs(dx)<r;const cz=dz>0?FIELD.half:-FIELD.half;return dx*dx+(dz-cz)**2<r*r}
const inStadium=(x,z,pad)=>inStadiumOld(x/KX,z/KZ,pad);
