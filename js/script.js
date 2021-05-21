// ページの読み込みを待つ
window.addEventListener('load', init);

function init() {
    // サイズを指定
    const width = 1440;
    const height = 671;

    // レンダラーを作成
    const canvasElement = document.querySelector('#myCanvas')
    const renderer = new THREE.WebGLRenderer({
        canvas: canvasElement,
    });
    renderer.setSize(width, height);

    // シーンを作成
    const scene = new THREE.Scene();

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(45, width / height);
    // カメラの初期座標を設定
    camera.position.set(0, 0, 1000);

    // カメラコントローラーを作成
    const controls = new THREE.OrbitControls(camera, canvasElement);

    // 形状とマテリアルからメッシュを作成します
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(300, 300, 300), new THREE.MeshNormalMaterial());
    scene.add(mesh);

    tick();

    // 毎フレーム時に実行されるループイベントです
    function tick() {
        // レンダリング
        box.rotation.y += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}