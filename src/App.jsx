import { useState, useMemo } from "react";
 
const SE = {
  red:"#E8002D", pink:"#E8002D",
  blue:"#0057A8", blueLt:"#0091DA", blueDk:"#003E7E",
  green:"#00A651", yellow:"#FFD100", orange:"#FF6600",
  gray:"#231F20", grayMd:"#58595B",
};
 
// ── Páscoa ────────────────────────────────────────────────────────────────────
function pascoa(y) {
  const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,
    f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),
    h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,
    l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),
    mes=Math.floor((h+l-7*m+114)/31),dia=(h+l-7*m+114)%31+1;
  return new Date(y,mes-1,dia);
}
 
// ── Calcula valor de cada dia do mês ─────────────────────────────────────────
function calcMes(ano, mes) {
  const p = pascoa(ano);
  const addD = (d,n)=>{ const r=new Date(d); r.setDate(r.getDate()+n); return r; };
  const toK = d=>`${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
 
  const FERIADOS = {
    "01-01":"Confraternização Universal","01-25":"Aniversário de São Paulo",
    [toK(addD(p,-2))]:"Sexta-feira Santa",
    [toK(p)]:"Páscoa",
    "04-21":"Tiradentes","05-01":"Dia do Trabalho",
    [toK(addD(p,60))]:"Corpus Christi",
    "09-07":"Independência do Brasil","10-12":"N. Sra. Aparecida",
    "11-02":"Finados","11-15":"Proclamação da República",
    "11-20":"Consciência Negra","12-25":"Natal",
  };
  const isFer = k => !!FERIADOS[k];
  const qc = toK(addD(p,-46)); // Quarta de Cinzas
 
  const total = new Date(ano, mes, 0).getDate();
  const days = [];
 
  for (let dia=1; dia<=total; dia++) {
    const d = new Date(ano, mes-1, dia);
    const dow = d.getDay(); // 0=Dom,6=Sab
    const fds = dow===0||dow===6;
    const k = `${String(mes).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;
 
    let valor = 1;
    let tipo = "util"; // util | fds | feriado | emenda | meio | recesso
    let label = "";
 
    if (fds) {
      valor=0; tipo="fds";
    } else if (isFer(k)) {
      valor=0; tipo="feriado"; label=FERIADOS[k];
    } else if (mes===7&&dia===9) {
      valor=0.5; tipo="meio"; label="Rev. Constitucionalista";
    } else if (k===qc) {
      valor=0.5; tipo="meio"; label="Quarta-feira de Cinzas";
    } else {
      // emendas
      const dA=new Date(ano,mes-1,dia-1), dP=new Date(ano,mes-1,dia+1);
      const kA=toK(dA), kP=toK(dP);
      const ferQui=isFer(kA)&&dA.getDay()===4;
      const ferTer=isFer(kP)&&dP.getDay()===2;
      if (dow===5&&ferQui) { valor=0.5; tipo="emenda"; label=`Emenda (${FERIADOS[kA]})`; }
      else if (dow===1&&ferTer) { valor=0.5; tipo="emenda"; label=`Emenda (${FERIADOS[kP]})`; }
      else if (mes===12) {
        if (dia===23) { valor=0.5; tipo="meio"; label="Pré-véspera de Natal"; }
        else if (dia===24) { valor=0.5; tipo="meio"; label="Véspera de Natal"; }
        else if (dia>=26&&dia<=29) { valor=0.75; tipo="recesso"; label="Recesso Natal/Ano Novo"; }
        else if (dia===30) { valor=0.5; tipo="meio"; label="Pré-véspera de Ano Novo"; }
        else if (dia===31) { valor=0.5; tipo="meio"; label="Véspera de Ano Novo"; }
      }
    }
 
    days.push({dia, dow, fds, valor, tipo, label, k});
  }
  return days;
}
 
