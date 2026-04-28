import React, { useState, useCallback } from "react";

const SLEEPER_BASE = "https://api.sleeper.app/v1";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

  :root {
    --green: #00d97e;
    --green-dim: #00a85a;
    --bg: #0d0f14;
    --bg2: #13161e;
    --bg3: #1a1e28;
    --bg4: #222736;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.13);
    --text: #f0f2f8;
    --text2: #8892a4;
    --text3: #545e70;
    --red: #ff4d4d;
    --amber: #ffb84d;
    --blue: #4d9fff;
    --purple: #a78bfa;
    --font-display: 'Barlow Condensed', sans-serif;
    --font-body: 'Barlow', sans-serif;
    --bottom-nav-height: 64px;
  }

  html, body { height: 100%; overflow-x: hidden; }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); font-size: 14px; }

  .app { display: flex; flex-direction: column; min-height: 100vh; max-width: 600px; margin: 0 auto; }

  .topbar {
    background: var(--bg2);
    border-bottom: 1px solid var(--border);
    padding: 0 16px;
    height: 52px;
    display: flex;
    align-items: center;
    gap: 10px;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .logo { font-family: var(--font-display); font-size: 20px; font-weight: 700; letter-spacing: .04em; color: var(--green); text-transform: uppercase; }
  .logo span { color: var(--text2); }
  .user-badge { margin-left: auto; background: rgba(0,217,126,.15); color: var(--green); font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 600px;
    height: var(--bottom-nav-height);
    background: var(--bg2);
    border-top: 1px solid var(--border);
    display: flex;
    z-index: 100;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    cursor: pointer;
    border: none;
    background: transparent;
    color: var(--text3);
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 500;
    transition: color .15s;
    padding: 8px 0;
  }

  .nav-item.active { color: var(--green); }
  .nav-item:disabled { opacity: .35; cursor: default; }
  .nav-item svg { width: 22px; height: 22px; }

  .main { flex: 1; padding: 16px; padding-bottom: calc(var(--bottom-nav-height) + 16px); }

  .page { animation: fadeUp .2s ease; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .hero { padding: 40px 8px 24px; text-align: center; }
  .hero-title { font-family: var(--font-display); font-size: 48px; font-weight: 700; text-transform: uppercase; letter-spacing: .02em; line-height: 1; margin-bottom: 8px; }
  .hero-title .accent { color: var(--green); }
  .hero-sub { color: var(--text2); font-size: 14px; margin-bottom: 24px; }

  .search-row { display: flex; gap: 8px; }
  .search-input {
    flex: 1;
    background: var(--bg3);
    border: 1px solid var(--border2);
    border-radius: 12px;
    padding: 14px 16px;
    color: var(--text);
    font-size: 16px;
    font-family: var(--font-body);
    outline: none;
  }
  .search-input:focus { border-color: var(--green); }
  .search-input::placeholder { color: var(--text3); }

  .btn-search {
    background: var(--green);
    color: #000;
    border: none;
    border-radius: 12px;
    padding: 14px 20px;
    font-size: 15px;
    font-weight: 700;
    font-family: var(--font-body);
    cursor: pointer;
  }

  .features { display: flex; flex-direction: column; gap: 10px; margin-top: 32px; }
  .feature-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; display: flex; align-items: flex-start; gap: 12px; }
  .feature-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
  .feature-title { font-family: var(--font-display); font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; margin-bottom: 3px; }
  .feature-desc { font-size: 12px; color: var(--text2); line-height: 1.5; }

  .error-banner { background: rgba(255,77,77,.1); border: 1px solid rgba(255,77,77,.3); color: var(--red); padding: 12px 16px; border-radius: 10px; margin-top: 14px; font-size: 13px; }

  .section-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .section-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
  .section-title .dim { color: var(--text3); margin-right: 6px; }

  .badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
  .badge-green { background: rgba(0,217,126,.15); color: var(--green); }
  .badge-amber { background: rgba(255,184,77,.15); color: var(--amber); }
  .badge-red { background: rgba(255,77,77,.15); color: var(--red); }
  .badge-blue { background: rgba(77,159,255,.15); color: var(--blue); }
  .badge-gray { background: var(--bg3); color: var(--text2); }

  .league-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; cursor: pointer; transition: border-color .15s; }
  .league-card:active { border-color: var(--green); }
  .league-card-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; margin-bottom: 4px; }
  .league-card-sub { font-size: 12px; color: var(--text2); margin-bottom: 8px; }
  .league-card-tags { display: flex; gap: 6px; flex-wrap: wrap; }

  .back-btn { display: flex; align-items: center; gap: 6px; color: var(--green); font-size: 13px; font-weight: 600; cursor: pointer; margin-bottom: 12px; border: none; background: transparent; font-family: var(--font-body); padding: 0; }

  .detail-title { font-family: var(--font-display); font-size: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; }
  .detail-sub { font-size: 12px; color: var(--text2); margin-top: 3px; margin-bottom: 14px; }

  .tab-row { display: flex; background: var(--bg3); border-radius: 10px; padding: 3px; gap: 2px; margin-bottom: 14px; }
  .tab-btn { flex: 1; padding: 9px 6px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; background: transparent; color: var(--text2); font-family: var(--font-body); transition: all .15s; text-align: center; }
  .tab-btn.active { background: var(--bg); color: var(--text); }

  .team-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; background: var(--bg3); margin-bottom: 6px; cursor: pointer; border: 1px solid transparent; transition: all .15s; }
  .team-row:active { border-color: var(--green); background: rgba(0,217,126,.08); }

  .rank { min-width: 24px; height: 24px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 12px; font-weight: 700; flex-shrink: 0; }
  .rank-1 { background: rgba(255,184,77,.2); color: var(--amber); }
  .rank-2 { background: rgba(180,180,180,.15); color: #aaa; }
  .rank-3 { background: rgba(180,120,80,.2); color: #c87941; }
  .rank-x { background: var(--bg4); color: var(--text2); }

  .team-av { width: 34px; height: 34px; border-radius: 8px; background: var(--bg4); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 700; font-size: 13px; color: var(--green); flex-shrink: 0; overflow: hidden; }
  .team-av img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
  .team-name { font-size: 13px; font-weight: 600; }
  .team-rec { font-size: 11px; color: var(--text2); margin-top: 1px; }

  .roster-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .roster-title { font-family: var(--font-display); font-size: 17px; font-weight: 700; text-transform: uppercase; }
  .pos-label { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: .06em; margin: 10px 0 5px; }

  .player-chip { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--bg3); border-radius: 10px; margin-bottom: 6px; cursor: pointer; transition: background .15s; }
  .player-chip:active { background: var(--bg4); }
  .pos-dot { width: 30px; height: 30px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; flex-shrink: 0; }
  .pos-QB { background: rgba(255,77,77,.2); color: var(--red); }
  .pos-RB { background: rgba(0,217,126,.2); color: var(--green); }
  .pos-WR { background: rgba(77,159,255,.2); color: var(--blue); }
  .pos-TE { background: rgba(255,184,77,.2); color: var(--amber); }
  .pos-K  { background: rgba(167,139,250,.2); color: var(--purple); }
  .pos-DEF { background: rgba(255,255,255,.08); color: var(--text2); }

  .player-info { flex: 1; min-width: 0; }
  .player-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .player-meta { font-size: 11px; color: var(--text2); margin-top: 2px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .inj-tag { color: var(--red); font-weight: 600; }
  .stat-line { font-size: 10px; color: var(--text3); margin-top: 2px; }

  .player-stats { text-align: right; flex-shrink: 0; }
  .stat-pts { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--green); line-height: 1; }
  .stat-pts span { font-size: 9px; color: var(--text3); margin-left: 1px; }
  .stat-proj { font-size: 10px; color: var(--text2); margin-top: 2px; }

  .scoring-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .scoring-item { background: var(--bg3); border-radius: 8px; padding: 10px 12px; }
  .scoring-label { font-size: 10px; color: var(--text2); text-transform: uppercase; letter-spacing: .05em; margin-bottom: 3px; }
  .scoring-val { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--green); }
  .settings-title { font-family: var(--font-display); font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--text2); margin-bottom: 8px; margin-top: 16px; }

  .ai-wrap { display: flex; flex-direction: column; height: calc(100vh - 52px - var(--bottom-nav-height) - 32px); }
  .ai-hdr { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; flex-shrink: 0; }
  .ai-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; flex-shrink: 0; }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.3} }
  .ai-hdr-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
  .ai-league-tag { margin-left: auto; font-size: 11px; color: var(--text3); }

  .ai-msgs { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-bottom: 8px; }
  .msg { max-width: 88%; padding: 10px 13px; border-radius: 12px; font-size: 13px; line-height: 1.6; white-space: pre-wrap; }
  .msg-user { align-self: flex-end; background: rgba(0,217,126,.12); border: 1px solid rgba(0,217,126,.2); }
  .msg-ai { align-self: flex-start; background: var(--bg3); border: 1px solid var(--border); }

  .thinking { display: flex; gap: 4px; align-items: center; padding: 4px 0; }
  .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--text3); animation: bk 1.2s infinite; }
  .dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
  @keyframes bk{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}

  .quick-prompts { display: flex; gap: 6px; overflow-x: auto; padding: 8px 0; scrollbar-width: none; flex-shrink: 0; }
  .quick-prompts::-webkit-scrollbar { display: none; }
  .quick-btn { flex-shrink: 0; padding: 6px 12px; background: var(--bg3); border: 1px solid var(--border2); border-radius: 20px; color: var(--text2); font-size: 12px; cursor: pointer; font-family: var(--font-body); white-space: nowrap; }

  .ai-input-wrap { display: flex; gap: 8px; padding-top: 8px; border-top: 1px solid var(--border); flex-shrink: 0; }
  .ai-input { flex: 1; background: var(--bg3); border: 1px solid var(--border2); border-radius: 10px; padding: 12px 14px; color: var(--text); font-size: 14px; font-family: var(--font-body); outline: none; resize: none; max-height: 100px; }
  .ai-input:focus { border-color: var(--green); }
  .btn-send { background: var(--green); color: #000; border: none; border-radius: 10px; padding: 12px 16px; font-size: 14px; font-weight: 700; font-family: var(--font-body); cursor: pointer; flex-shrink: 0; }
  .btn-send:disabled { opacity: .4; }

  .no-league-warn { background: rgba(255,184,77,.06); border: 1px solid rgba(255,184,77,.2); border-radius: 10px; padding: 12px 14px; color: var(--amber); font-size: 13px; margin-bottom: 12px; }

  .spinner { width: 18px; height: 18px; border: 2px solid var(--border2); border-top-color: var(--green); border-radius: 50%; animation: spin .7s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-center { display: flex; justify-content: center; align-items: center; padding: 48px; flex-direction: column; gap: 10px; color: var(--text2); font-size: 13px; }

  .empty { text-align: center; padding: 32px 16px; color: var(--text3); font-size: 13px; }
  .divider { height: 1px; background: var(--border); margin: 16px 0; }

  .about-hero { text-align: center; padding: 32px 8px 24px; }
  .about-logo { font-family: var(--font-display); font-size: 42px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--green); margin-bottom: 6px; }
  .about-logo span { color: var(--text2); }
  .about-tagline { font-size: 14px; color: var(--text2); line-height: 1.5; }
  .about-section { margin-bottom: 20px; }
  .about-section-title { font-family: var(--font-display); font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--green); margin-bottom: 10px; }
  .step-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; margin-bottom: 8px; display: flex; gap: 14px; align-items: flex-start; }
  .step-num { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--green); flex-shrink: 0; line-height: 1; width: 24px; }
  .step-title { font-size: 13px; font-weight: 600; margin-bottom: 3px; }
  .step-desc { font-size: 12px; color: var(--text2); line-height: 1.5; }
  .tip-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; display: flex; gap: 10px; align-items: flex-start; }
  .tip-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
  .tip-text { font-size: 12px; color: var(--text2); line-height: 1.5; }
  .disclaimer { background: var(--bg3); border-radius: 10px; padding: 12px 14px; font-size: 11px; color: var(--text3); line-height: 1.6; text-align: center; margin-top: 8px; }

  .te-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.7); z-index: 200; animation: fadeIn .2s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .te-sheet { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 600px; background: var(--bg2); border-radius: 20px 20px 0 0; z-index: 201; height: 92vh; display: flex; flex-direction: column; animation: slideUp .25s ease; }
  @keyframes slideUp { from{transform:translateX(-50%) translateY(100%)} to{transform:translateX(-50%) translateY(0)} }
  .te-handle { width: 36px; height: 4px; background: var(--bg4); border-radius: 2px; margin: 12px auto 0; flex-shrink: 0; }
  .te-hdr { padding: 14px 16px 12px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .te-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
  .te-close { background: var(--bg3); border: none; color: var(--text2); width: 28px; height: 28px; border-radius: 14px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .te-body { flex: 1; overflow-y: auto; padding: 14px 16px; display: flex; flex-direction: column; gap: 14px; }
  .te-footer { padding: 12px 16px; border-top: 1px solid var(--border); flex-shrink: 0; }
  .te-section-title { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 8px; font-weight: 600; }
  .te-team-picker { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; padding-bottom: 2px; }
  .te-team-picker::-webkit-scrollbar { display: none; }
  .te-team-btn { flex-shrink: 0; padding: 6px 12px; background: var(--bg3); border: 1px solid var(--border2); border-radius: 20px; color: var(--text2); font-size: 12px; cursor: pointer; font-family: var(--font-body); white-space: nowrap; transition: all .15s; }
  .te-team-btn.active { background: rgba(77,159,255,.15); border-color: var(--blue); color: var(--blue); }
  .te-side { background: var(--bg3); border-radius: 12px; padding: 12px; }
  .te-side-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 8px; }
  .te-side-give .te-side-label { color: var(--red); }
  .te-side-get .te-side-label { color: var(--green); }
  .te-player { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 8px; margin-bottom: 4px; cursor: pointer; border: 1px solid transparent; transition: all .15s; background: var(--bg2); }
  .te-player.sel-give { border-color: var(--red); background: rgba(255,77,77,.08); }
  .te-player.sel-get { border-color: var(--green); background: rgba(0,217,126,.08); }
  .te-player-name { font-size: 12px; font-weight: 500; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .te-player-proj { font-size: 11px; color: var(--text2); flex-shrink: 0; }
  .te-check { width: 18px; height: 18px; border-radius: 9px; border: 1.5px solid var(--border2); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; }
  .te-check.checked-give { background: var(--red); border-color: var(--red); color: #fff; }
  .te-check.checked-get { background: var(--green); border-color: var(--green); color: #000; }
  .te-picks { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
  .te-pick { padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; border: 1px solid var(--border2); background: var(--bg2); color: var(--text2); transition: all .15s; }
  .te-pick.sel-give { border-color: var(--red); background: rgba(255,77,77,.1); color: var(--red); }
  .te-pick.sel-get { border-color: var(--green); background: rgba(0,217,126,.1); color: var(--green); }
  .te-summary { background: var(--bg3); border-radius: 10px; padding: 10px 12px; font-size: 12px; color: var(--text2); line-height: 1.8; }
  .te-analyze-btn { width: 100%; padding: 14px; background: var(--green); color: #000; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; font-family: var(--font-body); cursor: pointer; }
  .te-analyze-btn:disabled { opacity: .35; cursor: not-allowed; }
`;

const POS_MAP = { QB:"QB", RB:"RB", WR:"WR", TE:"TE", K:"K", DEF:"DEF", DL:"DL", LB:"LB", DB:"DB" };

const SCORING_LABELS = {
  pass_yd:"Pass Yards", pass_td:"Pass TD", pass_int:"INT",
  rush_yd:"Rush Yards", rush_td:"Rush TD", rec:"Reception",
  rec_yd:"Rec Yards", rec_td:"Rec TD", fum_lost:"Fumble Lost",
  bonus_rec_yd_100:"100+ Rec Yds", bonus_rush_yd_100:"100+ Rush Yds",
  bonus_pass_yd_300:"300+ Pass Yds", st_td:"ST TD", sack:"Sack",
};

const SCORING_UNITS = { pass_yd:"/yd", rush_yd:"/yd", rec_yd:"/yd" };
const PICK_ROUNDS = ["1st Round Pick", "2nd Round Pick", "3rd Round Pick"];

async function sleeperFetch(path) {
  const r = await fetch(`${SLEEPER_BASE}${path}`);
  if (!r.ok) throw new Error(`Sleeper error ${r.status}`);
  return r.json();
}

function initials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??";
}

function NavIcon({ id }) {
  if (id === "home") return React.createElement("svg", { viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2" },
    React.createElement("path", { d:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" }),
    React.createElement("polyline", { points:"9 22 9 12 15 12 15 22" }));
  if (id === "leagues") return React.createElement("svg", { viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2" },
    React.createElement("rect", { x:"2", y:"3", width:"20", height:"14", rx:"2" }),
    React.createElement("line", { x1:"8", y1:"21", x2:"16", y2:"21" }),
    React.createElement("line", { x1:"12", y1:"17", x2:"12", y2:"21" }));
  if (id === "roster") return React.createElement("svg", { viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2" },
    React.createElement("path", { d:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" }),
    React.createElement("circle", { cx:"9", cy:"7", r:"4" }),
    React.createElement("path", { d:"M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" }));
  if (id === "ai") return React.createElement("svg", { viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2" },
    React.createElement("path", { d:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" }));
  if (id === "about") return React.createElement("svg", { viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2" },
    React.createElement("circle", { cx:"12", cy:"12", r:"10" }),
    React.createElement("line", { x1:"12", y1:"8", x2:"12", y2:"12" }),
    React.createElement("line", { x1:"12", y1:"16", x2:"12.01", y2:"16" }));
  return null;
}

function TradeEvaluator({ myRoster, leagueRosters, leagueUsers, players, playerProjections, multiWeekProjections, currentWeek, userData, onAnalyze, onClose }) {
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [givePlayers, setGivePlayers] = useState([]);
  const [getPlayers, setGetPlayers] = useState([]);
  const [givePicks, setGivePicks] = useState([]);
  const [getPicks, setGetPicks] = useState([]);

  const opponents = leagueRosters.filter(r => r.owner_id !== userData?.user_id);
  const selectedRoster = leagueRosters.find(r => r.roster_id === selectedTeamId);
  const selectedUser = leagueUsers.find(u => selectedRoster && u.user_id === selectedRoster.owner_id) || {};

  function toggleGivePlayer(id) { setGivePlayers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]); }
  function toggleGetPlayer(id) { setGetPlayers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]); }
  function toggleGivePick(pick) { setGivePicks(prev => prev.includes(pick) ? prev.filter(x => x !== pick) : [...prev, pick]); }
  function toggleGetPick(pick) { setGetPicks(prev => prev.includes(pick) ? prev.filter(x => x !== pick) : [...prev, pick]); }

  function projStr(id) {
    const pr = playerProjections[id] || {};
    if (pr.pts_ppr == null) return "";
    return `${Number(pr.pts_ppr).toFixed(1)}pts`;
  }

  function playerLine(id) {
    const p = players[id];
    if (!p) return id;
    const mw = multiWeekProjections[id] || {};
    const pr = playerProjections[id] || {};
    const proj3 = [currentWeek, currentWeek+1, currentWeek+2].reduce((s, w) => s + (mw[w] || pr.pts_ppr || 0), 0);
    return `${p.first_name} ${p.last_name}(${p.position},${p.team||"FA"})[proj_this_wk:${(pr.pts_ppr||0).toFixed(1)},proj_next3_total:${proj3.toFixed(1)}]`;
  }

  const canAnalyze = (givePlayers.length > 0 || givePicks.length > 0) && (getPlayers.length > 0 || getPicks.length > 0);

  function handleAnalyze() {
    const giveDesc = [...givePlayers.map(playerLine), ...givePicks].join(", ");
    const getDesc = [...getPlayers.map(playerLine), ...getPicks].join(", ");
    const otherTeam = selectedUser.display_name || "the other team";
    const msg = `Evaluate this specific trade: I am giving ${giveDesc} TO ${otherTeam} in exchange for ${getDesc}. Give a full breakdown - value exchange using projection data, roster impact for both teams, who wins this trade and why, and a clear ACCEPT or DECLINE verdict.`;
    onAnalyze(msg);
    onClose();
  }

  return (
    <>
      <div className="te-overlay" onClick={onClose} />
      <div className="te-sheet">
        <div className="te-handle" />
        <div className="te-hdr">
          <div className="te-title">Trade Evaluator</div>
          <button className="te-close" onClick={onClose}>x</button>
        </div>
        <div className="te-body">
          <div>
            <div className="te-section-title">Select opponent</div>
            <div className="te-team-picker">
              {opponents.map(r => {
                const u = leagueUsers.find(u => u.user_id === r.owner_id) || {};
                return (
                  <button key={r.roster_id} className={`te-team-btn ${selectedTeamId === r.roster_id ? "active" : ""}`}
                    onClick={() => { setSelectedTeamId(r.roster_id); setGetPlayers([]); setGetPicks([]); }}>
                    {u.display_name || u.username || `Team ${r.roster_id}`}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="te-side te-side-give">
            <div className="te-side-label">You give up</div>
            {(myRoster?.players || []).map(id => {
              const p = players[id];
              if (!p) return null;
              const sel = givePlayers.includes(id);
              return (
                <div key={id} className={`te-player ${sel ? "sel-give" : ""}`} onClick={() => toggleGivePlayer(id)}>
                  <div className={`pos-dot pos-${(p.position||"").toUpperCase()}`} style={{ width:24, height:24, fontSize:8 }}>{POS_MAP[p.position]||p.position}</div>
                  <div className="te-player-name">{p.first_name} {p.last_name}</div>
                  <div className="te-player-proj">{projStr(id)}</div>
                  <div className={`te-check ${sel ? "checked-give" : ""}`}>{sel ? "x" : ""}</div>
                </div>
              );
            })}
            <div className="te-picks">
              <div className="te-section-title" style={{ width:"100%", marginTop:8 }}>Add draft picks</div>
              {PICK_ROUNDS.map(pick => (
                <div key={pick} className={`te-pick ${givePicks.includes(pick) ? "sel-give" : ""}`} onClick={() => toggleGivePick(pick)}>{pick}</div>
              ))}
            </div>
          </div>
          <div className="te-side te-side-get">
            <div className="te-side-label">You receive</div>
            {!selectedTeamId ? (
              <div style={{ fontSize:12, color:"var(--text3)", padding:"8px 0" }}>Select an opponent above first</div>
            ) : (
              <>
                {(selectedRoster?.players || []).map(id => {
                  const p = players[id];
                  if (!p) return null;
                  const sel = getPlayers.includes(id);
                  return (
                    <div key={id} className={`te-player ${sel ? "sel-get" : ""}`} onClick={() => toggleGetPlayer(id)}>
                      <div className={`pos-dot pos-${(p.position||"").toUpperCase()}`} style={{ width:24, height:24, fontSize:8 }}>{POS_MAP[p.position]||p.position}</div>
                      <div className="te-player-name">{p.first_name} {p.last_name}</div>
                      <div className="te-player-proj">{projStr(id)}</div>
                      <div className={`te-check ${sel ? "checked-get" : ""}`}>{sel ? "x" : ""}</div>
                    </div>
                  );
                })}
                <div className="te-picks">
                  <div className="te-section-title" style={{ width:"100%", marginTop:8 }}>Add draft picks</div>
                  {PICK_ROUNDS.map(pick => (
                    <div key={pick} className={`te-pick ${getPicks.includes(pick) ? "sel-get" : ""}`} onClick={() => toggleGetPick(pick)}>{pick}</div>
                  ))}
                </div>
              </>
            )}
          </div>
          {canAnalyze && (
            <div className="te-summary">
              <span style={{ color:"var(--red)", fontWeight:600 }}>Giving: </span>
              {[...givePlayers.map(id => { const p=players[id]; return p?`${p.first_name} ${p.last_name}`:id; }), ...givePicks].join(", ")}
              {"\n"}
              <span style={{ color:"var(--green)", fontWeight:600 }}>Receiving: </span>
              {[...getPlayers.map(id => { const p=players[id]; return p?`${p.first_name} ${p.last_name}`:id; }), ...getPicks].join(", ")}
            </div>
          )}
        </div>
        <div className="te-footer">
          <button className="te-analyze-btn" disabled={!canAnalyze} onClick={handleAnalyze}>
            Analyze This Trade
          </button>
        </div>
      </div>
    </>
  );
}

function PlayerChip({ id, players, playerStats, playerProjections, dim, onTap }) {
  const p = players[id];
  if (!p) return null;
  const name = `${p.first_name || ""} ${p.last_name || ""}`.trim();
  const pos = (p.position || "").toUpperCase();
  const team = p.team || "FA";
  const inj = p.injury_status;
  const st = playerStats[id] || {};
  const pr = playerProjections[id] || {};

  const statParts = [];
  if (st.pass_yd) statParts.push(`${Math.round(st.pass_yd)}pyds`);
  if (st.pass_td) statParts.push(`${st.pass_td}ptd`);
  if (st.rush_yd) statParts.push(`${Math.round(st.rush_yd)}ryds`);
  if (st.rush_td) statParts.push(`${st.rush_td}rtd`);
  if (st.rec) statParts.push(`${st.rec}rec`);
  if (st.rec_yd) statParts.push(`${Math.round(st.rec_yd)}rcvyds`);
  if (st.rec_td) statParts.push(`${st.rec_td}td`);

  return (
    <div className="player-chip" style={{ opacity: dim ? 0.65 : 1 }} onClick={() => onTap && onTap(id)}>
      <div className={`pos-dot pos-${pos}`}>{POS_MAP[pos] || pos || "?"}</div>
      <div className="player-info">
        <div className="player-name">{name}</div>
        <div className="player-meta">
          <span>{team}</span>
          {inj && <span className="inj-tag">{inj}</span>}
        </div>
        {statParts.length > 0 && <div className="stat-line">{statParts.join(" · ")}</div>}
      </div>
      <div className="player-stats">
        {inj === "IR"
          ? <div style={{ color:"var(--red)", fontSize:11, fontWeight:600 }}>OUT</div>
          : st.pts_ppr != null && <div className="stat-pts">{Number(st.pts_ppr).toFixed(1)}<span>pts</span></div>
        }
        {pr.pts_ppr != null && inj !== "IR" && <div className="stat-proj">proj {Number(pr.pts_ppr).toFixed(1)}</div>}
        <div style={{ fontSize:10, color:"var(--text3)", marginTop:2 }}>tap for more</div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [inputVal, setInputVal] = useState("");
  const [userData, setUserData] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [players, setPlayers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentSeason, setCurrentSeason] = useState("");
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [leagueRosters, setLeagueRosters] = useState([]);
  const [leagueUsers, setLeagueUsers] = useState([]);
  const [leagueLoading, setLeagueLoading] = useState(false);
  const [leagueTab, setLeagueTab] = useState("standings");
  const [selectedRoster, setSelectedRoster] = useState(null);
  const [playerStats, setPlayerStats] = useState({});
  const [playerProjections, setPlayerProjections] = useState({});
  const [multiWeekProjections, setMultiWeekProjections] = useState({});
  const [waiverPool, setWaiverPool] = useState([]);
  const [recentTrades, setRecentTrades] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [showTradeEvaluator, setShowTradeEvaluator] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: "ai", text: "Hi! Select a league then ask me anything - roster weaknesses, trade targets, start/sit decisions, playoff odds. You can also tap Evaluate a trade to analyze a specific deal." }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const msgsRef = React.useRef(null);

  React.useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [aiMessages, aiLoading]);

  async function handleSearch() {
    if (!inputVal.trim()) return;
    setLoading(true);
    setError("");
    try {
      const user = await sleeperFetch(`/user/${inputVal.trim()}`);
      if (!user?.user_id) throw new Error("User not found");
      setUserData(user);
      const nflState = await sleeperFetch(`/state/nfl`);
      const season = nflState?.season || new Date().getFullYear().toString();
      const week = nflState?.week || 1;
      setCurrentSeason(season);
      setCurrentWeek(week);
      const leagueList = await sleeperFetch(`/user/${user.user_id}/leagues/nfl/${season}`);
      setLeagues(leagueList || []);
      setView("leagues");
      if (Object.keys(players).length === 0) {
        fetch(`${SLEEPER_BASE}/players/nfl`)
          .then(r => r.json())
          .then(data => setPlayers(data || {}))
          .catch(() => {});
      }
    } catch (e) {
      setError(e.message || "Could not find that username.");
    } finally {
      setLoading(false);
    }
  }

  async function selectLeague(league) {
    setSelectedLeague(league);
    setLeagueLoading(true);
    setSelectedRoster(null);
    setLeagueTab("standings");

    let rostersData = [];
    try {
      const [rosters, users] = await Promise.all([
        sleeperFetch(`/league/${league.league_id}/rosters`),
        sleeperFetch(`/league/${league.league_id}/users`),
      ]);
      rostersData = rosters || [];
      setLeagueRosters(rostersData);
      setLeagueUsers(users || []);
    } catch {
      setError("Failed to load league data.");
    } finally {
      setLeagueLoading(false);
    }

    if (currentSeason && currentWeek) {
      setStatsLoading(true);
      try {
        const sw = Math.max(1, currentWeek - 1);
        const projWeeks = [currentWeek, currentWeek+1, currentWeek+2, currentWeek+3];
        const [stats, ...projResults] = await Promise.all([
          fetch(`${SLEEPER_BASE}/stats/nfl/regular/${currentSeason}/${sw}?season_type=regular`).then(r => r.ok ? r.json() : {}),
          ...projWeeks.map(w => fetch(`${SLEEPER_BASE}/projections/nfl/regular/${currentSeason}/${w}?season_type=regular`).then(r => r.ok ? r.json() : {}).catch(() => ({}))),
        ]);
        const currentProj = projResults[0] || {};
        setPlayerStats(stats || {});
        setPlayerProjections(currentProj);
        const multiMap = {};
        projWeeks.forEach((w, i) => {
          Object.entries(projResults[i] || {}).forEach(([pid, pdata]) => {
            if (!multiMap[pid]) multiMap[pid] = {};
            multiMap[pid][w] = pdata?.pts_ppr || 0;
          });
        });
        setMultiWeekProjections(multiMap);
        const allRosteredIds = new Set(rostersData.flatMap(r => r.players || []));
        const topWaivers = Object.entries(currentProj)
          .filter(([pid]) => {
            if (allRosteredIds.has(pid)) return false;
            const p = players[pid];
            return p && p.active && ["QB","RB","WR","TE","K"].includes(p.position);
          })
          .map(([pid, pdata]) => {
            const p = players[pid];
            const futureProj = projWeeks.slice(1).reduce((sum, w) => sum + (multiMap[pid]?.[w] || 0), 0);
            return { id:pid, name:`${p.first_name} ${p.last_name}`, pos:p.position, team:p.team||"FA", inj:p.injury_status||null, thisWeek:pdata?.pts_ppr||0, next3Total:futureProj };
          })
          .sort((a, b) => b.thisWeek - a.thisWeek)
          .slice(0, 30);
        setWaiverPool(topWaivers);
        const tradeResults = await Promise.all(
          Array.from({ length: 5 }, (_, i) => Math.max(1, currentWeek - i)).map(w =>
            fetch(`${SLEEPER_BASE}/league/${league.league_id}/transactions/${w}`)
              .then(r => r.ok ? r.json() : [])
              .catch(() => [])
          )
        );
        const allTrades = tradeResults.flat().filter(t => t.type === "trade" && t.status === "complete").slice(0, 10);
        setRecentTrades(allTrades);
      } catch { } finally {
        setStatsLoading(false);
      }
    }
  }

  function getUserForRoster(roster) {
    return leagueUsers.find(u => u.user_id === roster.owner_id) || {};
  }

  function getMyRoster() {
    return leagueRosters.find(r => r.owner_id === userData?.user_id);
  }

  async function sendAI(msg) {
    if (!msg.trim() || aiLoading) return;
    setAiMessages(prev => [...prev, { role: "user", text: msg }]);
    setAiInput("");
    setAiLoading(true);

    let context = "";
    if (selectedLeague) {
      const activeScoring = Object.entries(selectedLeague.scoring_settings || {})
        .filter(([, v]) => v !== 0)
        .map(([k, v]) => `${k}:${v}`)
        .join(", ");
      context += `League: ${selectedLeague.name}\nSeason: ${currentSeason}, Week: ${currentWeek}\n`;
      context += `Active scoring categories (ONLY these exist in this league): ${activeScoring}\n\n`;
      const fmtPlayer = (id) => {
        const p = players[id];
        if (!p) return id;
        const st = playerStats[id] || {};
        const pr = playerProjections[id] || {};
        const mw = multiWeekProjections[id] || {};
        const parts = [];
        if (st.pts_ppr != null) parts.push(`wk${currentWeek-1}_actual:${Number(st.pts_ppr).toFixed(1)}`);
        if (st.rush_yd) parts.push(`rush:${Math.round(st.rush_yd)}`);
        if (st.rec_yd) parts.push(`rec:${Math.round(st.rec_yd)}`);
        if (st.pass_yd) parts.push(`pass:${Math.round(st.pass_yd)}`);
        if (pr.pts_ppr != null) parts.push(`wk${currentWeek}_proj:${Number(pr.pts_ppr).toFixed(1)}`);
        const wk1=mw[currentWeek+1]; const wk2=mw[currentWeek+2]; const wk3=mw[currentWeek+3];
        if (wk1) parts.push(`wk${currentWeek+1}_proj:${Number(wk1).toFixed(1)}`);
        if (wk2) parts.push(`wk${currentWeek+2}_proj:${Number(wk2).toFixed(1)}`);
        if (wk3) parts.push(`wk${currentWeek+3}_proj:${Number(wk3).toFixed(1)}`);
        if (p.injury_status) parts.push(p.injury_status);
        return `${p.first_name} ${p.last_name}(${p.position},${p.team||"FA"})${parts.length?"["+parts.join(",")+"]":""}`;
      };
      const myRoster = getMyRoster();
      if (myRoster) context += `MY ROSTER:\n${(myRoster.players||[]).map(fmtPlayer).join("\n")}\n\n`;
      const others = leagueRosters
        .filter(r => r.owner_id !== userData?.user_id)
        .map(r => {
          const u = getUserForRoster(r);
          const rec = `${r.settings?.wins||0}W-${r.settings?.losses||0}L`;
          return `${u.display_name||"Team"}(${rec}):\n${(r.players||[]).slice(0,12).map(fmtPlayer).join("\n")}`;
        });
      context += `OTHER TEAMS:\n${others.join("\n\n")}\n\n`;
      if (waiverPool.length > 0) {
        const waiverLines = waiverPool.slice(0,20).map(p =>
          `${p.name}(${p.pos},${p.team})${p.inj?`[${p.inj}]`:""}[wk${currentWeek}_proj:${p.thisWeek.toFixed(1)},next3total:${p.next3Total.toFixed(1)}]`
        );
        context += `AVAILABLE ON WAIVERS (top 20 by projection):\n${waiverLines.join("\n")}\n\n`;
      }
      if (recentTrades.length > 0) {
        const tradeLines = recentTrades.map((t, i) => {
          const adds = Object.entries(t.adds||{}).map(([pid, rid]) => {
            const p = players[pid];
            const u = leagueUsers.find(u => leagueRosters.find(r => r.roster_id===rid && r.owner_id===u.user_id));
            return `${p?`${p.first_name} ${p.last_name}`:pid} -> ${u?.display_name||"Team"}`;
          });
          return `Trade ${i+1}: ${adds.join(" | ")}`;
        });
        context += `RECENT COMPLETED TRADES:\n${tradeLines.join("\n")}`;
      }
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: `You are an expert fantasy football analyst for the ${currentSeason} NFL season. Give sharp, specific, actionable advice tailored to this exact league.

SCORING: Only analyze positions and categories in the active scoring list. Never mention positions or stats not present there.

PLAYER VALUATION WEIGHTING:
- HIGHEST WEIGHT: Remaining week-by-week projections (wk_proj fields). This is future value.
- MEDIUM WEIGHT (close to high): Current season actual stats (wk_actual fields). Strong signal of current role and health in ${currentSeason}.
- LOW WEIGHT: Previous season history from training data. Use only as baseline for players with small ${currentSeason} samples. Never override strong current-season signals with prior-year stats.

TRADE SUGGESTIONS: When asked for trade ideas, first ask which timeframe:
"I can suggest trades for three timeframes - which would you like?
- Next week: maximize your lineup for your immediate matchup
- Next 3 weeks: optimize for the near-term stretch including bye weeks
- Rest of season: best moves for your playoff push
Which would you like?"
Then wait before giving specific proposals.

TRADE EVALUATION: When asked to evaluate a specific trade (the user has selected players via the Trade Evaluator or described a deal), skip the clarifying question and go straight to the full breakdown: value exchange using projection data, roster impact for both teams, who wins and why, and a clear ACCEPT or DECLINE verdict.

COMPLETED TRADE REVIEW: When asked to review a completed trade, list the trades from RECENT COMPLETED TRADES and ask which one to analyze. Then give the same full breakdown.

WAIVER ADVICE: Only suggest players from the AVAILABLE ON WAIVERS list. Never suggest a rostered player.

League context:
${context}
NFL Season: ${currentSeason}, Week: ${currentWeek}`,
          messages: [
            ...aiMessages
              .filter(m => m.role === "user" || m.role === "ai")
              .map(m => ({
                role: m.role === "ai" ? "assistant" : "user",
                content: m.text,
              })),
            { role: "user", content: msg },
          ],
        }),
      });
      const data = await res.json();
      const text = data?.content?.[0]?.text || "No response received.";
      setAiMessages(prev => [...prev, { role: "ai", text }]);
    } catch {
      setAiMessages(prev => [...prev, { role: "ai", text: "Connection error. Please try again." }]);
    } finally {
      setAiLoading(false);
    }
  }

  function clearChat() {
    setAiMessages([
      { role: "ai", text: "Hi! Select a league then ask me anything - roster weaknesses, trade targets, start/sit decisions, playoff odds. You can also tap Evaluate a trade to analyze a specific deal." }
    ]);
  }

  const chatLength = aiMessages.reduce((sum, m) => sum + m.text.length, 0);
  const chatIsLong = chatLength > 8000;

  const sortedRosters = [...leagueRosters].sort((a, b) => {
    const wd = (b.settings?.wins||0) - (a.settings?.wins||0);
    return wd !== 0 ? wd : (b.settings?.fpts||0) - (a.settings?.fpts||0);
  });

  const myRoster = getMyRoster();

  const navItems = [
    { id: "home", label: "Search" },
    { id: "leagues", label: "Leagues" },
    { id: "roster", label: "My Roster" },
    { id: "ai", label: "AI Analyst" },
    { id: "about", label: "About" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        <div className="topbar">
          <div className="logo">Draft<span>IQ</span></div>
          {userData && <div className="user-badge">{userData.display_name || userData.username}</div>}
        </div>

        <div className="main">

          {view === "home" && (
            <div className="page">
              <div className="hero">
                <div className="hero-title">Fantasy <span className="accent">IQ</span></div>
                <div className="hero-sub">Enter your Sleeper username to get started</div>
                <div className="search-row">
                  <input
                    className="search-input"
                    placeholder="Sleeper username..."
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                  <button className="btn-search" onClick={handleSearch} disabled={loading}>
                    {loading ? <span className="spinner" /> : "Go"}
                  </button>
                </div>
                {error && <div className="error-banner">{error}</div>}
              </div>
              <div className="features">
                {[
                  { icon: "◈", title: "All Your Leagues", desc: "See every league, roster, and scoring format in one place" },
                  { icon: "⬡", title: "Live Stats", desc: "Week-by-week actuals and projections on every player" },
                  { icon: "◎", title: "AI Trade Advisor", desc: "Get specific trade targets, evaluate offers, and get start/sit advice" },
                ].map(f => (
                  <div key={f.title} className="feature-card">
                    <div className="feature-icon">{f.icon}</div>
                    <div>
                      <div className="feature-title">{f.title}</div>
                      <div className="feature-desc">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "leagues" && (
            <div className="page">
              {!selectedLeague ? (
                <>
                  <div className="section-hdr">
                    <div className="section-title"><span className="dim">#</span>My Leagues</div>
                    <span className="badge badge-gray">{leagues.length}</span>
                  </div>
                  {leagues.length === 0 && <div className="empty">No leagues found for {currentSeason}.</div>}
                  {leagues.map(league => (
                    <div key={league.league_id} className="league-card" onClick={() => selectLeague(league)}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                        <div className="league-card-title">{league.name}</div>
                        <span className={`badge ${league.status === "in_season" ? "badge-green" : "badge-gray"}`}>
                          {league.status?.replace("_"," ") || "active"}
                        </span>
                      </div>
                      <div className="league-card-sub">{league.settings?.num_teams||"?"} teams · {league.season}</div>
                      <div className="league-card-tags">
                        <span className="badge badge-blue">{league.scoring_settings?.rec ? `${league.scoring_settings.rec} PPR` : "Standard"}</span>
                        {league.settings?.playoff_week_start && <span className="badge badge-gray">Playoffs wk {league.settings.playoff_week_start}</span>}
                      </div>
                    </div>
                  ))}
                </>
              ) : selectedRoster ? (
                <>
                  <button className="back-btn" onClick={() => setSelectedRoster(null)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                    Standings
                  </button>
                  <div className="roster-hdr">
                    <div className="roster-title">{getUserForRoster(selectedRoster)?.display_name || "Team"}</div>
                    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                      {selectedRoster.owner_id === userData?.user_id && <span className="badge badge-green">You</span>}
                      {!statsLoading && Object.keys(playerStats).length > 0 && <span className="badge badge-blue">Wk {currentWeek-1} stats</span>}
                      {statsLoading && <span className="spinner" />}
                    </div>
                  </div>
                  {(selectedRoster.starters||[]).length > 0 && (
                    <>
                      <div className="pos-label">Starters</div>
                      {(selectedRoster.starters||[]).map((id,i) => (
                        <PlayerChip key={id+i} id={id} players={players} playerStats={playerStats} playerProjections={playerProjections} dim={false} onTap={setSelectedPlayerId} />
                      ))}
                    </>
                  )}
                  {(selectedRoster.players||[]).filter(id => !(selectedRoster.starters||[]).includes(id)).length > 0 && (
                    <>
                      <div className="pos-label">Bench</div>
                      {(selectedRoster.players||[]).filter(id => !(selectedRoster.starters||[]).includes(id)).map((id,i) => (
                        <PlayerChip key={id+i} id={id} players={players} playerStats={playerStats} playerProjections={playerProjections} dim={true} onTap={setSelectedPlayerId} />
                      ))}
                    </>
                  )}
                </>
              ) : (
                <>
                  <button className="back-btn" onClick={() => setSelectedLeague(null)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                    My Leagues
                  </button>
                  <div className="detail-title">{selectedLeague.name}</div>
                  <div className="detail-sub">{selectedLeague.settings?.num_teams} teams · {selectedLeague.season} · {selectedLeague.scoring_settings?.rec ? `${selectedLeague.scoring_settings.rec} PPR` : "Standard"}</div>
                  <div className="tab-row">
                    {[["standings","Standings"],["scoring","Scoring"],["settings","Settings"]].map(([id,label]) => (
                      <button key={id} className={`tab-btn ${leagueTab===id?"active":""}`} onClick={() => setLeagueTab(id)}>{label}</button>
                    ))}
                  </div>
                  {leagueLoading && <div className="loading-center"><span className="spinner" /><span>Loading...</span></div>}
                  {!leagueLoading && leagueTab === "standings" && sortedRosters.map((roster,idx) => {
                    const u = getUserForRoster(roster);
                    const isMe = roster.owner_id === userData?.user_id;
                    return (
                      <div key={roster.roster_id} className="team-row" onClick={() => setSelectedRoster(roster)}>
                        <div className={`rank ${idx===0?"rank-1":idx===1?"rank-2":idx===2?"rank-3":"rank-x"}`}>{idx+1}</div>
                        <div className="team-av">
                          {u.avatar ? <img src={`https://sleepercdn.com/avatars/thumbs/${u.avatar}`} alt="" onError={e=>{e.target.style.display="none";}} /> : initials(u.display_name||"")}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <div className="team-name">{u.display_name||u.username||`Team ${roster.roster_id}`}</div>
                            {isMe && <span className="badge badge-green">You</span>}
                          </div>
                          <div className="team-rec">{roster.settings?.wins||0}W-{roster.settings?.losses||0}L · {Number(roster.settings?.fpts||0).toFixed(1)} pts</div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    );
                  })}
                  {!leagueLoading && leagueTab === "scoring" && (
                    <>
                      <div className="settings-title">Point Values</div>
                      <div className="scoring-grid">
                        {Object.entries(selectedLeague.scoring_settings||{}).filter(([,v])=>v!==0).slice(0,20).map(([key,val]) => (
                          <div key={key} className="scoring-item">
                            <div className="scoring-label">{SCORING_LABELS[key]||key.replace(/_/g," ")}</div>
                            <div className="scoring-val">{val>0?"+":""}{val}{SCORING_UNITS[key]||""}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {!leagueLoading && leagueTab === "settings" && (
                    <>
                      <div className="settings-title">League Rules</div>
                      <div className="scoring-grid">
                        {[
                          ["Teams", selectedLeague.settings?.num_teams],
                          ["Playoff Teams", selectedLeague.settings?.playoff_teams],
                          ["Playoff Start", `Wk ${selectedLeague.settings?.playoff_week_start}`],
                          ["Trade Deadline", `Wk ${selectedLeague.settings?.trade_deadline||"?"}`],
                          ["Waiver Type", selectedLeague.settings?.waiver_type===1?"FAAB":selectedLeague.settings?.waiver_type===2?"Rev Order":"Rolling"],
                          ["Season", selectedLeague.season],
                        ].filter(([,v])=>v).map(([label,val]) => (
                          <div key={label} className="scoring-item">
                            <div className="scoring-label">{label}</div>
                            <div className="scoring-val" style={{ fontSize:15 }}>{val}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {view === "roster" && (
            <div className="page">
              <div className="section-hdr">
                <div className="section-title"><span className="dim">#</span>My Roster</div>
                {statsLoading && <span className="spinner" />}
              </div>
              {!selectedLeague && <div className="empty">Select a league from the Leagues tab first.</div>}
              {selectedLeague && !myRoster && <div className="empty">Could not find your roster in this league.</div>}
              {selectedLeague && myRoster && (
                <>
                  <div style={{ marginBottom:10, fontSize:13, color:"var(--text2)" }}>
                    {selectedLeague.name} · {myRoster.settings?.wins||0}W-{myRoster.settings?.losses||0}L · {Number(myRoster.settings?.fpts||0).toFixed(1)} pts
                  </div>
                  {!statsLoading && Object.keys(playerStats).length > 0 && (
                    <div style={{ marginBottom:10 }}>
                      <span className="badge badge-blue">Wk {currentWeek-1} actuals · Wk {currentWeek} projections loaded</span>
                    </div>
                  )}
                  {(myRoster.starters||[]).length > 0 && (
                    <>
                      <div className="pos-label">Starters</div>
                      {(myRoster.starters||[]).map((id,i) => (
                        <PlayerChip key={id+i} id={id} players={players} playerStats={playerStats} playerProjections={playerProjections} dim={false} onTap={setSelectedPlayerId} />
                      ))}
                    </>
                  )}
                  {(myRoster.players||[]).filter(id=>!(myRoster.starters||[]).includes(id)).length > 0 && (
                    <>
                      <div className="pos-label">Bench</div>
                      {(myRoster.players||[]).filter(id=>!(myRoster.starters||[]).includes(id)).map((id,i) => (
                        <PlayerChip key={id+i} id={id} players={players} playerStats={playerStats} playerProjections={playerProjections} dim={true} onTap={setSelectedPlayerId} />
                      ))}
                    </>
                  )}
                  <div className="divider" />
                  <button onClick={() => setView("ai")} style={{ width:"100%", padding:"14px", background:"var(--green)", color:"#000", border:"none", borderRadius:12, fontSize:15, fontWeight:700, fontFamily:"var(--font-body)", cursor:"pointer" }}>
                    Ask AI About My Team
                  </button>
                </>
              )}
            </div>
          )}

          {view === "ai" && (
            <div className="page">
              <div className="ai-wrap">
                <div className="ai-hdr">
                  <div className="ai-dot" />
                  <div className="ai-hdr-title">AI Analyst</div>
                  {selectedLeague && <div className="ai-league-tag">{selectedLeague.name} · Wk {currentWeek}</div>}
                </div>
                {!selectedLeague && <div className="no-league-warn">No league selected - go to Leagues tab first for personalized advice.</div>}
                <div className="ai-msgs" ref={msgsRef}>
                  {aiMessages.map((m,i) => (
                    <div key={i} className={`msg ${m.role==="user"?"msg-user":"msg-ai"}`}>{m.text}</div>
                  ))}
                  {aiLoading && (
                    <div className="msg msg-ai">
                      <div className="thinking">
                        <div className="dot" /><div className="dot" /><div className="dot" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="quick-prompts">
                  {["Where is my team weakest?","Suggest trades","Who should I start?","Waiver targets","Review a completed trade"].map(p => (
                    <button key={p} className="quick-btn" onClick={() => sendAI(p)}>{p}</button>
                  ))}
                  <button className="quick-btn" onClick={() => setShowTradeEvaluator(true)}>Evaluate a trade</button>
                </div>
                {chatIsLong && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,184,77,.06)", border:"1px solid rgba(255,184,77,.2)", borderRadius:8, padding:"8px 12px", marginBottom:8, flexShrink:0 }}>
                    <span style={{ fontSize:11, color:"var(--amber)", lineHeight:1.4 }}>Conversation is getting long - AI may start losing earlier context</span>
                    <button onClick={clearChat} style={{ fontSize:11, color:"var(--amber)", background:"transparent", border:"1px solid rgba(255,184,77,.3)", borderRadius:6, padding:"4px 8px", cursor:"pointer", fontFamily:"var(--font-body)", flexShrink:0, marginLeft:8 }}>Clear chat</button>
                  </div>
                )}
                <div className="ai-input-wrap">
                  <textarea
                    className="ai-input"
                    placeholder="Ask about trades, matchups, roster moves..."
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    onKeyDown={e => { if (e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendAI(aiInput);}}}
                    rows={1}
                  />
                  <button className="btn-send" onClick={() => sendAI(aiInput)} disabled={aiLoading||!aiInput.trim()}>Send</button>
                </div>
              </div>
            </div>
          )}

          {view === "about" && (
            <div className="page">
              <div className="about-hero">
                <div className="about-logo">Draft<span>IQ</span></div>
                <div className="about-tagline">Your AI-powered Sleeper fantasy football analyst. Free to use, no account required - just your Sleeper username.</div>
              </div>
              <div className="about-section">
                <div className="about-section-title">How to get started</div>
                {[
                  { n:"1", title:"Enter your Sleeper username", desc:"Tap Search in the nav bar, type your Sleeper username exactly as it appears in the Sleeper app, and tap Go." },
                  { n:"2", title:"Select a league", desc:"All your active leagues for the current season will appear. Tap any league to load its rosters, standings, and scoring settings." },
                  { n:"3", title:"Explore your roster", desc:"Tap My Roster to see your full team with last week's actual points and this week's projections. Tap any player for a full stat breakdown." },
                  { n:"4", title:"Check out other teams", desc:"In the Leagues tab, tap any team in the standings to see their full roster and stats - great for identifying trade targets." },
                  { n:"5", title:"Ask the AI analyst", desc:"Tap AI Analyst and ask anything. Use the quick prompts or type your own question. The AI has full context of your league - rosters, scoring settings, stats, and projections." },
                  { n:"6", title:"Evaluate a trade", desc:"Tap the Evaluate a trade button in the AI Analyst tab to open the Trade Evaluator. Select your opponent, tap the players involved on both sides, add any draft picks, and tap Analyze for an instant breakdown." },
                ].map(s => (
                  <div key={s.n} className="step-card">
                    <div className="step-num">{s.n}</div>
                    <div>
                      <div className="step-title">{s.title}</div>
                      <div className="step-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="about-section">
                <div className="about-section-title">What the AI can do</div>
                {[
                  { icon:"◈", text:"Roster analysis - identify your weakest positions compared to the rest of the league, factoring in your specific scoring format." },
                  { icon:"⇄", text:"Trade suggestions - get specific proposals for next week, next 3 weeks, or rest of season. The AI asks which timeframe before diving in." },
                  { icon:"⊞", text:"Trade evaluator - select players and draft picks on both sides of a deal and get an instant ACCEPT or DECLINE verdict backed by projection data." },
                  { icon:"↺", text:"Completed trade review - ask the AI to review any recent trade in your league to understand who won the deal and why." },
                  { icon:"▶", text:"Start/sit advice - find out who on your bench should be starting based on matchups and projections." },
                  { icon:"◎", text:"Waiver targets - discover truly available players that fit your roster needs and scoring format." },
                  { icon:"⬆", text:"Playoff odds - understand your path to the playoffs based on your record and remaining schedule." },
                ].map((t,i) => (
                  <div key={i} className="tip-card">
                    <div className="tip-icon">{t.icon}</div>
                    <div className="tip-text">{t.text}</div>
                  </div>
                ))}
              </div>
              <div className="about-section">
                <div className="about-section-title">Tips for best results</div>
                {[
                  { icon:"💡", text:"Select your league before asking the AI - the analyst needs your league loaded to give personalized advice. Go to Leagues first, pick a league, then head to AI Analyst." },
                  { icon:"📊", text:"Stats and projections load in the background after selecting a league - give it a few seconds before asking time-sensitive questions." },
                  { icon:"👆", text:"Tap any player chip to see their full season stats, week-by-week point chart, and current week projection." },
                  { icon:"⇄", text:"When evaluating a trade, select the opponent first - their roster will not appear until you do." },
                  { icon:"📋", text:"Check the Scoring and Settings tabs in any league to understand exactly how your league scores." },
                  { icon:"↺", text:"If the AI starts losing context in a long conversation, a warning will appear with a Clear chat button to start fresh without losing your league data." },
                ].map((t,i) => (
                  <div key={i} className="tip-card">
                    <div className="tip-icon">{t.icon}</div>
                    <div className="tip-text">{t.text}</div>
                  </div>
                ))}
              </div>
              <div className="about-section">
                <div className="about-section-title">Data sources</div>
                <div className="tip-card">
                  <div className="tip-icon">◈</div>
                  <div className="tip-text">All roster, league, player, and transaction data comes directly from the Sleeper public API and reflects your live league in real time. Stats and projections are sourced from Sleeper's data provider and update throughout the week. The AI uses current season stats and multi-week projections as its primary inputs for all advice.</div>
                </div>
              </div>
              <div className="disclaimer">
                DraftIQ is an independent tool and is not affiliated with or endorsed by Sleeper. AI advice is for informational purposes only - always apply your own judgment before making roster moves or trades.
              </div>
            </div>
          )}

        </div>

        <div className="bottom-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${view===item.id?"active":""}`}
              onClick={() => setView(item.id)}
              disabled={item.id!=="home"&&item.id!=="ai"&&item.id!=="about"&&!userData}
            >
              <NavIcon id={item.id} />
              {item.label}
            </button>
          ))}
        </div>

        {showTradeEvaluator && (
          <TradeEvaluator
            myRoster={getMyRoster()}
            leagueRosters={leagueRosters}
            leagueUsers={leagueUsers}
            players={players}
            playerProjections={playerProjections}
            multiWeekProjections={multiWeekProjections}
            currentWeek={currentWeek}
            userData={userData}
            onAnalyze={(msg) => { setView("ai"); sendAI(msg); }}
            onClose={() => setShowTradeEvaluator(false)}
          />
        )}

      </div>
    </>
  );
}
