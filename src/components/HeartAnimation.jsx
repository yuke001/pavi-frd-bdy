import React, { useEffect, useRef } from 'react';

const HeartAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const settings = {
      particles: {
        length: 2000, // Reduced for better performance on mobile
        duration: 2,
        velocity: 100,
        effect: -0.75,
        size: 30,
      },
    };

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrameId;
    let time;

    // Point Class
    const Point = function(x, y) {
      this.x = (typeof x !== 'undefined') ? x : 0;
      this.y = (typeof y !== 'undefined') ? y : 0;
    };
    Point.prototype.clone = function() { return new Point(this.x, this.y); };
    Point.prototype.length = function(length) {
      if (typeof length == 'undefined') return Math.sqrt(this.x * this.x + this.y * this.y);
      this.normalize(); this.x *= length; this.y *= length; return this;
    };
    Point.prototype.normalize = function() {
      const length = this.length(); this.x /= length; this.y /= length; return this;
    };

    // Particle Class
    const Particle = function() {
      this.position = new Point();
      this.velocity = new Point();
      this.acceleration = new Point();
      this.age = 0;
    };
    Particle.prototype.initialize = function(x, y, dx, dy) {
      this.position.x = x; this.position.y = y;
      this.velocity.x = dx; this.velocity.y = dy;
      this.acceleration.x = dx * settings.particles.effect;
      this.acceleration.y = dy * settings.particles.effect;
      this.age = 0;
    };
    Particle.prototype.update = function(deltaTime) {
      this.position.x += this.velocity.x * deltaTime;
      this.position.y += this.velocity.y * deltaTime;
      this.velocity.x += this.acceleration.x * deltaTime;
      this.velocity.y += this.acceleration.y * deltaTime;
      this.age += deltaTime;
    };
    Particle.prototype.draw = function(context, image) {
      const ease = (t) => (--t) * t * t + 1;
      const size = image.width * ease(this.age / settings.particles.duration);
      context.globalAlpha = 1 - this.age / settings.particles.duration;
      context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
    };

    // ParticlePool Class
    const ParticlePool = function(length) {
      let firstActive = 0, firstFree = 0;
      const particles = new Array(length);
      for (let i = 0; i < particles.length; i++) particles[i] = new Particle();
      
      this.add = (x, y, dx, dy) => {
        particles[firstFree].initialize(x, y, dx, dy);
        firstFree++;
        if (firstFree === particles.length) firstFree = 0;
        if (firstActive === firstFree) firstActive++;
        if (firstActive === particles.length) firstActive = 0;
      };
      this.update = (deltaTime) => {
        let i;
        if (firstActive < firstFree) {
          for (i = firstActive; i < firstFree; i++) particles[i].update(deltaTime);
        }
        if (firstFree < firstActive) {
          for (i = firstActive; i < particles.length; i++) particles[i].update(deltaTime);
          for (i = 0; i < firstFree; i++) particles[i].update(deltaTime);
        }
        while (particles[firstActive].age >= settings.particles.duration && firstActive !== firstFree) {
          firstActive++;
          if (firstActive === particles.length) firstActive = 0;
        }
      };
      this.draw = (context, image) => {
        let i;
        if (firstActive < firstFree) {
          for (i = firstActive; i < firstFree; i++) particles[i].draw(context, image);
        }
        if (firstFree < firstActive) {
          for (i = firstActive; i < particles.length; i++) particles[i].draw(context, image);
          for (i = 0; i < firstFree; i++) particles[i].draw(context, image);
        }
      };
    };

    const pool = new ParticlePool(settings.particles.length);
    const particleRate = settings.particles.length / settings.particles.duration;

    const pointOnHeart = (t) => {
      return new Point(
        160 * Math.pow(Math.sin(t), 3),
        130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
      );
    };

    // Create small heart image for particles
    const image = (() => {
      const internalCanvas = document.createElement('canvas');
      const internalContext = internalCanvas.getContext('2d');
      internalCanvas.width = settings.particles.size;
      internalCanvas.height = settings.particles.size;
      const to = (t) => {
        const point = pointOnHeart(t);
        point.x = settings.particles.size / 2 + point.x * settings.particles.size / 350;
        point.y = settings.particles.size / 2 - point.y * settings.particles.size / 350;
        return point;
      };
      internalContext.beginPath();
      let t = -Math.PI;
      let point = to(t);
      internalContext.moveTo(point.x, point.y);
      while (t < Math.PI) {
        t += 0.01;
        point = to(t);
        internalContext.lineTo(point.x, point.y);
      }
      internalContext.closePath();
      internalContext.fillStyle = '#ea80b0'; // Soft pink
      internalContext.fill();
      const img = new Image();
      img.src = internalCanvas.toDataURL();
      return img;
    })();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const newTime = new Date().getTime() / 1000;
      const deltaTime = newTime - (time || newTime);
      time = newTime;

      context.clearRect(0, 0, canvas.width, canvas.height);
      const amount = particleRate * deltaTime;
      for (let i = 0; i < amount; i++) {
        const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
        const dir = pos.clone().length(settings.particles.velocity);
        pool.add(canvas.width / 2 + pos.x, canvas.height / 2 - pos.y, dir.x, -dir.y);
      }
      pool.update(deltaTime);
      pool.draw(context, image);
    };

    const onResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    window.addEventListener('resize', onResize);
    onResize();
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        top: 0, 
        left: 0, 
        zIndex: 0,
        pointerEvents: 'none' 
      }} 
    />
  );
};

export default HeartAnimation;