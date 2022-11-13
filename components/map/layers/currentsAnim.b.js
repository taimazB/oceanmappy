import axios from "axios"


export function resetCurrents() {
    cancelAnimationFrame(this.reqAnimID)
    try {
        this.cnvCurrents.remove()
        if (Object.keys(this.map.getStyle().sources).includes('currents')) {
            this.map.removeLayer('currents')
            this.map.removeSource('currents')
        }
    } catch (error) {
        console.log(error);
    }
}


export function createCanvas() {
    // --- Creates a canvas to be used by MapBox (webgl)
    const canvas = document.createElement('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    return canvas
}

export function loadImageCurrents() {
    const data = {
        webgl: true,
        field: this.$store.state.map.selected.field,
        model: this.$store.state.map.selected.modelDir,
        date: this.$store.state.layers.interDate,
        time: this.$store.state.layers.interTime,
        bnds: this.$store.state.map.bnds,
        imgBnds: this.$store.state.map.selected.imgBnds,
        level: this.$store.state.map.selected.levels.hasLevels
            ? this.$store.state.map.selected.levels.values[this.$store.state.map.selected.levels.iLevel]
            : null,
        hasHighRes: this.$store.state.map.selected.hasHighRes,
        highRes: false,
        minMax: {
            min: this.$store.state.map.selected.minOrg,
            minOrg: this.$store.state.map.selected.minOrg,
            max: this.$store.state.map.selected.maxOrg,
            maxOrg: this.$store.state.map.selected.maxOrg,
        },
    }

    downloadImageCurrents(data).then((imgSrc) => {
        this.imgFilledGlobal.img = new Image()
        this.imgFilledGlobal.img.onload = () => {
            this.drawCurrents(this.map)
            this.$store.commit('map/setShowButtons', 'true')
        }

        this.imgFilledGlobal.width = imgSrc.data.imgWidth
        this.imgFilledGlobal.height = imgSrc.data.imgHeight
        this.imgFilledGlobal.img.src = imgSrc.data.imgData
    })
}

export function initWebGL() {

    // (function (global, factory) {
    //     // (function (factory) {

    //     typeof exports === 'object' && typeof module !== 'undefined'
    //         ? (module.exports = factory()) :
    //         //   :  typeof define === 'function' && define.amd
    //         //  ? define(factory) :
    //         // (global.WindGL = factory())
    //         (global.WindGL = factory())
    // })(this, function () {
    // })(function () {
    function createShader(gl, type, source) {
        const shader = gl.createShader(type)
        gl.shaderSource(shader, source)

        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader))
        }

        return shader
    }

    function createProgram(gl, vertexSource, fragmentSource) {
        const program = gl.createProgram()

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource)
        const fragmentShader = createShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragmentSource
        )

        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)

        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program))
        }

        const wrapper = { program } // --- instead of {program: program}

        const numAttributes = gl.getProgramParameter(
            program,
            gl.ACTIVE_ATTRIBUTES
        )
        for (let i = 0; i < numAttributes; i++) {
            const attribute = gl.getActiveAttrib(program, i)
            wrapper[attribute.name] = gl.getAttribLocation(
                program,
                attribute.name
            )
        }
        const numUniforms = gl.getProgramParameter(
            program,
            gl.ACTIVE_UNIFORMS
        )
        for (let i$1 = 0; i$1 < numUniforms; i$1++) {
            const uniform = gl.getActiveUniform(program, i$1)
            wrapper[uniform.name] = gl.getUniformLocation(program, uniform.name)
        }

        return wrapper
    }

    // let texture
    function createTexture(gl, filter, data, width, height) {
        const texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)

        if (data instanceof Uint8Array) {
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                width,
                height,
                0,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                data
            )
        } else {
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                data
            )
        }

        gl.bindTexture(gl.TEXTURE_2D, null)
        return texture
    }

    function bindTexture(gl, texture, unit) {
        gl.activeTexture(gl.TEXTURE0 + unit)
        gl.bindTexture(gl.TEXTURE_2D, texture)
    }

    function createBuffer(gl, data) {
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
        return buffer
    }

    function bindAttribute(gl, buffer, attribute, numComponents) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.enableVertexAttribArray(attribute)
        gl.vertexAttribPointer(
            attribute,
            numComponents,
            gl.FLOAT,
            false,
            0,
            0
        )
    }

    function bindFramebuffer(gl, framebuffer, texture) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
        if (texture) {
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.COLOR_ATTACHMENT0,
                gl.TEXTURE_2D,
                texture,
                0
            )
        }
    }

    const drawVert = `
    precision mediump float;\n\n
    
    attribute float a_index;\n\n
    
    uniform sampler2D u_particles;\n
    uniform float u_particles_res;\n\n
    
    varying vec2 v_particle_pos;\n\n
    
    void main() {\n
        vec4 color = texture2D(u_particles, vec2(fract(a_index / u_particles_res),floor(a_index / u_particles_res) / u_particles_res));\n\n
        
        // decode current particle position from the pixel's RGBA value\n
        v_particle_pos = vec2( color.r / 255.0 + color.b, color.g / 255.0 + color.a);\n\n
        
        gl_PointSize = 1.0;\n
        gl_Position = vec4(2.0 * v_particle_pos.x - 1.0, 1.0 - 2.0 * v_particle_pos.y, 0, 1);\n
    }\n
    `

    const drawFrag = `
    precision mediump float;\n\n
    
    uniform sampler2D u_wind;\n
    uniform vec2 u_wind_min;\n
    uniform vec2 u_wind_max;\n
    uniform sampler2D u_color_ramp;\n\n
    
    varying vec2 v_particle_pos;\n\n
    
    void main() {\n
        vec2 velocity = mix(u_wind_min, u_wind_max, texture2D(u_wind, v_particle_pos).rg);\n
        float speed_t = length(velocity) / length(u_wind_max);\n\n
        
        // color ramp is encoded in a 16x16 texture\n
        vec2 ramp_pos = vec2( fract(16.0 * speed_t), floor(16.0 * speed_t) / 16.0);\n\n
  
        gl_FragColor = texture2D(u_color_ramp, ramp_pos);\n
    }\n
    `

    const quadVert = `
    precision mediump float;\n\n
    
    attribute vec2 a_pos;\n\n
    
    varying vec2 v_tex_pos;\n\n
    
    void main() {\n
        v_tex_pos = a_pos;\n
        gl_Position = vec4(1.0 - 2.0 * a_pos, 0, 1);\n
    }\n
    `

    const screenFrag = `
    precision mediump float;\n\n
    
    uniform sampler2D u_screen;\n
    uniform float u_opacity;\n\n
    
    varying vec2 v_tex_pos;\n\n
    
    void main() {\n
        vec4 color = texture2D(u_screen, 1.0 - v_tex_pos);\n
        // a hack to guarantee opacity fade out even with a value close to 1.0\n
        gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);\n
    }\n
    `

    const updateFrag = `
    precision highp float;\n\n
    
    uniform sampler2D u_particles;\n
    uniform sampler2D u_wind;\n
    uniform vec2 u_wind_res;\n
    uniform vec2 u_wind_min;\n
    uniform vec2 u_wind_max;\n
    uniform float u_rand_seed;\n
    uniform float u_speed_factor;\n
    uniform float u_drop_rate;\n
    uniform float u_drop_rate_bump;\n\n
    
    varying vec2 v_tex_pos;\n\n
    
    // pseudo-random generator\n
    const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);\n
    float rand(const vec2 co) {\n
        float t = dot(rand_constants.xy, co);\n
        return fract(sin(t) * (rand_constants.z + t));\n
    }\n\n
    
    // wind speed lookup; use manual bilinear filtering based on 4 adjacent pixels for smooth interpolation\n
    vec2 lookup_wind(const vec2 uv) {\n
        // return texture2D(u_wind, uv).rg; // lower-res hardware filtering\n
        vec2 px = 1.0 / u_wind_res;\n
        vec2 vc = (floor(uv * u_wind_res)) * px;\n
        vec2 f = fract(uv * u_wind_res);\n
        vec2 tl = texture2D(u_wind, vc).rg;\n
        vec2 tr = texture2D(u_wind, vc + vec2(px.x, 0)).rg;\n
        vec2 bl = texture2D(u_wind, vc + vec2(0, px.y)).rg;\n
        vec2 br = texture2D(u_wind, vc + px).rg;\n
        return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);\n
    }\n\n
    
    void main() {\n
        vec4 color = texture2D(u_particles, v_tex_pos);\n
        vec2 pos = vec2( color.r / 255.0 + color.b, color.g / 255.0 + color.a); // decode particle position from pixel RGBA\n\n
        
        vec2 velocity = mix(u_wind_min, u_wind_max, lookup_wind(pos));\n
        float speed_t = length(velocity) / length(u_wind_max);\n\n
        
        // take EPSG:4236 distortion into account for calculating where the particle moved\n
        float distortion = 1.\n;
        // cos(radians(pos.y * 180.0 - 90.0));\n
        vec2 offset = vec2(velocity.x / distortion, -velocity.y) * 0.0001 * u_speed_factor;\n\n
        
        // update particle position, wrapping around the date line\n
        pos = fract(1.0 + pos + offset);\n\n
        
        // a random seed to use for the particle drop\n
        vec2 seed = (pos + v_tex_pos) * u_rand_seed;\n\n
        
        // drop rate is a chance a particle will restart at random position, to avoid degeneration\n
        float drop_rate = u_drop_rate + speed_t * u_drop_rate_bump;\n
        float drop = step(1.0 - drop_rate, rand(seed));\n\n
        
        vec2 random_pos = vec2( rand(seed + 1.3), rand(seed + 2.1));\n
        pos = mix(pos, random_pos, drop);\n\n
        
        // encode the new particle position back into RGBA\n
        gl_FragColor = vec4( fract(pos * 255.0), floor(pos * 255.0) / 255.0);\n
    }\n
    `

    // let defaultRampColors = {
    //     0.0: '#3288bd',
    //     0.1: '#66c2a5',
    //     0.2: '#abdda4',
    //     0.3: '#e6f598',
    //     0.4: '#fee08b',
    //     0.5: '#fdae61',
    //     0.6: '#f46d43',
    //     1.0: '#d53e4f'
    // };

    const defaultRampColors = {
        // 0.0: "rgba(0,0,0,0)",
        0.0: '#000000',
        0.005: '#0099ff',
        0.05: '#33cccc',
        0.1: '#00ff99',
        0.15: '#33cc33',
        0.2: '#99ff33',
        0.25: '#ffff00',
        0.3: '#ff9933',
        0.35: '#ff5050',
        0.4: '#ff3399',
        0.45: '#ff00ff',
        0.5: '#9966ff',
    }

    const WindGL = function WindGL(gl) {
        this.gl = gl

        // this.fadeOpacity = 0.996; // how fast the particle trails fade on each frame
        // this.fadeOpacity = 0.925; // how fast the particle trails fade on each frame
        // this.speedFactor = 2.95; // how fast the particles move
        this.speedFactor = 5 // how fast the particles move
        this.dropRate = 0.003 // how often the particles move to a random place
        this.dropRateBump = 0.01 // drop rate increase relative to individual particle speed

        this.drawProgram = createProgram(gl, drawVert, drawFrag)
        this.screenProgram = createProgram(gl, quadVert, screenFrag)
        this.updateProgram = createProgram(gl, quadVert, updateFrag)

        this.quadBuffer = createBuffer(
            gl,
            new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1])
        )
        this.framebuffer = gl.createFramebuffer()

        this.setColorRamp(defaultRampColors)
        this.resize()
    }

    const prototypeAccessors = { numParticles: {} }

    WindGL.prototype.resize = function resize() {
        const gl = this.gl
        const emptyPixels = new Uint8Array(
            gl.canvas.width * gl.canvas.height * 4
        )
        // screen textures to hold the drawn screen for the previous and the current frame
        this.backgroundTexture = createTexture(
            gl,
            gl.NEAREST,
            emptyPixels,
            gl.canvas.width,
            gl.canvas.height
        )
        this.screenTexture = createTexture(
            gl,
            gl.NEAREST,
            emptyPixels,
            gl.canvas.width,
            gl.canvas.height
        )
    }

    WindGL.prototype.setColorRamp = function setColorRamp(colors) {
        // lookup texture for colorizing the particles according to their speed
        this.colorRampTexture = createTexture(
            this.gl,
            this.gl.LINEAR,
            getColorRamp(colors),
            16,
            16
        )
    }

    prototypeAccessors.numParticles.set = function (numParticles) {
        const gl = this.gl

        // we create a square texture where each pixel will hold a particle position encoded as RGBA
        const particleRes = (this.particleStateResolution = Math.ceil(
            Math.sqrt(numParticles)
        ))
        this._numParticles = particleRes * particleRes

        const particleState = new Uint8Array(this._numParticles * 4)
        for (let i = 0; i < particleState.length; i++) {
            particleState[i] = Math.floor(Math.random() * 256) // randomize the initial particle positions
        }
        // textures to hold the particle state for the current and the next frame
        this.particleStateTexture0 = createTexture(
            gl,
            gl.NEAREST,
            particleState,
            particleRes,
            particleRes
        )
        this.particleStateTexture1 = createTexture(
            gl,
            gl.NEAREST,
            particleState,
            particleRes,
            particleRes
        )

        const particleIndices = new Float32Array(this._numParticles)
        for (let i$1 = 0; i$1 < this._numParticles; i$1++) {
            particleIndices[i$1] = i$1
        }
        this.particleIndexBuffer = createBuffer(gl, particleIndices)
    }
    prototypeAccessors.numParticles.get = function () {
        return this._numParticles
    }

    WindGL.prototype.setWind = function setWind(windData) {
        this.windData = windData
        this.windTexture = createTexture(
            this.gl,
            this.gl.LINEAR,
            windData.image
        )
        // this.windTexture = createTexture(this.gl, this.gl.LINEAR, windData.data,windData.width,windData.height);
    }

    // WindGL.prototype.draw = function draw() {
    WindGL.prototype.draw = function draw(fade) {
        this.fadeOpacity = fade
        const gl = this.gl
        gl.disable(gl.DEPTH_TEST)
        gl.disable(gl.STENCIL_TEST)

        bindTexture(gl, this.windTexture, 0)
        bindTexture(gl, this.particleStateTexture0, 1)

        this.drawScreen()
        this.updateParticles()
    }

    WindGL.prototype.drawScreen = function drawScreen() {
        const gl = this.gl
        // draw the screen into a temporary framebuffer to retain it as the background on the next frame
        bindFramebuffer(gl, this.framebuffer, this.screenTexture)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        this.drawTexture(this.backgroundTexture, this.fadeOpacity)
        this.drawParticles()

        bindFramebuffer(gl, null)
        // enable blending to support drawing on top of an existing background (e.g. a map)
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        this.drawTexture(this.screenTexture, 1.0)
        gl.disable(gl.BLEND)

        // save the current screen as the background for the next frame
        const temp = this.backgroundTexture
        this.backgroundTexture = this.screenTexture
        this.screenTexture = temp
    }

    WindGL.prototype.drawTexture = function drawTexture(texture, opacity) {
        const gl = this.gl
        const program = this.screenProgram
        gl.useProgram(program.program)

        bindAttribute(gl, this.quadBuffer, program.a_pos, 2)
        bindTexture(gl, texture, 2)
        gl.uniform1i(program.u_screen, 2)
        gl.uniform1f(program.u_opacity, opacity)

        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    WindGL.prototype.drawParticles = function drawParticles() {
        const gl = this.gl
        const program = this.drawProgram
        gl.useProgram(program.program)

        bindAttribute(gl, this.particleIndexBuffer, program.a_index, 1)
        bindTexture(gl, this.colorRampTexture, 2)

        gl.uniform1i(program.u_wind, 0)
        gl.uniform1i(program.u_particles, 1)
        gl.uniform1i(program.u_color_ramp, 2)

        gl.uniform1f(program.u_particles_res, this.particleStateResolution)
        gl.uniform2f(
            program.u_wind_min,
            this.windData.varMin,
            this.windData.varMin
        )
        gl.uniform2f(
            program.u_wind_max,
            this.windData.varMax,
            this.windData.varMax
        )

        gl.drawArrays(gl.POINTS, 0, this._numParticles)
    }

    WindGL.prototype.updateParticles = function updateParticles() {
        const gl = this.gl
        bindFramebuffer(gl, this.framebuffer, this.particleStateTexture1)
        gl.viewport(
            0,
            0,
            this.particleStateResolution,
            this.particleStateResolution
        )

        const program = this.updateProgram
        gl.useProgram(program.program)

        bindAttribute(gl, this.quadBuffer, program.a_pos, 2)

        gl.uniform1i(program.u_wind, 0)
        gl.uniform1i(program.u_particles, 1)

        gl.uniform1f(program.u_rand_seed, Math.random())
        gl.uniform2f(
            program.u_wind_res,
            this.windData.width,
            this.windData.height
        )
        gl.uniform2f(
            program.u_wind_min,
            this.windData.varMin,
            this.windData.varMin
        )
        gl.uniform2f(
            program.u_wind_max,
            this.windData.varMax,
            this.windData.varMax
        )
        gl.uniform1f(program.u_speed_factor, this.speedFactor)
        gl.uniform1f(program.u_drop_rate, this.dropRate)
        gl.uniform1f(program.u_drop_rate_bump, this.dropRateBump)

        gl.drawArrays(gl.TRIANGLES, 0, 6)

        // swap the particle state textures so the new one becomes the current one
        const temp = this.particleStateTexture0
        this.particleStateTexture0 = this.particleStateTexture1
        this.particleStateTexture1 = temp
    }

    Object.defineProperties(WindGL.prototype, prototypeAccessors)

    function getColorRamp(colors) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        canvas.width = 256
        canvas.height = 1

        const gradient = ctx.createLinearGradient(0, 0, 256, 0)
        for (const stop in colors) {
            gradient.addColorStop(+stop, colors[stop])
        }

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 256, 1)

        return new Uint8Array(ctx.getImageData(0, 0, 256, 1).data)
    }

    return WindGL
    // })
}

