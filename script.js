let aesKey, aesIV;

function generateAESKey() {
    return crypto.getRandomValues(new Uint8Array(16));
}

function generateAESIV() {
    return crypto.getRandomValues(new Uint8Array(16));
}

function aesEncrypt(plaintext) {
    try {
        if (!aesKey || !aesIV) {
            aesKey = generateAESKey();
            aesIV = generateAESIV();
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
            throw new Error('AES key and IV not generated');
        }

        const key = CryptoJS.lib.WordArray.create(aesKey);
        const iv = CryptoJS.lib.WordArray.create(aesIV);
        const decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv, mode: CryptoJS.mode.CFB });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        throw new Error(error.message);
    }
}

let rsaKeypair = forge.pki.rsa.generateKeyPair(2048);

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

window.addEventListener('load', () => {
    aesKey = generateAESKey();
    aesIV = generateAESIV();
});

document.getElementById('algorithm').addEventListener('change', function() {
    const keySection = document.getElementById('key-section');
    if (this.value === 'vigenere') {
        keySection.style.display = 'block';
    } else {
        keySection.style.display = 'none';
    }
});
