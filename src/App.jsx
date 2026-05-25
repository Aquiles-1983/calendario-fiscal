import{useState,useMemo,useRef,useEffect}from"react";
const B="#0057A8",BD="#003E7E",R="#E8002D",G="#00A651",O="#FF6600",Y="#FFD100",GR="#231F20",GM="#58595B";
const D=[
{fy:"FY25",n:2024,Abr:22,Mai:20.5,Jun:20,Jul:22.5,Ago:22,Set:21,Out:23,Nov:19,Dez:17.25,Jan:22,Fev:20,Mar:18.5,T:247.75},
{fy:"FY26",n:2025,Abr:20,Mai:20.5,Jun:19.5,Jul:22.5,Ago:21,Set:22,Out:23,Nov:18.5,Dez:18.5,Jan:20.5,Fev:17.5,Mar:22,T:245.5},
{fy:"FY27",n:2026,Abr:19.5,Mai:20,Jun:20.5,Jul:22.5,Ago:21,Set:21,Out:21,Nov:19,Dez:18.25,Jan:19,Fev:17.5,Mar:22,T:241.25},
{fy:"FY28",n:2027,Abr:21,Mai:19.5,Jun:22,Jul:21.5,Ago:22,Set:20.5,Out:19.5,Nov:19.5,Dez:18.5,Jan:19.5,Fev:19,Mar:22.5,T:245},
{fy:"FY29",n:2028,Abr:18,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:19.5,Out:20.5,Nov:18.5,Dez:17,Jan:20.5,Fev:17.5,Mar:21,T:239},
{fy:"FY30",n:2029,Abr:20.5,Mai:21,Jun:20.5,Jul:21.5,Ago:23,Set:19,Out:22,Nov:18,Dez:16.75,Jan:21,Fev:20,Mar:18.5,T:241.75},
{fy:"FY31",n:2030,Abr:21,Mai:22,Jun:18.5,Jul:22.5,Ago:22,Set:21,Out:23,Nov:19,Dez:17.25,Jan:22,Fev:17.5,Mar:21,T:246.75},
{fy:"FY32",n:2031,Abr:20,Mai:20.5,Jun:19.5,Jul:22.5,Ago:21,Set:22,Out:23,Nov:18.5,Dez:18.5,Jan:20.5,Fev:17.5,Mar:22,T:245.5},
];
const MS=["Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez","Jan","Fev","Mar"];
const MN={Abr:4,Mai:5,Jun:6,Jul:7,Ago:8,Set:9,Out:10,Nov:11,Dez:12,Jan:1,Fev:2,Mar:3};
const MNM={1:"Janeiro",2:"Fevereiro",3:"Março",4:"Abril",5:"Maio",6:"Junho",7:"Julho",8:"Agosto",9:"Setembro",10:"Outubro",11:"Novembro",12:"Dezembro"};
const DW=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const FYS=D.map(r=>r.fy);
const ALL=D.flatMap(r=>MS.map(m=>({fy:r.fy,n:r.n,m,v:r[m]})));
const q1=r=>r.Abr+r.Mai+r.Jun,q2=r=>r.Jul+r.Ago+r.Set,q3=r=>r.Out+r.Nov+r.Dez,q4=r=>r.Jan+r.Fev+r.Mar;
const EX=[{k:"Q1",fn:q1,s:1},{k:"Q2",fn:q2},{k:"Q3",fn:q3},{k:"Q4",fn:q4},{k:"H1",fn:r=>q1(r)+q2(r),s:1},{k:"H2",fn:r=>q3(r)+q4(r)}];
const f2=v=>parseFloat(v).toFixed(2).replace(".",",");
const fP=v=>v===null?"—":`${v>=0?"+":""}${v.toFixed(1)}%`;
const fA=v=>v===null?"—":`${v>=0?"+":""}${f2(parseFloat(v.toFixed(2)))}`;
const yC=v=>v===null?GM:v>0?G:v<0?R:GM;
function gV(r,k){const e=EX.find(x=>x.k===k);return e?e.fn(r):k==="T"?r.T:r[k];}