export function frame() {
    const fade = 0.98
    if (this.wind.windData) {
        this.wind.draw(fade)
    }
    this.reqAnimID = requestAnimationFrame(this.frame)
}

export function drawCurrents() {
    const left = this.imgFilledGlobal.width * (this.$store.state.map.bnds._sw.lng - this.$store.state.map.selected.imgBnds.minLon) / (this.$store.state.map.selected.imgBnds.maxLon - this.$store.state.map.selected.imgBnds.minLon)
    const right = this.imgFilledGlobal.width * (this.$store.state.map.bnds._ne.lng - this.$store.state.map.selected.imgBnds.minLon) / (this.$store.state.map.selected.imgBnds.maxLon - this.$store.state.map.selected.imgBnds.minLon)
    const top = this.imgFilledGlobal.height * (lat2y(this.$store.state.map.selected.imgBnds.maxLat) - lat2y(this.$store.state.map.bnds._ne.lat)) / (lat2y(this.$store.state.map.selected.imgBnds.maxLat) - lat2y(this.$store.state.map.selected.imgBnds.minLat))
    const bottom = this.imgFilledGlobal.height * (lat2y(this.$store.state.map.selected.imgBnds.maxLat) - lat2y(this.$store.state.map.bnds._sw.lat)) / (lat2y(this.$store.state.map.selected.imgBnds.maxLat) - lat2y(this.$store.state.map.selected.imgBnds.minLat))

    const imgWidth = right - left
    const imgHeight = bottom - top

    // --- A canvas to store the cropped image for the current viewport (2d)
    const cnvTmp = document.createElement('canvas')
    cnvTmp.width = window.innerWidth
    cnvTmp.height = window.innerHeight
    const ctxTmp = cnvTmp.getContext('2d')


    // --- To prepare for redrawing
    cancelAnimationFrame(this.reqAnimID)
    ctxTmp.clearRect(0, 0, imgWidth, imgHeight)

    const imgCropped = new Image()
    imgCropped.src = cnvTmp.toDataURL()
    const windData = {
        width: imgWidth,
        height: imgHeight,
        varMin: this.$store.state.map.selected.minOrg,
        varMax: this.$store.state.map.selected.maxOrg,
        image: imgCropped,
    }

    // --- Draw/Redraw
    ctxTmp.drawImage(this.imgFilledGlobal.img, left, top, imgWidth, imgHeight, 0, 0, window.innerWidth, window.innerHeight);
    // this.ctx2GJ(ctxTmp, imgWidth, imgHeight, this.$store.state.map.bnds);
    imgCropped.src = cnvTmp.toDataURL()

    this.wind.numParticles = 40000
    windData.image = imgCropped

    setTimeout(() => {
        this.wind.setWind(windData)
        this.frame()
    }, 1)


    try {
        this.map.addSource('currents', {
            type: 'canvas',
            canvas: this.cnvCurrents,
            coordinates: [
                [
                    this.$store.state.map.bnds._sw.lng,
                    this.$store.state.map.bnds._ne.lat,
                ],
                [
                    this.$store.state.map.bnds._ne.lng,
                    this.$store.state.map.bnds._ne.lat,
                ],
                [
                    this.$store.state.map.bnds._ne.lng,
                    this.$store.state.map.bnds._sw.lat,
                ],
                [
                    this.$store.state.map.bnds._sw.lng,
                    this.$store.state.map.bnds._sw.lat,
                ],
            ],
            // --- Set to true if the canvas source is animated. If the canvas is static, animate should be set to false to improve performance.
            animate: true,
        })

        this.map.addLayer(
            {
                id: 'currents',
                type: 'raster',
                source: 'currents',
                paint: { 'raster-fade-duration': 0 }
            },
            // 'country-boundaries'
        )
        this.sortLayers()

    } catch (error) {
        this.$store.commit('map/setBounds', this.map.getBounds())
        this.map.getSource('currents').setCoordinates(
            [
                [
                    this.$store.state.map.bnds._sw.lng,
                    this.$store.state.map.bnds._ne.lat,
                ],
                [
                    this.$store.state.map.bnds._ne.lng,
                    this.$store.state.map.bnds._ne.lat,
                ],
                [
                    this.$store.state.map.bnds._ne.lng,
                    this.$store.state.map.bnds._sw.lat,
                ],
                [
                    this.$store.state.map.bnds._sw.lng,
                    this.$store.state.map.bnds._sw.lat,
                ],
            ]
        )
    }
}

