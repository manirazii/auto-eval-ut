(function() {
    'use strict';
    
    console.log('شروع اسکریپت ارزشیابی...');
    
    const TOTAL_QUESTIONS = 14;
    const MIN_SCORE = 12;
    const MAX_SCORE = 20;
    const RANDOM_CHANCE = 0.3;
    const RANDOM_RANGE = 1;
    const DEFAULT_SCORE = '15';
    
    if (!document.querySelector('input[name="R1"]')) {
        return;
    }
    console.log('فرم پیدا شد');
    
    function generateScores() {
        const scores = [];
        for (let i = 0; i < TOTAL_QUESTIONS; i++) {
            let score = parseInt(DEFAULT_SCORE);
            if (Math.random() < RANDOM_CHANCE) {
                const change = Math.floor(Math.random() * (RANDOM_RANGE * 2 + 1)) - RANDOM_RANGE;
                score = Math.min(MAX_SCORE, Math.max(MIN_SCORE, score + change));
            }
            scores.push(score.toString());
        }
        return scores;
    }
    
    function simulateClick(element) {
        if (!element) return false;
        
        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        
        element.click();
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('input', { bubbles: true }));
        
        if (typeof RA === 'function') {
            try { RA({ target: element, type: 'click' }); } catch(e) {}
        }
        if (typeof RAKEY === 'function') {
            try { RAKEY({ target: element, type: 'keyup' }); } catch(e) {}
        }
        
        return true;
    }
    
    function fillQuestions(scores) {
        let count = 0;
        
        for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
            const options = document.querySelectorAll(`input[name="R${i}"]`);
            if (options.length === 0) {
                console.warn('سوال ' + i + ': گزینه‌ای پیدا نشد');
                continue;
            }
            
            const targetScore = scores[i - 1];
            let target = null;
            for (let opt of options) {
                const id = opt.id || '';
                const match = id.match(/_(\d+)$/);
                if (match && match[1] === targetScore) {
                    target = opt;
                    break;
                }
            }
            
            if (!target) {
                console.warn('سوال ' + i + ': نمره ' + targetScore + ' پیدا نشد');
                continue;
            }
            
            const success = simulateClick(target);
            if (success) {
                count++;
                console.log('سوال ' + i + ': نمره ' + targetScore + ' انتخاب شد');
            }
        }
        
        return count;
    }
    
    function findButton(text) {
        const all = document.querySelectorAll('button, input[type="button"], input[type="submit"], a[role="button"]');
        for (let b of all) {
            const t = (b.textContent || b.value || '').trim();
            if (t === text || t.includes(text)) {
                const isHidden = b.style.display === 'none' || b.offsetParent === null;
                if (!isHidden) {
                    return b;
                }
            }
        }
        return null;
    }
    
    function closeNotification() {
        try {
            const btns = document.querySelectorAll('button');
            for (let b of btns) {
                const text = (b.textContent || '').trim();
                if (['OK', 'تأیید', 'بله', 'باشه', 'متوجه شدم', 'بستن'].includes(text)) {
                    if (b.offsetParent !== null) {
                        simulateClick(b);
                        console.log('نوتیفیکیشن بسته شد');
                        return true;
                    }
                }
            }
            return false;
        } catch(e) {
            return false;
        }
    }
    
    function waitForNextButton(maxWait) {
        return new Promise((resolve) => {
            let elapsed = 0;
            const interval = setInterval(() => {
                const next = findButton('پرسشنامه بعدي');
                if (next && !next.disabled) {
                    clearInterval(interval);
                    console.log('دکمه بعدی فعال شد');
                    resolve(next);
                    return;
                }
                elapsed += 500;
                if (elapsed >= maxWait) {
                    clearInterval(interval);
                    console.log('زمان انتظار برای دکمه بعدی تمام شد');
                    resolve(null);
                }
            }, 500);
        });
    }
    
    async function applyAndContinue() {
        const apply = findButton('اعمال تغییرات');
        if (!apply) {
            console.log('دکمه اعمال تغییرات پیدا نشد');
            return false;
        }
        
        simulateClick(apply);
        console.log('کلیک روی اعمال تغییرات');
        
        closeNotification();
        
        console.log('در انتظار فعال شدن دکمه بعدی...');
        const next = await waitForNextButton(10000);
        
        if (!next) {
            console.log('دکمه بعدی فعال نشد');
            return false;
        }
        
        console.log('کلیک روی پرسشنامه بعدي');
        
        simulateClick(next);
        next.click();
        next.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        next.dispatchEvent(new Event('change', { bubbles: true }));
        
        if (next.onclick) {
            try { next.onclick(); } catch(e) {}
        }
        
        if (typeof vm_DoAct === 'function') {
            try { vm_DoAct('AX9l', 'AX9l'); } catch(e) {}
        }
        
        console.log('کلیک روی پرسشنامه بعدي انجام شد');
        closeNotification();
        
        return true;
    }
    
    function justFill() {
        const scores = generateScores();
        console.log('نمرات:', scores.join(' '));
        const count = fillQuestions(scores);
        console.log(count + ' از ' + TOTAL_QUESTIONS + ' سوال پر شد');
    }
    
    async function fillAndSubmit() {
        const scores = generateScores();
        console.log('نمرات:', scores.join(' '));
        
        const count = fillQuestions(scores);
        console.log(count + ' از ' + TOTAL_QUESTIONS + ' سوال پر شد');
        
        if (count === 0) {
            console.log('هیچ سوالی پر نشد');
            return;
        }
        
        const success = await applyAndContinue();
        if (success) {
            console.log('ثبت و رفتن به استاد بعدی انجام شد');
        } else {
            console.log('خطا در ثبت');
        }
    }
    
    async function justNext() {
        const success = await applyAndContinue();
        if (success) {
            console.log('رفتن به استاد بعدی انجام شد');
        } else {
            console.log('خطا');
        }
    }
    
    function createPanel() {
        const old = document.getElementById('evalPanel');
        if (old) old.remove();
        
        const panel = document.createElement('div');
        panel.id = 'evalPanel';
        panel.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #1a1a2e;
            color: #e0e0e0;
            padding: 16px 20px;
            border-radius: 10px;
            z-index: 999999;
            font-family: Tahoma, Arial;
            min-width: 200px;
            direction: rtl;
            border: 1px solid #4a4a6a;
            box-shadow: 0 4px 20px rgba(0,0,0,0.6);
        `;
        
        panel.innerHTML = `
            <div style="font-size:14px;color:#88ccff;font-weight:bold;margin-bottom:8px;">ارزشیابی</div>
            
            <select id="scoreSelect" style="width:100%;padding:5px 8px;border-radius:5px;font-size:12px;background:#2a2a4e;color:#e0e0e0;border:1px solid #4a4a6a;margin-bottom:6px;">
                <option value="20">20</option>
                <option value="19">19</option>
                <option value="18">18</option>
                <option value="17">17</option>
                <option value="16">16</option>
                <option value="15" selected>15</option>
                <option value="14">14</option>
                <option value="13">13</option>
                <option value="12">12</option>
            </select>
            
            <button id="fillBtn" style="width:100%;padding:5px;background:#2a6a4e;color:white;border:none;border-radius:5px;font-size:12px;cursor:pointer;margin-bottom:3px;">
                فقط پر کردن
            </button>
            
            <button id="submitBtn" style="width:100%;padding:5px;background:#8a6a2a;color:white;border:none;border-radius:5px;font-size:12px;cursor:pointer;margin-bottom:3px;">
                پر کردن + ثبت + بعدی
            </button>
            
            <button id="nextBtn" style="width:100%;padding:5px;background:#4a4a6a;color:white;border:none;border-radius:5px;font-size:12px;cursor:pointer;">
                فقط بعدی
            </button>
            
            <div id="statusText" style="margin-top:6px;font-size:10px;color:#8888aa;text-align:center;">آماده</div>
        `;
        
        document.body.appendChild(panel);
        
        document.getElementById('fillBtn').addEventListener('click', function() {
            document.getElementById('statusText').textContent = 'در حال پر کردن...';
            justFill();
            document.getElementById('statusText').textContent = 'انجام شد';
        });
        
        document.getElementById('submitBtn').addEventListener('click', async function() {
            const status = document.getElementById('statusText');
            status.textContent = 'در حال اجرا...';
            await fillAndSubmit();
            status.textContent = 'انجام شد';
        });
        
        document.getElementById('nextBtn').addEventListener('click', async function() {
            const status = document.getElementById('statusText');
            status.textContent = 'در حال رفتن...';
            await justNext();
            status.textContent = 'انجام شد';
        });
        
        console.log('پنل ساخته شد');
    }
    
    if (document.readyState === 'complete') {
        setTimeout(createPanel, 1000);
    } else {
        window.addEventListener('load', () => setTimeout(createPanel, 1000));
    }
    
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(createPanel, 1500);
        }
    }, 2000);
    
})();