function pascoa(y){
  const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,
    f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,
    i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,
    m=Math.floor((a+11*h+22*l)/451),
    mes=Math.floor((h+l-7*m+114)/31),dia=(h+l-7*m+114)%31+1;
  return new Date(y,mes-1,dia);
}

function calcMes(ano,mes){
  const p=pascoa(ano);
  const aD=(d,n)=>{const r=new Date(d);r.setDate(r.getDate()+n);return r;};
  const tK=d=>`${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const FER={
    "01-01":"Confraternização","01-25":"Aniv.SP",
    [tK(aD(p,-48))]:"2ªCarnaval",[tK(aD(p,-47))]:"3ªCarnaval",
    [tK(aD(p,-2))]:"6ªSanta",[tK(p)]:"Páscoa",
    "04-21":"Tiradentes","05-01":"Trabalho",
    [tK(aD(p,60))]:"Corpus","09-07":"Independência",
    "10-12":"N.Sra.Ap","11-02":"Finados",
    "11-15":"República","11-20":"Consciência","12-25":"Natal",
  };
  const iF=k=>!!FER[k];
  const qc=tK(aD(p,-46));
  const tot=new Date(ano,mes,0).getDate();
  const days=[];
  for(let d=1;d<=tot;d++){
    const dt=new Date(ano,mes-1,d),dow=dt.getDay(),fds=dow===0||dow===6;
    const k=`${String(mes).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const kA=tK(new Date(ano,mes-1,d-1)),kP=tK(new Date(ano,mes-1,d+1));
    const dA=new Date(ano,mes-1,d-1),dP=new Date(ano,mes-1,d+1);
    let v=1,tp="u",lb="";
    if(fds){v=0;tp="f";}
    else if(iF(k)){v=0;tp="h";lb=FER[k];}
    else if(mes===7&&d===9){v=0.5;tp="m";lb="Rev.Const";}
    else if(k===qc){v=0.5;tp="m";lb="4ªCinzas";}
    else if(dow===5&&iF(kA)&&dA.getDay()===4){v=0.5;tp="e";lb="Emenda";}
    else if(dow===1&&iF(kP)&&dP.getDay()===2){v=0.5;tp="e";lb="Emenda";}
    else if(mes===12){
      if(d===23||d===24||d===31){v=0.5;tp="m";lb=d===23?"Pré-Natal":d===24?"Vésp.Natal":"Vésp.ANV";}
      else if(d>=26&&d<=30){v=0.25;tp="q";lb="Recesso";}
    }
    days.push({d,dow,fds,v,tp,lb});
  }
  return days;
}

