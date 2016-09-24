// Generated by CoffeeScript 1.10.0
(function() {
  module.exports = function() {
    var ACE_HIGH, Card, FLUSH, FLUSH_DRAW, FULL_HOUSE, Hand, PAIR, Player, QUADS, ROYAL_FLUSH, STRAIGHT, STRAIGHT_DRAW, STRAIGHT_FLUSH, TRIPS, TWO_PAIR, Table, info, obj;
    info = {
      name: 'silen',
      email: 'josey_rick@hotmail.com',
      btcWallet: '14qo7fddWtKz8BsN2RC5RZ7HEPLWm3Cmbe'
    };
    ROYAL_FLUSH = 100;
    STRAIGHT_FLUSH = 100;
    QUADS = 100;
    FULL_HOUSE = 100;
    FLUSH = 80;
    STRAIGHT = 75;
    TRIPS = 50;
    TWO_PAIR = 50;
    PAIR = 20;
    FLUSH_DRAW = 20;
    STRAIGHT_DRAW = 20;
    ACE_HIGH = 0;
    Card = (function() {
      function Card(card) {
        this.card = card;
        this.suit = this.getSuit();
        this.value = this.getValue();
      }

      Card.prototype.getSuit = function() {
        var suit;
        suit = this.card.charAt(1);
        switch (suit) {
          case 'c':
          case 'C':
            return 'club';
          case 's':
          case 'S':
            return 'spade';
          case 'd':
          case 'D':
            return 'diamond';
          case 'h':
          case 'H':
            return 'heart';
        }
      };

      Card.prototype.getValue = function() {
        var val;
        val = this.card.charAt(0);
        if (!isNaN(Number(val))) {
          return parseInt(val, 10);
        }
        switch (val) {
          case 'T':
          case 't':
            return 10;
          case 'J':
          case 'j':
            return 11;
          case 'Q':
          case 'q':
            return 12;
          case 'K':
          case 'k':
            return 13;
          case 'A':
          case 'a':
            return 14;
        }
      };

      return Card;

    })();
    Hand = (function() {
      function Hand(cards) {
        this.cards = cards.map(function(card) {
          return new Card(card);
        });
        this.sortCards();
        this.organized = this.organizeHand();
      }

      Hand.prototype.sortCards = function() {
        return this.cards.sort(function(a, b) {
          return a.getValue() - b.getValue();
        });
      };

      Hand.prototype.organizeHand = function() {
        var organized;
        organized = {
          suits: {
            spades: [],
            clubs: [],
            hearts: [],
            diamonds: []
          },
          values: {
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            9: [],
            10: [],
            11: [],
            12: [],
            13: [],
            14: []
          }
        };
        this.cards.forEach(function(card) {
          organized.suits[card.getSuit() + 's'].push(card);
          return organized.values[card.getValue()].push(card);
        });
        return organized;
      };

      Hand.prototype.isRoyalFlush = function() {
        return this.getHighCard() === 14 && this.isStraightFlush();
      };

      Hand.prototype.isStraightFlush = function() {
        return this.isFlush() && this.isStraight();
      };

      Hand.prototype.isQuads = function() {
        return this.getSameValueCount() === 4;
      };

      Hand.prototype.isFullHouse = function() {
        var _this, hasPair, hasTrips;
        hasTrips = false;
        hasPair = false;
        _this = this;
        Object.keys(this.organized.values).forEach(function(key) {
          if (_this.organized.values[key].length === 2) {
            hasPair = true;
          }
          if (_this.organized.values[key].length === 3) {
            return hasTrips = true;
          }
        });
        return hasPair && hasTrips;
      };

      Hand.prototype.isFlush = function() {
        return this.getSameSuitCount() === 5;
      };

      Hand.prototype.isStraight = function() {
        var cards, cardsInHand, diff, previousCard, vals;
        vals = this.cards.map(function(card) {
          return card.getValue();
        });
        previousCard = 0;
        cardsInHand = this.cards.length;
        cards = [];
        diff = null;
        if (cardsInHand < 5) {
          return false;
        }
        return vals.some(function(val) {
          previousCard = cards[cards.length - 1];
          diff = null;
          if (previousCard) {
            diff = val - previousCard;
          }
          if (diff > 1) {
            cards = [];
            cards.push(val);
          } else if (diff === 1) {
            cards.push(val);
          }
          if (cards.length === 5) {
            return true;
          }
        });
      };

      Hand.prototype.isTrips = function() {
        return this.getSameValueCount() === 3;
      };

      Hand.prototype.isTwoPair = function() {
        var _this, pairCount;
        pairCount = 0;
        _this = this;
        Object.keys(this.organized.values).forEach(function(key) {
          if (_this.organized.values[key].length === 2) {
            return pairCount++;
          }
        });
        return pairCount === 2;
      };

      Hand.prototype.isPair = function() {
        return this.getSameValueCount === 2;
      };

      Hand.prototype.getHighCard = function() {
        var vals;
        vals = this.cards.map(function(card) {
          return card.getValue();
        });
        return Math.max.apply(null, vals);
      };

      Hand.prototype.getSameValueCount = function() {
        var _this, sameValueCount;
        sameValueCount = 0;
        _this = this;
        Object.keys(this.organized.values).forEach(function(key) {
          if (_this.organized.values[key].length > sameValueCount) {
            return sameValueCount = _this.organized.values[key].length;
          }
        });
        return sameValueCount;
      };

      Hand.prototype.getSameSuitCount = function() {
        var _this, sameSuitCount;
        sameSuitCount = 0;
        _this = this;
        Object.keys(this.organized.suits).forEach(function(key) {
          if (_this.organized.suits[key].length > sameSuitCount) {
            return sameSuitCount = _this.organized.suits[key].length;
          }
        });
        return sameSuitCount;
      };

      Hand.prototype.isPotentialStraight = function(cardsRequired) {
        var matches, previousCard, vals;
        vals = this.cards.map(function(card) {
          return card.getValue();
        });
        previousCard = 0;
        matches = 0;
        vals.forEach(function(val) {
          if (~vals.indexOf(val + 1)) {
            return matches++;
          }
        });
        return matches >= cardsRequired;
      };

      Hand.prototype.isPotentialFlush = function(cardsRequired) {
        return this.getSameSuitCount() >= cardsRequired;
      };

      Hand.prototype.getStrength = function(state) {
        if (state == null) {
          state = 'turn';
        }
        if (this.isRoyalFlush()) {
          return ROYAL_FLUSH;
        }
        if (this.isStraightFlush()) {
          return STRAIGHT_FLUSH;
        }
        if (this.isQuads()) {
          return QUADS;
        }
        if (this.isFullHouse()) {
          return FULL_HOUSE;
        }
        if (this.isFlush()) {
          return FLUSH;
        }
        if (this.isStraight() && STRAIGHT) {
          return STRAIGHT;
        }
        if (this.isTrips() && TRIPS) {
          return TRIPS;
        }
        if (this.isTwoPair() && TWO_PAIR) {
          return TWO_PAIR;
        }
        if (this.isPair() && PAIR) {
          return PAIR;
        }
        switch (state) {
          case 'pre-flop':
            if (this.isPotentialFlush(2) && FLUSH_DRAW) {
              return FLUSH_DRAW;
            }
            if (this.isPotentialStraight(2) && STRAIGHT_DRAW) {
              return STRAIGHT_DRAW;
            }
            if (this.getHighCard() === 14 && ACE_HIGH) {
              return ACE_HIGH;
            }
            break;
          case 'flop':
          case 'river':
            if (this.isPotentialFlush(4) && FLUSH_DRAW) {
              return FLUSH_DRAW;
            }
            if (this.isPotentialStraight(4) && STRAIGHT_DRAW) {
              return STRAIGHT_DRAW;
            }
            break;
          case 'turn':
            void 0;
        }
        return 0;
      };

      return Hand;

    })();
    Player = (function() {
      function Player(self, table) {
        this.table = table;
        this.bets = this.table.getBets();
        this.player = self;
        this.hand = new Hand(this.player.cards.concat(this.table.getCommunity()));
      }

      Player.prototype.getHandStrength = function() {
        return this.hand.getStrength(this.table.getState());
      };

      Player.prototype.getBet = function() {
        var bet, chipLeader, handStrength, raiseAmount, ref, ref1, ref2, secondChipLeader, toCall;
        handStrength = this.getHandStrength();
        toCall = this.bets.call;
        chipLeader = this.table.getChipLeader();
        secondChipLeader = this.table.getChipLeader(2);
        raiseAmount = 40;
        bet = 20;
        if (handStrength === 100) {
          raiseAmount = raiseAmount * handStrength / 2;
        } else {
          raiseAmount = bet * handStrength / 2;
        }
        switch (this.table.getState()) {
          case 'pre-flop':
            if (!handStrength) {
              if (toCall <= this.table.getBigBlind()) {
                bet = toCall;
              }
            } else {
              bet = (ref = toCall > raiseAmount) != null ? ref : {
                10: toCall
              };
            }
            break;
          case 'flop':
          case 'turn':
          case 'river':
            if (!handStrength) {
              return 0;
            }
            if (this.bets.canRaise && handStrength >= STRAIGHT) {
              bet = (ref1 = raiseAmount < toCall) != null ? ref1 : {
                toCall: raiseAmount
              };
            } else {
              bet = (ref2 = toCall > raiseAmount) != null ? ref2 : {
                0: toCall
              };
            }
        }
        return bet;
      };

      return Player;

    })();
    Table = (function() {
      function Table(game) {
        this.game = game;
        this.players = game.players;
      }

      Table.prototype.sortPlayers = function() {
        return this.players.sort(function(a, b) {
          return b.chips - a.chips;
        });
      };

      Table.prototype.getChipLeader = function(rank) {
        rank = rank != null ? rank : rank - {
          1: 0
        };
        this.sortPlayers();
        return this.players[rank];
      };

      Table.prototype.getBigBlind = function() {
        var bigBlind;
        bigBlind = 0;
        this.players.forEach(function(player) {
          if (player.blind > bigBlind) {
            return bigBlind = player.blind;
          }
        });
        return bigBlind;
      };

      Table.prototype.getState = function() {
        return this.game.state;
      };

      Table.prototype.getCommunity = function() {
        return this.game.community;
      };

      Table.prototype.getBets = function() {
        return this.game.betting;
      };

      return Table;

    })();
    obj = {
      update: function(game) {
        var player, table;
        table = new Table(game);
        player = new Player(game.self, table);
        if (game.state !== 'complete') {
          return player.getBet();
        }
      },
      info: info
    };
    return obj;
  };

}).call(this);