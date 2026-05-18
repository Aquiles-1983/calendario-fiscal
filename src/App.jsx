import { useState, useMemo } from "react";

const SE = {
  red:"#E8002D", pink:"#E8002D",
  blue:"#0057A8", blueLt:"#0091DA", blueDk:"#003E7E",
  green:"#00A651", yellow:"#FFD100", orange:"#FF6600",
  gray:"#231F20", grayMd:"#58595B",
};

function pascoa(y) {
  const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,
    f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),
    h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,
    l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),
    mes=Math.floor((h+l-7*m+114)/31),dia=(h+l-7*m+114)%31+1;
  return new Date(y,mes-1,dia);
}

function calcMes(ano, mes) {
  const p = pascoa(ano);
  const addD = (d,n)=>{ const r=new Date(d); r.setDate(r.getDate()+n); return r; };
  const toK = d=>`${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

  const FERIADOS = {
    "01-01":"Confraternização Universal",
    "01-25":"Aniversário de São Paulo",
    [toK(addD(p,-48))]:"Segunda de Carnaval",
    [toK(addD(p,-47))]:"Terça de Carnaval",
    [toK(addD(p,-2))]:"Sexta-feira Santa",
    [toK(p)]:"Páscoa",
    "04-21":"Tiradentes",
    "05-01":"Dia do Trabalho",
    [toK(addD(p,60))]:"Corpus Christi",
    "09-07":"Independência do Brasil",
    "10-12":"N. Sra. Aparecida",
    "11-02":"Finados",
    "11-15":"Proclamação da República",
    "11-20":"Consciência Negra",
    "12-25":"Natal",
  };
  const isFer = k => !!FERIADOS[k];
  const qc = toK(addD(p,-46));

  const total = new Date(ano, mes, 0).getDate();
  const days = [];

  for (let dia=1; dia<=total; dia++) {
    const d = new Date(ano, mes-1, dia);
    const dow = d.getDay();
    const fds = dow===0||dow===6;
    const k = `${String(mes).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;

    let valor=1, tipo="util", label="";

    if (fds) {
      valor=0; tipo="fds";
    } else if (isFer(k)) {
      valor=0; tipo="feriado"; label=FERIADOS[k];
    } else if (mes===7 && dia===9) {
      valor=0.5; tipo="meio"; label="Rev. Constitucionalista";
    } else if (k===qc) {
      valor=0.5; tipo="meio"; label="Quarta-feira de Cinzas";
    } else {
      const dA=new Date(ano,mes-1,dia-1), dP=new Date(ano,mes-1,dia+1);
      const kA=toK(dA), kP=toK(dP);
      const ferQui=isFer(kA)&&dA.getDay()===4;
      const ferTer=isFer(kP)&&dP.getDay()===2;
      if (dow===5&&ferQui)      { valor=0.5;  tipo="emenda";  label=`Emenda (${FERIADOS[kA]})`; }
      else if (dow===1&&ferTer) { valor=0.5;  tipo="emenda";  label=`Emenda (${FERIADOS[kP]})`; }
      else if (mes===12) {
        if (dia===23)             { valor=0.5;  tipo="meio";   label="Pré-véspera de Natal"; }
        else if (dia===24)        { valor=0.5;  tipo="meio";   label="Véspera de Natal"; }
        else if (dia>=26&&dia<=30){ valor=0.25; tipo="quarto"; label="Recesso Natal/Ano Novo"; }
        else if (dia===31)        { valor=0.5;  tipo="meio";   label="Véspera de Ano Novo"; }
      }
    }
    days.push({dia, dow, fds, valor, tipo, label});
  }
  return days;
}

