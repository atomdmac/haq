define([], function () {
	return {
		// Viewport settings.
		view: {
			width: 700,
			height: 500
		},

		// Random map generation settings.
		map: {
			width: {
				min: 50,
				max: 50
			},
			height: {
				min: 50,
				max: 50
			},
			tile: {
				width: 16,
				height: 16
			}
		},

		// NPC Settings
		npc: {
			drawPaths: false
		}
	};
});