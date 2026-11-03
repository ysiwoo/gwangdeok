
// ---------- facade textures and materials ----------
const TILE=96,BAYS=8,FLOORS=5,FHT=3.6;
const nightMats=[];
function facadeTex(wall,seedv,style){
  seed=seedv;const W=TILE*BAYS,H=TILE*FLOORS;
  const [c,x]=canvas(W,H),[e,ex]=canvas(W,H),[bm,bx]=canvas(W,H);
  x.fillStyle='#bfae9c';x.fillRect(0,0,W,H);bx.fillStyle='#9a9a9a';bx.fillRect(0,0,W,H);
  for(let r=0;r*4<H;r++){const off=(r%2)*6;for(let k=-1;k*12<W;k++){x.fillStyle=shade(wall,rr(.84,1.1));x.fillRect(k*12+off+.6,r*4+.6,10.8,2.8);bx.fillStyle='#b8b8b8';bx.fillRect(k*12+off+.6,r*4+.6,10.8,2.8)}}
  ex.fillStyle='#000';ex.fillRect(0,0,W,H);
  if(style!=='blank')for(let f=0;f<FLOORS;f++){const y0=H-(f+1)*TILE;
    for(let b=0;b<BAYS;b++){const wx=b*TILE+13,ww=70,wy=y0+20,wh=52;
      x.fillStyle='#ebe5d6';x.fillRect(wx-5,wy-10,ww+10,8);x.fillStyle='#e9e4d5';x.fillRect(wx-3,wy+wh,ww+6,4);
      x.fillStyle=shade(wall,.45);x.fillRect(wx-1,wy-2,ww+2,wh+2);x.fillStyle='#ece6d4';x.fillRect(wx,wy,ww,wh);
      const gr=x.createLinearGradient(0,wy,0,wy+wh);gr.addColorStop(0,'#55626c');gr.addColorStop(1,'#8b9aa5');
      for(let q=0;q<4;q++){const px=wx+2+q*16.5;x.fillStyle=gr;x.fillRect(px+1.5,wy+2,13.5,wh-4);if(rnd()<.55){x.fillStyle=rnd()<.7?'#f1efe8':'#d9dde0';x.fillRect(px+1.5,wy+wh*.3,13.5,(wh*.7-3)*rr(.5,1))}}
      x.fillStyle='#ece6d4';x.fillRect(wx,wy+wh*.3-1.5,ww,3);x.globalAlpha=.12;x.fillStyle='#fff';x.fillRect(wx+4,wy+3,12,wh-6);x.globalAlpha=1;
      bx.fillStyle='#2a2a2a';bx.fillRect(wx,wy,ww,wh);bx.fillStyle='#e6e6e6';bx.fillRect(wx-5,wy-10,ww+10,8);bx.fillRect(wx-3,wy+wh,ww+6,4);
      if(rnd()<.42){ex.fillStyle=rnd()<.8?'#ffd8a0':'#dfeaff';ex.globalAlpha=rr(.6,1);ex.fillRect(wx+2,wy+2,ww-4,wh-4);ex.globalAlpha=1}}}
  return {map:tex(c),em:tex(e),bump:dataTex(bm)}}
function ribbonTex(wall){seed=909;const W=TILE*BAYS;const [c,x]=canvas(W,TILE),[e,ex]=canvas(W,TILE);
  x.fillStyle='#bfae9c';x.fillRect(0,0,W,TILE);for(let r=0;r*4<TILE;r++){const off=(r%2)*6;for(let k=-1;k*12<W;k++){x.fillStyle=shade(wall,rr(.84,1.1));x.fillRect(k*12+off+.6,r*4+.6,10.8,2.8)}}
  ex.fillStyle='#000';ex.fillRect(0,0,W,TILE);x.fillStyle='#ece7da';x.fillRect(0,14,W,9);x.fillRect(0,70,W,7);
  const gr=x.createLinearGradient(0,23,0,70);gr.addColorStop(0,'#3f4c57');gr.addColorStop(1,'#7c8d9a');x.fillStyle=gr;x.fillRect(0,23,W,47);
  for(let i=0;i<W;i+=24){x.fillStyle='#e4dfd2';x.fillRect(i,23,3,47);if(rnd()<.5){x.fillStyle='#eeece6';x.fillRect(i+3,38,21,32*rr(.4,1))}if(rnd()<.45){ex.fillStyle='#ffdcaa';ex.fillRect(i+3,23,21,47)}}
  x.fillStyle='#e4dfd2';x.fillRect(0,36,W,2);return {map:tex(c),em:tex(e)}}
