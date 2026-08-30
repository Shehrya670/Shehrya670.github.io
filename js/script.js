document.addEventListener('DOMContentLoaded', () => {
    // --- DOM References ---
    const introScreen = document.getElementById('intro-screen');
    const chatWindow = document.getElementById('chat-window');
    const chatMessages = document.getElementById('chat-messages');
    const chatFooter = document.getElementById('chat-footer');
    const inputField = document.getElementById('chat-input');
    const sendBtn = document.getElementById('sendBtn');
    const menuToggle = document.getElementById('menuToggle');
    const primaryNav = document.getElementById('primary-nav');
    const toggleIcon = document.getElementById('toggleIcon');
    const modal = document.getElementById('media-modal');
    const modalImg = document.getElementById('modal-image');
    const modalIframe = document.getElementById('modal-iframe');
    const modalClose = document.querySelector('.modal-close');

    let isMenuOpen = false;
    let isProcessing = false;

    // --- Helpers ---
    function scrollToBottom() {
        chatWindow.scrollTop = chatWindow.scrollHeight;
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

        // Clone the content deeply
        const clone = template.cloneNode(true);
        clone.style.display = 'block';
        
        // Process Star Ratings in the clone
        clone.querySelectorAll('.stars').forEach(el => {
            const rating = parseInt(el.dataset.rating) || 0;
            const full = '★'.repeat(rating);
            const empty = '☆'.repeat(5 - rating);
            el.textContent = full + empty;
            el.style.color = '#f1c40f';
        });

        // Process YouTube embeds
        clone.querySelectorAll('.youtube-embed').forEach(el => {
            const id = el.dataset.id;
            if (id) {
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${id}`;
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.position = 'absolute';
                iframe.style.top = '0';
                iframe.style.left = '0';
                el.style.position = 'relative';
                el.style.paddingBottom = '56.25%';
                el.style.height = '0';
                el.appendChild(iframe);
            }
        });

        // Process Gallery Images (add click listeners)
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

    // Global Event Delegation fallback for chat options & gallery images
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

    // --- Core Processor ---
    function processCommand(input) {
        if (isProcessing) return;
        isProcessing = true;

        const lower = input.toLowerCase().trim();
        
        // Check if intro is visible, hide it
        if (introScreen.style.display !== 'none') {
            introScreen.style.display = 'none';
            chatWindow.style.display = 'flex';
            chatFooter.style.display = 'flex';
        }

        // Handle custom queries (age, cv, education, experience, awards)
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

        if (lower.includes('award') || lower.includes('certif')) {
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

        // Fallback to exact match on flow name
        if (!matchedFlow) {
            document.querySelectorAll('.flow-section').forEach(section => {
                if (lower === section.dataset.flow) {
                    matchedFlow = section.dataset.flow;
                }
            });
        }

        // Show typing indicator
        showTyping();

        setTimeout(() => {
            hideTyping();
            if (matchedFlow) {
                renderFlow(matchedFlow, lower);
            } else {
                // Fallback message
                addMessage('bot', `I couldn't find info on "${input}". Try asking about <strong>about</strong>, <strong>experience</strong>, <strong>skills</strong>, <strong>projects</strong>, or <strong>contact</strong>.`, true);
            }
            isProcessing = false;
            scrollToBottom();
        }, 600);
    }

    // --- Event Listeners ---

    // Send Button
    sendBtn.addEventListener('click', () => {
        const val = inputField.value.trim();
        if (!val) return;
        addMessage('user', val);
        inputField.value = '';
        sendBtn.disabled = true;
        sendBtn.classList.remove('active');
        processCommand(val);
    });

    // Enter Key
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

    // Input Validation (Enable/Disable Send)
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

    // Toggle Navigation Menu
    menuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        primaryNav.style.display = isMenuOpen ? 'flex' : 'none';
        menuToggle.classList.toggle('active');
        toggleIcon.style.transform = isMenuOpen ? 'rotate(45deg)' : 'rotate(0)';
    });

    // Navigation Chips Click
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const flow = chip.dataset.flow;
            if (flow) {
                // Close menu
                isMenuOpen = false;
                primaryNav.style.display = 'none';
                menuToggle.classList.remove('active');
                toggleIcon.style.transform = 'rotate(0)';
                
                // Add user message showing chip text
                const text = chip.textContent.trim();
                addMessage('user', text);
                processCommand(flow);
            }
        });
    });

    // Intro Screen Buttons
    document.querySelectorAll('.intro-actions .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action) {
                addMessage('user', action === 'about' ? 'More About Me' : 'See My Work');
                processCommand(action);
            }
        });
    });

    // --- Modal Logic ---
    function openModal(src, type) {
        modal.style.display = 'flex';
        if (type === 'image') {
            modalImg.style.display = 'block';
            modalIframe.style.display = 'none';
            modalImg.src = src;
        } else if (type === 'video') {
            modalImg.style.display = 'none';
            modalIframe.style.display = 'block';
            modalIframe.src = src;
        }
    }

    window.openModal = openModal;

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
        modalIframe.src = '';
        modalImg.src = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            modalIframe.src = '';
            modalImg.src = '';
        }
    });

    // --- Theme Switcher ---
    const originalProcess = processCommand;
    processCommand = function(input) {
        const lower = input.toLowerCase().trim();
        if (lower.startsWith('theme ')) {
            const color = lower.split(' ')[1];
            const themeLink = document.getElementById('theme-style');
            if (themeLink && ['purple','blue','green','pink'].includes(color)) {
                themeLink.href = `css/skins/${color}.css`;
                addMessage('user', input);
                addMessage('bot', `✅ Theme switched to <strong>${color}</strong>!`, true);
                return;
            }
        }
        originalProcess(input);
    };
    window.processCommand = processCommand;

    // Initial state: Intro visible, Chat hidden.
    chatWindow.style.display = 'none';
    chatFooter.style.display = 'none';

    console.log('Chatfolio UI Loaded for Shehryar Ahmad Khalil! Try typing "about", "experience", "skills", "projects", or "theme blue".');
});
