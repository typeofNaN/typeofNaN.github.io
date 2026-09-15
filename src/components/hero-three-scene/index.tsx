'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const vertex = `
  varying vec2 vUv;
  void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
`
const backgroundFragment = `
  uniform float time; uniform vec2 resolution; varying vec2 vUv;
  float line(float v,float w){return smoothstep(w,0.,abs(v));}
  void main(){
    vec2 p=vUv-.5; p.x*=resolution.x/max(resolution.y,1.);
    float wave=line(p.y+.1+sin(p.x*3.+time*.5)*.025,.11);
    float gx=line(fract((p.x+time*.025)*5.)-.5,.025);
    float gy=line(fract((p.y-time*.018)*8.)-.5,.025);
    float grid=(gx+gy)*smoothstep(1.,.05,length(p));
    float sweep=line(fract(vUv.y*7.-time*.12)-.5,.035);
    float core=.1/max(length(p-vec2(.42,.02)),.07);
    vec3 c=vec3(.002,.018,.022);
    c+=vec3(.01,.2,.17)*wave+vec3(.015,.11,.1)*grid;
    c+=vec3(.03,.3,.25)*sweep*.38+vec3(.035,.32,.27)*core;
    c+=vec3(.07,.01,.13)*.07/max(length(p+vec2(.48,-.3)),.1);
    gl_FragColor=vec4(c,1.);
  }
`
const gridVertex = `
  uniform float time; varying float wave;
  void main(){
    vec3 p=position; wave=sin(p.x*.7+time)*.22+cos(p.y*.8+time*.7)*.16;
    p.z+=wave; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
  }
`
const gridFragment = `
  varying float wave;
  void main(){gl_FragColor=vec4(.12,.95,.78,.12+wave*.16);}
