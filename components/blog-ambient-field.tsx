"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle, Vec3 } from "ogl";

const vert = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

// One small, 1x-resolution fragment shader. This uses the same OGL rendering
// model as the product Orb, rather than animating several blurred CSS layers.
const frag = `
  precision highp float;
  uniform float iTime;
  uniform vec3 iResolution;
  varying vec2 vUv;

  float band(float value, float width) { return exp(-abs(value) / width); }

  void main() {
    vec2 uv = vUv - .5;
    uv.x *= iResolution.x / iResolution.y;

    float time = iTime * .18;
    vec2 left = uv + vec2(.52 + sin(time) * .035, .015);
    vec2 right = uv - vec2(.52 + cos(time * .86) * .04, .02);
    float leftOrbit = band(length(vec2(left.x * .58, left.y)) - .48, .024);
    float rightOrbit = band(length(vec2(right.x * .58, right.y)) - .48, .024);
    float centralHalo = exp(-length(vec2(uv.x * .8, uv.y * 1.35)) * 4.8);
    float scan = band(uv.y + sin(uv.x * 2.3 + time * 3.0) * .026, .007);

    vec3 cyan = vec3(.18, .82, .96);
    vec3 ember = vec3(1.0, .18, .025);
    vec3 violet = vec3(.45, .36, 1.0);
    vec3 color = cyan * (leftOrbit + centralHalo * .32) + ember * (rightOrbit + centralHalo * .38);
    color += violet * scan * .35;
    float alpha = clamp(leftOrbit + rightOrbit + centralHalo * .32 + scan * .24, 0.0, .88);
    gl_FragColor = vec4(color, alpha);
  }
`;

function canAnimate() {
  if (typeof window === "undefined") return false;
  const lite = new URLSearchParams(window.location.search).get("lite");
  if (lite === "1") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (!window.matchMedia("(min-width: 768px)").matches) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return !(nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) && !(nav.deviceMemory && nav.deviceMemory <= 4) && !nav.connection?.saveData;
}

export function BlogAmbientField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || !canAnimate()) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false, dpr: 1 });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: { iTime: { value: 0 }, iResolution: { value: new Vec3() } },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    function resize() {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      // The glow is deliberately soft; cap the render target to reduce shader
      // work on wide displays while CSS scales the canvas to its full area.
      const scale = Math.min(1, 1280 / width, 400 / height);
      renderer.setSize(Math.round(width * scale), Math.round(height * scale));
      gl.canvas.style.width = `${width}px`;
      gl.canvas.style.height = `${height}px`;
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
    }

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let frame = 0;
    const render = (time: number) => {
      frame = requestAnimationFrame(render);
      program.uniforms.iTime.value = time * .001;
      renderer.render({ scene: mesh });
    };
    const start = () => { if (!frame) frame = requestAnimationFrame(render); };
    const stop = () => { if (frame) cancelAnimationFrame(frame); frame = 0; };
    const visibilityObserver = new IntersectionObserver(([entry]) => entry.isIntersecting ? start() : stop(), { rootMargin: "100px" });
    visibilityObserver.observe(container);

    return () => {
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      stop();
      container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div ref={ref} className="blog-ambient-field" aria-hidden="true" />;
}
