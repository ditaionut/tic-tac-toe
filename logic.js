'use strict';

var blockTemplateString = null;
var theGame = null;

function CBlock () {
  this.isTouched;
  this.value;
  this.indexX;
  this.indexY;
  this.div;
}

CBlock.prototype.init = function (indexX, indexY) {
  var self = this;
  this.isTouched = false;
  this.isOwnedBy = '';
  this.value = '';
  this.indexX = indexX;
  this.indexY = indexY;
  this.div = $(blockTemplateString);
	this.div.attr('id', 'block-line' + indexX + '-col' + indexY);

  this.div.click(function () {
    theGame.click(indexX, indexY);
  });

  $('#gameArea').append(this.div);
};

CBlock.prototype.set = function (player) {
  this.isTouched = true;
  this.value = player.substr(-1);
  this.div.find('.blockText').text(this.value);
};

function CGame () {
  this.blocks;
  this.players;
  this.currentPlayer;
  this.numberOfBlocks;
  this.numberOfClickedBlocks;
  this.playerTurn;
  this.endGame;
	this.hasEnded;
  this.winningLine;
	this.winningColumn;
  this.winningDiagonalOne;
	this.winningDiagonalTwo;
	this.finalLine;
}

CGame.prototype.init = function (numberOfBlocks) {
  $('#gameArea').empty();
  this.numberOfBlocks = numberOfBlocks;
  this.numberOfClickedBlocks = null;
  this.blocks = [];
  this.winningLine = [];
	this.hasEnded = false;
	this.winningColumn = [];
  this.winningDiagonalOne = [];
	this.winningDiagonalTwo = [];
	this.finalLine = [];
  this.players = ['Player X', 'Player 0'];
  this.currentPlayer = this.players[0];

  $('#canvasDiv').attr('width', window.innerWidth);
	$('#canvasDiv').attr('height', window.innerHeight);
	$('#canvasDiv').hide();
	
  for (var indexX = 0; indexX < this.numberOfBlocks; indexX++) {
    var vertBlocks = [];
    for (var indexY = 0; indexY < this.numberOfBlocks; indexY++) {
      var block = new CBlock;
      block.init(indexX, indexY);
      vertBlocks.push(block);
    }
    this.blocks.push(vertBlocks);
  }
	
  $('#gameArea').css('width', this.numberOfBlocks * this.blocks[0][0].div.outerWidth(true) + 'px');
  $('#gameArea').css('height', this.numberOfBlocks * this.blocks[0][0].div.outerWidth(true) + 'px');
	 displayPlayer(this.currentPlayer + ' turn'); 
};

	
CGame.prototype.click = function (indexX, indexY) {
  if (!this.blocks[indexX][indexY].isTouched) {
    this.blocks[indexX][indexY].set(this.currentPlayer);
    this.numberOfClickedBlocks++;  
      
		this.checkVictoryCondition();
    if (this.hasEnded) {
      resultsMessage(this.currentPlayer + ' has won!');
      return;
    } else if (this.numberOfClickedBlocks === Math.pow(this.numberOfBlocks, 2)) {
      resultsMessage('The game was a draw!');
      return;
    } 
	  
	  switch (this.currentPlayer){
		  case this.players[0]: 
			  this.currentPlayer = this.players[1];  
             break;
          case this.players[1]: 
			  this.currentPlayer = this.players[0];
             break;		
        }
	 displayPlayer(this.currentPlayer + ' turn');
  }  
};

