const localUrl = "http://127.0.0.1:5500/";
const homeUrl = "https://charisse-chikwiri.squarespace.com/";
const home2Url = "https://charisse-chikwiri.squarespace.com/home";
const home3Url = "http://authenticduplicate.com/";
const home4Url = "https://authenticduplicate.com/";
const home5Url = "https://authenticduplicate.com/";

let currentUrl;
let recordUrl = "";
let AUD = document.getElementsByClassName("aud-homepage");
let w = screen.width;
let h = screen.height;

console.log(location.href);
window.addEventListener("load", loadAUD);

window.addEventListener("click", () => {
  setTimeout(function () { loadAUD(); }, 500);
});

window.addEventListener("resize", () => {
  w = screen.width;
  h = screen.height;
  if (currentUrl === homeUrl || currentUrl === localUrl) {
    updateCSS();
  }
});

var buttonsMarkup = `<div class="aud-buttons">
        <div id="aud-one" class="aud-button">
        <a href="http://authenticduplicate.com/consultancy"><p>Consultancy</p></a>
        </div>
        <div id="aud-two" class="aud-button">
            <a href="http://authenticduplicate.com/journalism"><p>Journalism</p></a>
        </div>
        <div id="aud-three" class="aud-button">
        <a href="http://authenticduplicate.com/music"> <p>Music</p></a>
        </div>
    </div> `;
var videoMarkup = `
  <div id="video-box">
   <video id="video-content" autoplay loop mute>
    <source src="https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1280_10MG.mp4" type="video/mp4">
    Your browser does not support HTML video.
   </video>
  </div>
`;

function homeContent() {
  const videoNode = document.createElement("div");
  videoNode.setAttribute("class", "aud-homepage");
  videoNode.innerHTML = videoMarkup;
  document.body.appendChild(videoNode);

  const buttonsNode = document.createElement("div");
  buttonsNode.setAttribute("class", "aud-homepage");
  buttonsNode.innerHTML = buttonsMarkup;
  document.body.appendChild(buttonsNode);

  const cssLink =
    "https://cdn.jsdelivr.net/gh/notflat3/authentic-duplicate-website/styles/styles5.css";

  addCss(cssLink);
  updateCSS();
}

function updateCSS() {
  document.body.style.overflow = "hidden";
  document.body.style.margin = "0px";
  document.body.style.background = "#454734";

  document.getElementById("video-box").style.height = h + "px";
  document.getElementById("video-box").style.minHeight = h + "px";
  document.getElementById("video-box").style.width = w + "px";
  document.getElementById("video-box").style.pointerEvents = "none";
  document.getElementById("video-box").style.zIndex = "-1";

  document.getElementById("video-content").style.height = "104%";
  document.getElementById("video-content").style.minWidth = "104%";
  document.getElementById("video-content").style.position = "fixed";
  document.getElementById("video-content").style.top = "-2%";
  document.getElementById("video-content").style.left = "0%";
}

function addCss(fileName) {
  var head = document.head;
  var link = document.createElement("link");

  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = fileName;

  head.appendChild(link);
}

function removeAUD() {
  document.querySelectorAll(".aud-homepage").forEach(function (a) {
    a.remove();
  });
}

function loadAUD() {
  currentUrl = location.href;
  console.log("recordUrl = " + recordUrl);
  console.log("currentUrl = " + currentUrl);
  if (currentUrl === recordUrl)  {
    console.log("currentUrl = recordUrl");
      if (currentUrl === localUrl || currentUrl === homeUrl || currentUrl === home2Url || currentUrl === home3Url || currentUrl === home4Url || currentUrl === home5Url) {
        console.log("previous page home");
        recordUrl = currentUrl;
      } else {
        console.log("preivous page was home");
        removeAUD();
        $('link[rel=stylesheet][href~="https://cdn.jsdelivr.net/gh/notflat3/authentic-duplicate-website/styles/styles5.css"]').remove();
        recordUrl = currentUrl;
      }
  }
  if (currentUrl !== recordUrl) {
    console.log("currentUrl !== recordUrl");
    if (currentUrl === localUrl || currentUrl === homeUrl || currentUrl === home2Url || currentUrl === home3Url || currentUrl === home4Url || currentUrl === home5Url) {
      console.log("page is now home");
      homeContent();
      recordUrl = currentUrl;
    } else {
      console.log("page is now not home");
      removeAUD();
      $('link[rel=stylesheet][href~="https://cdn.jsdelivr.net/gh/notflat3/authentic-duplicate-website/styles/styles5.css"]').remove();
      recordUrl = currentUrl;
    }
  }
}
  
//   else {
//     console.log("page is not home");
//     removeAUD();
//     recordUrl = currentUrl;
//     return;
//   }
//   if (recordUrl !== currentUrl) {
//     if (
//       currentUrl === homeUrl ||
//       currentUrl === home2Url ||
//       currentUrl === home3Url ||
//       currentUrl === home4Url ||
//       currentUrl === home5Url ||
//       currentUrl === localUrl
//     ) {
//       homeContent();
//       recordUrl = currentUrl;
//       console.log("page is home, video loaded & recordUrl = " + recordUrl);
//       return;
//     }
//     else {
//       removeAUD();
//       recordUrl = currentUrl;
//       return;
//     }
//   } 
// }