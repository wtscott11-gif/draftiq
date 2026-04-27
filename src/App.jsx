import { useState, useEffect, useCallback } from “react”;

const SLEEPER_BASE = “https://api.sleeper.app/v1”;

const STYLES = `
@import url(‘https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500;600&display=swap’);

- { box-sizing: border-box; margin: 0; padding: 0; }

:root {
–green: #00d97e;
–green-dim: #00a85a;
–green-dark: #004d28;
–bg: #0d0f14;
–bg2: #13161e;
–bg3: #1a1e28;
–bg4: #222736;
–border: rgba(255,255,255,0.07);
–border2: rgba(255,255,255,0.13);
–text: #f0f2f8;
–text2: #8892a4;
–text3: #545e70;
–red: #ff4d4d;
–amber: #ffb84d;
–blue: #4d9fff;
–purple: #a78bfa;
–font-display: ‘Barlow Condensed’, sans-serif;
–font-body: ‘Barlow’, sans-serif;
}

body { background: var(–bg); color: var(–text); font-family: var(–font-body); }

.app { min-height: 100vh; display: flex; flex-direction: column; }

.topbar {
background: var(–bg2);
border-bottom: 1px solid var(–border);
padding: 0 24px;
height: 56px;
display: flex;
align-items: center;
gap: 16px;
position: sticky;
top: 0;
z-index: 100;
}

.logo {
font-family: var(–font-display);
font-size: 22px;
font-weight: 700;
letter-spacing: 0.04em;
color: var(–green);
text-transform: uppercase;
}

.logo span { color: var(–text2); }

.nav-tabs {
display: flex;
gap: 4px;
margin-left: auto;
}

.nav-tab {
padding: 6px 14px;
border-radius: 6px;
font-size: 13px;
font-weight: 500;
cursor: pointer;
background: transparent;
border: none;
color: var(–text2);
transition: all 0.15s;
}

.nav-tab:hover { color: var(–text); background: var(–bg3); }
.nav-tab.active { color: var(–green); background: rgba(0,217,126,0.1); }

.main { flex: 1; padding: 24px; max-width: 1200px; margin: 0 auto; width: 100%; }

.search-hero {
text-align: center;
padding: 60px 20px 40px;
}

.hero-title {
font-family: var(–font-display);
font-size: 56px;
font-weight: 700;
letter-spacing: 0.02em;
text-transform: uppercase;
line-height: 1;
margin-bottom: 12px;
}

.hero-title .accent { color: var(–green); }

.hero-sub {
color: var(–text2);
font-size: 16px;
margin-bottom: 32px;
}

.search-row {
display: flex;
gap: 10px;
max-width: 480px;
margin: 0 auto;
}

.search-input {
flex: 1;
background: var(–bg3);
border: 1px solid var(–border2);
border-radius: 10px;
padding: 12px 16px;
color: var(–text);
font-size: 15px;
font-family: var(–font-body);
outline: none;
transition: border-color 0.15s;
}

.search-input:focus { border-color: var(–green); }
.search-input::placeholder { color: var(–text3); }

.btn {
padding: 12px 20px;
border-radius: 10px;
border: none;
font-family: var(–font-body);
font-size: 14px;
font-weight: 600;
cursor: pointer;
transition: all 0.15s;
display: flex;
align-items: center;
gap: 6px;
}

.btn-primary {
background: var(–green);
color: #000;
}

.btn-primary:hover { background: var(–green-dim); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-ghost {
background: var(–bg3);
color: var(–text);
border: 1px solid var(–border2);
}

.btn-ghost:hover { background: var(–bg4); }

.btn-sm { padding: 6px 12px; font-size: 13px; border-radius: 6px; }

.error-banner {
background: rgba(255,77,77,0.1);
border: 1px solid rgba(255,77,77,0.3);
color: var(–red);
padding: 12px 16px;
border-radius: 8px;
margin-top: 16px;
font-size: 14px;
max-width: 480px;
margin: 16px auto 0;
}

.section { margin-bottom: 32px; }

.section-header {
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 16px;
}

.section-title {
font-family: var(–font-display);
font-size: 22px;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.04em;
}

.section-title .dim { color: var(–text3); margin-right: 8px; }

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.grid-auto { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }

.card {
background: var(–bg2);
border: 1px solid var(–border);
border-radius: 12px;
padding: 16px;
transition: border-color 0.15s;
}

.card:hover { border-color: var(–border2); }

.card-clickable { cursor: pointer; }
.card-clickable:hover { border-color: var(–green); }

.card-selected { border-color: var(–green) !important; background: rgba(0,217,126,0.05); }

.card-title {
font-family: var(–font-display);
font-size: 17px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.03em;
margin-bottom: 4px;
}

.card-sub { font-size: 12px; color: var(–text2); }

.badge {
display: inline-flex;
align-items: center;
padding: 2px 8px;
border-radius: 4px;
font-size: 11px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.05em;
}

.badge-green { background: rgba(0,217,126,0.15); color: var(–green); }
.badge-amber { background: rgba(255,184,77,0.15); color: var(–amber); }
.badge-red { background: rgba(255,77,77,0.15); color: var(–red); }
.badge-blue { background: rgba(77,159,255,0.15); color: var(–blue); }
.badge-purple { background: rgba(167,139,250,0.15); color: var(–purple); }
.badge-gray { background: var(–bg3); color: var(–text2); }

.stat-row {
display: flex;
justify-content: space-between;
align-items: center;
padding: 8px 0;
border-bottom: 1px solid var(–border);
font-size: 13px;
}

.stat-row:last-child { border-bottom: none; }
.stat-label { color: var(–text2); }
.stat-val { font-weight: 600; font-family: var(–font-display); font-size: 15px; letter-spacing: 0.02em; }

.player-chip {
display: flex;
align-items: center;
gap: 10px;
padding: 8px 12px;
background: var(–bg3);
border-radius: 8px;
margin-bottom: 6px;
transition: background 0.1s;
}

.player-chip:hover { background: var(–bg4); }

.pos-dot {
width: 28px;
height: 28px;
border-radius: 6px;
display: flex;
align-items: center;
justify-content: center;
font-size: 10px;
font-weight: 700;
letter-spacing: 0.04em;
flex-shrink: 0;
}

.pos-QB { background: rgba(255,77,77,0.2); color: var(–red); }
.pos-RB { background: rgba(0,217,126,0.2); color: var(–green); }
.pos-WR { background: rgba(77,159,255,0.2); color: var(–blue); }
.pos-TE { background: rgba(255,184,77,0.2); color: var(–amber); }
.pos-K  { background: rgba(167,139,250,0.2); color: var(–purple); }
.pos-DEF { background: rgba(255,255,255,0.1); color: var(–text2); }
.pos-DL { background: rgba(255,255,255,0.1); color: var(–text2); }
.pos-LB { background: rgba(255,255,255,0.1); color: var(–text2); }
.pos-DB { background: rgba(255,255,255,0.1); color: var(–text2); }
.pos-FLEX { background: rgba(167,139,250,0.2); color: var(–purple); }

.player-name { font-size: 14px; font-weight: 500; }
.player-team { font-size: 11px; color: var(–text2); }

.ai-panel {
background: var(–bg2);
border: 1px solid var(–border);
border-radius: 14px;
display: flex;
flex-direction: column;
overflow: hidden;
}

.ai-header {
padding: 16px 20px;
border-bottom: 1px solid var(–border);
display: flex;
align-items: center;
gap: 10px;
}

.ai-indicator {
width: 8px;
height: 8px;
border-radius: 50%;
background: var(–green);
animation: pulse 2s infinite;
}

@keyframes pulse {
0%, 100% { opacity: 1; }
50% { opacity: 0.4; }
}

.ai-title {
font-family: var(–font-display);
font-size: 16px;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.06em;
}

.ai-messages {
flex: 1;
overflow-y: auto;
padding: 16px 20px;
display: flex;
flex-direction: column;
gap: 12px;
min-height: 280px;
max-height: 420px;
}

.msg {
max-width: 90%;
padding: 10px 14px;
border-radius: 10px;
font-size: 14px;
line-height: 1.6;
}

.msg-user {
align-self: flex-end;
background: rgba(0,217,126,0.15);
border: 1px solid rgba(0,217,126,0.2);
color: var(–text);
}

.msg-ai {
align-self: flex-start;
background: var(–bg3);
border: 1px solid var(–border);
color: var(–text);
}

.msg-ai .thinking {
display: flex;
gap: 4px;
align-items: center;
height: 20px;
}

.dot { width: 6px; height: 6px; border-radius: 50%; background: var(–text3); animation: bounce 1.2s infinite; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
0%, 80%, 100% { transform: translateY(0); }
40% { transform: translateY(-6px); }
}

.ai-input-row {
padding: 12px 16px;
border-top: 1px solid var(–border);
display: flex;
gap: 10px;
}

.ai-input {
flex: 1;
background: var(–bg3);
border: 1px solid var(–border2);
border-radius: 8px;
padding: 10px 14px;
color: var(–text);
font-size: 14px;
font-family: var(–font-body);
outline: none;
resize: none;
min-height: 40px;
max-height: 120px;
}

.ai-input:focus { border-color: var(–green); }

.quick-prompts {
display: flex;
flex-wrap: wrap;
gap: 6px;
padding: 0 20px 12px;
}

.quick-btn {
padding: 5px 10px;
background: var(–bg3);
border: 1px solid var(–border2);
border-radius: 20px;
color: var(–text2);
font-size: 12px;
cursor: pointer;
transition: all 0.15s;
}

.quick-btn:hover { color: var(–green); border-color: var(–green); background: rgba(0,217,126,0.05); }

.tabs {
display: flex;
gap: 2px;
background: var(–bg3);
padding: 4px;
border-radius: 10px;
margin-bottom: 20px;
}

.tab {
flex: 1;
padding: 8px 12px;
text-align: center;
border-radius: 7px;
font-size: 13px;
font-weight: 500;
cursor: pointer;
border: none;
background: transparent;
color: var(–text2);
transition: all 0.15s;
}

.tab.active { background: var(–bg); color: var(–text); }
.tab:hover:not(.active) { color: var(–text); }

.score-bar-wrap { margin-top: 6px; }
.score-bar-bg { background: var(–bg3); border-radius: 3px; height: 6px; overflow: hidden; }
.score-bar-fill { height: 100%; border-radius: 3px; background: var(–green); transition: width 0.5s; }

.team-row {
display: flex;
align-items: center;
gap: 12px;
padding: 10px 14px;
border-radius: 8px;
background: var(–bg3);
margin-bottom: 6px;
cursor: pointer;
transition: background 0.15s;
}

.team-row:hover { background: var(–bg4); }
.team-row.selected { background: rgba(0,217,126,0.1); border: 1px solid rgba(0,217,126,0.3); }

.team-avatar {
width: 36px;
height: 36px;
border-radius: 8px;
background: var(–bg4);
display: flex;
align-items: center;
justify-content: center;
font-family: var(–font-display);
font-weight: 700;
font-size: 14px;
color: var(–green);
flex-shrink: 0;
}

.spinner {
width: 20px;
height: 20px;
border: 2px solid var(–border2);
border-top-color: var(–green);
border-radius: 50%;
animation: spin 0.7s linear infinite;
display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

.loading-center {
display: flex;
justify-content: center;
align-items: center;
padding: 60px;
flex-direction: column;
gap: 12px;
color: var(–text2);
font-size: 14px;
}

.divider {
height: 1px;
background: var(–border);
margin: 20px 0;
}

.scoring-grid {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
gap: 8px;
}

.scoring-item {
background: var(–bg3);
border-radius: 8px;
padding: 10px 12px;
font-size: 13px;
}

.scoring-item-label { color: var(–text2); margin-bottom: 2px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
.scoring-item-val { font-family: var(–font-display); font-size: 18px; font-weight: 600; color: var(–green); }

.rank-badge {
min-width: 28px;
height: 28px;
border-radius: 6px;
display: flex;
align-items: center;
justify-content: center;
font-family: var(–font-display);
font-size: 13px;
font-weight: 700;
}

.rank-1 { background: rgba(255,184,77,0.2); color: var(–amber); }
.rank-2 { background: rgba(160,160,160,0.15); color: #aaa; }
.rank-3 { background: rgba(180,120,80,0.2); color: #c87941; }
.rank-other { background: var(–bg3); color: var(–text2); }

.flex-between { display: flex; justify-content: space-between; align-items: center; }
.flex-center { display: flex; align-items: center; gap: 8px; }
.gap-8 { gap: 8px; }
.mb-4 { margin-bottom: 4px; }
.mb-8 { margin-bottom: 8px; }
.mb-16 { margin-bottom: 16px; }

.overflow-scroll { overflow-y: auto; max-height: 400px; }

.empty-state {
text-align: center;
padding: 40px 20px;
color: var(–text3);
font-size: 14px;
}

.page-transition {
animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
from { opacity: 0; transform: translateY(6px); }
to { opacity: 1; transform: translateY(0); }
}
`;

