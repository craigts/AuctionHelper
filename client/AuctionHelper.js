Auctions = new Meteor.Collection("auctions");


  Session.set("currentAuctionName", "Evergreen Auction League");
  
  Template.page.auction = function() {
    return Auctions.find({name: Session.get("currentAuctionName")});
  }; 

  Template.auctionDetail.events({
    'click #btnResetCount': function () {
      // template data, if any, is available in 'this'
      Meteor.call('reset', Session.get("currentAuctionName")); 
    },
    'click #btnBidOne': function () {
      Meteor.call('bidOne', Session.get("currentAuctionName"));
    }
  });