async function downloadImageCurrents(data) {
    const results = await axios({
        method: 'post',
        url: `${process.env.tuvaq2Url}/downloadImageCurrents`,
        data, // --- instead of data: data
    })

    return await results
}

function lat2y(lat) {
    const R = 6378137;
    return (R * Math.log(Math.sin(Math.PI / 4 + lat * Math.PI / 180 / 2) / Math.cos(Math.PI / 4 + lat * Math.PI / 180 / 2)));
}


export function ctx2GJ(ctx, width, height, bnds) {
    const array = ctx.getImageData(0, 0, width, height).data
    const normalArray = Array.prototype.slice.call(array);
    const array2D = []
    while (normalArray.length) array2D.push(normalArray.splice(0, 4));


    const features = []
    let lon, lat, u, v, speed, direction

    array2D.map((point, i) => {
        lon = bnds._sw.lng + (bnds._ne.lng - bnds._sw.lng) * (i % Math.floor(width)) / width
        lat = bnds._sw.lat + (bnds._ne.lat - bnds._sw.lat) * Math.floor(i / Math.floor(width)) / height
        u = 3 * (point[0] - 127) / 127
        v = 3 * (point[1] - 127) / 127
        speed = Math.sqrt(u ** 2 + v ** 2)
        direction = Math.atan2(v, u)

        features.push(
            {
                "type": "Feature",
                "geometry": { "type": "Point", "coordinates": [lon, lat] },
                "properties": { speed, direction }
            },
        )
        return null
    })

    const geojson = {
        "type": "FeatureCollection",
        features
    }

    this.map.addSource('currentsStatic2', {
        'type': 'geojson',
        'data': geojson
    })

    this.map.addLayer({
        'id': 'currentsStatic2',
        'type': 'symbol',
        'source': 'currentsStatic2',
        'layout': {
            'icon-image': 'arrow', // reference the image
            'icon-size': 10
        }
    })
    this.sortLayers()
}