// gym (photo 0741): dark brick with a ribbon of clerestory windows just under the overhanging fascia band
function gymTex(wall){seed=313;const W=192,H=460;const [c,x]=canvas(W,H),[e,ex]=canvas(W,H);const yy=m=>H-m*40;
  x.fillStyle='#8f7f72';x.fillRect(0,0,W,H);for(let r=0;r*5<H;r++){const off=(r%2)*8;for(let k=-1;k*16<W;k++){x.fillStyle=shade(wall,rr(.82,1.12));x.fillRect(k*16+off+.8,r*5+.8,14.4,3.6)}}
  x.fillStyle='#9d968c';x.fillRect(0,yy(.9),W,.9*40);x.fillStyle='#b9b2a6';x.fillRect(0,yy(.95),W,4);
  ex.fillStyle='#000';ex.fillRect(0,0,W,H);
  const gr=x.createLinearGradient(0,yy(9.3),0,yy(7.7));gr.addColorStop(0,'#2b3742');gr.addColorStop(1,'#62788a');x.fillStyle=gr;x.fillRect(0,yy(9.3),W,1.6*40);
  for(let i=0;i<W;i+=24){x.fillStyle='#dfe2e2';x.fillRect(i,yy(9.3),3,1.6*40)}x.fillStyle='#dfe2e2';x.fillRect(0,yy(9.3),W,3);x.fillRect(0,yy(7.7)-3,W,3);
  ex.fillStyle='#ffe6b8';ex.fillRect(0,yy(9.3),W,1.6*40);
  return {map:tex(c),em:tex(e)}}
// two-storey dining hall (이산관 north side, photos 0952/0955): one tall black-framed window per 5 m bay, 3 panes across, 4 high
function bigTex(wall){seed=717;const W=TILE*BAYS,H=138,k=W/40;const [c,x]=canvas(W,H),[e,ex]=canvas(W,H);const Y=m=>H*(1-m/7.2);
  x.fillStyle='#bfae9c';x.fillRect(0,0,W,H);for(let r=0;r*4<H;r++){const off=(r%2)*6;for(let q=-1;q*12<W;q++){x.fillStyle=shade(wall,rr(.84,1.1));x.fillRect(q*12+off+.6,r*4+.6,10.8,2.8)}}
  ex.fillStyle='#000';ex.fillRect(0,0,W,H);
  for(let b=0;b<8;b++){const x0=b*5*k+.75*k,w=3.5*k,y0=Y(6.3),h=Y(.9)-Y(6.3);
    x.fillStyle='#e9e4d5';x.fillRect(x0-3,Y(.9),w+6,3);x.fillStyle='#1f2326';x.fillRect(x0,y0,w,h);
    const gr=x.createLinearGradient(0,y0,0,y0+h);gr.addColorStop(0,'#6f8fa8');gr.addColorStop(.6,'#9db8c6');gr.addColorStop(1,'#56707f');
    const rows=[6.2,4.95,3.7,2.45,1.0];for(let j=0;j<4;j++)for(let i=0;i<3;i++){const px=x0+2+i*(w-4)/3,py=Y(rows[j])+1,ph=Y(rows[j+1])-Y(rows[j])-2;x.fillStyle=gr;x.fillRect(px+1,py,(w-4)/3-2,ph);
      if(rnd()<.35){x.globalAlpha=.18;x.fillStyle='#fff';x.fillRect(px+3,py+2,4,ph-4);x.globalAlpha=1}}
    ex.fillStyle='#ffe2b0';ex.globalAlpha=.85;ex.fillRect(x0+2,y0+2,w-4,h-4);ex.globalAlpha=1}
  return {map:tex(c),em:tex(e)}}
function roofTex(colr){const [c,x]=canvas(256,256);x.fillStyle=colr;x.fillRect(0,0,256,256);speckle(x,256,256,5000,[shade(colr,.85),shade(colr,1.12)],.5);
  x.strokeStyle=shade(colr,.9);x.lineWidth=1;for(let i=0;i<256;i+=32){x.beginPath();x.moveTo(i,0);x.lineTo(i,256);x.stroke()}return tex(c)}
function glassRoofTex(){const [c,x]=canvas(128,128);x.fillStyle='#8fa6b4';x.fillRect(0,0,128,128);x.strokeStyle='#d8dde0';x.lineWidth=4;
  for(let i=0;i<=128;i+=32){x.beginPath();x.moveTo(i,0);x.lineTo(i,128);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(128,i);x.stroke()}return tex(c)}
