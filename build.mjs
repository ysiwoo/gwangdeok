// src/ 조각들을 이어 붙여 index.html(3D 모델)과 game.html(SMASH 게임)을 만듭니다.  실행: node build.mjs
import {readFileSync,writeFileSync} from 'node:fs';
const r=f=>readFileSync(new URL('./src/'+f,import.meta.url),'utf8');
const shared=['core.js','data.js','generator.js','textures.js','furniture.js','site.js'];
const pages={'index.html':['head-model.html','model.js'],'game.html':['head-game.html','game.js']};
for(const [out,[head,main]] of Object.entries(pages)){writeFileSync(new URL('./'+out,import.meta.url),r(head)+shared.map(r).join('')+r(main));console.log('만듦:',out)}
