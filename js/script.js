document.addEventListener('DOMContentLoaded', () => {
    // --- DOM References ---
    const introScreen = document.getElementById('intro-screen');
    const chatWindow = document.getElementById('chat-window');
    const chatMessages = document.getElementById('chat-messages');
    const inputField = document.getElementById('chat-input');
    const sendBtn = document.getElementById('sendBtn');
    const modal = document.getElementById('media-modal');
    const modalImg = document.getElementById('modal-image');
    const modalIframe = document.getElementById('modal-iframe');
    const modalClose = document.querySelector('.modal-close');
    const themeStyle = document.getElementById('theme-style');
    const skinToggle = document.getElementById('skinToggle');
    const skinPanel = document.getElementById('skinPanel');
    const themeToggle = document.getElementById('themeToggle');

    let isProcessing = false;

    // --- Side Skin Panel Toggle ---
    if (skinToggle && skinPanel) {
        skinToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            skinPanel.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!skinPanel.contains(e.target) && e.target !== skinToggle) {
                skinPanel.classList.remove('active');
            }
        });

        document.querySelectorAll('.skin-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                const skin = swatch.dataset.skin;
                if (skin && themeStyle) {
                    themeStyle.href = `css/skins/${skin}.css`;
                }
            });
        });
    }

    // --- Light/Dark Toggle ---
    if (themeToggle) {
        let isDark = false;
        themeToggle.addEventListener('click', () => {
            isDark = !isDark;
            if (isDark) {
                document.documentElement.style.setProperty('--bg-body', '#1a1a2e');
                document.documentElement.style.setProperty('--bg-container', '#161625');
                document.documentElement.style.setProperty('--bg-chat', '#1e1e30');
                document.documentElement.style.setProperty('--text-primary', '#ffffff');
                document.documentElement.style.setProperty('--text-secondary', '#a0a0b8');
                document.documentElement.style.setProperty('--border-color', '#2a2a40');
                themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            } else {
                document.documentElement.style.setProperty('--bg-body', '#edf2f7');
                document.documentElement.style.setProperty('--bg-container', '#ffffff');
                document.documentElement.style.setProperty('--bg-chat', '#f8f9fc');
                document.documentElement.style.setProperty('--text-primary', '#1a1a2e');
                document.documentElement.style.setProperty('--text-secondary', '#6c6c80');
                document.documentElement.style.setProperty('--border-color', '#eaeef2');
                themeToggle.innerHTML = '<i class="fa-regular fa-sun"></i>';
            }
        });
    }

    // --- Helpers ---
    function scrollToBottom() {
        if (chatWindow) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }

    function addMessage(type, content, isHTML = false) {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        if (content instanceof HTMLElement) {
            div.appendChild(content);
        } else if (isHTML) {
            div.innerHTML = content;
        } else {
            div.textContent = content;
        }
        chatMessages.appendChild(div);
        scrollToBottom();
        return div;
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.id = 'typing-indicator';
        div.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(div);
        scrollToBottom();
    }

    function hideTyping() {
        const el = document.getElementById('typing-indicator');
        if (el) el.remove();
    }

    // --- Render Flow Section ---
    function renderFlow(flowId, triggerText = '') {
        const template = document.querySelector(`.flow-section[data-flow="${flowId}"]`);
        if (!template) return;

        const clone = template.cloneNode(true);
        clone.style.display = 'block';
        
        // Process Star Ratings
        clone.querySelectorAll('.stars').forEach(el => {
            const rating = parseInt(el.dataset.rating) || 0;
            const full = '★'.repeat(rating);
            const empty = '☆'.repeat(5 - rating);
            el.textContent = full + empty;
            el.style.color = '#f1c40f';
        });

        // Process Gallery Images
        clone.querySelectorAll('.gallery-thumb').forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(img.src, 'image');
            });
        });

        // Process Action Options
        clone.querySelectorAll('.action-options li').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.dataset.action;
                const link = item.dataset.link;

                if (action) {
                    if (action === 'open_contact_form') {
                        alert('Send an email directly to shehryarahmadkhalil055@gmail.com or call +92 320 9389299!');
                        return;
                    }
                    const text = item.textContent.trim();
                    addMessage('user', text);
                    processCommand(action);
                } else if (link) {
                    window.open(link, '_blank');
                }
            });
        });

        addMessage('bot', clone, true);
    }

    // --- Core Command Processor ---
    function processCommand(input) {
        if (isProcessing) return;
        isProcessing = true;

        const lower = input.toLowerCase().trim();

        // Switch from Intro to Chat window smoothly
        if (introScreen.style.display !== 'none') {
            introScreen.style.display = 'none';
            chatWindow.style.display = 'flex';
        }

        // Custom query handlers
        if (lower.includes('age')) {
            showTyping();
            setTimeout(() => {
                hideTyping();
                addMessage('bot', `I'm currently in my 7th semester of BS Data Science at COMSATS University Islamabad (2023–2027 batch).`, false);
                isProcessing = false;
            }, 500);
            return;
        }

        if (lower.includes('cv') || lower.includes('resume')) {
            showTyping();
            setTimeout(() => {
                hideTyping();
                addMessage('bot', `📄 You can download my resume here: <a href="Shehryar_Ahmad_Khalil_Resume.pdf" download style="color:var(--primary); font-weight:600;">Download Shehryar's Resume (PDF)</a>`, true);
                isProcessing = false;
            }, 500);
            return;
        }

        if (lower.includes('education') || lower.includes('degree') || lower.includes('university') || lower.includes('comsats')) {
            showTyping();
            setTimeout(() => {
                hideTyping();
                addMessage('bot', `🎓 <strong>BS Data Science</strong> — COMSATS University Islamabad (Feb 2023 – Expected 2027, 7th Semester).<br>Coursework: Machine Learning, Deep Learning, Data Mining, Statistical Methods, Data Warehousing, Big Data Analytics, Business Intelligence.`, true);
                isProcessing = false;
            }, 500);
            return;
        }

        if (lower.includes('award') || lower.includes('certif') || lower.includes('hobbies')) {
            showTyping();
            setTimeout(() => {
                hideTyping();
                addMessage('bot', `🏆 <strong>9 Professional Certifications:</strong><br>• IBM Machine Learning with Python<br>• DeepLearning.AI / Stanford Supervised ML<br>• Duke University RAG (Retrieval Augmented Generation)<br>• Cisco CCNA Networking<br>• AWS Concepts (DataCamp)<br>• Microsoft Learn Power BI Insights`, true);
                isProcessing = false;
            }, 500);
            return;
        }

        // Find matching flow
        let matchedFlow = null;
        document.querySelectorAll('.flow-section').forEach(section => {
            const triggers = section.dataset.triggers ? section.dataset.triggers.split(',') : [];
            triggers.forEach(trigger => {
                if (lower.includes(trigger.trim())) {
                    matchedFlow = section.dataset.flow;
                }
            });
        });

        if (!matchedFlow) {
            document.querySelectorAll('.flow-section').forEach(section => {
                if (lower === section.dataset.flow) {
                    matchedFlow = section.dataset.flow;
                }
            });
        }

        showTyping();

        setTimeout(() => {
            hideTyping();
            if (matchedFlow) {
                renderFlow(matchedFlow, lower);
            } else {
                addMessage('bot', `I couldn't find info on "${input}". Try asking about <strong>about</strong>, <strong>experience</strong>, <strong>skills</strong>, <strong>projects</strong>, or <strong>contact</strong>.`, true);
            }
            isProcessing = false;
            scrollToBottom();
        }, 600);
    }

    // --- Input Bar Listeners ---
    if (sendBtn && inputField) {
        sendBtn.addEventListener('click', () => {
            const val = inputField.value.trim();
            if (!val) return;
            addMessage('user', val);
            inputField.value = '';
            sendBtn.disabled = true;
            sendBtn.classList.remove('active');
            processCommand(val);
        });

        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendBtn.click();
            }
        });

        inputField.addEventListener('input', () => {
            const val = inputField.value.trim();
            if (val.length > 0) {
                sendBtn.disabled = false;
                sendBtn.classList.add('active');
            } else {
                sendBtn.disabled = true;
                sendBtn.classList.remove('active');
            }
        });
    }

    // --- Quick Nav Chips Click Listeners ---
    document.querySelectorAll('.chip-btn').forEach(chip => {
        chip.addEventListener('click', () => {
            const flow = chip.dataset.flow;
            if (flow) {
                const text = chip.textContent.trim();
                addMessage('user', text);
                processCommand(flow);
            }
        });
    });

    // --- Intro Screen CTA Buttons ---
    document.querySelectorAll('.intro-buttons .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action) {
                addMessage('user', action === 'about' ? 'More About Me' : 'See My Work');
                processCommand(action);
            }
        });
    });

    // --- Global Event Delegation for Bot Options ---
    if (chatMessages) {
        chatMessages.addEventListener('click', (e) => {
            const option = e.target.closest('.action-options li');
            if (option) {
                const action = option.dataset.action;
                const link = option.dataset.link;

                if (action) {
                    e.stopPropagation();
                    if (action === 'open_contact_form') {
                        alert('Send an email directly to shehryarahmadkhalil055@gmail.com or call +92 320 9389299!');
                        return;
                    }
                    const text = option.textContent.trim();
                    addMessage('user', text);
                    processCommand(action);
                } else if (link) {
                    e.stopPropagation();
                    window.open(link, '_blank');
                }
            }
        });
    }

    // --- Modal Handler ---
    function openModal(src, type) {
        if (!modal) return;
        modal.style.display = 'flex';
        if (type === 'image') {
            modalImg.style.display = 'block';
            modalIframe.style.display = 'none';
            modalImg.src = src;
        }
    }

    window.openModal = openModal;

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            modalImg.src = '';
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                modalImg.src = '';
            }
        });
    }

    console.log('Chatfolio Exact Replica initialized!');
});
