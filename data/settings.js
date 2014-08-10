define([], function () {
	return {
		// Viewport settings.
		view: {
			width: 500,
			height: 500
		},

		// Random map generation settings.
		map: {
			width: {
				min: 20,
				max: 50
			},
			height: {
				min: 20,
				max: 50
			},
			tile: {
				width: 16,
				height: 16
			}
		}
	};
});