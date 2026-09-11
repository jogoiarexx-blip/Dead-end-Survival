export class Input {
  constructor(canvas) {
    this.keys = {};
    this.mouse = { x: 640, y: 360, down: false, pressed: false };
    this.move = { x: 0, y: 0 };
    addEventListener('keydown', event => { this.keys[event.key.toLowerCase()] = true; });
    addEventListener('keyup', event => { this.keys[event.key.toLowerCase()] = false; });
    canvas.onpointermove = event => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = (event.clientX - rect.left) * canvas.width / rect.width;
      this.mouse.y = (event.clientY - rect.top) * canvas.height / rect.height;
    };
    canvas.onpointerdown = () => { this.mouse.down = true; this.mouse.pressed = true; };
    addEventListener('pointerup', () => { this.mouse.down = false; });
    this.bindMobile();
  }
  bindMobile() {
    const stick = document.getElementById('stick');
    const knob = stick.querySelector('i');
    let active = false;
    const moveStick = event => {
      if (!active) return;
      const rect = stick.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const length = Math.hypot(dx, dy) || 1;
      const offset = Math.min(35, length);
      this.move = { x: dx / length, y: dy / length };
      knob.style.transform = `translate(${dx / length * offset}px,${dy / length * offset}px)`;
    };
    stick.onpointerdown = event => { active = true; stick.setPointerCapture(event.pointerId); moveStick(event); };
    stick.onpointermove = moveStick;
    stick.onpointerup = () => { active = false; this.move = { x: 0, y: 0 }; knob.style.transform = ''; };
    document.getElementById('mobileAttack').onpointerdown = () => { this.mouse.down = true; this.mouse.pressed = true; };
    document.getElementById('mobileAttack').onpointerup = () => { this.mouse.down = false; };
    document.getElementById('mobileInteract').onpointerdown = () => { this.keys.e = true; };
  }
  axis() {
    let x = (this.keys.d || this.keys.arrowright ? 1 : 0) - (this.keys.a || this.keys.arrowleft ? 1 : 0) + this.move.x;
    let y = (this.keys.s || this.keys.arrowdown ? 1 : 0) - (this.keys.w || this.keys.arrowup ? 1 : 0) + this.move.y;
    const length = Math.hypot(x, y);
    return length > 1 ? { x: x / length, y: y / length } : { x, y };
  }
  consume(key) { const value = this.keys[key]; this.keys[key] = false; return value; }
  endFrame() { this.mouse.pressed = false; }
}
