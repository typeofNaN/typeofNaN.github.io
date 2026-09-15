"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[655],{1655:(e,t,r)=>{r.r(t),r.d(t,{default:()=>M});var i=r(4332),s=r(4608),a=r(1627),o=r(9564);let l={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class n{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}let h=new a.qUd(-1,1,1,-1,0,1);class u extends a.LoY{constructor(){super(),this.setAttribute("position",new a.qtW([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new a.qtW([0,2,0,0,2,0],2))}}let d=new u;class f{constructor(e){this._mesh=new a.eaF(d,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,h)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class c extends n{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof a.BKk?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=a.LlO.clone(e.uniforms),this.material=new a.BKk({name:void 0!==e.name?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new f(this.material)}render(e,t,r){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=r.texture),this._fsQuad.material=this.material,this.renderToScreen?e.setRenderTarget(null):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil)),this._fsQuad.render(e)}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class m extends n{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,r){let i,s,a=e.getContext(),o=e.state;o.buffers.color.setMask(!1),o.buffers.depth.setMask(!1),o.buffers.color.setLocked(!0),o.buffers.depth.setLocked(!0),this.inverse?(i=0,s=1):(i=1,s=0),o.buffers.stencil.setTest(!0),o.buffers.stencil.setOp(a.REPLACE,a.REPLACE,a.REPLACE),o.buffers.stencil.setFunc(a.ALWAYS,i,0xffffffff),o.buffers.stencil.setClear(s),o.buffers.stencil.setLocked(!0),e.setRenderTarget(r),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),o.buffers.color.setLocked(!1),o.buffers.depth.setLocked(!1),o.buffers.color.setMask(!0),o.buffers.depth.setMask(!0),o.buffers.stencil.setLocked(!1),o.buffers.stencil.setFunc(a.EQUAL,1,0xffffffff),o.buffers.stencil.setOp(a.KEEP,a.KEEP,a.KEEP),o.buffers.stencil.setLocked(!0)}}class p extends n{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class v{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),void 0===t){let r=e.getSize(new a.I9Y);this._width=r.width,this._height=r.height,(t=new a.nWS(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:a.ix0})).texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new c(l),this.copyPass.material.blending=a.XIg,this.timer=new a.M4G}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);-1!==t&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),void 0===e&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),r=!1;for(let t=0,i=this.passes.length;t<i;t++){let i=this.passes[t];if(!1!==i.enabled){if(i.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),i.render(this.renderer,this.writeBuffer,this.readBuffer,e,r),i.needsSwap){if(r){let t=this.renderer.getContext(),r=this.renderer.state.buffers.stencil;r.setFunc(t.NOTEQUAL,1,0xffffffff),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),r.setFunc(t.EQUAL,1,0xffffffff)}this.swapBuffers()}void 0!==m&&(i instanceof m?r=!0:i instanceof p&&(r=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(void 0===e){let t=this.renderer.getSize(new a.I9Y);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,(e=this.renderTarget1.clone()).setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let r=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(r,i),this.renderTarget2.setSize(r,i);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(r,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class g extends n{constructor(e,t,r=null,i=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=r,this.clearColor=i,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new a.Q1f}render(e,t,r){let i,s,a=e.autoClear;e.autoClear=!1,null!==this.overrideMaterial&&(s=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),null!==this.clearColor&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),null!==this.clearAlpha&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),!0==this.clearDepth&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:r),!0===this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),null!==this.clearColor&&e.setClearColor(this._oldClearColor),null!==this.clearAlpha&&e.setClearAlpha(i),null!==this.overrideMaterial&&(this.scene.overrideMaterial=s),e.autoClear=a}}let x={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new a.Q1f(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class b extends n{constructor(e,t=1,r,i){super(),this.strength=t,this.radius=r,this.threshold=i,this.resolution=void 0!==e?new a.I9Y(e.x,e.y):new a.I9Y(256,256),this.clearColor=new a.Q1f(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new a.nWS(s,o,{type:a.ix0,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new a.nWS(s,o,{type:a.ix0,depthBuffer:!1});t.texture.name="UnrealBloomPass.h"+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let r=new a.nWS(s,o,{type:a.ix0,depthBuffer:!1});r.texture.name="UnrealBloomPass.v"+e,r.texture.generateMipmaps=!1,this.renderTargetsVertical.push(r),s=Math.round(s/2),o=Math.round(o/2)}this.highPassUniforms=a.LlO.clone(x.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new a.BKk({uniforms:this.highPassUniforms,vertexShader:x.vertexShader,fragmentShader:x.fragmentShader}),this.separableBlurMaterials=[];let n=[6,10,14,18,22];s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(n[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new a.I9Y(1/s,1/o),s=Math.round(s/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1,this.compositeMaterial.uniforms.bloomFactors.value=[1,.8,.6,.4,.2],this.bloomTintColors=[new a.Pq0(1,1,1),new a.Pq0(1,1,1),new a.Pq0(1,1,1),new a.Pq0(1,1,1),new a.Pq0(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=a.LlO.clone(l.uniforms),this.blendMaterial=new a.BKk({uniforms:this.copyUniforms,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader,premultipliedAlpha:!0,blending:a.EZo,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new a.Q1f,this._oldClearAlpha=1,this._basic=new a.V9B,this._fsQuad=new f(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let r=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(r,i);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(r,i),this.renderTargetsVertical[e].setSize(r,i),this.separableBlurMaterials[e].uniforms.invSize.value=new a.I9Y(1/r,1/i),r=Math.round(r/2),i=Math.round(i/2)}render(e,t,r,i,s){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let t=0;t<this.nMips;t++)this._fsQuad.material=this.separableBlurMaterials[t],this.separableBlurMaterials[t].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[t].uniforms.direction.value=b.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[t]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[t].uniforms.colorTexture.value=this.renderTargetsHorizontal[t].texture,this.separableBlurMaterials[t].uniforms.direction.value=b.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[t]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[t];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?e.setRenderTarget(null):e.setRenderTarget(r),this._fsQuad.render(e),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){let t=[],r=e/3;for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(r*r))/r);let i=[],s=[];for(let r=1;r<e;r+=2){let a=t[r],o=r+1<e?t[r+1]:0,l=a+o;i.push((r*a+(r+1)*o)/l),s.push(l)}return new a.BKk({defines:{KERNEL_PAIRS:i.length},uniforms:{colorTexture:{value:null},invSize:{value:new a.I9Y(.5,.5)},direction:{value:new a.I9Y(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:i},gaussianWeights:{value:s}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new a.BKk({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}b.BlurDirectionX=new a.I9Y(1,0),b.BlurDirectionY=new a.I9Y(0,1);let w=e=>{let t=document.createElement("canvas");t.width=2048,t.height=512,e(t.getContext("2d"),t.width);let r=new a.GOR(t);return r.colorSpace=a.er$,r.minFilter=a.k6q,r},M=()=>{let e=(0,s.useRef)(null);return(0,s.useEffect)(()=>{let t=e.current;if(!t)return;let r=new a.Z58;r.background=new a.Q1f("#020b0c"),r.fog=new a.cRK("#020b0c",.045);let i=new a.ubm(46,1,.1,100);i.position.set(0,.25,12);let s=new o.JeP({antialias:!0,powerPreference:"high-performance"});s.setPixelRatio(Math.min(devicePixelRatio,1.6)),s.outputColorSpace=a.er$,s.toneMapping=a.FV,s.toneMappingExposure=1.15,t.appendChild(s.domElement);let l=new v(s);l.addPass(new g(r,i));let n=new b(new a.I9Y(1,1),.72,.42,.48);l.addPass(n);let h={time:{value:0},resolution:{value:new a.I9Y(1,1)}},u=new a.eaF(new a.bdM(72,26),new a.BKk({uniforms:h,vertexShader:"\n  varying vec2 vUv;\n  void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }\n",fragmentShader:"\n  uniform float time; uniform vec2 resolution; varying vec2 vUv;\n  float line(float v,float w){return smoothstep(w,0.,abs(v));}\n  void main(){\n    vec2 p=vUv-.5; p.x*=resolution.x/max(resolution.y,1.);\n    float wave=line(p.y+.1+sin(p.x*3.+time*.5)*.025,.11);\n    float gx=line(fract((p.x+time*.025)*5.)-.5,.025);\n    float gy=line(fract((p.y-time*.018)*8.)-.5,.025);\n    float grid=(gx+gy)*smoothstep(1.,.05,length(p));\n    float sweep=line(fract(vUv.y*7.-time*.12)-.5,.035);\n    float core=.1/max(length(p-vec2(.42,.02)),.07);\n    vec3 c=vec3(.002,.018,.022);\n    c+=vec3(.01,.2,.17)*wave+vec3(.015,.11,.1)*grid;\n    c+=vec3(.03,.3,.25)*sweep*.38+vec3(.035,.32,.27)*core;\n    c+=vec3(.07,.01,.13)*.07/max(length(p+vec2(.48,-.3)),.1);\n    gl_FragColor=vec4(c,1.);\n  }\n",depthWrite:!1}));u.position.z=-8,r.add(u);let d=new a.YJl;r.add(d);let f=new a.Z58,c=new a.YJl;c.position.set(3.8,.65,-.6),d.add(c);let m=w((e,t)=>{let r=t/8,i=e.createRadialGradient(t/2,r,0,t/2,r,r);i.addColorStop(0,"rgba(120,255,232,.95)"),i.addColorStop(.2,"rgba(55,240,205,.4)"),i.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=i,e.fillRect(t/2-r,0,2*r,2*r)}),p=new a.kxk(new a.RoJ({map:m,transparent:!0,opacity:.3,blending:a.EZo,depthWrite:!1}));p.scale.set(5.6,5.6,1),c.add(p);let x=new a.eaF(new a.WBB(1.5,2),new a.V9B({color:"#64ffe2",wireframe:!0,transparent:!0,opacity:.24,blending:a.EZo})),M=new a.eaF(new a.WBB(.8,1),new a.V9B({color:"#e5fff9",transparent:!0,opacity:.09,blending:a.EZo}));c.add(x,M);let T=new a.YJl;[2.05,2.7,3.4,4.1].forEach((e,t)=>{let r=new a.eaF(new a.O3Y(e,t?.018:.04,10,180),new a.V9B({color:t%2?"#54ffe0":"#c3fff5",transparent:!0,opacity:.38-.055*t,blending:a.EZo}));r.rotation.set(.7+.32*t,.46*t,.23*t),T.add(r)}),c.add(T);let S=w((e,t)=>{e.textAlign="center",e.textBaseline="middle",e.font="700 220px Arial",e.lineWidth=14,e.strokeStyle="#032b27",e.strokeText("typeofNaN",t/2,256),e.fillStyle="#a5ffed",e.fillText("typeofNaN",t/2,256)}),C=new a.YJl;C.position.set(3.5,-1.15,1.2);let _=new a.bdM(8.8,2.2),y=[],B=[];[["#24bfa5",.17,-.055,-.08],["#7250b8",.13,.06,-.1],["#ffffff",.96,0,0]].forEach(e=>{let[t,r,i,s]=e,o=new a.V9B({map:S,color:t,transparent:!0,opacity:r,blending:a.EZo,depthWrite:!1}),l=new a.eaF(_,o);l.position.set(i,0,s),y.push(o),B.push(l),C.add(l)}),f.add(C);let P=new Float32Array(4500),R=new Float32Array(4500),E=new a.Q1f("#3ff5d3"),U=new a.Q1f("#b286ff");for(let e=0;e<1500;e+=1){let t=3*e,r=2+9*Math.random(),i=Math.random()*Math.PI*2;P[t]=3.3+Math.cos(i)*r,P[t+1]=Math.sin(i)*r*.42,P[t+2]=(Math.random()-.5)*10-1.5;let s=E.clone().lerp(U,.65*Math.random());R[t]=s.r,R[t+1]=s.g,R[t+2]=s.b}let A=new a.LoY;A.setAttribute("position",new a.THS(P,3)),A.setAttribute("color",new a.THS(R,3));let F=new a.BH$({size:.055,vertexColors:!0,transparent:!0,opacity:.85,blending:a.EZo,depthWrite:!1}),D=new a.ONl(A,F);d.add(D);let z=new a.iNn(.025,.025,1),k=new a.V9B({color:"#63ffe3",transparent:!0,opacity:.52,blending:a.EZo}),L=new a.ZLX(z,k,42),I=new a.B69,Q=Array.from({length:42},()=>({angle:Math.random()*Math.PI*2,radius:2.5+6*Math.random(),speed:.06+.18*Math.random(),y:(Math.random()-.5)*6,length:.3+1.8*Math.random()}));d.add(L);let W={time:{value:0}},V=new a.eaF(new a.bdM(30,13,52,24),new a.BKk({uniforms:W,vertexShader:"\n  uniform float time; varying float wave;\n  void main(){\n    vec3 p=position; wave=sin(p.x*.7+time)*.22+cos(p.y*.8+time*.7)*.16;\n    p.z+=wave; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);\n  }\n",fragmentShader:"\n  varying float wave;\n  void main(){gl_FragColor=vec4(.12,.95,.78,.12+wave*.16);}\n",wireframe:!0,transparent:!0,blending:a.EZo,depthWrite:!1}));V.rotation.x=-Math.PI/2,V.position.set(2,-3.2,-1),d.add(V);let Y=new a.I9Y,O=new a.I9Y,N=matchMedia("(prefers-reduced-motion: reduce)").matches,H=performance.now(),K=0,Z=!0,q=-1.15,j=1,J=()=>{let{width:e,height:r}=t.getBoundingClientRect();s.setSize(e,r),l.setSize(e,r),i.aspect=e/Math.max(r,1),i.updateProjectionMatrix(),h.resolution.value.set(e,r);let a=e<700;c.position.set(a?1.7:3.8,a?1.05:.65,-.6),c.scale.setScalar(a?.76:1),q=a?-.35:-1.15,j=a?.58:1,C.position.set(a?1.15:3.5,q,1.2),C.scale.setScalar(j),F.size=a?.036:.055,n.strength=a?.58:.72},X=e=>O.set((e.clientX/innerWidth-.5)*2,-(2*(e.clientY/innerHeight-.5))),G=()=>{Z="visible"===document.visibilityState},$=new ResizeObserver(J);$.observe(t),addEventListener("pointermove",X,{passive:!0}),document.addEventListener("visibilitychange",G),J();let ee=()=>{if(K=requestAnimationFrame(ee),!Z)return;let e=(performance.now()-H)/1e3,t=N?.8:e;if(h.time.value=t,W.time.value=t,Y.lerp(O,.045),i.position.set(.32*Y.x,.25+.2*Y.y,12),i.lookAt(0,0,0),d.rotation.set(-(.03*Y.y),.055*Y.x,0),C.rotation.set(-(.018*Y.y),.035*Y.x,0),!N){let t=e%5.4,r=t<.24?Math.sin(150*t)*(1-t/.24):0,i=1+.018*Math.sin(1.35*e);C.position.y=q+.07*Math.sin(.9*e),C.scale.setScalar(j*i*(1+.018*Math.abs(r))),C.rotation.z=.008*Math.sin(.7*e)+.012*r,B[0].position.x=-.055-.16*r,B[1].position.x=.06+.13*r,B[2].position.x=.025*r,B[0].position.y=.035*r,B[1].position.y=-(.025*r),x.rotation.set(.17*e,.24*e,0),M.rotation.y=-(.34*e),T.rotation.set(0,.16*Math.sin(.33*e),.09*e),D.rotation.z=.018*e,y[0].opacity=.14+.05*Math.sin(2.1*e),y[1].opacity=.11+.04*Math.cos(1.7*e),y[2].opacity=.82+.06*Math.sin(1.15*e)}Q.forEach((e,r)=>{let i=e.angle+t*e.speed;I.position.set(3.2+Math.cos(i)*e.radius,e.y+.35*Math.sin(.7*t+r),-2+Math.sin(i)*e.radius*.42),I.rotation.set(Math.PI/2,-i,.4*i),I.scale.set(1,1,e.length),I.updateMatrix(),L.setMatrixAt(r,I.matrix)}),L.instanceMatrix.needsUpdate=!0,l.render(),s.autoClear=!1,s.clearDepth(),s.render(f,i),s.autoClear=!0};return ee(),()=>{cancelAnimationFrame(K),$.disconnect(),removeEventListener("pointermove",X),document.removeEventListener("visibilitychange",G),r.traverse(e=>{var t;(e instanceof a.eaF||e instanceof a.ONl)&&(null==(t=e.geometry)||t.dispose(),(Array.isArray(e.material)?e.material:[e.material]).forEach(e=>e.dispose()))}),S.dispose(),m.dispose(),l.dispose(),s.dispose(),s.domElement.remove()}},[]),(0,i.jsx)("div",{ref:e,className:"absolute inset-0 [&_canvas]:block","aria-hidden":"true"})}}}]);