var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    updatePlayerBarSong();

    var $nextSongNumberCell = parseInt($('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]'));
    var $lastSongNumberCell = parseInt($('.song-item-number[data-song-number="' + lastSongNumber + '"]'));

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    setSong(songNumber);
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = parseInt($('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]'));
    var $lastSongNumberCell = parseInt($('.song-item-number[data-song-number="' + lastSongNumber + '"]'));

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var setSong = function(songNumber){
    if (currentSoundFile) {
      currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl), {
        formats: ['mp3'],
        preload: true
    };
    setVolume(currentVolume);
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
};

var setVolume = function (volume){
    if (currentSoundFile) {
      currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
}

var createSongRow = function(songNumber, songName, songLength) {
   var template =
      '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

 var $row = $(template);

 var onHover = function(event) {
    var songNumberCell = parseInt($(this).find('.song-item-number'));
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));
    if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(playButtonTemplate);
    }
 };

 var offHover = function(event) {
    var songNumberCell = parseInt($(this).find('.song-item-number'));
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(songNumber);
    }
 };

 $row.find('.song-item-number').click(clickHandler);

var clickHandler = function() {
  var songNumber = parseInt($(this).attr('data-song-number'));
  if (currentlyPlayingSongNumber !== null) {
    var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingCell.html(currentlyPlayingSongNumber);
  }
  if (currentlyPlayingSongNumber !== songNumber) {
    $(this).html(pauseButtonTemplate);
    setSong(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    updatePlayerBarSong();
  } else if (currentlyPlayingSongNumber === songNumber) {
    $(this).html(playButtonTemplate);
    $('.main-controls .play-pause').html(playerBarPlayButton);
    currentlyPlayingSongNumber = null;
    currentSongFromAlbum = null;
  }
};

$row.hover(onHover, offHover);
return $row;
};

var $albumTitle = $('.album-view-title');
var $albumArtist = $('.album-view-artist');
var $albumReleaseInfo = $('.album-view-release-info');
var $albumImage = $('.album-cover-art');
var $albumSongList = $('.album-view-song-list');

var setCurrentAlbum = function(album) {
   currentAlbum = album;
   $albumTitle.text(album.title);
   $albumArtist.text(album.artist);
   $albumReleaseInfo.text(album.year + ' ' + album.label);
   $albumImage.attr('src', album.albumArtUrl);

   $albumSongList.empty();

   for (var i = 0; i < album.songs.length; i++) {
     var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
     $albumSongList.append($newRow);
   }
};

var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             // #11
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');

             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 };

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

 var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');

     $seekBars.click(function(event) {
         // #3
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         // #4
         var seekBarFillRatio = offsetX / barWidth;

         // #5
         updateSeekPercentage($(this), seekBarFillRatio);
     });

     $seekBars.find('.thumb').mousedown(function(event) {
         // #8
         var $seekBar = $(this).parent();

         // #9
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;

             updateSeekPercentage($seekBar, seekBarFillRatio);
         });

         // #10
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
 };

var trackIndex = function(album, song) {
   return album.songs.indexOf(song);
};

var updatePlayerBarSong = function(){
 $('.currently-playing .song-name').text(currentSongFromAlbum.title);
 $('.currently-playing .artist-name').text(currentAlbum.artist);
 $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
 $('.main-controls .play-pause').html(playerBarPauseButton);
};


//To scroll through the album covers upon clicking.
 window.onload = function() {
     var now = 0;
     var allAlbums = [albumPicasso, albumMarconi, albumArchers];
     setCurrentAlbum(allAlbums[now]);
     var loadNext = function(){
       now++;
       if (now > 2){
         now = 0;
         setCurrentAlbum(allAlbums[now]);
       }
       else{
         setCurrentAlbum(allAlbums[now]);
       }
     };
     $albumImage.addEventListener('click', loadNext);
 }

//Variable for the table (to use with the below event listener)
//Variables for button icons.
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;
 var currentSoundFile = null;
 var currentVolume = 80;
 var currentAlbum = null;
 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');
 var $playPauseControls = $('.main-controls .play-pause');

var togglePlayFromPlayerBar = function (){
  var songNumberCell = parseInt($(this).find('.song-item-number'));
  var songNumber = parseInt(songNumberCell.attr('data-song-number'));
  if (currentSoundFile) {
    songNumberCell.html(playButtonTemplate);
    $playPauseControls.html(playerBarPlayButton);
    currentSoundFile.stop();
  }
  else {
    songNumberCell.html(pauseButtonTemplate);
    $playPauseControls.html(playerBarPauseButton);
    currentSoundFile.play();
  }
};

 $(document).ready(function() {
      setCurrentAlbum(albumPicasso);
      setupSeekBars();
      $previousButton.click(previousSong);
      $nextButton.click(nextSong);
      $playPauseControls.addEventListener("click", function() {
        togglePlayFromPlayerBar();
      });
  });