CGame.prototype.checkVictoryCondition = function () {
	var self = this;
  var vertSum = '';
  var horizSum = '';
  var diagonalOne = '';
  var diagonalTwo = '';
  var xString = 'X'.repeat(this.numberOfBlocks);
  var oString = '0'.repeat(this.numberOfBlocks);
	
	function coloredBlocks(lineToCheck, winningLine){	    
      if (lineToCheck == xString || lineToCheck == oString) {
        self.hasEnded = true;
				self.finalLine = winningLine;
				self.drawWinningLine(winningLine);
      }
	}

  for (var indexHoriz = 0; indexHoriz < this.numberOfBlocks; indexHoriz++) {
    for (var indexVert = 0; indexVert < this.numberOfBlocks; indexVert++) {
			this.winningLine.push({x: indexVert, y: indexHoriz});
			this.winningColumn.push({x: indexHoriz, y: indexVert});
      if (indexHoriz == indexVert) {
        diagonalOne += this.blocks[indexHoriz][indexVert].value;
				this.winningDiagonalOne.push({x: indexHoriz, y: indexVert});
      }
      if (indexHoriz + indexVert == this.numberOfBlocks - 1) {
        diagonalTwo += this.blocks[indexHoriz][indexVert].value;
				this.winningDiagonalTwo.push({x: indexHoriz, y: indexVert});
      }
      vertSum += this.blocks[indexHoriz][indexVert].value;
      horizSum += this.blocks[indexVert][indexHoriz].value;
			
			coloredBlocks(diagonalOne, this.winningDiagonalOne, xString, oString);
			coloredBlocks(diagonalTwo, this.winningDiagonalTwo, xString, oString);
			coloredBlocks(horizSum, this.winningLine, xString, oString);
			coloredBlocks(vertSum, this.winningColumn, xString, oString);
			
				if (this.winningDiagonalOne.length == this.numberOfBlocks) {
					this.winningDiagonalOne.length = 0;
				}
				if (this.winningDiagonalTwo.length == this.numberOfBlocks) {
				  this.winningDiagonalTwo.length = 0;
				}
    }
    vertSum = '';
    horizSum = '';
		this.winningLine.length = 0;
		this.winningColumn.length = 0;
  }
};



CGame.prototype.drawWinningLine = function (coordsArray) {
//	coordsArray.forEach(function(coords) {
//		var selectedBlock = $('#block-line' + coords.x + '-col' + coords.y);
//		selectedBlock.addClass('winningBlock');
//	});
  var firstBlock = $('#block-line' + coordsArray[0].x + '-col' + coordsArray[0].y);
	var positionFirst = firstBlock.position();
	
	
	
	var lBlock = $('#block-line' + coordsArray[coordsArray.length - 1].x + '-col' + coordsArray[coordsArray.length - 1].y);
	var positionLast = lBlock.position();
	console.log(positionFirst, positionLast);	
	
	$('#canvasDiv').show();
  
	var canvasLine = $('#canvasDiv')[0];
	var canvasContext = canvasLine.getContext("2d");
	canvasContext.beginPath();
	canvasContext.moveTo(positionFirst.left + this.blocks[0][0].div.outerWidth(true) / 2, positionFirst.top + this.blocks[0][0].div.outerWidth(true) / 2);
	canvasContext.lineTo(positionLast.left + this.blocks[0][0].div.outerWidth(true) / 2, positionLast.top + this.blocks[0][0].div.outerWidth(true) / 2);
	canvasContext.lineWidth = 3;
	canvasContext.lineCap = "round";
	canvasContext.strokeStyle = '#ff0000';
	canvasContext.stroke();
};

CGame.prototype.destroyGame = function() {
  this.blocks.length = 0;	
  $('.block').off();
};

function displayPlayer(txt) {
  $('#displayCurrentPlayer').text(txt);
}

function resultsMessage(message) {
  $('#gameResult').text(message);
	theGame.destroyGame();
	theGame = null;
}

function errorAlert() {
  alert('The input value needs to be a number [1-49]!');
  $('#columnsInput').val(null);
}

function setupEvents() {
  $('#setButton').click(function () {    
    var numberOfColumns = $('#columnsInput').val();
    if ($.isNumeric(numberOfColumns)) {
      if (numberOfColumns > 0 && numberOfColumns < 50) {
//        $('#columnsInput').val(null);
        theGame.init(numberOfColumns);
      } else {
        errorAlert();
      }
    } else {
      errorAlert();
    }
  });
  $('#newGame').on('click', function() {
    var numberOfColumns = $('#columnsInput').val();
	theGame = new CGame();
	theGame.init(3);
	$('#gameResult').text("");
  });
}


$(function() {
  blockTemplateString = document.querySelector('#block_template').innerHTML;
  theGame = new CGame();

  theGame.init(3);
  setupEvents();
});


