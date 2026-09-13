import {cpSync, mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {defineConfig} from 'vite';

const repositoryRoot=process.cwd();
const webRoot=resolve(repositoryRoot,'web');
const outDir=resolve(repositoryRoot,'dist');

export default defineConfig({
  root:webRoot,
  base:'/manga-blueprint-studio/',
  publicDir:false,
  build:{
    outDir,
    emptyOutDir:true,
    target:'es2022',
    rollupOptions:{
      input:{
        landing:resolve(webRoot,'index.html'),
        app:resolve(webRoot,'editor.html'),
        guide:resolve(webRoot,'guide.html')
      }
    }
  },
  plugins:[{
    name:'manga-blueprint-copy-legacy-runtime',
    closeBundle(){
      mkdirSync(outDir,{recursive:true});
      cpSync(resolve(webRoot,'runtime'),resolve(outDir,'runtime'),{recursive:true});
    }
  }]
});
