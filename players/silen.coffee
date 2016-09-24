# inherite from whistle_tips
module.exports = () ->
  info =
    name: 'silen'
    email: 'josey_rick@hotmail.com'
    btcWallet: '14qo7fddWtKz8BsN2RC5RZ7HEPLWm3Cmbe'

  # Hands
  ROYAL_FLUSH = 100
  STRAIGHT_FLUSH = 100
  QUADS = 100
  FULL_HOUSE = 100
  FLUSH = 80
  STRAIGHT = 75
  TRIPS = 50
  TWO_PAIR = 50
  PAIR = 20

  # Potentials
  FLUSH_DRAW = 20
  STRAIGHT_DRAW = 20
  ACE_HIGH = 0

  class Card

    constructor: (card) ->
      @card = card
      @suit = @getSuit()
      @value = @getValue()

    getSuit: () ->
      suit = @card.charAt(1);

      switch suit
        when 'c', 'C' then 'club'
        when 's', 'S' then 'spade'
        when 'd', 'D' then 'diamond'
        when 'h', 'H' then 'heart'

    getValue: () ->
      val = @card.charAt(0)
      return parseInt(val, 10) if !isNaN(Number(val))

      switch val
        when 'T', 't' then 10
        when 'J', 'j' then 11
        when 'Q', 'q' then 12
        when 'K', 'k' then 13
        when 'A', 'a' then 14

  class Hand

    constructor: (cards) ->
      @cards = cards.map (card) -> new Card(card)
      @sortCards()
      @organized = @organizeHand()

    sortCards: () ->
      @cards.sort (a, b) ->
        a.getValue() - b.getValue()

    organizeHand: () ->
      organized =
        suits:
          spades: []
          clubs: []
          hearts: []
          diamonds: []
        values:
          2: [], 3: [], 4: [], 5: [], 6: [],
          7: [], 8: [], 9: [], 10: [], 11: [],
          12: [], 13: [], 14: []

      @cards.forEach (card) ->
        organized.suits[card.getSuit() + 's'].push(card)
        organized.values[card.getValue()].push(card)

      organized

    isRoyalFlush: () ->
      @getHighCard() is 14 and @isStraightFlush()

    isStraightFlush: () ->
      @isFlush() and @isStraight()

    isQuads: () ->
      @getSameValueCount() is 4

    isFullHouse: () ->
      hasTrips = false
      hasPair = false
      _this = @

      Object.keys(@organized.values).forEach (key) ->
          hasPair = true if _this.organized.values[key].length is 2
          hasTrips = true if _this.organized.values[key].length is 3

      hasPair && hasTrips

    isFlush: () ->
      @getSameSuitCount() is 5

    isStraight: () ->
      vals = @cards.map (card) ->
        card.getValue()
      previousCard = 0
      cardsInHand = @cards.length
      cards = []
      diff = null

      return false if cardsInHand < 5

      return vals.some (val) ->
          previousCard = cards[cards.length - 1]
          diff = null
          diff = val - previousCard if previousCard
          if diff > 1
              cards = []
              cards.push(val)
          else if diff is 1
              cards.push(val)
          return true if cards.length is 5

    isTrips: () ->
      @getSameValueCount() is 3

    isTwoPair: () ->
      pairCount = 0
      _this = @

      Object.keys(@organized.values).forEach (key) ->
          pairCount++ if _this.organized.values[key].length is 2

      pairCount is 2

    isPair: () ->
      @getSameValueCount is 2

    getHighCard: () ->
      vals = @cards.map (card) ->
        card.getValue()
      Math.max.apply(null, vals)

    getSameValueCount: () ->
      sameValueCount = 0
      _this = this

      Object.keys(@organized.values).forEach (key) ->
        sameValueCount = _this.organized.values[key].length if _this.organized.values[key].length > sameValueCount

      sameValueCount

    getSameSuitCount: () ->
      sameSuitCount = 0
      _this = this

      Object.keys(@organized.suits).forEach (key) ->
        sameSuitCount = _this.organized.suits[key].length if _this.organized.suits[key].length > sameSuitCount

      sameSuitCount

    isPotentialStraight: (cardsRequired) ->
      vals = @cards.map (card) ->
        card.getValue()
      previousCard = 0
      matches = 0

      vals.forEach (val) ->
        matches++ if ~vals.indexOf(val + 1)

      matches >= cardsRequired

    isPotentialFlush: (cardsRequired) ->
      @getSameSuitCount() >= cardsRequired

    getStrength: (state) ->
      state ?= 'turn'

      if (@isRoyalFlush()) then return ROYAL_FLUSH
      if (@isStraightFlush()) then return STRAIGHT_FLUSH
      if (@isQuads()) then return QUADS
      if (@isFullHouse()) then return FULL_HOUSE
      if (@isFlush()) then return FLUSH
      if (@isStraight() && STRAIGHT) then return STRAIGHT
      if (@isTrips() && TRIPS) then return TRIPS
      if (@isTwoPair() && TWO_PAIR) then return TWO_PAIR
      if (@isPair() && PAIR) then return PAIR

      switch state
        when 'pre-flop'
          if (@isPotentialFlush(2) && FLUSH_DRAW) then return FLUSH_DRAW
          if (@isPotentialStraight(2) && STRAIGHT_DRAW) then return STRAIGHT_DRAW
          if (@getHighCard() is 14 && ACE_HIGH) then return ACE_HIGH
        when 'flop', 'river'
          if (@isPotentialFlush(4) && FLUSH_DRAW) then return FLUSH_DRAW
          if (@isPotentialStraight(4) && STRAIGHT_DRAW) then return STRAIGHT_DRAW
        when 'turn' then undefined

      0

  class Player

    constructor: (self, table) ->
      @table = table
      @bets = @table.getBets()
      @player = self

      @hand = new Hand(@player.cards.concat(@table.getCommunity()))

    getHandStrength: () ->
      @hand.getStrength(@table.getState())

    getBet: () ->
      handStrength = @getHandStrength()
      toCall = @bets.call
      chipLeader = @table.getChipLeader()
      secondChipLeader = @table.getChipLeader(2)
      raiseAmount = 40
      bet = 20

      if handStrength is 100
        raiseAmount = raiseAmount * handStrength/2
      else
        raiseAmount = bet * handStrength/2

      switch @table.getState()
        when 'pre-flop'
          if !handStrength
            bet = toCall if toCall <= @table.getBigBlind()
          else
            bet = toCall > raiseAmount ? 10 : toCall
        when 'flop', 'turn','river'
          return 0 if !handStrength

          if @bets.canRaise and handStrength >= STRAIGHT
            bet = raiseAmount < toCall ? toCall : raiseAmount
          else
            bet = toCall > raiseAmount ? 0 : toCall

      bet

  class Table

    constructor: (game) ->
      @game = game
      @players = game.players

    sortPlayers: () ->
      @players.sort (a, b) ->
        b.chips - a.chips

    # 筹码领先者
    getChipLeader: (rank) ->
      rank = rank ? rank - 1 : 0

      @sortPlayers()

      @players[rank]

    # 获取大盲的押注面额
    getBigBlind: () ->
      bigBlind = 0

      @players.forEach (player) ->
        bigBlind = player.blind if player.blind > bigBlind

      bigBlind

    getState: () ->
      @game.state

    getCommunity: () ->
      @game.community

    getBets: () ->
      @game.betting

  obj =
    update: (game) ->
      table = new Table(game)
      player = new Player(game.self, table)

      player.getBet() if game.state isnt 'complete'
    info: info

  obj
