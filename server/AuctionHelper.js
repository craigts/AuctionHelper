Auctions = new Meteor.Collection("auctions");

var timeLeft = function(auctionId) {
  var a = Auctions.findOne(auctionId);
  if(a.countdown > 0) {
     Auctions.update({_id: auctionId}, {$inc: {countdown: -1}});
  }
  else {
    Meteor.clearInterval(countIntervals[auctionId]);
  }
};


var countIntervals = {}; 

var startBidding = function(auctionId) {
  if(typeof(auctionId) == 'undefined') return;
  if(auctionId in countIntervals)
    Meteor.clearInterval(countIntervals[auctionId]);
  var a = Auctions.findOne(auctionId);
  Auctions.update(auctionId, {$set: {currentBid: 0, countdown: a.maxCount, currentBidder: 'none'}});
  countIntervals[auctionId] = Meteor.setInterval(function() {
      timeLeft(auctionId);
    }, 
    1000);
};

Meteor.startup(function () {
  // code to run on server at startup
  startBidding(Auctions.findOne({name: "Evergreen Auction League"})._id);
});

Meteor.methods({
  reset: function (auctionName) {
    startBidding(Auctions.findOne({name: auctionName})._id);
  },
  bidOne: function (auctionName) {
    var a = Auctions.findOne({name: auctionName});
    if(a.countdown > 0) {
      Auctions.update(a._id, {
        $inc: {
          currentBid: 1 
        },
        $set: {
          currentBidder: Meteor.user().emails[0].address
        }
      });
      if(a.countdown <= a.maxCount-3) {
        Auctions.update(a._id, {
          $inc: {
            countdown: 3
          }
        });      
      }
    }
  }
  
});
