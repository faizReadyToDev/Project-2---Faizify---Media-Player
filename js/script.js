let random = function(){
    let rand=Math.round(Math.random()*255);
    return rand;
}
    
function colorChanger(){
    let r = random();
    let g = random();
    let b = random();
    
    document.querySelector('.left').style.backgroundColor=`rgb(${r},${g},${b})`;
}



// JS BEINGS //






let currfolder;
let songs;
function secondsToMinutes(seconds) {
    // Ensure the input is a non-negative integer
    if (typeof seconds !== 'number' || seconds < 0) {
        throw new Error('Input must be a non-negative number');
    }

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds to always be two digits
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Combine and return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
}
let currentSong = new Audio();

const playMusic = (track,pause=false)=>{
    currentSong.src = (`/${currfolder}/` + track)
    if(!pause){
        currentSong.play();
        play.src = 'img/pause.svg';
    }
    document.querySelector('.songinfo').innerHTML = decodeURI(track);
    document.querySelector('.songtime').innerHTML = "00:00 / 00:00";
}


async function getSongs(folder){
    currfolder = folder
    let a =  await fetch (`${folder}/`)
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML=response
    songs=[];
    let as = div.getElementsByTagName('a');
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith('.mp3')){
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0];
    songUL.innerHTML = []
    for (const song of songs) {
        songUL.innerHTML += ` <li><img src="img/music.svg" alt="">
        <div class="info">
        
        <div>${song.replaceAll('%20'," ")}</div> 
        
        </div>
        <div class="playNow flex">
        <span>Play Now</span>
        <img src="img/play.svg" alt="">
        </div> </li>` 
    }

    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e=>{
        e.addEventListener('click',element=>{
            playMusic(e.getElementsByClassName('info')[0].firstElementChild.innerHTML)
        })
    })
    return songs
}

async function displayAlbums(){
    let a =  await fetch (`/songs/`)
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML=response;
    let allAs=div.getElementsByTagName('a');
    let cardContainer = document.querySelector('.cardContainer');
    let arr = Array.from(allAs);
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (element.href.includes("/songs") && !element.href.includes(".htaccess")) {
            let folder=element.href.split('/songs/')[1].split('/')[0];
            let a =  await fetch (`/songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML += ` <div class="card" data-folder="${folder}">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#6FC20F">
                                <circle cx="12" cy="12" r="10" stroke="none" />
                                <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="black" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>  `
        }
    }

    Array.from(document.getElementsByClassName('card')).forEach(e=>{
        e.addEventListener('click',async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        })  
    })
}
async function main(){
    await getSongs('songs/shawn');
    playMusic(songs[0],true);
    await displayAlbums()



    

    play.addEventListener('click',()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = 'img/pause.svg';
        }else{
            currentSong.pause();
            play.src='img/play.svg';
        }
    })

    currentSong.addEventListener('timeupdate',()=>{
        document.querySelector('.songtime').innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`;
        document.querySelector('.circle').style.left=(currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    document.querySelector('.seekbar').addEventListener('click',(e)=>{
        // console.log(e.target.getBoundingClientRect().width,e.offsetX);
        let percant = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector('.circle').style.left= percant + '%';
        currentSong.currentTime=(currentSong.duration*percant)/100;
    })
    let interval;
    document.querySelector('.hamburger').addEventListener('click',()=>{
        document.querySelector('.left').style.left='0';
            interval=setInterval(colorChanger,300);
    })
    document.querySelector('.close').addEventListener('click',()=>{
        document.querySelector('.left').style.left= '-120%';
        clearInterval(interval);
        document.querySelector('.left').style.backgroundColor= 'black';

    })
}

next.addEventListener('click',()=>{
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split(`/${currfolder}/`)[1]);
    if(index+1<songs.length){
        playMusic(songs[index+1]);
    }
    if(index+1==songs.length){
        index=0;
        playMusic(songs[index]);
    } 
})
previous.addEventListener('click',()=>{
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split(`/${currfolder}/`)[1]);
    if(index-1>=0){
        playMusic(songs[index-1]);
    }
    if(index-1==-1){
        index=songs.length-1;
        playMusic(songs[index]);
    } 
})

document.querySelector(".range").getElementsByTagName('input')[0].addEventListener('change',(e)=>{
    if(e.target.value==0){
        volume.src='img/mute.svg';
    }else{
        volume.src='img/volume.svg';
    }
    currentSong.volume=parseInt(e.target.value)/100;
})
document.querySelector(".range>img").addEventListener('click',(e)=>{
    if(e.target.src.includes('volume.svg')){
       e.target.src=e.target.src.replace('volume.svg','mute.svg');
       document.querySelector(".range").getElementsByTagName('input')[0].value=0;
       currentSong.volume = 0;
    }else{
        e.target.src=e.target.src.replace('mute.svg','volume.svg');
        document.querySelector(".range").getElementsByTagName('input')[0].value=10;
        currentSong.volume = .10;
   }
})


main();
 





{/* <div>${song.replaceAll('%20'," ").split('-')[0]}</div>  */}