function Modal({i0,onClose}){
  const[idx,setIdx]=useState(i0);
  const{fy,n,m,v}=ALL[idx];
  const mn=MN[m],ano=mn>=4?n:n+1;
  const days=useMemo(()=>calcMes(ano,mn),[ano,mn]);
  const fd=new Date(ano,mn-1,1).getDay();
  const cells=[...Array(fd).fill(null),...days];
  while(cells.length%7)cells.push(null);
  const rows=[];
  for(let i=0;i<cells.length;i+=7)rows.push(cells.slice(i,i+7));
  const cs=(tp,v)=>{
    if(tp==="f"||tp==="h")return{bg:R,tx:"#fff"};
    if(v===1)return{bg:B,tx:"#fff"};
    if(v===0.5)return{bg:O,tx:"#fff"};
    if(v===0.25)return{bg:Y,tx:GR};
    return{bg:"#ddd",tx:"#666"};
  };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:12}} onClick={onClose}>
      <div style={{background:"#F4F6FA",borderRadius:16,overflow:"hidden",maxWidth:460,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,0.22)",maxHeight:"95vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>

        {/* Header com navegação */}
        <div style={{background:B,padding:"12px 14px",flexShrink:0,display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setIdx(i=>Math.max(0,i-1))} disabled={idx===0}
            style={{background:idx>0?"rgba(255,255,255,0.18)":"rgba(255,255,255,0.07)",border:"none",color:"#fff",width:32,height:32,borderRadius:7,cursor:idx>0?"pointer":"default",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",opacity:idx>0?1:0.3}}>‹</button>
          <div style={{flex:1,textAlign:"center"}}>
            <div style={{color:"#fff",fontWeight:700,fontSize:16}}>{MNM[mn]} {ano}</div>
            <div style={{color:"rgba(255,255,255,0.6)",fontSize:11,marginTop:1}}>{fy} · {f2(v)} dias úteis</div>
          </div>
          <button onClick={()=>setIdx(i=>Math.min(ALL.length-1,i+1))} disabled={idx===ALL.length-1}
            style={{background:idx<ALL.length-1?"rgba(255,255,255,0.18)":"rgba(255,255,255,0.07)",border:"none",color:"#fff",width:32,height:32,borderRadius:7,cursor:idx<ALL.length-1?"pointer":"default",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",opacity:idx<ALL.length-1?1:0.3}}>›</button>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.18)",border:"none",color:"#fff",width:32,height:32,borderRadius:7,cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",marginLeft:4}}>✕</button>
        </div>

        {/* Cabeçalho dias da semana */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,padding:"10px 10px 4px",background:"#F4F6FA",flexShrink:0}}>
          {DW.map(d=>(
            <div key={d} style={{textAlign:"center",fontSize:11,fontWeight:700,color:d==="Dom"||d==="Sáb"?R:B,padding:"3px 0"}}>{d}</div>
          ))}
        </div>

        {/* Grid de dias */}
        <div style={{overflowY:"auto",padding:"3px 10px 14px",flex:1}}>
          {rows.map((row,ri)=>(
            <div key={ri} style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:3}}>
              {row.map((c,ci)=>{
                if(!c)return<div key={ci}/>;
                const{bg,tx}=cs(c.tp,c.v);
                return(
                  <div key={ci} style={{background:"#fff",borderRadius:9,padding:"5px 3px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,boxShadow:"0 1px 3px rgba(0,0,0,0.07)"}}>
                    <span style={{fontSize:12,fontWeight:500,color:GR}}>{c.d}</span>
                    <div style={{background:bg,borderRadius:6,width:"100%",padding:"3px 2px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:10,fontWeight:800,color:tx}}>{f2(c.v)}</span>
                    </div>
                    {c.lb&&<span style={{fontSize:7,color:GM,textAlign:"center",lineHeight:1.2}}>{c.lb}</span>}
                  </div>
                );
              })}
            </div>
          ))}
          {/* Legenda */}
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10,padding:"8px",background:"#fff",borderRadius:10}}>
            {[{c:B,l:"1,0 Útil"},{c:O,l:"0,5 Emenda/Vésp"},{c:Y,l:"0,25 Recesso"},{c:R,l:"0 Feriado/FDS"}].map(s=>(
              <div key={s.l} style={{display:"flex",alignItems:"center",gap:5,fontSize:9.5,color:GM}}>
                <div style={{width:11,height:11,borderRadius:3,background:s.c,flexShrink:0}}/>
                {s.l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


function exportXLSX(sorted,rows,cP,cA,fl){
  const MS2=["Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez","Jan","Fev","Mar"];
  const header=["FY",...MS2,"Total","Q1","Q2","Q3","Q4","H1","H2"];
  const q1r=r=>r.Abr+r.Mai+r.Jun,q2r=r=>r.Jul+r.Ago+r.Set,q3r=r=>r.Out+r.Nov+r.Dez,q4r=r=>r.Jan+r.Fev+r.Mar;
  const dataRows=sorted.map(row=>[row.fy,...MS2.map(m=>row[m]),row.T,
    parseFloat(q1r(row).toFixed(2)),parseFloat(q2r(row).toFixed(2)),
    parseFloat(q3r(row).toFixed(2)),parseFloat(q4r(row).toFixed(2)),
    parseFloat((q1r(row)+q2r(row)).toFixed(2)),parseFloat((q3r(row)+q4r(row)).toFixed(2))]);
  const fmtP=v=>v===null?"—":`${v>=0?"+":""}${v.toFixed(1)}%`;
  const fmtA=v=>v===null?"—":`${v>=0?"+":""}${parseFloat(v.toFixed(2))}`;
  const yR=[`YoY% (${fl})`,...MS2.map(m=>fmtP(cP(m))),fmtP(cP("T")),
    fmtP(cP("Q1")),fmtP(cP("Q2")),fmtP(cP("Q3")),fmtP(cP("Q4")),fmtP(cP("H1")),fmtP(cP("H2"))];
  const dR=[`Δ Dias (${fl})`,...MS2.map(m=>fmtA(cA(m))),fmtA(cA("T")),
    fmtA(cA("Q1")),fmtA(cA("Q2")),fmtA(cA("Q3")),fmtA(cA("Q4")),fmtA(cA("H1")),fmtA(cA("H2"))];
  const script=document.createElement("script");
  script.src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
  script.onload=()=>{
    const X=window.XLSX;
    const ws=X.utils.aoa_to_sheet([header,...dataRows,[],[yR],[dR]]);
    ws["!cols"]=[{wch:8},...MS2.map(()=>({wch:7})),{wch:9},{wch:7},{wch:7},{wch:7},{wch:7},{wch:9},{wch:9}];
    const wb=X.utils.book_new();
    X.utils.book_append_sheet(wb,ws,"Calendário Fiscal");
    X.writeFile(wb,`CalendarioFiscal_${rows[0]?.fy}_${rows[rows.length-1]?.fy}.xlsx`);
  };
  document.head.appendChild(script);
}


// ── Summary Page ──────────────────────────────────────────────────────────────
function SummaryPage({fy}){
  const row=D.find(r=>r.fy===fy)||D[0];
  const today=new Date();
  const MES_FULL={Abr:"Abril",Mai:"Maio",Jun:"Junho",Jul:"Julho",Ago:"Agosto",
    Set:"Setembro",Out:"Outubro",Nov:"Novembro",Dez:"Dezembro",
    Jan:"Janeiro",Fev:"Fevereiro",Mar:"Março"};

  // Calcula ciclos (janelas de 5 dias corridos) e MTD para cada mês
  const meses=useMemo(()=>MS.map(m=>{
    const mn=MN[m];
    const ano=mn>=4?row.n:row.n+1;
    const days=calcMes(ano,mn);
    const tot=new Date(ano,mn,0).getDate();

    // Ciclos: dias 1-5, 6-10, 11-15, 16-20, 21-25, 26-fim
    const cycles=[0,0,0,0,0,0];
    days.forEach(({d,v})=>{
      if(d<=5)       cycles[0]=parseFloat((cycles[0]+v).toFixed(4));
      else if(d<=10) cycles[1]=parseFloat((cycles[1]+v).toFixed(4));
      else if(d<=15) cycles[2]=parseFloat((cycles[2]+v).toFixed(4));
      else if(d<=20) cycles[3]=parseFloat((cycles[3]+v).toFixed(4));
      else if(d<=25) cycles[4]=parseFloat((cycles[4]+v).toFixed(4));
      else           cycles[5]=parseFloat((cycles[5]+v).toFixed(4));
    });

    // MTD: dias passados no mês até hoje
    const monthStart=new Date(ano,mn-1,1);
    const monthEnd=new Date(ano,mn,0);
    let mtd=0;
    if(today>=monthEnd){
      // Mês totalmente no passado
      mtd=row[m];
    } else if(today>=monthStart){
      // Mês atual
      days.forEach(({d,v})=>{
        const dt=new Date(ano,mn-1,d);
        if(dt<=today) mtd=parseFloat((mtd+v).toFixed(4));
      });
    }
    // Futuro = 0

    return{m,mn,ano,nome:MES_FULL[m],du:row[m],mtd:parseFloat(mtd.toFixed(2)),cycles:cycles.map(v=>parseFloat(v.toFixed(2)))};
  }),[row]);

  const totalDU=parseFloat(row.T.toFixed(2));
  const totalMTD=parseFloat(meses.reduce((s,m)=>s+m.mtd,0).toFixed(2));
  const totalCycles=[0,1,2,3,4,5].map(i=>parseFloat(meses.reduce((s,m)=>s+m.cycles[i],0).toFixed(2)));

  const thS={padding:"7px 10px",textAlign:"center",color:"#fff",fontSize:11,
    fontWeight:700,letterSpacing:"0.05em",whiteSpace:"nowrap"};
  const thL={...thS,textAlign:"left"};
  const tdS={padding:"4px 10px",textAlign:"center",fontSize:11.5,color:GR,
    borderBottom:"1px solid #E8EEF8"};
  const tdL={...tdS,textAlign:"left",fontWeight:500};
  const fDU=v=>parseFloat(v).toFixed(2).replace(".",",");
  const fCyc=v=>{
    const n=parseFloat(v.toFixed(1));
    return n.toFixed(1).replace(".",",");
  };

  return(
    <div style={{padding:"20px 24px",maxWidth:900}}>
      <div style={{borderRadius:10,border:"1px solid #D8E4F0",
        overflow:"auto",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,
          fontFamily:"inherit",background:"#fff"}}>
          <thead>
            <tr style={{background:B}}>
              <th style={{...thS,minWidth:56,verticalAlign:"top"}}>DU</th>
              <th style={{...thS,minWidth:64,verticalAlign:"top"}}>DU MTD</th>
              <th style={{...thL,minWidth:100,verticalAlign:"top"}}>MÊS</th>
              <th style={{...thS,verticalAlign:"top"}}>CICLO_5</th>
              <th style={{...thS,verticalAlign:"top"}}>CICLO_10</th>
              <th style={{...thS,verticalAlign:"top"}}>CICLO_15</th>
              <th style={{...thS,verticalAlign:"top"}}>CICLO_20</th>
              <th style={{...thS,verticalAlign:"top"}}>CICLO_25</th>
              <th style={{...thS,verticalAlign:"top"}}>CICLO_30</th>
            </tr>
          </thead>
          <tbody>
            {meses.map((m,ri)=>{
              const isCurrent=m.mtd>0&&m.mtd<m.du;
              const bg=isCurrent?"#EBF2FF":ri%2===0?"#fff":"#F7FAFF";
              return(
                <tr key={m.m} style={{background:bg}}>
                  <td style={{...tdS,fontWeight:isCurrent?700:400,
                    color:isCurrent?B:GR}}>{fDU(m.du)}</td>
                  <td style={{...tdS,color:m.mtd>0?B:GM,fontWeight:m.mtd>0?600:400}}>
                    {fDU(m.mtd)}
                  </td>
                  <td style={{...tdL,fontWeight:isCurrent?700:500,
                    color:isCurrent?B:GR}}>{m.nome}</td>
                  {m.cycles.map((v,i)=>(
                    <td key={i} style={tdS}>{fCyc(v)}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{background:"#F0F4FA",borderTop:`3px solid ${B}`}}>
              <td style={{...tdS,fontWeight:800,color:B,fontSize:13}}>{fDU(totalDU)}</td>
              <td style={{...tdS,fontWeight:700,color:B}}>{fDU(totalMTD)}</td>
              <td style={{...tdL,fontWeight:800,color:B,fontSize:13}}>FY</td>
              {totalCycles.map((v,i)=>(
                <td key={i} style={{...tdS,fontWeight:700,color:B}}>{fCyc(v)}</td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Legenda */}
      <div style={{marginTop:10,display:"flex",gap:16,flexWrap:"wrap",fontSize:11,color:GM}}>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:14,height:14,background:"#EBF2FF",border:`1px solid ${B}`,borderRadius:3}}/>
          Mês atual (em andamento)
        </div>
        <div>· CICLO_N = dias úteis nos dias corridos 1-N do mês</div>
        <div>· DU MTD = dias úteis acumulados até hoje no mês</div>
      </div>
    </div>
  );
}

export default function App(){
  const[sC,setSC]=useState(null);
  const[sD,setSD]=useState(1);
  const[hC,setHC]=useState(null);
  const[hR,setHR]=useState(null);
  const[anchor,setAnchor]=useState(FYS[0]);
  const[mIdx,setMIdx]=useState(null);
  const[page,setPage]=useState('calendar');

  const rows=useMemo(()=>{
    const i=D.findIndex(r=>r.fy===anchor);
    const start=i<0?0:i;
    return D.slice(start,Math.min(start+6,D.length));
  },[anchor]);

  const sorted=useMemo(()=>
    sC?[...rows].sort((a,b)=>(gV(a,sC)-gV(b,sC))*sD):rows
  ,[rows,sC,sD]);

  const hs=c=>{if(sC===c)setSD(d=>-d);else{setSC(c);setSD(1);}};

  const r0=rows[0];
  const prev=useMemo(()=>{
    const i=D.findIndex(r=>r.fy===r0?.fy);
    return i>0?D[i-1]:null;
  },[r0]);

  const cP=k=>{if(!r0||!prev)return null;const c=gV(r0,k),p=gV(prev,k);return p===0?null:((c-p)/p)*100;};
  const cA=k=>{if(!r0||!prev)return null;return parseFloat((gV(r0,k)-gV(prev,k)).toFixed(2));};
  const fl=r0&&prev?`${r0.fy} vs ${prev.fy}`:"—";

  // Estilos reutilizáveis
  const thM=(k,sep)=>({
    padding:"10px 4px",textAlign:"center",minWidth:52,cursor:"pointer",userSelect:"none",
    color:sC===k?Y:"#fff",fontSize:9,letterSpacing:"0.07em",textTransform:"uppercase",
    fontWeight:700,background:sC===k?BD:B,
    borderLeft:sep?"2px solid rgba(255,255,255,0.25)":"none",whiteSpace:"nowrap"
  });
  const thNM=(k,sep)=>({
    padding:"10px 6px",textAlign:"center",minWidth:58,userSelect:"none",
    color:"#fff",fontSize:9,letterSpacing:"0.07em",textTransform:"uppercase",
    fontWeight:700,background:B,
    borderLeft:sep?"2px solid rgba(255,255,255,0.25)":"none",whiteSpace:"nowrap"
  });
  const tdM=(hl,sep)=>({
    padding:"5px 2px",textAlign:"center",
    background:hl?"#EBF2FF":"transparent",
    borderLeft:sep?"2px solid #E0E8F5":"none"
  });
  const tdNM=(sep)=>({
    padding:"5px 4px",textAlign:"center",
    borderLeft:sep?"2px solid #E0E8F5":"none"
  });

  // Célula clicável (meses)
  const celM=(v,fn)=>(
    <div onClick={fn}
      style={{display:"inline-flex",alignItems:"center",justifyContent:"center",
        width:42,height:24,borderRadius:5,color:GR,fontWeight:500,fontSize:12,
        border:"1px solid #D8E4F0",cursor:"pointer"}}
      onMouseEnter={e=>e.currentTarget.style.background="#EBF2FF"}
      onMouseLeave={e=>e.currentTarget.style.background=""}>
      {f2(v)}
    </div>
  );

  // Célula não-clicável (Total, Q, H)
  const celNM=(v)=>(
    <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",
      width:46,height:24,borderRadius:5,color:GR,fontWeight:600,fontSize:12,
      border:"1px solid #E8EEF8",background:"#F7FAFF"}}>
      {f2(v)}
    </div>
  );

  return(
    <div style={{minHeight:"100vh",width:"100%",background:"#F0F4FA",fontFamily:"'Inter','Segoe UI',sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        html,body,#root{margin:0;padding:0;width:100%}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-thumb{background:${B};border-radius:3px}
      `}</style>

      {mIdx!==null&&<Modal i0={mIdx} onClose={()=>setMIdx(null)}/>}

      {/* HEADER */}
      <div style={{background:B,padding:"13px 24px",boxShadow:"0 4px 14px rgba(0,0,0,0.18)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:4,height:28,background:R,borderRadius:2}}/>
            <h1 style={{color:"#fff",fontSize:"clamp(14px,2vw,22px)",fontWeight:700,letterSpacing:"-0.01em",margin:0}}>
              Calendário Fiscal - PME
            </h1>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {/* Tabs */}
            {[{k:"calendar",l:"Calendário"},{k:"summary",l:"Summary"}].map(t=>(
              <button key={t.k} onClick={()=>setPage(t.k)}
                style={{padding:"6px 14px",borderRadius:7,border:"none",fontFamily:"inherit",
                  fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .2s",
                  background:page===t.k?"#fff":"rgba(255,255,255,0.15)",
                  color:page===t.k?B:"#fff"}}>
                {t.l}
              </button>
            ))}
            {page==="calendar"&&(
              <button
                onClick={()=>exportXLSX(sorted,rows,cP,cA,fl)}
                style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.15)",
                  border:"1px solid rgba(255,255,255,0.3)",borderRadius:7,
                  padding:"6px 13px",color:"#fff",fontFamily:"inherit",fontSize:12,
                  fontWeight:600,cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.25)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.15)"}>
Exportar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div style={{background:"#fff",borderBottom:"2px solid #E0E8F5",padding:"9px 24px",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>
        <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,fontWeight:700,color:GM,letterSpacing:"0.1em",textTransform:"uppercase"}}>Ano Fiscal</span>
          <select value={anchor} onChange={e=>{setAnchor(e.target.value);setSC(null);}}
            style={{background:"#F0F4FA",border:`1px solid ${B}55`,borderRadius:7,
              padding:"6px 28px 6px 11px",color:GR,fontSize:12,fontFamily:"inherit",
              cursor:"pointer",appearance:"none",minWidth:100,
              backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2358595B' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
              backgroundRepeat:"no-repeat",backgroundPosition:"right 8px center"}}>
            {FYS.map(f=><option key={f} value={f}>{f}</option>)}
          </select>

        </div>
      </div>

      {page==="calendar"&&<div style={{flex:1,padding:"12px 24px 18px",overflow:"auto"}}>
        <div style={{borderRadius:10,boxShadow:"0 4px 20px rgba(0,0,0,0.08)",border:"1px solid #D8E4F0",overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,fontFamily:"inherit",background:"#fff"}}>
            <thead>
              <tr style={{background:B}}>
                {/* FY — coluna estreita */}
                <th style={{padding:"10px 10px",textAlign:"left",color:"#fff",fontSize:9,
                  letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:700,
                  position:"sticky",left:0,background:B,zIndex:3,width:62,minWidth:62,maxWidth:62,
                  borderRight:"2px solid rgba(255,255,255,0.15)"}}>FY</th>

                {/* Meses — clicáveis para ordenar */}
                {MS.map(m=>(
                  <th key={m} onClick={()=>hs(m)}
                    onMouseEnter={()=>setHC(m)} onMouseLeave={()=>setHC(null)}
                    style={thM(m,false)}>
                    {m}{sC===m?(sD===1?"↑":"↓"):""}
                  </th>
                ))}

                {/* Total — não ordenável, não clicável */}
                <th style={thNM("T",true)}>Total</th>

                {/* Q1-Q4 H1-H2 — não ordenáveis */}
                {EX.map(e=>(
                  <th key={e.k} style={thNM(e.k,!!e.s)}>{e.k}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sorted.map((row,ri)=>{
                const hr=hR===row.fy;
                const bg=hr?"#EBF2FF":ri%2===0?"#fff":"#F7FAFF";
                return(
                  <tr key={row.fy}
                    onMouseEnter={()=>setHR(row.fy)}
                    onMouseLeave={()=>setHR(null)}
                    style={{background:bg,borderBottom:"1px solid #E8EEF8"}}>

                    {/* FY */}
                    <td style={{padding:"7px 10px",fontWeight:700,color:hr?B:GR,fontSize:12,
                      position:"sticky",left:0,zIndex:1,background:bg,width:62,minWidth:62,maxWidth:62,
                      borderRight:"2px solid #E0E8F5",whiteSpace:"nowrap",transition:"color .15s"}}>
                      {row.fy}
                    </td>

                    {/* Meses — abre modal */}
                    {MS.map(m=>{
                      const ci=ALL.findIndex(c=>c.fy===row.fy&&c.m===m);
                      return(
                        <td key={m} style={tdM(hC===m,false)}>
                          {celM(row[m],()=>setMIdx(ci))}
                        </td>
                      );
                    })}

                    {/* Total — sem modal */}
                    <td style={tdNM(true)}>{celNM(row.T)}</td>

                    {/* Q e H — sem modal */}
                    {EX.map(e=>(
                      <td key={e.k} style={tdNM(!!e.s)}>
                        {celNM(parseFloat(e.fn(row).toFixed(2)))}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              {/* YoY % */}
              <tr style={{background:"#EBF2FF",borderTop:`3px solid ${B}`}}>
                <td style={{padding:"7px 10px",fontSize:9,fontWeight:700,color:B,
                  letterSpacing:"0.08em",textTransform:"uppercase",
                  position:"sticky",left:0,background:"#EBF2FF",zIndex:1,
                  width:62,minWidth:62,maxWidth:62,
                  borderRight:"2px solid #D0DCF0",overflow:"hidden"}}>
                  YoY%
                </td>
                {MS.map(m=>{const v=cP(m);return(
                  <td key={m} style={{padding:"7px 2px",textAlign:"center"}}>
                    <span style={{fontSize:10,fontWeight:700,color:yC(v)}}>{fP(v)}</span>
                  </td>
                );})}
                <td style={{padding:"7px 6px",textAlign:"center",borderLeft:"2px solid #D0DCF0"}}>
                  <span style={{fontSize:10,fontWeight:700,color:yC(cP("T"))}}>{fP(cP("T"))}</span>
                </td>
                {EX.map(e=>{const v=cP(e.k);return(
                  <td key={e.k} style={{padding:"7px 3px",textAlign:"center",borderLeft:e.s?"2px solid #D0DCF0":"none"}}>
                    <span style={{fontSize:10,fontWeight:700,color:yC(v)}}>{fP(v)}</span>
                  </td>
                );})}
              </tr>

              {/* Δ Dias */}
              <tr style={{background:"#F7FAFF"}}>
                <td style={{padding:"7px 10px",fontSize:9,fontWeight:700,color:B,
                  letterSpacing:"0.08em",textTransform:"uppercase",
                  position:"sticky",left:0,background:"#F7FAFF",zIndex:1,
                  width:62,minWidth:62,maxWidth:62,
                  borderRight:"2px solid #D0DCF0",overflow:"hidden"}}>
                  Δ Dias
                </td>
                {MS.map(m=>{const v=cA(m);return(
                  <td key={m} style={{padding:"7px 2px",textAlign:"center"}}>
                    <span style={{fontSize:10,fontWeight:600,color:yC(v)}}>{fA(v)}</span>
                  </td>
                );})}
                <td style={{padding:"7px 6px",textAlign:"center",borderLeft:"2px solid #D0DCF0"}}>
                  <span style={{fontSize:10,fontWeight:700,color:yC(cA("T"))}}>{fA(cA("T"))}</span>
                </td>
                {EX.map(e=>{const v=cA(e.k);return(
                  <td key={e.k} style={{padding:"7px 3px",textAlign:"center",borderLeft:e.s?"2px solid #D0DCF0":"none"}}>
                    <span style={{fontSize:10,fontWeight:600,color:yC(v)}}>{fA(v)}</span>
                  </td>
                );})}
              </tr>
            </tfoot>
          </table>
        </div>

        <div style={{marginTop:8,textAlign:"center",fontSize:10,color:GM}}>
          Clique nos meses para abrir o calendário visual · ‹ › para navegar · Cabeçalho do mês para ordenar
        </div>
      </div>}
      {page==="summary"&&<SummaryPage fy={rows[0]?.fy||FYS[0]}/>}
    </div>
  );
}