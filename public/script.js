const socket = io('/');
const videoGridH = document.getElementById('video-gridH');
const videoGridA = document.getElementById('video-gridA');
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
});
const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStreamH(myVideo, stream);

  myPeer.on('call', call => {
    call.answer(stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
  });

  socket.on('user-connected', userId => {
    setTimeout(() => {
      connectToNewUser(userId, stream);
    }, 1000);
  });
});

socket.on('user-disconnected', userId => {
  if (peers[userId]) {
    peers[userId].close();
    delete peers[userId];
  }
});

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');
  
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream);
  });
  
  call.on('close', () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStreamH(video, stream) {
  video.srcObject = stream;
  video.playsInline = true;
  video.style.width = '100%';
  video.style.height = 'auto';
  
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  
  videoGridH.append(video);
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.playsInline = true;
  video.style.width = '100%';
  video.style.height = 'auto';
  
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  
  videoGridA.append(video);
}