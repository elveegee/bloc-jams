var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1885',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21'},
         { title: 'Magenta', duration: '2:15'}
     ]
 };

 // Another Example Album
 var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
 };

 var albumArchers = {
      title: 'All the Nations Airports',
      artist: 'Archers of Loaf',
      label: 'Alias Records',
      year: '1996',
      albumArtUrl: 'assets/images/album_covers/archers.jpg',
      songs: [
          { title: 'Strangled by the Stereo Wire', duration: '3:26' },
          { title: 'All the Nations Airports', duration: '3:43' },
          { title: 'Scenic Pastures', duration: '5:55' },
          { title: 'Worst Defense', duration: '8:21'},
          { title: 'Attack of the Killer Bees', duration: '2:56'}
      ]
  };

 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

     return template;
 };

 var albumTitle = document.getElementsByClassName('album-view-title')[0];
 var albumArtist = document.getElementsByClassName('album-view-artist')[0];
 var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
 var albumImage = document.getElementsByClassName('album-cover-art')[0];
 var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

 var setCurrentAlbum = function(album) {
     albumTitle.firstChild.nodeValue = album.title;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);

     albumSongList.innerHTML = '';

     for (var i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
     }
 };

 window.onload = function() {
     var now = 0;
     var allAlbums = [albumPicasso, albumMarconi, albumArchers];
     setCurrentAlbum(allAlbums[now]);
     var loadNext = function(){
       now++;
       setCurrentAlbum(allAlbums[now]);
     };
     document.getElementsByClassName("album-cover-art").addEventListener('click', loadNext);
 }

 var songListContainer = document.getElementsByClassName('album-view-song-list')[0];

window.onload = function() {
    setCurrentAlbum(albumPicasso);

    songListContainer.addEventListener('mouseover', function(event) {
        // #1
        console.log(event.target);
    });
