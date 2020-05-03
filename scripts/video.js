const homeUrl ="https://charisse-chikwiri.squarespace.com";
const home2Url ="https://charisse-chikwiri.squarespace.com/home";
const localUrl ="http://127.0.0.1:5500/";

const currentUrl = location.href;

let w = screen.width;
let h = screen.height;

console.log(currentUrl)
window.addEventListener('load', (event) => {
//   console.log('page is fully loaded' + location.href);
  	if (currentUrl === homeUrl || currentUrl === localUrl){ 
     console.log('page is home');
     homeContent()
     return
    }
    else { 
     console.log('page is not home');
     return
   }  
});

window.addEventListener('resize', (event) => {
    w = screen.width;
    h = screen.height;
    if (currentUrl === homeUrl || currentUrl === localUrl){ 
    updateCSS() 
    }
     
});


var buttonsMarkup = 
    `<div class="aud-buttons">
        <div id="aud-one" class="aud-button">
            <p>Consultancy</p>
        </div>
        <div id="aud-two" class="aud-button">
            <p>Journalism</p>
        </div>
        <div id="aud-three" class="aud-button">
            <p>Music</p>
        </div>
    </div> `
;
var videoMarkup = `
  <div id="video-box">
   <video id="video-content" autoplay loop mute>
    <source src="https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1280_10MG.mp4" type="video/mp4">
    Your browser does not support HTML video.
   </video>
  </div>
    `;

function homeContent () {
    const videoNode = document.createElement("div");                
    videoNode.innerHTML = videoMarkup;
    document.body.appendChild(videoNode);

    const buttonsNode = document.createElement("div");                 
    buttonsNode.innerHTML = buttonsMarkup;
    document.body.appendChild(buttonsNode);

   updateCSS()
}

function updateCSS() {
    document.getElementById("video-box").style.height = h + 'px';
    document.getElementById("video-box").style.minHeight =  h + 'px';
    document.getElementById("video-box").style.width = w + 'px';
    document.getElementById("video-box").style.pointerEvents ='none';
    document.getElementById("video-box").style.zIndex ='-1';

    document.getElementById("video-content").style.height = '104%';
    document.getElementById("video-content").style.minWidth = '104%';
    document.getElementById("video-content").style.position = 'fixed';
    document.getElementById("video-content").style.top = '-2%';
    document.getElementById("video-content").style.left = '0%';

}



