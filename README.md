# HK Webflow AI Chatbot — Setup
if (wasHidden && !msgs.dataset.boot) {
// Load welcome from backend fixed endpoint
const res = await fetch(`${API_URL}/fixed?key=welcome`).then(r=>r.json()).catch(()=>null);
const doc = res && res.answer ? res : {
answer: "Welcome to Hari Krishna Exports! I’m your virtual diamond expert. How can I help you today?",
options: [
'Learn about our company','Explore our diamonds','Discover our entities',
"Track your diamond's origin story",'Sustainability & events','Help with login/signup','Contact us'
]
};
addBot(doc.answer, doc.options);
msgs.dataset.boot = '1';
}
});
close.addEventListener('click', ()=> showPanel(false));


function addMsg(text, who='bot', options=[]) {
const d = document.createElement('div');
d.className = `hk-msg ${who==='bot'?'hk-bot':'hk-user'}`;
d.innerHTML = text.replace(/\n/g,'<br>');
msgs.appendChild(d);
setTimeout(()=> d.classList.add('show'), 10);
if (options && options.length) {
const wrap = document.createElement('div'); wrap.className='hk-options';
options.forEach(o=>{
const b = document.createElement('button'); b.className='hk-opt'; b.textContent=o;
b.onclick = ()=> { input.value = o; send.click(); };
wrap.appendChild(b);
});
msgs.appendChild(wrap);
}
msgs.scrollTop = msgs.scrollHeight;
}
function addBot(t, opts){ addMsg(t,'bot',opts); }
function addUser(t){ addMsg(t,'user'); }


async function ask(message){
// Try fixed first via keywords; otherwise hit /chat (RAG + AI)
const res = await fetch(`${API_URL}/chat`, {
method: 'POST', headers: {'Content-Type':'application/json'},
body: JSON.stringify({ message })
}).then(r=>r.json()).catch(()=>({ error: true }));


if (res.error) return addBot("Sorry, something went wrong. Please try again.");


if (res.type === 'fixed') {
addBot(res.answer, res.options || []);
} else {
let answer = res.answer || 'I can only answer questions about hk.co.';
if (res.sources && res.sources.length) {
const links = res.sources.map(s=>`<a href="${s.url}" target="_blank">Source</a>`).join(' | ');
answer += `<div style="margin-top:6px; font-size:12px; opacity:.8;">${links}</div>`;
}
addBot(answer);
}
}


send.addEventListener('click', ()=>{
const v = (input.value||'').trim(); if (!v) return; addUser(v); input.value=''; ask(v);
});
input.addEventListener('keypress', (e)=>{ if (e.key==='Enter') send.click(); });
})();
</script>
```


## 7) Deploy
- API: Render, Railway, Fly.io, Vercel Node server. Set `ALLOWED_ORIGINS` to your Webflow domain(s).
- MongoDB: Atlas (Shared tier is fine to start).


## Notes
- For production-grade semantic search, switch to **MongoDB Atlas Vector Search** (create vector index on `chunks.embedding`).
- Schedule the scraper with a cron (GitHub Actions, Render cron, or a serverless scheduler).
- Rate-limit the `/api/chat` endpoint and validate inputs.