const DATA = [
  {fy:"FY27",afn:2026,Abr:19.5,Mai:20,Jun:20.5,Jul:22.5,Ago:21,Set:21,Out:21,Nov:19,Dez:18.25,Jan:19,Fev:17.5,Mar:22,T:241.25},
  {fy:"FY28",afn:2027,Abr:21,Mai:19.5,Jun:22,Jul:21.5,Ago:22,Set:20.5,Out:19.5,Nov:19.5,Dez:18.5,Jan:19.5,Fev:19,Mar:22.5,T:245.0},
  {fy:"FY29",afn:2028,Abr:18,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:19.5,Out:20.5,Nov:18.5,Dez:17.0,Jan:20.5,Fev:17.5,Mar:21,T:239.0},
  {fy:"FY30",afn:2029,Abr:20.5,Mai:21,Jun:20.5,Jul:21.5,Ago:23,Set:19,Out:22,Nov:18.0,Dez:16.75,Jan:21,Fev:20,Mar:18.5,T:241.75},
  {fy:"FY31",afn:2030,Abr:21,Mai:22,Jun:18.5,Jul:22.5,Ago:22,Set:21,Out:23,Nov:19,Dez:17.25,Jan:22,Fev:17.5,Mar:21,T:246.75},
  {fy:"FY32",afn:2031,Abr:20,Mai:20.5,Jun:19.5,Jul:22.5,Ago:21,Set:22,Out:23,Nov:18.5,Dez:18.5,Jan:20.5,Fev:17.5,Mar:22,T:245.5},
  {fy:"FY33",afn:2032,Abr:21,Mai:19.5,Jun:22,Jul:21.5,Ago:22,Set:20.5,Out:19.5,Nov:19.5,Dez:18.5,Jan:19.5,Fev:19,Mar:21.5,T:244.0},
  {fy:"FY34",afn:2033,Abr:18.5,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:21,Out:20,Nov:19.5,Dez:17.75,Jan:21,Fev:17.5,Mar:23,T:244.75},
  {fy:"FY35",afn:2034,Abr:18,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:19.5,Out:20.5,Nov:18.5,Dez:17.0,Jan:20.5,Fev:17.5,Mar:21,T:239.0},
  {fy:"FY36",afn:2035,Abr:20.5,Mai:20.5,Jun:21,Jul:21.5,Ago:23,Set:19,Out:22,Nov:18.0,Dez:16.75,Jan:21,Fev:18.5,Mar:21,T:242.75},
  {fy:"FY37",afn:2036,Abr:20,Mai:20.5,Jun:19.5,Jul:22.5,Ago:21,Set:22,Out:23,Nov:18.5,Dez:18.5,Jan:20.5,Fev:17.5,Mar:22,T:245.5},
  {fy:"FY38",afn:2037,Abr:19.5,Mai:20,Jun:20.5,Jul:22.5,Ago:21,Set:21,Out:21,Nov:19,Dez:18.25,Jan:19,Fev:20,Mar:20.5,T:242.25},
  {fy:"FY39",afn:2038,Abr:20,Mai:21,Jun:20.5,Jul:21.5,Ago:22,Set:20.5,Out:19.5,Nov:19.5,Dez:18.5,Jan:19.5,Fev:17.5,Mar:23,T:243.0},
  {fy:"FY40",afn:2039,Abr:18.5,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:21,Out:20,Nov:19.5,Dez:17.75,Jan:21,Fev:18.5,Mar:21,T:243.75},
  {fy:"FY41",afn:2040,Abr:20.5,Mai:21,Jun:20.5,Jul:21.5,Ago:23,Set:19,Out:22,Nov:18.0,Dez:16.75,Jan:21,Fev:20,Mar:18.5,T:241.75},
  {fy:"FY42",afn:2041,Abr:21,Mai:22,Jun:18.5,Jul:22.5,Ago:22,Set:21,Out:23,Nov:19,Dez:17.25,Jan:22,Fev:17.5,Mar:21,T:246.75},
  {fy:"FY43",afn:2042,Abr:20,Mai:20.5,Jun:19.5,Jul:22.5,Ago:21,Set:22,Out:23,Nov:18.5,Dez:18.5,Jan:20.5,Fev:17.5,Mar:21,T:244.5},
  {fy:"FY44",afn:2043,Abr:20.5,Mai:18.5,Jun:22,Jul:22.5,Ago:21,Set:21,Out:21,Nov:19,Dez:18.25,Jan:19,Fev:20,Mar:21.5,T:244.25},
  {fy:"FY45",afn:2044,Abr:18.5,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:21,Out:20,Nov:19.5,Dez:17.75,Jan:21,Fev:17.5,Mar:23,T:244.75},
  {fy:"FY46",afn:2045,Abr:18,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:19.5,Out:20.5,Nov:18.5,Dez:17.0,Jan:20.5,Fev:17.5,Mar:21,T:239.0},
  {fy:"FY47",afn:2046,Abr:20.5,Mai:20.5,Jun:21,Jul:21.5,Ago:23,Set:19,Out:22,Nov:18.0,Dez:16.75,Jan:21,Fev:17.5,Mar:21,T:241.75},
  {fy:"FY48",afn:2047,Abr:21,Mai:22,Jun:18.5,Jul:22.5,Ago:22,Set:21,Out:23,Nov:19,Dez:17.25,Jan:22,Fev:17.5,Mar:22,T:247.75},
  {fy:"FY49",afn:2048,Abr:19.5,Mai:20,Jun:20.5,Jul:22.5,Ago:21,Set:21,Out:21,Nov:19,Dez:18.25,Jan:19,Fev:20,Mar:20.5,T:242.25},
  {fy:"FY50",afn:2049,Abr:20,Mai:21,Jun:20.5,Jul:21.5,Ago:22,Set:20.5,Out:19.5,Nov:19.5,Dez:18.5,Jan:19.5,Fev:17.5,Mar:23,T:243.0},
  {fy:"FY51",afn:2050,Abr:18.5,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:21,Out:20,Nov:19.5,Dez:17.75,Jan:21,Fev:17.5,Mar:22,T:243.75},
  {fy:"FY52",afn:2051,Abr:19,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:19.5,Out:20.5,Nov:18.5,Dez:17.0,Jan:20.5,Fev:21,Mar:18.5,T:241.0},
  {fy:"FY53",afn:2052,Abr:21,Mai:22,Jun:18.5,Jul:22.5,Ago:22,Set:21,Out:23,Nov:19,Dez:17.25,Jan:22,Fev:17.5,Mar:21,T:246.75},
  {fy:"FY54",afn:2053,Abr:20,Mai:20.5,Jun:19.5,Jul:22.5,Ago:21,Set:22,Out:23,Nov:18.5,Dez:18.5,Jan:20.5,Fev:17.5,Mar:21,T:244.5},
  {fy:"FY55",afn:2054,Abr:20.5,Mai:18.5,Jun:22,Jul:22.5,Ago:21,Set:21,Out:21,Nov:19,Dez:18.25,Jan:19,Fev:20,Mar:20.5,T:243.25},
  {fy:"FY56",afn:2055,Abr:20,Mai:21,Jun:20.5,Jul:21.5,Ago:22,Set:20.5,Out:19.5,Nov:19.5,Dez:18.5,Jan:19.5,Fev:18.5,Mar:22,T:243.0},
];

