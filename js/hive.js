(function init() {
    var width = 512;
    var height = 512;
    
    // Create PIXI renderer
    var renderer = PIXI.autoDetectRenderer(
        width, height,
        {antialias: true, transparent: false, resolution: 1}
    );
    document.body.appendChild(renderer.view);

    // Create PIXI stage
    var stage = new PIXI.Container();
    renderer.render(stage);
})();
