$(document).ready(function () {
    $("#far-clouds").clouds({
		fps: 30,
        speed: 0.7,
        dir: "left"
    });
    
	$("#near-clouds").clouds({
		fps: 30,
        speed: 1,
        dir: "left"
    });
});