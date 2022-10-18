import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
// import * as dat from 'lil-gui'
import gsap from 'gsap'
// import { ARButton } from "three/examples/jsm/webxr/ARButton.js"

/**
 * Base
 */
let Heading = document.getElementById('info')
let AirLogo = document.getElementById('air-logo')
let AirDetails = document.getElementById('details')
let End = document.getElementById('ending')

// cursor animation
var cursor = document.querySelector(".cursor")
var cursorScale = document.querySelectorAll(".cursor-scale")
var mouseX = 0
var mouseY = 0


gsap.to({}, 0.016, {
  repeat: -1,


  onRepeat: () => {
    gsap.set(cursor, {
      css: {
        left: mouseX,
        top: mouseY
      }
    })
  }
})

window.addEventListener("mousemove", (event) => {
  mouseX = event.clientX
  mouseY = event.clientY
})


cursorScale.forEach(link => {
  link.addEventListener("mouseleave", () => {
    cursor.classList.remove('grow')
    cursor.classList.remove("grow-small")
  })
  link.addEventListener("mousemove", () => {
    cursor.classList.add('grow')
    if (link.classList.contains('small')) {
      cursor.classList.remove("grow")
      cursor.classList.add("grow-small")
    }
  })


});


// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//LoadingManger
const progressBar = document.getElementById('progress-bar')
const progressBarContainer = document.querySelector('.progress-bar-container')



const loadingManager = new THREE.LoadingManager()


loadingManager.onProgress = (url, loaded, total) => {
  progressBar.value = (loaded / total) * 100
}



loadingManager.onLoad = () => {
  progressBarContainer.style.display = 'none'
}

//  GLTFLoader
const gltfloader = new GLTFLoader(loadingManager)

let position = 0

gltfloader.load(
  './scene.gltf',
  (gltf) => {
    scene.add(gltf.scene)
    gltf.scene.position.x = -1.3
    gltf.scene.position.y = -0.2

    // for scale
    gltf.scene.traverse(o => {
      if (o instanceof THREE.Mesh) {
        // o.material.evMapInstensity = debugObject.envMapIntensity
        // o.material.needUpdate = true
        o.scale.set(0.1, 0.1, 0.1)



      }
      // if(o instanceof THREE.MeshStandardMaterial){

      //   // o.map = BaseTexture,
      //   // o.normalMap = NormalTexture
      //   // o.roughnessMap = rougnessTexture
      //   // o.alphaMap = false
      // }
    })
    // 
    //    gsap animation
    Heading.innerHTML = '<p>click on page to to get info</p>'
    window.addEventListener("mouseup", () => {
      switch (position) {
        case 0:
          movecamera(-3.4, 0.8, -1)
          rotatecamera(3, 1, 0.3)
          position = 1
          Heading.innerHTML = '<p>click on page to to get info</p>'
          AirLogo.innerHTML = '<h2>Air Jordan</h2>'
          AirDetails.innerHTML = '<p>The Jumpman logo is owned by Nike to promote the Air Jordan brand of basketball sneakers and other sportswear. It is the silhouette of former Chicago Bulls NBA player and current Charlotte Hornets owner Michael Jordan.</p>'
          break;
        case 1:
          movecamera(2.3, 0.2, -1.2)
          rotatecamera(0, 1, 0)
          position = 2
          Heading.innerHTML = '<p>click on page to to get info</p>'
          AirLogo.innerHTML = ' <h2>NIKE</h2>';
          AirDetails.innerHTML = '<p>According to Carolyn Davidson, the image represents the wing of the Greek goddess Nike – the deity of victory. Nike was thought to deliver strength to warriors on the battlefield.</p>'
          break;
        case 2:
          movecamera(-2.7, 1.2, 5)
          rotatecamera(0, 0.9, 0.2)
          position = 3
          Heading.innerHTML = '<p>click and drag to get 360(deg) view. </br> Scroll for Zoom in and out</p>'
          AirLogo.innerHTML = ' <h2>NIKE Air Jordan</h2>';
          AirDetails.innerHTML = '<p>The Air Jordan 1 High debuted in 1985 as the first signature sneaker developed by Nike for Michael Jordan.</p>'
          End.innerHTML = '<h2>-THE END-</h2>'
          break;
        default:
          break;
      }


    })
    function movecamera(x, y, z) {

      gsap.to(camera.position, {
        x,
        y,
        z,
        duration: 3,
        zoom: 2
      })

    }
    function rotatecamera(x, y, z) {
      gsap.to(camera.rotation, {
        x,
        y,
        z,
        duration: 3,
      })
    }

  }

)


/**
 * Floor
 */
// const floor = new THREE.Mesh(
//   new THREE.PlaneGeometry(10, 10),
//   new THREE.MeshStandardMaterial({
//     color: '#444444',
//     metalness: 0,
//     roughness: 0.5
//   })
// )
// floor.receiveShadow = true
// floor.rotation.x = - Math.PI * 0.5
// scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
directionalLight.shadow.normalBias = 0.5
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.movementSpeed = 8
controls.lookSpeed = 0.08
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true

})
renderer.xr.enabled = true
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// ARButton
// const button = ARButton.createButton(renderer)
// document.body.appendChild(button)

// const button = ARButton.createButton(renderer)
// document.appendChild(button)

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()