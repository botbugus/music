// ===== RANDA AI - MAIN APPLICATION =====
(function() {
    'use strict';

    // ========================================
    // 1. DOM REFERENCE & STATE
    // ========================================
    const DOM = {
        burgerBtn: document.getElementById('burgerBtn'),
        drawer: document.getElementById('drawer'),
        overlay: document.getElementById('drawerOverlay'),
        closeBtn: document.getElementById('drawerCloseBtn'),
        menuItems: document.querySelectorAll('.drawer-menu-item'),
        chatMessages: document.getElementById('chatMessages'),
        promptInput: document.getElementById('promptInput'),
        sendBtn: document.getElementById('sendBtn'),
        particles: document.getElementById('particles')
    };

    const STATE = {
        isGenerating: false,
        currentFeature: 'image',
        messageCount: 0
    };

    // ========================================
    // 2. DRAWER CONTROLS
    // ========================================
    const DrawerController = {
        open() {
            DOM.drawer.classList.add('open');
            DOM.overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        },
        close() {
            DOM.drawer.classList.remove('open');
            DOM.overlay.classList.remove('open');
            document.body.style.overflow = '';
        },
        toggle() {
            if (DOM.drawer.classList.contains('open')) {
                this.close();
            } else {
                this.open();
            }
        }
    };

    // ========================================
    // 3. PARTICLE SYSTEM
    // ========================================
    const ParticleSystem = {
        init(count = 40) {
            const container = DOM.particles;
            container.innerHTML = '';
            for (let i = 0; i < count; i++) {
                const p = document.createElement('div');
                p.className = 'particle';
                p.style.left = Math.random() * 100 + '%';
                p.style.width = (Math.random() * 3 + 1) + 'px';
                p.style.height = p.style.width;
                p.style.animationDuration = (Math.random() * 20 + 15) + 's';
                p.style.animationDelay = (Math.random() * 20) + 's';
                p.style.opacity = Math.random() * 0.4 + 0.05;
                container.appendChild(p);
            }
        }
    };

    // ========================================
    // 4. JSON SYNTAX HIGHLIGHTER
    // ========================================
    const JSONHighlighter = {
        formatJSON(jsonStr) {
            let result = '';
            const lines = jsonStr.split('\n');
            for (let line of lines) {
                let formattedLine = '';
                let inString = false;
                let i = 0;
                
                while (i < line.length) {
                    const char = line[i];
                    
                    // Handle string
                    if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
                        inString = !inString;
                        if (inString) {
                            formattedLine += `<span class="json-string">"`;
                        } else {
                            formattedLine += `"</span>`;
                        }
                        i++;
                        continue;
                    }
                    
                    if (inString) {
                        formattedLine += char;
                        i++;
                        continue;
                    }
                    
                    // Handle brackets
                    if (char === '{' || char === '}' || char === '[' || char === ']') {
                        formattedLine += `<span class="json-bracket">${char}</span>`;
                        i++;
                        continue;
                    }
                    
                    // Handle colon
                    if (char === ':') {
                        formattedLine += `<span class="json-colon">:</span>`;
                        i++;
                        continue;
                    }
                    
                    // Handle comma
                    if (char === ',') {
                        formattedLine += `<span class="json-comma">,</span>`;
                        i++;
                        continue;
                    }
                    
                    // Handle key detection (word before colon)
                    if (char === '"') {
                        let keyStart = i;
                        let keyEnd = line.indexOf('"', i + 1);
                        if (keyEnd !== -1 && line[keyEnd + 1] === ':') {
                            const key = line.substring(i, keyEnd + 1);
                            formattedLine += `<span class="json-key">${key}</span>`;
                            i = keyEnd + 1;
                            continue;
                        }
                    }
                    
                    // Handle boolean and null
                    const wordMatch = line.substring(i).match(/^(true|false|null)\b/);
                    if (wordMatch) {
                        const word = wordMatch[0];
                        const cls = word === 'null' ? 'json-null' : 'json-boolean';
                        formattedLine += `<span class="${cls}">${word}</span>`;
                        i += word.length;
                        continue;
                    }
                    
                    // Handle number
                    const numMatch = line.substring(i).match(/^(\d+\.?\d*)/);
                    if (numMatch) {
                        formattedLine += `<span class="json-number">${numMatch[0]}</span>`;
                        i += numMatch[0].length;
                        continue;
                    }
                    
                    formattedLine += char;
                    i++;
                }
                
                result += formattedLine + '\n';
            }
            return result;
        },
        
        detectAndFormat(text) {
            // Try to parse entire text as JSON
            try {
                const parsed = JSON.parse(text);
                const formatted = JSON.stringify(parsed, null, 2);
                return `<div class="json-block">${this.formatJSON(formatted)}</div>`;
            } catch (e) {
                // Try to find JSON block in text
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        const parsed = JSON.parse(jsonMatch[0]);
                        const formatted = JSON.stringify(parsed, null, 2);
                        const before = text.substring(0, jsonMatch.index);
                        const after = text.substring(jsonMatch.index + jsonMatch[0].length);
                        return `${before}<div class="json-block">${this.formatJSON(formatted)}</div>${after}`;
                    } catch (e2) {
                        return text;
                    }
                }
                return text;
            }
        }
    };

    // ========================================
    // 5. MESSAGE SYSTEM
    // ========================================
    const MessageSystem = {
        add(type, content, options = {}) {
            const { isImage = false, imageUrl = null, prompt = null } = options;
            
            const div = document.createElement('div');
            div.className = `message ${type}`;
            div.dataset.messageId = ++STATE.messageCount;

            const bubble = document.createElement('div');
            bubble.className = 'bubble';

            if (type === 'user') {
                bubble.textContent = content;
            } else if (isImage && imageUrl) {
                bubble.innerHTML = `
                    ${prompt ? `<div style="margin-bottom:0.4rem; color:#8ab4f0; font-size:0.8rem;"><strong>Prompt:</strong> ${prompt}</div>` : ''}
                    <img src="${imageUrl}" alt="${prompt || 'Gambar'}" loading="lazy" />
                    <div class="download-links">
                        <a href="${imageUrl}" target="_blank" download>
                            <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Download
                        </a>
                        <a href="${imageUrl}" target="_blank">
                            <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            View
                        </a>
                    </div>
                `;
            } else {
                const formattedContent = JSONHighlighter.detectAndFormat(content);
                bubble.innerHTML = formattedContent;
            }

            const time = document.createElement('div');
            time.className = 'time';
            time.textContent = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

            div.appendChild(bubble);
            div.appendChild(time);
            DOM.chatMessages.appendChild(div);
            
            this.scrollToBottom();
        },

        showTyping() {
            const div = document.createElement('div');
            div.className = 'message bot';
            div.id = 'typingIndicator';
            div.innerHTML = `
                <div class="bubble">
                    <div class="typing-indicator"><span></span><span></span><span></span></div>
                </div>
            `;
            DOM.chatMessages.appendChild(div);
            this.scrollToBottom();
        },

        hideTyping() {
            const el = document.getElementById('typingIndicator');
            if (el) el.remove();
        },

        scrollToBottom() {
            setTimeout(() => {
                DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
            }, 50);
        },

        clear() {
            DOM.chatMessages.innerHTML = '';
        },

        showWelcome(type) {
            this.clear();
            if (type === 'image') {
                DOM.chatMessages.innerHTML = `
                    <div class="welcome-message">
                        <span class="big-icon">🖼️</span>
                        <h3>Randa AI Image Generator</h3>
                        <p>Kirim prompt teks, dapatkan gambar</p>
                        <p style="font-size:0.75rem; color:#3a5a7a; margin-top:0.3rem;">Contoh: "kucing lucu pakai topi"</p>
                    </div>
                `;
            } else {
                DOM.chatMessages.innerHTML = `
                    <div class="welcome-message">
                        <span class="big-icon">💬</span>
                        <h3>Randa AI Chat Bot</h3>
                        <p>Tanya apapun, dapatkan jawaban dari AI</p>
                        <p style="font-size:0.75rem; color:#3a5a7a; margin-top:0.3rem;">Contoh: "tampilkan JSON data user"</p>
                    </div>
                `;
            }
        },

        showComingSoon(title) {
            this.clear();
            DOM.chatMessages.innerHTML = `
                <div style="text-align:center; padding:3rem 1rem; color:#4a5b78; margin:auto 0;">
                    <span style="font-size:3.5rem; display:block; margin-bottom:0.8rem;">🚧</span>
                    <h3 style="color:#c8ddf5; font-weight:400;">${title}</h3>
                    <p style="color:#5a7a9a;">Fitur ini sedang dalam pengembangan</p>
                    <p style="font-size:0.75rem; color:#3a4a5f; margin-top:0.3rem;">Coming soon</p>
                </div>
            `;
        }
    };

    // ========================================
    // 6. API SERVICES
    // ========================================
    const APIService = {
        async generateImage(prompt) {
            const encoded = encodeURIComponent(prompt);
            const response = await fetch(`https://api.synoxcloud.xyz/ai-generate/text-2-image?prompt=${encoded}&ratio=1%3A1`);
            return response.json();
        },

        async chatBot(prompt) {
            const encoded = encodeURIComponent(prompt);
            const response = await fetch(`https://api.synoxcloud.xyz/ai-chat/claude-opus-4.8?pesan=${encoded}`);
            return response.json();
        }
    };

    // ========================================
    // 7. MAIN APPLICATION LOGIC
    // ========================================
    const App = {
        async handleSend() {
            const text = DOM.promptInput.value.trim();
            
            if (STATE.isGenerating) return;
            
            if (!text) {
                MessageSystem.add('bot', '⚠️ Masukkan teks terlebih dahulu.');
                return;
            }

            STATE.isGenerating = true;
            DOM.sendBtn.disabled = true;

            // Remove welcome message if exists
            const welcome = DOM.chatMessages.querySelector('.welcome-message');
            if (welcome) welcome.remove();

            // Show user message
            MessageSystem.add('user', text);
            MessageSystem.showTyping();

            try {
                let result;
                if (STATE.currentFeature === 'image') {
                    result = await APIService.generateImage(text);
                    MessageSystem.hideTyping();
                    
                    if (result.status && result.data && result.data.url) {
                        MessageSystem.add('bot', '', {
                            isImage: true,
                            imageUrl: result.data.url,
                            prompt: result.data.prompt || text
                        });
                    } else {
                        MessageSystem.add('bot', '❌ Gagal generate gambar. Coba lagi.');
                    }
                } else if (STATE.currentFeature === 'chat') {
                    result = await APIService.chatBot(text);
                    MessageSystem.hideTyping();
                    
                    if (result.status && result.result && result.result.reply) {
                        MessageSystem.add('bot', result.result.reply);
                    } else {
                        MessageSystem.add('bot', '❌ Gagal mendapatkan jawaban. Coba lagi.');
                    }
                }
            } catch (error) {
                MessageSystem.hideTyping();
                MessageSystem.add('bot', `❌ Error: ${error.message}`);
            } finally {
                STATE.isGenerating = false;
                DOM.sendBtn.disabled = false;
                DOM.promptInput.value = '';
                DOM.promptInput.focus();
            }
        },

        switchFeature(feature) {
            if (feature === 'comingsoon') {
                MessageSystem.showComingSoon('Remove Background');
                DOM.promptInput.placeholder = 'Fitur belum tersedia...';
                DOM.promptInput.disabled = true;
                DOM.sendBtn.disabled = true;
                DrawerController.close();
                return;
            }

            // Update menu
            DOM.menuItems.forEach(item => {
                item.classList.toggle('active', item.dataset.feature === feature);
            });

            STATE.currentFeature = feature;

            if (feature === 'image') {
                MessageSystem.showWelcome('image');
                DOM.promptInput.placeholder = 'Tulis prompt gambar...';
                DOM.promptInput.disabled = false;
                DOM.sendBtn.disabled = false;
            } else if (feature === 'chat') {
                MessageSystem.showWelcome('chat');
                DOM.promptInput.placeholder = 'Tulis pertanyaan...';
                DOM.promptInput.disabled = false;
                DOM.sendBtn.disabled = false;
            }

            DrawerController.close();
        },

        init() {
            // ===== EVENT: Burger Button =====
            DOM.burgerBtn.addEventListener('click', DrawerController.open);

            // ===== EVENT: Close Button =====
            DOM.closeBtn.addEventListener('click', DrawerController.close);

            // ===== EVENT: Overlay =====
            DOM.overlay.addEventListener('click', DrawerController.close);

            // ===== EVENT: Send Button =====
            DOM.sendBtn.addEventListener('click', () => this.handleSend());

            // ===== EVENT: Enter Key =====
            DOM.promptInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSend();
                }
            });

            // ===== EVENT: Menu Items =====
            DOM.menuItems.forEach(item => {
                item.addEventListener('click', () => {
                    this.switchFeature(item.dataset.feature);
                });
            });

            // ===== INIT: Particles =====
            ParticleSystem.init(35);

            // ===== INIT: Welcome =====
            MessageSystem.showWelcome('image');

            console.log('✅ Randa AI ready');
            console.log('📌 Features:', {
                image: 'AI Image Generator',
                chat: 'AI Chat Bot (Claude)'
            });
        }
    };

    // ========================================
    // 8. START APPLICATION
    // ========================================
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });

})();