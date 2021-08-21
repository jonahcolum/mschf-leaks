const _beacon=import("https://easrng.github.io/stats-control/stats.js")
async function beacon(...a){
  return (await _beacon).default(...a)
}
beacon("page-load")
async function listDrops() {
  const d = await (await fetch("/leaks.json")).json();
  if (d) return d.map((e,i)=>({...e,index:i+1})).reverse();
  throw new Error();
}
let stylesNotReady;
const dropListEle = document.querySelector("#droplist");
document.querySelector(".dropmodal .close").onclick = () =>
  (document.querySelector(".dropmodal").style.display = "none");
stylesNotReady=(async () => {
  document.querySelector("#styles").textContent = await (await fetch(
    "/style.css"
  )).text();
})();
async function updateDropList() {
  let drops = await listDrops()
  let eles = drops.map(drop => {
    let el = document.createElement("DIV");
    el.setAttribute("class", "drop");
    el.append(
      (() => {
        let e = document.createElement("SPAN");
        e.setAttribute("class", "dropnum");
        e.textContent = drop.drop;
        return e;
      })(),
      (() => {
        let e = document.createElement("SPAN");
        e.setAttribute("class", "dropname");
        e.textContent = drop.name;
        return e;
      })()
    );
    el.onclick = () => {
      beacon("drop-click")
      if (document.querySelector(".dropmodal").classList.contains("secret"))
        document.querySelector(".dropmodal").classList.remove("secret");
      document.querySelector(".dropmodal .num").textContent = "** "+(drop.secret?"SECRET ":"")+"DROP " + drop.drop + " **";
      document.querySelector(".dropmodal .name").textContent = drop.name;
      document.querySelector(".dropmodal .info").textContent = drop.info;
      if (drop.password) {
        document.querySelector(".dropmodal .pass").textContent =
          "PW: " + drop.password;
        document.querySelector(".dropmodal").classList.add("secret");
      }
      document.querySelector(".dropmodal").style.display = "flex";
      document.querySelector(".dropmodal .gotodrop").href = drop.link;
    };
    return el;
  });
  dropListEle.textContent = "";
  dropListEle.append(...eles);
  if(stylesNotReady){
    await stylesNotReady;
    stylesNotReady=false;
  }
  document.querySelector(".loader").style.display = "none";
  document.querySelector("main").style.display = "block";
  setTimeout(updateDropList, 20000);
}
updateDropList();