`

const canvasTexture = (paint: (context: CanvasRenderingContext2D, size: number) => void) => {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 512
  const context = canvas.getContext('2d')!
  paint(context, canvas.width)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  return texture
}

const HeroThreeScene = () => {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#020b0c')
    scene.fog = new THREE.FogExp2('#020b0c', 0.045)
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100)
    camera.position.set(0, 0.25, 12)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    host.appendChild(renderer.domElement)

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.72, 0.42, 0.48)
    composer.addPass(bloom)

    const bgUniforms = { time: { value: 0 }, resolution: { value: new THREE.Vector2(1, 1) } }
    const background = new THREE.Mesh(
      new THREE.PlaneGeometry(72, 26),
      new THREE.ShaderMaterial({
        uniforms: bgUniforms,
        vertexShader: vertex,
        fragmentShader: backgroundFragment,
        depthWrite: false,
      }),
    )
    background.position.z = -8
    scene.add(background)

    const world = new THREE.Group()
    scene.add(world)
    const logoScene = new THREE.Scene()
    const coreGroup = new THREE.Group()
    coreGroup.position.set(3.8, 0.65, -0.6)
    world.add(coreGroup)

    const haloTexture = canvasTexture((context, size) => {
      const y = size / 8
      const gradient = context.createRadialGradient(size / 2, y, 0, size / 2, y, y)
      gradient.addColorStop(0, 'rgba(120,255,232,.95)')
      gradient.addColorStop(0.2, 'rgba(55,240,205,.4)')
      gradient.addColorStop(1, 'rgba(0,0,0,0)')
      context.fillStyle = gradient
      context.fillRect(size / 2 - y, 0, y * 2, y * 2)
    })
    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: haloTexture,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    halo.scale.set(5.6, 5.6, 1)
    coreGroup.add(halo)

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.5, 2),
      new THREE.MeshBasicMaterial({
        color: '#64ffe2',
        wireframe: true,
        transparent: true,
        opacity: 0.24,
        blending: THREE.AdditiveBlending,
      }),
    )
    const innerCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.8, 1),
      new THREE.MeshBasicMaterial({
        color: '#e5fff9',
        transparent: true,
        opacity: 0.09,
        blending: THREE.AdditiveBlending,
      }),
    )
    coreGroup.add(core, innerCore)

    const rings = new THREE.Group()
    ;[2.05, 2.7, 3.4, 4.1].forEach((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, index ? 0.018 : 0.04, 10, 180),
        new THREE.MeshBasicMaterial({
          color: index % 2 ? '#54ffe0' : '#c3fff5',
          transparent: true,
          opacity: 0.38 - index * 0.055,
          blending: THREE.AdditiveBlending,
        }),
      )
      ring.rotation.set(0.7 + index * 0.32, index * 0.46, index * 0.23)
      rings.add(ring)
    })
    coreGroup.add(rings)

    const logoTexture = canvasTexture((context, size) => {
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.font = '700 220px Arial'
      context.lineWidth = 14
      context.strokeStyle = '#032b27'
      context.strokeText('typeofNaN', size / 2, 256)
      context.fillStyle = '#a5ffed'
      context.fillText('typeofNaN', size / 2, 256)
    })
    const logoGroup = new THREE.Group()
    logoGroup.position.set(3.5, -1.15, 1.2)
    const logoGeometry = new THREE.PlaneGeometry(8.8, 2.2)
    const logoMaterials: THREE.MeshBasicMaterial[] = []
    const logoLayers: THREE.Mesh[] = []
    ;[
      ['#24bfa5', 0.17, -0.055, -0.08],
      ['#7250b8', 0.13, 0.06, -0.1],
      ['#ffffff', 0.96, 0, 0],
    ].forEach(([color, opacity, x, z]) => {
      const material = new THREE.MeshBasicMaterial({
        map: logoTexture,
        color: color as string,
        transparent: true,
        opacity: opacity as number,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const layer = new THREE.Mesh(logoGeometry, material)
      layer.position.set(x as number, 0, z as number)
      logoMaterials.push(material)
      logoLayers.push(layer)
      logoGroup.add(layer)
    })
    logoScene.add(logoGroup)

    const particleCount = 1500
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const cyan = new THREE.Color('#3ff5d3')
    const violet = new THREE.Color('#b286ff')
    for (let i = 0; i < particleCount; i += 1) {
      const n = i * 3
      const radius = 2 + Math.random() * 9
      const angle = Math.random() * Math.PI * 2
      positions[n] = 3.3 + Math.cos(angle) * radius
      positions[n + 1] = Math.sin(angle) * radius * 0.42
      positions[n + 2] = (Math.random() - 0.5) * 10 - 1.5
      const color = cyan.clone().lerp(violet, Math.random() * 0.65)
      colors[n] = color.r
      colors[n + 1] = color.g
      colors[n + 2] = color.b
    }
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    world.add(particles)

    const shardGeometry = new THREE.BoxGeometry(0.025, 0.025, 1)
    const shardMaterial = new THREE.MeshBasicMaterial({
      color: '#63ffe3',
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending,
    })
    const shards = new THREE.InstancedMesh(shardGeometry, shardMaterial, 42)
    const dummy = new THREE.Object3D()
    const shardData = Array.from({ length: 42 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 2.5 + Math.random() * 6,
      speed: 0.06 + Math.random() * 0.18,
      y: (Math.random() - 0.5) * 6,
      length: 0.3 + Math.random() * 1.8,
    }))
    world.add(shards)

    const gridUniforms = { time: { value: 0 } }
    const grid = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 13, 52, 24),
      new THREE.ShaderMaterial({
        uniforms: gridUniforms,
        vertexShader: gridVertex,
        fragmentShader: gridFragment,
        wireframe: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    grid.rotation.x = -Math.PI / 2
    grid.position.set(2, -3.2, -1)
    world.add(grid)

    const pointer = new THREE.Vector2()
    const pointerTarget = new THREE.Vector2()
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    let frame = 0
    let visible = true
    let logoBaseY = -1.15
    let logoBaseScale = 1

    const resize = () => {
      const { width, height } = host.getBoundingClientRect()
      renderer.setSize(width, height)
      composer.setSize(width, height)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
      bgUniforms.resolution.value.set(width, height)
      const mobile = width < 700
      coreGroup.position.set(mobile ? 1.7 : 3.8, mobile ? 1.05 : 0.65, -0.6)
      coreGroup.scale.setScalar(mobile ? 0.76 : 1)
      logoBaseY = mobile ? -0.35 : -1.15
      logoBaseScale = mobile ? 0.58 : 1
      logoGroup.position.set(mobile ? 1.15 : 3.5, logoBaseY, 1.2)
      logoGroup.scale.setScalar(logoBaseScale)
      particleMaterial.size = mobile ? 0.036 : 0.055
      bloom.strength = mobile ? 0.58 : 0.72
    }
    const move = (event: PointerEvent) =>
      pointerTarget.set(
        (event.clientX / innerWidth - 0.5) * 2,
        -(event.clientY / innerHeight - 0.5) * 2,
      )
    const visibility = () => {
      visible = document.visibilityState === 'visible'
    }
    const observer = new ResizeObserver(resize)
    observer.observe(host)
    addEventListener('pointermove', move, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    resize()

    const render = () => {
      frame = requestAnimationFrame(render)
      if (!visible) return
      const elapsed = (performance.now() - start) / 1000
      const time = reducedMotion ? 0.8 : elapsed
      bgUniforms.time.value = time
      gridUniforms.time.value = time
      pointer.lerp(pointerTarget, 0.045)
      camera.position.set(pointer.x * 0.32, 0.25 + pointer.y * 0.2, 12)
      camera.lookAt(0, 0, 0)
      world.rotation.set(-pointer.y * 0.03, pointer.x * 0.055, 0)
      logoGroup.rotation.set(-pointer.y * 0.018, pointer.x * 0.035, 0)
      if (!reducedMotion) {
        const glitchPhase = elapsed % 5.4
        const glitch =
          glitchPhase < 0.24 ? Math.sin(glitchPhase * 150) * (1 - glitchPhase / 0.24) : 0
        const breathe = 1 + Math.sin(elapsed * 1.35) * 0.018
        logoGroup.position.y = logoBaseY + Math.sin(elapsed * 0.9) * 0.07
        logoGroup.scale.setScalar(logoBaseScale * breathe * (1 + Math.abs(glitch) * 0.018))
        logoGroup.rotation.z = Math.sin(elapsed * 0.7) * 0.008 + glitch * 0.012
        logoLayers[0].position.x = -0.055 - glitch * 0.16
        logoLayers[1].position.x = 0.06 + glitch * 0.13
        logoLayers[2].position.x = glitch * 0.025
        logoLayers[0].position.y = glitch * 0.035
        logoLayers[1].position.y = -glitch * 0.025
        core.rotation.set(elapsed * 0.17, elapsed * 0.24, 0)
        innerCore.rotation.y = -elapsed * 0.34
        rings.rotation.set(0, Math.sin(elapsed * 0.33) * 0.16, elapsed * 0.09)
        particles.rotation.z = elapsed * 0.018
        logoMaterials[0].opacity = 0.14 + Math.sin(elapsed * 2.1) * 0.05
        logoMaterials[1].opacity = 0.11 + Math.cos(elapsed * 1.7) * 0.04
        logoMaterials[2].opacity = 0.82 + Math.sin(elapsed * 1.15) * 0.06
      }
      shardData.forEach((data, index) => {
        const angle = data.angle + time * data.speed
        dummy.position.set(
          3.2 + Math.cos(angle) * data.radius,
          data.y + Math.sin(time * 0.7 + index) * 0.35,
          -2 + Math.sin(angle) * data.radius * 0.42,
        )
        dummy.rotation.set(Math.PI / 2, -angle, angle * 0.4)
        dummy.scale.set(1, 1, data.length)
        dummy.updateMatrix()
        shards.setMatrixAt(index, dummy.matrix)
      })
      shards.instanceMatrix.needsUpdate = true
      composer.render()
      renderer.autoClear = false
      renderer.clearDepth()
      renderer.render(logoScene, camera)
      renderer.autoClear = true
    }
    render()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      removeEventListener('pointermove', move)
      document.removeEventListener('visibilitychange', visibility)
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh || object instanceof THREE.Points)) return
        object.geometry?.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => material.dispose())
      })
      logoTexture.dispose()
      haloTexture.dispose()
      composer.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={hostRef} className="absolute inset-0 [&_canvas]:block" aria-hidden="true" />
}

export default HeroThreeScene
