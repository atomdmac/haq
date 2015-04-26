define(['jaws', 'data/settings'], function (jaws, settings) {

var FogViewport = function (options) {
	jaws.Viewport.call(this, options);
};

FogViewport.prototype = Object.create(jaws.Viewport.prototype);

FogViewport.prototype.drawGameWorld = function(_data) {
    var map    = _data.map,
        player = _data.player,
        npcs   = _data.npcs,
        i, j; // <- Iterators

	var sprites = map.atRect({ 
        x: this.x, 
        y: this.y,
        right: this.x + this.width, 
        bottom: this.y + this.height
    });

    this.apply( function() {

        // Draw map cells
    	for(i=0; i < sprites.length; i++) {
            if(player.canSee(sprites[i].xTile, sprites[i].yTile)) {
                sprites[i].setVisibility(1);
                sprites[i].draw();
            } 

            else if(player.canRemember(sprites[i].xTile, sprites[i].yTile)) {
                sprites[i].setVisibility(0);
                sprites[i].draw();
            }
        }

        // Draw NPCs.
        for(i=0; i<npcs.length; i++) {

            npcs[i].draw();

            var overlappingCells = getOverlappingCells(npcs[i], map);
            for(j=0; j<overlappingCells.length; j++) {
                if(!player.canSee(overlappingCells[j].xTile, overlappingCells[j].yTile)) {
                    if(player.canRemember(overlappingCells[j].xTile, overlappingCells[j].yTile)) {
                        overlappingCells[j].setVisibility(0);
                        overlappingCells[j].draw();    
                    } else {
                        blackOutCell(overlappingCells[j]);
                    }
                }
            }
        }

        // Draw player.
        player.draw();
    });
};

function getOverlappingCells (actor, map) {
    var overlappingCells = [];
    var items;
    var rect = actor.rect();

    try {
        var from_col = parseInt(rect.x / map.cell_size[0], 10);
        if (from_col < 0) {
            from_col = 0;
        }
        var to_col = parseInt(rect.right / map.cell_size[0], 10);
        if (to_col >= map.size[0]) {
            to_col = map.size[0] - 1;
        }
        var from_row = parseInt(rect.y / map.cell_size[1], 10);
        if (from_row < 0) {
            from_row = 0;
        }
        var to_row = parseInt(rect.bottom / map.cell_size[1], 10);
        if (to_row >= map.size[1]) {
            to_row = map.size[1] - 1;
        }

        for(var col = from_col; col <= to_col; col++) {
            for(var row = from_row; row <= to_row; row++) {
                overlappingCells = overlappingCells.concat(map.cell(col, row));
            }
        }
    }
    catch(e) {
        // ... problems
    }

    return overlappingCells;
}

function blackOutCell (cell) {

    var ctx = jaws.context;

    ctx.save();
    ctx.fillStyle = "#000";

    ctx.beginPath();
    ctx.rect(
        cell.x,
        cell.y,
        settings.map.tile.width,
        settings.map.tile.height
    );
    ctx.fill();
    ctx.restore();
}

return FogViewport;

});