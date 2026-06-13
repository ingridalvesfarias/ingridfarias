/* ====================================================
             INDI.dev — SCRIPT PRINCIPAL
   Custom Cursor | Loader | Chat | Tilt | FAQ | Scroll
   ==================================================== */

// ─── LOADING SCREEN ───
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const bar = document.getElementById('loaderBar');
    const text = document.getElementById('loaderText');

    const messages = [
        'Inicializando sistema...',
        'Carregando módulos...',
        'Ativando interface...',
        'INDI.dev pronto!'
    ];

    let progress = 0;
    let msgIdx = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 18 + 5;
        if (progress >= 100) progress = 100;
        bar.style.width = progress + '%';

        if (progress > 30 && msgIdx === 0) { text.textContent = messages[1]; msgIdx = 1; }
        if (progress > 65 && msgIdx === 1) { text.textContent = messages[2]; msgIdx = 2; }
        if (progress >= 100) {
            text.textContent = messages[3];
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
                initReveal();
            }, 500);
        }
    }, 80);

    document.body.style.overflow = 'hidden';
});

// ─── CUSTOM CURSOR ───
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');

let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

function animateTrail() {
    const mousePos = { x: parseFloat(cursor.style.left) || 0, y: parseFloat(cursor.style.top) || 0 };
    trailX += (mousePos.x - trailX) * 0.15;
    trailY += (mousePos.y - trailY) * 0.15;
    trail.style.left = trailX + 'px';
    trail.style.top = trailY + 'px';
    requestAnimationFrame(animateTrail);
}
animateTrail();

// Scale cursor on hover
document.querySelectorAll('a, button, .tilt-card, .faq-question').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        trail.style.transform = 'translate(-50%, -50%) scale(1.5)';
        trail.style.borderColor = 'rgba(0,255,136,0.6)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        trail.style.transform = 'translate(-50%, -50%) scale(1)';
        trail.style.borderColor = 'rgba(0,255,136,0.4)';
    });
});

// ─── HEADER SCROLL EFFECT ───
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ─── SCROLL REVEAL ───
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.panel-section, .project-card, .price-card, .testimonial-card, .faq-item, .hero-left, .hero-right').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// ─── TILT EFFECT (cards) ───
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -8;
        const rotY = ((x - cx) / cx) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
});

// ─── FAQ ACCORDION ───
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const answer = btn.nextElementSibling;
        const isOpen = answer.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
        document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));

        if (!isOpen) {
            answer.classList.add('open');
            btn.classList.add('active');
        }
    });
});

// ─── CHAT PARKER ───
const openChatBtn = document.getElementById('openChat');
const aiChat = document.getElementById('aiChat');
const closeChatBtn = document.getElementById('closeChat');
const sendMsgBtn = document.getElementById('sendMsg');
const userInput = document.getElementById('userInput');
const chatMessages = document.getElementById('chatMessages');

openChatBtn.addEventListener('click', () => {
    aiChat.classList.toggle('active');
    if (aiChat.classList.contains('active')) userInput.focus();
});

closeChatBtn.addEventListener('click', () => aiChat.classList.remove('active'));

function appendMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${type}`;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function parkerResponse(userText) {
    const typing = document.createElement('div');
    typing.className = 'msg typing';
    typing.textContent = 'PARKER está digitando...';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
        typing.remove();
        const lower = userText.toLowerCase();
        let response;

        if (lower.includes('preço') || lower.includes('valor') || lower.includes('quanto')) {
            response = 'Temos 3 planos: V1 Essencial (R$ 550 — landing page), V2 Integrado (R$ 1.200 — site multi-páginas) e V3 Avançado (sob consulta — dashboards com IA). Qual se encaixa melhor na sua missão?';
        } else if (lower.includes('prazo') || lower.includes('tempo') || lower.includes('dias')) {
            response = 'V1 entregue em até 7 dias úteis, V2 em até 15 dias. Projetos V3 têm prazo definido na consultoria inicial. A Ingrid prioriza qualidade e agilidade!';
        } else if (lower.includes('whatsapp') || lower.includes('contato') || lower.includes('falar')) {
            response = 'Você pode chamar a Ingrid diretamente no WhatsApp pelo botão flutuante (canto direito) ou via formulário na seção de Contato. Ela responde em até 1 hora!';
        } else if (lower.includes('projeto') || lower.includes('portfólio') || lower.includes('trabalho')) {
            response = 'Alguns projetos da Ingrid: CYPHER-AEGIS (landing page de segurança), GYM_AI (integração com Groq para treino e nutrição) e RESUME_BUILDER (gerador de currículos com IA). Quer saber mais sobre algum?';
        } else if (lower.includes('sobre') || lower.includes('ingrid') || lower.includes('quem')) {
            response = 'A Ingrid tem 24 anos, é desenvolvedora Front-End e especialista em IA, formanda em Filosofia. Opera entre abstração filosófica e execução técnica, entregando ecossistemas digitais precisos e com identidade única.';
        } else if (lower.includes('oi') || lower.includes('olá') || lower.includes('ola') || lower.includes('bom dia') || lower.includes('boa')) {
            response = 'Olá! Pronto para iniciar sua missão. Posso te ajudar com informações sobre serviços, projetos, prazo ou como entrar em contato com a Ingrid. O que precisa?';
        } else {
            response = 'Entendido! Para essa missão específica, recomendo entrar em contato diretamente com a Ingrid — ela responde em menos de 1 hora pelo WhatsApp ou e-mail. Posso te ajudar com mais alguma coisa?';
        }

        appendMessage(response, 'parker');
    }, 1200);
}

function sendMessage() {
    const text = userInput.value.trim();
    if (text) {
        appendMessage(text, 'user');
        userInput.value = '';
        parkerResponse(text);
    }
}

sendMsgBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

// ─── FORM SUBMIT ───
const form = document.getElementById('missionForm');
if (form) {
    form.addEventListener('submit', function (e) {
        // Se você quer apenas que o Formspree funcione, 
        // a forma mais segura é deixar o formulário enviar normalmente.
        // O Formspree cuidará da página de redirecionamento de sucesso.

        const btn = form.querySelector('.submit-btn');
        btn.textContent = 'ENVIANDO...';
        btn.disabled = true;
    });
}
