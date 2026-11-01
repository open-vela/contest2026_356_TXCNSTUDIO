// 粗看设计稿/按钮的 ASCII 亮度图
// 运行：node scripts/ui-peek.mjs
import fs from 'fs'
import zlib from 'zlib'
import path from 'path'

function decodePNG(buf){
  let pos=8,w=0,h=0,bd=0,ct=0;const idat=[]
  while(pos<buf.length){const len=buf.readUInt32BE(pos);const type=buf.toString('ascii',pos+4,pos+8);const data=buf.subarray(pos+8,pos+8+len)
    if(type==='IHDR'){w=data.readUInt32BE(0);h=data.readUInt32BE(4);bd=data[8];ct=data[9]}
    else if(type==='IDAT')idat.push(data);else if(type==='IEND')break;pos+=12+len}
  const raw=zlib.inflateSync(Buffer.concat(idat))
  const bpp=ct===6?4:ct===2?3:0;const stride=w*bpp;const out=Buffer.alloc(w*h*4)
  let prev=Buffer.alloc(stride),o=0
  for(let y=0;y<h;y++){const f=raw[o++];const line=raw.subarray(o,o+stride);o+=stride;const cur=Buffer.from(line)
    for(let i=0;i<stride;i++){const a=i>=bpp?cur[i-bpp]:0,b=prev[i],c=i>=bpp?prev[i-bpp]:0
      if(f===1)cur[i]=(cur[i]+a)&255;else if(f===2)cur[i]=(cur[i]+b)&255;else if(f===3)cur[i]=(cur[i]+((a+b)>>1))&255
      else if(f===4){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);cur[i]=(cur[i]+(pa<=pb&&pa<=pc?a:pb<=pc?b:c))&255}}
    for(let x=0;x<w;x++){const si=x*bpp,di=(y*w+x)*4;out[di]=cur[si];out[di+1]=cur[si+1];out[di+2]=cur[si+2];out[di+3]=bpp===4?cur[si+3]:255}
    prev=cur}
  return {w,h,rgba:out}
}

function ascii(img, cell, x0=0,y0=0,rw=null,rh=null){
  rw=rw??img.w; rh=rh??img.h
  const chars=' .:-=+*#%@'
  let out=`${img.w}x${img.h}\n`
  for(let r=0;r*cell<rh;r++){
    let line=''
    for(let c=0;c*cell<rw;c++){
      let sum=0,n=0
      for(let y=y0+r*cell;y<Math.min(y0+(r+1)*cell,img.h);y++)
        for(let x=x0+c*cell;x<Math.min(x0+(c+1)*cell,img.w);x++){
          const i=(y*img.w+x)*4
          sum+=img.rgba[i]*0.299+img.rgba[i+1]*0.587+img.rgba[i+2]*0.114;n++
        }
      line+=chars[Math.min(chars.length-1,Math.floor((n?sum/n:0)/256*chars.length))]
    }
    out+=line+'\n'
  }
  return out
}

const dir='C:/Users/Administrator/Downloads/yuanpinui'
const files=process.argv.slice(2)
if(!files.length){console.log('usage: node scripts/ui-peek.mjs <file.png> [...]'); process.exit(0)}
for(const f of files){
  const img=decodePNG(fs.readFileSync(path.join(dir,f)))
  // 大图用 cell=8~10，按钮用 cell=3
  const cell=img.w>200?8:3
  console.log('\n========', f, '========')
  console.log(ascii(img, cell))
}
