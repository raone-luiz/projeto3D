    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    const cena = new THREE.Scene();

    // 🎵 Áudios
    const musicaFundo = document.getElementById('musicaFundo');
    const efeitoTrocarPersonagem = document.getElementById('efeitoTrocarPersonagem');
    const efeitoTrocarCena = document.getElementById('efeitoTrocarCena');

    musicaFundo.volume = 0.3;
    musicaFundo.loop = true;
    musicaFundo.play().catch(() => {
    console.warn('Autoplay bloqueado. Usuário precisa interagir com a página primeiro.');
    });

    const carregadorTextura = new THREE.TextureLoader();
    const fundos = [
    'portifo3Dimagens/escolhido 1.jpg',
    'portifo3Dimagens/cenario 13.jpg',
    'portifo3Dimagens/HDRIfloresta2.jpg',
    'portifo3Dimagens/HDRIfloresta4.jpg',
    'portifo3Dimagens/cenario 12.jpg',
    'portifo3Dimagens/cenario 11.jpg',
    'portifo3Dimagens/cenario 10.jpg',
    'portifo3Dimagens/cenario 9.jpg',
    'portifo3Dimagens/cenario 5.png',
    'portifo3Dimagens/cenario 4.jpg',
    'portifo3Dimagens/cenaplanetatexte 0.jpg',
    ];
    let indiceCena = 0;

    function carregarFundo(caminho) {
    carregadorTextura.load(caminho, (textura) => {
        textura.mapping = THREE.EquirectangularReflectionMapping;
        textura.encoding = THREE.sRGBEncoding;
        cena.background = textura;
    });
    }
    carregarFundo(fundos[indiceCena]);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.5, 4);

    const renderizador = new THREE.WebGLRenderer({ antialias: true });
    renderizador.setPixelRatio(window.devicePixelRatio);
    renderizador.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderizador.domElement);

    const luzAmbiente = new THREE.HemisphereLight(0xffffff, 0x999999, 1.2);
    cena.add(luzAmbiente);

    const luzDirecional = new THREE.DirectionalLight(0xffffff, 1);
    luzDirecional.position.set(5, 10, 7.5);
    cena.add(luzDirecional);

    const controles = new OrbitControls(camera, renderizador.domElement);
    controles.enableDamping = true;
    controles.dampingFactor = 0.05;

    const modelos = [
    {
        caminho: 'portifo3Dimagens/base_basic_shaded.glb',
        escala: [1.5, 1.5, 1.5],
        posicao: [0, -1.3, 0],
        rotacao: [0, 0, 0]
    },
    {
        caminho: 'portifo3Dimagens/Rocket_Rider_Warrior_0617221341_texture.glb',
        escala: [1.5, 1.5, 1.5],
        posicao: [0, -0.1, 0],
        rotacao: [0, 0, 0]
    },
    {
        caminho: 'portifo3Dimagens/Águiadourada3D.glb',
        escala: [1.5, 1.9, 1.5],
        posicao: [0, -1.6, 0],
        rotacao: [0, 0, 0]
    },
    {
        caminho: 'portifo3Dimagens/india3D.glb',
        escala: [1.9, 1.9, 1.9],
        posicao: [0, -2.1, 0],
        rotacao: [0, 0, 0]
    },
    {
        caminho: 'portifo3Dimagens/Soim1.glb',
        escala: [1.2, 1.2, 1.2],
        posicao: [0, -1.3, 0],
        rotacao: [0, 0, 0]
    },
    {
        caminho: 'portifo3Dimagens/zebra13D.glb',
        escala: [2.2, 2.2, 2.2],
        posicao: [0, -1.9, 0],
        rotacao: [0, 0, 0]
    },
    {
        caminho: 'portifo3Dimagens/Arara3D.glb',
        escala: [2.2, 2.2, 2.2],
        posicao: [0, -2.6, 0],
        rotacao: [0, 0, 0]
    },
    {
        caminho: 'portifo3Dimagens/base_basic_shaded (6).glb',
        escala: [1.6, 1.6, 1.6],
        posicao: [0, -2.0, 0],
        rotacao: [0, 0, 0]
    },
    {
        caminho: 'portifo3Dimagens/base_basic_shaded (7).glb',
        escala: [1.6, 1.6, 1.6],
        posicao: [0, -1.9, 0],
        rotacao: [0, 0, 0]
    }
    ];

    const carregador = new GLTFLoader();
    let indexAtual = 0;
    let personagemAtual;

    function carregarModelo(config) {
    if (personagemAtual) {
        cena.remove(personagemAtual);
    }

    carregador.load(config.caminho, (gltf) => {
        personagemAtual = gltf.scene;
        personagemAtual.scale.set(...config.escala);
        personagemAtual.position.set(...config.posicao);
        personagemAtual.rotation.set(...config.rotacao);
        cena.add(personagemAtual);
    }, undefined, (erro) => {
        console.error('Erro ao carregar modelo:', erro);
    });
    }

    document.getElementById('btnTrocar').addEventListener('click', () => {
    indexAtual = (indexAtual + 1) % modelos.length;
    carregarModelo(modelos[indexAtual]);
    efeitoTrocarPersonagem.currentTime = 0;
    efeitoTrocarPersonagem.play();
    });

    document.getElementById('btnCena').addEventListener('click', () => {
    indiceCena = (indiceCena + 1) % fundos.length;
    carregarFundo(fundos[indiceCena]);
    efeitoTrocarCena.currentTime = 0;
    efeitoTrocarCena.play();
    });

    carregarModelo(modelos[indexAtual]);

    function animar() {
    requestAnimationFrame(animar);
    controles.update();
    renderizador.render(cena, camera);
    }
    animar();

    window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderizador.setSize(window.innerWidth, window.innerHeight);
    });

    // Efeito flutuante no título
    document.querySelectorAll('#tituloWave span').forEach((letra, i) => {
    letra.style.setProperty('--i', i);
    });