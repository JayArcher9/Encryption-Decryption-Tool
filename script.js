let aesKey, aesIV;

function generateAESKey() {
    return crypto.getRandomValues(new Uint8Array(16));
}

function generateAESIV() {
    return crypto.getRandomValues(new Uint8Array(16));
}

function saveAESKeyAndIV() {
    localStorage.setItem('aesKey', JSON.stringify(Array.from(aesKey)));
    localStorage.setItem('aesIV', JSON.stringify(Array.from(aesIV)));
}

function loadAESKeyAndIV() {
    const storedKey = localStorage.getItem('aesKey');
    const storedIV = localStorage.getItem('aesIV');
    if (storedKey && storedIV) {
        aesKey = new Uint8Array(JSON.parse(storedKey));
        aesIV = new Uint8Array(JSON.parse(storedIV));
    } else {
        aesKey = generateAESKey();
        aesIV = generateAESIV();
        saveAESKeyAndIV();
    }
}

function aesEncrypt(plaintext) {
    try {
        if (!aesKey || !aesIV) {
            loadAESKeyAndIV();
        }

        const key = CryptoJS.lib.WordArray.create(aesKey);
        const iv = CryptoJS.lib.WordArray.create(aesIV);
        const encrypted = CryptoJS.AES.encrypt(plaintext, key, { iv: iv, mode: CryptoJS.mode.CFB });
        return encrypted.toString();
    } catch (error) {
        throw new Error(error.message);
    }
}

function aesDecrypt(ciphertext) {
    try {
        if (!aesKey || !aesIV) {
            loadAESKeyAndIV();
        }

        const key = CryptoJS.lib.WordArray.create(aesKey);
        const iv = CryptoJS.lib.WordArray.create(aesIV);
        const decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv, mode: CryptoJS.mode.CFB });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        throw new Error(error.message);
    }
}

let rsaKeypair = loadRSAKeypair() || forge.pki.rsa.generateKeyPair(2048);

function saveRSAKeypair() {
    localStorage.setItem('rsaPublicKey', forge.pki.publicKeyToPem(rsaKeypair.publicKey));
    localStorage.setItem('rsaPrivateKey', forge.pki.privateKeyToPem(rsaKeypair.privateKey));
}

function loadRSAKeypair() {
    const publicKeyPem = localStorage.getItem('rsaPublicKey');
    const privateKeyPem = localStorage.getItem('rsaPrivateKey');
    if (publicKeyPem && privateKeyPem) {
        return {
            publicKey: forge.pki.publicKeyFromPem(publicKeyPem),
            privateKey: forge.pki.privateKeyFromPem(privateKeyPem)
        };
    }
    return null;
}

function rsaEncrypt(plaintext) {
    try {
        const ciphertext = rsaKeypair.publicKey.encrypt(plaintext, 'RSA-OAEP', {
            md: forge.md.sha256.create(),
            mgf1: forge.mgf.mgf1.create(forge.md.sha256.create())
        });
        return forge.util.encode64(ciphertext);
    } catch (error) {
        throw new Error(error.message);
    }
}

function rsaDecrypt(ciphertext) {
    try {
        const decodedCiphertext = forge.util.decode64(ciphertext);
        const decrypted = rsaKeypair.privateKey.decrypt(decodedCiphertext, 'RSA-OAEP', {
            md: forge.md.sha256.create(),
            mgf1: forge.mgf.mgf1.create(forge.md.sha256.create())
        });
        return decrypted;
    } catch (error) {
        throw new Error(error.message);
    }
}

function vigenere(message, key, direction) {
    let keyIndex = 0;
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let finalMessage = '';

    for (let i = 0; i < message.length; i++) {
        const char = message[i].toLowerCase();

        if (!char.match(/[a-z]/)) {
            finalMessage += char;
        } else {
            const keyChar = key[keyIndex % key.length];
            keyIndex++;

            const offset = alphabet.indexOf(keyChar);
            const index = alphabet.indexOf(char);
            const newIndex = (index + offset * direction + alphabet.length) % alphabet.length;
            finalMessage += alphabet[newIndex];
        }
    }

    return finalMessage;
}

function processText(action) {
    const inputText = document.getElementById('input-text').value;
    const algorithm = document.getElementById('algorithm').value;
    let result = '';

    try {
        switch (algorithm) {
            case 'aes':
                if (action === 'encrypt') {
                    result = aesEncrypt(inputText);
                } else {
                    result = aesDecrypt(inputText);
                }
                break;
            case 'rsa':
                if (action === 'encrypt') {
                    result = rsaEncrypt(inputText);
                } else {
                    result = rsaDecrypt(inputText);
                }
                break;
            case 'vigenere':
                const key = document.getElementById('key').value.toLowerCase().replace(/[^a-z]/g, '');
                if (action === 'encrypt') {
                    result = vigenere(inputText, key, 1);
                } else {
                    result = vigenere(inputText, key, -1);
                }
                break;
        }
        document.getElementById('output').value = result;
    } catch (error) {
        document.getElementById('output').value = 'Error: ' + error.message;
    }
}

