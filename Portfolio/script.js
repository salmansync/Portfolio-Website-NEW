const scriptURL = 'https://script.google.com/macros/s/AKfycbyk0vGAIyRs4-OWLAlOPgzgkad2Hjlk6xciYUR4p0aaArPoqFsWuSNbGtymu2mYGgQ/exec';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

function buildStarTexture(color1 = '#ffffff', color2 = 'rgba(0,0,0,0)') {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, color1);
    grad.addColorStop(0.2, 'rgba(255,255,255,0.85)');
    grad.addColorStop(0.4, 'rgba(255,100,100,0.4)');
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
}

const starTex = buildStarTexture('#ffffff');

function createStars(total, spreadFactor = 10, sizeRange = [0.02, 0.1]) {
    const positions = new Float32Array(total * 3);
    const sizes = new Float32Array(total);
    const colors = new Float32Array(total * 3);

    for (let i = 0; i < total; i++) {
        const i3 = i * 3;
        const r = Math.random() * spreadFactor;
        const theta = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 1.0;

        positions[i3] = Math.cos(theta) * r * (0.6 + Math.random() * 0.6);
        positions[i3 + 1] = y;
        positions[i3 + 2] = Math.sin(theta) * r * (0.6 + Math.random() * 0.6);

        const t = Math.random();
        if (t < 0.7) {
            const grey = 0.5 + Math.random() * 0.5;
            colors[i3] = grey;
            colors[i3 + 1] = grey;
            colors[i3 + 2] = grey;
        } else if (t < 0.95) {
            colors[i3] = 1;
            colors[i3 + 1] = 1;
            colors[i3 + 2] = 1;
        } else {
            colors[i3] = 1;
            colors[i3 + 1] = Math.random() * 0.5;
            colors[i3 + 2] = Math.random() * 0.3;
        }
        sizes[i] = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 0.03,
        map: starTex,
        alphaTest: 0.5,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const points = new THREE.Points(g, material);
    points.rotation.y = Math.random() * Math.PI * 2;
    return points;
}

const stars1 = createStars(1500, 10, [0.03, 0.08]);
const stars2 = createStars(1000, 7, [0.05, 0.12]);
const stars3 = createStars(500, 5, [0.08, 0.15]);
stars2.rotation.y += Math.PI / 4;
stars3.rotation.y -= Math.PI / 4;

scene.add(stars1);
scene.add(stars2);
scene.add(stars3);

const scrollSpeed = 0.00005;
const animate = () => {
    requestAnimationFrame(animate);

    stars1.rotation.y += scrollSpeed * 0.5;
    stars2.rotation.y += scrollSpeed * 1.5;
    stars3.rotation.y += scrollSpeed * 2.5;

    renderer.render(scene, camera);
};

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


const sidemenu = document.getElementById("sidemenu");
const openMenuIcon = document.getElementById("openMenuIcon");
const tablinks = document.getElementsByClassName("tab-links");
const tabcontents = document.getElementsByClassName("tab-contents");


function openmenu() {
    sidemenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (openMenuIcon) {
        openMenuIcon.style.display = 'none';
    }
}

function closemenu() {
    sidemenu.classList.remove('open');
    document.body.style.overflow = '';
    if (openMenuIcon) {
        openMenuIcon.style.display = 'block';
    }
}

function opentab(tabname, event) {
    for (const tablink of tablinks) {
        tablink.classList.remove("active-link");
    }
    for (const tabcontent of tabcontents) {
        tabcontent.classList.remove("active-tab");
    }

    const clickedElement = event.currentTarget;
    if (clickedElement) {
        clickedElement.classList.add("active-link");
    }

    document.getElementById(tabname).classList.add("active-tab");
}


const form = document.forms['submit-to-google-sheet'];
const msg = document.getElementById("msg");

form.addEventListener('submit', e => {
    e.preventDefault();
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(response => {
        msg.innerHTML = "Message Sent Successfully! 🎉";
        setTimeout(function() {
            msg.innerHTML = "";
        }, 5000);
        form.reset();
    })
    .catch(error => {
        console.error('Error!', error.message);
        msg.innerHTML = "Error sending message. Please check the URL. ❌";
        setTimeout(function() {
            msg.innerHTML = "";
        }, 5000);
    });
});
