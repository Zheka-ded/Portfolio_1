var time = 0;
function Gravity(id){
  var that = this;
  var element = document.getElementById(id);
  var text = element.textContent;
  var arr = text.split('');

  this.animate = true;
  this.floating = true;
  this.resetTime = 0;

  this.positionType = getComputedStyle(element).position;

  this.lerp = function (e,t,i){
    return(1-i)*e+i*t;
  }
  this.checkBound = function(){
    if (element.hasAttribute("data-bound")) {
      return element.dataset.bound === "true";
    }
  }

  this.useBound = this.checkBound();
  this.colors = [
      '#ffffff','#000000','#686868',
      '#3c546c','#3f51b5','#d23e30',
      '#f44336','#e91e63','#9c27b0',
      '#673ab7','#3f51b5','#2196f3',
      '#03a9f4','#00bcd4','#009688',
      '#4caf50','#8bc34a','#cddc39',
      '#ffeb3b','#ffc107','#ff9800',
      '#ff5722','#795548','#9e9e9e',
      '#607d8b','#0de5c2'
  ];

  this.randomColor = function(){
    var randNum = Math.floor(Math.random() * this.colors.length);
    return this.colors[randNum];
  }

  this.bounds = this.useBound ? {
    min : {
      x : element.offsetLeft,
      y : element.offsetTop 
    },
    max : {
      x : element.offsetLeft + element.offsetWidth,
      y : element.offsetTop + element.offsetHeight
    }
  } : {
    min : {
      x : 0,
      y : 0
    },
    max : {
      x : window.innerWidth,
      y : window.innerHeight
    }
  }

  this.pointInCircle = function(point, target, radius) {
    var distsq = (point.x - target.x) * (point.x - target.x) + (point.y - target.y) * (point.y - target.y);
    return [distsq <= radius * radius, distsq];
  }

  function createSpan(text,pos){
    var span = document.createElement('span');
        span.innerHTML = text;
        span.style.position = "relative";
        span.style.display = "inline-block";
        span.style.minWidth = "10px";
        span.style.color = that.randomColor();
        span._own = {
          pos : {
            x : 0,
            y : 0
          },
          vel : {
            x : -0.5 + Math.random(),
            y : -0.5 + Math.random()
          },
          speed : {
            x : 1,
            y : 1
          },
          dir : {
            x : 1,
            y : 1
          }
        }
    return span;
  }
  this.textSpans = [];

  element.innerHTML = '';

  arr.forEach(function(t,i){
    var el = createSpan(t,{
      x : 0,
      y : 0
    });
    element.appendChild(el);
    that.textSpans.push(el);
  });

  this.getDim = function(){

    this.textSpans.forEach(function(t,i){
      var offset = {
        x : 0,
        y : 0
      }
      if(that.positionType === 'relative' || that.positionType === 'absolute'){
        offset.x = element.offsetLeft
        offset.y = element.offsetTop
      }
      t._own.real = {
        x : offset.x +t.offsetLeft,
        y : offset.y +t.offsetTop
      },
      t._own.size = {
        x : t.offsetWidth,
        y : t.offsetHeight
      }

    });

  };

  this.getDim();

  this.floatText = function(){
    this.textSpans.forEach(function(t,i){
      
      if(t._own.pos.x + t._own.real.x < that.bounds.min.x || t._own.pos.x + t._own.real.x + t._own.size.x > that.bounds.max.x){
        t._own.dir.x *= -1;
      }
      if(t._own.pos.y + t._own.real.y < that.bounds.min.y || t._own.pos.y + t._own.real.y + t._own.size.y > that.bounds.max.y){
        t._own.dir.y *= -1;
      }
      t._own.pos.x += (t._own.vel.x * t._own.speed.x) * t._own.dir.x;
      t._own.pos.y += (t._own.vel.y * t._own.speed.y) * t._own.dir.y;
      t.style.transform = 'translateX('+ t._own.pos.x +'px) translateY('+ t._own.pos.y +'px)';
    
    });
  }
  this.update = function(){
    if(this.animate){
      if(this.floating){
        this.floatText();
      }else{
        this.floatBackwards();
      }
    }
  }

  this.floatBackwards = function(){
    this.textSpans.forEach(function(t,i){
      
      var x = that.lerp(t._own.pos.x,0, that.resetTime / 10);
      var y = that.lerp(t._own.pos.y,0, that.resetTime / 10);
     
      t.style.transform = 'translateX('+ x +'px) translateY('+ y +'px)';
    
    });

    if(this.resetTime===10){
      this.animate = false;
      this.resetTime = 0;
    }
    this.resetTime++;
  }
  this.reset = function(){
    this.floating = false;
  }
  this.restart = function(){
    this.textSpans.forEach(function(t,i){
      t._own.pos.x = 0;
      t._own.pos.y = 0;
    });
    this.floating = true;
    this.animate = true;
  }
  
  window.onresize = function(){
    that.getDim();
  }
  
}

var paragraph = new Gravity('text');
var gravity = new Gravity('reset');

var button = document.getElementById('reset');
button.addEventListener('click',function(){
  if(gravity.animate){
    gravity.reset();
    paragraph.reset();
  }else{
    gravity.restart();
    paragraph.restart();
  }
});

var render = function (time) { 
  requestAnimationFrame( render );

  animation(time);
};

//__________ animation

function animation(time){
  paragraph.update();
  gravity.update();
};

//__________

render(time);

/* -----------------------------------------------
/* How to use? : Check the GitHub README
/* ----------------------------------------------- */

/* To load a config file (particles.json) you need to host this demo (MAMP/WAMP/local)... */
/*
particlesJS.load('particles-js', 'particles.json', function() {
  console.log('particles.js loaded - callback');
});
*/

/* Otherwise just put the config content (json): */

particlesJS('particles-js',
  
  {
    "particles": {
      "number": {
        "value": 120,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#663399"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 5,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 3,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true,
    "config_demo": {
      "hide_card": false,
      "background_color": "#b61924",
      "background_image": "",
      "background_position": "50% 50%",
      "background_repeat": "no-repeat",
      "background_size": "cover"
    }
  }

);