// instanced facade: UVs from each instance's resting place in its building, so the wall pattern stays continuous across pieces
function facadeMat(opts,uS,vS,key){const m=new THREE.MeshStandardMaterial(opts);
  m.onBeforeCompile=sh=>{sh.uniforms.uS={value:uS};sh.uniforms.vS={value:vS};
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 aRest;\nattribute vec3 aSize;\nuniform float uS;\nuniform float vS;')
      .replace('#include <uv_vertex>',`#include <uv_vertex>
      vec3 rp=aRest+position*aSize;
      vec2 fu=abs(normal.z)>.5?vec2(rp.x*sign(normal.z),rp.y):(abs(normal.x)>.5?vec2(-rp.z*sign(normal.x),rp.y):vec2(rp.x,rp.z));
      fu=vec2(fu.x/uS,fu.y/vS);
      #ifdef USE_MAP
      vMapUv=fu;
      #endif
      #ifdef USE_BUMPMAP
      vBumpMapUv=fu;
      #endif
      #ifdef USE_EMISSIVEMAP
      vEmissiveMapUv=fu;
      #endif`)};
  m.userData.uS=uS;m.userData.vS=vS;m.userData.facade=true;m.customProgramCacheKey=()=>'facade-'+key;if(opts.emissiveMap)nightMats.push(m);return m}
const MAT={};
const plainMat=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.88},o||{}));
const M_slabSide=plainMat(0xe6e0d2),M_slabTop=plainMat(0xcfc8bb),M_ceiling=plainMat(0xf2efe8),M_part=plainMat(0xefebe3,{roughness:.9}),M_cope=plainMat(0xf2efe8,{roughness:.6}),
  M_col=plainMat(0xefebe2,{roughness:.7}),M_rail=plainMat(0x9aa2a8,{metalness:.5,roughness:.4}),M_glassRoof=facadeMat({map:glassRoofTex(),roughness:.2,metalness:.3,envMapIntensity:1.1},3,3,'glass');
function buildingMats(b,i){if(b.mats)return b.mats;const o={};
  if(b.gym){const t=gymTex(b.wall);o.gym=facadeMat({map:t.map,emissiveMap:t.em,emissive:0xffffff,emissiveIntensity:0,roughness:.75,metalness:.15,envMapIntensity:.6},b.bay*4,11.5,b.id+'g')}
  else{const tw=facadeTex(b.wall,1000+i*77,'win'),tb=facadeTex(b.wall,1500+i*77,'blank');
    o.win=facadeMat({map:tw.map,bumpMap:tw.bump,bumpScale:1.6,emissiveMap:tw.em,emissive:0xffffff,emissiveIntensity:0,roughness:.85,metalness:0,envMapIntensity:.6},b.bay*BAYS,FHT*FLOORS,b.id+'w');
    o.blank=facadeMat({map:tb.map,bumpMap:tb.bump,bumpScale:1.6,roughness:.88,metalness:0,envMapIntensity:.55},b.bay*BAYS,FHT*FLOORS,b.id+'b');
    const bt=bigTex(b.wall);o.big=facadeMat({map:bt.map,emissiveMap:bt.em,emissive:0xffffff,emissiveIntensity:0,roughness:.5,metalness:.1,envMapIntensity:.9},40,7.2,b.id+'big');
    const rt=ribbonTex(b.wall);o.ribbon=facadeMat({map:rt.map,emissiveMap:rt.em,emissive:0xffffff,emissiveIntensity:0,roughness:.55,metalness:.12,envMapIntensity:.85},b.bay*BAYS,FHT,b.id+'r')}
  const brick=plainMat(new THREE.Color(b.wall).multiplyScalar(.93));o.para=[brick,brick,M_cope,brick,brick,brick];
  o.roof=facadeMat({map:roofTex(b.roof),roughness:.9,envMapIntensity:.4},8,8,b.id+'roof');
  o.roofArr=[brick,brick,o.roof,M_ceiling,brick,brick];
  b.mats=o;return o}
function matFor(p){const o=buildingMats(p.b,BLD.indexOf(p.b));
  switch(p.m){case'win':case'blank':case'ribbon':case'gym':case'big':return {mat:o[p.m],facade:true};
    case'part':return{mat:M_part};case'rail':return{mat:M_rail};case'col':return{mat:M_col};
    case'slab':return{mat:[M_slabSide,M_slabSide,M_slabTop,M_ceiling,M_slabSide,M_slabSide]};
    case'para':return{mat:o.para};case'glassroof':return{mat:[M_slabSide,M_slabSide,M_glassRoof,M_ceiling,M_slabSide,M_slabSide]};
    default:return{mat:o.roofArr,roofTex:true}}}
const facadeUS=p=>p.m==='gym'?p.b.bay*4:p.m==='big'?40:p.b.bay*BAYS,facadeVS=p=>p.m==='gym'?11.5:p.m==='big'?7.2:p.m==='ribbon'?FHT:FHT*FLOORS;
// facade geometry needs world-aligned roof UVs too
