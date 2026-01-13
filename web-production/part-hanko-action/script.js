function stamp(element) {
    const mark = element.querySelector('.hanko-mark');
    const btnText = element.querySelector('.btn-text');

    if (!mark.classList.contains('stamped')) {
        // 捺印音（視覚的な振動で表現しても良い）
        // 押す
        mark.classList.add('stamped');
        btnText.style.display = 'none'; // Click文字を消す

        // 承認エリア自体のクリックを無効化
        element.style.cursor = 'default';
        element.onclick = null;
    }
}