// ── Dados ─────────────────────────────────────────────────────────────────────
const DATA = [
  {fy:"FY27",afn:2026,Abr:19.5,Mai:20,Jun:20.5,Jul:22.5,Ago:21,Set:21,Out:21,Nov:19,Dez:19.5,Jan:19,Fev:19.5,Mar:22,T:244.5},
  {fy:"FY28",afn:2027,Abr:21,Mai:19.5,Jun:22,Jul:21.5,Ago:22,Set:20.5,Out:19.5,Nov:19.5,Dez:20.25,Jan:19.5,Fev:21,Mar:22.5,T:248.75},
  {fy:"FY29",afn:2028,Abr:18,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:19.5,Out:20.5,Nov:18.5,Dez:19.0,Jan:20.5,Fev:19.5,Mar:21,T:243.0},
  {fy:"FY30",afn:2029,Abr:20.5,Mai:21,Jun:20.5,Jul:21.5,Ago:23,Set:19,Out:22,Nov:18.0,Dez:18.25,Jan:21,Fev:20,Mar:20.5,T:245.25},
  {fy:"FY31",afn:2030,Abr:21,Mai:22,Jun:18.5,Jul:22.5,Ago:22,Set:21,Out:23,Nov:19,Dez:18.5,Jan:22,Fev:19.5,Mar:21,T:250.0},
  {fy:"FY32",afn:2031,Abr:20,Mai:20.5,Jun:19.5,Jul:22.5,Ago:21,Set:22,Out:23,Nov:18.5,Dez:19.25,Jan:20.5,Fev:19.5,Mar:22,T:248.25},
  {fy:"FY33",afn:2032,Abr:21,Mai:19.5,Jun:22,Jul:21.5,Ago:22,Set:20.5,Out:19.5,Nov:19.5,Dez:20.25,Jan:19.5,Fev:20,Mar:22.5,T:247.75},
  {fy:"FY34",afn:2033,Abr:18.5,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:21,Out:20,Nov:19.5,Dez:20.0,Jan:21,Fev:19.5,Mar:23,T:249.0},
  {fy:"FY35",afn:2034,Abr:18,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:19.5,Out:20.5,Nov:18.5,Dez:19.0,Jan:20.5,Fev:19.5,Mar:21,T:243.0},
  {fy:"FY36",afn:2035,Abr:20.5,Mai:20.5,Jun:21,Jul:21.5,Ago:23,Set:19,Out:22,Nov:18.0,Dez:18.25,Jan:21,Fev:20.5,Mar:21,T:246.25},
  {fy:"FY37",afn:2036,Abr:20,Mai:20.5,Jun:19.5,Jul:22.5,Ago:21,Set:22,Out:23,Nov:18.5,Dez:19.25,Jan:20.5,Fev:19.5,Mar:22,T:248.25},
  {fy:"FY38",afn:2037,Abr:19.5,Mai:20,Jun:20.5,Jul:22.5,Ago:21,Set:21,Out:21,Nov:19,Dez:19.5,Jan:19,Fev:20,Mar:22.5,T:245.5},
  {fy:"FY39",afn:2038,Abr:20,Mai:21,Jun:20.5,Jul:21.5,Ago:22,Set:20.5,Out:19.5,Nov:19.5,Dez:20.25,Jan:19.5,Fev:19.5,Mar:23,T:246.75},
  {fy:"FY40",afn:2039,Abr:18.5,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:21,Out:20,Nov:19.5,Dez:20.0,Jan:21,Fev:20.5,Mar:21,T:248.0},
  {fy:"FY41",afn:2040,Abr:20.5,Mai:21,Jun:20.5,Jul:21.5,Ago:23,Set:19,Out:22,Nov:18.0,Dez:18.25,Jan:21,Fev:20,Mar:20.5,T:245.25},
  {fy:"FY42",afn:2041,Abr:21,Mai:22,Jun:18.5,Jul:22.5,Ago:22,Set:21,Out:23,Nov:19,Dez:18.5,Jan:22,Fev:19.5,Mar:21,T:250.0},
  {fy:"FY43",afn:2042,Abr:20,Mai:20.5,Jun:19.5,Jul:22.5,Ago:21,Set:22,Out:23,Nov:18.5,Dez:19.25,Jan:20.5,Fev:19.5,Mar:21,T:247.25},
  {fy:"FY44",afn:2043,Abr:20.5,Mai:18.5,Jun:22,Jul:22.5,Ago:21,Set:21,Out:21,Nov:19,Dez:19.5,Jan:19,Fev:21,Mar:22.5,T:247.5},
  {fy:"FY45",afn:2044,Abr:18.5,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:21,Out:20,Nov:19.5,Dez:20.0,Jan:21,Fev:19.5,Mar:23,T:249.0},
  {fy:"FY46",afn:2045,Abr:18,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:19.5,Out:20.5,Nov:18.5,Dez:19.0,Jan:20.5,Fev:19.5,Mar:21,T:243.0},
  {fy:"FY47",afn:2046,Abr:20.5,Mai:20.5,Jun:21,Jul:21.5,Ago:23,Set:19,Out:22,Nov:18.0,Dez:18.25,Jan:21,Fev:19.5,Mar:21,T:245.25},
  {fy:"FY48",afn:2047,Abr:21,Mai:22,Jun:18.5,Jul:22.5,Ago:22,Set:21,Out:23,Nov:19,Dez:18.5,Jan:22,Fev:19.5,Mar:22,T:251.0},
  {fy:"FY49",afn:2048,Abr:19.5,Mai:20,Jun:20.5,Jul:22.5,Ago:21,Set:21,Out:21,Nov:19,Dez:19.5,Jan:19,Fev:20,Mar:22.5,T:245.5},
  {fy:"FY50",afn:2049,Abr:20,Mai:21,Jun:20.5,Jul:21.5,Ago:22,Set:20.5,Out:19.5,Nov:19.5,Dez:20.25,Jan:19.5,Fev:19.5,Mar:23,T:246.75},
  {fy:"FY51",afn:2050,Abr:18.5,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:21,Out:20,Nov:19.5,Dez:20.0,Jan:21,Fev:19.5,Mar:22,T:248.0},
  {fy:"FY52",afn:2051,Abr:19,Mai:22,Jun:20.5,Jul:21,Ago:23,Set:19.5,Out:20.5,Nov:18.5,Dez:19.0,Jan:20.5,Fev:21,Mar:20.5,T:245.0},
  {fy:"FY53",afn:2052,Abr:21,Mai:22,Jun:18.5,Jul:22.5,Ago:22,Set:21,Out:23,Nov:19,Dez:18.5,Jan:22,Fev:19.5,Mar:21,T:250.0},
  {fy:"FY54",afn:2053,Abr:20,Mai:20.5,Jun:19.5,Jul:22.5,Ago:21,Set:22,Out:23,Nov:18.5,Dez:19.25,Jan:20.5,Fev:19.5,Mar:21,T:247.25},
  {fy:"FY55",afn:2054,Abr:20.5,Mai:18.5,Jun:22,Jul:22.5,Ago:21,Set:21,Out:21,Nov:19,Dez:19.5,Jan:19,Fev:20,Mar:22.5,T:246.5},
  {fy:"FY56",afn:2055,Abr:20,Mai:21,Jun:20.5,Jul:21.5,Ago:22,Set:20.5,Out:19.5,Nov:19.5,Dez:20.25,Jan:19.5,Fev:20.5,Mar:22,T:246.75},
];
 
