const cfg=window.BEYOND_SUPABASE;
const configured=cfg&&!cfg.url.includes("PASTE_")&&!cfg.publishableKey.includes("PASTE_");
const supabase=configured?window.supabase.createClient(cfg.url,cfg.publishableKey):null;
const $=s=>document.querySelector(s);
const pages=["home","applications","staff","settings","audit"];
let currentProfile=null;

function show(id){pages.forEach(p=>$("#"+p)?.classList.toggle("hidden",p!==id));window.scrollTo(0,0)}
function showLogin(){ $("#login").classList.remove("hidden"); $("#home").classList.add("hidden"); pages.slice(2).forEach(p=>$("#"+p)?.classList.add("hidden")); }
function error(msg){$("#loginError").textContent=msg;$("#loginError").classList.remove("hidden")}
function clearError(){$("#loginError").classList.add("hidden")}

async function loadProfile(user){
  const {data,error:e}=await supabase.from("staff_profiles").select("username,display_name,role,active").eq("id",user.id).maybeSingle();
  if(e)throw e;
  if(!data||!data.active)throw new Error("This account is not authorised for the Beyond SMP staff portal.");
  return data;
}
function openPortal(profile){
  currentProfile=profile;
  $("#login").classList.add("hidden");$("#home").classList.remove("hidden");
  $("#displayName").textContent=profile.display_name?` ${profile.display_name}`:"";
  $("#ownerTools").classList.toggle("hidden",profile.role!=="owner");
  $("#moderatorTools").classList.toggle("hidden",profile.role!=="moderator");
  show("home");
}
async function signInWithUsername(username,password){
  // Username-only UI. A Supabase Auth email is used internally by the Edge Function
  // so the user never has to enter, know, or see an email address.
  const {data,error:e}=await supabase.functions.invoke("staff-login",{body:{username,password}});
  if(e||!data?.access_token)throw new Error("Sign in failed. Check your username and password.");
  await supabase.auth.setSession({access_token:data.access_token,refresh_token:data.refresh_token});
  return loadProfile(data.user);
}
$("#loginForm").addEventListener("submit",async e=>{
 e.preventDefault();clearError();
 if(!supabase){error("Supabase is not configured yet. Add your project URL and publishable key to config.js.");return}
 try{openPortal(await signInWithUsername($("#username").value.trim(),$("#password").value))}catch(err){error(err.message)}
});
$("#logout").onclick=async()=>{if(supabase)await supabase.auth.signOut();currentProfile=null;showLogin()};
document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>show(b.dataset.page));
document.querySelectorAll(".back").forEach(b=>b.onclick=()=>show("home"));
supabase?.auth.onAuthStateChange(async(event,session)=>{
 if(event==="SIGNED_OUT"){currentProfile=null;showLogin()}
});
(async()=>{if(!supabase)return;const {data}=await supabase.auth.getSession();if(data.session){try{openPortal(await loadProfile(data.session.user))}catch(e){await supabase.auth.signOut()}}})();