/* Bagikan listing (teks WhatsApp) dan unduh brosur PDF 1 halaman A4.
   PDF digambar di canvas lalu dibungkus ke file PDF tanpa library eksternal. */
window.NP_SHARE=(function(){
const C={navy:"#0A2845",ink:"#0F2236",muted:"#5A6878",line:"#DCE3EA",soft:"#E3EAF2",bg:"#F5F7F9",wa:"#1E8A55",gold:"#D4802A",white:"#FFFFFF"};
const FD='"Plus Jakarta Sans","Avenir Next","Segoe UI",Arial,sans-serif';
const FB='"Plus Jakarta Sans","Helvetica Neue",Arial,sans-serif';
const FM='"IBM Plex Mono",Menlo,monospace';

/* ---------- teks bagikan ---------- */
function specs(l,h){
  const r=[];
  const T=h.T||(x=>x);
  r.push(["Jenis",`${T(l.type)} · ${T(l.status)}`]);
  if(l.size)r.push([h.hasBuilding(l.type)?"Luas tanah":"Luas",`${h.num(l.size)} m² (${h.num(Math.round(l.size)/100)} are)`]);
  if(h.hasBuilding(l.type)&&l.building_size)r.push(["Luas bangunan",`${h.num(l.building_size)} m²`]);
  if(l.bedrooms!=null)r.push(["Kamar tidur",String(l.bedrooms)]);
  if(l.bathrooms!=null)r.push(["Kamar mandi",String(l.bathrooms)]);
  if(l.cert)r.push(["Sertifikat",T(l.cert)]);
  if(l.zone)r.push(["Zonasi",T(l.zone)]);
  if(l.facing)r.push(["Hadap",T(l.facing)]);
  r.push(["Harga",l.price==null||l.price===""?T("Hubungi agen"):`${h.rupiah(l.price)}${h.units[l.unit]?" "+T(h.units[l.unit]):""}`]);
  if(l.price&&l.unit==="total"&&l.size&&l.type==="Tanah")r.push(["Harga per are",h.rupiah(l.price/(l.size/100))]);
  return r.map(([k,v])=>[T(k),v]);
}
function text(l,a,site,url,h){
  const loc=[l.place,l.kab,l.prov].filter(Boolean).join(", ");
  const lines=[`*${l.title}*`,`📍 ${loc}`,"",...specs(l,h).map(([k,v])=>`• ${k}: ${v}`)];
  if(l.maps_url)lines.push(`• Lokasi: ${l.maps_url}`);
  if(l.description){const d=l.description.length>420?l.description.slice(0,417).trim()+"…":l.description;lines.push("",d)}
  lines.push("",`Foto & detail lengkap: ${url}`,"");
  if(a&&a.phone){
    lines.push(`Info & jadwal survei, hubungi *${a.name}*${a.agency?` (${a.agency})`:""}`);
    lines.push(`WhatsApp: https://wa.me/${h.wa(a.phone)}`);
  }
  lines.push(`— ${site.name}`);
  return lines.join("\n");
}

/* ---------- PDF ---------- */
const S=2.6; // skala canvas per point (≈187 dpi)
const W=595.28,H=841.89,M=34;
function rr(x,X,y,w,hh,r){x.beginPath();x.moveTo(X+r,y);x.arcTo(X+w,y,X+w,y+hh,r);x.arcTo(X+w,y+hh,X,y+hh,r);x.arcTo(X,y+hh,X,y,r);x.arcTo(X,y,X+w,y,r);x.closePath()}
function wrap(x,t,maxW){
  const out=[];String(t||"").split(/\n+/).forEach(par=>{let line="";par.split(/\s+/).forEach(w=>{const test=line?line+" "+w:w;if(x.measureText(test).width>maxW&&line){out.push(line);line=w}else line=test});if(line)out.push(line)});
  return out;
}
async function loadImg(url){
  try{const r=await fetch(url,{mode:"cors"});if(!r.ok)return null;const b=await r.blob();return await createImageBitmap(b)}catch(e){return null}
}
function cover(x,img,X,Y,w,hh,rad){
  x.save();rr(x,X,Y,w,hh,rad);x.clip();
  const s=Math.max(w/img.width,hh/img.height),iw=img.width*s,ih=img.height*s;
  x.drawImage(img,X+(w-iw)/2,Y+(hh-ih)/2,iw,ih);x.restore();
}
function plot(x,l,h,X,Y,w,hh){
  x.save();rr(x,X,Y,w,hh,8);x.fillStyle=C.soft;x.fill();x.clip();
  x.strokeStyle="rgba(36,80,110,.12)";x.lineWidth=.6;
  for(let i=X;i<X+w;i+=14){x.beginPath();x.moveTo(i,Y);x.lineTo(i,Y+hh);x.stroke()}
  for(let j=Y;j<Y+hh;j+=14){x.beginPath();x.moveTo(X,j);x.lineTo(X+w,j);x.stroke()}
  const bw=Math.min(w*.55,260),bh=hh*.5;x.strokeStyle=C.navy;x.lineWidth=1.6;x.strokeRect(X+(w-bw)/2,Y+(hh-bh)/2,bw,bh);
  x.fillStyle=C.navy;x.textAlign="center";x.font=`500 26px ${FM}`;
  x.fillText(l.size?`${h.num(Math.round(l.size)/100)} are`:l.type,X+w/2,Y+hh/2+4);
  if(l.size){x.fillStyle=C.muted;x.font=`400 10px ${FM}`;x.fillText(`${h.num(l.size)} m²`,X+w/2,Y+hh/2+20)}
  x.restore();x.textAlign="left";
}
async function render(l,a,site,url,h){
  try{await document.fonts.ready}catch(e){}
  const cv=document.createElement('canvas');cv.width=Math.round(W*S);cv.height=Math.round(H*S);
  const x=cv.getContext('2d');x.scale(S,S);x.textBaseline="alphabetic";
  x.fillStyle=C.white;x.fillRect(0,0,W,H);
  // header
  x.fillStyle=C.navy;x.fillRect(0,0,W,62);
  {const g=x.createLinearGradient(0,0,W,0);g.addColorStop(0,"#EDBA6A");g.addColorStop(1,"#D4802A");x.fillStyle=g;x.fillRect(0,62,W,2.5)}
  const logo=await loadImg(location.origin+"/assets/np-mark-light.png?v=2");
  let tx=M;if(logo){const lh=26,lw=logo.width*lh/logo.height;x.drawImage(logo,M,18,lw,lh);tx=M+lw+10}
  x.fillStyle=C.white;x.font=`800 17px ${FD}`;x.fillText(site.name,tx,36.5);
  x.textAlign="right";x.font=`600 8px ${FB}`;x.fillStyle="rgba(255,255,255,.75)";x.fillText(h.T("BROSUR LISTING"),W-M,28);
  x.font=`600 11px ${FB}`;x.fillStyle=C.white;x.fillText(`${h.T(l.type)} · ${h.T(l.status)}`,W-M,43);x.textAlign="left";
  // title block
  let y=88;
  const loc=[l.place,l.kab,l.prov].filter(Boolean).join(" · ").toUpperCase();
  x.fillStyle=C.muted;x.font=`600 8.5px ${FB}`;x.fillText(loc,M,y);
  y+=24;x.fillStyle=C.ink;x.font=`800 22px ${FD}`;
  const tl=wrap(x,l.title,W-2*M).slice(0,2);tl.forEach(t=>{x.fillText(t,M,y);y+=26});
  y+=2;x.font=`700 18px ${FD}`;x.fillStyle=C.navy;
  const priceTxt=l.price==null||l.price===""?h.T("Harga: hubungi agen"):`${h.rupiah(l.price)}${h.units[l.unit]?" "+h.T(h.units[l.unit]):""}`;
  x.fillText(priceTxt,M,y);
  if(l.price&&l.unit==="total"&&l.size&&l.type==="Tanah"){const pw=x.measureText(priceTxt).width;x.font=`500 10.5px ${FB}`;x.fillStyle=C.muted;x.fillText(`·  ${h.rupiah(l.price/(l.size/100))} ${h.T("per are")}`,M+pw+10,y)}
  y+=16;
  // photos
  const pics=(l.photos||[]).slice(0,3),imgs=(await Promise.all(pics.map(loadImg))).filter(Boolean);
  const PH=232,PW=W-2*M;
  if(imgs.length>=3){const mw=PW*.64;cover(x,imgs[0],M,y,mw,PH,8);const sw=PW-mw-8,sh=(PH-8)/2;cover(x,imgs[1],M+mw+8,y,sw,sh,8);cover(x,imgs[2],M+mw+8,y+sh+8,sw,sh,8)}
  else if(imgs.length===2){const hw=(PW-8)/2;cover(x,imgs[0],M,y,hw,PH,8);cover(x,imgs[1],M+hw+8,y,hw,PH,8)}
  else if(imgs.length===1)cover(x,imgs[0],M,y,PW,PH,8);
  else plot(x,l,h,M,y,PW,PH);
  y+=PH+24;
  // specs (2 kolom)
  x.fillStyle=C.navy;x.font=`700 9px ${FB}`;x.fillText(h.T("SPESIFIKASI"),M,y);y+=10;
  const rows=specs(l,h).filter(r=>r[0]!==h.T("Harga"));
  const colW=(PW-24)/2,rowH=21,half=Math.ceil(rows.length/2);
  rows.forEach(([k,v],i)=>{
    const col=i<half?0:1,row=col?i-half:i,X=M+col*(colW+24),Y=y+row*rowH;
    x.strokeStyle=C.line;x.lineWidth=.7;x.beginPath();x.moveTo(X,Y+rowH);x.lineTo(X+colW,Y+rowH);x.stroke();
    x.fillStyle=C.muted;x.font=`500 9.5px ${FB}`;x.fillText(k,X,Y+14);
    x.fillStyle=C.ink;x.font=`600 10px ${FB}`;x.textAlign="right";
    let vv=String(v);while(x.measureText(vv).width>colW*.58&&vv.length>4)vv=vv.slice(0,-2)+"…";
    x.fillText(vv,X+colW,Y+14);x.textAlign="left";
  });
  y+=half*rowH+22;
  // contact box position (fixed at bottom)
  const BH=104,BY=H-26-BH;
  // description
  if(l.description){
    x.fillStyle=C.navy;x.font=`700 9px ${FB}`;x.fillText(h.T("DESKRIPSI"),M,y);y+=15;
    x.fillStyle=C.ink;x.font=`400 10px ${FB}`;
    const maxLines=Math.max(0,Math.floor((BY-14-y)/14.5));
    let ls=wrap(x,l.description,PW);
    if(ls.length>maxLines){ls=ls.slice(0,maxLines);if(ls.length)ls[ls.length-1]=ls[ls.length-1].replace(/\s*\S*$/,"")+" …"}
    ls.forEach(t=>{x.fillText(t,M,y);y+=14.5});
  }
  if(l.maps_url&&y<BY-26){x.fillStyle=C.muted;x.font=`500 9px ${FB}`;x.fillText(h.T("Lokasi Google Maps: ")+l.maps_url,M,BY-14)}
  // contact box
  rr(x,M,BY,PW,BH,10);x.fillStyle=C.soft;x.fill();
  x.fillStyle=C.navy;x.fillRect(M,BY+14,3,BH-28);
  x.fillStyle=C.navy;x.font=`700 8.5px ${FB}`;x.fillText(h.T("INFO & JADWAL SURVEI"),M+20,BY+26);
  x.fillStyle=C.ink;x.font=`800 17px ${FD}`;x.fillText(a?a.name:h.T("Agen"),M+20,BY+48);
  if(a&&a.agency){x.fillStyle=C.muted;x.font=`500 10px ${FB}`;x.fillText(a.agency,M+20,BY+63)}
  if(a&&a.phone){x.fillStyle=C.ink;x.font=`600 12px ${FM}`;x.fillText(`WhatsApp  ${a.phone}`,M+20,BY+85)}
  const bw=168,bh=38,bx=W-M-18-bw,by=BY+(BH-bh)/2-8;
  rr(x,bx,by,bw,bh,19);x.fillStyle=C.wa;x.fill();
  x.fillStyle=C.white;x.font=`700 12px ${FB}`;x.textAlign="center";x.fillText(h.T("Chat via WhatsApp"),bx+bw/2,by+24);
  x.fillStyle=C.muted;x.font=`500 8px ${FB}`;x.fillText(h.T("Ketuk tombol untuk langsung chat"),bx+bw/2,by+bh+14);x.textAlign="left";
  // footer
  x.fillStyle=C.muted;x.font=`500 7.5px ${FB}`;
  const host=location.host||"nusantara.properties";
  const dt=new Date().toLocaleDateString(h.locale||'id-ID',{day:"numeric",month:"long",year:"numeric"});
  x.fillText(h.en?`${host}  ·  Created ${dt}  ·  Information may change at any time; confirm with the agent before any transaction.`:`${host}  ·  Dibuat ${dt}  ·  Informasi dapat berubah sewaktu-waktu, konfirmasikan kepada agen sebelum transaksi.`,M,H-12);
  const links=[];
  if(a&&a.phone)links.push({rect:[bx,by,bx+bw,by+bh],url:`https://wa.me/${h.wa(a.phone)}?text=${encodeURIComponent(h.en?`Hello ${a.name}, I'm interested in your listing "${l.title}" on ${site.name}. Could you share more information?`:`Halo ${a.name}, saya tertarik dengan listing "${l.title}" di ${site.name}. Boleh minta info lebih lanjut?`)}`});
  links.push({rect:[M,H-22,M+120,H-6],url});
  return {canvas:cv,links};
}
/* PDF minimal: satu halaman A4 berisi gambar JPEG + anotasi tautan */
function pdfBytes(jpeg,pxW,pxH,links,title){
  const enc=new TextEncoder(),parts=[],offs=[];let len=0;
  const push=b=>{const u=typeof b==="string"?enc.encode(b):b;parts.push(u);len+=u.length};
  const esc=s=>String(s).replace(/[\\()]/g,m=>"\\"+m).replace(/[^\x20-\x7e]/g,"");
  push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  const obj=(n,body)=>{offs[n]=len;push(`${n} 0 obj\n`);if(typeof body==="function")body();else push(body);push("\nendobj\n")};
  const annRefs=links.map((_,i)=>`${7+i} 0 R`).join(" ");
  obj(1,"<< /Type /Catalog /Pages 2 0 R >>");
  obj(2,"<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  obj(3,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R${links.length?` /Annots [${annRefs}]`:""} >>`);
  const content=`q ${W} 0 0 ${H} 0 0 cm /Im0 Do Q`;
  obj(4,`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  obj(5,()=>{push(`<< /Type /XObject /Subtype /Image /Width ${pxW} /Height ${pxH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);push(jpeg);push("\nendstream")});
  obj(6,`<< /Title (${esc(title)}) /Producer (Nusantara Property) >>`);
  links.forEach((lk,i)=>{const [x1,y1,x2,y2]=lk.rect;obj(7+i,`<< /Type /Annot /Subtype /Link /Rect [${x1.toFixed(2)} ${(H-y2).toFixed(2)} ${x2.toFixed(2)} ${(H-y1).toFixed(2)}] /Border [0 0 0] /A << /S /URI /URI (${esc(lk.url)}) >> >>`)});
  const n=7+links.length,xref=len;
  let t=`xref\n0 ${n}\n0000000000 65535 f \n`;for(let i=1;i<n;i++)t+=String(offs[i]).padStart(10,"0")+" 00000 n \n";
  push(t+`trailer\n<< /Size ${n} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xref}\n%%EOF`);
  const out=new Uint8Array(len);let o=0;parts.forEach(p=>{out.set(p,o);o+=p.length});return out;
}
async function pdf(l,a,site,url,h){
  const {canvas,links}=await render(l,a,site,url,h);
  const blob=await new Promise(r=>canvas.toBlob(r,'image/jpeg',.9));
  const jpeg=new Uint8Array(await blob.arrayBuffer());
  const bytes=pdfBytes(jpeg,canvas.width,canvas.height,links,l.title);
  const name=(l.title||"listing").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"listing";
  const file=new Blob([bytes],{type:"application/pdf"});
  const a2=document.createElement('a');a2.href=URL.createObjectURL(file);a2.download=`${name}.pdf`;document.body.appendChild(a2);a2.click();
  setTimeout(()=>{URL.revokeObjectURL(a2.href);a2.remove()},4000);
  return file;
}
return {text,pdf,render,pdfBytes};
})();