const MESES    = ["Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez","Jan","Fev","Mar"];
const MES_NUM  = {Abr:4,Mai:5,Jun:6,Jul:7,Ago:8,Set:9,Out:10,Nov:11,Dez:12,Jan:1,Fev:2,Mar:3};
const MES_NOME = {1:"Janeiro",2:"Fevereiro",3:"Março",4:"Abril",5:"Maio",6:"Junho",
                  7:"Julho",8:"Agosto",9:"Setembro",10:"Outubro",11:"Novembro",12:"Dezembro"};
const DOW_NAMES = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
 
const fmt = v => Number.isInteger(v)?String(v):parseFloat(v.toFixed(2)).toString();
const avg = (arr,col) => arr.length?arr.reduce((s,r)=>s+r[col],0)/arr.length:0;
 
// ── Modal: calendário visual ──────────────────────────────────────────────────
function Modal({fy,afn,mes,val,onClose}){
  const mn  = MES_NUM[mes];
  const ano = mn>=4?afn:afn+1;
  const days = useMemo(()=>calcMes(ano,mn),[ano,mn]);
 
  // dia da semana do primeiro dia (0=Dom)
  const firstDow = new Date(ano,mn-1,1).getDay();
  // células do grid: blanks + days
  const cells = [...Array(firstDow).fill(null), ...days];
  // padeia ao múltiplo de 7
  while(cells.length%7!==0) cells.push(null);
 
  function cellColor(tipo,valor){
    if(tipo==="fds"||tipo==="feriado") return {bg:SE.pink,text:"#fff"};
    if(valor===1)    return {bg:SE.blue, text:"#fff"};
    if(valor===0.75) return {bg:SE.blueLt,text:"#fff"};
    if(valor===0.5)  return {bg:SE.orange,text:"#fff"};
    return {bg:"#E0E0E0",text:"#666"};
  }
 
  const rows = [];
  for(let i=0;i<cells.length;i+=7) rows.push(cells.slice(i,i+7));
 
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:100,
      display:"flex",alignItems:"center",justifyContent:"center",padding:12}}
      onClick={onClose}>
      <div style={{background:"#F4F6FA",borderRadius:16,overflow:"hidden",
        maxWidth:480,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,0.22)",
        maxHeight:"95vh",display:"flex",flexDirection:"column"}}
        onClick={e=>e.stopPropagation()}>
 
        {/* Header */}
        <div style={{background:SE.blue,padding:"16px 20px",flexShrink:0,
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{color:"#fff",fontWeight:700,fontSize:18}}>
              {MES_NOME[mn]} {ano}
            </div>
            <div style={{color:"rgba(255,255,255,0.65)",fontSize:11,marginTop:2}}>
              {fy} · {fmt(val)} dias úteis
            </div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.18)",border:"none",
            color:"#fff",width:34,height:34,borderRadius:8,cursor:"pointer",
            fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
 
        {/* Cabeçalho dias da semana */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",
          gap:4,padding:"12px 12px 4px",background:"#F4F6FA",flexShrink:0}}>
          {DOW_NAMES.map(d=>(
            <div key={d} style={{textAlign:"center",fontSize:12,fontWeight:700,
              color:d==="Dom"||d==="Sáb"?SE.pink:SE.blue,padding:"4px 0"}}>
              {d}
            </div>
          ))}
        </div>
 
        {/* Grid de dias */}
        <div style={{overflowY:"auto",padding:"4px 12px 16px",flex:1}}>
          {rows.map((row,ri)=>(
            <div key={ri} style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:4}}>
              {row.map((cell,ci)=>{
                if(!cell) return <div key={ci}/>;
                const {bg,text} = cellColor(cell.tipo,cell.valor);
                const showVal = fmt(cell.valor);
                return(
                  <div key={ci} style={{background:"#fff",borderRadius:10,
                    padding:"6px 4px",display:"flex",flexDirection:"column",
                    alignItems:"center",gap:4,
                    boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
                    <span style={{fontSize:13,fontWeight:500,color:SE.gray}}>
                      {cell.dia}
                    </span>
                    <div style={{background:bg,borderRadius:7,
                      minWidth:36,padding:"4px 6px",
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:11,fontWeight:800,color:text}}>{showVal}</span>
                    </div>
                    {cell.label&&(
                      <span style={{fontSize:8,color:SE.grayMd,textAlign:"center",
                        lineHeight:1.2,maxWidth:48,wordBreak:"break-word"}}>
                        {cell.label.split(" ").slice(0,2).join(" ")}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
 
          {/* Legenda */}
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:12,
            padding:"10px 8px",background:"#fff",borderRadius:10}}>
            {[
              {c:SE.blue,  l:"1,0 — Dia útil"},
              {c:SE.orange,l:"0,5 — Emenda/Véspera"},
              {c:SE.blueLt,l:"0,75 — Recesso"},
              {c:SE.pink,  l:"0,0 — Feriado/FDS"},
            ].map(s=>(
              <div key={s.l} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:SE.grayMd}}>
                <div style={{width:12,height:12,borderRadius:3,background:s.c}}/>
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
  const [sortCol,setSortCol] = useState(null);
  const [sortDir,setSortDir] = useState(1);
  const [hoverRow,setHoverRow] = useState(null);
  const [hoverCol,setHoverCol] = useState(null);
  const [fyFiltro,setFyFiltro] = useState("Todos");
  const [busca,setBusca] = useState("");
  const [modal,setModal] = useState(null);
 
  const filtered = useMemo(()=>{
    let base = fyFiltro==="Todos" ? DATA : DATA.filter(r=>r.fy===fyFiltro);
    if(busca.trim()){
      const q=busca.trim().toLowerCase();
      base=base.filter(r=>
        r.fy.toLowerCase().includes(q)||
        MESES.some(m=>String(r[m]).includes(q))||
        String(r.T).includes(q)
      );
    }
    return base;
  },[fyFiltro,busca]);
 
  const sorted = useMemo(()=>
    sortCol?[...filtered].sort((a,b)=>(a[sortCol]-b[sortCol])*sortDir):filtered,
    [filtered,sortCol,sortDir]);
 
  const handleSort = col=>{
    if(sortCol===col) setSortDir(d=>-d);
    else{ setSortCol(col); setSortDir(1); }
  };
 
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
        .pip:hover{opacity:.78;transform:scale(1.05)}
        .th-s{cursor:pointer;user-select:none;transition:background .15s}
        .th-s:hover{background:${SE.blueDk}!important}
        select:focus,input:focus{outline:2px solid ${SE.blueLt}}
        tr.row:hover td{background:#EBF2FF!important}
      `}</style>
 
      {modal&&(
        <Modal fy={modal.fy} afn={modal.afn} mes={modal.mes}
          val={modal.val} onClose={()=>setModal(null)}/>
      )}
 
      {/* HEADER */}
      <div style={{background:SE.blue,padding:"18px 28px",
        boxShadow:"0 4px 16px rgba(0,0,0,0.18)"}}>
        <div style={{maxWidth:1440,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:4,height:32,background:SE.red,borderRadius:2}}/>
            <h1 style={{color:"#fff",fontSize:"clamp(16px,2.5vw,24px)",
              fontWeight:700,letterSpacing:"-0.01em"}}>
              Calendário Fiscal - PME
            </h1>
          </div>
        </div>
      </div>
 
      {/* FILTROS */}
      <div style={{background:"#fff",borderBottom:"2px solid #E0E8F5",
        padding:"14px 28px",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>
        <div style={{maxWidth:1440,margin:"0 auto",display:"flex",
          gap:12,alignItems:"flex-start",flexWrap:"wrap"}}>
 
          {/* Filtro por FY */}
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
              {DATA.map(r=>(
                <option key={r.fy} value={r.fy}>{r.fy}</option>
              ))}
            </select>
          </div>
 
          {/* Busca dinâmica */}
          <div style={{display:"flex",flexDirection:"column",gap:4,flex:1,minWidth:200}}>
            <label style={{fontSize:10,fontWeight:700,color:SE.grayMd,
              letterSpacing:"0.1em",textTransform:"uppercase"}}>Busca Dinâmica</label>
            <div style={{position:"relative"}}>
              <input value={busca} onChange={e=>setBusca(e.target.value)}
                placeholder="Busque por FY, mês ou valor..."
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
            {busca&&(
              <div style={{fontSize:10,color:SE.grayMd}}>
                {sorted.length} resultado{sorted.length!==1?"s":""} encontrado{sorted.length!==1?"s":""}
              </div>
            )}
          </div>
        </div>
      </div>
 
      {/* TABELA */}
      <div style={{maxWidth:1440,margin:"0 auto",padding:"18px 28px 36px"}}>
        {sorted.length===0?(
          <div style={{textAlign:"center",padding:"48px 0",color:SE.grayMd,fontSize:14}}>
            Nenhum resultado encontrado.
          </div>
        ):(
          <div style={{overflowX:"auto",borderRadius:10,
            boxShadow:"0 4px 20px rgba(0,0,0,0.08)",border:"1px solid #D8E4F0"}}>
            <table style={{width:"100%",borderCollapse:"collapse",
              fontSize:12.5,fontFamily:"inherit",background:"#fff"}}>
              <thead>
                <tr style={{background:SE.blue}}>
                  <th style={{padding:"11px 16px",textAlign:"left",color:"#fff",
                    fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:700,
                    position:"sticky",left:0,background:SE.blue,zIndex:3,minWidth:80,
                    borderRight:"2px solid rgba(255,255,255,0.15)"}}>FY</th>
                  {MESES.map(m=>(
                    <th key={m} className="th-s" onClick={()=>handleSort(m)}
                      onMouseEnter={()=>setHoverCol(m)}
                      onMouseLeave={()=>setHoverCol(null)}
                      style={{padding:"11px 4px",textAlign:"center",minWidth:50,
                        color:sortCol===m?SE.yellow:"#fff",fontSize:10,
                        letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:700,
                        background:sortCol===m?SE.blueDk:SE.blue}}>
                      {m}{sortCol===m?(sortDir===1?" ↑":" ↓"):""}
                    </th>
                  ))}
                  <th className="th-s" onClick={()=>handleSort("T")}
                    style={{padding:"11px 12px",textAlign:"center",minWidth:64,
                      color:sortCol==="T"?SE.yellow:"#fff",fontSize:10,
                      letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:700,
                      background:sortCol==="T"?SE.blueDk:SE.blue,
                      borderLeft:"2px solid rgba(255,255,255,0.15)"}}>
                    Total{sortCol==="T"?(sortDir===1?" ↑":" ↓"):""}
                  </th>
                </tr>
              </thead>
 
              <tbody>
                {sorted.map((row,ri)=>{
                  const isHR=hoverRow===row.fy;
                  return(
                    <tr key={row.fy} className="row"
                      onMouseEnter={()=>setHoverRow(row.fy)}
                      onMouseLeave={()=>setHoverRow(null)}
                      style={{background:ri%2===0?"#fff":"#F7FAFF",
                        borderBottom:"1px solid #E8EEF8"}}>
                      <td style={{padding:"8px 16px",fontWeight:700,
                        color:isHR?SE.blue:SE.gray,fontSize:13,
                        position:"sticky",left:0,zIndex:1,
                        background:isHR?"#EBF2FF":ri%2===0?"#fff":"#F7FAFF",
                        borderRight:"2px solid #E0E8F5",
                        whiteSpace:"nowrap",transition:"color .15s"}}>
                        {row.fy}
                      </td>
                      {MESES.map(m=>{
                        const v=row[m];
                        const isColHL=hoverCol===m;
                        return(
                          <td key={m} style={{padding:"6px 3px",textAlign:"center",
                            background:isColHL?"#EBF2FF":"transparent"}}>
                            <div className="pip"
                              onClick={()=>setModal({fy:row.fy,afn:row.afn,mes:m,val:v})}
                              title="Ver calendário do mês"
                              style={{display:"inline-flex",alignItems:"center",
                                justifyContent:"center",width:38,height:26,
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
                          justifyContent:"center",width:52,height:26,
                          borderRadius:5,background:"transparent",
                          color:SE.gray,fontWeight:700,fontSize:13,
                          border:"1px solid #D8E4F0"}}>
                          {fmt(row.T)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
 
              {sorted.length>1&&(
                <tfoot>
                  <tr style={{background:SE.blue,borderTop:`3px solid ${SE.blueDk}`}}>
                    <td style={{padding:"9px 16px",color:"#fff",fontSize:10,fontWeight:700,
                      letterSpacing:"0.1em",textTransform:"uppercase",
                      position:"sticky",left:0,background:SE.blue,zIndex:1,
                      borderRight:"2px solid rgba(255,255,255,0.15)"}}>Média</td>
                    {MESES.map(m=>(
                      <td key={m} style={{padding:"9px 3px",textAlign:"center"}}>
                        <span style={{color:"#fff",fontSize:11,fontWeight:600}}>
                          {avg(sorted,m).toFixed(1)}
                        </span>
                      </td>
                    ))}
                    <td style={{padding:"9px 8px",textAlign:"center",
                      borderLeft:"2px solid rgba(255,255,255,0.15)"}}>
                      <span style={{color:"#fff",fontSize:12,fontWeight:700}}>
                        {avg(sorted,"T").toFixed(2)}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
        <div style={{marginTop:10,textAlign:"center",fontSize:11,color:SE.grayMd}}>
          Clique em qualquer célula para abrir o calendário do mês
        </div>
      </div>
    </div>
  );
}