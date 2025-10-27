const nexaChat=document.getElementById('nexaChat');
const nexaToggle=document.getElementById('nexaToggle');
const nexaClose=document.getElementById('nexaClose');
const sendBtn=document.getElementById('sendBtn');
const userInput=document.getElementById('userInput');
const chatMessages=document.getElementById('chatMessages');

nexaToggle.addEventListener('click',()=>nexaChat.classList.toggle('closed'));
nexaClose.addEventListener('click',()=>nexaChat.classList.add('closed'));

function appendMessage(role,text){
  const div=document.createElement('div');
  div.className='msg '+role;
  div.innerText=text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop=chatMessages.scrollHeight;
}

async function sendMessage(){
  const text=userInput.value.trim();
  if(!text)return;
  appendMessage('user',text);
  userInput.value='';
  appendMessage('assistant','NEXA sedang memproses...');
  try{
    const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text})});
    const data=await r.json();
    const msgs=chatMessages.getElementsByClassName('assistant');
    if(msgs.length)msgs[msgs.length-1].innerText=data.answer||'Maaf, tidak ada jawaban.';
  }catch(e){
    const msgs=chatMessages.getElementsByClassName('assistant');
    if(msgs.length)msgs[msgs.length-1].innerText='Gagal menghubungi server.';
  }
}

sendBtn.addEventListener('click',sendMessage);
userInput.addEventListener('keypress',e=>{if(e.key==='Enter')sendMessage();});
