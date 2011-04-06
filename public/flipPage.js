/* 
 * FlipPage by José Leal Domingues Neto
 */

var FP = (function() {
    var images = null;
    var imgReady = [];
    var dim = null;
    var c2d = null;
    var canvas = null;

    var current = 0;

    // Variables to keep track of the click on the corners of the images.
    var okLeft = false;
    var okRight = false;

    var listen = [];

    function flipped() {
        var i;
        for (i = 0; i < listen.length; i++) {
            if (listen[i] != null)
                listen[i]();
        }
    }

    function drawClipRight(c2d, mouseX, mouseY) {
        if (images[current] == null)
            return;
        
        var x = (mouseX == 0 ? 1 : Math.abs(mouseX - dim.width * 2)), y = mouseY;

        // distance = root((x2 - x1)^2 + (y2 - y1)^2) / 2, since I want the middle of the thing.
        var distanciaMeio = Math.sqrt(x*x + y*y) / 2;
        var myBeta = Math.acos(x / 2 / distanciaMeio);
        var myTheta = 90 - myBeta;
        var myHeight = y / 2 / Math.sin(myTheta * Math.PI/180);

        // Y = root(2dis^2)
        var myY = Math.sqrt(myHeight * myHeight + distanciaMeio * distanciaMeio);
        // Now the angle is easy =´p
        // first I see if it is ok..
        var easy = y / myY;
        var plus90 = false;
        if (easy > 1) {
            easy = 1 - (easy - 1);
            plus90 = true;
        }
        else if (easy == 1) {
                var angle = -90;
        }
        var angle = (easy == 1 ? -90 : -Math.asin(easy) * 180 / Math.PI);
        if (plus90) {
                angle = 90 + (90 - angle);
        }


        var clipWidth = y / Math.sin((-1*angle) * Math.PI/180);
        var clipHeight = x / Math.cos((90 + angle) * Math.PI/180);
        var pageWidth = x/ Math.cos((-1*angle) * Math.PI/180);


        var inteiro = pageWidth / Math.sin((-1*angle) * Math.PI/180);
        var ponto = clipHeight * Math.sin((90 + angle) * Math.PI/180);


        var sigma = clipHeight * Math.sin((90 + angle) * Math.PI/180);
        var beta = Math.tan((90 + angle) * Math.PI/180) * y;

        c2d.save();
                c2d.save();
                        c2d.translate(mouseX,mouseY);
                        c2d.rotate(angle * Math.PI / 180);
                        c2d.beginPath();
                                c2d.moveTo(0, 0);
                                c2d.lineTo(0, clipHeight);
                                c2d.lineTo(clipWidth, 0);
                                c2d.lineTo(0 ,0);
                        c2d.closePath();
                        if (images[current+1] != null) {
                            c2d.clip();
                            c2d.drawImage(images[current+1], 0, 0);
                        } else {
                            c2d.fill();
                        }
                c2d.restore();
        c2d.restore();

        c2d.save();
            c2d.beginPath();
                    c2d.moveTo(0,0);
                    c2d.lineTo(0, dim.height);
                    c2d.lineTo(dim.width * 2, dim.height);
                    c2d.lineTo(dim.width * 2, 0);
                    c2d.closePath();
                    c2d.clip();
            c2d.beginPath();
                    c2d.moveTo(mouseX + beta, 0);
                    c2d.lineTo(dim.width * 2,0);
                    c2d.lineTo(dim.width * 2, y + sigma);
                    c2d.lineTo(mouseX + beta,0);
            c2d.closePath();
            if (images[current+2] != null) {
                c2d.clip();
                c2d.drawImage(images[current+2], dim.width,0);
            }
            else {
                c2d.fill();
            }
        c2d.restore();
    }

    function drawClipLeft(c2d, mouseX, mouseY) {
        if (images[current-1] == null)
            return;
        
        var pos = $(canvas).offset();

        var x = (mouseX == 0 ? 1 : Math.abs(mouseX)), y = mouseY;

        // distance = root((x2 - x1)^2 + (y2 - y1)^2) / 2, since I want the middle of the thing.
        var distanciaMeio = Math.sqrt(x*x + y*y) / 2;
        var myBeta = Math.acos(x / 2 / distanciaMeio);
        var myTheta = 90 - myBeta;
        var myHeight = y / 2 / Math.sin(myTheta * Math.PI/180);

        // Y = root(2dis^2)
        var myY = Math.sqrt(myHeight * myHeight + distanciaMeio * distanciaMeio);
        var easy = y / myY;
        var plus90 = false;
        if (easy > 1) {
            easy = 1 - (easy - 1);
            plus90 = true;
        }
        else if (easy == 1) {
                var angle = -90;
        }
        var angle = (easy == 1 ? -90 : -Math.asin(easy) * 180 / Math.PI);
        if (plus90) {
                angle = 90 + (90 - angle);
        }

        var clipWidth = y / Math.sin((-1*angle) * Math.PI/180);
        var clipHeight = x / Math.cos((90 + angle) * Math.PI/180);
        var pageWidth = x/ Math.cos((-1*angle) * Math.PI/180);


        var inteiro = pageWidth / Math.sin((-1*angle) * Math.PI/180);
        var ponto = clipHeight * Math.sin((90 + angle) * Math.PI/180);


        var sigma = clipHeight * Math.sin((90 + angle) * Math.PI/180);
        var beta = Math.tan((90 + angle) * Math.PI/180) * y;

        var preimg =  (dim.width - clipWidth);
        var preimgH =  (dim.height - clipHeight);
        
        c2d.save();
                c2d.save();
                        c2d.translate(mouseX, mouseY);
                        c2d.rotate(-angle * Math.PI / 180);
                        c2d.translate(-dim.width, 0);

                        c2d.beginPath();
                                c2d.moveTo(preimg, 0);
                                c2d.lineTo(dim.width, 0);
                                c2d.lineTo(dim.width, clipHeight);
                                c2d.lineTo(preimg ,0);
                        c2d.closePath();
                        if (images[current-2] == null) {
                            c2d.fill();
                        }
                        else {
                            c2d.clip();
                            c2d.drawImage(images[current-2], 0, 0);
                        }
                c2d.restore();
        c2d.restore();

        c2d.save();
            c2d.beginPath();
                c2d.moveTo(0,0);
                c2d.lineTo(0, dim.height);
                c2d.lineTo(dim.width * 2, dim.height);
                c2d.lineTo(dim.width * 2, 0);
                c2d.closePath();
                c2d.clip();
            c2d.beginPath();
                c2d.moveTo(mouseX - beta, 0);
                c2d.lineTo(0 , 0);
                c2d.lineTo(0, y + sigma);
                c2d.lineTo(mouseX - beta,0);
            c2d.closePath();
            if (images[current-3] != null) {
                c2d.clip();
                c2d.drawImage(images[current-3], 0,0);
            }
            else {
                c2d.fill();
            }
        c2d.restore();
}

    function draw(c2d, okLeft, okRight, mouseX, mouseY) {
        var tPerc = dim.height + (0.3 * dim.height);
        c2d.clearRect(0, 0, dim.width * 2,  dim.height * 2);

        if (images[current-1] != null)
            c2d.drawImage(images[current-1], 0, 0);
        if (images[current] != null)
            c2d.drawImage(images[current], dim.width, 0);

        c2d.save();
        if (mouseX && mouseY && okRight)
                drawClipRight(c2d, mouseX, mouseY);
        else if (mouseX && mouseY && okLeft)
                drawClipLeft(c2d, mouseX, mouseY);
        c2d.restore();
    }

    function start() {
        // Get position
        var pos = $(canvas).position();
        // Set button
        var startBRight = $('<button class="start">').css({ 'left': (pos.left + dim.width * 2- 30)+'px', 'top': (pos.top) + 'px' }).bind("mousedown", function(e) {
                okRight = true;
                if (e.preventDefault)
                        e.preventDefault();

                $("#canvas").trigger("mousemove");
                return false;
        });
        // Set button
        var startBLeft = $('<button class="start">').css({ left: (pos.left)+'px', top: (pos.top) + 'px'}).bind("mousedown", function(e) {
                okLeft = true;
                if (e.preventDefault)
                        e.preventDefault();

                $("#canvas").trigger("mousemove");
                return false;
        });
        // Append them
        $(document.body).append(startBRight).append(startBLeft);

        // Bind the canvas to the move of the mouse
        $("#canvas").bind("mousemove", function(e) {
            draw(c2d, okLeft, okRight, e.clientX - pos.left, e.clientY -  pos.top);
        });
        // And check for the mouseup of the corners.
        $(document.body).bind("mouseup", function(e) {
            var pos = $(canvas).offset();
            
            if (okLeft) {
                if (e.clientX - pos.left > dim.width) {
                    current -= 2;
                    draw(c2d);

                    flipped();
                }
                okLeft = false;
            }
            else if (okRight) {
                if (e.clientX - pos.left < dim.width) {
                    current += 2;
                    draw(c2d);

                    flipped();
                }
                okRight = false;
            }
        });
        // Draw first image.
        draw(c2d);
    }

    function checkStart() {
        var i;
        for (i = 0; i < images.length; i++)  {
            if (images[i] != null && imgReady[i] != true) {
                return;
            }
        }

        start();
    }

    function init(imgs, sz, mcanvas)  {
        images = imgs;
        dim = sz;
        canvas = mcanvas;
        c2d = canvas.getContext('2d');

        c2d.fillStyle = "white";

        var i;
        for (i = 0; i < images.length; i++) {
            if (images[i] != null) {
                $(images[i]).load((function(index) {
                    return function() {
                        imgReady[index] = true;
                        checkStart();
                    }
                })(i));
            }
        }
    }

    function setCurrent(nC) {
        if (nC >= 0 && nC < images.length+1) {
            if (nC % 2 == 1)
                current = nC + 1;
            else
                current = nC;

            draw(c2d);
        }
    }
    function getCurrent() {
        return current;
    }

    function listenPageFlip(add) {
        listen.push(add);
    }

    return {
        'init': init,
        'setCurrent': setCurrent,
        'getCurrent': getCurrent,
        'listenPageFlip': listenPageFlip
    };
})();