const POSITION_LABELS = {
QB: “QB”, RB: “RB”, WR: “WR”, TE: “TE”, K: “K”,
DEF: “DEF”, DL: “DL”, LB: “LB”, DB: “DB”, FLEX: “FLX”
};

function posBadge(pos) {
const p = pos?.toUpperCase();
return POSITION_LABELS[p] || pos || “?”;
}

async function sleeperFetch(path) {
const r = await fetch(`${SLEEPER_BASE}${path}`);
if (!r.ok) throw new Error(`Sleeper API error: ${r.status}`);
return r.json();
}

function getInitials(name = “”) {
return name.split(” “).map(w => w[0]).join(””).slice(0, 2).toUpperCase();
}

function formatScore(v) {
if (v == null) return “—”;
return Number(v).toFixed(1);
}

export default function App() {
const [username, setUsername] = useState(””);
const [inputVal, setInputVal] = useState(””);
const [userData, setUserData] = useState(null);
const [leagues, setLeagues] = useState([]);
const [players, setPlayers] = useState({});
const [loading, setLoading] = useState(false);
const [error, setError] = useState(””);
const [selectedLeague, setSelectedLeague] = useState(null);
const [leagueRosters, setLeagueRosters] = useState([]);
const [leagueUsers, setLeagueUsers] = useState([]);
const [leagueLoading, setLeagueLoading] = useState(false);
const [view, setView] = useState(“home”); // home | leagues | roster | league-detail | ai
const [selectedTeam, setSelectedTeam] = useState(null);
const [aiMessages, setAiMessages] = useState([
{ role: “ai”, text: “Hi! I’m your fantasy football analyst. Select a league and ask me anything — I can analyze your roster, find weaknesses, suggest trades, and more.” }
]);
const [aiInput, setAiInput] = useState(””);
const [aiLoading, setAiLoading] = useState(false);
const [currentSeason, setCurrentSeason] = useState(””);
const [currentWeek, setCurrentWeek] = useState(1);
const [playerStats, setPlayerStats] = useState({});
const [playerProjections, setPlayerProjections] = useState({});
const [statsLoading, setStatsLoading] = useState(false);

// Load players db once (abbreviated — we’ll load on demand)
const getPlayerName = useCallback((id) => {
const p = players[id];
if (!p) return id;
return `${p.first_name || ""} ${p.last_name || ""}`.trim() || id;
}, [players]);

const getPlayerPos = useCallback((id) => players[id]?.position || “”, [players]);
const getPlayerTeam = useCallback((id) => players[id]?.team || “FA”, [players]);

async function handleSearch() {
if (!inputVal.trim()) return;
setLoading(true);
setError(””);
setSelectedLeague(null);
setLeagueRosters([]);
setLeagueUsers([]);
setSelectedTeam(null);
setView(“leagues”);

```
try {
  const user = await sleeperFetch(`/user/${inputVal.trim()}`);
  if (!user || !user.user_id) throw new Error("User not found");
  setUserData(user);
  setUsername(inputVal.trim());

  const nflState = await sleeperFetch(`/state/nfl`);
  const season = nflState?.season || new Date().getFullYear().toString();
  const week = nflState?.week || 1;
  setCurrentSeason(season);
  setCurrentWeek(week);
  const leagueList = await sleeperFetch(`/user/${user.user_id}/leagues/nfl/${season}`);
  setLeagues(leagueList || []);

  // Load players in background
  if (Object.keys(players).length === 0) {
    fetch("https://api.sleeper.app/v1/players/nfl")
      .then(r => r.json())
      .then(data => setPlayers(data || {}))
      .catch(() => {});
  }
} catch (e) {
  setError(e.message || "Could not find that username.");
  setView("home");
} finally {
  setLoading(false);
}
```

}

async function selectLeague(league) {
setSelectedLeague(league);
setLeagueLoading(true);
setView(“league-detail”);
setSelectedTeam(null);

```
try {
  const [rosters, users] = await Promise.all([
    sleeperFetch(`/league/${league.league_id}/rosters`),
    sleeperFetch(`/league/${league.league_id}/users`)
  ]);
  setLeagueRosters(rosters || []);
  setLeagueUsers(users || []);
} catch (e) {
  setError("Failed to load league data.");
} finally {
  setLeagueLoading(false);
}

// Fetch season cumulative stats and current-week projections in background
if (currentSeason && currentWeek) {
  setStatsLoading(true);
  try {
    const statsWeek = Math.max(1, currentWeek - 1); // last completed week for actuals
    const [stats, projections] = await Promise.all([
      fetch(`${SLEEPER_BASE}/stats/nfl/regular/${currentSeason}/${statsWeek}?season_type=regular`).then(r => r.ok ? r.json() : {}),
      fetch(`${SLEEPER_BASE}/projections/nfl/regular/${currentSeason}/${currentWeek}?season_type=regular`).then(r => r.ok ? r.json() : {})
    ]);
    setPlayerStats(stats || {});
    setPlayerProjections(projections || {});
  } catch (e) {
    // Non-fatal — stats just won't display
  } finally {
    setStatsLoading(false);
  }
}
```

}

function getUserForRoster(roster) {
return leagueUsers.find(u => u.user_id === roster.owner_id) || {};
}

function getMyRoster() {
if (!userData) return null;
return leagueRosters.find(r => r.owner_id === userData.user_id);
}

async function sendAiMessage(msg) {
if (!msg.trim()) return;
const userMsg = { role: “user”, text: msg };
setAiMessages(prev => […prev, userMsg]);
setAiInput(””);
setAiLoading(true);

```
// Build context
let context = "";
if (selectedLeague) {
  context += `League: ${selectedLeague.name}\n`;
  context += `Season: ${currentSeason}, Current Week: ${currentWeek}\n`;
  context += `Scoring: ${selectedLeague.scoring_settings ? JSON.stringify(selectedLeague.scoring_settings).slice(0, 400) : "standard"}\n\n`;

  const formatPlayerLine = (id) => {
    const p = players[id];
    if (!p) return id;
    const name = `${p.first_name} ${p.last_name}`;
    const pos = p.position || "?";
    const team = p.team || "FA";
    const inj = p.injury_status ? ` [${p.injury_status}]` : "";

    const st = playerStats[id] || {};
    const pr = playerProjections[id] || {};

    const statParts = [];
    if (st.pts_ppr != null) statParts.push(`actual pts: ${Number(st.pts_ppr).toFixed(1)}`);
    if (st.pass_yd) statParts.push(`pass yds: ${Math.round(st.pass_yd)}`);
    if (st.pass_td) statParts.push(`pass td: ${st.pass_td}`);
    if (st.rush_yd) statParts.push(`rush yds: ${Math.round(st.rush_yd)}`);
    if (st.rush_td) statParts.push(`rush td: ${st.rush_td}`);
    if (st.rec_yd) statParts.push(`rec yds: ${Math.round(st.rec_yd)}`);
    if (st.rec_td) statParts.push(`rec td: ${st.rec_td}`);
    if (st.rec) statParts.push(`rec: ${st.rec}`);

    const projParts = [];
    if (pr.pts_ppr != null) projParts.push(`proj pts: ${Number(pr.pts_ppr).toFixed(1)}`);
    if (pr.pass_yd) projParts.push(`proj pass yds: ${Math.round(pr.pass_yd)}`);
    if (pr.rush_yd) projParts.push(`proj rush yds: ${Math.round(pr.rush_yd)}`);
    if (pr.rec_yd) projParts.push(`proj rec yds: ${Math.round(pr.rec_yd)}`);
    if (pr.rec) projParts.push(`proj rec: ${Number(pr.rec).toFixed(1)}`);

    const allStats = [...statParts, ...projParts].join(", ");
    return `${name} (${pos}, ${team}${inj})${allStats ? ` — ${allStats}` : ""}`;
  };

  const myRoster = getMyRoster();
  if (myRoster) {
    const myPlayers = (myRoster.players || []).map(formatPlayerLine).join("\n  ");
    context += `MY ROSTER:\n  ${myPlayers}\n\n`;
  }

  const otherTeams = leagueRosters
    .filter(r => r.owner_id !== userData?.user_id)
    .map(r => {
      const u = getUserForRoster(r);
      const rPlayers = (r.players || []).slice(0, 10).map(formatPlayerLine).join("\n    ");
      const rec = `${r.settings?.wins || 0}W-${r.settings?.losses || 0}L`;
      return `  ${u.display_name || "Team"} (${rec}):\n    ${rPlayers}`;
    });

  context += `OTHER TEAMS:\n${otherTeams.join("\n\n")}\n`;
}

try {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are an expert fantasy football analyst with access to live Sleeper league data including actual stats from the most recently completed week and projections for the current week. Give sharp, actionable advice. Be concise but specific — cite player names, stat lines, and projected points when relevant. When suggesting trades, name exact players, explain the value exchange, and explain why the other manager would accept given their roster needs.\n\nLeague Data:\n${context}\nCurrent NFL season: ${currentSeason}, Week: ${currentWeek}.`,
      messages: [{ role: "user", content: msg }]
    })
  });
  const data = await response.json();
  const text = data.content?.map(b => b.text || "").join("") || "Sorry, I couldn't generate a response.";
  setAiMessages(prev => [...prev, { role: "ai", text }]);
} catch (e) {
  setAiMessages(prev => [...prev, { role: "ai", text: "Connection error. Please try again." }]);
} finally {
  setAiLoading(false);
}
```

}

const scoringFriendly = {
pass_yd: “Passing Yards”, pass_td: “Passing TD”, pass_int: “Interception”,
rush_yd: “Rushing Yards”, rush_td: “Rushing TD”, rec: “Reception”,
rec_yd: “Receiving Yards”, rec_td: “Receiving TD”, fum_lost: “Fumble Lost”,
bonus_rec_yd_100: “100+ Rec Yards Bonus”, bonus_rush_yd_100: “100+ Rush Yards Bonus”,
bonus_pass_yd_300: “300+ Pass Yards Bonus”, st_td: “Special Teams TD”,
pr_td: “Punt Return TD”, kr_td: “Kick Return TD”
};

const scoringUnits = {
pass_yd: “/yd”, rush_yd: “/yd”, rec_yd: “/yd”
};

const quickPrompts = [
“Where is my team weakest?”,
“Suggest 2 trades I should make”,
“Who on my bench should I start?”,
“Which opponents have weak secondaries I can exploit?”,
“Analyze my playoff odds”
];

return (
<>
<style>{STYLES}</style>
<div className="app">
<div className="topbar">
<div className="logo">Draft<span>IQ</span></div>

```
      {userData && (
        <div className="flex-center" style={{ marginLeft: 16 }}>
          <div className="badge badge-green">{userData.display_name || username}</div>
        </div>
      )}

      {userData && (
        <div className="nav-tabs">
          <button className={`nav-tab ${view === "leagues" ? "active" : ""}`} onClick={() => setView("leagues")}>My Leagues</button>
          {selectedLeague && <button className={`nav-tab ${view === "league-detail" ? "active" : ""}`} onClick={() => setView("league-detail")}>League Detail</button>}
          {selectedLeague && <button className={`nav-tab ${view === "ai" ? "active" : ""}`} onClick={() => setView("ai")}>AI Analyst</button>}
        </div>
      )}
    </div>

    <div className="main">
      {view === "home" && (
        <div className="search-hero page-transition">
          <div className="hero-title">
            Fantasy <span className="accent">IQ</span>
          </div>
          <div className="hero-sub">Enter your Sleeper username to get started</div>
          <div className="search-row">
            <input
              className="search-input"
              placeholder="Your Sleeper username..."
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
              {loading ? <span className="spinner" /> : "Search"}
            </button>
          </div>
          {error && <div className="error-banner">{error}</div>}

          <div style={{ marginTop: 60, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, textAlign: "left" }}>
            {[
              { icon: "◈", title: "League Overview", desc: "See all your leagues, rosters, and team compositions at a glance" },
              { icon: "⬡", title: "Roster Comparison", desc: "Compare your players against every other team in your league" },
              { icon: "◎", title: "AI Trade Advisor", desc: "Get tailored trade recommendations backed by analytics" }
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 24, marginBottom: 10, color: "var(--green)" }}>{f.icon}</div>
                <div className="card-title" style={{ marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "leagues" && (
        <div className="page-transition">
          <div className="section-header">
            <div className="section-title"><span className="dim">#</span>My Leagues</div>
            <div className="flex-center">
              <span className="badge badge-gray">{leagues.length} leagues</span>
            </div>
          </div>

          {loading ? (
            <div className="loading-center"><span className="spinner" /><span>Loading leagues...</span></div>
          ) : (
            <div className="grid-auto">
              {leagues.map(league => {
                const settings = league.settings || {};
                return (
                  <div
                    key={league.league_id}
                    className={`card card-clickable ${selectedLeague?.league_id === league.league_id ? "card-selected" : ""}`}
                    onClick={() => selectLeague(league)}
                  >
                    <div className="flex-between mb-8">
                      <div className="card-title" style={{ fontSize: 15 }}>{league.name}</div>
                      <span className={`badge ${league.status === "in_season" ? "badge-green" : "badge-gray"}`}>
                        {league.status?.replace("_", " ") || "active"}
                      </span>
                    </div>
                    <div className="card-sub mb-8">{settings.num_teams || "?"} teams • Season {league.season}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <span className="badge badge-blue">{league.scoring_settings?.rec ? `PPR: ${league.scoring_settings.rec}` : "Standard"}</span>
                      <span className="badge badge-gray">{settings.playoff_week_start ? `Playoffs wk ${settings.playoff_week_start}` : ""}</span>
                    </div>
                  </div>
                );
              })}
              {leagues.length === 0 && <div className="empty-state">No leagues found for this user in {currentSeason}.</div>}
            </div>
          )}
        </div>
      )}

      {view === "league-detail" && selectedLeague && (
        <div className="page-transition">
          <div className="flex-between mb-16">
            <div>
              <div className="section-title">{selectedLeague.name}</div>
              <div style={{ color: "var(--text2)", fontSize: 13, marginTop: 4 }}>
                {selectedLeague.settings?.num_teams} teams • {selectedLeague.season} • {selectedLeague.scoring_settings?.rec ? `${selectedLeague.scoring_settings.rec} PPR` : "Standard scoring"}
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setView("ai")}>
              ◎ Ask AI Analyst
            </button>
          </div>

          {leagueLoading ? (
            <div className="loading-center"><span className="spinner" /><span>Loading rosters...</span></div>
          ) : (
            <div className="grid-2" style={{ gap: 20 }}>
              {/* Left col: teams */}
              <div>
                <div className="section-header">
                  <div className="card-title">Teams ({leagueRosters.length})</div>
                </div>

                {leagueRosters
                  .sort((a, b) => {
                    const aw = a.settings?.wins || 0, bw = b.settings?.wins || 0;
                    const af = a.settings?.fpts || 0, bf = b.settings?.fpts || 0;
                    return bw - aw || bf - af;
                  })
                  .map((roster, idx) => {
                    const u = getUserForRoster(roster);
                    const isMe = roster.owner_id === userData?.user_id;
                    const wins = roster.settings?.wins || 0;
                    const losses = roster.settings?.losses || 0;
                    const fpts = roster.settings?.fpts || 0;
                    const fptsAgainst = roster.settings?.fpts_against || 0;

                    return (
                      <div
                        key={roster.roster_id}
                        className={`team-row ${selectedTeam?.roster_id === roster.roster_id ? "selected" : ""}`}
                        onClick={() => setSelectedTeam(roster)}
                      >
                        <div className={`rank-badge ${idx === 0 ? "rank-1" : idx === 1 ? "rank-2" : idx === 2 ? "rank-3" : "rank-other"}`}>
                          {idx + 1}
                        </div>
                        <div className="team-avatar">
                          {u.avatar
                            ? <img src={`https://sleepercdn.com/avatars/thumbs/${u.avatar}`} style={{ width: "100%", height: "100%", borderRadius: 8, objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
                            : getInitials(u.display_name || "TM")}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="flex-center gap-8">
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{u.display_name || u.username || "Team " + roster.roster_id}</span>
                            {isMe && <span className="badge badge-green" style={{ fontSize: 10 }}>YOU</span>}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
                            {wins}W-{losses}L • {formatScore(fpts)} pts
                          </div>
                        </div>
                        <div style={{ textAlign: "right", fontSize: 12, color: "var(--text3)" }}>
                          {roster.players?.length || 0} players
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Right col: team detail / scoring */}
              <div>
                {selectedTeam ? (
                  <>
                    <div className="section-header">
                      <div className="card-title">
                        {getUserForRoster(selectedTeam)?.display_name || "Team"} — Roster
                      </div>
                      <div className="flex-center" style={{ gap: 6 }}>
                        {selectedTeam.owner_id === userData?.user_id && (
                          <span className="badge badge-green">My Team</span>
                        )}
                        {statsLoading
                          ? <span style={{ fontSize: 11, color: "var(--text3)" }}><span className="spinner" style={{ width: 12, height: 12, borderWidth: 1.5 }} /> loading stats…</span>
                          : Object.keys(playerStats).length > 0
                            ? <span className="badge badge-blue">Wk {currentWeek - 1} stats + Wk {currentWeek} proj</span>
                            : null
                        }
                      </div>
                    </div>

                    <div className="overflow-scroll">
                      {(selectedTeam.players || []).length === 0 && (
                        <div className="empty-state">No players found.</div>
                      )}
                      {(selectedTeam.starters || []).length > 0 && (
                        <>
                          <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Starters</div>
                          {(selectedTeam.starters || []).map((id, i) => {
                            const pos = getPlayerPos(id);
                            return (
                              <div key={id + i} className="player-chip">
                                <div className={`pos-dot pos-${pos.toUpperCase()}`}>{posBadge(pos)}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div className="player-name">{getPlayerName(id)}</div>
                                  <div className="player-team">{getPlayerTeam(id)}{players[id]?.injury_status ? <span style={{ color: "var(--red)", marginLeft: 4 }}>{players[id].injury_status}</span> : ""}</div>
                                </div>
                                <div style={{ textAlign: "right", fontSize: 11 }}>
                                  {playerStats[id]?.pts_ppr != null && <div style={{ color: "var(--green)", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600 }}>{Number(playerStats[id].pts_ppr).toFixed(1)}<span style={{ color: "var(--text3)", fontSize: 10, marginLeft: 2 }}>pts</span></div>}
                                  {playerProjections[id]?.pts_ppr != null && <div style={{ color: "var(--text2)" }}>proj {Number(playerProjections[id].pts_ppr).toFixed(1)}</div>}
                                </div>
                              </div>
                            );
                          })}
                          <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "12px 0 6px" }}>Bench</div>
                        </>
                      )}
                      {(selectedTeam.players || [])
                        .filter(id => !(selectedTeam.starters || []).includes(id))
                        .map((id, i) => {
                          const pos = getPlayerPos(id);
                          return (
                            <div key={id + i} className="player-chip" style={{ opacity: 0.7 }}>
                              <div className={`pos-dot pos-${pos.toUpperCase()}`}>{posBadge(pos)}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="player-name">{getPlayerName(id)}</div>
                                <div className="player-team">{getPlayerTeam(id)}{players[id]?.injury_status ? <span style={{ color: "var(--red)", marginLeft: 4 }}>{players[id].injury_status}</span> : ""}</div>
                              </div>
                              <div style={{ textAlign: "right", fontSize: 11 }}>
                                {playerStats[id]?.pts_ppr != null && <div style={{ color: "var(--green)", fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600 }}>{Number(playerStats[id].pts_ppr).toFixed(1)}<span style={{ color: "var(--text3)", fontSize: 10, marginLeft: 2 }}>pts</span></div>}
                                {playerProjections[id]?.pts_ppr != null && <div style={{ color: "var(--text2)" }}>proj {Number(playerProjections[id].pts_ppr).toFixed(1)}</div>}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="section-header">
                      <div className="card-title">Scoring Settings</div>
                    </div>
                    <div className="scoring-grid">
                      {Object.entries(selectedLeague.scoring_settings || {})
                        .filter(([, v]) => v !== 0)
                        .slice(0, 18)
                        .map(([key, val]) => (
                          <div key={key} className="scoring-item">
                            <div className="scoring-item-label">{scoringFriendly[key] || key.replace(/_/g, " ")}</div>
                            <div className="scoring-item-val">
                              {val > 0 ? "+" : ""}{val}{scoringUnits[key] || " pts"}
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="divider" />

                    <div className="section-header">
                      <div className="card-title">League Settings</div>
                    </div>
                    <div className="scoring-grid">
                      {[
                        ["Teams", selectedLeague.settings?.num_teams],
                        ["Playoff Teams", selectedLeague.settings?.playoff_teams],
                        ["Playoff Start", `Week ${selectedLeague.settings?.playoff_week_start}`],
                        ["Waiver Type", selectedLeague.settings?.waiver_type === 0 ? "Rolling" : selectedLeague.settings?.waiver_type === 1 ? "FAAB" : "Reverse Order"],
                        ["Trade Deadline", `Week ${selectedLeague.settings?.trade_deadline || "?"}`],
                        ["Draft Type", selectedLeague.draft_id ? "Snake" : "Custom"],
                      ].map(([label, val]) => val && (
                        <div key={label} className="scoring-item">
                          <div className="scoring-item-label">{label}</div>
                          <div className="scoring-item-val" style={{ fontSize: 15 }}>{val}</div>
                        </div>
                      ))}
                    </div>

                    <div className="divider" />
                    <div className="empty-state" style={{ paddingTop: 16 }}>
                      ← Click a team to see their roster
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {view === "ai" && (
        <div className="page-transition">
          <div className="section-header">
            <div className="section-title"><span className="dim">◎</span>AI Analyst</div>
            {selectedLeague && (
              <div className="badge badge-green" style={{ fontSize: 12 }}>
                {selectedLeague.name}
              </div>
            )}
          </div>

          {!selectedLeague && (
            <div className="card mb-16" style={{ background: "rgba(255,184,77,0.05)", borderColor: "rgba(255,184,77,0.2)" }}>
              <div style={{ color: "var(--amber)", fontSize: 14 }}>
                ⚠ No league selected. Go to <strong>League Detail</strong> first to get personalized advice.
              </div>
            </div>
          )}

          <div className="ai-panel">
            <div className="ai-header">
              <div className="ai-indicator" />
              <div className="ai-title">DraftIQ Analyst</div>
              {selectedLeague && (
                <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text3)" }}>
                  {selectedLeague.name} • Week {currentWeek} • {Object.keys(playerStats).length > 0 ? "Stats loaded" : "Stats loading…"}
                </span>
              )}
            </div>

            <div className="ai-messages">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`msg ${msg.role === "user" ? "msg-user" : "msg-ai"}`}>
                  {msg.role === "ai" && msg.loading ? (
                    <div className="thinking">
                      <div className="dot" /><div className="dot" /><div className="dot" />
                    </div>
                  ) : (
                    <span style={{ whiteSpace: "pre-wrap" }}>{msg.text}</span>
                  )}
                </div>
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
              {quickPrompts.map(p => (
                <button key={p} className="quick-btn" onClick={() => sendAiMessage(p)}>{p}</button>
              ))}
            </div>

            <div className="ai-input-row">
              <textarea
                className="ai-input"
                placeholder="Ask about trades, roster strength, matchups..."
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendAiMessage(aiInput);
                  }
                }}
                rows={1}
              />
              <button
                className="btn btn-primary"
                onClick={() => sendAiMessage(aiInput)}
                disabled={aiLoading || !aiInput.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
</>
```

);
}
