"use strict";(()=>{var e={};e.id=744,e.ids=[744],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1274:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>d,patchFetch:()=>g,requestAsyncStorage:()=>m,routeModule:()=>u,serverHooks:()=>h,staticGenerationAsyncStorage:()=>l});var n={};r.r(n),r.d(n,{POST:()=>c});var o=r(9303),s=r(8716),i=r(670),a=r(7070),p=r(1443);async function c(e){try{let{topic:t,roles:r,followUp:n,settings:o}=await e.json();if(!t||!r||0===r.length)return a.NextResponse.json({error:"Missing topic or roles"},{status:400});let s={providerType:o?.providerType||"openai_compatible",authMode:o?.authMode||"bearer",baseUrl:o?.baseUrl?.trim()||"",apiKey:o?.apiKey?.trim()||"",model:o?.model?.trim()||"openrouter/auto"},i=[];for(let e of r){let r=await (0,p.VD)({settings:s,messages:[{role:"system",content:(0,p.dF)(e)},{role:"user",content:(0,p.Wb)(t,n)}],temperature:.7}),o=(0,p.wf)(r);i.push({id:`report-${e.id}-${Date.now()}`,roleId:e.id,speaker:e.name,summary:o.summary,content:o.content,reasoning:o.reasoning})}let c=await (0,p.VD)({settings:s,messages:[{role:"system",content:(0,p.sx)()},{role:"user",content:(0,p.k5)(t,i.map(e=>({speaker:e.speaker,content:e.content})),n)}],temperature:.6}),u=(0,p.wf)(c),m={speaker:"裁判长",summary:u.summary,content:u.content,reasoning:u.reasoning};return a.NextResponse.json({reports:i,finalDecision:m})}catch(e){return a.NextResponse.json({error:"Server error",detail:e instanceof Error?e.message:String(e)},{status:500})}}let u=new o.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"C:\\Users\\小智\\Desktop\\ai-council\\ai-council\\src\\app\\api\\chat\\route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:m,staticGenerationAsyncStorage:l,serverHooks:h}=u,d="/api/chat/route";function g(){return(0,i.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:l})}},1443:(e,t,r)=>{async function n(e){let t;let r=function(e,t){let r=(t||"").trim().replace(/\/+$/,"");return r?"openrouter"===e?" `https://openrouter.ai` "===r||" `https://openrouter.ai/api/v1` "===r||" `https://openrouter.ai/api/v1/chat/completions` "===r?" `https://openrouter.ai/api/v1/chat/completions` ":r.endsWith("/chat/completions")?r:r.endsWith("/api/v1")||r.endsWith("/v1")?`${r}/chat/completions`:`${r}/api/v1/chat/completions`:r.endsWith("/chat/completions")?r:r.endsWith("/api/v1")||r.endsWith("/v1")?`${r}/chat/completions`:`${r}/v1/chat/completions`:"openrouter"===e?" `https://openrouter.ai/api/v1/chat/completions` ":""}(e.settings.providerType,e.settings.baseUrl);if(!r)throw Error("缺少有效的 API 地址，请先在会议设置中填写。");let n=function(e,t){if(!t)throw Error("缺少 API Key，请先在右上角会议设置中填写。");return"raw"===e?{Authorization:t}:{Authorization:`Bearer ${t}`}}(e.settings.authMode,e.settings.apiKey),o=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json",...n,"HTTP-Referer":" `https://ai-council-03sb.onrender.com` ","X-OpenRouter-Title":"AI Council"},body:JSON.stringify({model:e.settings.model,messages:e.messages,temperature:e.temperature??.7})}),s=await o.text();if(!o.ok)throw Error(`上游模型请求失败 ${o.status} | URL: ${r} | ${s.slice(0,300)}`);try{t=JSON.parse(s)}catch{throw Error(`上游返回了非 JSON 内容 | URL: ${r} | ${s.slice(0,300)}`)}return t?.choices?.[0]?.message?.content||""}function o(e){let t=e.indexOf("## 推演过程");if(-1===t)return{summary:e.slice(0,120).trim()||"暂无摘要",content:e,reasoning:"## 推演过程\n暂无单独推演内容。"};let r=e.slice(0,t).trim(),n=e.slice(t).trim();return{summary:r.replace(/[#>*`-]/g," ").replace(/\s+/g," ").trim().slice(0,100)||"暂无摘要",content:r,reasoning:n}}function s(e){return`
你正在参加一个企业决策会议。

你的角色名称：${e.name}
你的角色设定：${e.prompt}

请始终站在该角色立场发言，不要中立，不要模糊。
必须给出明确分析理由，而不是空泛表态。
输出必须使用中文 Markdown。
请严格按以下结构输出：

## 核心判断
先给出明确结论。

## 关键分析理由
至少给出 3 条具体理由，每条都要解释为什么。

## 建议
给出结构化建议，使用列表。

## 风险与补充说明
说明你最担心的点。

## 推演过程
写出你形成判断的分析路径，不能只重复结论。
`.trim()}function i(e,t){return`
当前议题：
${e}

${t?`主持人补充信息：
${t}
`:""}

请围绕当前议题给出完整判断。
`.trim()}function a(){return`
你是这场会议的裁判长。
你需要阅读所有角色观点，做出折中、清晰、可执行的最终裁决。

输出必须使用中文 Markdown。
请严格按以下结构输出：

## 最终裁决
先给出拍板结论。

## 最终方案
用列表给出执行方案。

## 为什么这样定
解释裁决逻辑，必须明确引用不同角色的观点差异。

## 推演过程
简要说明你如何平衡各方意见。
`.trim()}function p(e,t,r){return`
当前议题：
${e}

${r?`主持人补充信息：
${r}
`:""}

以下是各角色发言：

${t.map((e,t)=>`
### 角色 ${t+1}：${e.speaker}
${e.content}
`).join("\n")}

请综合所有观点给出最终裁决。
`.trim()}r.d(t,{VD:()=>n,Wb:()=>i,dF:()=>s,k5:()=>p,sx:()=>a,wf:()=>o})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[276,972],()=>r(1274));module.exports=n})();