const MESES    = ["Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez","Jan","Fev","Mar"];
const MES_NUM  = {Abr:4,Mai:5,Jun:6,Jul:7,Ago:8,Set:9,Out:10,Nov:11,Dez:12,Jan:1,Fev:2,Mar:3};
const MES_NOME = {1:"Janeiro",2:"Fevereiro",3:"Março",4:"Abril",5:"Maio",6:"Junho",
                  7:"Julho",8:"Agosto",9:"Setembro",10:"Outubro",11:"Novembro",12:"Dezembro"};
const DOW_NAMES = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const FYS = DATA.map(r=>r.fy);

const ALL_CELLS = DATA.flatMap(row=>
  MESES.map(m=>({fy:row.fy, afn:row.afn, mes:m, val:row[m]}))
);

const fmt = v => {
  if(Number.isInteger(v)) return String(v);
  return parseFloat(v.toFixed(2)).toString();
};
const avg = (arr,col) => arr.length ? arr.reduce((s,r)=>s+r[col],0)/arr.length : 0;

// ── Modal ──────────────────────────────────────────────────────────────────────
function Modal({initialIdx, onClose}){
  const [idx, setIdx] = useState(initialIdx);
  const cell = ALL_CELLS[idx];
  const {fy, afn, mes, val} = cell;
  const mn  = MES_NUM[mes];
  const ano = mn>=4 ? afn : afn+1;
  const days = useMemo(()=>calcMes(ano,mn),[ano,mn]);

  const firstDow = new Date(ano,mn-1,1).getDay();
  const cells = [...Array(firstDow).fill(null), ...days];
  while(cells.length%7!==0) cells.push(null);
  const rows=[];
  for(let i=0;i<cells.length;i+=7) rows.push(cells.slice(i,i+7));

  function cs(tipo,valor){
    if(tipo==="fds"||tipo==="feriado") return {bg:SE.pink,   text:"#fff"};
    if(valor===1)                       return {bg:SE.blue,   text:"#fff"};
    if(valor===0.75)                    return {bg:SE.blueLt, text:"#fff"};
    if(valor===0.5)                     return {bg:SE.orange, text:"#fff"};
    if(valor===0.25)                    return {bg:SE.yellow, text:SE.gray};
    return {bg:"#E0E0E0", text:"#666"};
  }

  const canPrev = idx>0;
  const canNext = idx<ALL_CELLS.length-1;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:100,
      display:"flex",alignItems:"center",justifyContent:"center",padding:12}}
      onClick={onClose}>
      <div style={{background:"#F4F6FA",borderRadius:16,overflow:"hidden",
        maxWidth:460,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,0.22)",
        maxHeight:"95vh",display:"flex",flexDirection:"column"}}
        onClick={e=>e.stopPropagation()}>

        {/* Header com navegação */}
        <div style={{background:SE.blue,padding:"14px 16px",flexShrink:0,
          display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setIdx(i=>i-1)} disabled={!canPrev}
            style={{background:canPrev?"rgba(255,255,255,0.18)":"rgba(255,255,255,0.07)",
              border:"none",color:"#fff",width:34,height:34,borderRadius:8,
              cursor:canPrev?"pointer":"default",fontSize:20,display:"flex",
              alignItems:"center",justifyContent:"center",
              opacity:canPrev?1:0.3,flexShrink:0}}>‹</button>

          <div style={{flex:1,textAlign:"center"}}>
            <div style={{color:"#fff",fontWeight:700,fontSize:17,lineHeight:1.2}}>
              {MES_NOME[mn]} {ano}
            </div>
            <div style={{color:"rgba(255,255,255,0.6)",fontSize:11,marginTop:2}}>
              {fy} · {fmt(val)} dias úteis
            </div>
          </div>

          <button onClick={()=>setIdx(i=>i+1)} disabled={!canNext}
            style={{background:canNext?"rgba(255,255,255,0.18)":"rgba(255,255,255,0.07)",
              border:"none",color:"#fff",width:34,height:34,borderRadius:8,
              cursor:canNext?"pointer":"default",fontSize:20,display:"flex",
              alignItems:"center",justifyContent:"center",
              opacity:canNext?1:0.3,flexShrink:0}}>›</button>

          <button onClick={onClose}
            style={{background:"rgba(255,255,255,0.18)",border:"none",color:"#fff",
              width:34,height:34,borderRadius:8,cursor:"pointer",fontSize:18,
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
        </div>

        {/* Dias da semana */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",
          gap:3,padding:"10px 10px 4px",background:"#F4F6FA",flexShrink:0}}>
          {DOW_NAMES.map(d=>(
            <div key={d} style={{textAlign:"center",fontSize:11,fontWeight:700,
              color:d==="Dom"||d==="Sáb"?SE.pink:SE.blue,padding:"3px 0"}}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{overflowY:"auto",padding:"3px 10px 14px",flex:1}}>
          {rows.map((row,ri)=>(
            <div key={ri} style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",
              gap:3,marginBottom:3}}>
              {row.map((cell,ci)=>{
                if(!cell) return <div key={ci}/>;
                const {bg,text}=cs(cell.tipo,cell.valor);
                return(
                  <div key={ci} style={{background:"#fff",borderRadius:9,
                    padding:"5px 3px",display:"flex",flexDirection:"column",
                    alignItems:"center",gap:3,
                    boxShadow:"0 1px 3px rgba(0,0,0,0.07)"}}>
                    <span style={{fontSize:12,fontWeight:500,color:SE.gray}}>
                      {cell.dia}
                    </span>
                    <div style={{background:bg,borderRadius:6,width:"100%",
                      padding:"3px 2px",display:"flex",
                      alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:10,fontWeight:800,color:text}}>
                        {fmt(cell.valor)}
                      </span>
                    </div>
                    {cell.label&&(
                      <span style={{fontSize:7,color:SE.grayMd,textAlign:"center",
                        lineHeight:1.2,wordBreak:"break-word"}}>
                        {cell.label.split(" ").slice(0,2).join(" ")}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legenda */}
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10,
            padding:"8px",background:"#fff",borderRadius:10}}>
            {[
              {c:SE.blue,   l:"1,0 — Dia útil"},
              {c:SE.orange, l:"0,5 — Emenda/Véspera"},
              {c:SE.yellow, l:"0,25 — Recesso Natal/ANV"},
              {c:SE.pink,   l:"0,0 — Feriado/FDS"},
            ].map(s=>(
              <div key={s.l} style={{display:"flex",alignItems:"center",
                gap:5,fontSize:9.5,color:SE.grayMd}}>
                <div style={{width:11,height:11,borderRadius:3,
                  background:s.c,flexShrink:0}}/>
                {s.l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App(){
  const [sortRow,setSortRow]   = useState(null);
  const [sortDir,setSortDir]   = useState(1);
  const [hoverCol,setHoverCol] = useState(null);
  const [hoverRow,setHoverRow] = useState(null);
  const [fyFiltro,setFyFiltro] = useState("Todos");
  const [busca,setBusca]       = useState("");
  const [modalIdx,setModalIdx] = useState(null);

  const colsFY = useMemo(()=>
    fyFiltro==="Todos" ? DATA : DATA.filter(r=>r.fy===fyFiltro),
    [fyFiltro]);

  const rowsMes = useMemo(()=>{
    if(!busca.trim()) return MESES;
    const q=busca.trim().toLowerCase();
    return MESES.filter(m=>
      m.toLowerCase().includes(q)||
      colsFY.some(r=>String(r[m]).includes(q))
    );
  },[busca,colsFY]);

  const sortedCols = useMemo(()=>{
    if(!sortRow) return colsFY;
    return [...colsFY].sort((a,b)=>(a[sortRow]-b[sortRow])*sortDir);
  },[colsFY,sortRow,sortDir]);

  const handleSortRow = mes=>{
    if(sortRow===mes) setSortDir(d=>-d);
    else{ setSortRow(mes); setSortDir(1); }
  };

  const avgMes = mes => colsFY.length
    ? colsFY.reduce((s,r)=>s+r[mes],0)/colsFY.length : 0;

  return(
    <div style={{minHeight:"100vh",background:"#F0F4FA",
      fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#F0F4FA}
        ::-webkit-scrollbar-thumb{background:${SE.blue};border-radius:3px}
        .pip{cursor:pointer;transition:opacity .15s,transform .15s}
        .pip:hover{opacity:.78;transform:scale(1.06)}
        .th-s{cursor:pointer;user-select:none;transition:background .15s}
        .th-s:hover{background:${SE.blueDk}!important}
        select:focus,input:focus{outline:2px solid ${SE.blueLt}}
        tr.row:hover td{background:#EBF2FF!important}
      `}</style>

      {modalIdx!==null&&(
        <Modal initialIdx={modalIdx} onClose={()=>setModalIdx(null)}/>
      )}

      {/* HEADER */}
      <div style={{background:SE.blue,padding:"18px 28px",
        boxShadow:"0 4px 16px rgba(0,0,0,0.18)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:4,height:32,background:SE.red,borderRadius:2}}/>
          <h1 style={{color:"#fff",fontSize:"clamp(16px,2.5vw,24px)",
            fontWeight:700,letterSpacing:"-0.01em"}}>
            Calendário Fiscal - PME
          </h1>
        </div>
      </div>

      {/* FILTROS */}
      <div style={{background:"#fff",borderBottom:"2px solid #E0E8F5",
        padding:"12px 28px",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start",flexWrap:"wrap"}}>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <label style={{fontSize:10,fontWeight:700,color:SE.grayMd,
              letterSpacing:"0.1em",textTransform:"uppercase"}}>Ano Fiscal</label>
            <select value={fyFiltro}
              onChange={e=>{setFyFiltro(e.target.value);setBusca("");}}
              style={{background:"#F0F4FA",border:`1px solid ${SE.blue}55`,borderRadius:7,
                padding:"7px 34px 7px 12px",color:SE.gray,fontSize:12,fontFamily:"inherit",
                appearance:"none",cursor:"pointer",minWidth:130,
                backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2358595B' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center"}}>
              <option value="Todos">Todos</option>
              {FYS.map(f=><option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:4,flex:1,minWidth:200}}>
            <label style={{fontSize:10,fontWeight:700,color:SE.grayMd,
              letterSpacing:"0.1em",textTransform:"uppercase"}}>Busca Dinâmica</label>
            <div style={{position:"relative"}}>
              <input value={busca} onChange={e=>setBusca(e.target.value)}
                placeholder="Busque por mês ou valor..."
                style={{background:"#F0F4FA",border:`1px solid ${SE.blue}55`,borderRadius:7,
                  padding:"7px 34px 7px 34px",color:SE.gray,fontSize:12,
                  fontFamily:"inherit",width:"100%"}}/>
              <span style={{position:"absolute",left:10,top:"50%",
                transform:"translateY(-50%)",color:SE.grayMd,fontSize:14,
                pointerEvents:"none"}}>🔍</span>
              {busca&&(
                <button onClick={()=>setBusca("")}
                  style={{position:"absolute",right:8,top:"50%",
                    transform:"translateY(-50%)",background:"none",border:"none",
                    color:SE.grayMd,cursor:"pointer",fontSize:16,padding:2}}>✕</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABELA: linhas = meses, colunas = FY */}
      <div style={{padding:"18px 28px 36px"}}>
        <div style={{overflowX:"auto",borderRadius:10,
          boxShadow:"0 4px 20px rgba(0,0,0,0.08)",border:"1px solid #D8E4F0"}}>
          <table style={{width:"100%",borderCollapse:"collapse",
            fontSize:12.5,fontFamily:"inherit",background:"#fff"}}>
            <thead>
              <tr style={{background:SE.blue}}>
                <th style={{padding:"11px 16px",textAlign:"left",color:"#fff",
                  fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:700,
                  position:"sticky",left:0,background:SE.blue,zIndex:3,minWidth:64,
                  borderRight:"2px solid rgba(255,255,255,0.15)"}}>Mês</th>
                {sortedCols.map(r=>(
                  <th key={r.fy}
                    onMouseEnter={()=>setHoverCol(r.fy)}
                    onMouseLeave={()=>setHoverCol(null)}
                    style={{padding:"11px 6px",textAlign:"center",minWidth:58,
                      color:hoverCol===r.fy?SE.yellow:"#fff",fontSize:11,
                      letterSpacing:"0.06em",fontWeight:700,
                      background:hoverCol===r.fy?SE.blueDk:SE.blue,
                      transition:"background .15s"}}>
                    {r.fy}
                  </th>
                ))}
                <th style={{padding:"11px 10px",textAlign:"center",minWidth:60,
                  color:"#fff",fontSize:10,letterSpacing:"0.08em",
                  textTransform:"uppercase",fontWeight:700,background:SE.blue,
                  borderLeft:"2px solid rgba(255,255,255,0.15)"}}>Média</th>
              </tr>
            </thead>

            <tbody>
              {rowsMes.map((mes,ri)=>{
                const isHR  = hoverRow===mes;
                const isSrt = sortRow===mes;
                return(
                  <tr key={mes} className="row"
                    onMouseEnter={()=>setHoverRow(mes)}
                    onMouseLeave={()=>setHoverRow(null)}
                    style={{background:ri%2===0?"#fff":"#F7FAFF",
                      borderBottom:"1px solid #E8EEF8"}}>

                    <td className="th-s" onClick={()=>handleSortRow(mes)}
                      style={{padding:"8px 12px",fontWeight:700,
                        color:isSrt||isHR?SE.blue:SE.gray,fontSize:13,
                        position:"sticky",left:0,zIndex:1,
                        background:isHR?"#EBF2FF":ri%2===0?"#fff":"#F7FAFF",
                        borderRight:"2px solid #E0E8F5",whiteSpace:"nowrap",
                        cursor:"pointer",userSelect:"none",transition:"color .15s"}}>
                      {mes}
                      {isSrt&&<span style={{marginLeft:4,fontSize:10,color:SE.grayMd}}>
                        {sortDir===1?"↑":"↓"}
                      </span>}
                    </td>

                    {sortedCols.map(r=>{
                      const v=r[mes];
                      const cellIdx=ALL_CELLS.findIndex(c=>c.fy===r.fy&&c.mes===mes);
                      const isColHL=hoverCol===r.fy;
                      return(
                        <td key={r.fy} style={{padding:"6px 4px",textAlign:"center",
                          background:isColHL?"#EBF2FF":"transparent"}}>
                          <div className="pip"
                            onClick={()=>setModalIdx(cellIdx)}
                            title="Ver calendário"
                            style={{display:"inline-flex",alignItems:"center",
                              justifyContent:"center",width:42,height:26,
                              borderRadius:5,background:"transparent",
                              color:SE.gray,fontWeight:500,fontSize:12.5,
                              border:"1px solid #D8E4F0"}}>
                            {fmt(v)}
                          </div>
                        </td>
                      );
                    })}

                    <td style={{padding:"6px 8px",textAlign:"center",
                      borderLeft:"2px solid #E0E8F5"}}>
                      <div style={{display:"inline-flex",alignItems:"center",
                        justifyContent:"center",width:46,height:26,
                        borderRadius:5,background:"transparent",
                        color:SE.grayMd,fontWeight:600,fontSize:12,
                        border:"1px solid #D8E4F0"}}>
                        {avgMes(mes).toFixed(1)}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Linha Total */}
              <tr style={{background:SE.blue,borderTop:`3px solid ${SE.blueDk}`}}>
                <td style={{padding:"9px 12px",color:"#fff",fontSize:10,fontWeight:700,
                  letterSpacing:"0.1em",textTransform:"uppercase",
                  position:"sticky",left:0,background:SE.blue,zIndex:1,
                  borderRight:"2px solid rgba(255,255,255,0.15)"}}>Total</td>
                {sortedCols.map(r=>(
                  <td key={r.fy} style={{padding:"9px 4px",textAlign:"center"}}>
                    <span style={{color:"#fff",fontSize:12,fontWeight:700}}>
                      {fmt(r.T)}
                    </span>
                  </td>
                ))}
                <td style={{padding:"9px 8px",textAlign:"center",
                  borderLeft:"2px solid rgba(255,255,255,0.15)"}}>
                  <span style={{color:"#fff",fontSize:12,fontWeight:700}}>
                    {avg(colsFY,"T").toFixed(2)}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{marginTop:10,textAlign:"center",fontSize:11,color:SE.grayMd}}>
          Clique em qualquer célula para abrir o calendário · Use ‹ › para navegar entre meses · Clique no mês para ordenar
        </div>
      </div>
    </div>
  );
}