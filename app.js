'use strict';
/* Instrumento de investigación - elaboración de horarios, enfoque en decisiones.
   14 preguntas interactivas, independiente de la simulación de Banner.
   Sin dependencias externas y sin solicitudes de red salvo el envío opcional a Apps Script. */
(() => {
const QUESTIONS = [
  {id:'P1', section:'Sobre tus estudios', badge:'01', eyebrow:'CARACTERIZACIÓN', type:'single',
   title:'¿Cómo está organizada actualmente tu trayectoria académica?',
   help:'Elige la opción que más se acerque a tu situación.',
   options:[['unico','Curso un solo pregrado'],['doble','Curso doble programa'],['una_opcion','Curso un pregrado y una opción académica'],['varias_opciones','Curso un pregrado y varias opciones académicas'],['doble_opciones','Curso doble programa y una o más opciones académicas'],['otro','Otra situación']]},
  {id:'P2', section:'Sobre tus estudios', badge:'01', eyebrow:'CARACTERIZACIÓN', type:'single',
   title:'¿En qué etapa de tu pregrado estás?',help:'Piensa en el semestre que cursas actualmente.',
   options:[['1_2','1.º–2.º semestre'],['3_4','3.º–4.º semestre'],['5_6','5.º–6.º semestre'],['7_8','7.º–8.º semestre'],['9_mas','9.º semestre o más']]},
  {id:'P3', section:'Sobre tus estudios', badge:'01', eyebrow:'CARACTERIZACIÓN', type:'faculties',
   title:'¿A qué facultad o escuela pertenece tu pregrado?',
   help:'Selecciona la facultad Si cursas más de un programa, selecciona las facultades o escuelas correspondientes. escuela de tu pregrado.',
   options:[['administracion','Facultad de Administración'],['arquitectura_diseno','Facultad de Arquitectura y Diseño'],['artes_humanidades','Facultad de Artes y Humanidades'],['ciencias','Facultad de Ciencias'],['ciencias_sociales','Facultad de Ciencias Sociales'],['derecho','Facultad de Derecho'],['economia','Facultad de Economía'],['educacion','Facultad de Educación'],['ingenieria','Facultad de Ingeniería'],['medicina','Facultad de Medicina'],['gobierno','Escuela de Gobierno Alberto Lleras Camargo'],['no_se','No estoy seguro/a']]},
  {id:'P4', section:'Cómo planeas', badge:'02', eyebrow:'PLANEACIÓN', type:'timeline',
   title:'¿Cuándo comienzas a pensar qué materias inscribirás el siguiente semestre?',
   help:'Selecciona el momento que mejor describa tu experiencia habitual.',
   options:[['varios','Planeo varios semestres por adelantado'],['semestre_anterior','Durante el semestre anterior'],['oferta','Cuando publican la oferta de cursos'],['poco_antes','Poco antes de mi turno'],['mismo_dia','El mismo día de la inscripción'],['sin_anticipacion','No suelo planearlo con anticipación']]},
  {id:'P5', section:'Cómo eliges', badge:'02', eyebrow:'TUS PRIORIDADES', type:'rank',
   title:'Cuando decides qué materias inscribir, ¿qué tiene más peso para ti?',
   help:'Toca tres criterios en el orden de importancia: primero el más importante, luego el segundo y el tercero. Puedes quitar una selección tocándola de nuevo.',
   options:[['avance','Avanzar en mi plan de estudios'],['interes','Que me interese el contenido'],['profesor','El profesor que dicta la materia'],['carga','La carga académica'],['horario','Que pueda acomodarla en mi horario'],['recomendacion','Las recomendaciones de otros estudiantes'],['nota','La posibilidad de obtener una buena nota'],['prerrequisito','Poder cursar otras materias después']]},
  {id:'P6', section:'Cómo eliges', badge:'02', eyebrow:'TUS PRIORIDADES', type:'rank',
   title:'Una vez elegida la materia, ¿qué es lo más importante al escoger la sección?',
   help:'Ahora selecciona tus tres prioridades para elegir una sección. El orden sí importa.',
   options:[['profesor','El profesor'],['hora','El horario de clase'],['dias','Los días de la semana'],['cupos','La disponibilidad de cupos'],['modalidad','La modalidad'],['cruce','Evitar cruces con otras materias'],['recomendacion','Las recomendaciones de otros estudiantes']]},
  {id:'P7', section:'Cómo eliges', badge:'02', eyebrow:'UNA DECISIÓN', type:'scenario',
   title:'Imagina que solo tienes espacio para una materia más. ¿Cuál elegirías?',
   help:'Compara las tres situaciones ficticias. No hay una respuesta correcta.',
   options:[
     ['a','Opción A','Una materia necesaria para avanzar el siguiente semestre, pero de 6:00 a 8:00 p. m.'],
     ['b','Opción B','Una materia que podrías cursar más adelante, con un profesor recomendado y horario conveniente.'],
     ['c','Opción C','Una materia cuyo contenido te interesa mucho, pero que aumentaría bastante tu carga académica.'],
     ['mas_info','Necesitaría más información','Con estos datos no podría decidir todavía.']
   ]},
  {id:'P8', section:'Cómo eliges', badge:'02', eyebrow:'PLANES ALTERNATIVOS', type:'single',
   title:'La última vez que preparaste tu horario, ¿cuántas alternativas tenías además de tu primera opción?',
   help:'Piensa en planes distintos para el caso de que tu primera opción no funcionara.',
   options:[['ninguna','Ninguna'],['una','Una alternativa'],['dos','Dos alternativas'],['tres','Tres o más alternativas'],['no_recuerdo','No recuerdo / todavía no he elaborado un horario']]},
  {id:'P9', section:'Cupos e imprevistos', badge:'03', eyebrow:'EJEMPLO DE BANNER', type:'bannerCupos',
   title:'Observa estas secciones de una materia. ¿Cómo describirías la situación?',
   help:'Es un ejemplo ficticio: una sección está llena y las otras tienen horarios distintos.',
   options:[['sin_cupos','No hay cupos en la materia'],['inconvenientes','Hay cupos, pero las secciones disponibles no me convienen'],['elegiria','Hay cupos y elegiría una de las secciones disponibles'],['mas_info','Necesitaría revisar más información antes de decidir']]},
  {id:'P10', section:'Cupos e imprevistos', badge:'03', eyebrow:'TU EXPERIENCIA', type:'single',
   title:'La última vez que no conseguiste cupo en la sección que querías, ¿qué hiciste primero?',
   help:'Piensa en una situación real, no en lo que crees que harías.',
   options:[['otra_seccion','Busqué otra sección'],['reorganicé','Reorganicé otras materias de mi horario'],['espere','Esperé otra oportunidad de inscripción'],['otra_materia','Busqué una materia diferente'],['consulte','Consulté a un consejero, coordinador o compañero'],['desisti','Decidí no inscribir esa materia'],['nunca','No me ha ocurrido / no recuerdo']]},
  {id:'P11', section:'Cupos e imprevistos', badge:'03', eyebrow:'TUS EMOCIONES', type:'emotions',
   title:'¿Qué sensación predominó la última vez que no conseguiste el cupo o la sección que querías?',
   help:'Elige lo que más se acerque a tu experiencia. Puedes indicar si no te ha ocurrido.',
   options:[['frustracion','Frustración'],['preocupacion','Preocupación'],['estres','Estrés'],['confusion','Confusión'],['indiferencia','Indiferencia'],['tranquilidad','Tranquilidad'],['otra','Otra sensación'],['ninguna_experiencia','No me ha ocurrido / no recuerdo']]},
  {id:'P12', section:'Cupos e imprevistos', badge:'03', eyebrow:'UN IMPREVISTO', type:'schedule',
   title:'Dos materias que quieres inscribir se cruzan en el horario. ¿Qué harías primero?',
   help:'Observa el horario ficticio y elige tu primera acción.',
   options:[['otra_seccion','Buscar otra sección de una de las materias'],['avanzar','Priorizar la materia que necesito para avanzar'],['interes','Priorizar la materia cuyo contenido me interesa más'],['profesor','Priorizar la sección con el profesor que prefiero'],['preguntar','Consultar con alguien antes de decidir'],['otro_horario','Buscar un horario completamente diferente']]},
  {id:'P13', section:'Banner y turnos', badge:'04', eyebrow:'INTERPRETAR BANNER', type:'bannerInspect', max:2, exclusive:['ninguno','no_conozco'],
   title:'Al mirar esta pantalla de Banner, ¿qué información te resulta más difícil de interpretar?',
   help:'Puedes señalar hasta dos elementos. La imagen muestra una parte de los resultados de búsqueda de cursos.',
   options:[['materia','Materia (código)'],['numero','Número de curso'],['seccion','Sección'],['nrc','NRC'],['creditos','Créditos'],['titulo','Título del curso'],['ninguno','Ninguno de estos elementos'],['no_conozco','No reconozco esta pantalla']]},
  {id:'P14', section:'Banner y turnos', badge:'04', eyebrow:'CREENCIAS SOBRE TURNOS', type:'multi', max:3, exclusive:['no_se'],
   title:'¿Qué factores crees que influyen en la asignación de los turnos de inscripción?',
   help:'Selecciona hasta tres opciones. Nos interesa conocer qué crees, no evaluarte.',
   options:[['creditos','Cantidad de créditos aprobados'],['semestre','Semestre que cursa el estudiante'],['promedio','Promedio académico'],['doble','Estudiar doble programa'],['opcion','Tener una opción académica'],['institucional','Algún criterio institucional particular'],['azar','Asignación aleatoria'],['no_se','No sé cómo se asignan']]}
];
const $=s=>document.querySelector(s);
const CONFIG=window.HORARIOS_PREGUNTAS_CONFIG||{};
const STORAGE_URL=String(CONFIG.appsScriptUrl||'').trim();
const STORAGE_READY=/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(STORAGE_URL);
const CHANNEL='uniandes-horarios-preguntas-v2';
let state=newState();let sending=false;let saved=false;
function newState(){return {index:0,answers:Object.create(null),timeSpent:Object.create(null),stepStart:Date.now(),startedAt:null,startedMs:0,sessionId:makeId(),events:[],lastPayload:null};}
function makeId(){if(window.crypto?.randomUUID)return window.crypto.randomUUID();return 'hp2-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,14);}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function track(type,details={}){state.events.push({type,at:new Date().toISOString(),ms:state.startedMs?Date.now()-state.startedMs:0,question:QUESTIONS[state.index]?.id||'',...details});}
function countCurrentTime(){const q=QUESTIONS[state.index];if(q&&state.startedMs){state.timeSpent[q.id]=(state.timeSpent[q.id]||0)+(Date.now()-state.stepStart);state.stepStart=Date.now();}}
function showScreen(name){['welcome','survey','sending','send-error','finish'].forEach(x=>$('#'+x).hidden=x!==name);if(name==='survey')$('#question-scroll').scrollTop=0;}
function error(message=''){const node=$('#question-error');node.textContent=message;node.hidden=!message;}
function current(){return QUESTIONS[state.index];}
function chosen(q){return state.answers[q.id];}
function facultyLimit(){return ['doble','doble_opciones'].includes(state.answers.P1)?2:1;}
function facultyHelp(){return facultyLimit()===2?'Puedes seleccionar hasta dos facultades o escuelas. Si ambos pregrados pertenecen a la misma, selecciona solo una.':'Si cursas más de un programa, selecciona las facultades o escuelas correspondientes.';}

function isSelected(q,id){const a=chosen(q);return Array.isArray(a)?a.includes(id):a===id;}
function singleMarkup(q,{compact=false}={}){
 const a=chosen(q);return `<div class="${q.options.length>6?'options-grid-2':'options-grid-2'}" id="choices" role="group" aria-label="Opciones de respuesta">`+
 q.options.map(([id,label])=>`<button type="button" class="choice ${compact?'compact':''} ${a===id?'selected':''}" data-answer="${esc(id)}" aria-pressed="${a===id}"><span class="dot" aria-hidden="true"></span><span class="labeltext">${esc(label)}</span></button>`).join('')+`</div>`;
}
function facultiesMarkup(q){
 const a=Array.isArray(chosen(q))?chosen(q):[];
 return `<div class="options-grid-2 faculty-grid" role="group" aria-label="Facultades y escuelas" aria-multiselectable="${facultyLimit()===2}">`+
 q.options.map(([id,label])=>`<button type="button" class="choice compact ${a.includes(id)?'selected':''}" data-faculty="${esc(id)}" aria-pressed="${a.includes(id)}"><span class="dot ${facultyLimit()===2?'square':''}" aria-hidden="true"></span><span class="labeltext">${esc(label)}</span></button>`).join('')+`</div>`;
}
function timelineMarkup(q){return `<div class="timeline-list" role="group" aria-label="Momentos de planeación">${q.options.map(([id,label],i)=>`<button type="button" class="timeline-choice ${isSelected(q,id)?'selected':''}" aria-pressed="${isSelected(q,id)}" data-answer="${id}"><span class="timeline-num" aria-hidden="true">${i+1}</span><span>${esc(label)}</span></button>`).join('')}</div>`;}
function rankMarkup(q){const a=Array.isArray(chosen(q))?chosen(q):[];return `<div class="rank-slots" aria-label="Orden seleccionado">${[0,1,2].map(i=>{const opt=q.options.find(o=>o[0]===a[i]);return `<div class="rank-slot ${opt?'filled':''}"><small>${i+1}.ª PRIORIDAD</small><span>${opt?esc(opt[1]):'Por elegir'}</span></div>`}).join('')}</div><div class="rank-options" role="group" aria-label="Toca criterios en orden de prioridad">${q.options.map(([id,label])=>{const at=a.indexOf(id);return `<button type="button" class="rank-choice ${at>=0?'picked':''}" aria-pressed="${at>=0}" data-rank="${esc(id)}"><span class="rank-order" aria-hidden="true">${at>=0?at+1:'+'}</span><span>${esc(label)}</span></button>`}).join('')}</div><div class="rank-footer"><p>${a.length} de 3 criterios seleccionados</p><button class="mini-link" data-reset-rank="true" type="button">Reiniciar orden</button></div>`;}
function scenarioMarkup(q){const a=chosen(q);return `<div class="scenario-cards" role="group" aria-label="Escoge una situación">${q.options.map(([id,title,desc])=>`<button type="button" class="scenario-card ${a===id?'selected':''}" aria-pressed="${a===id}" data-answer="${id}"><span class="scenario-top"><span class="scenario-tag" aria-hidden="true">${id==='mas_info'?'?':esc(id.toUpperCase())}</span><strong>${esc(title)}</strong></span><span class="scenario-desc">${esc(desc)}</span></button>`).join('')}</div>`;}
function bannerCuposVisual(){return `<div class="banner-example" role="img" aria-label="Ejemplo ficticio: Fundamentos de Administración. Sección 01, lunes 9 a 11, llena. Sección 02, lunes 18 a 20, disponible. Sección 03, martes 10 a 12, disponible pero se cruza con otra clase."><div class="banner-example-top"><span class="tiny-grid">▦</span><strong>Universidad de los Andes</strong></div><div class="banner-example-head">Planificar · Secciones de curso</div><div class="banner-example-body"><p>Resultados de búsqueda · FUNDAMENTOS DE ADMINISTRACIÓN</p><table><thead><tr><th>Sec.</th><th>Horario</th><th>Cupo</th></tr></thead><tbody><tr><td>01</td><td>Lun · 9–11 a. m.</td><td><span class="label-full">COMPLETA</span></td></tr><tr><td>02</td><td class="evening">Lun · 6–8 p. m.</td><td><span class="label-open">DISPONIBLE</span></td></tr><tr><td>03</td><td>Mar · 10–12 m.<br><span style="color:#767676;font-size:10px">Cruza con otro curso</span></td><td><span class="label-open">DISPONIBLE</span></td></tr></tbody></table><p class="small-note">Situación creada únicamente para esta pregunta.</p></div></div>`;}
function scheduleVisual(){return `<div class="calendar-demo" role="img" aria-label="Horario ficticio. El martes entre 10 de la mañana y 12 del mediodía se cruzan dos materias: Microeconomía I y Estadística I."><div class="calendar-top">Horario de clase · Ejemplo</div><table class="calendar-table"><thead><tr><th>Hora</th><th>Lunes</th><th>Martes</th><th>Miércoles</th><th>Jueves</th></tr></thead><tbody><tr><th>9–10</th><td></td><td></td><td></td><td class="ordinary">Contabilidad</td></tr><tr><th>10–11</th><td></td><td rowspan="2" class="conflict">Microeconomía I<br>+<br>Estadística I</td><td></td><td></td></tr><tr><th>11–12</th><td class="ordinary">Administración</td><td></td><td></td></tr><tr><th>12–1</th><td></td><td></td><td></td><td></td></tr></tbody></table></div><p class="calendar-caption">El cruce del martes está marcado con rayas. Las asignaturas y los horarios son ficticios.</p>`;}
function bannerInspectVisual(){return `<figure class="banner-shot"><img src="./assets/banner-ejemplo-columnas.png" alt="Fragmento de una pantalla de resultados de Banner que muestra las columnas Materia, Número de curso, Sección, NRC, Créditos y Título."><figcaption>Fragmento de la pantalla de Banner. Se muestran únicamente los campos de búsqueda de cursos, sin datos de personas.</figcaption></figure>`;}
function multiMarkup(q){const a=Array.isArray(chosen(q))?chosen(q):[];return `<p class="select-info">${q.max?`Puedes seleccionar hasta ${q.max} opciones.`:'Selecciona las opciones que correspondan.'}</p><div class="options-grid-2" role="group" aria-label="Seleccionar opciones">${q.options.map(([id,label])=>{const active=a.includes(id);return `<button type="button" class="choice compact ${active?'selected':''}" data-multi="${esc(id)}" aria-pressed="${active}"><span class="dot square" aria-hidden="true"></span><span class="labeltext">${esc(label)}</span></button>`}).join('')}</div>`;}
function inspectMarkup(q){const a=Array.isArray(chosen(q))?chosen(q):[];return `<p class="select-info">Marca hasta dos elementos de la captura.</p><div class="figure-options" role="group" aria-label="Campos de Banner">${q.options.map(([id,label])=>`<button type="button" class="figure-choice ${a.includes(id)?'selected':''}" aria-pressed="${a.includes(id)}" data-multi="${id}"><span class="checkmark" aria-hidden="true">${a.includes(id)?'✓':'○'}</span>${esc(label)}</button>`).join('')}</div>`;}
function faceSVG(kind){const mouths={frustracion:'<path d="M19 43 Q32 30 45 43"/>',preocupacion:'<path d="M24 41 Q32 35 40 41"/>',estres:'<path d="M20 44 Q26 36 32 44 Q38 36 44 44"/>',confusion:'<path d="M22 40 Q28 34 34 40 Q40 45 44 38"/>',indiferencia:'<path d="M22 41 H42"/>',tranquilidad:'<path d="M19 37 Q32 49 45 37"/>'};const brows={estres:'<path d="M19 20 L27 24 M37 24 L45 20"/>',confusion:'<path d="M18 19 L26 18 M37 18 L46 22"/>'};return `<svg viewBox="0 0 64 64" focusable="false" aria-hidden="true"><circle cx="32" cy="32" r="29" fill="white" stroke="currentColor" stroke-width="2"/><circle cx="23" cy="28" r="2.8" fill="currentColor"/><circle cx="41" cy="28" r="2.8" fill="currentColor"/><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">${mouths[kind]||''}${brows[kind]||''}</g></svg>`;}
function emotionMarkup(q){const a=chosen(q);const primary=q.options.slice(0,6),extra=q.options.slice(6);return `<div class="emotion-grid" role="group" aria-label="Emociones">${primary.map(([id,label])=>`<button type="button" class="mood-choice ${a===id?'selected':''}" aria-pressed="${a===id}" data-answer="${id}">${faceSVG(id)}<span>${esc(label)}</span></button>`).join('')}</div><div class="mood-extras">${extra.map(([id,label])=>`<button type="button" class="choice compact ${a===id?'selected':''}" aria-pressed="${a===id}" data-answer="${id}"><span class="dot" aria-hidden="true"></span>${esc(label)}</button>`).join('')}</div>`;}
function renderQuestion(){const q=current();const pos=state.index+1;const pct=Math.round(pos/QUESTIONS.length*100);
  $('#progress-section').textContent=q.section;$('#progress-count').textContent=`${pos} de ${QUESTIONS.length}`;
  $('#progress-fill').style.width=pct+'%';$('#progress-aria').setAttribute('aria-valuenow',String(pct));
  $('#question-eyebrow').textContent=q.eyebrow;$('#question-title').textContent=q.type==='faculties'&&facultyLimit()===2?'¿A qué facultad o escuela pertenece el pregrado que cursas?':q.title;$('#question-help').textContent=q.type==='faculties'?facultyHelp():q.help;
  $('#section-circle').textContent=q.badge;$('#section-desc').textContent=q.section;
  const vis=$('#question-visual');vis.innerHTML='';
  if(q.type==='bannerCupos')vis.innerHTML=bannerCuposVisual();
  if(q.type==='schedule')vis.innerHTML=scheduleVisual();
  if(q.type==='bannerInspect')vis.innerHTML=bannerInspectVisual();
  const target=$('#answer-options');target.className='';target.innerHTML=({single:()=>singleMarkup(q),faculties:()=>facultiesMarkup(q),timeline:()=>timelineMarkup(q),rank:()=>rankMarkup(q),scenario:()=>scenarioMarkup(q),bannerCupos:()=>singleMarkup(q),schedule:()=>singleMarkup(q),emotions:()=>emotionMarkup(q),bannerInspect:()=>inspectMarkup(q),multi:()=>multiMarkup(q)})[q.type]();
  $('#answer-note').textContent=q.type==='faculties'?(facultyLimit()===2?'Hasta dos facultades o escuelas':'Elige una facultad o escuela'):q.type==='rank'?'Ordena tres criterios':q.max?`Hasta ${q.max} opciones`:'Elige una respuesta';
  $('#question-next').textContent=pos===QUESTIONS.length?'Finalizar →':'Continuar →';
  error();
}
function setSingle(id){const q=current();
 if(q.id==='P1'&&state.answers.P1!==id){delete state.answers.P3;}
 state.answers[q.id]=id;track('answer_selected',{value:id});renderQuestion();}
function setFaculty(id){const q=current();let a=Array.isArray(chosen(q))?[...chosen(q)]:[];
 if(a.includes(id))a=a.filter(x=>x!==id);
 else if(id==='no_se')a=[id];
 else {a=a.filter(x=>x!=='no_se');if(a.length>=facultyLimit()){if(facultyLimit()===1)a=[id];else {error('Puedes seleccionar hasta dos facultades o escuelas.');return;}}else a.push(id);}
 state.answers[q.id]=a;track('faculties_selected',{value:[...a]});renderQuestion();}

function setRanking(id){const q=current();const old=Array.isArray(chosen(q))?[...chosen(q)]:[];const ix=old.indexOf(id);if(ix>=0)old.splice(ix,1);else if(old.length<3)old.push(id);else {error('Ya escogiste tres criterios. Quita uno antes de añadir otro.');return;}
  state.answers[q.id]=old;track('priority_order',{value:[...old]});renderQuestion();}
function setMultiple(id){const q=current();let a=Array.isArray(chosen(q))?[...chosen(q)]:[];const exclusives=q.exclusive||[];
  if(a.includes(id))a=a.filter(x=>x!==id);
  else if(exclusives.includes(id))a=[id];
  else {a=a.filter(x=>!exclusives.includes(x));if(q.max&&a.length>=q.max){error(`Puedes escoger hasta ${q.max} opciones. Quita una antes de añadir otra.`);return;}a.push(id);}
  state.answers[q.id]=a;track('answers_selected',{value:[...a]});renderQuestion();}
$('#answer-options').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-answer'))setSingle(b.dataset.answer);else if(b.hasAttribute('data-faculty'))setFaculty(b.dataset.faculty);else if(b.hasAttribute('data-rank'))setRanking(b.dataset.rank);else if(b.hasAttribute('data-multi'))setMultiple(b.dataset.multi);else if(b.hasAttribute('data-reset-rank')){state.answers[current().id]=[];track('ranking_reset');renderQuestion();}});
function validate(q){const a=chosen(q);if(q.type==='rank')return Array.isArray(a)&&a.length===3?'':'Selecciona tres criterios en orden de importancia.';
 if(q.type==='faculties')return Array.isArray(a)&&a.length>0&&a.length<=facultyLimit()?'':'Selecciona al menos una facultad o escuela.';
 if(q.type==='multi'||q.type==='bannerInspect')return Array.isArray(a)&&a.length>0?'':'Selecciona al menos una opción.';
 return typeof a==='string'&&a.length>0?'':'Elige una respuesta antes de continuar.';}
function navigate(delta){if(delta>0){const message=validate(current());if(message){error(message);return;}track('question_confirmed',{value:chosen(current())});}
 countCurrentTime();const next=state.index+delta;if(next<0){showScreen('welcome');return;}
 if(next>=QUESTIONS.length){track('questionnaire_completed');finishFlow();return;}
 state.index=next;state.stepStart=Date.now();showScreen('survey');renderQuestion();$('#question-title').focus({preventScroll:true});}
$('#question-next').addEventListener('click',()=>navigate(1));
$('#question-back').addEventListener('click',()=>navigate(-1));
$('#welcome-next').addEventListener('click',()=>{if(!$('#consent').checked){$('#welcome-error').textContent='Para comenzar, confirma que aceptas participar.';$('#welcome-error').hidden=false;return;}
 $('#welcome-error').hidden=true;if(!state.startedMs){state.startedAt=new Date().toISOString();state.startedMs=Date.now();track('started');}
 state.stepStart=Date.now();showScreen('survey');renderQuestion();$('#question-title').focus({preventScroll:true});});
function payload(){return {instrument:'Elaboración de horarios de pregrado · Preguntas interactivas',version:'2.1.0',participant_id:state.sessionId,started_at:state.startedAt,completed_at:new Date().toISOString(),elapsed_seconds:Math.round((Date.now()-state.startedMs)/1000),responses:QUESTIONS.map(q=>({id:q.id,question:q.title,response:state.answers[q.id]??'',time_ms:state.timeSpent[q.id]||0})),events:state.events};}
function sendViaAppsScript(data){return new Promise((resolve,reject)=>{
  const frame=document.createElement('iframe');frame.style.display='none';frame.setAttribute('title','Confirmación de envío');frame.name='survey_receiver_'+Date.now().toString(36);
  const form=document.createElement('form');form.style.display='none';form.target=frame.name;form.method='POST';form.action=STORAGE_URL;form.acceptCharset='UTF-8';
  for(const [name,value] of Object.entries({payload:JSON.stringify(data),origin:location.origin,request_id:state.sessionId})){const inp=document.createElement('input');inp.type='hidden';inp.name=name;inp.value=value;form.append(inp);}
  let settled=false;let timeout=null;
  function cleanup(){clearTimeout(timeout);window.removeEventListener('message',receive);form.remove();frame.remove();}
  function fail(err){if(settled)return;settled=true;cleanup();reject(err);}
  function receive(e){if(settled)return;const allowed=e.origin==='https://script.google.com'||e.origin==='https://script.googleusercontent.com'||/^https:\/\/[a-zA-Z0-9-]+\.googleusercontent\.com$/.test(e.origin);
    if(!allowed||e.data?.channel!==CHANNEL||e.data.request_id!==state.sessionId)return;
    if(e.data.ok===true){settled=true;cleanup();resolve();}else fail(new Error('No se confirmó el registro.'));}
  window.addEventListener('message',receive);frame.addEventListener('error',()=>fail(new Error('No se pudo conectar con el servicio.')));
  timeout=setTimeout(()=>fail(new Error('El servicio no respondió a tiempo.')),30000);document.body.append(frame,form);try{form.submit();}catch(err){fail(err);}
});}
async function finishFlow(){if(sending||saved)return;if(!STORAGE_READY){showScreen('finish');$('#finish-message').textContent='Terminaste el recorrido. Gracias por revisar estas preguntas.';return;}
  sending=true;showScreen('sending');state.lastPayload=state.lastPayload||payload();try{await sendViaAppsScript(state.lastPayload);saved=true;showScreen('finish');$('#finish-message').textContent='Tus respuestas se recibieron correctamente. Gracias por compartir tu experiencia.';}
  catch(err){showScreen('send-error');}finally{sending=false;}}
$('#retry-send').addEventListener('click',finishFlow);
$('#start-over').addEventListener('click',()=>{state=newState();saved=false;sending=false;$('#consent').checked=false;showScreen('welcome');});
showScreen('welcome');
})();
