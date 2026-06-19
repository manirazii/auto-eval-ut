# 🎓 اسکریپت خودکار ارزشیابی اساتید دانشگاه تهران

![UT Logo](https://ut.ac.ir/sites/all/themes/uttheme/logo.png)

این اسکریپت به‌صورت خودکار فرم ارزشیابی اساتید دانشگاه تهران را برای شما پر می‌کند.  
**دیگر نیازی نیست ۱۴ سؤال تکراری را هر ترم دستی پاسخ دهید!**

---

## ✨ ویژگی‌ها

- ✅ پر کردن خودکار تمام ۱۴ سؤال
- 🎲 اعمال تغییرات تصادفی جزئی برای طبیعی‌تر شدن نمرات
- 🚀 امکان ثبت و رفتن به استاد بعدی با یک کلیک
- 🎯 انتخاب نمره دلخواه (۱۲ تا ۲۰)
- 📱 کاملاً سبک و بدون نیاز به نصب

---

## 📥 نصب (فقط ۲ قدم!)

### قدم ۱: اسکریپت را کپی کنید

روی دکمه زیر کلیک کنید تا کل اسکریپت کپی شود:

```javascript
javascript:(function(){'use strict';console.log('شروع اسکریپت ارزشیابی...');let DEFAULT_SCORE='15';const TOTAL_QUESTIONS=14,MIN_SCORE=12,MAX_SCORE=20,RANDOM_CHANCE=.3,RANDOM_RANGE=1;if(!document.querySelector('input[name="R1"]')){alert('صفحه ارزشیابی نیست!');return;}console.log('فرم پیدا شد');function generateScores(){const e=[];for(let t=0;t<TOTAL_QUESTIONS;t++){let s=parseInt(DEFAULT_SCORE);Math.random()<RANDOM_CHANCE&&(s=Math.min(MAX_SCORE,Math.max(MIN_SCORE,s+Math.floor(Math.random()*(RANDOM_RANGE*2+1))-RANDOM_RANGE))),e.push(s.toString())}return e}function simulateClick(e){if(!e)return!1;try{e.dispatchEvent(new MouseEvent('mousedown',{bubbles:!0,cancelable:!0,view:window})),e.dispatchEvent(new MouseEvent('mouseup',{bubbles:!0,cancelable:!0,view:window})),e.dispatchEvent(new MouseEvent('click',{bubbles:!0,cancelable:!0,view:window})),e.click(),e.dispatchEvent(new Event('change',{bubbles:!0})),e.dispatchEvent(new Event('input',{bubbles:!0}));if(typeof RA==='function'){try{RA({target:e,type:'click'})}catch(e){}}if(typeof RAKEY==='function'){try{RAKEY({target:e,type:'keyup'})}catch(e){}}}catch(e){return!1}return!0}function fillQuestions(e){let t=0;for(let s=1;s<=TOTAL_QUESTIONS;s++){const i=document.querySelectorAll(`input[name="R${s}"]`);if(i.length===0){console.warn('سوال '+s+': گزینه%E2%80%8Cای پیدا نشد');continue}const n=e[s-1];let l=null;for(let e of i){const t=e.id||'',s=t.match(/_(\d+)$/);if(s&&s[1]===n){l=e;break}}if(!l){console.warn('سوال '+s+': نمره '+n+' پیدا نشد');continue}const o=simulateClick(l);o&&(t++,console.log('سوال '+s+': نمره '+n+' انتخاب شد'))}return t}function findButton(e){const t=document.querySelectorAll('button, input[type="button"], input[type="submit"], a[role="button"]');for(let s of t){const t=(s.textContent||s.value||'').trim();if((t===e||t.includes(e))&&s.style.display!=='none'&&s.offsetParent!==null)return s}return null}function closeNotification(){try{const e=document.querySelectorAll('button');for(let t of e){const s=(t.textContent||'').trim();if(['OK','تأیید','بله','باشه','متوجه شدم','بستن'].includes(s)&&t.offsetParent!==null){simulateClick(t);console.log('نوتیفیکیشن بسته شد');return!0}}return!1}catch(e){return!1}}function waitForNextButton(e){return new Promise(t=>{let s=0;const i=setInterval(()=>{const n=findButton('پرسشنامه بعدي');if(n&&!n.disabled){clearInterval(i);console.log('دکمه بعدی فعال شد');t(n);return}s+=500;if(s>=e){clearInterval(i);console.log('زمان انتظار برای دکمه بعدی تمام شد');t(null)}},500)})}async function applyAndContinue(){const e=findButton('اعمال تغییرات');if(!e){console.log('دکمه اعمال تغییرات پیدا نشد');return!1}simulateClick(e);console.log('کلیک روی اعمال تغییرات');closeNotification();console.log('در انتظار فعال شدن دکمه بعدی...');const t=await waitForNextButton(10000);if(!t){console.log('دکمه بعدی فعال نشد');return!1}console.log('کلیک روی پرسشنامه بعدي');simulateClick(t);t.click();t.dispatchEvent(new MouseEvent('click',{bubbles:!0,cancelable:!0,view:window}));t.dispatchEvent(new Event('change',{bubbles:!0}));if(t.onclick){try{t.onclick()}catch(e){}}if(typeof vm_DoAct==='function'){try{vm_DoAct('AX9l','AX9l')}catch(e){}}console.log('کلیک روی پرسشنامه بعدي انجام شد');closeNotification();return!0}function justFill(){const e=generateScores();console.log('نمرات:',e.join(' '));const t=fillQuestions(e);console.log(t+' از '+TOTAL_QUESTIONS+' سوال پر شد');}async function fillAndSubmit(){const e=generateScores();console.log('نمرات:',e.join(' '));const t=fillQuestions(e);console.log(t+' از '+TOTAL_QUESTIONS+' سوال پر شد');if(t===0){console.log('هیچ سوالی پر نشد');return}const s=await applyAndContinue();if(s){console.log('ثبت و رفتن به استاد بعدی انجام شد');}else{console.log('خطا در ثبت');}}async function justNext(){const e=await applyAndContinue();if(e){console.log('رفتن به استاد بعدی انجام شد');}else{console.log('خطا');}}function createPanel(){const e=document.getElementById('evalPanel');if(e)e.remove();const t=document.createElement('div');t.id='evalPanel';t.style.cssText='position:fixed;bottom:30px;right:30px;background:#1a1a2e;color:#e0e0e0;padding:16px 20px;border-radius:10px;z-index:999999;font-family:Tahoma,Arial;min-width:200px;direction:rtl;border:1px solid #4a4a6a;box-shadow:0 4px 20px rgba(0,0,0,0.6);';t.innerHTML='<div style="font-size:14px;color:#88ccff;font-weight:bold;margin-bottom:8px;">ارزشیابی</div><select id="scoreSelect" style="width:100%;padding:5px 8px;border-radius:5px;font-size:12px;background:#2a2a4e;color:#e0e0e0;border:1px solid #4a4a6a;margin-bottom:6px;"><option value="20">20</option><option value="19">19</option><option value="18">18</option><option value="17">17</option><option value="16">16</option><option value="15" selected>15</option><option value="14">14</option><option value="13">13</option><option value="12">12</option></select><button id="fillBtn" style="width:100%;padding:5px;background:#2a6a4e;color:white;border:none;border-radius:5px;font-size:12px;cursor:pointer;margin-bottom:3px;">فقط پر کردن</button><button id="submitBtn" style="width:100%;padding:5px;background:#8a6a2a;color:white;border:none;border-radius:5px;font-size:12px;cursor:pointer;margin-bottom:3px;">پر کردن + ثبت + بعدی</button><button id="nextBtn" style="width:100%;padding:5px;background:#4a4a6a;color:white;border:none;border-radius:5px;font-size:12px;cursor:pointer;">فقط بعدی</button><div id="statusText" style="margin-top:6px;font-size:10px;color:#8888aa;text-align:center;">آماده</div>';document.body.appendChild(t);document.getElementById('fillBtn').addEventListener('click',function(){document.getElementById('statusText').textContent='در حال پر کردن...';const e=document.getElementById('scoreSelect').value;DEFAULT_SCORE=e;justFill();document.getElementById('statusText').textContent='انجام شد';});document.getElementById('submitBtn').addEventListener('click',async function(){const e=document.getElementById('statusText');e.textContent='در حال اجرا...';const t=document.getElementById('scoreSelect').value;DEFAULT_SCORE=t;await fillAndSubmit();e.textContent='انجام شد';});document.getElementById('nextBtn').addEventListener('click',async function(){const e=document.getElementById('statusText');e.textContent='در حال رفتن...';await justNext();e.textContent='انجام شد';});console.log('پنل ساخته شد');}if(document.readyState==='complete'){setTimeout(createPanel,1000);}else{window.addEventListener('load',()=>setTimeout(createPanel,1000));}let lastUrl=location.href;setInterval(()=>{if(location.href!==lastUrl){lastUrl=location.href;setTimeout(createPanel,1500);}},2000);})();nel,1500);}},2000);})();
```
### قدم ۲: ساخت بوکمارک

1. در مرورگر، روی نوار بوکمارک راست‌کلیک کنید.
2. گزینه **Add page** یا **افزودن صفحه** را انتخاب کنید.
3. Name: `ارزشیابی خودکار`
4. URL: متنی که کپی کردید را بچسبانید.
5. Save کنید.

---

## 🎯 نحوه استفاده

1. وارد صفحه ارزشیابی دانشگاه تهران شوید.
2. روی بوکمارک کلیک کنید.
3. پنل پایین سمت راست ظاهر می‌شود.
4. نمره دلخواه را انتخاب کنید.
5. یکی از دکمه‌ها را بزنید.

| دکمه | کاربرد |
|------|--------|
| فقط پر کردن | سوالات را پر می‌کند |
| پر کردن + ثبت + بعدی | همه کارها را انجام می‌دهد |
| فقط بعدی | به استاد بعدی می‌رود |
---

## ⚠️ توجه

استفاده از این اسکریپت به عهده خود کاربر است.

---

## 📝 مجوز

MIT License
