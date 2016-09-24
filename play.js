var tournament = require('./test/tournament')
    , MachinePoker = require('machine-poker')
    , Silen = require('./players/silen')
    , challenger = MachinePoker.seats.JsLocal.create(Silen);

var table = tournament.createTable(challenger, {hands:10000, chips:10000});
table.addObserver(MachinePoker.observers.narrator);
table.start();
