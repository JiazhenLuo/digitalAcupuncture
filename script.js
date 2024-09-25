document.addEventListener('DOMContentLoaded', function(){

    fetch('acupoints.json')
        .then(response => {
            if(!response.ok){
                throw new Error('error')
            }
            return response.json();
        })

        .then(jsonData => {
            const points = document.querySelectorAll('.acupoint span');
            const imgDisplay = document.getElementById('img-display');
            const songInfoDisplay = document.getElementById('song-info');
            const audioPlayer = document.getElementById('audio-player');


            points.forEach(point =>{
                const title = point.getAttribute('data-title');
                const matchingTrack = jsonData.find(track => track.title === title);

                if(matchingTrack) {

                    point.addEventListener('mouseenter',function(){
                        imgDisplay.style.backgroundImage = `url(${matchingTrack.picture})`;
                        imgDisplay.style.left = `${point.offsetLeft + 20}px`;
                        imgDisplay.style.top = `${point.offsetTop}px`; 
                        imgDisplay.style.width = "8vw"; 
                        imgDisplay.style.height = "8vw";
                        imgDisplay.style.backgroundSize = "cover";
                        imgDisplay.style.display = 'block'; 

                        imgDisplay.style.opacity = '1';
                        imgDisplay.style.transitionDelay = '0s';

                        displayTypingEffect(songInfoDisplay, matchingTrack);
                    })

                    point.addEventListener('mouseleave', function(){
                        imgDisplay.style.opacity = '0';
                        imgDisplay.style.transitionDelay = '0s'; 
                    });

                    point.addEventListener('click', function(event){
                        event.stopPropagation();
                        audioPlayer.src = matchingTrack.audioUrl;
                        audioPlayer.style.display = 'none';
                        audioPlayer.play();
                    })
                }
                else{
                    console.error('nomatching')
                }

                document.addEventListener('click', function(){
                    if(!audioPlayer.paused){
                        audioPlayer.pause();
                    }
                })
            })
        })
})

function displayTypingEffect(element, trackData){
    const textContent = `
        "title": ${trackData.title}
        "artist": ${trackData.artist};
        "album": ${trackData.album};
        "duration": ${trackData.duration} seconds
        "id": ${trackData.id}`;
        

    const words = textContent.split('')

    console.log(textContent)

    let wordIndex = 0;

    function typeNextChar(){
        if(wordIndex < words.length){
            element.innerHTML += words[wordIndex]+''
            wordIndex++;

            element.scrollTop = element.scrollHeight;

            const randomDelay = Math.floor(Math.random() * (20 - 5 + 1)) + 5; 
            setTimeout(typeNextChar, randomDelay); 
        }
    }

    typeNextChar();
}

function playAudio(url){
    new Audio(url).play();
}