function copyResult() {
    const outputText = document.getElementById('output');
    outputText.select();
    outputText.setSelectionRange(0, 99999); 
    navigator.clipboard.writeText(outputText.value)
        .then(() => alert('Result copied to clipboard!'))
        .catch(() => alert('Failed to copy result to clipboard.'));
}

function clearResult() {
    document.getElementById('output').value = '';
}

function copyKeys() {
    const keys = {
        aesKey: Array.from(aesKey),
        aesIV: Array.from(aesIV),
        rsaPublicKey: forge.pki.publicKeyToPem(rsaKeypair.publicKey),
        rsaPrivateKey: forge.pki.privateKeyToPem(rsaKeypair.privateKey)
    };
    navigator.clipboard.writeText(JSON.stringify(keys))
        .then(() => alert('Keys copied to clipboard!'))
        .catch(() => alert('Failed to copy keys to clipboard.'));
}

function uploadKeys() {
    const keysInput = document.getElementById('key').value;
    try {
        const keys = JSON.parse(keysInput);
        aesKey = new Uint8Array(keys.aesKey);
        aesIV = new Uint8Array(keys.aesIV);
        rsaKeypair = {
            publicKey: forge.pki.publicKeyFromPem(keys.rsaPublicKey),
            privateKey: forge.pki.privateKeyFromPem(keys.rsaPrivateKey)
        };
        saveAESKeyAndIV();
        saveRSAKeypair();
        alert('Keys successfully uploaded!');
    } catch (error) {
        alert('Failed to upload keys. Make sure the format is correct.');
    }
}

window.addEventListener('load', () => {
    loadAESKeyAndIV();
    rsaKeypair = loadRSAKeypair() || forge.pki.rsa.generateKeyPair(2048);
    const algorithm = document.getElementById('algorithm').value;
    const keySection = document.getElementById('key-section');
    
    if (algorithm === 'vigenere' && keySection.style.display !== 'block') {
        keySection.style.display = 'block';
    }
});


function updateKeyTextarea() {
    const algorithm = document.getElementById('algorithm').value;
    const showKeysCheckbox = document.getElementById('show-keys-checkbox');
    const keyTextarea = document.getElementById('key');
    
    switch (algorithm) {
        case 'aes':
            loadAESKeyAndIV();
            keyTextarea.value = showKeysCheckbox.checked ? `AES Key: ${Array.from(aesKey).join(', ')}\nAES IV: ${Array.from(aesIV).join(', ')}` : '';
            keyTextarea.placeholder = showKeysCheckbox.checked ? "AES Key and IV are displayed. Uncheck 'Show Keys' to hide." : "To view keys, click 'Show Keys' checkbox";
            break;
        case 'rsa':
            rsaKeypair = loadRSAKeypair() || forge.pki.rsa.generateKeyPair(2048);
            saveRSAKeypair();
            keyTextarea.value = showKeysCheckbox.checked ? `RSA Public Key:\n${forge.pki.publicKeyToPem(rsaKeypair.publicKey)}\n\nRSA Private Key:\n${forge.pki.privateKeyToPem(rsaKeypair.privateKey)}` : '';
            keyTextarea.placeholder = showKeysCheckbox.checked ? "RSA Public and Private Keys are displayed. Uncheck 'Show Keys' to hide." : "To view keys, click 'Show Keys' checkbox";
            break;
        case 'vigenere':
            keyTextarea.value = '';
            keyTextarea.placeholder = 'Enter Vigenère Key Manually';
            showKeysCheckbox.checked = false;
            break;
    }
    
    // Disable the checkbox for Vigenère algorithm
    showKeysCheckbox.disabled = algorithm === 'vigenere';
}

window.addEventListener('load', updateKeyTextarea);
document.getElementById('algorithm').addEventListener('change', updateKeyTextarea);
document.getElementById('show-keys-checkbox').addEventListener('change', updateKeyTextarea);


document.getElementById('algorithm').addEventListener('change', function() {
    const keySection = document.getElementById('key-section');
    if (this.value === 'vigenere' || this.value === 'aes' || this.value === 'rsa') {
        keySection.style.display = 'block';
    } else {
        keySection.style.display = 'none';
    }
});

document.getElementById('copy-keys-button').addEventListener('click', copyKeys);
document.getElementById('upload-keys-button').addEventListener('click', uploadKeys);